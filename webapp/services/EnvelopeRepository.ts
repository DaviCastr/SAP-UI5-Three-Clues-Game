import JSONModel from "sap/ui/model/json/JSONModel";
import { IEnvelope } from "../model/GameEngine";

export default class EnvelopeRepository {

    private envelopes: IEnvelope[] = [];

    public async loadDefault(): Promise<IEnvelope[]> {

        const model = new JSONModel();

        await model.loadData("../json/envelopes.json");

        this.envelopes = model.getData();

        return this.envelopes;

    }

    public getCurrent(): IEnvelope[] {

        return [...this.envelopes];

    }

}