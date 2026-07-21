import BaseComponent from "sap/ui/core/UIComponent";
import { createDeviceModel } from "./model/models";
import GameModel from "./model/GameModel";

/**
 * @namespace apps.dflc.threecluesgame
 */
export default class Component extends BaseComponent {

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

        // set the device model
        this.setModel(createDeviceModel(), "device");

        // enable routing
        this.getRouter().initialize();
    }
}