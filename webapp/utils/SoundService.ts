import GameModel from "../model/GameModel";

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

    // Mapeamento dos arquivos de áudio (você pode ajustar os caminhos/links)
    private readonly soundUrls: Record<SoundEffect, string> = {
        [SoundEffect.SPIN]: "../sounds/spin.mp3",
        [SoundEffect.CORRECT]: "../sounds/correct.mp3",
        [SoundEffect.WRONG]: "../sounds/wrong.mp3",
        [SoundEffect.TIME_EXPIRED]: "../sounds/time_expired.mp3",
        [SoundEffect.GAME_OVER]: "../sounds/game_over.mp3"
    };

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
     * Pré-carrega os áudios em memória para não haver atraso na reprodução
     */
    private preloadSounds(): void {
        Object.entries(this.soundUrls).forEach(([key, url]) => {
            const audio = new Audio(url);
            audio.preload = "auto";
            this.audioCache.set(key, audio);
        });
    }

    /**
     * Toca um efeito sonoro caso a opção de som esteja ativada nas configurações
     */
    public play(effect: SoundEffect): void {
        const soundsEnabled = this.model.getProperty("/settings/sounds");
        
        if (!soundsEnabled) {
            return; // Som desligado no menu
        }

        const audio = this.audioCache.get(effect);
        if (audio) {
            audio.currentTime = 0; // Reinicia o áudio do início
            audio.play().catch(() => {
                // Previne erros de reprodução bloqueada pelo navegador
            });
        }
    }

    /**
     * Para a reprodução de um som específico (ex: interromper o som de girar a roleta)
     */
    public stop(effect: SoundEffect): void {
        const audio = this.audioCache.get(effect);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }
}