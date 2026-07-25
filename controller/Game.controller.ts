/// <reference types="@openui5/types" />
import Controller from "sap/ui/core/mvc/Controller";
import GameModel from "../model/GameModel";
import GameEngine, { IEnvelope } from "../model/GameEngine";
import formatter from "../model/formatter";
import EnvelopeRepository from "../repository/EnvelopeRepository";
import MessageBox from "sap/m/MessageBox";
import EnvelopeSpinner from "../controls/EnvelopeSpinner/EnvelopeSpinner";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import Input from "sap/m/Input";

export default class Game extends Controller {

    public formatter = formatter;

    private gameEngine!: GameEngine;

    private envelopeRepository!: EnvelopeRepository;

    private envelopeSpinner!: EnvelopeSpinner;

    public onInit(): void {

        void this.initialize();

    }

    public onAfterRendering(): void {

        void this.afterRender();

    }

    private getI18nText(sKey: string, aArgs?: any[]): string {
        const oResourceModel = (this as any).getOwnerComponent().getModel("i18n") as ResourceModel;
        const oBundle = oResourceModel.getResourceBundle() as ResourceBundle;
        return oBundle.getText(sKey, aArgs) || sKey;
    }

    private async afterRender(): Promise<void> {

        const oSpinner = this.byId("spinner") as EnvelopeSpinner;

        this.envelopeSpinner = oSpinner;

        const model = (this as any).getOwnerComponent().getModel("game") as GameModel;

        const oBinding = model.bindProperty("/game/visibleHints");

        oBinding.attachChange(() => {
            const aHints = model.getProperty("/game/visibleHints");
            if (aHints && aHints.length > 0) {
                this.focusAnswerInput();
            }
        });

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

    public onAnswer(): void {

        const oModel = (this as any).getView().getModel("game") as GameModel;

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

    }

    public onSkipAudience(): void {

        this.gameEngine.skipAudience();

    }

    public async onRestartGame(): Promise<void> {

        const envelopes =
            this.envelopeRepository.getCurrent();

        MessageBox.confirm(
            this.getI18nText("msg.restartConfirmText"),
            {
                title: this.getI18nText("msg.restartConfirmTitle"),
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

    private focusAnswerInput(): void {

        setTimeout(() => {
            const oInput = this.byId("answerInput") as Input;
            if (oInput && oInput.getDomRef() && oInput.getEnabled()) {
                oInput.focus();
            }
        }, 100);

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
                this.getI18nText("msg.loadEnvelopesError")
            );

        }

    }

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