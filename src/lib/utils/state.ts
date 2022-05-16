import { statsModalDispatcher } from '$lib/dispatchers/statsModalDispatcher';
import { toastDispatcher } from '$lib/dispatchers/toastDispatcher';
import { CellState, GameState, KeyState, Locale, localeMap, type Word } from '$lib/types';
import { range } from './array';
import { objectEntries } from './object';
import { getLetters, isLetter, normalizeString } from './string';

export const getCellStates = (word: Word, dailyWord: string): Array<CellState | undefined> => {
	const normalizedDailyWord = normalizeString(dailyWord);
	const normalizedWord = normalizeString(word.join('')).split('');
	const dailyWordLetters = getLetters(normalizedDailyWord);
	const wordSize = dailyWord.length;

	const result: Array<CellState | undefined> = range(0, wordSize).map(() => undefined);

	// Set correct and wrong letters
	const remainingLetters = { ...dailyWordLetters };
	normalizedWord?.forEach((value, col) => {
		if (normalizedDailyWord[col] === value) {
			result[col] = CellState.CORRECT;
			remainingLetters[value]--;
		} else if (!normalizedDailyWord.includes(value ?? '')) {
			result[col] = CellState.ABSENT;
		}
	});

	// Set partial and other wrong letters
	normalizedWord?.forEach((value, col) => {
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

export const getKeyStates = (tries: Word[], dailyWord: string): Record<string, KeyState> => {
	const result: Record<string, KeyState> = {};

	const maxCellStateMap: Record<string, Record<CellState, number>> = {};
	const perceivedLetterPresence: Record<string, number> = {};

	tries.forEach((word, row) => {
		const cellStates = getCellStates(word, dailyWord);
		const cellStateMap: Record<string, Record<CellState, number>> = {};

		cellStates.forEach((cellState, col) => {
			const letter = normalizeString(tries[row][col] ?? '');
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

export const triggerEndgame = (gameState: GameState, dailyWord: string) => {
	if (gameState === GameState.PLAYING) return;

	statsModalDispatcher.dispatch();
	if (gameState === GameState.LOST) {
		toastDispatcher.dispatch({
			text: `Correct word: ${dailyWord}`,
			duration: -1,
			dismissable: false
		});
	} else {
		toastDispatcher.dispatch({ text: `You won!` });
	}
};

const cellStateEmojiMap = {
	[CellState.PRESENT]: '🟨',
	[CellState.ABSENT]: '⬛',
	[CellState.CORRECT]: '🟩'
};

export const getEndgameShareString = (
	tries: Word[],
	maxTries: number,
	dailyWord: string,
	locale: Locale
): string => {
	let str = `Wordex (${localeMap[locale]}) ${tries.length - 1}/${maxTries}\n\n`;

	tries.slice(0, -1).forEach((word) => {
		const cellStates = getCellStates(word, dailyWord);
		cellStates.forEach((cellState) => {
			str += cellStateEmojiMap[cellState ?? CellState.ABSENT] ?? '';
		});

		str += '\n';
	});

	str += '\nTry it yourself at wordex.app!';

	return str;
};
