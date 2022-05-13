import { writable } from 'svelte/store';

export const wordStore = writable<Array<string>>([]);
