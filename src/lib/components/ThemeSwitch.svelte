<script lang="ts">
	import Button from '$lib/UI/Button.svelte';
	import Icon from '$lib/UI/Icon.svelte';
	import { switchTheme } from '$lib/utils/theme';
</script>

<Button on:click={switchTheme}>
	<div class="dark">
		<Icon variant="moon" />
	</div>
	<div class="light">
		<Icon variant="sun" />
	</div>
</Button>
