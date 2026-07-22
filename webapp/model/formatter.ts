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
    }

};

export default formatter;