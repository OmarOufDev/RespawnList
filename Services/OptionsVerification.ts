import { bottle } from "../BaseLayer/BottleManager";
import { CustomError, ErrorCategory } from "../Errors/CustomError";

export class OptionsVerification {

    constructor(private options: any) {
    }
    validate() {
        const utilities = bottle.container.Utilities;
        utilities.for(this.options, "options").exists();
        const newModel: any = {};
        if (this.options.enabled) {
            newModel.enabled = utilities.for(this.options.enabled, "enabled").toBoolean();
        }
        if (this.options.maxTime) {
            utilities.for(this.options.maxTime, "maxTime").isHour();
            newModel.maxTime = new Date(0, 0, 0, Number(this.options.maxTime), 0, 0, 0);
        }
        if (this.options.sameUserQueue) {
            newModel.sameUserQueue = utilities.for(this.options.sameUserQueue, "sameUserQueue").toBoolean();
        }

        utilities.for(newModel, "options").isObjectEmpty();
        return newModel;
    }
}
