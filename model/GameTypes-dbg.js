sap.ui.define([], function () {
  "use strict";

  var PlayerType = /*#__PURE__*/function (PlayerType) {
    PlayerType[PlayerType["PLAYER_ONE"] = 1] = "PLAYER_ONE";
    PlayerType[PlayerType["PLAYER_TWO"] = 2] = "PLAYER_TWO";
    PlayerType[PlayerType["AUDIENCE"] = 3] = "AUDIENCE";
    return PlayerType;
  }(PlayerType || {});
  var GamePhase = /*#__PURE__*/function (GamePhase) {
    GamePhase["SETUP"] = "SETUP";
    GamePhase["SPINNING"] = "SPINNING";
    GamePhase["FIRST_HINT"] = "FIRST_HINT";
    GamePhase["SECOND_HINT"] = "SECOND_HINT";
    GamePhase["THIRD_HINT"] = "THIRD_HINT";
    GamePhase["AUDIENCE"] = "AUDIENCE";
    GamePhase["REVEAL"] = "REVEAL";
    GamePhase["FINISHED"] = "FINISHED";
    return GamePhase;
  }(GamePhase || {});
  var __exports = {
    __esModule: true
  };
  __exports.PlayerType = PlayerType;
  __exports.GamePhase = GamePhase;
  return __exports;
});
//# sourceMappingURL=GameTypes-dbg.js.map
