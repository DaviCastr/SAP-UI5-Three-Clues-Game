import JSONModel from "sap/ui/model/json/JSONModel";
import { IEnvelope, RoundState } from "./GameEngine";
import Turn from "./Turn";

export interface IPlayer {
    name: string;
    score: number;
}

export interface IGameState {

    players: {

        player1: IPlayer;

        player2: IPlayer;

    };

    audience: {
        score: number;
    };

    settings: {

        roundTime: number;

        sounds: boolean;

        showCategory: boolean;

    };

    game: {

        startingPlayer: Turn;

        currentPlayer: Turn;

        canSpinWheel: boolean;

        currentEnvelope: IEnvelope | null;

        currentHint: number;

        state: RoundState;

        visibleHints: string[];

        currentAnswer: string;

        correctAnswer: string;

        showAnswer: boolean;

        showSkipAudience: boolean;

        canAnswer: boolean;

        currentCategory: string;

    }

    roundResult: {
        visible: boolean;
        winner: Turn | null;
        answer: string;
        points: number;
    }

    progress: {
        current: number;
        total: number;
        percent: number;
        themeName: string;
    };

    timer: {
        seconds: number;
        active: boolean;
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

            },

            audience: {
                score: 0
            },

            settings: {

                roundTime: 15,

                sounds: true,

                showCategory: true

            },

            game: {

                startingPlayer: Turn.PLAYER1,

                currentPlayer: Turn.PLAYER1,

                canSpinWheel: true,

                currentEnvelope: null,

                currentHint: 0,

                state: RoundState.WAITING_SPIN,

                visibleHints: [],

                currentAnswer: "",

                correctAnswer: "",

                showAnswer: false,

                showSkipAudience: false,

                canAnswer: false,

                currentCategory: ""

            },

            roundResult: {
                visible: false,
                winner: null,
                answer: "",
                points: 0
            },

            progress: {
                current: 0,
                total: 0,
                percent: 0,
                themeName: ""
            },

            timer: {
                seconds: 15,
                active: false
            }

        };

        super(data);

    }

}