<script>
	import KeyboardButton from './KeyboardButton.svelte';
</script>

<div class="wrapper">
	<section>
		<KeyboardButton key="Q" />
		<KeyboardButton key="W" />
		<KeyboardButton key="E" />
		<KeyboardButton key="R" />
		<KeyboardButton key="T" />
		<KeyboardButton key="Y" />
		<KeyboardButton key="U" />
		<KeyboardButton key="I" />
		<KeyboardButton key="O" />
		<KeyboardButton key="P" />
	</section>
	<section>
		<KeyboardButton key="A" />
		<KeyboardButton key="S" />
		<KeyboardButton key="D" />
		<KeyboardButton key="F" />
		<KeyboardButton key="G" />
		<KeyboardButton key="H" />
		<KeyboardButton key="J" />
		<KeyboardButton key="K" />
		<KeyboardButton key="L" />
		<KeyboardButton key="del" keyCodes={['Backspace', 'Delete']} />
	</section>
	<section>
		<KeyboardButton key="Z" />
		<KeyboardButton key="X" />
		<KeyboardButton key="C" />
		<KeyboardButton key="V" />
		<KeyboardButton key="B" />
		<KeyboardButton key="N" />
		<KeyboardButton key="M" />
		<KeyboardButton key="enter" />
	</section>
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	section {
		display: flex;
		gap: 0.25rem;
		margin-top: 0.5rem;
	}

	@media (min-width: 768px) {
		section {
			gap: 1rem;
			margin-top: 1rem;
		}
	}
</style>
