import * as assert from "assert";
import Utilities from "../Utilities";

describe("Utilities Tests", () => {
    describe("toBoolean test return proper value", () => {
        it("Return true if input \"1\" || \"true\"  || any other mixcase true ", () => {
            assert.equal(new Utilities("1", "boolean").toBoolean(), true);
            assert.equal(new Utilities("true", "boolean").toBoolean(), true);
            assert.equal(new Utilities("TRue", "boolean").toBoolean(), true);
        });
        it("Return false if input \"0\" || \"false\"  || any other mixcase false " , () => {
            assert.equal(new Utilities("0", "boolean").toBoolean(), false);
            assert.equal(new Utilities("false", "boolean").toBoolean(), false);
            assert.equal(new Utilities("FalSe", "boolean").toBoolean(), false);
        });
        it("throw an error if any other value", () => {
            const name = "boolean";
            assert.throws( () => {
            new Utilities("x", "boolean").toBoolean();
            }, TypeError , ` ${name} is not a boolean `);
        });
    });
});
