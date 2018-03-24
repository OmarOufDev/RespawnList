import * as assert from "assert";
import { CustomError, ErrorCategory } from "../Errors/CustomError";
import { OptionsVerification } from "../Services/OptionsVerification";
import { Utilities } from "../MISC/Utilities";

describe("OptionsVerification", () => {
    describe("validate()", () => {
        it("throw an error as options was empty", () => {
            assert.throws( () => {
                new OptionsVerification({}).validate();
            }, (err) => {
            if (err instanceof CustomError) {
            const e = err as CustomError;
            assert.equal(e.ErrorCategory, ErrorCategory.InputError);
            assert.equal(e.ErrorMessage, `options is empty doesnt have any properties`);
            return true;
            }});
        });
        it("should return only the specified options", () => {
            const options = {
                enabled: "false",
            };
            const result = new OptionsVerification(options).validate();
            assert.deepStrictEqual({
                enabled: new Utilities().for(options.enabled, "enabled").toBoolean(),
            }, result);
        });
        it(" fully populate the options ", () => {
            const options = {
                enabled: "true",
                maxTime: 4,
                sameUserQueue: "false",
            };
            const result = new OptionsVerification(options).validate();
            assert.deepStrictEqual({
                enabled: new Utilities().for(options.enabled, "enabled").exists().toBoolean(),
                maxTime: new Date(0, 0, 0, 4, 0, 0, 0),
                sameUserQueue: new Utilities().for(options.sameUserQueue, "sameUserQueue").exists().toBoolean(),
            }, result);
        });
    });
});
