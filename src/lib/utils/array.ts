import { stringToHash } from './string';

export const range = (start: number, end: number): number[] => {
	const arr: number[] = [];
	for (let i = start; i < end; i++) {
		arr.push(i);
	}
	return arr;
};

export const deterministicPick = <T>(arr: T[], str: string) => {
	return arr[Math.abs(stringToHash(str)) % arr.length];
};
