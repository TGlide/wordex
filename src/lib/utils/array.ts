export const range = (start: number, end: number): number[] => {
	const arr: number[] = [];
	for (let i = start; i < end; i++) {
		arr.push(i);
	}
	return arr;
};
