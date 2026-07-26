import { IEnvelope } from "../model/GameEngine";
import { IGameState } from "../model/GameModel";

export interface ISavedGame {

    version: number;

    gameState: IGameState;

    remainingEnvelopes: IEnvelope[];

    currentEnvelope: IEnvelope | null;

    currentEnvelopeCompleted: boolean;

}

export default class LocalStorageService {

    private static readonly STORAGE_KEY =
        "three-clues-game";

    public static save(
        save: ISavedGame
    ): void {

        localStorage.setItem(

            this.STORAGE_KEY,

            JSON.stringify(save)

        );

    }

    public static clear(): void {
        localStorage.removeItem(
            this.STORAGE_KEY
        );
    }

    public static hasSavedGame(): boolean {

        return !!localStorage.getItem(
            this.STORAGE_KEY
        );

    }

    public static load():
        ISavedGame | null {

        const value =
            localStorage.getItem(
                this.STORAGE_KEY
            );

        if (!value) {

            return null;

        }

        return JSON.parse(
            value
        ) as ISavedGame;

    }



}