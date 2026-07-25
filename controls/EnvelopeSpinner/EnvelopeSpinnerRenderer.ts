import RenderManager from "sap/ui/core/RenderManager";
import EnvelopeSpinner from "./EnvelopeSpinner";

const EnvelopeSpinnerRenderer = {
    apiVersion: 2,

    render(rm: RenderManager, control: EnvelopeSpinner): void {

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

            rm.text(
                envelopes[i]
                    .toString()
                    .padStart(2, "0")
            );

            rm.close("div"); 
            rm.close("div");
        }

        rm.close("div"); 
        rm.close("div"); 
    }
};

export default EnvelopeSpinnerRenderer;