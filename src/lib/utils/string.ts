export function isLetter(str: string | unknown): str is string {
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

export const countOccurrences = (str: string, substr: string): number => {
	let count = 0;
	let pos = 0;

	while ((pos = str.indexOf(substr, pos)) > -1) {
		count++;
		pos += substr.length;
	}

	return count;
};

export const getLetters = (str: string): Record<string, number> => {
	const letters: Record<string, number> = {};

	for (const char of str) {
		letters[char] = letters[char] ? letters[char] + 1 : 1;
	}

	return letters;
};

export const getCorrectWord = (words: Array<string>, word: string) => {
	const correctWord = words.find(
		(w) => normalizeString(w).toLowerCase() === normalizeString(word).toLowerCase()
	);

	return correctWord ?? word;
};
