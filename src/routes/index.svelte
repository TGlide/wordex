<script>
	import Keyboard from '$lib/components/Keyboard.svelte';
</script>

<section class="container themed">
	<h1>Wordex</h1>
	<div class="keyboard-wrapper">
		<Keyboard />
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		min-height: 100vh;
	}

	h1 {
		font-family: var(--ff-display);
		font-size: 3rem;
		text-align: center;
		font-weight: 600;
	}
</style>
