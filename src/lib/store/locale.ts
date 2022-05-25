import { Locale } from '$lib/types';
import { localStorageWritable } from './localStorageWritable';

export const locale = localStorageWritable<Locale>('locale', {
  defaultValue: Locale.PT
});
