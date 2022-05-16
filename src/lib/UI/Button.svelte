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
		font-size: 1rem;

		padding: 0.75rem 1rem;

		transition: border var(--appearance);
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
		background-color: var(--underground);
		border: 0.1rem solid var(--border);
		color: var(--primary);
	}

	.button--outline:hover {
		border-color: var(--border-hover);
	}

	.button--outline:active {
		border-color: var(--border-active);
	}
</style>
