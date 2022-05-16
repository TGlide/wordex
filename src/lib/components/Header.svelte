<script lang="ts">
	import { store } from '$lib/store';
	import { locale } from '$lib/store/locale';
	import { isLocale, Locale, localeMap } from '$lib/types';
	import Select from '$lib/UI/Select.svelte';
	import ThemeSwitch from './ThemeSwitch.svelte';

	let timesClicked = 0;

	const onLogoClick = () => {
		timesClicked++;

		if (timesClicked >= 5) {
			store.resetTries();
			timesClicked = 0;
		}
	};

	const onChange = (e: Event) => {
		const { value } = e.currentTarget as HTMLSelectElement;
		if (!isLocale(value)) return;

		$locale = value;
		location.reload();
	};
</script>

<header>
	<div>
		<ThemeSwitch />
	</div>

	<h1 on:click={onLogoClick}>Wordex</h1>

	<div class="select-wrapper">
		<Select value={$locale} on:change={onChange}>
			<option value={Locale.PT}>{localeMap[Locale.PT]}</option>
			<option value={Locale.EN}>{localeMap[Locale.EN]}</option>
		</Select>
	</div>
</header>

<style>
	header {
		position: relative;
		z-index: 100;

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

	@media (min-width: 768px) {
		h1 {
			font-size: 3rem;
		}
	}
</style>
