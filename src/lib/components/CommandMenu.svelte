<script lang="ts">
	import { scale } from 'svelte/transition';
	import { switchTheme } from '../utils/theme';

	type Action = {
		label: string;
		onTrigger: () => void;
	};

	const actions: Action[] = [
		{
			label: 'Change theme',
			onTrigger: switchTheme
		}
	];

	let visible = false;
	let query: string = '';
	let selected: number = 0;

	$: results = actions.filter(({ label }) => label.toLowerCase().includes(query.toLowerCase()));
	$: {
		// Reset selected index when the results size changes
		results.length;
		selected = 0;
	}

	const trigger = (idx: number) => {
		selected = idx;
		results[idx].onTrigger();
	};

	const onKeyDown = (event: KeyboardEvent) => {
		if (!visible) return;

		//  if cmd+k is pressed, toggle visible
		if (event.metaKey && event.key === 'k') {
			visible = !visible;
			event.preventDefault();
		}

		if (event.key === 'Escape') {
			visible = false;
		}

		if (event.key === 'ArrowDown') {
			selected = Math.min(selected + 1, results.length - 1);
		}

		if (event.key === 'ArrowUp') {
			selected = Math.max(selected - 1, 0);
		}

		if (event.key === 'Enter' && selected < results.length) {
			results[selected].onTrigger();
		}
	};
</script>

<svelte:window on:keydown={onKeyDown} />

{#if visible}
	<div
		class="wrapper themed"
		class:empty={results.length === 0}
		transition:scale|local={{ duration: 400 }}
	>
		<!-- 
      svelte-ignore a11y-autofocus 
      (Reason: If the user presses CMD K, it is expected that he'll want to use it immediately.) 
    -->
		<input placeholder="Search..." bind:value={query} autofocus />

		{#if results.length}
			<div class="results">
				{#each results as result, idx}
					<button class="result" class:selected={selected === idx} on:click={() => trigger(idx)}>
						{result.label}</button
					>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style>
	.themed {
		--bg: hsla(var(--palette-grey-90-hsl), 0.05);
		--text-clr: var(--black);
		--border-clr: var(--palette-grey-70);
		--accent-clr: var(--palette-cyan-50);
		--result-bg-hover: hsla(var(--palette-grey-90-hsl), 0.15);
	}

	:global([data-theme='dark']) .themed {
		--bg: var(--palette-grey-15);
		--text-clr: var(--white);
		--border-clr: var(--palette-grey-30);
		--accent-clr: var(--palette-cyan-70);
		--result-bg-hover: var(--palette-grey-20);
	}

	.wrapper {
		display: block;

		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	input {
		background: var(--bg);
		color: var(--text-clr);
		border: 1px solid var(--border-clr);
		border-radius: var(--radii-sm);
		font-size: 1.5rem;

		outline: none;

		padding: 1rem;
	}

	.wrapper:not(.empty) input {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}

	.results {
		background-color: var(--bg);
		border: 1px solid var(--border-clr);
		border-top: none;
		border-radius: var(--radii-sm);
		border-top-left-radius: 0;
		border-top-right-radius: 0;
	}

	.results .result {
		cursor: pointer;
		padding: 1rem;
		border-left: 2px solid transparent;
		width: 100%;
		text-align: left;
	}

	.results :is(.result:hover, .result.selected) {
		background-color: var(--result-bg-hover);
		border-left: 2px solid var(--accent-clr);
	}
</style>
