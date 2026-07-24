sap.ui.define(["./Turn"], function (__Turn) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const Turn = _interopRequireDefault(__Turn);
  const formatter = {
    currentPlayerName(currentPlayer, player1, player2) {
      switch (currentPlayer) {
        case Turn.PLAYER1:
          return player1;
        case Turn.PLAYER2:
          return player2;
        case Turn.AUDIENCE:
          return "PLATEIA";
      }
    },
    formatRoundWinner(winner, player1, player2) {
      switch (winner) {
        case Turn.PLAYER1:
          return `✅ ${player1} acertou!`;
        case Turn.PLAYER2:
          return `✅ ${player2} acertou!`;
        case Turn.AUDIENCE:
          return "🎤 A plateia acertou!";
        default:
          return "❌ Ninguém acertou.";
      }
    },
    formatPoints(points) {
      if (points <= 0) {
        return "";
      }
      return `+${points} pontos`;
    },
    formatProgress(current, total) {
      if (total <= 0) {
        return "";
      }
      return `Envelope ${current} de ${total}`;
    }
  };
  return formatter;
});
//# sourceMappingURL=formatter-dbg.js.map
