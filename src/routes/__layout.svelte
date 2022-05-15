<script lang="ts">
	import CommandMenu from '$lib/components/CommandMenu.svelte';
	import Toasts from '$lib/components/Toasts.svelte';
	import '../styles/index.css';
</script>

<svelte:head>
	<title>Wordex</title>
</svelte:head>

<main>
	<CommandMenu />
	<Toasts />
	<slot />
</main>

<style>
	main {
		height: 100%;
	}
</style>
