sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/UIComponent", "sap/m/MessageBox", "sap/m/MessageToast"], function (Controller, UIComponent, MessageBox, MessageToast) {
  "use strict";

  const Start = Controller.extend("webapp.controller.Start", {
    onInit: function _onInit() {
      const oGameModel = this.getOwnerComponent().getModel("game");
      this.getView().setModel(oGameModel, "game");
      this.envelopeRepository = this.getOwnerComponent().getEnvelopeRepository();
      this.gameEngine = this.getOwnerComponent().getGameEngine();
    },
    onStartGame: function _onStartGame() {
      const oModel = this.getView().getModel("game");
      const player1 = oModel.getProperty("/players/player1/name");
      const player2 = oModel.getProperty("/players/player2/name");
      if (!player1 || !player2) {
        MessageBox.error("Informe o nome dos dois jogadores.");
        return;
      }
      UIComponent.getRouterFor(this).navTo("Game");
    },
    onFileSelected: async function _onFileSelected(oEvent) {
      const files = oEvent.getParameter("files");
      if (!files || files.length === 0) {
        return;
      }
      const file = files[0];
      try {
        await this.envelopeRepository.loadFromFile(file);
        this.gameEngine.restartGame();
        MessageToast.show("Envelopes carregados com sucesso!");
      } catch (error) {
        MessageBox.error(error instanceof Error ? error.message : "Não foi possível carregar o arquivo.");
      }
    }
  });
  return Start;
});
//# sourceMappingURL=Start-dbg.controller.js.map
