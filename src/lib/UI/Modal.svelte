<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';

	const modal = cva('modal', {
		variants: {
			visible: { true: 'modal--visible' }
		}
	});

	type ModalProps = VariantProps<typeof modal>;
	export let visible: ModalProps['visible'];
</script>

<div class={modal({ visible })} on:click>
	<div class="content" on:click|stopPropagation>
		<slot />
	</div>
</div>

<style>
	.modal {
		display: grid;
		place-items: center;

		position: fixed;
		background-color: hsla(var(--black-hsl), 0.5);
		width: 100%;
		height: 100%;
		z-index: 10;

		opacity: 0;

		transition: opacity var(--appearance);

		pointer-events: none;
	}

	.modal--visible {
		opacity: 1;
		pointer-events: unset;
	}

	.content {
		background-color: var(--underground);
		border-radius: var(--radii-md);
		padding: 1rem;

		width: clamp(300px, 50vw, 500px);

		opacity: 0;
		transform: scale(0);

		transition: opacity var(--appearance), transform var(--motion-slow);
	}

	.modal--visible .content {
		opacity: 1;
		transform: scale(1);
	}
</style>
