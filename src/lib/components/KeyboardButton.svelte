<script lang="ts">
	import { keyDispatcher } from '$lib/store/keyDispatcher';

	export let key: string;
	export let keyCodes: string[] | undefined = undefined;

	let pressed = false;

	const eventHasKey = (event: KeyboardEvent) => {
		return event.key.toLowerCase() === key.toLowerCase() || keyCodes?.includes(event.code);
	};

	const onKey = (event: KeyboardEvent, action: 'up' | 'down') => {
		if (!event.metaKey && eventHasKey(event)) {
			pressed = action === 'down';
		}
	};

	const onClick = () => {
		pressed = false;

		if (keyCodes) {
			keyDispatcher.dispatch(key, keyCodes[0]);
		} else {
			keyDispatcher.dispatch(key);
		}
	};
</script>

<svelte:window on:keydown={(e) => onKey(e, 'down')} on:keyup={(e) => onKey(e, 'up')} />

<button class:pressed class:enter={key === 'enter'} on:click={onClick}>
	<span>
		{key}
	</span>
</button>

<style>
	button {
		cursor: pointer;
		font-weight: 800;
	}

	span {
		display: grid;
		place-items: center;

		background-color: var(--palette-grey-20);
		border-radius: var(--radii-sm);
		font-size: 1rem;

		--size: 2.15rem;
		width: var(--size);
		height: var(--size);
		transition: transform var(--motion), opacity var(--appearance);
	}

	button:hover span {
		opacity: 0.9;
	}

	:is(button:active, button.pressed) span {
		transform: translateY(0.25rem);
	}

	button.enter span {
		width: 5rem;
	}

	@media (min-width: 768px) {
		span {
			font-size: 1.25rem;
			--size: 4rem;
		}

		button.enter span {
			width: 10rem;
		}
	}
</style>
