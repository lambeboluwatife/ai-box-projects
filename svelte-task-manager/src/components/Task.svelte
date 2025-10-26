<script>
	import { tasks } from './../lib/stores/tasks.js';
	import { fade, slide } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import TaskToggle from './TaskToggle.svelte';

	let { task } = $props();

	const priorityColors = {
		high: 'border-red-500',
		medium: 'border-yellow-500',
		low: 'border-green-500'
	};

	const getPriorityColor = (priority) => {
		return priorityColors[priority] || 'border-gray-300';
	};

	// Local UI state
	let showActions = true;
	let showDeleteConfirm = $state(false);
	let editMode = $state(false);
	let taskToEdit = $state(null);

	// formatDate
	const formatDate = (dateString) => {
		if (!dateString) return null;
		const date = new Date(dateString);
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
		const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());

		if (dateOnly.getTime() === todayOnly.getTime()) {
			return 'Today';
		} else if (dateOnly.getTime() === tomorrowOnly.getTime()) {
			return 'Tomorrow';
		} else {
			return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
		}
	};

	// Navigate to task detail page
	const handleCardClick = (e) => {
		if (e.target.closest('button')) return;
		goto(`/task/${task.id}`);
	};

	// Show edit form
	const handleEdit = (e) => {
		e.stopPropagation();
		editMode = true;
		taskToEdit = { ...task };
	};

	const saveEdit = (event) => {
		event.preventDefault();
		event.stopPropagation?.();
		if (!taskToEdit) return;
		tasks.updateTask(task.id, { ...taskToEdit });
		editMode = false;
	};

	const cancelEdit = () => {
		editMode = false;
		taskToEdit = null;
	};

	// Show confirm dialog
	const handleDelete = (e) => {
		e.stopPropagation();
		showDeleteConfirm = true;
	};

	const confirmDelete = () => {
		if (!task) return;
		tasks.deleteTask(task.id);
		showDeleteConfirm = false;
	};

	const cancelDelete = () => {
		showDeleteConfirm = false;
	};
</script>

<div
	class={`group flex w-full cursor-pointer flex-col rounded-xl border-t-8 bg-white p-4 shadow transition-all hover:scale-[1.02] hover:shadow-xl ${getPriorityColor(task.priority)}`}
	transition:fade={{ duration: 500 }}
	onclick={handleCardClick}
	onkeydown={(e) => e.key === 'Enter' && handleCardClick(e)}
	role="button"
	tabindex="0"
	aria-label={`View task: ${task.title}`}
