<script lang="ts">
	import { store } from '$lib/store';
	import { toastDispatcher } from '$lib/store/toastDispatcher';
	import { GameState } from '$lib/types';
	import Button from '$lib/UI/Button.svelte';
	import Modal from '$lib/UI/Modal.svelte';
	import { getEndgameShareString } from '$lib/utils/state';
	import copy from 'clipboard-copy';

	$: visible = $store.gameState !== GameState.PLAYING && !$store.disabled;
	$: shareString = getEndgameShareString($store);
	$: {
		(() => {
			if (!visible) return;
			if ($store.gameState === GameState.LOST) {
				toastDispatcher.dispatch({
					text: `Correct word: ${$store.dailyWord}`,
					duration: -1,
					dismissable: false
				});
			} else {
				toastDispatcher.dispatch({ text: `You won!` });
			}
		})();
	}

	let timesClicked = 0;

	const onResultsClick = () => {
		timesClicked++;

		if (timesClicked >= 5) {
			store.resetTries();
			timesClicked = 0;
		}
	};

	const onShare = () => {
		copy(shareString);
		toastDispatcher.dispatch({ text: 'Copied to clipboard' });
	};
</script>

<Modal {visible}>
	<div class="content">
		<div>
			<h1 on:click={onResultsClick}>Results</h1>
			<h2>{$store.gameState === GameState.WON ? '🤩' : '😢'}</h2>
			<h3>{$store.tries.length - 1}/{$store.maxTries}</h3>
			<h4>tries</h4>
		</div>
		<Button on:click={onShare}>Share</Button>
	</div>
</Modal>

<style>
	.content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;

		text-align: center;
		min-height: 400px;

		user-select: none;
	}

	h1 {
		font-family: var(--ff-display);
		font-weight: 600;
		font-size: 2rem;
		text-align: center;
	}

	h2 {
		font-size: 3rem;
		margin-top: 2rem;
	}

	h3 {
		margin-top: 0.5rem;
		font-size: 2.5rem;
	}

	h4 {
		font-family: var(--ff-display);
		margin-top: 0.5rem;
		font-size: 1.5rem;
		font-weight: 600;
	}
</style>
