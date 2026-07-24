import GameModel from "./GameModel";

export enum SoundEffect {
    SPIN = "spin",
    CORRECT = "correct",
    WRONG = "wrong",
    TIME_EXPIRED = "time_expired",
    GAME_OVER = "game_over"
}

export default class SoundService {
    private static instance: SoundService;
    private model: GameModel;
    private audioCache: Map<string, HTMLAudioElement> = new Map();

    private constructor(model: GameModel) {
        this.model = model;
        this.preloadSounds();
    }

    public static getInstance(model: GameModel): SoundService {
        if (!SoundService.instance) {
            SoundService.instance = new SoundService(model);
        }
        return SoundService.instance;
    }

    /**
     * Retorna a URL absoluta resolvida dinamicamente pelo SAPUI5
     */
    private getSoundUrl(soundFile: string): string {
        // Substitua 'apps/dflc/threecluesgame' pelo namespace exato do seu Component.js / manifest.json
        // Por exemplo: se seu namespace for "apps.dflc.threecluesgame", use:
        return sap.ui.require.toUrl("apps/dflc/threecluesgame/sounds/" + soundFile);
    }

    /**
     * Pré-carrega os áudios em memória
     */
    private preloadSounds(): void {
        const soundFiles: Record<SoundEffect, string> = {
            [SoundEffect.SPIN]: "spin.mp3",
            [SoundEffect.CORRECT]: "correct.mp3",
            [SoundEffect.WRONG]: "wrong.mp3",
            [SoundEffect.TIME_EXPIRED]: "time_expired.mp3",
            [SoundEffect.GAME_OVER]: "game_over.mp3"
        };

        Object.entries(soundFiles).forEach(([key, fileName]) => {
            // Resolve o caminho real no ambiente atual (localhost ou GitHub Pages)
            const resolvedUrl = this.getSoundUrl(fileName);
            
            const audio = new Audio(resolvedUrl);
            audio.preload = "auto";
            this.audioCache.set(key, audio);
        });
    }

    public play(effect: SoundEffect): void {
        const soundsEnabled = this.model.getProperty("/settings/sounds");
        if (!soundsEnabled) {
            return;
        }

        const audio = this.audioCache.get(effect);
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch((err) => {
                console.warn(`[SoundService] Erro ao reproduzir o som ${effect}:`, err);
            });
        }
    }

    public stop(effect: SoundEffect): void {
        const audio = this.audioCache.get(effect);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }
}