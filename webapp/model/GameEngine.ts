import GameModel from "./GameModel";
import AnswerService from "./AnswerService";
import Turn from "./Turn";

export enum RoundState {
    WAITING_SPIN = "WAITING_SPIN",
    ANSWERING = "ANSWERING",
    AUDIENCE = "AUDIENCE",
    ROUND_FINISHED = "ROUND_FINISHED",
    GAME_FINISHED = "GAME_FINISHED"
}

export interface IEnvelope {
    id: number;
    category: string;
    answer: string;
    synonyms: string[];
    hints: string[];
}

export default class GameEngine {

    private readonly SCORE_PER_HINT = [
        10,
        8,
        6
    ];

    private readonly AUDIENCE_SCORE = 10;

    private model: GameModel;

    private envelopes: IEnvelope[] = [];

    constructor(model: GameModel) {
        this.model = model;
    }

    public loadEnvelopes(envelopes: IEnvelope[]): void {
        this.envelopes = [...envelopes];
    }

    public startRound(): IEnvelope | null {

        this.model.setProperty("/game/canSpinWheel", false);
        this.model.setProperty("/game/canAnswer", true);

        if (this.envelopes.length === 0) {
            this.model.setProperty("/game/state", RoundState.GAME_FINISHED);
            return null;
        }

        const index = Math.floor(Math.random() * this.envelopes.length);

        const envelope = this.envelopes[index];

        this.envelopes.splice(index, 1);

        this.model.setProperty("/game/currentEnvelope", envelope);
        this.model.setProperty("/game/currentHint", 0);
        this.model.setProperty("/game/currentAnswer", "");
        this.model.setProperty("/game/correctAnswer", "");
        this.model.setProperty("/game/showAnswer", false);
        this.model.setProperty("/game/showSkipAudience", false);
        this.model.setProperty(
            "/game/currentCategory",
            envelope.category
        );

        this.model.setProperty("/game/visibleHints", [
            envelope.hints[0]
        ]);

        this.model.setProperty("/game/state", RoundState.ANSWERING);

        const startingPlayer =
            this.model.getProperty("/game/startingPlayer");

        this.model.setProperty(
            "/game/currentPlayer",
            startingPlayer
        );

        return envelope;

    }

    public answer(answer: string): boolean {

        if (!this.model.getProperty("/game/canAnswer")) {
            return false;
        }

        const envelope = this.model.getProperty("/game/currentEnvelope") as IEnvelope;

        if (!envelope) {
            return false;
        }

        if (AnswerService.isCorrectAnswer(answer, envelope)) {

            const currentPlayer =
                this.model.getProperty("/game/currentPlayer");

            this.finishRound(currentPlayer);

            return true;

        }

        this.nextAttempt();

        return false;

    }

    public skipAudience(): void {

        if (!this.model.getProperty("/game/canAnswer")) {
            return;
        }

        const currentPlayer =
            this.model.getProperty("/game/currentPlayer");

        this.finishRound(currentPlayer);

    }

    public restartGame(): void {

        this.resetScores();

        this.resetRoundState();

    }

    private nextAttempt(): void {

        let hint = this.model.getProperty("/game/currentHint");

        hint++;

        if (hint < 3) {

            const envelope = this.model.getProperty("/game/currentEnvelope") as IEnvelope;

            const visibleHints = [
                ...this.model.getProperty("/game/visibleHints")
            ];

            visibleHints.push(
                envelope.hints[hint]
            );

            this.model.setProperty("/game/currentHint", hint);
            this.model.setProperty("/game/visibleHints", visibleHints);

            this.updateCurrentPlayer(hint);

            return;

        }

        this.model.setProperty("/game/currentPlayer", Turn.AUDIENCE);
        this.model.setProperty("/game/state", RoundState.AUDIENCE);
        this.model.setProperty("/game/showSkipAudience", true);

    }