>
	<div class="flex items-start justify-between gap-2">
		<h3
			class="mb-1 flex-1 text-lg font-semibold text-gray-800 transition-colors group-hover:text-purple-600"
		>
			{task.title}
		</h3>
		<TaskToggle {task} />
	</div>

	{#if task.description}
		<p class="mb-2 line-clamp-2 text-sm text-gray-600">{task.description}</p>
	{/if}

	{#if task.dueDate}
		<div class="my-2 flex items-center gap-2">
			<svg
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				class="text-gray-500"
			>
				<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
				<line x1="16" y1="2" x2="16" y2="6"></line>
				<line x1="8" y1="2" x2="8" y2="6"></line>
				<line x1="3" y1="10" x2="21" y2="10"></line>
			</svg>
			<p class="text-xs font-medium text-gray-500">Due: {formatDate(task.dueDate)}</p>
		</div>
	{/if}

	<div class="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
		<div class="flex items-center gap-2">
			<button
				class="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition-all hover:bg-blue-100 active:scale-95"
				onclick={handleEdit}
				aria-label="Edit task"
				title="Edit"
			>
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
					<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
				</svg>
				<span>Edit</span>
			</button>

			<button
				class="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-all hover:bg-red-100 active:scale-95"
				onclick={handleDelete}
				aria-label="Delete task"
				title="Delete"
			>
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<polyline points="3 6 5 6 21 6"></polyline>
					<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
					></path>
				</svg>
				<span>Delete</span>
			</button>
		</div>

		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			class="text-gray-400 transition-all group-hover:translate-x-1 group-hover:text-purple-600"
		>
			<line x1="5" y1="12" x2="19" y2="12"></line>
			<polyline points="12 5 19 12 12 19"></polyline>
		</svg>
	</div>
</div>

{#if editMode}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
		transition:fade={{ duration: 200 }}
		onclick={(e) => e.target === e.currentTarget && cancelEdit()}
		onkeydown={(e) => e.key === 'Escape' && cancelEdit()}
		role="presentation"
		tabindex="-1"
	>
		<div
			class="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
			transition:slide={{ duration: 300 }}
			role="document"
		>
			<div class="flex items-center justify-between border-b border-gray-200 p-6">
				<h3 class="text-2xl font-bold text-gray-800">Edit Task</h3>
				<button
					onclick={cancelEdit}
					class="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
					aria-label="Close modal"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			</div>

			<form onsubmit={saveEdit} class="p-6">
				<div class="mb-5">
					<label for="edit-title" class="mb-2 block text-sm font-semibold text-gray-700">
						Title
					</label>
					<input
						id="edit-title"
						type="text"
						bind:value={taskToEdit.title}
						placeholder="Task title"
						class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:outline-none"
					/>
				</div>

				<div class="mb-5">
					<label for="edit-description" class="mb-2 block text-sm font-semibold text-gray-700">
						Description
					</label>
					<textarea
						id="edit-description"
						bind:value={taskToEdit.description}
						placeholder="Task description"
						rows="4"
						class="w-full resize-y rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:outline-none"
					></textarea>
				</div>

				<div class="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
					<div>
						<label for="edit-dueDate" class="mb-2 block text-sm font-semibold text-gray-700">
							Due Date
						</label>
						<input
							id="edit-dueDate"
							type="date"
							bind:value={taskToEdit.dueDate}
							class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:outline-none"
						/>
					</div>

					<div>
						<label for="edit-priority" class="mb-2 block text-sm font-semibold text-gray-700">
							Priority
						</label>
						<select
							id="edit-priority"
							bind:value={taskToEdit.priority}
							class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:outline-none"
						>
							<option value="low">Low</option>
							<option value="medium">Medium</option>
							<option value="high">High</option>
						</select>
					</div>
				</div>

				<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
					<button
						type="button"
						onclick={cancelEdit}
						class="rounded-lg bg-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-300 active:scale-95"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-purple-700 active:scale-95"
					>
						Save Changes
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

{#if showDeleteConfirm}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
		transition:fade={{ duration: 200 }}
		onclick={(e) => e.target === e.currentTarget && cancelDelete()}
		onkeydown={(e) => e.key === 'Escape' && cancelDelete()}
		role="presentation"
		tabindex="-1"
	>
		<div
			class="w-full max-w-md rounded-2xl bg-white shadow-2xl"
			transition:slide={{ duration: 300 }}
			role="document"
		>
			<div class="flex items-center justify-between border-b border-gray-200 p-6">
				<div class="flex items-center gap-3">
					<div class="rounded-full bg-red-100 p-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="text-red-600"
						>
							<path
								d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
							></path>
							<line x1="12" y1="9" x2="12" y2="13"></line>
							<line x1="12" y1="17" x2="12.01" y2="17"></line>
						</svg>
					</div>
					<h3 class="text-xl font-bold text-gray-800">Delete Task?</h3>
				</div>
				<button
					onclick={cancelDelete}
					class="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
					aria-label="Close modal"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			</div>

			<div class="p-6">
				<p class="text-gray-600">
					Are you sure you want to delete <span class="font-bold text-gray-800">"{task.title}"</span
					>? This action cannot be undone.
				</p>

				<div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
					<button
						type="button"
						onclick={cancelDelete}
						class="rounded-lg bg-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-300 active:scale-95"
					>
						Cancel
					</button>
					<button
						type="button"
						onclick={confirmDelete}
						class="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-700 active:scale-95"
					>
						Delete Task
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
