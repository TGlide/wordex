<script lang="ts">
	import Toasts from '$lib/components/Toasts.svelte';
	import '../styles/index.css';
</script>

<svelte:head>
	<title>Wordex</title>
</svelte:head>

<main>
	<Toasts />
	<slot />
</main>

<style>
	main {
		height: 100%;
	}
</style>
