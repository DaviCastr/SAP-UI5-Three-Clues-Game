sap.ui.define(["apps/dflc/threecluesgame/controller/Start.controller"], function (__Controller) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  /*global QUnit*/
  const Controller = _interopRequireDefault(__Controller);
  QUnit.module("Start Controller");
  QUnit.test("I should test the Start controller", function (assert) {
    const oAppController = new Controller("Start");
    oAppController.onInit();
    assert.ok(oAppController);
  });
});
//# sourceMappingURL=StartPage-dbg.controller.js.map
