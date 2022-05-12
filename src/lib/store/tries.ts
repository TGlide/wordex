import { writable } from 'svelte/store';
import { localStorageWritable } from './localStorageWritable';

type Word = Array<string | null>;

const createTriesStore = () => {
	const store = localStorageWritable<Array<Word>>('word', [[]]);

	const reset = () => {
		store.set([[]]);
	};

	return {
		...store,
		reset
	};
};

export const tries = createTriesStore();

export const dailyWord = writable<string>('lover');
