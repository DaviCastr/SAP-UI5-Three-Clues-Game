sap.ui.define(["sap/ui/model/json/JSONModel", "./GameEngine", "./Turn"], function (JSONModel, ___GameEngine, __Turn) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const RoundState = ___GameEngine["RoundState"];
  const Turn = _interopRequireDefault(__Turn);
  class GameModel extends JSONModel {
    constructor() {
      const data = {
        players: {
          player1: {
            name: "",
            score: 0
          },
          player2: {
            name: "",
            score: 0
          }
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
          currentCategory: "",
          isSubmitting: false
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
  return GameModel;
});
//# sourceMappingURL=GameModel-dbg.js.map
