/*global QUnit*/
import Controller from "apps/dflc/threecluesgame/controller/Start.controller";

QUnit.module("Start Controller");

QUnit.test("I should test the Start controller", function (assert: Assert) {
	const oAppController = new Controller("Start");
	oAppController.onInit();
	assert.ok(oAppController);
});