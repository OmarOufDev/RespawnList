import * as fs from "fs";
import { CustomError, ErrorCategory } from "./CustomError";
import { IRespawnListLogic } from "./IRespawnListLogic";
import { RespawnListModel, RespawnListOptionsModel } from "./Models";
import { OptionsVerification } from "./OptionsVerification";
import { Utilities } from "./Utilities";

/**
 * Class Responsible for implementing the business logic of IRespawnList
 */
export class RespawnListLogic implements IRespawnListLogic {

    // local storage
    private storage: RespawnListModel[];
    private loopTimeInSec: number = 50;
    private intervalId: any;
    private pauseTime: Date;
    private defaultOptions: RespawnListOptionsModel = null;

    /** creates an instance of the class */
    constructor() {
        this.storage = [];
    }

    /**
     * Adds an entry that can be Claimable / reserved.
     * @param id of the entry.
     */
    public addEntry(id: string, name: string) {
        new Utilities().for(id, "id").exists();
        let exists = true;
        try {
            this.getEntry(id);
        } catch (e) {
            if (!(e instanceof CustomError) || e.ErrorCategory !== ErrorCategory.ResourceNotFound ) {
                throw e;
            }
            exists = false;
        }
        if (exists) {
            throw new CustomError(ErrorCategory.Conflict, "Entry with given id already exists");
        }
        let newEntry = null;
        if (this.defaultOptions) {
            newEntry = new RespawnListModel(id, name, this.defaultOptions);
        } else {
            newEntry = new RespawnListModel(id, name);
        }
        this.storage.push(newEntry);
        return newEntry;
    }

    /**
     *
     * @param id
     */
    public deleteEntry(id: string) {
        new Utilities().for(id, "id").exists();
        const [entry, index] = this.getEntry(id);
        this.storage.splice(index, 1);
    }

    /**
     *
     * @param id
     */
    public getEntry(id: string): [RespawnListModel, number] {
        new Utilities().for(id, "id").exists();
        const index = this.storage.findIndex(t => t.id === id);
        if (index === -1) {
            throw new CustomError(ErrorCategory.ResourceNotFound, `Entry with ${id} doesnt exist`);
        }
        const entry = this.storage[index];
        return [entry, index];
    }

    /**
     *
     */
    public getEntries(): RespawnListModel[] {
        return this.storage;
    }

    /**
     * Adds options ( if given as input to entry );
     * @param id entry id.
     * @param options
     */
    public addOptionsToEntry(id: string , options: any, overRide: boolean = false) {
        const validatedOptions = new OptionsVerification(options).validate();
        const [entry, index] = this.getEntry(id);
        if (!entry) {
            throw new CustomError(ErrorCategory.ResourceNotFound, "Entry cannot be retrieved if it doesnt exist");
        }
        if (validatedOptions.enabled) {
            entry.options.enabled = validatedOptions.enabled;
        }
        if (validatedOptions.maxTime) {
            if ( overRide || !entry.options.maxTime) {
                entry.options.maxTime = validatedOptions.maxTime;
            }
        }
        if (validatedOptions.sameUserQueue) {
            if ( overRide || !entry.options.sameUserQueue) {
            entry.options.sameUserQueue = validatedOptions.sameUserQueue;
            }
        }
    }

    addGlobalOptions(options: any, overRide: boolean = false) {
        new Utilities().for(options, "options").exists();
        this.storage.map( (e) => {
            this.addOptionsToEntry(e.id, options, overRide);
        });
    }

    saveConfigration() {
        const fileStorage: any = {};
        fileStorage.defaultOptions = this.defaultOptions;
        const temp = this.storage;
        temp.map( v => {
            delete v.userId;
            delete v.startTimeStamp;
            v.nextQueue = [];
        });
        fileStorage.storage = temp;
        fs.writeFileSync("respList.json", JSON.stringify(fileStorage, null, 4), "utf8");
    }

    loadConfiguration() {
        const fileStorage = JSON.parse(fs.readFileSync("respList.json", "utf8"));
        const defaultOptions = fileStorage.defaultOptions;
        if (defaultOptions && defaultOptions.maxTime) {
            defaultOptions.maxTime = new Date(0, 0, 0, defaultOptions.maxTime, 0, 0, 0);
        }
        const temp = fileStorage.storage;
        temp.map(entry => {
            if (entry.options && entry.options.maxTime) {
                entry.options.maxTime = new Date(entry.options.maxTime);
            }
        });
        this.storage = temp;
    }
    /**
     *
     * @param id
     * @param userId
     */
    enqeueToEntry(id: string, userId: string): RespawnListModel {
        const entry = this.storage.find(e => e.id === id);

        // entry not found, or entry.options.enabled is false;
        if (!entry || (entry && entry.options && !entry.options.enabled)) {
            throw new CustomError(ErrorCategory.ResourceNotFound, "Entry cannot be retrieved if it doesnt exist");
        }

        this.addUserToEntryLogic(entry, userId);

        return entry;
    }

