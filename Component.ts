import BaseComponent from "sap/ui/core/UIComponent";
import { createDeviceModel } from "./model/models";
import GameModel from "./model/GameModel";
import EnvelopeRepository from "./repository/EnvelopeRepository";
import GameEngine from "./model/GameEngine";

/**
 * @namespace apps.dflc.threecluesgame
 */
export default class Component extends BaseComponent {

    private envelopeRepository!: EnvelopeRepository;
    private gameEngine!: GameEngine;

    public static metadata = {
        manifest: "json",
        interfaces: [
            "sap.ui.core.IAsyncContentCreation"
        ]
    };

    public init(): void {
        // call the base component's init function
        super.init();

        const oGameModel = new GameModel();

        this.setModel(oGameModel, "game");

        this.gameEngine = new GameEngine(
            this.getModel("game") as GameModel
        );

        // set the device model
        this.setModel(createDeviceModel(), "device");

        // enable routing
        this.getRouter().initialize();

        this.envelopeRepository = new EnvelopeRepository();

    }

    public getEnvelopeRepository(): EnvelopeRepository {

        return this.envelopeRepository;

    }

    public getGameEngine(): GameEngine {

        return this.gameEngine;

    }

}