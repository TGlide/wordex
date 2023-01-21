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

/**
 * Strict typed `Object.entries`
 * Extracted from https://github.com/antfu/utils
 *
 * @category Object
 */
export function objectEntries<T extends object>(obj: T) {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
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

type KeyTypesMap<T> = Record<keyof T, Array<string> | ((v: unknown) => boolean) | string>;

/**
 * Checks if the given value is an object of type T, given a map of keys and
 * their types/validators.
 * @date 9/27/2022 - 11:20:54 AM
 *
 * @category Object
 *
 * @template T
 * @param {unknown} object
 * @param {KeyTypesMap} keyTypesMap
 * @returns {value is T}
 *
 * @example
 * ```
 * type ExampleType = {
 *   a: string;
 *   b: number;
 *   c: string | number;
 *   d: string[]
 *   e: {
 *     f: string;
 *     g: number;
 *   }
 * }
 *
 * export const isExampleType = (value: unknown): value is ExampleType => {
 *   return isObjectType(value, {
 *     a: 'string',
 *     b: 'number',
 *     c: ['string', 'number'],
 *     d: (v) => Array.isArray(v) && v.every((v) => typeof v === 'string'),
 *     e: (v) => isObjectType(v, {
 *       f: 'string',
 *       g: 'number',
 *     }),
 *   });
 * };
 * ```
 */
export const isObjectType = <T>(
  object: unknown,
  keyTypesMap: Partial<KeyTypesMap<T>>
): object is T => {
  if (typeof object !== 'object' || object === null) {
    return false;
  }

  for (const [key, check] of objectEntries(keyTypesMap)) {
    const value = (object as Record<keyof T, unknown>)[key];

    if (typeof check === 'function') {
      if (!check(value)) {
        return false;
      }
    } else if (typeof check === 'string') {
      if (typeof value !== check) {
        return false;
      }
    } else if (!check?.includes(typeof value)) {
      return false;
    }
  }

  return true;
};
