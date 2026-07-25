/// <reference types="@openui5/types" />
import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import MessageBox from "sap/m/MessageBox";
import EnvelopeRepository from "../repository/EnvelopeRepository";
import MessageToast from "sap/m/MessageToast";
import GameEngine from "../model/GameEngine";
import Fragment from "sap/ui/core/Fragment";
import Dialog from "sap/m/Dialog";

export default class Start extends Controller {

    private envelopeRepository: EnvelopeRepository;
    private gameEngine!: GameEngine;
    private howToPlayDialog: Promise<Dialog> | null = null;

    public onInit(): void {

        const oGameModel = (this as any).getOwnerComponent().getModel("game");

        (this as any).getView().setModel(oGameModel, "game");

        this.envelopeRepository =
            (this as any).getOwnerComponent().getEnvelopeRepository();

        this.gameEngine =
            (this as any).getOwnerComponent()
                .getGameEngine();

    }

    public onStartGame(): void {

        const oModel = (this as any).getView().getModel("game");

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
                "Envelopes carregados com sucesso!"
            );

        } catch (error) {

            MessageBox.error(
                error instanceof Error
                    ? error.message
                    : "Não foi possível carregar o arquivo.",
                {
                    title: "Erro no Jogo",
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
                throw new Error("Arquivo modelo não encontrado.");
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
        const oView = this.getView();

        if (!this.howToPlayDialog) {
            this.howToPlayDialog = Fragment.load({
                id: (oView as any).getId(),
                name: "apps.dflc.threecluesgame.view.HowToPlayDialog", // Ajuste o namespace para sua estrutura de pastas
                controller: this
            }).then((oDialog) => {
                (oView as any).addDependent(oDialog as Dialog);
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