import type { Store } from '$lib/store';
import { CellState } from '$lib/types';
import { range } from './array';
import { getLetters, isLetter, normalizeString } from './string';

export const getRowStates = (store: Store, row: number): Array<CellState | undefined> => {
	const currentRow = store.tries.length - 1;
	const normalizedDailyWord = normalizeString(store.dailyWord);
	const dailyWordLetters = getLetters(normalizedDailyWord);

	const result: Array<CellState | undefined> = range(0, store.wordSize).map(() => undefined);

	if (row >= currentRow) {
		return result;
	}

	// Set correct and wrong letters
	const rowTry = store.tries[row];
	const remainingLetters = { ...dailyWordLetters };
	rowTry?.forEach((value, col) => {
		if (normalizedDailyWord[col] === value) {
			result[col] = CellState.CORRECT;
			remainingLetters[value]--;
		} else if (!normalizedDailyWord.includes(value ?? '')) {
			result[col] = CellState.ABSENT;
		}
	});

	// Set partial and other wrong letters
	rowTry?.forEach((value, col) => {
		if (result[col] || !isLetter(value)) return;
		if (remainingLetters[value] > 0) {
			console.log('hhh');
			result[col] = CellState.PRESENT;
			remainingLetters[value]--;
		} else {
			result[col] = CellState.ABSENT;
		}
	});

	return result;
};

const cellStateEmojiMap = {
	[CellState.PRESENT]: '🟨',
	[CellState.ABSENT]: '⬛',
	[CellState.CORRECT]: '🟩'
};

export const getEndgameShareString = (store: Store): string => {
	const storeState = range(0, store.tries.length - 1).map((row) => getRowStates(store, row));
	let str = `Wordex ${store.tries.length - 1}/${store.maxTries}\n\n`;

	storeState.forEach((row) => {
		row.forEach((col) => {
			str += cellStateEmojiMap[col ?? CellState.ABSENT] ?? '';
		});

		str += '\n';
	});

	str += '\nTry it yourself at wordex.app!';

	return str;
};
