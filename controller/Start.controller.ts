/// <reference types="@openui5/types" />
import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import MessageBox from "sap/m/MessageBox";
import EnvelopeRepository from "../repository/EnvelopeRepository";
import MessageToast from "sap/m/MessageToast";
import GameEngine from "../model/GameEngine";
import Fragment from "sap/ui/core/Fragment";
import Dialog from "sap/m/Dialog";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import ResourceModel from "sap/ui/model/resource/ResourceModel";

export default class Start extends Controller {

    private envelopeRepository!: EnvelopeRepository;
    private gameEngine!: GameEngine;
    private howToPlayDialog: Promise<Dialog> | null = null;

    public onInit(): void {
        const oOwnerComponent = (this as any).getOwnerComponent();
        const oGameModel = oOwnerComponent.getModel("game");

        (this as any).getView().setModel(oGameModel, "game");

        this.envelopeRepository = oOwnerComponent.getEnvelopeRepository();
        this.gameEngine = oOwnerComponent.getGameEngine();
    }

    private getI18nText(sKey: string, aArgs?: any[]): string {
        const oResourceModel = (this as any).getOwnerComponent().getModel("i18n") as ResourceModel;
        const oBundle = oResourceModel.getResourceBundle() as ResourceBundle;
        return oBundle.getText(sKey, aArgs) || sKey;
    }

    public onStartGame(): void {
        const oModel = (this as any).getView().getModel("game");

        const player1 = (oModel.getProperty("/players/player1/name") || "").trim();
        const player2 = (oModel.getProperty("/players/player2/name") || "").trim();

        if (!player1 || !player2) {
            MessageBox.error(this.getI18nText("msg.fillPlayerNames"));
            return;
        }

        if (player1.toLowerCase() === player2.toLowerCase()) {
            MessageBox.error(this.getI18nText("msg.duplicatePlayerNames"));
            return;
        }

        UIComponent
            .getRouterFor(this)
            .navTo("Game");
    }

    public async onFileSelected(oEvent: Event): Promise<void> {
        const files = (oEvent as any).getParameter("files") as File[];

        if (!files || files.length === 0) {
            return;
        }

        const file = files[0];

        try {
            await this.envelopeRepository.loadFromFile(file);

            this.gameEngine.restartGame();

            MessageToast.show(
                this.getI18nText("msg.envelopesLoadedSuccess")
            );

        } catch (error) {
            MessageBox.error(
                error instanceof Error
                    ? error.message
                    : this.getI18nText("msg.defaultLoadError"),
                {
                    title: this.getI18nText("msg.errorTitle"),
                    styleClass: "tcgMessageBox",
                    actions: [MessageBox.Action.OK]
                }
            );
        }
    }

    public async onDownloadTemplate(): Promise<void> {
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
    }

    public async onShowHowToPlay(): Promise<void> {
        const oView = (this as any).getView();

        if (!this.howToPlayDialog) {
            this.howToPlayDialog = Fragment.load({
                id: oView.getId(),
                name: "apps.dflc.threecluesgame.view.HowToPlayDialog",
                controller: this
            }).then((oDialog) => {
                oView.addDependent(oDialog as Dialog);
                return oDialog as Dialog;
            });
        }

        const oDialog = await this.howToPlayDialog;
        oDialog.open();
    }

    public async onCloseHowToPlay(): Promise<void> {
        if (this.howToPlayDialog) {
            const oDialog = await this.howToPlayDialog;
            oDialog.close();
        }
    }
}