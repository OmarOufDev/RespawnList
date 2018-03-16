import * as assert from "assert";
import { CustomError, ErrorCategory } from "../CustomError";
import { RespawnListModel } from "../Models";
import { RespawnListLogic } from "../RespawnListLogic";

describe("RespawnList", () => {

    describe("addEntry", () => {
        const respList = new RespawnListLogic();

        it("Should return added entry if successful", () => {
            const result = respList.addEntry("0", "entry");
            const expectedResult = new RespawnListModel("0", "entry");
            assert.deepEqual(result, expectedResult);
        });

        it("Should throw a type error as id is undefined", () => {
            assert.throws(() => {
                  respList.addEntry(undefined, "ted");
            }, TypeError, ` ted is null `);
        });
    });

    describe("getEntry", () => {
        const respList = new RespawnListLogic();

        it("Should throw a Custom error as entry with id does not exists", () => {
            assert.throws( () => {
                  respList.getEntry("0");
            }, (err) => {
                if (err instanceof CustomError) {
                    const e = err as CustomError;
                    assert.equal(e.ErrorCategory, ErrorCategory.ResourceNotFound);
                    assert.equal(e.ErrorMessage, `Entry with 0 doesnt exist`);
                    return true;
                }
            });
        });
    });

    describe("configuration", () => {
        const respList = new RespawnListLogic();
        respList.addEntry("1", "1");
        respList.addOptionsToEntry("1", {
            maxTime: 1,
        });
        respList.enqeueToEntry("1", "u1");
        const copy = respList.getEntries();

        before(() => {
            respList.saveConfigration();
            respList.loadConfiguration();
        });

        it("should save and load properly", () => {
            const original  = respList.getEntries();
            for (let i = 0; i < copy.length; i++) {
                assert.equal(copy[i].id, original[i].id);
                assert.equal(copy[i].name, original[i].name);
                if (copy[i].options) {
                    assert.equal(copy[i].options.enabled, original[i].options.enabled);
                    assert.equal(copy[i].options.maxTime.getTime(), original[i].options.maxTime.getTime());
                }
            }
        });

    });
});
