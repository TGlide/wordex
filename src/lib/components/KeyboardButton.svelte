<script lang="ts">
	import { keyDispatcher } from '$lib/store/keyDispatcher';

	export let key: string;
	export let keyCodes: string[] | undefined = undefined;
	export let gridColumn: string = 'span 3';

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

<button class:pressed on:click={onClick} style:grid-column={gridColumn}>
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
		font-size: clamp(0.5rem, 4vw, 1.25rem);

		width: 100%;
		height: 100%;
		transition: transform var(--motion), opacity var(--appearance);
	}

	button:hover span {
		opacity: 0.9;
	}

	:is(button:active, button.pressed) span {
		transform: translateY(0.25rem);
	}
</style>
