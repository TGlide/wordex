import { getCorrectWord } from '$lib/utils/string';
import { get } from 'svelte/store';
import { localStorageWritable } from './localStorageWritable';
import { wordStore } from './words';

type Word = Array<string | null>;

type Store = {
	tries: Array<Word>;
	dailyWord: string;
};

const createStore = () => {
	const store = localStorageWritable<Store>('store', {
		tries: [[]],
		dailyWord: ''
	});

	const addTry = async () => {
		const words = get(wordStore);

		store.update((prev) => {
			const currentIdx = prev.tries.length - 1;
			const currentTry = prev.tries[currentIdx];
			const correctWord = getCorrectWord(words, currentTry.join(''));

			return {
				...prev,
				tries: [...prev.tries.slice(0, currentIdx), correctWord.split(''), []]
			};
		});
	};

	const resetTries = () => {
		store.update((prev) => ({
			...prev,
			tries: [[]]
		}));
	};

	const setDailyWord = (word: string) => {
		store.update((prev) => {
			console.log(prev);
			return {
				...prev,
				tries: prev.dailyWord === word ? prev.tries : [[]],
				dailyWord: word
			};
		});
	};

	return {
		...store,
		resetTries,
		setDailyWord,
		addTry
	};
};

export const store = createStore();
