sap.ui.define(["sap/ui/core/Control", "./EnvelopeSpinnerRenderer", "sap/ui/dom/includeStylesheet"], function (Control, __EnvelopeSpinnerRenderer, includeStylesheet) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const EnvelopeSpinnerRenderer = _interopRequireDefault(__EnvelopeSpinnerRenderer);
  /**
   * @namespace apps.dflc.threecluesgame.controls
   */
  const EnvelopeSpinner = Control.extend("apps.dflc.threecluesgame.controls.EnvelopeSpinner", {
    constructor: function constructor() {
      Control.prototype.constructor.apply(this, arguments);
      this.availableEnvelopes = [];
      this.visibleEnvelopes = [0, 0, 0, 0, 0];
      this.currentTranslateY = 0;
      this.SPIN_DURATION_MS = 3600;
    },
    renderer: EnvelopeSpinnerRenderer,
    metadata: {
      properties: {
        envelopeNumber: {
          type: "int",
          defaultValue: 0
        }
      },
      events: {}
    },
    init: function _init() {
      Control.prototype.init.call(this);
      const cssPath = sap.ui.require.toUrl("apps/dflc/threecluesgame/controls/EnvelopeSpinner/EnvelopeSpinner.css");
      includeStylesheet(cssPath);
    },
    wait: function _wait(milliseconds) {
      return new Promise(resolve => setTimeout(resolve, milliseconds));
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
      this.visibleEnvelopes = envelopes.slice(0, 5);
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
    easeOutQuad: function _easeOutQuad(t) {
      return t * (2 - t);
    },
    spinTo: async function _spinTo(targetEnvelope) {
      if (this.availableEnvelopes.length === 0) {
        this.setEnvelopeNumber(targetEnvelope);
        return;
      }
      const totalEnvelopes = this.availableEnvelopes.length;
      const startIndex = Math.floor(Math.random() * totalEnvelopes);
      const targetIndex = this.availableEnvelopes.indexOf(targetEnvelope);
      const turns = 3;
      let stepsToTarget = targetIndex - startIndex;
      if (stepsToTarget < 0) {
        stepsToTarget += totalEnvelopes;
      }
      const totalSteps = stepsToTarget + totalEnvelopes * turns;
      const startTime = performance.now();
      let lastStepExecuted = -1;
      while (true) {
        const now = performance.now();
        const elapsed = now - startTime;
        if (elapsed >= this.SPIN_DURATION_MS) {
          break;
        }
        const timeProgress = elapsed / this.SPIN_DURATION_MS;
        const easedProgress = this.easeOutQuad(timeProgress);
        const currentStep = Math.floor(easedProgress * totalSteps);
        if (currentStep !== lastStepExecuted) {
          lastStepExecuted = currentStep;
          const currentIndex = (startIndex + currentStep) % totalEnvelopes;
          this.setEnvelopeNumber(this.availableEnvelopes[currentIndex]);
          this.updateVisibleEnvelopes(currentIndex);
        }
        await this.wait(16);
      }
      this.setEnvelopeNumber(targetEnvelope);
      this.updateVisibleEnvelopes(targetIndex);
    },
    animateTrack: function _animateTrack() {
      return Promise.resolve();
    },
    resetTrackPosition: function _resetTrackPosition() {}
  });
  return EnvelopeSpinner;
});
//# sourceMappingURL=EnvelopeSpinner-dbg.js.map
