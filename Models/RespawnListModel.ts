import { RespawnListOptionsModel } from "./RespawnListOptionsModel";

export class RespawnListModel {

    constructor(
        id: string,
        name: string,
        options?: RespawnListOptionsModel) {

        this.id = id;
        this.name = name;
        this.nextQueue = [];
        if (options) {
            this.options = options;
        } else {
            this.options = new RespawnListOptionsModel({
                enabled: true,
            });
        }

    }

    /**
     * id of respawn
     */
    id: string;

    /**
     * name of respawn
     */
    name: string;

    /**
     * current user occupying spawn
     */
    userId?: string;

    /**
     * when the respawnListRow was intialized
     */
    startTimeStamp?: Date;

    /**
     * queue of users in line.
     */
    nextQueue: string[];

    /**
     * options
     */
    options: RespawnListOptionsModel;

}
