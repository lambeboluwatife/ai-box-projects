<script>
	import { tasks } from './../lib/stores/tasks.js';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import TaskItem from './TaskItem.svelte';

	// Message to display when no tasks
	let emptyMessage = 'No tasks found';

	// loading state
	let loading = false;

	// Sort option state
	let sortBy = 'createdAt';
	let sortOrder = 'desc';

	// Sort tasks array
	const sortTasks = (tasksArray = [], by = 'createdAt', order = 'desc') => {
		if (!Array.isArray(tasksArray)) return [];

		const sorted = [...tasksArray];

		sorted.sort((a, b) => {
			let comparison = 0;

			switch (by) {
				case 'title':
					comparison = (a.title || '').localeCompare(b.title || '');
					break;
				case 'dueDate': {
					const dateA = a?.dueDate ? new Date(a.dueDate) : new Date(8640000000000000);
					const dateB = b?.dueDate ? new Date(b.dueDate) : new Date(8640000000000000);
					comparison = dateA - dateB;
					break;
				}
				case 'priority': {
					const priorityOrder = { high: 3, medium: 2, low: 1 };
					const pa = priorityOrder[a?.priority] ?? 0;
					const pb = priorityOrder[b?.priority] ?? 0;
					comparison = pb - pa;
					break;
				}
				case 'createdAt':
				default:
					const ca = a?.createdAt ? new Date(a.createdAt) : new Date(0);
					const cb = b?.createdAt ? new Date(b.createdAt) : new Date(0);
					comparison = cb - ca;
					break;
			}

			return order === 'asc' ? comparison : -comparison;
		});

		return sorted;
	};

	$: sortedTasks = sortTasks($tasks ?? [], sortBy, sortOrder);

	// Toggle sort order
	function toggleSortOrder() {
		sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
	}

	// Change sort option
	function changeSortBy(option) {
		if (sortBy === option) {
			toggleSortOrder();
		} else {
			sortBy = option;
			sortOrder = 'desc';
		}
	}
</script>

<div class="task-list-container">
	{#if ($tasks ?? []).length > 0}
		<div class="sort-controls">
			<span class="sort-label">Sort by:</span>
			<div class="sort-buttons">
				<button
					class="sort-btn {sortBy === 'createdAt' ? 'active' : ''}"
					onclick={() => changeSortBy('createdAt')}
				>
					Date Created
					{#if sortBy === 'createdAt'}
						<span class="sort-icon">{sortOrder === 'asc' ? '↑' : '↓'}</span>
					{/if}
				</button>
				<button
					class="sort-btn {sortBy === 'dueDate' ? 'active' : ''}"
					onclick={() => changeSortBy('dueDate')}
				>
					Due Date
					{#if sortBy === 'dueDate'}
						<span class="sort-icon">{sortOrder === 'asc' ? '↑' : '↓'}</span>
					{/if}
				</button>
				<button
					class="sort-btn {sortBy === 'priority' ? 'active' : ''}"
					onclick={() => changeSortBy('priority')}
				>
					Priority
					{#if sortBy === 'priority'}
						<span class="sort-icon">{sortOrder === 'asc' ? '↑' : '↓'}</span>
					{/if}
				</button>
				<button
					class="sort-btn {sortBy === 'title' ? 'active' : ''}"
					onclick={() => changeSortBy('title')}
				>
					Title
					{#if sortBy === 'title'}
						<span class="sort-icon">{sortOrder === 'asc' ? '↑' : '↓'}</span>
					{/if}
				</button>
			</div>
		</div>
	{/if}

	{#if loading}
		<div class="loading" transition:fade>
			<div class="spinner"></div>
			<p>Loading tasks...</p>
		</div>
	{:else if (sortedTasks ?? []).length === 0}
		<div class="empty-state" transition:fade>
			<svg
				width="64"
				height="64"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
			>
				<path d="M9 11l3 3L22 4"></path>
				<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
			</svg>
			<h3>{emptyMessage}</h3>
			<p>Start by creating your first task above.</p>
		</div>
	{:else}
		<div class="task-list">
			{#each sortedTasks as task (task.id)}
				<div animate:flip={{ duration: 300 }}>
					<TaskItem {task} />
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.task-list-container {
		width: 100%;
	}

	.sort-controls {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
		padding: 1rem;
		background: white;
		border-radius: 8px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		flex-wrap: wrap;
	}

	.sort-label {
		font-size: 0.875rem;
		color: #6b7280;
		font-weight: 500;
	}

	.sort-buttons {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.sort-btn {
		padding: 0.5rem 0.875rem;
		border: 1px solid #e5e7eb;
		background: white;
		border-radius: 6px;
		font-size: 0.8125rem;
		color: #6b7280;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.sort-btn:hover {
		border-color: #8b5cf6;
		color: #8b5cf6;
	}

	.sort-btn.active {
		background: #8b5cf6;
		color: white;
		border-color: #8b5cf6;
	}

	.sort-icon {
		font-size: 0.875rem;
		font-weight: bold;
	}

	/* Loading State */
	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 2rem;
		color: #6b7280;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #e5e7eb;
		border-top-color: #8b5cf6;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
		margin-bottom: 1rem;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Empty State */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 2rem;
		text-align: center;
		color: #9ca3af;
	}

	.empty-state svg {
		margin-bottom: 1rem;
		opacity: 0.5;
	}

	.empty-state h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.25rem;
		color: #6b7280;
	}

	.empty-state p {
		margin: 0;
		font-size: 0.875rem;
	}

	/* Task List */
	.task-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	@media (max-width: 640px) {
		.sort-controls {
			flex-direction: column;
			align-items: stretch;
		}

		.sort-buttons {
			justify-content: stretch;
		}

		.sort-btn {
			flex: 1;
			justify-content: center;
		}
	}
</style>
