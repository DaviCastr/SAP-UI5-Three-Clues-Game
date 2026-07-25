sap.ui.define([], function () {
  "use strict";

  const EnvelopeSpinnerRenderer = {
    apiVersion: 2,
    render(rm, control) {
      rm.openStart("div", control);
      rm.class("envelopeSpinner");
      rm.openEnd();
      rm.openStart("div");
      rm.class("spinnerIcon");
      rm.openEnd();
      rm.text("🎡");
      rm.close("div");
      rm.openStart("div");
      rm.class("spinnerTrack");
      rm.openEnd();
      const envelopes = control.getVisibleEnvelopes() || [];
      for (let i = 0; i < envelopes.length; i++) {
        const isSelected = i === 2;
        rm.openStart("div");
        rm.class("spinnerRow");
        rm.openEnd();
        if (isSelected) {
          rm.openStart("span");
          rm.class("spinnerPointer");
          rm.openEnd();
          rm.text("▶");
          rm.close("span");
        }
        rm.openStart("div");
        rm.class("spinnerEnvelope");
        if (isSelected) {
          rm.class("spinnerEnvelopeSelected");
        }
        rm.openEnd();
        rm.text(envelopes[i].toString().padStart(2, "0"));
        rm.close("div");
        rm.close("div");
      }
      rm.close("div");
      rm.close("div");
    }
  };
  return EnvelopeSpinnerRenderer;
});
//# sourceMappingURL=EnvelopeSpinnerRenderer-dbg.js.map
