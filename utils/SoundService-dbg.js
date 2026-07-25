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
    getSoundUrl(soundFile) {
      return sap.ui.require.toUrl("apps/dflc/threecluesgame/sounds/" + soundFile);
    }
    preloadSounds() {
      const soundFiles = {
        [SoundEffect.SPIN]: "spin.mp3",
        [SoundEffect.CORRECT]: "correct.mp3",
        [SoundEffect.WRONG]: "wrong.mp3",
        [SoundEffect.TIME_EXPIRED]: "time_expired.mp3",
        [SoundEffect.GAME_OVER]: "game_over.mp3"
      };
      Object.entries(soundFiles).forEach(([key, fileName]) => {
        const resolvedUrl = this.getSoundUrl(fileName);
        const audio = new Audio(resolvedUrl);
        audio.preload = "auto";
        this.audioCache.set(key, audio);
      });
    }
    play(effect) {
      const soundsEnabled = this.model.getProperty("/settings/sounds");
      if (!soundsEnabled) {
        return;
      }
      const audio = this.audioCache.get(effect);
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(err => {
          console.warn(`[SoundService] Erro ao reproduzir o som ${effect}:`, err);
        });
      }
    }
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
