import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import MessageBox from "sap/m/MessageBox";
import FileUploader from "sap/ui/unified/FileUploader";
import EnvelopeRepository from "../repository/EnvelopeRepository";
import MessageToast from "sap/m/MessageToast";
import GameEngine from "../model/GameEngine";

export default class Start extends Controller {

    private envelopeRepository: EnvelopeRepository;
    private gameEngine!: GameEngine;

    public onInit(): void {

        const oGameModel = this.getOwnerComponent().getModel("game");

        this.getView().setModel(oGameModel, "game");

        this.envelopeRepository =
            this.getOwnerComponent().getEnvelopeRepository();

        this.gameEngine =
            this.getOwnerComponent()
                .getGameEngine();

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

    public async onFileSelected(oEvent: Event): Promise<void> {

        const files = oEvent.getParameter("files") as File[];

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
                    : "Não foi possível carregar o arquivo."
            );

        }

    }

}