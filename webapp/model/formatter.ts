import Turn from "./Turn";

const formatter = {

    _getText(context: any, sKey: string, aArgs?: any[]): string {
        try {

            if (context && typeof context.getOwnerComponent === "function") {
                const oResourceBundle = context.getOwnerComponent().getModel("i18n")?.getResourceBundle();
                if (oResourceBundle) {
                    return oResourceBundle.getText(sKey, aArgs);
                }
            }
        } catch (e) {
        }
        return sKey;
    },

    currentPlayerName(
        this: any,
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
                return formatter._getText(this, "game.audience");

            default:
                return "";
        }
    },

    formatRoundWinner(
        this: any,
        winner: Turn | null,
        player1: string,
        player2: string
    ): string {
        switch (winner) {
            case Turn.PLAYER1:
                return formatter._getText(this, "msg.winnerPlayer", [player1]);

            case Turn.PLAYER2:
                return formatter._getText(this, "msg.winnerPlayer", [player2]);

            case Turn.AUDIENCE:
                return formatter._getText(this, "msg.winnerAudience");

            default:
                return formatter._getText(this, "msg.noWinner");
        }
    },

    formatPoints(
        this: any,
        points: number
    ): string {
        if (!points || points <= 0) {
            return "";
        }
        return formatter._getText(this, "msg.pointsGained", [points]);
    },

    formatProgress(
        this: any,
        current: number,
        total: number
    ): string {
        if (!total || total <= 0) {
            return "";
        }
        return formatter._getText(this, "msg.progressSimple", [current, total]);
    },

    formatProgressWithPercent(
        this: any,
        iCurrent: number,
        iTotal: number,
        iPercent: number
    ): string {
        if (!iCurrent || !iTotal) {
            return "";
        }
        return formatter._getText(this, "msg.progressPercent", [iCurrent, iTotal, iPercent || 0]);
    }
};

export default formatter;