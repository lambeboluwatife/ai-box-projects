<script>
	import { tasks } from './../lib/stores/tasks.js';
	import { fade, slide } from 'svelte/transition';

	// Props
	let { isOpen = false, onClose = () => {} } = $props();

	// Form state
	let title = $state('');
	let description = $state('');
	let dueDate = $state('');
	let priority = $state('medium');

	// Validation state
	let errors = $state({});
	let touched = $state({});

	// form field validation
	const validate = () => {
		errors = {};

		if (!title.trim()) {
			errors.title = 'Title is required';
		} else if (title.length > 100) {
			errors.title = 'Title must be less than 100 characters';
		}

		if (description.length > 500) {
			errors.description = 'Description must be less than 500 characters';
		}

		return Object.keys(errors).length === 0;
	};

	// Handle blur events
	const handleBlur = (field) => {
		touched[field] = true;
		validate();
	};

	// handles form submission
	const handleSubmit = (e) => {
		e.preventDefault();
		touched = { title: true, description: true, dueDate: true, priority: true };

		if (!validate()) {
			return;
		}

		const taskData = {
			title: title.trim(),
			description: description.trim(),
			dueDate: dueDate || null,
			priority
		};

		tasks.addTask(taskData);
		resetForm();
		onClose();
	};

	// Handle cancel action
	const handleCancel = () => {
		resetForm();
		onClose();
	};

	// Reset form to initial state
	const resetForm = () => {
		title = '';
		description = '';
		dueDate = '';
		priority = 'medium';
		errors = {};
		touched = {};
	};

	// Close modal when clicking outside
	const handleBackdropClick = (e) => {
		if (e.target === e.currentTarget) {
			handleCancel();
		}
	};
</script>

{#if isOpen}
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
		transition:fade={{ duration: 200 }}
		onclick={handleBackdropClick}
		onkeydown={(e) => e.key === 'Escape' && handleCancel()}
		role="presentation"
		tabindex="-1"
	>
		<div
			class="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
			transition:slide={{ duration: 300 }}
			role="document"
		>
			<!-- Modal Header -->
			<div class="flex items-center justify-between border-b border-gray-200 p-6">
				<h2 id="modal-title" class="text-2xl font-bold text-gray-800">Add New Task</h2>
				<button
					onclick={handleCancel}
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

			<!-- Modal Body -->
			<form onsubmit={handleSubmit} class="p-6">
				<!-- Title Field -->
				<div class="mb-5">
					<label for="title" class="mb-2 block text-sm font-semibold text-gray-700">
						Title <span class="text-red-500">*</span>
					</label>
					<input
						id="title"
						type="text"
						bind:value={title}
						onblur={() => handleBlur('title')}
						placeholder="Enter task title"
						class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:outline-none {touched.title &&
						errors.title
							? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
							: ''}"
						aria-invalid={touched.title && errors.title ? 'true' : 'false'}
						aria-describedby={touched.title && errors.title ? 'title-error' : undefined}
					/>
					{#if touched.title && errors.title}
						<span class="mt-1 block text-xs text-red-500" id="title-error">{errors.title}</span>
					{/if}
				</div>

				<!-- Description Field -->
				<div class="mb-5">
					<label for="description" class="mb-2 block text-sm font-semibold text-gray-700">
						Description
					</label>
					<textarea
						id="description"
						bind:value={description}
						onblur={() => handleBlur('description')}
						placeholder="Enter task description (optional)"
						rows="4"
						class="w-full resize-y rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:outline-none {touched.description &&
						errors.description
							? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
							: ''}"
						aria-invalid={touched.description && errors.description ? 'true' : 'false'}
						aria-describedby={touched.description && errors.description
							? 'description-error'
							: undefined}
					></textarea>
					{#if touched.description && errors.description}
						<span class="mt-1 block text-xs text-red-500" id="description-error"
							>{errors.description}</span
						>
					{/if}
				</div>

				<!-- Due Date and Priority Row -->
				<div class="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
					<!-- Due Date Field -->
					<div>
						<label for="dueDate" class="mb-2 block text-sm font-semibold text-gray-700">
							Due Date
						</label>
						<input
							id="dueDate"
							type="date"
							bind:value={dueDate}
							min={new Date().toISOString().split('T')[0]}
							class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:outline-none"
						/>
					</div>

					<!-- Priority Field -->
					<div>
						<label for="priority" class="mb-2 block text-sm font-semibold text-gray-700">
							Priority
						</label>
						<select
							id="priority"
							bind:value={priority}
							class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:outline-none"
						>
							<option value="low">Low</option>
							<option value="medium">Medium</option>
							<option value="high">High</option>
						</select>
					</div>
				</div>

				<!-- Form Actions -->
				<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
					<button
						type="button"
						onclick={handleCancel}
						class="rounded-lg bg-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-300 active:scale-95"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-purple-700 active:scale-95"
					>
						Add Task
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
