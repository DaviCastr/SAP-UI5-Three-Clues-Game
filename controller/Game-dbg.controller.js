sap.ui.define(["sap/ui/core/mvc/Controller", "../model/formatter", "sap/m/MessageBox", "../services/LocalStorageService"], function (Controller, __formatter, MessageBox, __LocalStorageService) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const formatter = _interopRequireDefault(__formatter);
  const LocalStorageService = _interopRequireDefault(__LocalStorageService);
  const Game = Controller.extend("webapp.controller.Game", {
    constructor: function constructor() {
      Controller.prototype.constructor.apply(this, arguments);
      this.formatter = formatter;
      this.restoredGame = false;
    },
    onInit: function _onInit() {
      void this.initialize();
    },
    onAfterRendering: function _onAfterRendering() {
      void this.afterRender();
    },
    getI18nText: function _getI18nText(sKey, aArgs) {
      const oResourceModel = this.getOwnerComponent().getModel("i18n");
      const oBundle = oResourceModel.getResourceBundle();
      return oBundle.getText(sKey, aArgs) || sKey;
    },
    afterRender: async function _afterRender() {
      const oSpinner = this.byId("spinner");
      this.envelopeSpinner = oSpinner;
      const model = this.getOwnerComponent().getModel("game");
      const oBinding = model.bindProperty("/game/visibleHints");
      oBinding.attachChange(() => {
        const aHints = model.getProperty("/game/visibleHints");
        if (aHints && aHints.length > 0) {
          this.focusAnswerInput();
        }
      });
      if (this.restoredGame) {
        const currentEnvelope = this.gameEngine.getCurrentEnvelope();
        if (currentEnvelope) {
          this.envelopeSpinner.restoreState(this.gameEngine.getAvailableEnvelopeIds(), currentEnvelope.id);
        } else {
          this.envelopeSpinner.resetVisibleEnvelopes(this.gameEngine.getAvailableEnvelopeIds());
        }
      }
    },
    initialize: async function _initialize() {
      const oModel = this.getOwnerComponent().getModel("game");
      this.getView().setModel(oModel, "game");
      this.gameEngine = this.getOwnerComponent().getGameEngine();
      const oRouter = this.getOwnerComponent().getRouter();
      if (oRouter) {
        oRouter.getRoute("Game")?.attachPatternMatched(this.gameMatched, this);
      }
      const save = LocalStorageService.load();
      if (save) {
        this.envelopeRepository = this.getOwnerComponent().getEnvelopeRepository();
        this.envelopeRepository.setCurrent(save.remainingEnvelopes);
        this.gameEngine.restoreSave(save);
        this.gameEngine.restoreCurrentRound();
        this.getOwnerComponent().restoredGame = this.restoredGame = true;
      }
    },
    onSpinWheel: async function _onSpinWheel() {
      this.envelopeSpinner.setAvailableEnvelopes(this.gameEngine.getAvailableEnvelopeIds());
      const envelope = this.gameEngine.drawEnvelope();
      if (!envelope) {
        return;
      }
      this.gameEngine.playSpinSound();
      await this.envelopeSpinner.spinTo(envelope.id);
      await this.envelopeSpinner.wait(1000);
      this.gameEngine.prepareRound(envelope);
    },
    onAnswer: function _onAnswer() {
      const oModel = this.getView().getModel("game");
      if (oModel.getProperty("/game/isSubmitting")) {
        return;
      }
      const answer = oModel.getProperty("/game/currentAnswer");
      if (!answer || !answer.trim()) {
        return;
      }
      oModel.setProperty("/game/isSubmitting", true);
      try {
        oModel.setProperty("/game/currentAnswer", "");
        this.gameEngine.answer(answer);
      } finally {
        oModel.setProperty("/game/isSubmitting", false);
      }
    },
    onSkipAudience: function _onSkipAudience() {
      this.gameEngine.skipAudience();
    },
    onRestartGame: async function _onRestartGame() {
      const envelopes = this.envelopeRepository.getCurrent();
      MessageBox.confirm(this.getI18nText("msg.restartConfirmText"), {
        title: this.getI18nText("msg.restartConfirmTitle"),
        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
        emphasizedAction: MessageBox.Action.YES,
        onClose: action => {
          if (action === MessageBox.Action.YES) {
            this.gameEngine.restartGame();
            this.gameEngine.loadEnvelopes(envelopes);
            if (this.envelopeSpinner) {
              this.envelopeSpinner.resetVisibleEnvelopes(this.gameEngine.getAvailableEnvelopeIds());
            }
            this.getOwnerComponent().getRouter().navTo("Start");
          }
        }
      });
    },
    onPauseGame: function _onPauseGame() {
      this.gameEngine.togglePause();
    },
    focusAnswerInput: function _focusAnswerInput() {
      setTimeout(() => {
        const oInput = this.byId("answerInput");
        if (oInput && oInput.getDomRef() && oInput.getEnabled()) {
          oInput.focus();
        }
      }, 100);
    },
    gameMatched: async function _gameMatched() {
      if (!this.hasValidPlayers()) {
        this.getOwnerComponent().getRouter().navTo("Start");
        return;
      }
      if (!this.restoredGame) {
        await this.loadEnvelopes();
        if (this.envelopeSpinner) {
          this.envelopeSpinner.resetVisibleEnvelopes(this.gameEngine.getAvailableEnvelopeIds());
        }
      }
    },
    hasValidPlayers: function _hasValidPlayers() {
      const model = this.getOwnerComponent().getModel("game");
      const player1 = model.getProperty("/players/player1/name");
      const player2 = model.getProperty("/players/player2/name");
      return player1 !== "" && player2 !== "";
    },
    loadEnvelopes: async function _loadEnvelopes() {
      this.envelopeRepository = this.getOwnerComponent().getEnvelopeRepository();
      try {
        let envelopes = this.envelopeRepository.getCurrent();
        if (envelopes.length === 0) {
          envelopes = await this.envelopeRepository.loadDefault();
        }
        this.gameEngine.loadEnvelopes(envelopes);
        if (this.envelopeSpinner) {
          this.envelopeSpinner.resetVisibleEnvelopes(this.gameEngine.getAvailableEnvelopeIds());
        }
      } catch (error) {
        MessageBox.error(this.getI18nText("msg.loadEnvelopesError"));
      }
    },
    getMockEnvelopes: function _getMockEnvelopes() {
      return [{
        id: 1,
        category: "Objeto",
        answer: "GELADEIRA",
        synonyms: ["REFRIGERADOR"],
        hints: ["Fica na cozinha.", "Mantém alimentos conservados.", "Possui compressor."]
      }, {
        id: 2,
        category: "Animal",
        answer: "GOLFINHO",
        synonyms: [],
        hints: ["Vive na água.", "É um mamífero.", "É muito inteligente."]
      }];
    }
  });
  return Game;
});
//# sourceMappingURL=Game-dbg.controller.js.map
