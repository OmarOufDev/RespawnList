import { BaseController } from "../BaseController";
import { Request, Response, NextFunction } from "express";
import { bottle } from "../../BaseLayer/BottleManager";
import { IRespawnListController } from "./RespawnListController.spec";

export class RespawnListController extends BaseController implements IRespawnListController {
    private respawnListService = bottle.container.RespawnListLogic;

    constructor() {
        super("RespawnListController");
    }
    /**
     * "/RespawnList"
     * @param req 
     * @param res 
     * @param next 
     */
    async getEntries(req: Request, res: Response, next: NextFunction) {
        this.runWithErrorHandling(async ()=> {
            res.status(200).json(await this.respawnListService.getEntries()).end();
        }, next);
    };
    /**
     * "/RespawnList/:entryId"
     * @param req 
     * @param res 
     * @param next 
     */
    async getEntry(req: Request, res: Response, next: NextFunction) {
        this.runWithErrorHandling(async ()=> {
            const entryId = req.params.entryId;
            res.status(200).json(await this.respawnListService.getEntry(entryId)).end();
        }, next);
    };
    /**
     * /RespawnList/
     * @param req 
     * @param res 
     * @param next 
     */
    async createEntry(req: Request, res: Response, next: NextFunction) {
        this.runWithErrorHandling(async ()=> {
            const entryId: string = req.body.entryId;
            const entryName: string = req.body.entryName;
            res.status(200).json(await this.respawnListService.addEntry(entryId, entryName)).end();
        }, next);
    };

}
