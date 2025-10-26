<script>
	import { goto } from '$app/navigation';
	import { fade, slide } from 'svelte/transition';
	import Navigation from '../../components/Navigation.svelte';

	const features = [
		{
			icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
			title: 'Task Management',
			description:
				'Create, edit, and organize your tasks with ease. Set priorities, due dates, and descriptions.'
		},
		{
			icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
			title: 'Track Progress',
			description:
				"Mark tasks as complete and track your productivity. See what you've accomplished at a glance."
		},
		{
			icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
			title: 'Priority Levels',
			description: 'Organize tasks by priority: High, Medium, or Low. Focus on what matters most.'
		},
		{
			icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
			title: 'Due Dates',
			description: 'Set deadlines for your tasks and never miss an important date again.'
		},
		{
			icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
			title: 'Beautiful UI',
			description: 'Enjoy a modern, colorful interface that makes task management delightful.'
		},
		{
			icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
			title: 'Local Storage',
			description:
				'Your tasks are saved locally in your browser. No account needed, complete privacy.'
		}
	];

	const technologies = [
		{ name: 'SvelteKit', color: 'bg-orange-500' },
		{ name: 'Tailwind CSS', color: 'bg-cyan-500' },
		{ name: 'JavaScript', color: 'bg-yellow-500' },
		{ name: 'Local Storage', color: 'bg-purple-500' }
	];
</script>

<svelte:head>
	<title>About | TaskManager</title>
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-[#64babe] via-purple-600 to-pink-600 p-4">
	<Navigation />

	<div class="mx-auto max-w-6xl">
		<section class="mt-10 text-center" transition:fade={{ duration: 500 }}>
			<div class="mb-8 inline-block rounded-full bg-white/20 p-6 backdrop-blur-sm">
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
			<h1
				class="mb-4 text-5xl font-bold text-white"
				transition:slide={{ duration: 500, delay: 100 }}
			>
				About TaskManager
			</h1>
			<p
				class="mx-auto max-w-2xl text-xl text-white/90"
				transition:slide={{ duration: 500, delay: 200 }}
			>
				A simple, beautiful, and powerful task management application built to help you stay
				organized and productive.
			</p>
		</section>

		<section
			class="mt-16 rounded-2xl bg-white p-8 shadow-2xl"
			transition:slide={{ duration: 500, delay: 300 }}
		>
			<h2 class="mb-4 text-center text-3xl font-bold text-gray-800">Our Mission</h2>
			<p class="mx-auto max-w-3xl text-center text-lg text-gray-600">
				TaskManager was created with a simple goal: to provide a distraction-free, intuitive task
				management experience that doesn't require accounts, subscriptions, or complicated setups.
				Just open the app and start organizing your life.
			</p>
		</section>

		<section class="mt-16">
			<h2
				class="mb-8 text-center text-3xl font-bold text-white"
				transition:slide={{ duration: 500, delay: 400 }}
			>
				Features
			</h2>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each features as feature, i}
					<div
						class="rounded-2xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
						transition:slide={{ duration: 400, delay: 500 + i * 50 }}
					>
						<div class="mb-4 inline-block rounded-full bg-purple-100 p-3">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-8 w-8 text-purple-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d={feature.icon} />
							</svg>
						</div>
						<h3 class="mb-2 text-xl font-bold text-gray-800">{feature.title}</h3>
						<p class="text-gray-600">{feature.description}</p>
					</div>
				{/each}
			</div>
		</section>

		<section
			class="mt-16 rounded-2xl bg-white p-8 shadow-2xl"
			transition:slide={{ duration: 500, delay: 900 }}
		>
			<h2 class="mb-6 text-center text-3xl font-bold text-gray-800">Built With</h2>
			<p class="mb-8 text-center text-gray-600">
				TaskManager is built with modern web technologies to ensure a fast, responsive, and reliable
				experience.
			</p>
			<div class="flex flex-wrap items-center justify-center gap-4">
				{#each technologies as tech}
					<span
						class={`rounded-full px-6 py-3 text-lg font-semibold text-white shadow-lg ${tech.color}`}
					>
						{tech.name}
					</span>
				{/each}
			</div>
		</section>

		<section
			class="mt-16 rounded-2xl bg-white p-8 shadow-2xl"
			transition:slide={{ duration: 500, delay: 1000 }}
		>
			<div class="flex flex-col items-center text-center">
				<div class="mb-6 rounded-full bg-green-100 p-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-12 w-12 text-green-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
						/>
					</svg>
				</div>
				<h2 class="mb-4 text-3xl font-bold text-gray-800">Your Privacy Matters</h2>
				<p class="mx-auto max-w-2xl text-lg text-gray-600">
					All your tasks are stored locally in your browser using Local Storage. We don't collect,
					store, or have access to any of your data. Your tasks stay on your device, giving you
					complete privacy and control.
				</p>
			</div>
		</section>

		<section class="mt-16 mb-10 text-center" transition:slide={{ duration: 500, delay: 1100 }}>
			<h2 class="mb-4 text-3xl font-bold text-white">Ready to Get Organized?</h2>
			<p class="mb-8 text-xl text-white/90">Start managing your tasks efficiently today!</p>
			<button
				onclick={() => goto('/')}
				class="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-purple-600 shadow-xl transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<line x1="5" y1="12" x2="19" y2="12"></line>
					<polyline points="12 5 19 12 12 19"></polyline>
				</svg>
				Go to Tasks
			</button>
		</section>

		<footer class="mt-16 pb-8 text-center text-white/80">
			<p>&copy; 2025 TaskManager. Built with ❤️ for productivity.</p>
		</footer>
	</div>
</main>
