import JSONModel from "sap/ui/model/json/JSONModel";
import { RoundState, IEnvelope } from "./GameEngine";

export interface IPlayer {
    name: string;
    score: number;
}

export interface IGameState {

    players: {
        player1: IPlayer;
        player2: IPlayer;
        audience: {
            score: number;
        };
    };

    settings: {
        roundTime: number;
        sounds: boolean;
        animations: boolean;
    };

    game: {
        currentPlayer: 1 | 2;
        currentEnvelope: IEnvelope | null;
        currentHint: 0 | 1 | 2;
        state: RoundState;
        message: string;
        answer: string;
        visibleHints: string[];
    };

}

export default class GameModel extends JSONModel {

    constructor() {

        const data: IGameState = {

            players: {

                player1: {
                    name: "",
                    score: 0
                },

                player2: {
                    name: "",
                    score: 0
                },

                audience: {
                    score: 0
                }

            },

            settings: {

                roundTime: 20,
                sounds: true,
                animations: true

            },

            game: {

                currentPlayer: 1,
                currentEnvelope: null,
                currentHint: 0,
                state: RoundState.WAITING_SPIN,
                message: "",
                answer: "",
                visibleHints: []

            }

        };

        super(data);

    }

}