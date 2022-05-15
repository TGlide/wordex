import type { Locale } from '$lib/types';

export const fetchWords = async (locale: Locale) => {
	const res = await fetch(`words/${locale}.txt`);
	const text = await res.text();
	const words = text.split('\n');

	return words;
};
