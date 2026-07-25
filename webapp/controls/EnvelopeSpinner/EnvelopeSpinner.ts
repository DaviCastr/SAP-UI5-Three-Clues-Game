import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import type { MetadataOptions } from "sap/ui/core/Element";
import EnvelopeSpinnerRenderer from "./EnvelopeSpinnerRenderer";
import includeStylesheet from "sap/ui/dom/includeStylesheet";

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

    private availableEnvelopes: number[] = [];
    private visibleEnvelopes: number[] = [0, 0, 0, 0, 0];
    private currentTranslateY = 0;
    
    private readonly SPIN_DURATION_MS = 3200;

    public static readonly metadata: MetadataOptions = {
        properties: {
            envelopeNumber: {
                type: "int",
                defaultValue: 0
            }
        },
        events: {
        }
    };

    public init(): void {
        super.init();
        const cssPath = sap.ui.require.toUrl("apps/dflc/threecluesgame/controls/EnvelopeSpinner/EnvelopeSpinner.css");
        includeStylesheet(cssPath);
    }

    public wait(milliseconds: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    public static renderer = EnvelopeSpinnerRenderer;

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

    private updateVisibleEnvelopes(currentIndex: number): void {
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
    }

    /**
     * Função de Easing Quad (Ease Out) para suavizar o final do giro
     */
    private easeOutQuad(t: number): number {
        return t * (2 - t);
    }

    public async spinTo(targetEnvelope: number): Promise<void> {
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

        const totalSteps = stepsToTarget + (totalEnvelopes * turns);

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
    }

    private animateTrack(): Promise<void> {
        return Promise.resolve();
    }

    private resetTrackPosition(): void {
    }
}