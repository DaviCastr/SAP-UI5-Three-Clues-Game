import RenderManager from "sap/ui/core/RenderManager";
import EnvelopeSpinner from "./EnvelopeSpinner";

const EnvelopeSpinnerRenderer = {
    apiVersion: 2,

    render(rm: RenderManager, control: EnvelopeSpinner): void {

        rm.openStart("div", control);
        rm.class("envelopeSpinner");
        rm.openEnd();

        rm.openStart("div");

        rm.class("spinnerTrack");

        rm.openEnd();

        rm.openStart("div");
        rm.class("spinnerIcon");
        rm.openEnd();

        rm.text("🎡");

        rm.close("div");

        rm.openStart("div");
        rm.class("spinnerNumber");
        rm.openEnd();

        const displayValue =
            control
                .getEnvelopeNumber()
                .toString()
                .padStart(2, "0");

        const envelopes =
            control.getVisibleEnvelopes();

        for (let i = 0; i < envelopes.length; i++) {

            rm.openStart("div");

            rm.class("spinnerRow");

            rm.openStart("div");

            rm.class("spinnerEnvelope");

            if (i === 2) {

                rm.class("spinnerEnvelopeSelected");

            }

            rm.openEnd();

            if (i === 2) {

                rm.text("▶ ");

            }

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

        rm.close("div");

    }
};

export default EnvelopeSpinnerRenderer;