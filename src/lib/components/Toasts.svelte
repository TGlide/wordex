<script lang="ts">
	import { toastDispatcher, type Toast } from '$lib/store/toastDispatcher';
	import { scale } from 'svelte/transition';

	const DEFAULT_DURATION = 5000;

	let toast: Toast | null = null;
	let timeout: NodeJS.Timeout | null = null;

	toastDispatcher.addListenerOnMount((t) => (toast = t));

	$: {
		if (toast) {
			timeout && clearTimeout(timeout);

			if ((toast.duration ?? 0) >= 0) {
				timeout = setTimeout(() => {
					toast = null;
				}, toast.duration ?? DEFAULT_DURATION);
			}
		}
	}

	const onClick = () => {
		if (toast?.dismissable === false) return;
		toast = null;
		timeout && clearTimeout(timeout);
	};
</script>

<div class="toasts">
	{#if toast}
		<div
			class="toast"
			class:disabled={toast.dismissable === false}
			on:click={onClick}
			transition:scale|local={{ duration: 250 }}
		>
			{toast.text}
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
		z-index: 100;

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

	.toast.disabled {
		cursor: default;
	}

	.toast:hover:not(.disabled) {
		background-color: hsla(var(--palette-cyan-30-hsl), 0.75);
	}

	.toast:active:not(.disabled) {
		background-color: var(--palette-cyan-20);
	}
</style>
