export const objectIsEqual = (
  objA: Record<string | number | symbol, unknown>,
  objB: Record<string | number | symbol, unknown>
): boolean => {
  return JSON.stringify(objA) === JSON.stringify(objB);
};

// Provides a method with typed keys for Object.keys
export function objectKeys<K extends PropertyKey>(object: Record<K, unknown>): Array<K> {
  return Object.keys(object) as Array<K>;
}

// Provides a method with typed keys for Object.entries
export function objectEntries<K extends PropertyKey, V>(object: Record<K, V>) {
  return Object.entries(object) as Array<[K, V]>;
}

export function objectFromEntries<K extends PropertyKey, V>(entries: Array<[K, V]>): Record<K, V> {
  return Object.fromEntries(entries) as Record<K, V>;
}

export function objectFilter<K extends PropertyKey, V>(
  object: Partial<Record<K, V>>,
  predicate: (key: K, value: V) => boolean
): Partial<Record<K, V>> {
  return Object.fromEntries(
    Object.entries(object).filter(([key, value]) => predicate(key as K, value as V))
  ) as Partial<Record<K, V>>;
}

// Receives an array and an item, returns true if the item is past the middle of the array
export function isPastMiddleInArray<T>(array: Array<T>, item: T): boolean {
  return array.indexOf(item) > Math.floor(array.length / 2);
}
