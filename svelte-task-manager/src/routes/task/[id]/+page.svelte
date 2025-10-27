<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { tasks } from '../../../lib/stores/tasks.js';
	import { fade, slide } from 'svelte/transition';
	import Navigation from '../../../components/Navigation.svelte';
	import TaskToggle from '../../../components/TaskToggle.svelte';

	// Get task ID from URL
	const taskId = $page.params.id;

	// Find the task
	let task = $derived($tasks.find((t) => t.id === taskId));

	// Edit mode state
	let editMode = $state(false);
	let taskToEdit = $state(null);
	let showDeleteConfirm = $state(false);

	const priorityColors = {
		high: 'bg-red-500',
		medium: 'bg-yellow-500',
		low: 'bg-green-500'
	};

	const priorityLabels = {
		high: 'High Priority',
		medium: 'Medium Priority',
		low: 'Low Priority'
	};

	const getPriorityColor = (priority) => {
		return priorityColors[priority] || 'bg-gray-500';
	};

	// Format date with more detail
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
			return date.toLocaleDateString('en-US', {
				weekday: 'long',
				month: 'long',
				day: 'numeric',
				year: 'numeric'
			});
		}
	};

	const formatDateTime = (dateString) => {
		if (!dateString) return 'Not set';
		const date = new Date(dateString);
		return date.toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	};

	// Handle edit
	const handleEdit = () => {
		editMode = true;
		taskToEdit = { ...task };
	};

	const saveEdit = (event) => {
		event.preventDefault();
		if (!taskToEdit) return;
		tasks.updateTask(task.id, { ...taskToEdit });
		editMode = false;
	};

	const cancelEdit = () => {
		editMode = false;
		taskToEdit = null;
	};

	// Handle delete
	const handleDelete = () => {
		showDeleteConfirm = true;
	};

	const confirmDelete = () => {
		tasks.deleteTask(task.id);
		goto('/');
	};

	const cancelDelete = () => {
		showDeleteConfirm = false;
	};

	// Go back
	const goBack = () => {
		goto('/');
	};
</script>

<svelte:head>
	<title>{task ? task.title : 'Task Not Found'} | Task Manager</title>
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-[#64babe] via-purple-600 to-pink-600 p-4">
	<Navigation />

	<div class="mx-auto max-w-4xl">
		{#if !task}
			<div class="mt-10 rounded-2xl bg-white p-8 shadow-2xl" transition:fade={{ duration: 300 }}>
				<div class="flex flex-col items-center justify-center py-12">
					<div class="mb-6 rounded-full bg-red-100 p-6">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-16 w-16 text-red-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
					</div>
					<h2 class="mb-2 text-2xl font-bold text-gray-800">Task Not Found</h2>
					<p class="mb-6 text-gray-600">
						The task you're looking for doesn't exist or has been deleted.
					</p>
					<button
						onclick={goBack}
						class="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition-all hover:bg-purple-700 active:scale-95"
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
							<line x1="19" y1="12" x2="5" y2="12"></line>
							<polyline points="12 19 5 12 12 5"></polyline>
						</svg>
						Back to Tasks
					</button>
				</div>
			</div>
		{:else}
			<div class="mt-10" transition:fade={{ duration: 300 }}>
				<button
					onclick={goBack}
					class="mb-4 flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-white backdrop-blur-sm transition-all hover:bg-white/30"
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
						<line x1="19" y1="12" x2="5" y2="12"></line>
						<polyline points="12 19 5 12 12 5"></polyline>
					</svg>
					Back to Tasks
				</button>

				<div class="rounded-2xl bg-white shadow-2xl">
					<div class="border-b border-gray-200 p-6">
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<div class="mb-3 flex items-center gap-3">
									<span
										class={`rounded-full px-3 py-1 text-xs font-semibold text-white ${getPriorityColor(task.priority)}`}
									>
										{priorityLabels[task.priority]}
									</span>
									{#if task.completed}
										<span
											class="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
										>
											Completed
										</span>
									{/if}
								</div>
								<h1 class="text-3xl font-bold text-gray-800">{task.title}</h1>
							</div>
							<TaskToggle {task} />
						</div>
					</div>

					<div class="p-6">
						<div class="mb-6">
							<h2 class="mb-2 text-sm font-semibold tracking-wide text-gray-500 uppercase">
								Description
							</h2>
							<p class="text-gray-700">
								{task.description || 'No description provided'}
							</p>
						</div>

						<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<div class="rounded-lg bg-gray-50 p-4">
								<div class="flex items-center gap-3">
									<div class="rounded-full bg-purple-100 p-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											class="text-purple-600"
										>
											<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
											<line x1="16" y1="2" x2="16" y2="6"></line>
											<line x1="8" y1="2" x2="8" y2="6"></line>
											<line x1="3" y1="10" x2="21" y2="10"></line>
										</svg>
									</div>
									<div>
										<p class="text-xs font-semibold tracking-wide text-gray-500 uppercase">
											Due Date
										</p>
										<p class="text-sm font-medium text-gray-800">
											{task.dueDate ? formatDate(task.dueDate) : 'No due date'}
										</p>
									</div>
								</div>
							</div>

							<div class="rounded-lg bg-gray-50 p-4">
								<div class="flex items-center gap-3">
									<div class="rounded-full bg-blue-100 p-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											class="text-blue-600"
										>
											<circle cx="12" cy="12" r="10"></circle>
											<polyline points="12 6 12 12 16 14"></polyline>
										</svg>
									</div>
									<div>
										<p class="text-xs font-semibold tracking-wide text-gray-500 uppercase">
											Created
										</p>
										<p class="text-sm font-medium text-gray-800">
											{formatDateTime(task.createdAt)}
										</p>
									</div>
								</div>
							</div>

							{#if task.completed && task.completedAt}
								<div class="rounded-lg bg-green-50 p-4">
									<div class="flex items-center gap-3">
										<div class="rounded-full bg-green-100 p-2">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="20"
												height="20"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												class="text-green-600"
											>
												<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
												<polyline points="22 4 12 14.01 9 11.01"></polyline>
											</svg>
										</div>
										<div>
											<p class="text-xs font-semibold tracking-wide text-gray-500 uppercase">
												Completed
											</p>
											<p class="text-sm font-medium text-gray-800">
												{formatDateTime(task.completedAt)}
											</p>
										</div>
									</div>
								</div>
							{/if}
						</div>
					</div>

					<div class="border-t border-gray-200 bg-gray-50 p-6">
						<div class="flex flex-wrap gap-3">
							<button
								onclick={handleEdit}
								class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-all hover:bg-blue-700 active:scale-95"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
									<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
								</svg>
								Edit Task
							</button>
							<button
								onclick={handleDelete}
								class="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-all hover:bg-red-700 active:scale-95"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<polyline points="3 6 5 6 21 6"></polyline>
									<path
										d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
									></path>
								</svg>
								Delete Task
							</button>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</main>

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
