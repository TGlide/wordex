<script lang="ts">
	import { isDevelopment } from '$lib/constants';
	import { cmdMenuOpen } from '$lib/store/cmdMenu';
	import { keyDispatcher } from '$lib/store/keyDispatcher';
	import { dailyWord, tries } from '$lib/store/tries';
	import { range } from '$lib/utils/array';
	import { isLetter } from '$lib/utils/string';
	import type { VariantProps } from 'class-variance-authority';
	import { cva } from 'class-variance-authority';
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';

	// Props
	export let wordSize: number = 5;
	export let maxTries: number = 6;

	// State
	let letterIdx = 0;
	$: isFull = $tries[$tries.length - 1].filter(isLetter).length === wordSize;

	// Lifecycle
	onMount(() => {
		const listener = keyDispatcher.addListener((key, code) => {
			onKeyDown({ key: key.toLowerCase(), code } as any);
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
		if (!!event.metaKey || $cmdMenuOpen || $tries.length === maxTries + 1) return;

		let currentWord = $tries[$tries.length - 1];

		if (event.key === 'ArrowLeft') {
			decrementLetterIdx();
		} else if (event.key === 'ArrowRight') {
			incrementLetterIdx();
		}

		if (event.key.toLowerCase() === 'enter' && isFull) {
			$tries = [...$tries, ['']];
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

		$tries[$tries.length - 1] = currentWord;
	};

	// Cell component
	const cell = cva('cell', {
		variants: {
			state: {
				correct: 'cell--correct',
				present: 'cell--present',
				absent: 'cell--absent',
				selected: 'cell--selected'
			},
			old: {
				true: 'cell--old'
			}
		}
	});

	type CellState = VariantProps<typeof cell>['state'];

	const getCellState = (
		row: number,
		col: number,
		tries: typeof $tries,
		letterIdx: number
	): CellState => {
		const cellLetter = tries[row]?.[col];

		const state: CellState = undefined;

		if (row === tries.length - 1 && col === letterIdx) {
			return 'selected';
		}

		if (row < tries.length - 1) {
			if (cellLetter === $dailyWord[col]) {
				return 'correct';
			} else if ($dailyWord.includes(cellLetter ?? '')) {
				return 'present';
			} else {
				return 'absent';
			}
		}

		return state;
	};
</script>

<svelte:window on:keydown={onKeyDown} />

<div>
	<div class="grid" style:--cols={wordSize}>
		{#each range(0, maxTries) as row}
			{#each range(0, wordSize) as col}
				{@const letter = $tries[row]?.[col]}

				<div
					class={cell({ state: getCellState(row, col, $tries, letterIdx) })}
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
	{#if isDevelopment}
		<button on:click={tries.reset}>Reset</button>
	{/if}
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

	button {
		display: block;
		margin: 1rem auto;
		text-align: center;
		background-color: var(--palette-grey-20);
		padding: 1rem;
		cursor: pointer;
	}

	@media (min-width: 768px) {
		.cell {
			--size: 5rem;
			font-size: 2rem;
		}
	}
</style>
