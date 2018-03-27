import { BaseController } from "../BaseController";
import { Request, Response, NextFunction } from "express";
import { bottle } from "../../BaseLayer/BottleManager";

export class RespawnListController extends BaseController {
    private respawnListService = bottle.container.RespawnListLogic;

    constructor() {
        super("RespawnListController");
    }
    async getAll(req: Request, res: Response, next: NextFunction) {
        this.runWithErrorHandling(async ()=> {
            res.status(200).json(await this.respawnListService.getEntries()).end();
        }, next);
    };
    async addEntry(req: Request, res: Response, next: NextFunction) {
        this.runWithErrorHandling(async ()=> {
            res.status(200).json(await this.respawnListService.addEntry("1","1")).end();
        }, next);
    };

}
