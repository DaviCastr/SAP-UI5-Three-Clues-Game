import RenderManager from "sap/ui/core/RenderManager";
import EnvelopeSpinner from "./EnvelopeSpinner";

const EnvelopeSpinnerRenderer = {
    apiVersion: 2,

    render(rm: RenderManager, control: EnvelopeSpinner): void {

        // Main Container
        rm.openStart("div", control);
        rm.class("envelopeSpinner");
        rm.openEnd();

        // Top Icon
        rm.openStart("div");
        rm.class("spinnerIcon");
        rm.openEnd();
        rm.text("🎡");
        rm.close("div");

        // Track Container
        rm.openStart("div");
        rm.class("spinnerTrack");
        rm.openEnd();

        const envelopes = control.getVisibleEnvelopes() || [];

        for (let i = 0; i < envelopes.length; i++) {
            const isSelected = i === 2; // O item do meio (índice 2) é o selecionado

            rm.openStart("div");
            rm.class("spinnerRow");
            rm.openEnd();

            // Seta indicadora fora do cartão para não desalinhar o número
            if (isSelected) {
                rm.openStart("span");
                rm.class("spinnerPointer");
                rm.openEnd();
                rm.text("▶");
                rm.close("span");
            }

            // Cartão do Envelope
            rm.openStart("div");
            rm.class("spinnerEnvelope");

            if (isSelected) {
                rm.class("spinnerEnvelopeSelected");
            }

            rm.openEnd();

            // Texto do Envelope (ex: "01", "02")
            rm.text(
                envelopes[i]
                    .toString()
                    .padStart(2, "0")
            );

            rm.close("div"); // Fecha spinnerEnvelope
            rm.close("div"); // Fecha spinnerRow
        }

        rm.close("div"); // Fecha spinnerTrack
        rm.close("div"); // Fecha envelopeSpinner
    }
};

export default EnvelopeSpinnerRenderer;