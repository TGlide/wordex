<script lang="ts">
	import { wordStore } from '$lib/store';
	import { range } from '$lib/utils/array';
	import { isLetter } from '$lib/utils/string';
	import { scale } from 'svelte/transition';

	export let wordSize: number = 5;
	export let maxTries: number = 6;

	let letterIdx = 0;

	$: isFull = $wordStore[$wordStore.length - 1].filter(isLetter).length === wordSize;

	const decrementLetterIdx = () => {
		letterIdx = Math.max(letterIdx - 1, 0);
	};

	const incrementLetterIdx = () => {
		letterIdx = Math.min(letterIdx + 1, wordSize - 1);
	};

	const onKeyDown = (event: KeyboardEvent) => {
		if ($wordStore.length === maxTries + 1) return;

		let currentWord = $wordStore[$wordStore.length - 1];

		if (event.key === 'ArrowLeft') {
			decrementLetterIdx();
		}

		if (event.key === 'ArrowRight') {
			incrementLetterIdx();
		}

		if (event.key === 'Enter' && isFull) {
			$wordStore = [...$wordStore, ['']];
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

		$wordStore[$wordStore.length - 1] = currentWord;
	};
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="grid" style:--cols={wordSize}>
	{#each range(0, maxTries) as row}
		{#each range(0, wordSize) as col}
			{@const selected = row === $wordStore.length - 1 && col === letterIdx}
			{@const disabled = row !== $wordStore.length - 1}
			{@const letter = $wordStore[row]?.[col]}

			<div
				class="cell"
				class:disabled
				class:selected
				on:click={() => {
					if (disabled) return;
					letterIdx = col;
				}}
			>
				{#if letter}
					<span class="letter" transition:scale={{ duration: 250 }}>{letter}</span>
				{/if}
			</div>
		{/each}
	{/each}
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(var(--cols), 1fr);
		gap: 1rem 0.5rem;
	}

	.cell {
		display: grid;
		place-items: center;

		border: 1px solid var(--palette-grey-40);
		border-radius: var(--radii-sm);

		--size: 5rem;
		width: var(--size);
		height: var(--size);

		text-transform: uppercase;
		font-weight: 800;
		font-size: 2rem;
	}

	.cell:not(.disabled) {
		cursor: pointer;
	}

	.cell.selected {
		border-bottom: 2px solid var(--palette-grey-70);
	}
</style>
