import { writable, derived } from "svelte/store";

// constants
const STORAGE_KEY = "tasks";
const FILTERS = { ALL: "all", COMPLETED: "completed", PENDING: "pending" };

// function to generate unique IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

// Check if running in browser
const isBrowser = typeof window !== "undefined" && typeof localStorage !== "undefined";

// Load tasks from localStorage
const loadTasks = () => {
  if (!isBrowser) return []; 
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load tasks from localStorage:", error);
    return [];
  }
};

// Save tasks to localStorage
const saveTasks = (tasks) => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Failed to save tasks to localStorage:", error);
  }
};

// main tasks store
const tasksStore = () => {
  const { subscribe, set, update } = writable([]);

  if (isBrowser) {
    const initial = loadTasks();
    set(initial);
  }

  return {
    subscribe,

    // CRUD operations
    // add a new task
    addTask: (taskData) => {
      const newTask = { id: generateId(), progress: false, completed: false, ...taskData, createdAt: new Date().toISOString() };
      update((tasks) => {
        const updatedTasks = [newTask, ...tasks];
        saveTasks(updatedTasks);
        return updatedTasks;
      });
      return newTask;
    },

    // update an existing task
    updateTask: (id, updates) => {
      update((tasks) => {
        const updatedTasks = tasks.map((task) => (task.id === id ? { ...task, ...updates } : task));
        saveTasks(updatedTasks);
        return updatedTasks;
      });
    },

    // delete a task
    deleteTask: (id) => {
      update((tasks) => {
        const updatedTasks = tasks.filter((task) => task.id !== id);
        saveTasks(updatedTasks);
        return updatedTasks;
      });
    },

    // toggle task completion
    toggleTaskCompletion: (id) => {
      update((tasks) => {
        const updatedTasks = tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task));
        saveTasks(updatedTasks);
        return updatedTasks;
      });
    },

    // clear all tasks
    clearTasks: () => {
      set([]);
      saveTasks([]);
    },

    // set tasks directly
    setTasks: (newTasks) => {
      set(newTasks);
      saveTasks(newTasks);
    }
  };
};

// filter store
const filterStore = () => {
  const { subscribe, set } = writable(FILTERS.ALL);
  return {
    subscribe,
    setFilter: (filter) => set(filter)
  };
};

// exports
export const tasks = tasksStore();
export const filter = filterStore();

// derived store for filtered tasks
export const filteredTasks = derived([tasks, filter], ([$tasks, $filter]) => {
  const list = Array.isArray($tasks) ? $tasks : [];
  switch ($filter) {
    case FILTERS.COMPLETED:
      return list.filter((t) => t.completed);
    case FILTERS.PENDING:
      return list.filter((t) => !t.completed);
    case FILTERS.ALL:
    default:
      return list;
  }
});

// derived store for task statistics
export const taskStats = derived(tasks, ($tasks) => {
  const list = Array.isArray($tasks) ? $tasks : [];
  const total = list.length;
  const completed = list.filter((task) => task.completed).length;
  const pending = total - completed;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, pending, completionRate };
});

export { FILTERS };
