sap.ui.define(["./AnswerService", "./Turn", "../utils/SoundService"], function (__AnswerService, __Turn, __SoundService) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const AnswerService = _interopRequireDefault(__AnswerService);
  const Turn = _interopRequireDefault(__Turn);
  const SoundService = _interopRequireDefault(__SoundService);
  const SoundEffect = __SoundService["SoundEffect"];
  var RoundState = /*#__PURE__*/function (RoundState) {
    RoundState["WAITING_SPIN"] = "WAITING_SPIN";
    RoundState["ANSWERING"] = "ANSWERING";
    RoundState["AUDIENCE"] = "AUDIENCE";
    RoundState["ROUND_FINISHED"] = "ROUND_FINISHED";
    RoundState["GAME_FINISHED"] = "GAME_FINISHED";
    return RoundState;
  }(RoundState || {});
  class GameEngine {
    SCORE_PER_HINT = [10, 9, 8];
    AUDIENCE_SCORE = 10;
    envelopes = [];
    timerId = null;
    constructor(model) {
      this.model = model;
      this.soundService = SoundService.getInstance(model);
    }
    loadEnvelopes(envelopes) {
      this.envelopes = [...envelopes];
      this.model.setProperty("/progress/total", envelopes.length);
    }
    startRound() {
      const envelope = this.drawEnvelope();
      if (!envelope) {
        return null;
      }
      this.prepareRound(envelope);
      return envelope;
    }
    answer(answer) {
      if (!this.model.getProperty("/game/canAnswer")) {
        return false;
      }
      const envelope = this.model.getProperty("/game/currentEnvelope");
      if (!envelope) {
        return false;
      }
      if (AnswerService.isCorrectAnswer(answer, envelope)) {
        this.soundService.play(SoundEffect.CORRECT);
        const currentPlayer = this.model.getProperty("/game/currentPlayer");
        this.finishRound(currentPlayer);
        return true;
      }
      this.soundService.play(SoundEffect.WRONG);
      this.nextAttempt();
      return false;
    }
    skipAudience() {
      if (!this.model.getProperty("/game/canAnswer")) {
        return;
      }
      const currentPlayer = this.model.getProperty("/game/currentPlayer");
      this.finishRound(currentPlayer);
    }
    restartGame() {
      this.stopTimer();
      this.resetScores();
      this.resetRoundState();
    }
    drawEnvelope() {
      this.model.setProperty("/game/canSpinWheel", false);
      if (this.envelopes.length === 0) {
        this.model.setProperty("/game/state", RoundState.GAME_FINISHED);
        return null;
      }
      const index = Math.floor(Math.random() * this.envelopes.length);
      const envelope = this.envelopes[index];
      this.envelopes.splice(index, 1);
      this.updateProgress();
      return envelope;
    }
    startTimer() {
      this.stopTimer();
      const roundTime = Number(this.model.getProperty("/settings/roundTime")) || 20;
      this.model.setProperty("/timer", {
        seconds: roundTime,
        active: true
      });
      this.timerId = window.setInterval(() => {
        const currentSeconds = this.model.getProperty("/timer/seconds");
        if (currentSeconds > 1) {
          this.model.setProperty("/timer/seconds", currentSeconds - 1);
        } else {
          this.model.setProperty("/timer/seconds", 0);
          this.stopTimer();
          this.soundService.play(SoundEffect.TIME_EXPIRED);
          this.handleTimeExpired();
        }
      }, 1000);
    }
    stopTimer() {
      if (this.timerId !== null) {
        clearInterval(this.timerId);
        this.timerId = null;
      }
      this.model.setProperty("/timer/active", false);
    }
    handleTimeExpired() {
      this.nextAttempt();
    }
    prepareRound(envelope) {
      this.model.setProperty("/game/canAnswer", true);
      this.clearRoundResult();
      this.model.setProperty("/game/currentEnvelope", envelope);
      this.model.setProperty("/game/currentHint", 0);
      this.model.setProperty("/game/currentAnswer", "");
      this.model.setProperty("/game/correctAnswer", "");
      this.model.setProperty("/game/showAnswer", false);
      this.model.setProperty("/roundResult/visible", false);
      this.model.setProperty("/game/showSkipAudience", false);
      this.model.setProperty("/game/currentCategory", envelope.category);
      this.model.setProperty("/game/visibleHints", [envelope.hints[0]]);
      this.model.setProperty("/game/state", RoundState.ANSWERING);
      const startingPlayer = this.model.getProperty("/game/startingPlayer");
      this.model.setProperty("/game/currentPlayer", startingPlayer);
      this.startTimer();
    }
    getAvailableEnvelopeIds() {
      return this.envelopes.map(envelope => envelope.id);
    }
    nextAttempt() {
      let hint = this.model.getProperty("/game/currentHint");
      hint++;
      if (hint < 3) {
        const envelope = this.model.getProperty("/game/currentEnvelope");
        const visibleHints = [...this.model.getProperty("/game/visibleHints")];
        visibleHints.push(envelope.hints[hint]);
        this.model.setProperty("/game/currentHint", hint);
        this.model.setProperty("/game/visibleHints", visibleHints);
        this.updateCurrentPlayer(hint);
        this.startTimer();
        return;
      }
      this.stopTimer();
      this.model.setProperty("/game/currentPlayer", Turn.AUDIENCE);
      this.model.setProperty("/game/state", RoundState.AUDIENCE);
      this.model.setProperty("/game/showSkipAudience", true);
    }
    playSpinSound() {
      this.soundService.play(SoundEffect.SPIN);
    }
    finishRound(winner) {
      const envelope = this.model.getProperty("/game/currentEnvelope");
      this.addScore(winner, envelope.answer);
      this.model.setProperty("/game/correctAnswer", envelope.answer);
      this.model.setProperty("/game/showAnswer", true);
      this.model.setProperty("/game/showSkipAudience", false);
      this.model.setProperty("/game/state", RoundState.ROUND_FINISHED);
      this.model.setProperty("/game/canSpinWheel", true);
      this.model.setProperty("/game/canAnswer", false);
      const startingPlayer = this.model.getProperty("/game/startingPlayer");
      this.model.setProperty("/game/startingPlayer", startingPlayer === Turn.PLAYER1 ? Turn.PLAYER2 : Turn.PLAYER1);
      this.stopTimer();
      if (this.hasRemainingEnvelopes()) {
        this.model.setProperty("/game/state", RoundState.ROUND_FINISHED);
        this.model.setProperty("/game/canSpinWheel", true);
      } else {
        this.finishGame();
      }
    }
    updateCurrentPlayer(nextHint) {
      const startingPlayer = this.model.getProperty("/game/startingPlayer");
      if (startingPlayer === Turn.PLAYER1) {
        if (nextHint === 1) {
          this.model.setProperty("/game/currentPlayer", Turn.PLAYER2);
        } else {
          this.model.setProperty("/game/currentPlayer", Turn.PLAYER1);
        }
      } else {
        if (nextHint === 1) {
          this.model.setProperty("/game/currentPlayer", Turn.PLAYER1);
        } else {
          this.model.setProperty("/game/currentPlayer", Turn.PLAYER2);
        }
      }
    }
    addScore(winner, answer) {
      const hint = this.model.getProperty("/game/currentHint");
      const score = winner === Turn.AUDIENCE ? this.AUDIENCE_SCORE : this.SCORE_PER_HINT[hint];
      this.showRoundResult(winner, answer, score);
      let actualScore = 0;
      switch (winner) {
        case Turn.PLAYER1:
          actualScore = this.model.getProperty("/players/player1/score");
          this.model.setProperty("/players/player1/score", actualScore + score);
          break;
        case Turn.PLAYER2:
          actualScore = this.model.getProperty("/players/player2/score");
          this.model.setProperty("/players/player2/score", actualScore + score);
          break;
        case Turn.AUDIENCE:
          actualScore = this.model.getProperty("/audience/score");
          this.model.setProperty("/audience/score", actualScore + score);
          break;
      }
    }
    hasRemainingEnvelopes() {
      return this.envelopes.length > 0;
    }
    finishGame() {
      this.model.setProperty("/game/state", RoundState.GAME_FINISHED);
      this.model.setProperty("/game/canSpinWheel", false);
      this.model.setProperty("/game/canAnswer", false);
      this.model.setProperty("/game/showAnswer", false);
      this.model.setProperty("/roundResult/visible", false);
      this.model.setProperty("/game/showSkipAudience", false);
      const player1 = this.model.getProperty("/players/player1");
      const player2 = this.model.getProperty("/players/player2");
      const audienceScore = this.model.getProperty("/audience/score");
      const participants = [{
        name: player1.name,
        score: player1.score
      }, {
        name: player2.name,
        score: player2.score
      }, {
        name: "Plateia",
        score: audienceScore
      }];
      participants.sort((a, b) => b.score - a.score);
      const badges = ["🥇", "🥈", "🥉"];
      const leaderboard = participants.map((item, index) => ({
        position: index + 1,
        badge: badges[index] || "🏅",
        name: item.name,
        score: item.score
      }));
      this.soundService.play(SoundEffect.GAME_OVER);
      this.model.setProperty("/leaderboard", leaderboard);
      this.model.setProperty("/game/state", "GAME_FINISHED");
    }
    resetScores() {
      this.model.setProperty("/players/player1/score", 0);
      this.model.setProperty("/players/player2/score", 0);
      this.model.setProperty("/audience/score", 0);
    }
    resetRoundState() {
      this.model.setProperty("/game/currentCategory", "");
      this.model.setProperty("/game/currentAnswer", "");
      this.model.setProperty("/game/correctAnswer", "");
      this.model.setProperty("/game/visibleHints", []);
      this.model.setProperty("/game/showAnswer", false);
      this.model.setProperty("/roundResult/visible", false);
      this.model.setProperty("/game/showSkipAudience", false);
      this.model.setProperty("/game/canSpinWheel", true);
      this.model.setProperty("/game/canAnswer", false);
      this.model.setProperty("/game/currentHint", 0);
      this.model.setProperty("/game/currentEnvelope", null);
      this.model.setProperty("/game/state", RoundState.WAITING_SPIN);
      this.model.setProperty("/game/currentPlayer", Turn.PLAYER1);
      this.model.setProperty("/progress/current", 0);
      this.model.setProperty("/progress/percent", 0);
    }
    clearRoundResult() {
      this.model.setProperty("/roundResult", {
        visible: false,
        winner: null,
        answer: "",
        points: 0
      });
    }
    showRoundResult(winner, answer, points) {
      this.model.setProperty("/roundResult", {
        visible: true,
        winner,
        answer,
        points
      });
    }
    updateProgress() {
      const total = this.model.getProperty("/progress/total");
      const remaining = this.envelopes.length;
      const current = total - remaining;
      if (total <= 0) {
        this.model.setProperty("/progress/current", 0);
        this.model.setProperty("/progress/percent", 0);
        return;
      }
      const percent = Math.round(current / total * 100);
      this.model.setProperty("/progress/current", current);
      this.model.setProperty("/progress/percent", percent);
    }
  }
  GameEngine.RoundState = RoundState;
  return GameEngine;
});
//# sourceMappingURL=GameEngine-dbg.js.map