    /**
     *
     * @param id
     * @param userId
     */
    deqeueFromEntry(id: string, userId: string): RespawnListModel {
        const index = this.storage.findIndex(e => e.id === id);
        const entry = this.storage[index];

        this.removeUserFromEntryLogic(entry, userId);
        this.storage[index] = entry;
        return entry;
    }

    /**
     *
     */
    private validateOptions() {
        const tempdate = new Date();
        this.storage.forEach((v, index) => {
            if (v.options && v.options.maxTime &&
                tempdate.getTime() - v.startTimeStamp.getTime() >= v.options.maxTime.getTime()
                && v.nextQueue.length > 0) {
                    this.removeUserFromEntryLogic(v, v.userId);
                    this.storage[index] = v;
                }
        });
    }
    /**
     *
     * @param entry
     * @param userId
     */
    private addUserToEntryLogic(entry: RespawnListModel, userId: string) {

        if (entry.options.sameUserQueue ) {
            if (entry.userId) {
                if (entry.userId === userId) {
                    throw new CustomError(ErrorCategory.Conflict, "Cannot add a user twice #sameUserQueue active on entry");
                }
                if (entry.nextQueue.length > 0 &&
                    entry.nextQueue.findIndex(v => v === userId) === -1 ) {
                        throw new CustomError(ErrorCategory.Conflict, "Cannot add a user twice #sameUserQueue active on entry");
                }
            }
        }

        if (!entry.userId) {
            entry.userId = userId;
            entry.startTimeStamp = new Date();
            return;
        }
        entry.nextQueue.push(userId);
    }

    /**
     *
     * @param entry
     * @param userId
     */
    private removeUserFromEntryLogic(entry: RespawnListModel, userId: string) {
        if (!entry.userId) {
            throw new CustomError(ErrorCategory.ResourceNotFound, "Cannot Delete a user from an empty entry");
        }
        if (entry.userId === userId) {
            delete entry.userId;
            delete entry.startTimeStamp;
            if (entry.nextQueue.length !== 0) {
                entry.userId = entry.nextQueue[0];
                entry.startTimeStamp = new Date();
                entry.nextQueue.splice(0, 1);
            }
            return;
        }
        const inx = entry.nextQueue.findIndex(id => id === userId);
        if (inx === -1) {
            throw new CustomError(ErrorCategory.ResourceNotFound, "Cannot delete a user from an entry that the user doesnt exist in");
        }
        entry.nextQueue.splice(inx, 1);
    }

    // BackGround Operations

    /**
     *
     */
    runLoop() {
        this.intervalId = setInterval(this.validateOptions, this.loopTimeInSec * 1000);
    }

    /**
     *
     */
    pauseLoop() {
        this.pauseTime = new Date();
        this.cancelLoop();
    }

    /**
     *
     */
    resumeLoop() {
        const timeDifference = new Date();
        timeDifference.setMilliseconds(new Date().getTime() - this.pauseTime.getTime());
        this.storage.map(e => {
            e.startTimeStamp.setTime(e.startTimeStamp.getTime() + timeDifference.getTime());
        });
        this.runLoop();
    }
    /**
     *
     */
    cancelLoop() {
        clearInterval(this.intervalId);
    }

    // DEFAULT RELATED OPERATIONS //

    /**
     * Deletes Default options
     */
    deleteDefaultOptions() {
        this.defaultOptions = null;
    }

    /**
     * Gets current Default options
     * @returns default options.
     */
    getDefaultOptions() {
        return this.defaultOptions;
    }

    /**
     * Set Default options ( deleting currently set default options in the process).
     * @param options payload describing the new default options.
     * @return the updated default options.
     */
    setDefaultOptions(options: RespawnListOptionsModel): RespawnListOptionsModel {
        return this.defaultOptions = new OptionsVerification(options).validate();
    }

    /**
     * updates Current default options. overrides existing options if set in the
     * new payload.
     * @param options new option payload.
     * @returns the updated default options.
     */
    updateDefaultOptions(options: RespawnListOptionsModel): RespawnListOptionsModel {
        const validatedOptions = new OptionsVerification(options).validate();
        if (validatedOptions.enabled) {
            this.defaultOptions.enabled = validatedOptions.enabled;
        }
        if (validatedOptions.maxTime) {
            this.defaultOptions.maxTime = validatedOptions.maxTime;
        }
        if (validatedOptions.sameUserQueue) {
            this.defaultOptions.sameUserQueue = validatedOptions.sameUserQueue;
        }
        return this.defaultOptions;
    }

}
