import * as assert from "assert";
import { Utilities } from "../Utilities";

/**
 * test for all of the utilities functions.
 */
describe("Utilities Tests", () => {

    describe("Exists()", () => {
        it("throw an error if value is null", () => {
            const name = "id";
            const value = null;
            assert.throws( () => {
                new Utilities(value, name).exists();
            }, TypeError , `${name} is null` );
        });
        it("throw an error if value is undefined", () => {
            const name = "id";
            const value = undefined;
            assert.throws( () => {
                new Utilities(value, name).exists();
            }, TypeError , `${name} is null` );
        });
    });

    describe("toBoolean()", () => {
        it("throw an error if any other value than 1,0 true,false ( even mixcases )", () => {
            const name = "boolean";
            assert.throws( () => {
            new Utilities("x", "boolean").toBoolean();
            }, TypeError , ` ${name} is not a boolean `);
        });
    });

    describe("isHour()", () => {
        it("throw an error if hour < 0", () => {
            const name = "hour";
            const value = -1;
            assert.throws( () => {
                new Utilities(value, name).exists().isHour();
            }, TypeError , `${name}: ${value} is not a valid Hour value`);
        });
        it("throw an error if hour > 23", () => {
            const name = "hour";
            const value = 24;
            assert.throws( () => {
                new Utilities(value, name).exists().isHour();
            }, TypeError , `${name}: ${value} is not a valid Hour value`);
        });
    });

});
