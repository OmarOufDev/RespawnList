import { IBaseRouter } from "./IBaseRouter";
import { Router } from "express";
import { bottle } from "../BaseLayer/BottleManager";

export class RespawnListRouter implements IBaseRouter {

    private respawnListService = bottle.container.RespawnListLogic;

    get getPath(){
        return "/RespawnList"
    }
    get getRouter() {
        const respawnListRouter = Router();
        let counter = 0;
        respawnListRouter.get("/", [async (req: any, res: any, next: any) => {
            res.status(200).json(await this.respawnListService.getEntries()).end();
        }]);

        respawnListRouter.get("/a", [async (req: any, res: any, next: any) => {
            res.status(200).json(await this.respawnListService.addEntry("1"+counter,"1")).end();
            counter++;
        }]);
        return respawnListRouter;
    }
}