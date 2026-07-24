sap.ui.define(["sap/ui/core/Control", "./EnvelopeSpinnerRenderer", "sap/ui/dom/includeStylesheet"], function (Control, __EnvelopeSpinnerRenderer, includeStylesheet) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const EnvelopeSpinnerRenderer = _interopRequireDefault(__EnvelopeSpinnerRenderer); // Declaração do namespace para o TypeScript ignorar o erro do global
  /**
   * @namespace apps.dflc.threecluesgame.controls
   */
  const EnvelopeSpinner = Control.extend("apps.dflc.threecluesgame.controls.EnvelopeSpinner", {
    constructor: function constructor() {
      Control.prototype.constructor.apply(this, arguments);
      this.initialDelay = 100;
      this.finalDelay = 650;
      this.availableEnvelopes = [];
      this.completeTurns = 4;
      this.visibleEnvelopes = [0, 0, 0, 0, 0];
      this.currentTranslateY = 0;
    },
    // 2. Definição do Renderer Inline
    renderer: EnvelopeSpinnerRenderer,
    // 1. Definição da Metadata
    metadata: {
      properties: {
        envelopeNumber: {
          type: "int",
          defaultValue: 0
        }
      },
      events: {
        // Seus eventos entram aqui
      }
    },
    init: function _init() {
      Control.prototype.init.call(this);
      // Carrega o CSS customizado no DOM dinamicamente
      const cssPath = sap.ui.require.toUrl("apps/dflc/threecluesgame/controls/EnvelopeSpinner/EnvelopeSpinner.css");
      includeStylesheet(cssPath);
    },
    wait: function _wait(milliseconds) {
      return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
      });
    },
    setEnvelopeNumber: function _setEnvelopeNumber(value) {
      this.setProperty("envelopeNumber", value);
      this.invalidate();
      return this;
    },
    setAvailableEnvelopes: function _setAvailableEnvelopes(envelopes) {
      this.availableEnvelopes = [...envelopes];
    },
    getVisibleEnvelopes: function _getVisibleEnvelopes() {
      return this.visibleEnvelopes;
    },
    resetVisibleEnvelopes: function _resetVisibleEnvelopes(envelopes) {
      this.setAvailableEnvelopes(envelopes);
      this.visibleEnvelopes = envelopes.slice(0, 4);
      this.invalidate();
    },
    updateVisibleEnvelopes: function _updateVisibleEnvelopes(currentIndex) {
      this.visibleEnvelopes = [];
      const total = this.availableEnvelopes.length;
      for (let offset = -2; offset <= 2; offset++) {
        let index = currentIndex + offset;
        while (index < 0) {
          index += total;
        }
        index %= total;
        this.visibleEnvelopes.push(this.availableEnvelopes[index]);
      }
      this.invalidate();
    },
    spinTo: async function _spinTo(targetEnvelope) {
      if (this.availableEnvelopes.length === 0) {
        this.setEnvelopeNumber(targetEnvelope);
        return;
      }
      const startIndex = Math.floor(Math.random() * this.availableEnvelopes.length);
      let currentIndex = startIndex;
      let delay = this.initialDelay;
      const targetIndex = this.availableEnvelopes.indexOf(targetEnvelope);
      let steps = targetIndex - startIndex;
      if (steps < 0) {
        steps += this.availableEnvelopes.length;
      }
      steps += this.availableEnvelopes.length * this.completeTurns;
      const delayIncrement = steps > 1 ? (this.finalDelay - this.initialDelay) / (steps - 1) : 0;
      for (let i = 0; i < steps; i++) {
        this.setEnvelopeNumber(this.availableEnvelopes[currentIndex]);
        this.updateVisibleEnvelopes(currentIndex);
        await this.wait(Math.round(delay));
        delay += delayIncrement;
        currentIndex++;
        if (currentIndex >= this.availableEnvelopes.length) {
          currentIndex = 0;
        }
      }
      this.updateVisibleEnvelopes(currentIndex);
    },
    animateTrack: function _animateTrack() {
      return Promise.resolve();
    },
    resetTrackPosition: function _resetTrackPosition() {}
  });
  return EnvelopeSpinner;
});
//# sourceMappingURL=EnvelopeSpinner-dbg.js.map
