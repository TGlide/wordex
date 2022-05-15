<script lang="ts">
	import { store } from '$lib/store';
	import { locale } from '$lib/store/locale';
	import { isLocale, Locale, localeMap } from '$lib/types';

	let timesClicked = 0;

	const onLogoClick = () => {
		timesClicked++;

		if (timesClicked >= 5) {
			store.resetTries();
			timesClicked = 0;
		}
	};

	const onChange = (e: Event & { currentTarget: EventTarget & HTMLSelectElement }) => {
		const { value } = e.currentTarget;
		if (!isLocale(value)) return;

		$locale = value;
		location.reload();
	};
</script>

<header>
	<div />
	<h1 on:click={onLogoClick}>Wordex</h1>

	<div class="select-wrapper">
		<select value={$locale} on:change={onChange}>
			<option value={Locale.PT}>{localeMap[Locale.PT]}</option>
			<option value={Locale.EN}>{localeMap[Locale.EN]}</option>
		</select>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		width: 100%;
		max-width: 500px;
	}

	header > * {
		flex: 1;
		flex-grow: 1;
	}

	h1 {
		font-family: var(--ff-display);
		font-size: 2rem;
		text-align: center;
		font-weight: 600;
		user-select: none;
	}

	.select-wrapper {
		display: flex;
		justify-content: flex-end;
	}

	select {
		background: var(--palette-grey-10);
		border: 0.1rem solid var(--palette-grey-20);
		border-radius: var(--radii-sm);
		color: var(--primary);

		padding: 0.75rem 0.25rem;
		width: 100%;
		max-width: 80px;
	}

	@media (min-width: 768px) {
		h1 {
			font-size: 3rem;
		}
	}
</style>
