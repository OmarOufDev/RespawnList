export class RespawnListOptionsModel {

    constructor(options: any) {
        this.enabled = options.enabled;
        this.maxTime = options.maxTime;
        this.sameUserQueue = options.sameUserQueue;
    }

    // entry is active or not.
    enabled?: boolean;
    // Max Time . Number of hours.
    maxTime?: Date;
    // sameUser multiple queue per entry?
    sameUserQueue?: boolean;

}
