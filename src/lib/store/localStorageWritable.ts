import { browser } from '$app/env';
import { objectFilter } from '$lib/utils/object';
import { writable, type Writable } from 'svelte/store';

type Config<T> = {
  defaultValue?: T;
  excludedKeys?: Array<keyof T>;
};

export function localStorageWritable<T>(key: string, config?: Config<T>) {
  const { defaultValue, excludedKeys = [] } = config || {};

  const localStoreItem = browser ? localStorage.getItem(key) : undefined;
  const initialData = localStoreItem ? JSON.parse(localStoreItem) : defaultValue;
  excludedKeys.forEach((key) => {
    initialData[key] = defaultValue?.[key] ?? undefined;
  });

  const store: Writable<T> = writable(initialData);

  const localStorageSet: typeof store.set = (value) => {
    if (browser) {
      const filteredValue =
        typeof value === 'object' && value !== null
          ? objectFilter(value, (v) => v !== undefined)
          : value;

      localStorage.setItem(key, JSON.stringify(filteredValue));
    }
  };

  const set: typeof store.set = (value) => {
    localStorageSet(value);
    store.set(value);
  };

  const update: typeof store.update = (fn) => {
    store.update((prev) => {
      const newValue = fn(prev);
      localStorageSet(newValue);
      return newValue;
    });
  };

  return {
    ...store,
    set,
    update
  };
}
