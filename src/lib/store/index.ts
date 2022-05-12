import { localStorageWritable } from './localStorageWritable';

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

	const resetTries = () => {
		store.update((prev) => ({
			...prev,
			tries: [[]]
		}));
	};

	const setDailyWord = (word: string) => {
		resetTries();

		store.update((prev) => ({
			...prev,
			dailyWord: word
		}));
	};

	return {
		...store,
		resetTries,
		setDailyWord
	};
};

export const store = createStore();
