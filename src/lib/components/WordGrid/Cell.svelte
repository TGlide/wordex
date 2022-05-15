<script lang="ts" context="module">
	import { ROW_FLIP_DELAY, ROW_FLIP_DURATION } from '$lib/constants';
	import { CellState } from '$lib/types';
	import { cva, type VariantProps } from 'class-variance-authority';
	import { scale } from 'svelte/transition';

	const cell = cva('cell', {
		variants: {
			state: {
				[CellState.CORRECT]: 'cell--correct',
				[CellState.PRESENT]: 'cell--present',
				[CellState.ABSENT]: 'cell--absent'
			},
			selected: {
				true: 'cell--selected'
			},
			disabled: { true: 'cell--disabled' }
		}
	});

	export type CellProps = VariantProps<typeof cell>;
</script>

<script lang="ts">
	export let state: CellProps['state'];
	export let disabled: CellProps['disabled'];
	export let selected: CellProps['selected'];
	export let letter: string | null;
	export let col: number;
</script>

<div
	class={cell({ state, disabled, selected })}
	style:animation-delay={`${col * ROW_FLIP_DELAY}ms`}
	style:animation-duration={`${ROW_FLIP_DURATION}ms`}
	on:click
>
	{#if letter}
		<span class="letter" transition:scale|local={{ duration: 250 }}>{letter}</span>
	{/if}
</div>

<style>
	@keyframes flip {
		0% {
			background-color: transparent;
			border-color: var(--border);
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

	.cell {
		display: grid;
		place-items: center;

		cursor: pointer;

		border: 0.025em solid var(--border);
		border-radius: 10%;

		--size: 1em;
		width: var(--size);
		height: var(--size);

		text-transform: uppercase;
		font-weight: 800;
	}

	.cell--selected:not(.cell--disabled) {
		border-bottom-color: var(--palette-grey-70);
	}

	.cell--disabled {
		pointer-events: none;
	}

	.cell--correct,
	.cell--present,
	.cell--absent {
		animation: flip ease;
		animation-fill-mode: backwards;
		background-color: var(--flip-bg-color);
		border-color: transparent;
	}

	.cell--correct {
		--flip-bg-color: var(--correct);
	}

	.cell--present {
		--flip-bg-color: var(--present);
	}

	.cell--absent {
		--flip-bg-color: var(--absent);
	}

	.letter {
		font-size: 0.5em;
	}
</style>
