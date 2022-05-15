<script lang="ts">
	import { toastDispatcher } from '$lib/store/toastDispatcher';
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';

	let toast: string | null = null;
	let timeout: NodeJS.Timeout | null = null;

	onMount(() => {
		const listener = toastDispatcher.addListener((text) => {
			toast = text;
		});

		return () => {
			toastDispatcher.removeListener(listener);
		};
	});

	$: {
		if (toast) {
			timeout && clearTimeout(timeout);
			timeout = setTimeout(() => {
				toast = null;
			}, 30000);
		}
	}

	const onClick = () => {
		toast = null;
		timeout && clearTimeout(timeout);
	};
</script>

<div class="toasts">
	{#if toast}
		<div class="toast" on:click={onClick} transition:scale|local={{ duration: 250 }}>
			{toast}
		</div>
	{/if}
</div>

<style>
	.toasts {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;

		display: flex;
		justify-content: center;
		align-items: baseline;
		pointer-events: none;
	}

	.toast {
		pointer-events: all;

		background-color: var(--palette-cyan-30);
		border-radius: var(--radii-md);
		cursor: pointer;
		font-size: 1.5rem;
		font-weight: 600;
		padding: 0.75rem 1.25rem;

		margin-top: 128px;

		transition: background var(--appearance);
	}

	.toast:hover {
		background-color: hsla(var(--palette-cyan-30-hsl), 0.75);
	}

	.toast:active {
		background-color: var(--palette-cyan-20);
	}
</style>
