import JSONModel from "sap/ui/model/json/JSONModel";
import {
    GamePhase,
    GameState,
    PlayerType
} from "./GameTypes";

export default class GameStateModel extends JSONModel {

    constructor() {

        const state: GameState = {

            started: false,

            phase: GamePhase.SETUP,

            currentPlayer: PlayerType.PLAYER_ONE,

            currentEnvelope: null,

            currentHint: 0,

            players: [

                {
                    id: PlayerType.PLAYER_ONE,
                    name: "",
                    score: 0
                },

                {
                    id: PlayerType.PLAYER_TWO,
                    name: "",
                    score: 0
                }

            ],

            audience: {

                score: 0

            },

            settings: {

                timer: 20,

                sounds: true,

                animations: true

            }

        };

        super(state);

    }

}