    private finishRound(winner: Turn): void {

        this.addScore(winner);

        const envelope = this.model.getProperty("/game/currentEnvelope") as IEnvelope;

        this.model.setProperty("/game/correctAnswer", envelope.answer);
        this.model.setProperty("/game/showAnswer", true);
        this.model.setProperty("/game/showSkipAudience", false);
        this.model.setProperty("/game/state", RoundState.ROUND_FINISHED);
        this.model.setProperty("/game/canSpinWheel", true);
        this.model.setProperty("/game/canAnswer", false);

        const startingPlayer =
            this.model.getProperty("/game/startingPlayer");

        this.model.setProperty(
            "/game/startingPlayer",
            startingPlayer === Turn.PLAYER1
                ? Turn.PLAYER2
                : Turn.PLAYER1
        );

        if (this.hasRemainingEnvelopes()) {

            this.model.setProperty(
                "/game/state",
                RoundState.ROUND_FINISHED
            );

            this.model.setProperty(
                "/game/canSpinWheel",
                true
            );

        } else {

            this.finishGame();

        }

    }

    private updateCurrentPlayer(nextHint: number): void {

        const startingPlayer =
            this.model.getProperty("/game/startingPlayer");

        if (startingPlayer === Turn.PLAYER1) {

            if (nextHint === 1) {

                this.model.setProperty(
                    "/game/currentPlayer",
                    Turn.PLAYER2
                );

            } else {

                this.model.setProperty(
                    "/game/currentPlayer",
                    Turn.PLAYER1
                );

            }

        } else {

            if (nextHint === 1) {

                this.model.setProperty(
                    "/game/currentPlayer",
                    Turn.PLAYER1
                );

            } else {

                this.model.setProperty(
                    "/game/currentPlayer",
                    Turn.PLAYER2
                );

            }

        }

    }

    private addScore(winner: Turn): void {

        const hint =
            this.model.getProperty("/game/currentHint");

        const score =
            winner === Turn.AUDIENCE
                ? this.AUDIENCE_SCORE
                : this.SCORE_PER_HINT[hint];

        let actualScore = 0;

        switch (winner) {

            case Turn.PLAYER1:

                actualScore =
                    this.model.getProperty("/players/player1/score");

                this.model.setProperty(
                    "/players/player1/score",
                    actualScore + score
                );

                break;

            case Turn.PLAYER2:

                actualScore =
                    this.model.getProperty("/players/player2/score");

                this.model.setProperty(
                    "/players/player2/score",
                    actualScore + score
                );

                break;

            case Turn.AUDIENCE:

                actualScore =
                    this.model.getProperty("/audience/score");

                this.model.setProperty(
                    "/audience/score",
                    actualScore + score
                );

                break;

        }
    }

    private hasRemainingEnvelopes(): boolean {

        return this.envelopes.length > 0;

    }

    private finishGame(): void {

        this.model.setProperty(
            "/game/state",
            RoundState.GAME_FINISHED
        );

        this.model.setProperty(
            "/game/canSpinWheel",
            false
        );

        this.model.setProperty(
            "/game/canAnswer",
            false
        );

        this.model.setProperty(
            "/game/showSkipAudience",
            false
        );

    }

    private resetScores(): void {

        this.model.setProperty("/players/player1/score", 0);

        this.model.setProperty("/players/player2/score", 0);

        this.model.setProperty("/audience/score", 0);

    }

    private resetRoundState(): void {

        this.model.setProperty("/game/currentCategory", "");

        this.model.setProperty("/game/currentAnswer", "");

        this.model.setProperty("/game/correctAnswer", "");

        this.model.setProperty("/game/visibleHints", []);

        this.model.setProperty("/game/showAnswer", false);

        this.model.setProperty("/game/showSkipAudience", false);

        this.model.setProperty("/game/canSpinWheel", true);

        this.model.setProperty("/game/canAnswer", false);

        this.model.setProperty("/game/currentHint", 0);

        this.model.setProperty("/game/currentEnvelope", null);

        this.model.setProperty("/game/state", RoundState.WAITING_SPIN);

        this.model.setProperty("/players/player1/name", "");

        this.model.setProperty("/players/player2/name", "");

        this.model.setProperty(
            "/game/currentPlayer",
            Turn.PLAYER1
        );

    }

}