<script lang="ts">
	import { GameState, store } from '$lib/store';
	import { keyDispatcher } from '$lib/store/keyDispatcher';
	import { range } from '$lib/utils/array';
	import { getLetters, isLetter, normalizeString } from '$lib/utils/string';
	import { onMount } from 'svelte';
	import type { CellProps } from './Cell.svelte';
	import Cell from './Cell.svelte';

	// State
	$: normalizedDailyWord = normalizeString($store.dailyWord);
	$: dailyWordLetters = getLetters(normalizedDailyWord);

	$: currentRow = $store.tries.length - 1;

	// Lifecycle
	onMount(() => {
		const listener = keyDispatcher.addListener((key, code) => {
			store.onKeyDown({ key: key.toLowerCase(), code: code ?? '', metaKey: false });
		});

		return () => {
			keyDispatcher.removeListener(listener);
		};
	});

	// Methods
	$: getRowCellsState = (row: number): Array<CellProps['state']> => {
		const result: Array<CellProps['state']> = range(0, $store.wordSize).map(() => undefined);

		if (row === currentRow) {
			result[$store.letterIdx] =
				$store.gameState !== GameState.PLAYING || $store.disabled ? undefined : 'selected';
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

<svelte:window on:keydown={store.onKeyDown} />

<div class="grid" style:--rows={$store.maxTries} style:--cols={$store.wordSize}>
	{#each range(0, $store.maxTries) as row}
		{@const cellsState = getRowCellsState(row)}

		{#each range(0, $store.wordSize) as col}
			{@const letter = $store.tries[row]?.[col]}

			<Cell
				disabled={row !== currentRow}
				state={cellsState[col]}
				{letter}
				{col}
				on:click={() => {
					$store.letterIdx = col;
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
		grid-template-rows: repeat(var(--rows), 1fr);

		font-size: clamp(1rem, 15vw, 5rem);
		gap: 0.15em;

		animation: scale 1s ease 0.25s;
		animation-fill-mode: backwards;
	}
</style>
