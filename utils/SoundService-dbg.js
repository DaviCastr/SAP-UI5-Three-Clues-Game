sap.ui.define([], function () {
  "use strict";

  var SoundEffect = /*#__PURE__*/function (SoundEffect) {
    SoundEffect["SPIN"] = "spin";
    SoundEffect["CORRECT"] = "correct";
    SoundEffect["WRONG"] = "wrong";
    SoundEffect["TIME_EXPIRED"] = "time_expired";
    SoundEffect["GAME_OVER"] = "game_over";
    return SoundEffect;
  }(SoundEffect || {});
  class SoundService {
    audioCache = new Map();

    // Mapeamento dos arquivos de áudio (você pode ajustar os caminhos/links)
    soundUrls = {
      [SoundEffect.SPIN]: "../sounds/spin.mp3",
      [SoundEffect.CORRECT]: "../sounds/correct.mp3",
      [SoundEffect.WRONG]: "../sounds/wrong.mp3",
      [SoundEffect.TIME_EXPIRED]: "../sounds/time_expired.mp3",
      [SoundEffect.GAME_OVER]: "../sounds/game_over.mp3"
    };
    constructor(model) {
      this.model = model;
      this.preloadSounds();
    }
    static getInstance(model) {
      if (!SoundService.instance) {
        SoundService.instance = new SoundService(model);
      }
      return SoundService.instance;
    }

    /**
     * Pré-carrega os áudios em memória para não haver atraso na reprodução
     */
    preloadSounds() {
      Object.entries(this.soundUrls).forEach(([key, url]) => {
        const audio = new Audio(url);
        audio.preload = "auto";
        this.audioCache.set(key, audio);
      });
    }

    /**
     * Toca um efeito sonoro caso a opção de som esteja ativada nas configurações
     */
    play(effect) {
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
    stop(effect) {
      const audio = this.audioCache.get(effect);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    }
  }
  SoundService.SoundEffect = SoundEffect;
  return SoundService;
});
//# sourceMappingURL=SoundService-dbg.js.map
