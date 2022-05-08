<script lang="ts">
	export let key: string;
	export let keyCodes: string[] | undefined = undefined;

	let pressed = false;

	const eventHasKey = (event: KeyboardEvent) => {
		return event.key.toLowerCase() === key.toLowerCase() || keyCodes?.includes(event.code);
	};

	const onKeyDown = (event: KeyboardEvent) => {
		if (eventHasKey(event)) {
			pressed = true;
		}
	};

	const onKeyUp = (event: KeyboardEvent) => {
		if (eventHasKey(event)) {
			pressed = false;
		}
	};
</script>

<svelte:window on:keydown={onKeyDown} on:keyup={onKeyUp} />

<button class:pressed class:enter={key === 'enter'}>
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
		font-size: 1.25rem;

		--size: 4rem;
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
		width: 10rem;
	}
</style>
