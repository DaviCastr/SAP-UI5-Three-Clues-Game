export enum PlayerType {
    PLAYER_ONE = 1,
    PLAYER_TWO = 2,
    AUDIENCE = 3
}

export enum GamePhase {
    SETUP = "SETUP",
    SPINNING = "SPINNING",
    FIRST_HINT = "FIRST_HINT",
    SECOND_HINT = "SECOND_HINT",
    THIRD_HINT = "THIRD_HINT",
    AUDIENCE = "AUDIENCE",
    REVEAL = "REVEAL",
    FINISHED = "FINISHED"
}

export interface Player {

    id: PlayerType;

    name: string;

    score: number;

}

export interface Audience {

    score: number;

}

export interface Clue {

    id: number;

    answer: string;

    hints: string[];

    category?: string;

    difficulty?: string;

    synonyms?: string[];

}

export interface GameSettings {

    timer: number;

    sounds: boolean;

    animations: boolean;

}

export interface GameState {

    started: boolean;

    phase: GamePhase;

    currentPlayer: PlayerType;

    currentEnvelope: number | null;

    currentHint: number;

    players: Player[];

    audience: Audience;

    settings: GameSettings;

}