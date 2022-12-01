export const range = (start: number, end: number): number[] => {
  const arr: number[] = [];
  for (let i = start; i < end; i++) {
    arr.push(i);
  }
  return arr;
};

export const randomPick = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const isArrayOfType = <T>(
  value: unknown,
  typeChecker: ((v: unknown) => v is T) | string | string[]
): value is T[] => {
  return (
    Array.isArray(value) &&
    value.every((v) => {
      if (typeof typeChecker === 'function') {
        return typeChecker(v);
      } else if (typeof typeChecker === 'string') {
        return typeof v === typeChecker;
      }
      return typeChecker.includes(typeof v);
    })
  );
};
