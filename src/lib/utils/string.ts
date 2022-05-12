export function isLetter(str: string | unknown): boolean {
	if (typeof str !== 'string') return false;
	return str.length === 1 && /[a-z]/i.test(str);
}

export const stringToHash = (text: string): number => {
	let hash = 0;

	for (let i = 0; i < text.length; i++) {
		const char = text.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash;
	}

	return hash;
};

export const normalizeString = (str: string): string => {
	return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};
