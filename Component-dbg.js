sap.ui.define(["sap/ui/core/UIComponent", "./model/models", "./model/GameModel", "./repository/EnvelopeRepository", "./model/GameEngine"], function (BaseComponent, ___model_models, __GameModel, __EnvelopeRepository, __GameEngine) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const createDeviceModel = ___model_models["createDeviceModel"];
  const GameModel = _interopRequireDefault(__GameModel);
  const EnvelopeRepository = _interopRequireDefault(__EnvelopeRepository);
  const GameEngine = _interopRequireDefault(__GameEngine);
  /**
   * @namespace apps.dflc.threecluesgame
   */
  const Component = BaseComponent.extend("apps.dflc.threecluesgame.Component", {
    metadata: {
      manifest: "json",
      interfaces: ["sap.ui.core.IAsyncContentCreation"]
    },
    init: function _init() {
      // call the base component's init function
      BaseComponent.prototype.init.call(this);
      const oGameModel = new GameModel();
      this.setModel(oGameModel, "game");
      this.gameEngine = new GameEngine(this.getModel("game"));

      // set the device model
      this.setModel(createDeviceModel(), "device");

      // enable routing
      this.getRouter().initialize();
      this.envelopeRepository = new EnvelopeRepository();
    },
    getEnvelopeRepository: function _getEnvelopeRepository() {
      return this.envelopeRepository;
    },
    getGameEngine: function _getGameEngine() {
      return this.gameEngine;
    }
  });
  return Component;
});
//# sourceMappingURL=Component-dbg.js.map
