import Controller from "sap/ui/core/mvc/Controller";
import GameModel from "../model/GameModel";
import GameEngine, { IEnvelope } from "../model/GameEngine";
import formatter from "../model/formatter";
import EnvelopeRepository from "../repository/EnvelopeRepository";
import MessageBox from "sap/m/MessageBox";
import EnvelopeSpinner from "../controls/EnvelopeSpinner/EnvelopeSpinner";

export default class Game extends Controller {

    public formatter = formatter;

    private gameEngine!: GameEngine;

    private envelopeRepository: EnvelopeRepository;

    private envelopeSpinner: EnvelopeSpinner;

    private _timerId: number | null = null;

    public onInit(): void {

        void this.initialize();

    }

    public onAfterRendering(): void {

        void this.afterRender();

    }

    private async afterRender(): Promise<void> {

        const oSpinner = this.byId("spinner") as EnvelopeSpinner;

        this.envelopeSpinner = oSpinner;

    }

    private async initialize(): Promise<void> {

        const oModel = (this as any).getOwnerComponent().getModel("game") as GameModel;

        (this as any).getView().setModel(oModel, "game");

        this.gameEngine =
            (this as any).getOwnerComponent()
                .getGameEngine();

        const oRouter = (this as any).getOwnerComponent()
            .getRouter();

        if (oRouter) {
            oRouter.getRoute("Game")?.attachPatternMatched(this.gameMatched, this);
        }

    }

    /**
     * Simula o giro da roleta
     */
    public async onSpinWheel(): Promise<void> {

        this.envelopeSpinner.setAvailableEnvelopes(
            this.gameEngine.getAvailableEnvelopeIds()
        );

        const envelope =
            this.gameEngine.drawEnvelope();

        if (!envelope) {

            return;

        }

        this.gameEngine.playSpinSound();

        await this.envelopeSpinner.spinTo(
            envelope.id
        );

        await this.envelopeSpinner.wait(1000);

        this.gameEngine.prepareRound(
            envelope
        );

    }

    /**
     * Próxima implementação
     */
    public onAnswer(): void {

        const oModel = (this as any).getView().getModel("game") as GameModel;

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
            this.envelopeRepository.getCurrent();

        MessageBox.confirm(
            "Deseja realmente reiniciar o jogo? Todo o progresso atual será perdido.",
            {
                title: "Reiniciar jogo",
                actions: [
                    MessageBox.Action.YES,
                    MessageBox.Action.NO
                ],
                emphasizedAction: MessageBox.Action.YES,
                onClose: (action) => {

                    if (action === MessageBox.Action.YES) {

                        this.gameEngine.restartGame();

                        this.gameEngine.loadEnvelopes(envelopes);

                        (this as any).getOwnerComponent()
                            .getRouter()
                            .navTo("Start");

                    }

                }
            }
        );

    }

    private async gameMatched(): Promise<void> {

        if (!this.hasValidPlayers()) {

            (this as any).getOwnerComponent().getRouter().navTo("Start");
            return;

        }

        await this.loadEnvelopes();

    }

    private hasValidPlayers(): boolean {

        const model = (this as any).getOwnerComponent().getModel("game") as GameModel;

        const player1 = model.getProperty("/players/player1/name");
        const player2 = model.getProperty("/players/player2/name");

        return player1 !== "" && player2 !== "";

    }

    private async loadEnvelopes(): Promise<void> {

        this.envelopeRepository =
            (this as any).getOwnerComponent().getEnvelopeRepository();

        try {

            let envelopes =
                this.envelopeRepository.getCurrent();

            if (envelopes.length === 0) {

                envelopes =
                    await this.envelopeRepository.loadDefault();

            }

            this.gameEngine.loadEnvelopes(envelopes);

            if (this.envelopeSpinner) {

                this.envelopeSpinner.resetVisibleEnvelopes(this.gameEngine.getAvailableEnvelopeIds());

            }

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