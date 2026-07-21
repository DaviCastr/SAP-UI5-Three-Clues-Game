import { IEnvelope } from "./GameEngine";

export default class AnswerService {

    public static normalize(text: string): string {

        return text
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .replace(/\s+/g, " ")
            .toUpperCase();

    }

    public static isCorrectAnswer(
        answer: string,
        envelope: IEnvelope
    ): boolean {

        const normalizedAnswer = this.normalize(answer);

        if (normalizedAnswer === this.normalize(envelope.answer)) {
            return true;
        }

        return envelope.synonyms.some(
            synonym => this.normalize(synonym) === normalizedAnswer
        );

    }

}