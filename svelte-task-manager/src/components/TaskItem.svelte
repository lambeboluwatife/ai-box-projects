<script>
	import { tasks } from '../lib/stores/tasks.js';
	import { fade, slide } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import PriorityBadge from './PriorityBadge.svelte';

	// Receive task as a prop
	export let task = null;

	// Local UI state
	let showActions = true;
	let showDeleteConfirm = false;
	let editMode = false;
	let taskToEdit = null;

	// Reactive guards
	$: isOverdue = task && task.dueDate && !task.completed && new Date(task.dueDate) < new Date();
	$: formattedDate = task && task.dueDate ? formatDate(task.dueDate) : null;
	$: priorityColorClass = task ? `priority-${task.priority ?? 'low'}` : '';

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

	// Toggle completion
	const handleToggle = (event) => {
		event.stopPropagation?.();

		if (!task) return;

		const newCompleted = !task.completed;
		const updates = {
			completed: newCompleted,
			completedAt: newCompleted ? new Date().toISOString() : null
		};

		// Use store method to persist
		tasks.updateTask(task.id, updates);
	};

	// Show edit form
	const handleEdit = () => {
		editMode = true;
	};

	const saveEdit = (event) => {
		event.stopPropagation?.();
		if (!task) return;
		tasks.updateTask(task.id, {
			title: task.title,
			description: task.description,
			dueDate: task.dueDate,
			priority: task.priority
		});
		editMode = false;
	};

	// Show confirm dialog
	const handleDelete = () => {
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

	/** Navigate to detail — avoid navigating when interactive child clicked */
	const navigateToDetail = (event) => {
		// if clicked on button/input/a, bail out
		if (event.target && event.target.closest && event.target.closest('button, input, a')) {
			return;
		}
		if (!task) return;
		goto(`/tasks/${task.id}`);
	};

	const truncate = (text, maxLength = 100) => {
		if (!text) return '';
		return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
	};
</script>

{#if task}
	<div
		class="task-item {task.completed ? 'completed' : ''} {priorityColorClass}"
		transition:fade={{ duration: 200 }}
		onclick={navigateToDetail}
		role="button"
		tabindex="0"
		onkeydown={(e) => e.key === 'Enter' && navigateToDetail(e)}
	>
		<div class="task-checkbox">
			<input
				type="checkbox"
				id="task-{task.id}"
				checked={task.completed}
				onchange={handleToggle}
				aria-label={'Mark task as ' + (task.completed ? 'incomplete' : 'complete')}
			/>
		</div>

		<div class="task-content">
			<div class="task-header">
				<h3 class="task-title">{task.title}</h3>
				<PriorityBadge priority={task.priority} />
			</div>

			{#if task.description}
				<p class="task-description">{truncate(task.description)}</p>
			{/if}

			<div class="task-meta">
				{#if formattedDate}
					<span class="due-date {isOverdue ? 'overdue' : ''}">
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
							<line x1="16" y1="2" x2="16" y2="6"></line>
							<line x1="8" y1="2" x2="8" y2="6"></line>
							<line x1="3" y1="10" x2="21" y2="10"></line>
						</svg>
						{formattedDate}
						{#if isOverdue}
							<span class="overdue-badge">Overdue</span>
						{/if}
					</span>
				{/if}

				{#if task.completedAt}
					<span class="completed-date">
						Completed {new Date(task.completedAt).toLocaleDateString()}
					</span>
				{/if}
			</div>
		</div>

		{#if showActions}
			<div class="task-actions">
				<button class="btn-icon btn-edit" onclick={handleEdit} aria-label="Edit task" title="Edit">
					<svg
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
				</button>

				<button
					class="btn-icon btn-delete"
					onclick={handleDelete}
					aria-label="Delete task"
					title="Delete"
				>
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<polyline points="3 6 5 6 21 6"></polyline>
						<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
						></path>
					</svg>
				</button>
			</div>
		{/if}
	</div>

	{#if editMode}
		<div class="modal-overlay" transition:fade={{ duration: 150 }}>
			<div class="modal" transition:slide={{ duration: 200 }}>
				<h3>Edit Task</h3>

				<label class="field">
					<span>Title</span>
					<input type="text" bind:value={task.title} placeholder="Task title" />
				</label>

				<label class="field">
					<span>Description</span>
					<textarea rows="4" bind:value={task.description} placeholder="Task description"
					></textarea>
				</label>

				<label class="field">
					<span>Due date</span>
					<input type="date" bind:value={task.dueDate} />
				</label>

				<label class="field">
					<span>Priority</span>
					<select bind:value={task.priority}>
						<option value="low">Low</option>
						<option value="medium">Medium</option>
						<option value="high">High</option>
					</select>
				</label>

				<div class="modal-actions">
					<button class="btn btn-primary" onclick={saveEdit}>Save</button>
					<button class="btn btn-secondary" onclick={cancelEdit}>Cancel</button>
				</div>
			</div>
		</div>
	{/if}

	{#if showDeleteConfirm}
		<div class="confirm-overlay" transition:fade={{ duration: 200 }}>
			<div class="confirm-dialog" transition:slide={{ duration: 300 }}>
				<h3>Delete Task?</h3>
				<p>Are you sure you want to delete "{task.title}"? This action cannot be undone.</p>
				<div class="confirm-actions">
					<button class="btn btn-danger" onclick={confirmDelete}>Delete</button>
					<button class="btn btn-secondary" onclick={cancelDelete}>Cancel</button>
				</div>
			</div>
		</div>
	{/if}
{/if}

<style>
	.task-item {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding: 1.25rem;
		background: white;
		border-radius: 8px;
		border-left: 4px solid transparent;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		transition:
			box-shadow 0.2s,
			transform 0.2s;
		cursor: pointer;
	}

	.task-item:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		transform: translateY(-2px);
	}

	.task-item.completed {
		opacity: 0.7;
		background: #f9fafb;
	}

	.task-item.priority-low {
		border-left-color: #10b981;
	}

	.task-item.priority-medium {
		border-left-color: #f59e0b;
	}

	.task-item.priority-high {
		border-left-color: #ef4444;
	}

	.task-checkbox {
		flex-shrink: 0;
		padding-top: 0.25rem;
	}

	input[type='checkbox'] {
		width: 20px;
		height: 20px;
		cursor: pointer;
		accent-color: #8b5cf6;
	}

	.task-content {
		flex: 1;
		min-width: 0;
	}

	.task-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.5rem;
	}

	.task-title {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		color: #1f2937;
		word-break: break-word;
	}

	.completed .task-title {
		text-decoration: line-through;
		color: #6b7280;
	}

	.task-description {
		margin: 0 0 0.75rem 0;
		font-size: 0.875rem;
		color: #6b7280;
		line-height: 1.5;
	}

	.task-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		font-size: 0.75rem;
		color: #9ca3af;
	}

	.due-date {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.due-date.overdue {
		color: #ef4444;
		font-weight: 600;
	}

	.overdue-badge {
		background: #fee2e2;
		color: #991b1b;
		padding: 0.125rem 0.375rem;
		border-radius: 4px;
		font-size: 0.625rem;
		font-weight: 600;
		text-transform: uppercase;
		margin-left: 0.25rem;
	}

	.completed-date {
		color: #10b981;
	}

	.task-actions {
		display: flex;
		gap: 0.5rem;
		flex-shrink: 0;
	}

	.btn-icon {
		padding: 0.5rem;
		border: none;
		background: transparent;
		border-radius: 6px;
		cursor: pointer;
		transition: background-color 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn-icon:hover {
		background: #f3f4f6;
	}

	.btn-edit {
		color: #3b82f6;
	}

	.btn-delete {
		color: #ef4444;
	}

	.btn-icon:active {
		transform: scale(0.95);
	}

	/* Confirm Dialog */
	.confirm-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1rem;
	}

	.confirm-dialog {
		background: white;
		padding: 1.5rem;
		border-radius: 12px;
		max-width: 400px;
		width: 100%;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
	}

	.confirm-dialog h3 {
		margin: 0 0 0.75rem 0;
		font-size: 1.25rem;
		color: #1f2937;
	}

	.confirm-dialog p {
		margin: 0 0 1.5rem 0;
		color: #6b7280;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.confirm-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}

	.btn {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.btn-danger {
		background-color: #ef4444;
		color: white;
	}

	.btn-danger:hover {
		background-color: #dc2626;
	}

	.btn-secondary {
		background-color: #e5e7eb;
		color: #374151;
	}

	.btn-secondary:hover {
		background-color: #d1d5db;
	}

	.modal-overlay {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.4);
		z-index: 1000;
		padding: 1rem;
	}

	.modal {
		background: white;
		width: 100%;
		max-width: 560px;
		padding: 1.25rem;
		border-radius: 10px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		margin-bottom: 0.75rem;
		font-size: 0.9rem;
	}

	.field input[type='text'],
	.field input[type='date'],
	.field textarea,
	.field select {
		padding: 0.6rem;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		font-size: 0.95rem;
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.btn-primary {
		background: #8b5cf6;
		color: white;
		padding: 0.5rem 0.9rem;
		border-radius: 6px;
		border: none;
		cursor: pointer;
	}

	.btn-secondary {
		background: #e5e7eb;
		color: #374151;
		padding: 0.5rem 0.9rem;
		border-radius: 6px;
		border: none;
		cursor: pointer;
	}

	@media (max-width: 640px) {
		.task-item {
			padding: 1rem;
		}

		.task-actions {
			flex-direction: column;
		}
	}
</style>
