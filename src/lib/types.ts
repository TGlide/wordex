export type Word = Array<string | null>;

export enum GameState {
	PLAYING = 'playing',
	WON = 'won',
	LOST = 'lost'
}

export enum CellState {
	PRESENT = 'present',
	ABSENT = 'absent',
	CORRECT = 'correct'
}

export enum KeyState {
	PRESENT = 'present',
	ABSENT = 'absent',
	PARTIAL = 'partial',
	CORRECT = 'correct'
}

export enum Locale {
	EN = 'en',
	PT = 'pt'
}

export function isLocale(value: unknown): value is Locale {
	return Object.values(Locale).includes(value as Locale);
}
