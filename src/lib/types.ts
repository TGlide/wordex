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
