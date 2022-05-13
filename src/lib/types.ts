export type Word = Array<string | null>;

export enum GameState {
	PLAYING,
	WON,
	LOST
}

export enum CellState {
	PRESENT,
	ABSENT,
	CORRECT
}
