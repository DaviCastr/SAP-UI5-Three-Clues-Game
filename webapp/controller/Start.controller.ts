import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import UIComponent from "sap/ui/core/UIComponent";

export default class Start extends Controller {

    public onInit(): void {

        const oConfig = new JSONModel({
            player1: "",
            player2: "",
            roundTime: "20",
            sounds: true,
            animations: true
        });

        this.getView().setModel(oConfig, "config");

    }

    public onStartGame(): void {

        const oRouter = UIComponent.getRouterFor(this);

        oRouter.navTo("Game");

    }

}