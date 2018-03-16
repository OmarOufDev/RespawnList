import * as readline from "readline-sync";
import { CustomError } from "./CustomError";
import { RespawnListLogic } from "./RespawnListLogic";

const tmp = new RespawnListLogic();

function test() {
    const answer = readline.question("\nenter value:\n\t 1: addEntry\n\t 2: deleteEntry\n\t 3: getEntry\n\t 4: getEntries\n\t 5: addOptions To entry\n\t 6: addUserToEntry\n\t 7: deleteUserFromEntry\n\t");
    if ( answer === "exit") {
        return;
    }
    const answerAsNum = Number(answer);

    // Add Entry
    if (answerAsNum === 1) {
        const entryId = readline.question("\n\tEntry Id:\n\t");
        const entryName = readline.question("\n\tEntry Name:\n\t");
        tmp.addEntry(entryId, entryName);
    }

    // Delete Entry
    if (answerAsNum === 2) {
        const id = readline.question("Deletion Entry ID :");
        tmp.deleteEntry(id);
    }

    // Get Specific Entry
    if (answerAsNum === 3) {
        const entryId = readline.question("\n\tEntry Id:\n\t");
        console.log(tmp.getEntry(entryId));
    }

    // Get All Entries
    if (answerAsNum === 4) {
        console.log(tmp.getEntries());
    }

    // add OptionsTo Entry
    if (answerAsNum === 5) {
        const entryId = readline.question("\n\tEntry Id:\n\t");
        const options = ["maxTime", "enabled"];
        const index = readline.keyInSelect(options, "which option?");
        if (index === -1) {
            return;
        }
        if (options[index] === "enabled") {
            const obj = {
                enabled: readline.question("Value of enabled"),
            };
            tmp.addOptionsToEntry(entryId, obj);
            return;
        }
        if (options[index] === "maxTime") {
            const hours = readline.question("Enter a valid value for number of hours");
            const obj = { maxTime: hours};
            tmp.addOptionsToEntry(entryId, obj);
            return;
        }
    }

    // enque to entry
    if (answerAsNum === 6) {
        const entryId = readline.question("\n\tEntry Id:\n\t");
        const userId = readline.question("\n\tUser Id:\n\t");
        tmp.enqeueToEntry(entryId, userId);
    }

    // deque to entry
    if (answerAsNum === 7) {
        const entryId = readline.question("\n\tEntry Id:\n\t");
        const userId = readline.question("\n\tUser Id:\n\t");
        tmp.deqeueFromEntry(entryId, userId);
    }
}

function main() {
    try {
        test();
    } catch (e) {
        const err = e as CustomError;
        if (err instanceof CustomError) {
            err.logError();
        } else {
            console.log(e);
        }
    }
    main();
}

main();
