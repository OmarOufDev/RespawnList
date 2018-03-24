import { RespawnListModel, RespawnListOptionsModel } from "../Models";

export interface IRespawnListLogic {

    // Entry Specific Operations //
    addEntry(id: string, name: string): RespawnListModel;
    deleteEntry(id: string): any;
    getEntry(id: string): [RespawnListModel, number];
    getEntries(): RespawnListModel[];
    addOptionsToEntry(id: string, options: any): any;
    saveConfigration(): void;
    loadConfiguration(): void;

    // Enqueuing / Dequeing users from an Entry
    enqeueToEntry(id: string, userId: string): RespawnListModel;
    deqeueFromEntry(id: string, userId: string): RespawnListModel;

    // BackGround Operations
    runLoop(): void;
    pauseLoop(): void;
    resumeLoop(): void;
    cancelLoop(): void;

    // DEFAULT RELATED OPERATIONS //

    /**
     * Deletes Default options
     */
    deleteDefaultOptions(): void;

    /**
     * Gets current Default options
     * @returns default options.
     */
    getDefaultOptions(): RespawnListOptionsModel;

    /**
     * Set Default options ( deleting currently set default options in the process).
     * @param options payload describing the new default options.
     * @return the updated default options.
     */
    setDefaultOptions(options: RespawnListOptionsModel): RespawnListOptionsModel;

    /**
     * updates Current default options. overrides existing options if set in the
     * new payload.
     * @param options new option payload.
     * @returns the updated default options.
     */
    updateDefaultOptions(options: RespawnListOptionsModel):
    RespawnListOptionsModel;

}
