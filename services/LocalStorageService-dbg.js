sap.ui.define([], function () {
  "use strict";

  class LocalStorageService {
    static STORAGE_KEY = "three-clues-game";
    static save(save) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(save));
    }
    static clear() {
      localStorage.removeItem(this.STORAGE_KEY);
    }
    static hasSavedGame() {
      return !!localStorage.getItem(this.STORAGE_KEY);
    }
    static load() {
      const value = localStorage.getItem(this.STORAGE_KEY);
      if (!value) {
        return null;
      }
      return JSON.parse(value);
    }
  }
  return LocalStorageService;
});
//# sourceMappingURL=LocalStorageService-dbg.js.map
