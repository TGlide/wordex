<script lang="ts">
  import Header from "$lib/components/Header.svelte";
  import Keyboard from "$lib/components/Keyboard/Keyboard.svelte";
  import StatsModal from "$lib/components/StatsModal.svelte";
  import Toasts from "$lib/components/Toasts.svelte";
  import WordGrid from "$lib/components/WordGrid/WordGrid.svelte";
  import { store } from "$lib/store";
  import { locale } from "$lib/store/locale";
  import { wordStore } from "$lib/store/words";
  import { triggerEndgame } from "$lib/utils/state";
  import { fetchWords } from "$lib/utils/words";
  import { onMount } from "svelte";

  export let data;

  onMount(async () => {
    store.setDailyWord(data.dailyWord);
    $wordStore = data.wordList ?? (await fetchWords($locale));
    triggerEndgame($store.gameState, data.dailyWord);
  });
</script>

<Toasts />
<StatsModal />
<section class="container themed">
  <Header />
  <WordGrid />
  <Keyboard />
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    height: 100%;
  }
</style>
