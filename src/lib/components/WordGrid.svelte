<script lang="ts">
	import { store } from '$lib/store';
	import { cmdMenuOpen } from '$lib/store/cmdMenu';
	import { keyDispatcher } from '$lib/store/keyDispatcher';
	import { range } from '$lib/utils/array';
	import { isLetter, normalizeString } from '$lib/utils/string';
	import type { VariantProps } from 'class-variance-authority';
	import { cva } from 'class-variance-authority';
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';

	// Props
	export let wordSize: number = 5;
	export let maxTries: number = 6;

	// State
	let letterIdx = 0;

	$: isFull = $store.tries[$store.tries.length - 1]?.filter(isLetter).length === wordSize;
	$: hasWon = $store.tries[$store.tries.length - 2]?.join('') === normalizeString($store.dailyWord);

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

	const onKeyDown = (event: Pick<KeyboardEvent, 'metaKey' | 'key' | 'code'>) => {
		if (!!event.metaKey || $cmdMenuOpen || $store.tries.length === maxTries + 1 || hasWon) return;

		let currentWord = $store.tries[$store.tries.length - 1];

		if (event.key === 'ArrowLeft') {
			decrementLetterIdx();
		} else if (event.key === 'ArrowRight') {
			incrementLetterIdx();
		}

		if (event.key.toLowerCase() === 'enter' && isFull) {
			$store.tries = [...$store.tries, ['']];
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

	// Cell component
	const cell = cva('cell', {
		variants: {
			state: {
				correct: 'cell--correct',
				present: 'cell--present',
				absent: 'cell--absent',
				selected: 'cell--selected'
			}
		}
	});

	type CellState = VariantProps<typeof cell>['state'];

	$: getCellState = (row: number, col: number): CellState => {
		const cellLetter = $store.tries[row]?.[col];

		const state: CellState = undefined;

		if (row === $store.tries.length - 1 && col === letterIdx && !hasWon) {
			return 'selected';
		}

		if (row < $store.tries.length - 1) {
			if (cellLetter === normalizeString($store.dailyWord)[col]) {
				return 'correct';
			} else if ($store.dailyWord.includes(cellLetter ?? '')) {
				return 'present';
			} else {
				return 'absent';
			}
		}

		return state;
	};
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="grid" style:--cols={wordSize}>
	{#each range(0, maxTries) as row}
		{#each range(0, wordSize) as col}
			{@const letter = $store.tries[row]?.[col]}

			<div
				class={cell({ state: getCellState(row, col) })}
				style:animation-delay={`${col * 0.25}s`}
				on:click={() => {
					letterIdx = col;
				}}
			>
				{#if letter}
					<span class="letter" transition:scale|local={{ duration: 250 }}>{letter}</span>
				{/if}
			</div>
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

	@keyframes flip {
		0% {
			background-color: transparent;
			border-color: var(--border-color);
			transform: rotateY(0deg);
		}
		50% {
			transform: rotateY(90deg);
			border-color: transparent;
			background-color: transparent;
		}
		100% {
			transform: rotateY(0deg);
			border-color: transparent;
			background-color: var(--flip-bg-color);
		}
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(var(--cols), 1fr);
		gap: 0.5rem;

		animation: scale 1s ease 0.25s;
		animation-fill-mode: backwards;
	}

	.cell {
		display: grid;
		place-items: center;

		cursor: pointer;

		--border-color: var(--palette-grey-20);
		border: 2px solid var(--border-color);
		border-radius: var(--radii-md);

		--size: 3rem;
		width: var(--size);
		height: var(--size);

		text-transform: uppercase;
		font-weight: 800;
		font-size: 1.25rem;
	}

	.cell--selected {
		border-bottom: 2px solid var(--palette-grey-70);
	}

	.cell--disabled {
		pointer-events: none;
	}

	.cell--correct,
	.cell--present,
	.cell--absent {
		animation: flip 0.75s ease;
		animation-fill-mode: backwards;
		background-color: var(--flip-bg-color);
		border-color: transparent;
	}

	.cell--correct {
		--flip-bg-color: hsla(var(--palette-green-50-hsl), 0.5);
	}

	.cell--present {
		--flip-bg-color: hsla(var(--palette-yellow-50-hsl), 0.5);
	}

	.cell--absent {
		--flip-bg-color: hsla(var(--palette-grey-20-hsl), 0.75);
	}

	@media (min-width: 768px) {
		.cell {
			--size: 5rem;
			font-size: 2rem;
		}
	}
</style>
