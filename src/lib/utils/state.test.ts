import { CellState, KeyState } from '$lib/types';
import { getCellStates, getKeyStates } from './state';

test('getCellStates', () => {
	const tests = [
		{
			word: ['W', 'b', 'o', 'd', 'e'],
			dailyWord: 'words',
			expected: [
				CellState.CORRECT,
				CellState.ABSENT,
				CellState.PRESENT,
				CellState.CORRECT,
				CellState.ABSENT
			]
		},
		{
			word: ['W', 'O', 'r', 'd', 's'],
			dailyWord: 'words',
			expected: [
				CellState.CORRECT,
				CellState.CORRECT,
				CellState.CORRECT,
				CellState.CORRECT,
				CellState.CORRECT
			]
		}
	];

	tests.forEach(({ word, dailyWord, expected }) => {
		const result = getCellStates(word, dailyWord);
		expect(result).toEqual(expected);
	});
});

test('getKeyStates', () => {
	const tests = [
		{
			tries: [
				['W', 'b', 'o', 'd', 'e'],
				['W', 'O', 'r', 'd', 's']
			],
			dailyWord: 'words',
			expected: {
				w: KeyState.CORRECT,
				o: KeyState.CORRECT,
				r: KeyState.CORRECT,
				b: KeyState.ABSENT,
				d: KeyState.CORRECT,
				s: KeyState.CORRECT,
				e: KeyState.ABSENT
			}
		},
		{
			tries: [
				['W', 'O', 'r', 'd', 's'],
				['W', 'O', 'r', 'd', 's']
			],
			dailyWord: 'words',
			expected: {
				w: KeyState.CORRECT,
				o: KeyState.CORRECT,
				r: KeyState.CORRECT,
				d: KeyState.CORRECT,
				s: KeyState.CORRECT
			}
		},
		{
			tries: [['o', 'o', 'r', 'd', 's']],
			dailyWord: 'words',
			expected: {
				o: KeyState.CORRECT,
				r: KeyState.CORRECT,
				d: KeyState.CORRECT,
				s: KeyState.CORRECT
			}
		},
		{
			tries: [['o', 'd', 'o', 'd', 's']],
			dailyWord: 'words',
			expected: {
				o: KeyState.PRESENT,
				d: KeyState.CORRECT,
				s: KeyState.CORRECT
			}
		},
		{
			tries: [
				['a', 'b', 'a', 'd', 's'],
				['b', 'a', 'd', 'a', 's']
			],
			dailyWord: 'abada',
			expected: {
				a: KeyState.CORRECT,
				b: KeyState.CORRECT,
				d: KeyState.CORRECT,
				s: KeyState.ABSENT
			}
		},
		{
			tries: [
				['a', 'b', 'a', 'd', 's'],
				['b', 'a', 'a', 'a', 's']
			],
			dailyWord: 'abada',
			expected: {
				a: KeyState.PARTIAL,
				b: KeyState.CORRECT,
				d: KeyState.CORRECT,
				s: KeyState.ABSENT
			}
		},
		{
			tries: [
				['a', 'b', 'a', 'd', 's'],
				['a', 'b', 'a', 'a', 's']
			],
			dailyWord: 'abada',
			expected: {
				a: KeyState.PARTIAL,
				b: KeyState.CORRECT,
				d: KeyState.CORRECT,
				s: KeyState.ABSENT
			}
		},
		{
			tries: [
				['a', 'b', 'a', 'd', 's'],
				['a', 'b', 'a', 'a', 'a']
			],
			dailyWord: 'abada',
			expected: {
				a: KeyState.CORRECT,
				b: KeyState.CORRECT,
				d: KeyState.CORRECT,
				s: KeyState.ABSENT
			}
		}
	];

	tests.forEach(({ tries, dailyWord, expected }) => {
		const result = getKeyStates(tries, dailyWord);
		expect(result).toEqual(expected);
	});
});
