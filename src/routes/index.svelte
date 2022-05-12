<script lang="ts">
	import Keyboard from '$lib/components/Keyboard.svelte';
	import WordGrid from '$lib/components/WordGrid.svelte';
	import { tries } from '$lib/store/tries';

	let timesClicked = 0;
	const onLogoClick = () => {
		timesClicked++;

		if (timesClicked >= 10) {
			tries.reset();
			timesClicked = 0;
		}
	};
</script>

<section class="container themed">
	<h1 on:click={onLogoClick}>Wordex</h1>
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
		user-select: none;
	}

	@media (min-width: 768px) {
		section {
			height: 100vh;
		}
	}
</style>
