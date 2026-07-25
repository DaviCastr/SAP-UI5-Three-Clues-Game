sap.ui.define(["./Turn"], function (__Turn) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const Turn = _interopRequireDefault(__Turn);
  const formatter = {
    _getText(context, sKey, aArgs) {
      try {
        if (context && typeof context.getOwnerComponent === "function") {
          const oResourceBundle = context.getOwnerComponent().getModel("i18n")?.getResourceBundle();
          if (oResourceBundle) {
            return oResourceBundle.getText(sKey, aArgs);
          }
        }
      } catch (e) {}
      return sKey;
    },
    currentPlayerName(currentPlayer, player1, player2) {
      switch (currentPlayer) {
        case Turn.PLAYER1:
          return player1;
        case Turn.PLAYER2:
          return player2;
        case Turn.AUDIENCE:
          return formatter._getText(this, "game.audience");
        default:
          return "";
      }
    },
    formatRoundWinner(winner, player1, player2) {
      switch (winner) {
        case Turn.PLAYER1:
          return formatter._getText(this, "msg.winnerPlayer", [player1]);
        case Turn.PLAYER2:
          return formatter._getText(this, "msg.winnerPlayer", [player2]);
        case Turn.AUDIENCE:
          return formatter._getText(this, "msg.winnerAudience");
        default:
          return formatter._getText(this, "msg.noWinner");
      }
    },
    formatPoints(points) {
      if (!points || points <= 0) {
        return "";
      }
      return formatter._getText(this, "msg.pointsGained", [points]);
    },
    formatProgress(current, total) {
      if (!total || total <= 0) {
        return "";
      }
      return formatter._getText(this, "msg.progressSimple", [current, total]);
    },
    formatProgressWithPercent(iCurrent, iTotal, iPercent) {
      if (!iCurrent || !iTotal) {
        return "";
      }
      return formatter._getText(this, "msg.progressPercent", [iCurrent, iTotal, iPercent || 0]);
    }
  };
  return formatter;
});
//# sourceMappingURL=formatter-dbg.js.map
