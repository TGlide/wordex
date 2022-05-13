export const increment = (number: number, max: number) => {
	return Math.min(number + 1, max);
};

export const decrement = (number: number, min = 0) => {
	return Math.max(number - 1, min);
};
