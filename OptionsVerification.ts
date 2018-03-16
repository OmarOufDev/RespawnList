import { CustomError, ErrorCategory } from "./CustomError";
import { Utilities } from "./Utilities";

export class OptionsVerification {

    constructor(private options: any) {

    }
    validate() {
        new Utilities(this.options, "options").exists();
        const newModel: any = {};
        if (this.options.enabled) {
            newModel.enabled = new Utilities(this.options.enabled, "enabled").toBoolean();
        }
        if (this.options.maxTime) {
            new Utilities(this.options.maxTime, "maxTime").isHour();
            newModel.maxTime = new Date(0, 0, 0, Number(this.options.maxTime), 0, 0, 0);
        }
        if (this.options.sameUserQueue) {
            newModel.sameUserQueue = new Utilities(this.options.sameUserQueue, "sameUserQueue").toBoolean();
        }

        new Utilities(newModel, "options").isObjectEmpty();
        return newModel;
    }
}
