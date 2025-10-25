<script>
	import { tasks } from '../lib/stores/tasks.js';
	import { fade, scale } from 'svelte/transition';

	let { task } = $props();

	const handleToggle = (event) => {
		event?.stopPropagation?.();
		if (!task) return;

		let updates = {};

		if (!task.progress && !task.completed) {
			updates = {
				progress: true,
				completed: false,
				completedAt: null
			};
		} else if (task.progress && !task.completed) {
			updates = {
				progress: false,
				completed: true,
				completedAt: new Date().toISOString()
			};
		} else if (!task.progress && task.completed) {
			updates = {
				progress: false,
				completed: false,
				completedAt: null
			};
		}

		tasks.updateTask(task.id, updates);
	};
</script>

<button
	onclick={handleToggle}
	class="flex items-center justify-center rounded-full p-2 transition-all hover:scale-105"
	aria-label="Toggle task state"
	title={task.completed
		? 'Mark as Pending'
		: task.progress
			? 'Mark as Completed'
			: 'Start Progress'}
>
	{#if task.completed}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6 text-green-600"
			viewBox="0 0 24 24"
			fill="currentColor"
			transition:fade|scale={{ duration: 200 }}
		>
			<path
				fill-rule="evenodd"
				d="M10.28 15.72a.75.75 0 0 1-1.06 0l-3.22-3.22a.75.75 0 1 1 1.06-1.06L10 13.94l6.94-6.94a.75.75 0 0 1 1.06 1.06l-8 8z"
				clip-rule="evenodd"
			/>
		</svg>
	{:else if task.progress}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="animate-spin-slow h-6 w-6 text-yellow-500"
			viewBox="0 0 24 24"
			fill="currentColor"
			transition:fade|scale={{ duration: 200 }}
		>
			<path
				fill-rule="evenodd"
				d="M12 2a10 10 0 1 0 10 10h-2a8 8 0 1 1-8-8V2z"
				clip-rule="evenodd"
			/>
		</svg>
	{:else}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6 text-gray-400"
			viewBox="0 0 24 24"
			fill="currentColor"
			transition:fade|scale={{ duration: 200 }}
		>
			<path fill-rule="evenodd" d="M12 6a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8v2z" clip-rule="evenodd" />
		</svg>
	{/if}
</button>

<style>
	@keyframes spin-slow {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	.animate-spin-slow {
		animation: spin-slow 2s linear infinite;
	}
</style>
