<script>
	import { onMount } from 'svelte';
	import { tasks } from './../lib/stores/tasks.js';
	import Board from './Board.svelte';

	let { onOpenTaskForm = () => {} } = $props();

	// Message to display when no tasks
	let emptyMessage = 'No tasks found';

	// loading state
	let loading = $state(true);

	let allTasks = $state([]);

	let unsub;

	onMount(() => {
		let first = true;
		unsub = tasks.subscribe((value) => {
			allTasks = value ?? [];
			if (first) {
				loading = false;
				first = false;
			}
		});

		return () => {
			if (unsub) unsub();
		};
	});
</script>

<section class="my-10 grid grid-cols-1 items-start gap-4 md:grid-cols-3">
	{#if loading}
		<div class="col-span-3 flex flex-col items-center justify-center py-20">
			<div class="relative h-16 w-16">
				<div class="absolute h-16 w-16 animate-ping rounded-full bg-white opacity-75"></div>
				<div class="absolute h-16 w-16 animate-pulse rounded-full bg-white"></div>
			</div>
			<p class="mt-6 text-lg font-medium text-white">Loading your tasks...</p>
		</div>
	{:else if allTasks.length === 0}
		<div class="col-span-3 flex flex-col items-center justify-center py-20">
			<div class="mb-6 rounded-full bg-white/20 p-6 backdrop-blur-sm">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-20 w-20 text-white"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
					/>
				</svg>
			</div>
			<h3 class="mb-2 text-2xl font-bold text-white">No Tasks Yet</h3>
			<p class="mb-4 text-lg text-white/80">Create your first task to get started!</p>
			<button
				onclick={onOpenTaskForm}
				class="flex cursor-pointer items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-purple-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<line x1="12" y1="5" x2="12" y2="19"></line>
					<line x1="5" y1="12" x2="19" y2="12"></line>
				</svg>
				Add Your First Task
			</button>
		</div>
	{:else}
		<Board title="To Do" filterType="pending" onAddTask={onOpenTaskForm} />
		<Board title="In Progress" filterType="inProgress" />
		<Board title="Completed" filterType="completed" />
	{/if}
</section>
