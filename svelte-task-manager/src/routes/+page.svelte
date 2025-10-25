<script>
	import Navigation from '../components/Navigation.svelte';
	import TaskBoards from '../components/TaskBoards.svelte';
	import TaskForm from '../components/TaskForm.svelte';

	let showTaskForm = $state(false);

	const openModal = () => {
		showTaskForm = true;
	};

	const closeModal = () => {
		showTaskForm = false;
	};
</script>

<main class="mx-auto min-h-screen bg-gradient-to-br from-[#64babe] via-purple-600 to-pink-600 p-4">
	<Navigation />
	<div class="mx-auto max-w-7xl">
		<TaskBoards onOpenTaskForm={openModal} />
	</div>

	<TaskForm isOpen={showTaskForm} onClose={closeModal} />
</main>
