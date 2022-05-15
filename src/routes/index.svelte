<script lang="ts" context="module">
	import { browser } from '$app/env';
	import EndgameModal from '$lib/components/EndgameModal.svelte';
	import Keyboard from '$lib/components/Keyboard.svelte';
	import WordGrid from '$lib/components/WordGrid/index.svelte';
	import { supabase } from '$lib/constants';
	import { store } from '$lib/store';
	import { wordStore } from '$lib/store/words';
	import { randomPick } from '$lib/utils/array';
	import type { Load } from '.svelte-kit/types/src/routes';
	import { onMount } from 'svelte';

	export const load: Load = async ({ fetch }) => {
		if (!browser) {
			// Loading the dictionary from the server is too costly, and vercel explodes
			return {
				status: 200,
				props: {
					dailyWord: 'words',
					wordList: []
				}
			};
		}

		const res = await fetch('words/ptBr.txt');
		const text = await res.text();
		const words = text.split('\n');

		const { data, error } = await supabase
			.from('daily_words')
			.select('word')
			.eq('created_at', new Date().toISOString().slice(0, 10));

		if (error) {
			return { status: 400 };
		}

		if (!data || data.length === 0) {
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
					dailyWord,
					wordList: words
				}
			};
		}

		return {
			status: 200,
			props: {
				dailyWord: data[0].word,
				wordList: words
			}
		};
	};
</script>

<script lang="ts">
	export let dailyWord: string;
	export let wordList: string[];

	onMount(async () => {
		store.checkVersion();
		store.setDailyWord(dailyWord);
		$wordStore = wordList;
	});

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
	<EndgameModal />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		height: 100%;
	}

	h1 {
		font-family: var(--ff-display);
		font-size: 2rem;
		text-align: center;
		font-weight: 600;
		user-select: none;
	}

	@media (min-width: 768px) {
		h1 {
			font-size: 3rem;
		}

		section {
			height: 100vh;
		}
	}
</style>
