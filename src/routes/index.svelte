<script lang="ts" context="module">
  import { browser } from '$app/env';
  import Header from '$lib/components/Header.svelte';
  import Keyboard from '$lib/components/Keyboard/Keyboard.svelte';
  import StatsModal from '$lib/components/StatsModal.svelte';
  import Toasts from '$lib/components/Toasts.svelte';
  import WordGrid from '$lib/components/WordGrid/WordGrid.svelte';
  import { supabase } from '$lib/constants';
  import { store } from '$lib/store';
  import { locale } from '$lib/store/locale';
  import { wordStore } from '$lib/store/words';
  import { randomPick } from '$lib/utils/array';
  import { triggerEndgame } from '$lib/utils/state';
  import { normalizeString } from '$lib/utils/string';
  import { fetchWords } from '$lib/utils/words';
  import type { Load } from '.svelte-kit/types/src/routes';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';

  export const load: Load = async () => {
    if (!browser) {
      // Loading the dictionary from the server is too costly, and vercel explodes
      return {
        status: 200,
        props: {
          dailyWord: 'words',
          wordList: []
        }
      };
    }

    const storedLocale = get(locale);
    const words = await fetchWords(storedLocale);

    const { data, error } = await supabase
      .from('daily_words')
      .select('word')
      .eq('created_at', new Date().toISOString().slice(0, 10))
      .eq('lang', get(locale));
    if (error) {
      return { status: 400 };
    }

    if (!data || data.length === 0) {
      const fiveLetterWords = words.reduce<string[]>((acc, curr) => {
        const normalized = normalizeString(curr);
        if (normalized.length === 5) {
          return [...acc, normalized];
        }
        return acc;
      }, []);

      const dailyWord = randomPick(fiveLetterWords);
      console.log(dailyWord, dailyWord.length, dailyWord.split(''));

      const { error } = await supabase
        .from('daily_words')
        .insert({ word: dailyWord, created_at: new Date(), lang: storedLocale });

      if (error) {
        return { status: 400 };
      }

      return {
        status: 200,
        props: {
          dailyWord,
          wordList: words
        }
      };
    }

    return {
      status: 200,
      props: {
        dailyWord: data[0].word,
        wordList: words
      }
    };
  };
</script>

<script lang="ts">
  export let dailyWord: string;
  export let wordList: string[];

  onMount(async () => {
    store.checkVersion();
    store.setDailyWord(dailyWord);
    $wordStore = wordList;
    triggerEndgame($store.gameState, dailyWord);
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
