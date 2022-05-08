export function isLetter(str: string | unknown): boolean {
	if (typeof str !== 'string') return false;
	return str.length === 1 && /[a-z]/i.test(str);
}
