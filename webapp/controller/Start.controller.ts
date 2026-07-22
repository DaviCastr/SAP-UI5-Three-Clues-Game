import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import MessageBox from "sap/m/MessageBox";

export default class Start extends Controller {

    public onInit(): void {

        const oGameModel = this.getOwnerComponent().getModel("game");

        this.getView().setModel(oGameModel, "game");

    }

    public onStartGame(): void {

        const oModel = this.getView().getModel("game");

        const player1 = oModel.getProperty("/players/player1/name");
        const player2 = oModel.getProperty("/players/player2/name");

        if (!player1 || !player2) {

            MessageBox.error("Informe o nome dos dois jogadores.");

            return;

        }

        UIComponent
            .getRouterFor(this)
            .navTo("Game");

    }

}