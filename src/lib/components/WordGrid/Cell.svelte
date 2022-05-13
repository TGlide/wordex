<script lang="ts" context="module">
	import { ROW_FLIP_DURATION } from '$lib/constants';
	import { cva, type VariantProps } from 'class-variance-authority';
	import { scale } from 'svelte/transition';

	const cell = cva('cell', {
		variants: {
			state: {
				correct: 'cell--correct',
				present: 'cell--present',
				absent: 'cell--absent',
				selected: 'cell--selected'
			},
			disabled: { true: 'cell--disabled' }
		}
	});

	export type CellProps = VariantProps<typeof cell>;
</script>

<script lang="ts">
	export let state: CellProps['state'];
	export let disabled: CellProps['disabled'];
	export let letter: string | null;
	export let col: number;
</script>

<div
	class={cell({ state, disabled })}
	style:animation-delay={`${col * ROW_FLIP_DURATION}ms`}
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
