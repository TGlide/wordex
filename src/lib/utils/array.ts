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
