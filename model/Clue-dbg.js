sap.ui.define([], function () {
  "use strict";

  class Clue {
    constructor(id, answer, hints, category = "", synonyms = []) {
      this.id = id;
      this.answer = answer;
      this.hints = hints;
      this.category = category;
      this.synonyms = synonyms;
    }
  }
  return Clue;
});
//# sourceMappingURL=Clue-dbg.js.map
