import { ROW_FLIP_DURATION } from '$lib/constants';
import { decrement, increment } from '$lib/utils/number';
import { getCorrectWord, isLetter, normalizeString } from '$lib/utils/string';
import { get } from 'svelte/store';
import { localStorageWritable } from './localStorageWritable';
import { wordStore } from './words';

type Word = Array<string | null>;

export enum GameState {
	PLAYING,
	WON,
	LOST
}

type Store = {
	tries: Array<Word>;
	dailyWord: string;
	gameState: GameState;
	wordSize: number;
	maxTries: number;
	letterIdx: number;
	disabled: boolean;
};

const isFull = (word: Word, wordSize: number) => {
	return word.filter(isLetter).length === wordSize;
};

// Utils
const addTry = (prev: Store) => {
	const words = get(wordStore);

	if (prev.gameState !== GameState.PLAYING) {
		return prev;
	}

	let gameState: GameState = prev.gameState;
	const currentRow = prev.tries.length - 1;
	const currentTry = prev.tries[currentRow].join('');
	const correctWord = getCorrectWord(words, currentTry);

	if (normalizeString(prev.dailyWord) === normalizeString(correctWord)) {
		gameState = GameState.WON;
	} else if (currentRow === prev.maxTries) {
		gameState = GameState.LOST;
	}

	return {
		...prev,
		gameState,
		letterIdx: 0,
		tries: [...prev.tries.slice(0, currentRow), correctWord.split(''), []]
	};
};

const decrementLetterIdx = (prev: Store) => {
	return {
		...prev,
		letterIdx: decrement(prev.letterIdx)
	};
};

const incrementLetterIdx = (prev: Store) => {
	return {
		...prev,
		letterIdx: increment(prev.letterIdx, prev.wordSize - 1)
	};
};

const onDelete = (prev: Store) => {
	const currentRow = prev.tries.length - 1;
	const currentTry = prev.tries[currentRow];
	let letterIdx = prev.letterIdx;
	const tries = prev.tries;

	if (!isLetter(currentTry[prev.letterIdx])) {
		letterIdx = decrement(prev.letterIdx);
	}

	delete tries[currentRow][letterIdx];
	return {
		...prev,
		letterIdx,
		tries
	};
};

const onTypeLetter = (prev: Store, letter: string) => {
	const currentRow = prev.tries.length - 1;
	let letterIdx = prev.letterIdx;
	const tries = prev.tries;
	tries[currentRow][prev.letterIdx] = letter;

	if (!isFull(tries[currentRow], prev.wordSize)) {
		letterIdx = increment(prev.letterIdx, prev.wordSize - 1);
	}
	return {
		...prev,
		tries,
		letterIdx
	};
};

const createStore = () => {
	const store = localStorageWritable<Store>('store', {
		defaultValue: {
			tries: [[]],
			dailyWord: '',
			gameState: GameState.PLAYING,
			wordSize: 5,
			maxTries: 6,
			letterIdx: 0,
			disabled: false
		},
		excludedKeys: ['disabled']
	});

	const resetTries = () => {
		store.update((prev) => ({
			...prev,
			gameState: GameState.PLAYING,
			tries: [[]]
		}));
	};

	const setDailyWord = (word: string) => {
		store.update((prev) => {
			return {
				...prev,
				tries: prev.dailyWord === word ? prev.tries : [[]],
				gameState: prev.dailyWord === word ? prev.gameState : GameState.PLAYING,
				dailyWord: word
			};
		});
	};

	const onEnterRow = (prev: Store) => {
		const wordSize = prev.wordSize;

		setTimeout(() => {
			store.update((prev) => {
				return { ...prev, disabled: false };
			});
		}, ROW_FLIP_DURATION * wordSize);

		return { ...addTry(prev), disabled: true };
	};

	const onKeyDown = async (event: Pick<KeyboardEvent, 'metaKey' | 'key' | 'code'>) => {
		store.update((prev) => {
			if (!!event.metaKey || prev.gameState !== GameState.PLAYING || prev.disabled) {
				return prev;
			}

			const currentRow = prev.tries.length - 1;

			if (event.key === 'ArrowLeft') {
				return decrementLetterIdx(prev);
			} else if (event.key === 'ArrowRight') {
				return incrementLetterIdx(prev);
			} else if (
				event.key.toLowerCase() === 'enter' &&
				isFull(prev.tries[currentRow], prev.wordSize)
			) {
				return onEnterRow(prev);
			} else if (['Backspace', 'Delete'].includes(event.code)) {
				return onDelete(prev);
			} else if (isLetter(event.key)) {
				return onTypeLetter(prev, event.key);
			}
			return prev;
		});
	};

	return {
		...store,
		resetTries,
		setDailyWord,
		onKeyDown
	};
};

export const store = createStore();
