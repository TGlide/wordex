import { writable } from 'svelte/store';

type Word = Array<string | null>;

const createWordStore = () => {
	const store = writable<Array<Word>>([[]]);

	return {
		...store
	};
};

export const wordStore = createWordStore();
