import * as assert from "assert";
import { CustomError, ErrorCategory } from "../CustomError";
import { OptionsVerification } from "../OptionsVerification";
import { Utilities } from "../Utilities";

describe("OptionsVerification", () => {
    describe("validate()", () => {
        it("throw an error as options was empty", () => {
            assert.throws( () => {
                console.log(new OptionsVerification({}).validate());
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
                enabled: new Utilities(options.enabled, "enabled").toBoolean(),
            }, result);
        });
    });
});
