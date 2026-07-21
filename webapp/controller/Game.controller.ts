import Controller from "sap/ui/core/mvc/Controller";
import MessageToast from "sap/m/MessageToast";
import AnswerService from "../model/AnswerService";

export default class Game extends Controller {

    public onInit(): void {

        this.getView().setModel(
            this.getOwnerComponent().getModel("game"),
            "game"
        );

    }

    public onSpinWheel(): void {

        const result = AnswerService.isCorrectAnswer(
            "fogao",
            {
                id: 1,
                category: "Objeto",
                answer: "GELADEIRA",
                synonyms: ["REFRIGERADOR"],
                hints: []
            }
        );

        console.log(result); // true

        MessageToast.show(
            "Na próxima Sprint a roleta será implementada."
        );

    }

}