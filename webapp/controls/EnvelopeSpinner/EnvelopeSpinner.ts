import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import type { MetadataOptions } from "sap/ui/core/Element";
import EnvelopeSpinnerRenderer from "./EnvelopeSpinnerRenderer";
import includeStylesheet from "sap/ui/dom/includeStylesheet";

// Declaração do namespace para o TypeScript ignorar o erro do global
declare const sap: {
    ui: {
        require: {
            toUrl(path: string): string;
        };
    };
};

/**
 * @namespace apps.dflc.threecluesgame.controls
 */
export default class EnvelopeSpinner extends Control {

    private readonly initialDelay = 60;
    private readonly finalDelay = 200;
    private availableEnvelopes: number[] = [];
    private readonly completeTurns = 4;
    private visibleEnvelopes: number[] = [0, 0, 0, 0, 0];
    private currentTranslateY = 0;

    // 1. Definição da Metadata
    public static readonly metadata: MetadataOptions = {
        properties: {
            envelopeNumber: {
                type: "int",
                defaultValue: 0
            }
        },
        events: {
            // Seus eventos entram aqui
        }
    };


    public init(): void {
        super.init();
        // Carrega o CSS customizado no DOM dinamicamente
        const cssPath = sap.ui.require.toUrl("apps/dflc/threecluesgame/controls/EnvelopeSpinner/EnvelopeSpinner.css");
        includeStylesheet(cssPath);
    }


    public wait(milliseconds: number): Promise<void> {

        return new Promise(resolve => {

            setTimeout(resolve, milliseconds);

        });

    }

    // 2. Definição do Renderer Inline
    public static renderer = EnvelopeSpinnerRenderer

    declare getEnvelopeNumber: () => number;

    public setEnvelopeNumber(value: number): this {

        this.setProperty("envelopeNumber", value);

        this.invalidate();

        return this;

    }

    public setAvailableEnvelopes(envelopes: number[]): void {

        this.availableEnvelopes = [...envelopes];

    }

    public getVisibleEnvelopes(): number[] {

        return this.visibleEnvelopes;

    }

    public resetVisibleEnvelopes(envelopes: number[]): void {

        this.setAvailableEnvelopes(envelopes);

        this.visibleEnvelopes = envelopes.slice(0, 5);

        this.invalidate();

    }

    private updateVisibleEnvelopes(
        currentIndex: number
    ): void {

        this.visibleEnvelopes = [];

        const total = this.availableEnvelopes.length;

        for (let offset = -2; offset <= 2; offset++) {

            let index = currentIndex + offset;

            while (index < 0) {

                index += total;

            }

            index %= total;

            this.visibleEnvelopes.push(
                this.availableEnvelopes[index]
            );

        }

        this.invalidate();

    }

    public async spinTo(targetEnvelope: number): Promise<void> {

        if (this.availableEnvelopes.length === 0) {

            this.setEnvelopeNumber(targetEnvelope);
            return;

        }

        const startIndex = Math.floor(
            Math.random() * this.availableEnvelopes.length
        );

        let currentIndex = startIndex;

        let delay = this.initialDelay;

        const targetIndex =
            this.availableEnvelopes.indexOf(targetEnvelope);

        let steps =
            targetIndex - startIndex;

        if (steps < 0) {

            steps += this.availableEnvelopes.length;

        }

        steps +=
            this.availableEnvelopes.length
            *
            this.completeTurns;

        const delayIncrement =
            steps > 1
                ? (this.finalDelay - this.initialDelay) / (steps - 1)
                : 0;

        for (let i = 0; i < steps; i++) {

            this.setEnvelopeNumber(
                this.availableEnvelopes[currentIndex]
            );

            this.updateVisibleEnvelopes(currentIndex);

            await this.wait(Math.round(delay));

            delay += delayIncrement;

            currentIndex++;

            if (currentIndex >= this.availableEnvelopes.length) {

                currentIndex = 0;

            }

        }

        this.updateVisibleEnvelopes(currentIndex);

    }

    private animateTrack(): Promise<void> {

        return Promise.resolve();

    }

    private resetTrackPosition(): void {

    }

}