sap.ui.define(["sap/ui/model/json/JSONModel"], function (JSONModel) {
  "use strict";

  class EnvelopeRepository {
    envelopes = [];
    async loadDefault() {
      const model = new JSONModel();
      const jsonUrl = sap.ui.require.toUrl("/apps/dflc/threecluesgame/json/envelopes.json");
      await model.loadData(jsonUrl);
      this.envelopes = model.getData();
      return this.envelopes;
    }
    loadFromFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const content = reader.result;
            const json = JSON.parse(content);
            const envelopes = this.validateEnvelopes(json);
            this.envelopes = envelopes;
            resolve(envelopes);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = () => {
          reject(reader.error);
        };
        reader.readAsText(file);
      });
    }
    hasEnvelopes() {
      return this.envelopes.length > 0;
    }
    getCurrent() {
      return [...this.envelopes];
    }
    validateEnvelope(data) {
      if (typeof data !== "object" || data === null) {
        throw new Error("Envelope inválido.");
      }
      const envelope = data;
      this.validateId(envelope);
      this.validateCategory(envelope);
      this.validateAnswer(envelope);
      this.validateSynonyms(envelope);
      this.validateHints(envelope);
      return envelope;
    }
    validateEnvelopes(data) {
      if (!Array.isArray(data)) {
        throw new Error("O arquivo deve conter um array de envelopes.");
      }
      if (data.length === 0) {
        throw new Error("O arquivo não contém nenhum envelope.");
      }
      return data.map((item, index) => {
        try {
          return this.validateEnvelope(item);
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(`Envelope ${index + 1}: ${error.message}`);
          }
          throw error;
        }
      });
    }
    validateId(envelope) {
      if (typeof envelope.id !== "number") {
        throw new Error("O campo 'id' deve ser um número.");
      }
    }
    validateCategory(envelope) {
      if (typeof envelope.category !== "string" || envelope.category.trim().length === 0) {
        throw new Error("O campo 'category' é obrigatório.");
      }
    }
    validateAnswer(envelope) {
      if (typeof envelope.answer !== "string" || envelope.answer.trim().length === 0) {
        throw new Error("O campo 'answer' é obrigatório.");
      }
    }
    validateSynonyms(envelope) {
      if (!Array.isArray(envelope.synonyms)) {
        throw new Error("O campo 'synonyms' deve ser um array.");
      }
      if (envelope.synonyms.length === 0) {
        throw new Error("O envelope deve possuir pelo menos um sinônimo.");
      }
      if (!envelope.synonyms.every(synonym => typeof synonym === "string")) {
        throw new Error("Todos os sinônimos devem ser textos.");
      }
    }
    validateHints(envelope) {
      if (!Array.isArray(envelope.hints)) {
        throw new Error("O campo 'hints' deve ser um array.");
      }
      if (envelope.hints.length !== 3) {
        throw new Error("Cada envelope deve possuir exatamente 3 pistas.");
      }
      if (!envelope.hints.every(hint => typeof hint === "string")) {
        throw new Error("Todas as pistas devem ser textos.");
      }
    }
  }
  return EnvelopeRepository;
});
//# sourceMappingURL=EnvelopeRepository-dbg.js.map
