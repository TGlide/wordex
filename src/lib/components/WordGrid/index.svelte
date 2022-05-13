<script lang="ts">
	import { store } from '$lib/store';
	import { cmdMenuOpen } from '$lib/store/cmdMenu';
	import { keyDispatcher } from '$lib/store/keyDispatcher';
	import { range } from '$lib/utils/array';
	import { getLetters, isLetter, normalizeString } from '$lib/utils/string';
	import { onMount } from 'svelte';
	import type { CellProps } from './Cell.svelte';
	import Cell from './Cell.svelte';

	// Props
	export let wordSize: number = 5;
	export let maxTries: number = 6;

	// State
	let letterIdx = 0;

	$: normalizedDailyWord = normalizeString($store.dailyWord);
	$: dailyWordLetters = getLetters(normalizedDailyWord);

	$: currentRow = $store.tries.length - 1;
	$: currentTry = $store.tries[currentRow];
	$: lastTry = $store.tries[$store.tries.length - 2];

	$: isFull = currentTry?.filter(isLetter).length === wordSize;
	$: hasWon = lastTry?.join('') === normalizedDailyWord;

	// Lifecycle
	onMount(() => {
		const listener = keyDispatcher.addListener((key, code) => {
			onKeyDown({ key: key.toLowerCase(), code: code ?? '', metaKey: false });
		});

		return () => {
			keyDispatcher.removeListener(listener);
		};
	});

	// Methods
	const decrementLetterIdx = () => {
		letterIdx = Math.max(letterIdx - 1, 0);
	};

	const incrementLetterIdx = () => {
		letterIdx = Math.min(letterIdx + 1, wordSize - 1);
	};

	const onKeyDown = async (event: Pick<KeyboardEvent, 'metaKey' | 'key' | 'code'>) => {
		if (!!event.metaKey || $cmdMenuOpen || $store.tries.length === maxTries + 1 || hasWon) return;

		let currentWord = $store.tries[$store.tries.length - 1];

		if (event.key === 'ArrowLeft') {
			decrementLetterIdx();
		} else if (event.key === 'ArrowRight') {
			incrementLetterIdx();
		}

		if (event.key.toLowerCase() === 'enter' && isFull) {
			await store.addTry();
			letterIdx = 0;
			currentWord = [];
		}

		if (['Backspace', 'Delete'].includes(event.code)) {
			if (!isLetter(currentWord[letterIdx])) {
				decrementLetterIdx();
			}
			delete currentWord[letterIdx];
		}

		if (isLetter(event.key)) {
			currentWord[letterIdx] = event.key;
			if (!isFull) {
				incrementLetterIdx();
			}
		}

		$store.tries[$store.tries.length - 1] = currentWord;
	};

	$: getRowCellsState = (row: number): Array<CellProps['state']> => {
		const result: Array<CellProps['state']> = range(0, wordSize).map(() => undefined);

		if (row === currentRow) {
			result[letterIdx] = hasWon ? undefined : 'selected';
			return result;
		}

		// Set correct and wrong letters
		const rowTry = $store.tries[row];
		const remainingLetters = { ...dailyWordLetters };
		rowTry?.forEach((value, col) => {
			if (normalizedDailyWord[col] === value) {
				result[col] = 'correct';
				remainingLetters[value]--;
			} else if (!normalizedDailyWord.includes(value ?? '')) {
				result[col] = 'absent';
			}
		});

		// Set partial and other wrong letters
		rowTry?.forEach((value, col) => {
			if (result[col] || !isLetter(value)) return;
			if (remainingLetters[value] > 0) {
				result[col] = 'present';
				remainingLetters[value]--;
			} else {
				result[col] = 'absent';
			}
		});

		return result;
	};
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="grid" style:--cols={wordSize}>
	{#each range(0, maxTries) as row}
		{@const cellsState = getRowCellsState(row)}

		{#each range(0, wordSize) as col}
			{@const letter = $store.tries[row]?.[col]}

			<Cell
				disabled={row !== currentRow}
				state={cellsState[col]}
				{letter}
				{col}
				on:click={() => {
					letterIdx = col;
				}}
			/>
		{/each}
	{/each}
</div>

<style>
	@keyframes scale {
		from {
			opacity: 0;
			transform: scale(0.5);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(var(--cols), 1fr);
		gap: 0.5rem;

		animation: scale 1s ease 0.25s;
		animation-fill-mode: backwards;
	}
</style>
