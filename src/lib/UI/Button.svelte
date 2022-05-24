<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';

	const button = cva('button', {
		variants: {
			variant: {
				primary: 'button--primary',
				outline: 'button--outline'
			}
		}
	});

	type ButtonProps = VariantProps<typeof button>;
	export let variant: ButtonProps['variant'] = 'primary';
</script>

<button class={button({ variant })} on:click>
	<slot />
</button>

<style>
	.button {
		border-radius: var(--radii-sm);
		cursor: pointer;

		font-weight: 600;
		font-family: var(--ff-sans);
		font-size: var(--btn-font-size, 1rem);

		padding: 0.75em 1em;

		transition: border var(--appearance), background var(--appearance);
	}

	.button--primary {
		background-color: var(--accent);
	}

	.button--primary:hover {
		background-color: var(--accent-hover);
	}

	.button--primary:active {
		background-color: var(--accent-active);
	}

	.button--outline {
		background-color: transparent;
		padding: 0.6em 0.75em;
		color: var(--primary);
	}

	.button--outline:hover {
		background-color: var(--foreground);
	}

	.button--outline:active {
		background-color: hsla(var(--foreground-hsl), 0.8);
	}
</style>
