<script>
	import { tasks } from './../lib/stores/tasks.js';
	import Task from './Task.svelte';
	import { slide, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';

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

<div class="mb-4 rounded-2xl bg-gray-200 p-4 shadow-md" in:slide={{ duration: 400, delay: 100 }}>
	<div class="mb-4 flex w-full items-center justify-between">
		<h2 class="text-xl font-semibold text-black">{title}</h2>
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
