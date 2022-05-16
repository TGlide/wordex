<script lang="ts">
	import { statsModalDispatcher } from '$lib/dispatchers/statsModalDispatcher';
	import { clearToastDispatcher } from '$lib/dispatchers/toastDispatcher';
	import { store } from '$lib/store';
	import { locale } from '$lib/store/locale';
	import { isLocale, Locale, localeMap } from '$lib/types';
	import Button from '$lib/UI/Button.svelte';
	import Icon from '$lib/UI/Icon.svelte';
	import Select from '$lib/UI/Select.svelte';
	import ThemeSwitch from './ThemeSwitch.svelte';

	let timesClicked = 0;

	const onLogoClick = () => {
		timesClicked++;

		if (timesClicked >= 5) {
			store.resetTries();
			clearToastDispatcher.dispatch();
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
	<div class="actions">
		<ThemeSwitch />
		<Button variant="outline" on:click={() => statsModalDispatcher.dispatch()}>
			<Icon variant="bar-chart" />
		</Button>
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
		font-size: clamp(1.5rem, 4vw, 3rem);
		text-align: center;
		font-weight: 600;
		user-select: none;
	}

	.actions {
		display: flex;
		gap: clamp(0.1rem, 1vw, 0.5rem);
	}

	.select-wrapper {
		display: flex;
		justify-content: flex-end;
	}
</style>
