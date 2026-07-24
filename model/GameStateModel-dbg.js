sap.ui.define(["sap/ui/model/json/JSONModel", "./GameTypes"], function (JSONModel, ___GameTypes) {
  "use strict";

  const GamePhase = ___GameTypes["GamePhase"];
  const PlayerType = ___GameTypes["PlayerType"];
  class GameStateModel extends JSONModel {
    constructor() {
      const state = {
        started: false,
        phase: GamePhase.SETUP,
        currentPlayer: PlayerType.PLAYER_ONE,
        currentEnvelope: null,
        currentHint: 0,
        players: [{
          id: PlayerType.PLAYER_ONE,
          name: "",
          score: 0
        }, {
          id: PlayerType.PLAYER_TWO,
          name: "",
          score: 0
        }],
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
  return GameStateModel;
});
//# sourceMappingURL=GameStateModel-dbg.js.map
