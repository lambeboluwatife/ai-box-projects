<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<title>SvelteKit App</title>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
