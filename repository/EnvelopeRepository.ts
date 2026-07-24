import JSONModel from "sap/ui/model/json/JSONModel";
import { IEnvelope } from "../model/GameEngine";

export default class EnvelopeRepository {

    private envelopes: IEnvelope[] = [];

    public async loadDefault(): Promise<IEnvelope[]> {

        const model = new JSONModel();

        const jsonUrl = (sap.ui as any).require.toUrl("/apps/dflc/threecluesgame/json/envelopes.json");

        await model.loadData(jsonUrl);

        this.envelopes = model.getData();

        return this.envelopes;

    }

    public loadFromFile(file: File): Promise<IEnvelope[]> {

        return new Promise((resolve, reject) => {

            const reader = new FileReader();

            reader.onload = () => {

                try {

                    const content = reader.result as string;

                    const json = JSON.parse(content);

                    const envelopes = this.validateEnvelopes(json);

                    this.envelopes = envelopes;

                    resolve(envelopes);

                } catch (error) {

                    reject(error);

                }

            };

            reader.onerror = () => {

                reject(reader.error);

            };

            reader.readAsText(file);

        });

    }

    public hasEnvelopes(): boolean {

        return this.envelopes.length > 0;

    }

    public getCurrent(): IEnvelope[] {

        return [...this.envelopes];

    }

    private validateEnvelope(data: unknown): IEnvelope {

        if (typeof data !== "object" || data === null) {

            throw new Error(
                "Envelope inválido."
            );

        }

        const envelope = data as IEnvelope;

        this.validateId(envelope);
        this.validateCategory(envelope);
        this.validateAnswer(envelope);
        this.validateSynonyms(envelope);
        this.validateHints(envelope);

        return envelope;

    }

    private validateEnvelopes(data: unknown): IEnvelope[] {

        if (!Array.isArray(data)) {

            throw new Error(
                "O arquivo deve conter um array de envelopes."
            );

        }

        if (data.length === 0) {

            throw new Error(
                "O arquivo não contém nenhum envelope."
            );

        }

        return data.map((item, index) => {

            try {

                return this.validateEnvelope(item);

            } catch (error) {

                if (error instanceof Error) {

                    throw new Error(
                        `Envelope ${index + 1}: ${error.message}`
                    );

                }

                throw error;

            }

        });

    }

    private validateId(envelope: IEnvelope): void {

        if (typeof envelope.id !== "number") {

            throw new Error(
                "O campo 'id' deve ser um número."
            );

        }

    }

    private validateCategory(envelope: IEnvelope): void {

        if (
            typeof envelope.category !== "string"
            || envelope.category.trim().length === 0
        ) {

            throw new Error(
                "O campo 'category' é obrigatório."
            );

        }

    }

    private validateAnswer(envelope: IEnvelope): void {

        if (
            typeof envelope.answer !== "string"
            || envelope.answer.trim().length === 0
        ) {

            throw new Error(
                "O campo 'answer' é obrigatório."
            );

        }

    }

    private validateSynonyms(envelope: IEnvelope): void {

        if (!Array.isArray(envelope.synonyms)) {

            throw new Error(
                "O campo 'synonyms' deve ser um array."
            );

        }

        if (envelope.synonyms.length === 0) {

            throw new Error(
                "O envelope deve possuir pelo menos um sinônimo."
            );

        }

        if (
            !envelope.synonyms.every(
                synonym => typeof synonym === "string"
            )
        ) {

            throw new Error(
                "Todos os sinônimos devem ser textos."
            );

        }

    }

    private validateHints(envelope: IEnvelope): void {

        if (!Array.isArray(envelope.hints)) {

            throw new Error(
                "O campo 'hints' deve ser um array."
            );

        }

        if (envelope.hints.length !== 3) {

            throw new Error(
                "Cada envelope deve possuir exatamente 3 pistas."
            );

        }

        if (
            !envelope.hints.every(
                hint => typeof hint === "string"
            )
        ) {

            throw new Error(
                "Todas as pistas devem ser textos."
            );

        }

    }
}