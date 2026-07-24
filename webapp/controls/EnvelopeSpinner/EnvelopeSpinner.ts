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

    private availableEnvelopes: number[] = [];
    private visibleEnvelopes: number[] = [0, 0, 0, 0, 0];
    private currentTranslateY = 0;
    
    // Duração fixa da animação em milissegundos (3 segundos)
    private readonly SPIN_DURATION_MS = 3000;

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
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    // 2. Definição do Renderer Inline
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

        // Define quantas voltas completas dará dentro dos 3 segundos (ex: 3 voltas)
        const turns = 3;
        
        let stepsToTarget = targetIndex - startIndex;
        if (stepsToTarget < 0) {
            stepsToTarget += totalEnvelopes;
        }

        const totalSteps = stepsToTarget + (totalEnvelopes * turns);

        const startTime = performance.now();
        let lastStepExecuted = -1;

        // Loop controlado pelo tempo absoluto (duração de 3000 ms)
        while (true) {
            const now = performance.now();
            const elapsed = now - startTime;
            
            // Se ultrapassou os 3 segundos, encerra a animação no envelope correto
            if (elapsed >= this.SPIN_DURATION_MS) {
                break;
            }

            // Progresso de 0 a 1 no tempo
            const timeProgress = elapsed / this.SPIN_DURATION_MS;

            // Aplica a curva de desaceleração (começa rápido, termina devagar)
            const easedProgress = this.easeOutQuad(timeProgress);

            // Calcula qual é o passo atual
            const currentStep = Math.floor(easedProgress * totalSteps);

            if (currentStep !== lastStepExecuted) {
                lastStepExecuted = currentStep;
                const currentIndex = (startIndex + currentStep) % totalEnvelopes;

                this.setEnvelopeNumber(this.availableEnvelopes[currentIndex]);
                this.updateVisibleEnvelopes(currentIndex);
            }

            // Pequena pausa para devolver controle à UI (aprox. 60 FPS)
            await this.wait(16);
        }

        // Garante a parada exata no envelope alvo e atualiza o estado final
        this.setEnvelopeNumber(targetEnvelope);
        this.updateVisibleEnvelopes(targetIndex);
    }

    private animateTrack(): Promise<void> {
        return Promise.resolve();
    }

    private resetTrackPosition(): void {
    }
}