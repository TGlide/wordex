<script lang="ts">
	import { store } from '$lib/store';
	import { keyDispatcher } from '$lib/store/keyDispatcher';
	import { range } from '$lib/utils/array';
	import { getRowStates } from '$lib/utils/state';
	import { getLetters, normalizeString } from '$lib/utils/string';
	import { onMount } from 'svelte';
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
	$: getRowCellsState = (row: number) => getRowStates($store, row);
</script>

<svelte:window on:keydown={store.onKeyDown} />

<div class="grid" style:--rows={$store.maxTries} style:--cols={$store.wordSize}>
	{#each range(0, $store.maxTries) as row}
		{@const cellsState = getRowCellsState(row)}

		{#each range(0, $store.wordSize) as col}
			{@const letter = $store.tries[row]?.[col]}
			{@const selected = row === currentRow && $store.letterIdx === col}

			<Cell
				disabled={row !== currentRow || $store.disabled}
				state={cellsState[col]}
				{selected}
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
