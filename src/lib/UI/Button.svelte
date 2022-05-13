<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';

	const button = cva('button', {
		variants: {
			variant: {
				primary: 'button--primary'
			}
		}
	});

	type ButtonProps = VariantProps<typeof button>;
	export let variant: ButtonProps['variant'] = 'primary';
</script>

<button class={button({ variant })}>
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

		transition: all var(--appearance);
	}

	.button--primary {
		background-color: var(--palette-cyan-50);
	}

	.button--primary:hover {
		background-color: var(--palette-cyan-40);
	}

	.button--primary:active {
		background-color: var(--palette-cyan-30);
	}
</style>
