import { supabase } from '$lib/constants';
import { store } from '$lib/store';
import { locale } from '$lib/store/locale';
import { randomPick } from '$lib/utils/array';
import { isToday } from '$lib/utils/date';
import { normalizeString } from '$lib/utils/string';
import { fetchWords } from '$lib/utils/words';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { browser } from '$app/environment';

export const load: PageLoad = async () => {
  if (!browser) {
    // Loading the dictionary from the server is too costly, and vercel explodes.
    // Also, we're getting values from localStorage, so we can't use it in the server.
    return {
      dailyWord: '',
      wordList: null
    };
  }

  store.checkVersion();
  const storeData = get(store);
  if (isToday(storeData.date) && storeData.dailyWord.length > 0) {
    return {
      dailyWord: storeData.dailyWord,
      wordList: null
    };
  }

  const storedLocale = get(locale);
  const words = await fetchWords(storedLocale);

  const { data, error: sbError } = await supabase
    .from('daily_words')
    .select('word')
    .eq('created_at', new Date().toISOString().slice(0, 10))
    .eq('lang', get(locale));

  if (sbError) {
    throw error(400);
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

    const { error: sbError } = await supabase
      .from('daily_words')
      .insert({ word: dailyWord, created_at: new Date(), lang: storedLocale });

    if (sbError) {
      throw error(400);
    }

    return {
      dailyWord,
      wordList: words
    };
  }

  return {
    dailyWord: data[0].word,
    wordList: words
  };
};
