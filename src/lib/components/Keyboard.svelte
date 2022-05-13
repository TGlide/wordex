<script>
	import KeyboardButton from './KeyboardButton.svelte';
</script>

<div class="wrapper">
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
	<KeyboardButton key="A" gridColumn="3 / span 3" />
	<KeyboardButton key="S" />
	<KeyboardButton key="D" />
	<KeyboardButton key="F" />
	<KeyboardButton key="G" />
	<KeyboardButton key="H" />
	<KeyboardButton key="J" />
	<KeyboardButton key="K" />
	<KeyboardButton key="L" />
	<KeyboardButton key="del" keyCodes={['Backspace', 'Delete']} />
	<KeyboardButton key="Z" gridColumn="4 / span 3" />
	<KeyboardButton key="X" />
	<KeyboardButton key="C" />
	<KeyboardButton key="V" />
	<KeyboardButton key="B" />
	<KeyboardButton key="N" />
	<KeyboardButton key="M" />
	<KeyboardButton key="enter" gridColumn="span 8" />
</div>

<style>
	.wrapper {
		display: grid;
		gap: clamp(0.15rem, 1vw, 1rem);
		grid-template-rows: repeat(3, 1fr);
		grid-template-columns: repeat(32, 1fr);
		justify-content: center;

		width: 100%;
		max-width: 900px;
		height: 25vh;
		max-height: 250px;
	}

	@media (min-width: 768px) {
	}
</style>
