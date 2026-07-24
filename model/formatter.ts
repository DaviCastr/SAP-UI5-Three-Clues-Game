import Turn from "./Turn";

const formatter = {

    currentPlayerName(
        currentPlayer: Turn,
        player1: string,
        player2: string
    ): string {

        switch (currentPlayer) {

            case Turn.PLAYER1:
                return player1;

            case Turn.PLAYER2:
                return player2;

            case Turn.AUDIENCE:
                return "PLATEIA";

        }
    },

    formatRoundWinner(
        winner: Turn | null,
        player1: string,
        player2: string
    ): string {

        switch (winner) {

            case Turn.PLAYER1:
                return `✅ ${player1} acertou!`;

            case Turn.PLAYER2:
                return `✅ ${player2} acertou!`;

            case Turn.AUDIENCE:
                return "🎤 A plateia acertou!";

            default:
                return "❌ Ninguém acertou.";
        }

    },

    formatPoints(points: number): string {

        if (points <= 0) {

            return "";

        }

        return `+${points} pontos`;

    },

    formatProgress(
        current: number,
        total: number
    ): string {

        if (total <= 0) {

            return "";

        }

        return `Envelope ${current} de ${total}`;

    }

};

export default formatter;