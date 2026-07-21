import GameModel from "./GameModel";

export enum RoundState {
    WAITING_SPIN = "WAITING_SPIN",
    PLAYER1_HINT1 = "PLAYER1_HINT1",
    PLAYER2_HINT2 = "PLAYER2_HINT2",
    PLAYER1_HINT3 = "PLAYER1_HINT3",
    AUDIENCE = "AUDIENCE",
    ROUND_FINISHED = "ROUND_FINISHED",
    GAME_FINISHED = "GAME_FINISHED"
}

export interface IEnvelope {
    id: number;
    category: string;
    answer: string;
    synonyms: string[];
    hints: string[];
}

export default class GameEngine {

    private _model: GameModel;

    private _availableEnvelopes: IEnvelope[] = [];

    constructor(model: GameModel) {
        this._model = model;
    }

    public loadEnvelopes(envelopes: IEnvelope[]): void {
        this._availableEnvelopes = [...envelopes];
    }

    public getRemainingEnvelopes(): number {
        return this._availableEnvelopes.length;
    }

    public drawEnvelope(): IEnvelope | null {

        if (this._availableEnvelopes.length === 0) {
            this._model.setProperty("/game/state", RoundState.GAME_FINISHED);
            return null;
        }

        const index = Math.floor(Math.random() * this._availableEnvelopes.length);

        const envelope = this._availableEnvelopes[index];

        this._availableEnvelopes.splice(index, 1);

        this._model.setProperty("/game/currentEnvelope", envelope);
        this._model.setProperty("/game/currentHint", 0);

        const currentPlayer = this._model.getProperty("/game/currentPlayer");

        if (currentPlayer === 1) {
            this._model.setProperty("/game/state", RoundState.PLAYER1_HINT1);
        } else {
            // depois ajustaremos para alternar corretamente
            this._model.setProperty("/game/state", RoundState.PLAYER1_HINT1);
        }

        return envelope;

    }

    public getCurrentHint(): string {

        const envelope = this._model.getProperty("/game/currentEnvelope");

        if (!envelope) {
            return "";
        }

        const hintIndex = this._model.getProperty("/game/currentHint");

        return envelope.hints[hintIndex];

    }

    public nextHint(): void {

        let hint = this._model.getProperty("/game/currentHint");

        hint++;

        this._model.setProperty("/game/currentHint", hint);

        switch (hint) {

            case 1:
                this._model.setProperty("/game/state", RoundState.PLAYER2_HINT2);
                break;

            case 2:
                this._model.setProperty("/game/state", RoundState.PLAYER1_HINT3);
                break;

            default:
                this._model.setProperty("/game/state", RoundState.AUDIENCE);

        }

    }

}