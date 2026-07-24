sap.ui.define([], function () {
  "use strict";

  class AnswerService {
    static normalize(text) {
      return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().replace(/\s+/g, " ").toUpperCase();
    }
    static isCorrectAnswer(answer, envelope) {
      const normalizedAnswer = this.normalize(answer);
      if (normalizedAnswer === this.normalize(envelope.answer)) {
        return true;
      }
      return envelope.synonyms.some(synonym => this.normalize(synonym) === normalizedAnswer);
    }
  }
  return AnswerService;
});
//# sourceMappingURL=AnswerService-dbg.js.map
