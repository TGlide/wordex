import { browser } from "$app/environment";
import { PUBLIC_DATABASE_ID, PUBLIC_COLLECTION_ID } from "$env/static/public";
import { databases } from "$lib/services/appwrite";
import { store } from "$lib/store";
import { locale } from "$lib/store/locale";
import type { WordDocument } from "$lib/types/word";
import { isToday } from "$lib/utils/date";
import { fetchWords } from "$lib/utils/words";
import { error } from "@sveltejs/kit";
import { type Models, Query } from "appwrite";

import { get } from "svelte/store";

export async function load() {
  if (!browser) {
    return {
      dailyWord: "thing",
      wordList: null,
    };
  }
  store.checkVersion();
  const storeData = get(store);
  if (isToday(storeData.date) && storeData.dailyWord.length > 0) {
    return {
      dailyWord: storeData.dailyWord,
      wordList: null,
    };
  }
  const storedLocale = get(locale);
  const words = browser ? await fetchWords(storedLocale) : [];
  const todayFormatted = new Date().toISOString().split("T")[0];
  const data: Models.DocumentList<WordDocument> = await databases.listDocuments(
    PUBLIC_DATABASE_ID,
    PUBLIC_COLLECTION_ID,
    [
      Query.equal("lang", get(locale)),
      Query.equal("created_at", todayFormatted),
    ]
  );

  if (!data || data.documents.length === 0) {
    throw error(400);
  }

  return {
    dailyWord: data.documents[0].word,
    wordList: words,
  };
}
