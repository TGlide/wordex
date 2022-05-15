import type { Store } from '$lib/store';
import { CellState, KeyState } from '$lib/types';
import { range } from './array';
import { objectEntries } from './object';
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
			result[col] = CellState.PRESENT;
			remainingLetters[value]--;
		} else {
			result[col] = CellState.ABSENT;
		}
	});

	return result;
};

export const getStoreState = (store: Store) => {
	return range(0, store.tries.length - 1).map((row) => getRowStates(store, row));
};

export const getKeyStates = (store: Store): Record<string, KeyState> => {
	const result: Record<string, KeyState> = {};

	const storeState = getStoreState(store);
	const maxCellStateMap: Record<string, Record<CellState, number>> = {};
	const perceivedLetterPresence: Record<string, number> = {};

	storeState.forEach((row, rowIdx) => {
		const cellStateMap: Record<string, Record<CellState, number>> = {};

		row.forEach((cellState, col) => {
			const letter = normalizeString(store.tries[rowIdx][col] ?? '');
			if (!cellState || !letter) return;

			cellStateMap[letter] = {
				correct: (cellStateMap[letter]?.correct ?? 0) + (cellState === CellState.CORRECT ? 1 : 0),
				absent: (cellStateMap[letter]?.absent ?? 0) + (cellState === CellState.ABSENT ? 1 : 0),
				present: (cellStateMap[letter]?.present ?? 0) + (cellState === CellState.PRESENT ? 1 : 0)
			};
		});

		objectEntries(cellStateMap).forEach(([letter, cellStates]) => {
			maxCellStateMap[letter] = {
				correct: Math.max(maxCellStateMap[letter]?.correct ?? 0, cellStates.correct),
				absent: Math.max(maxCellStateMap[letter]?.absent ?? 0, cellStates.absent),
				present: Math.max(maxCellStateMap[letter]?.present ?? 0, cellStates.present)
			};

			perceivedLetterPresence[letter] = Math.max(
				perceivedLetterPresence[letter] ?? 0,
				cellStates.correct + cellStates.present
			);
		});
	});

	objectEntries(maxCellStateMap).forEach(([letter, cellStateMap]) => {
		if (cellStateMap.correct > 0) {
			result[letter] =
				cellStateMap.correct >= perceivedLetterPresence[letter]
					? KeyState.CORRECT
					: KeyState.PARTIAL;
		} else if (cellStateMap.present > 0) {
			result[letter] = KeyState.PRESENT;
		} else if (cellStateMap.absent > 0) {
			result[letter] = KeyState.ABSENT;
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
	const storeState = getStoreState(store);
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
