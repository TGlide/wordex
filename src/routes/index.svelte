<script lang="ts" context="module">
	import Keyboard from '$lib/components/Keyboard.svelte';
	import WordGrid from '$lib/components/WordGrid/index.svelte';
	import { supabase } from '$lib/constants';
	import { store } from '$lib/store';
	import { randomPick } from '$lib/utils/array';
	import type { Load } from '.svelte-kit/types/src/routes';

	export const load: Load = async ({ fetch }) => {
		const { data, error } = await supabase
			.from('daily_words')
			.select('word')
			.eq('created_at', new Date().toISOString().slice(0, 10));

		if (error) {
			return { status: 400 };
		}

		if (!data || data.length === 0) {
			const res = await fetch('words/ptBr.txt');
			const text = await res.text();
			const words = text.split('\n');
			const fiveLetterWords = words.filter((word) => word.length === 5);

			const dailyWord = randomPick(fiveLetterWords);

			const { error } = await supabase
				.from('daily_words')
				.insert({ word: dailyWord, created_at: new Date() });

			if (error) {
				return { status: 400 };
			}

			return {
				status: 200,
				props: {
					dailyWord
				}
			};
		}

		return {
			status: 200,
			props: {
				dailyWord: data[0].word
			}
		};
	};
</script>

<script lang="ts">
	export let dailyWord: string;

	store.setDailyWord(dailyWord);

	let timesClicked = 0;
	const onLogoClick = () => {
		timesClicked++;

		if (timesClicked >= 5) {
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
