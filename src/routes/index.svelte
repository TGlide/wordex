<script>
	import Keyboard from '$lib/components/Keyboard.svelte';
	import WordGrid from '$lib/components/WordGrid.svelte';
</script>

<section class="container themed">
	<h1>Wordex</h1>
	<WordGrid />
	<Keyboard />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		height: 90vh;
	}

	h1 {
		font-family: var(--ff-display);
		font-size: 3rem;
		text-align: center;
		font-weight: 600;
	}

	@media (min-width: 768px) {
		section {
			height: 100vh;
		}
	}
</style>
