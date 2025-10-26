import { writable } from "svelte/store";

const initialUsers = [
  {
    id: 1,
    name: "Alice Baker",
    email: "alicebaker@hotmail.com",
    role: "admin",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "smithbobby@yahoomail.com",
    role: "engineer",
  },
  {
    id: 3,
    name: "Charlie Johnson",
    email: "charles1995@gmail.com",
    role: "designer",
  },
];

const getStoredUsers = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("users");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Error parsing stored users:", e);
        return initialUsers;
      }
    }
  }
  return initialUsers;
};

export const UsersStore = writable(getStoredUsers());

if (typeof window !== "undefined") {
  UsersStore.subscribe((users) => {
    localStorage.setItem("users", JSON.stringify(users));
  });
}

export const addUser = (newUser) => {
  UsersStore.update((currentUsers) => {
    return [...currentUsers, newUser];
  });
};

export const editUser = (updatedUser) => {
  UsersStore.update((currentUsers) => {
    return currentUsers.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );
  });
};

export const deleteUser = (id) => {
  UsersStore.update((currentUsers) => {
    return currentUsers.filter((user) => user.id !== id);
  });
};

export const resetUsers = () => {
  UsersStore.set(initialUsers);
};
