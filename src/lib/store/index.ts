import { projectVersion, ROW_FLIP_DELAY, ROW_FLIP_DURATION } from '$lib/constants';
import { toastDispatcher } from '$lib/dispatchers/toastDispatcher';
import type { Word } from '$lib/types';
import { GameState } from '$lib/types';
import { decrement, increment } from '$lib/utils/number';
import { getCorrectWord, isLetter, normalizeString } from '$lib/utils/string';
import { get } from 'svelte/store';
import { localStorageWritable } from './localStorageWritable';
import { wordStore } from './words';

export type Store = {
	tries: Array<Word>;
	dailyWord: string;
	gameState: GameState;
	wordSize: number;
	maxTries: number;
	letterIdx: number;
	disabled: boolean;
	version: string;
};

const isFull = (word: Word, wordSize: number) => {
	return word.filter(isLetter).length === wordSize;
};

// Utils
const rowFlipCallback = (rowSize: number, callback: () => void) => {
	// Callback after row finishes flipping
	setTimeout(callback, ROW_FLIP_DELAY * rowSize + ROW_FLIP_DURATION);
};

const addTry = (prev: Store) => {
	if (prev.gameState !== GameState.PLAYING) {
		return prev;
	}

	const words = get(wordStore);

	let gameState: GameState = prev.gameState;
	const currentRow = prev.tries.length - 1;
	const currentTry = prev.tries[currentRow].join('');

	if (normalizeString(prev.dailyWord) === normalizeString(currentTry)) {
		gameState = GameState.WON;
		rowFlipCallback(prev.wordSize, () => toastDispatcher.dispatch({ text: `You won!` }));
	} else if (currentRow >= prev.maxTries - 1) {
		gameState = GameState.LOST;
	}

	const correctTrySpelling = getCorrectWord(words, currentTry);

	return {
		...prev,
		gameState,
		letterIdx: 0,
		tries: [...prev.tries.slice(0, currentRow), correctTrySpelling.split(''), []]
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
	const defaultValue = {
		tries: [[]],
		dailyWord: '',
		gameState: GameState.PLAYING,
		wordSize: 5,
		maxTries: 6,
		letterIdx: 0,
		disabled: false,
		version: '0.0.0'
	};

	const store = localStorageWritable<Store>('store', {
		defaultValue,
		excludedKeys: ['disabled']
	});

	const checkVersion = () => {
		if (get(store).version !== projectVersion) {
			store.set({ ...defaultValue, version: projectVersion });
		}
	};

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
		rowFlipCallback(prev.wordSize, () => {
			store.update((prev) => {
				return { ...prev, disabled: false };
			});
		});

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
		onKeyDown,
		checkVersion
	};
};

export const store = createStore();
