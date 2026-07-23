import Controller from "sap/ui/core/mvc/Controller";
import GameModel from "../model/GameModel";
import GameEngine, { IEnvelope } from "../model/GameEngine";
import formatter from "../model/formatter";
import EnvelopeRepository from "../repository/EnvelopeRepository";
import MessageBox from "sap/m/MessageBox";

export default class Game extends Controller {

    public formatter = formatter;

    private gameEngine!: GameEngine;

    private envelopeRepository: EnvelopeRepository;

    public async onInit(): Promise<void> {

        const oModel = this.getOwnerComponent().getModel("game") as GameModel;

        this.getView().setModel(oModel, "game");

        this.gameEngine =
            this.getOwnerComponent()
                .getGameEngine();

        const oRouter = this.getOwnerComponent()
            .getRouter();

        if (oRouter) {
            oRouter.getRoute("Game")?.attachPatternMatched(this.gameMatched, this);
        }

    }

    /**
     * Simula o giro da roleta
     */
    public onSpinWheel(): void {

        this.gameEngine.startRound();

    }

    /**
     * Próxima implementação
     */
    public onAnswer(): void {

        const oModel = this.getView().getModel("game") as GameModel;

        const answer = oModel.getProperty("/game/currentAnswer");

        this.gameEngine.answer(answer);

    }

    /**
     * Plateia pulou
     */
    public onSkipAudience(): void {

        this.gameEngine.skipAudience();

    }

    public async onRestartGame(): Promise<void> {

        const envelopes =
            await this.envelopeRepository.loadDefault();

        this.gameEngine.restartGame();

        this.gameEngine.loadEnvelopes(envelopes);

        this.getOwnerComponent()
            .getRouter()
            .navTo("Start");

    }

    private async gameMatched(): Promise<void> {

        if (!this.hasValidPlayers()) {

            this.getOwnerComponent().getRouter().navTo("Start");
            return;

        }

        await this.loadEnvelopes();

    }

    private hasValidPlayers(): boolean {

        const model = this.getOwnerComponent().getModel("game") as GameModel;

        const player1 = model.getProperty("/players/player1/name");
        const player2 = model.getProperty("/players/player2/name");

        return player1 !== "" && player2 !== "";

    }

    private async loadEnvelopes(): Promise<void> {

        this.envelopeRepository =
            this.getOwnerComponent().getEnvelopeRepository();

        try {

            let envelopes =
                this.envelopeRepository.getCurrent();

            if (envelopes.length === 0) {

                envelopes =
                    await this.envelopeRepository.loadDefault();

            }

            this.gameEngine.loadEnvelopes(envelopes);

        } catch (error) {

            MessageBox.error(
                "Não foi possível carregar os envelopes do jogo."
            );

        }

    }

    /**
     * Apenas para testes.
     * Depois será substituído pelo envelopes.json
     */
    private getMockEnvelopes(): IEnvelope[] {

        return [

            {
                id: 1,
                category: "Objeto",
                answer: "GELADEIRA",
                synonyms: [
                    "REFRIGERADOR"
                ],
                hints: [
                    "Fica na cozinha.",
                    "Mantém alimentos conservados.",
                    "Possui compressor."
                ]
            },

            {
                id: 2,
                category: "Animal",
                answer: "GOLFINHO",
                synonyms: [],
                hints: [
                    "Vive na água.",
                    "É um mamífero.",
                    "É muito inteligente."
                ]
            }

        ];

    }

}