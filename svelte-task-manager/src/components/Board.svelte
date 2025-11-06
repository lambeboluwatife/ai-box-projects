<script>
	import { tasks } from './../lib/stores/tasks.js';
	import Task from './Task.svelte';
	import { slide, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { droppable } from '$lib/dnd.js';

	let { title = '', filterType = 'all', onAddTask = () => {} } = $props();

	// filter tasks based on filterType
	let filteredTasks = $derived(
		filterType === 'pending'
			? $tasks.filter((t) => !t.completed)
			: filterType === 'completed'
				? $tasks.filter((t) => t.completed)
				: filterType === 'inProgress'
					? $tasks.filter((t) => t.progress)
					: $tasks
	);
</script>

<div
	class="column mb-4 rounded-2xl bg-gray-200 p-4 shadow-md transition-all hover:shadow-lg"
	in:slide={{ duration: 400, delay: 100 }}
	use:droppable={{
		type: 'task',
		data: { boardType: filterType },
		onDrop: (item) => {
			const task = $tasks.find((t) => t.id === item.id);
			if (!task) return;

			let updates = {};

			if (filterType === 'pending') {
				updates = {
					completed: false,
					progress: false
				};
			} else if (filterType === 'inProgress') {
				updates = {
					completed: false,
					progress: true
				};
			} else if (filterType === 'completed') {
				updates = {
					completed: true,
					completedAt: new Date().toISOString()
				};
			}

			if (
				(filterType === 'pending' && !task.completed && !task.progress) ||
				(filterType === 'inProgress' && task.progress && !task.completed) ||
				(filterType === 'completed' && task.completed)
			) {
				return;
			}

			tasks.updateTask(task.id, updates);
		}
	}}
>
	<div class="mb-4 flex w-full items-center justify-between">
		<div class="flex items-center gap-2">
			<h2 class="text-xl font-semibold text-black">{title}</h2>
			<span class="rounded-full bg-gray-300 px-2 py-1 text-xs font-semibold text-gray-700">
				{filteredTasks.length}
			</span>
		</div>
		<button class="cursor-pointer p-2 text-gray-700 hover:text-black" aria-label="board menu">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="30"
				height="30"
				viewBox="0 0 24 24"
				fill="none"
				aria-hidden="true"
				role="img"
			>
				<circle cx="6" cy="12" r="1.5" fill="currentColor" />
				<circle cx="12" cy="12" r="1.5" fill="currentColor" />
				<circle cx="18" cy="12" r="1.5" fill="currentColor" />
			</svg>
		</button>
	</div>

	<div class="flex w-full flex-col gap-2">
		{#each filteredTasks as task (task.id)}
			<div
				in:slide={{ duration: 300 }}
				out:slide={{ duration: 200 }}
				animate:flip={{ duration: 300 }}
			>
				<Task {task} />
			</div>
		{/each}

		{#if filterType === 'pending'}
			<button
				onclick={onAddTask}
				class="group flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-400 bg-white/50 p-4 text-gray-600 transition-all hover:border-purple-500 hover:bg-white hover:text-purple-600 hover:shadow-md"
				in:slide={{ duration: 300, delay: 200 }}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="transition-transform group-hover:scale-110"
				>
					<line x1="12" y1="5" x2="12" y2="19"></line>
					<line x1="5" y1="12" x2="19" y2="12"></line>
				</svg>
				<span class="font-semibold">Add Task</span>
			</button>
		{/if}
	</div>
</div>

<style>
	.column:global(.droppable) {
		background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(219, 39, 119, 0.1) 100%);
		border: 2px dashed #8b5cf6;
		border-radius: 1rem;
		box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
		transform: scale(1.02);
		transition: all 0.3s ease;
	}

	.column:global(.droppable) * {
		pointer-events: none;
	}
</style>
