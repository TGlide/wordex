<script lang="ts">
  import { statsModalDispatcher } from '$lib/dispatchers/statsModalDispatcher';
  import { toastDispatcher } from '$lib/dispatchers/toastDispatcher';
  import { store } from '$lib/store';
  import { locale } from '$lib/store/locale';
  import { GameState } from '$lib/types';
  import Button from '$lib/UI/Button.svelte';
  import Modal from '$lib/UI/Modal.svelte';
  import { getEndgameShareString } from '$lib/utils/state';
  import copy from 'clipboard-copy';

  let visible = false;

  statsModalDispatcher.addListenerOnMount(() => {
    visible = true;
  });

  $: shareString = getEndgameShareString($store.tries, $store.maxTries, $store.dailyWord, $locale);
  const onShare = () => {
    copy(shareString);
    toastDispatcher.dispatch({ text: 'Copied to clipboard' });
  };
</script>

<Modal {visible} on:click={() => (visible = false)}>
  <div class="content">
    <div>
      <h2>Results</h2>
      <h3>{$store.gameState === GameState.WON ? '🤩' : '😢'}</h3>
      <h4>{$store.tries.length - 1}/{$store.maxTries}</h4>
      <h5>tries</h5>
    </div>
    <Button on:click={onShare}>Share</Button>
  </div>
</Modal>

<style>
  .content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    text-align: center;
    min-height: 400px;

    user-select: none;
  }

  h2 {
    font-family: var(--ff-sans);
    font-weight: 600;
    font-size: 2rem;
    text-align: center;
  }

  h3 {
    font-size: 3rem;
    margin-top: 2rem;
  }

  h4 {
    margin-top: 0.5rem;
    font-size: 2.5rem;
  }

  h5 {
    margin-top: 0.5rem;
    font-size: 1.5rem;
    font-weight: 300;
  }
</style>
