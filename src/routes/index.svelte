<script lang="ts" context="module">
	import Keyboard from '$lib/components/Keyboard.svelte';
	import WordGrid from '$lib/components/WordGrid.svelte';
	import { store } from '$lib/store';
	import { deterministicPick } from '$lib/utils/array';
	import type { Load } from '.svelte-kit/types/src/routes';

	export const load: Load = async ({ fetch }) => {
		const res = await fetch('words/ptBr.txt');
		const text = await res.text();
		const words = text.split('\n');
		const fiveLetterWords = words.filter((word) => word.length === 5);

		// Select 5 letter word based on the current date
		const today = new Date();
		const seed = `${today.getFullYear()}${today.getMonth()}${today.getDate()}`;
		const word = deterministicPick(fiveLetterWords, seed);
		console.log(word);

		return {
			status: 200,
			props: {
				word
			}
		};
	};
</script>

<script lang="ts">
	export let word: string;

	store.setDailyWord(word);

	let timesClicked = 0;
	const onLogoClick = () => {
		timesClicked++;

		if (timesClicked >= 10) {
			store.resetTries();
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
