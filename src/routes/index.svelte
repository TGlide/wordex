<script>
	import { switchTheme } from '$lib/utils/theme';
</script>

<section class="container">
	<h1>Index page</h1>
	<button on:click={switchTheme}>Switch theme</button>
</section>

<style>
	section {
		--btn-bg: var(--palette-grey-90);
		--btn-bg-hover: var(--palette-grey-80);
	}

	:global([data-theme='dark']) section {
		--btn-bg: var(--palette-grey-20);
		--btn-bg-hover: var(--palette-grey-30);
	}

	h1 {
		font-family: var(--ff-display);
		font-size: 3rem;
	}

	button {
		background-color: var(--btn-bg);
		border-radius: var(--radii-sm);

		padding: 0.75rem 1rem;
		margin-top: 1rem;
	}

	button:hover {
		cursor: pointer;
		background-color: var(--btn-bg-hover);
	}
</style>
