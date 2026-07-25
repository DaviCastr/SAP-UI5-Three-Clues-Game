sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/UIComponent", "sap/m/MessageBox", "sap/m/MessageToast", "sap/ui/core/Fragment"], function (Controller, UIComponent, MessageBox, MessageToast, Fragment) {
  "use strict";

  const Start = Controller.extend("webapp.controller.Start", {
    constructor: function constructor() {
      Controller.prototype.constructor.apply(this, arguments);
      this.howToPlayDialog = null;
    },
    onInit: function _onInit() {
      const oOwnerComponent = this.getOwnerComponent();
      const oGameModel = oOwnerComponent.getModel("game");
      this.getView().setModel(oGameModel, "game");
      this.envelopeRepository = oOwnerComponent.getEnvelopeRepository();
      this.gameEngine = oOwnerComponent.getGameEngine();
    },
    getI18nText: function _getI18nText(sKey, aArgs) {
      const oResourceModel = this.getOwnerComponent().getModel("i18n");
      const oBundle = oResourceModel.getResourceBundle();
      return oBundle.getText(sKey, aArgs) || sKey;
    },
    onStartGame: function _onStartGame() {
      const oModel = this.getView().getModel("game");
      const player1 = oModel.getProperty("/players/player1/name");
      const player2 = oModel.getProperty("/players/player2/name");
      if (!player1 || !player2) {
        MessageBox.error(this.getI18nText("msg.fillPlayerNames"));
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
        MessageToast.show(this.getI18nText("msg.envelopesLoadedSuccess"));
      } catch (error) {
        MessageBox.error(error instanceof Error ? error.message : this.getI18nText("msg.defaultLoadError"), {
          title: this.getI18nText("msg.errorTitle"),
          styleClass: "tcgMessageBox",
          actions: [MessageBox.Action.OK]
        });
      }
    },
    onDownloadTemplate: async function _onDownloadTemplate() {
      try {
        const sPath = sap.ui.require.toUrl("apps/dflc/threecluesgame/json/envelopes.json");
        const response = await fetch(sPath);
        if (!response.ok) {
          throw new Error(this.getI18nText("msg.templateNotFoundError"));
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "envelopes.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Erro ao baixar o modelo:", error);
      }
    },
    onShowHowToPlay: async function _onShowHowToPlay() {
      const oView = this.getView();
      if (!this.howToPlayDialog) {
        this.howToPlayDialog = Fragment.load({
          id: oView.getId(),
          name: "apps.dflc.threecluesgame.view.HowToPlayDialog",
          controller: this
        }).then(oDialog => {
          oView.addDependent(oDialog);
          return oDialog;
        });
      }
      const oDialog = await this.howToPlayDialog;
      oDialog.open();
    },
    onCloseHowToPlay: async function _onCloseHowToPlay() {
      if (this.howToPlayDialog) {
        const oDialog = await this.howToPlayDialog;
        oDialog.close();
      }
    }
  });
  return Start;
});
//# sourceMappingURL=Start-dbg.controller.js.map
