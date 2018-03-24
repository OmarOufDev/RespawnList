import { IBaseRouter } from "./IBaseRouter";
import { Router } from "express";
import { bottle } from "../BaseLayer/BottleManager";
import { Request, Response, NextFunction } from "express";

export class RespawnListRouter implements IBaseRouter {

    private respawnListController = bottle.container.RespawnListController;

    get getPath(){
        return "/RespawnList"
    }
    get getRouter() {
        const respawnListRouter = Router();

        respawnListRouter.get("/", [
            (req: Request, res: Response, next: NextFunction) => {
                this.respawnListController.getAll(req,res,next);
            }]);

        respawnListRouter.get("/a",  [
            (req: Request, res: Response, next: NextFunction) => {
                this.respawnListController.addEntry(req,res,next);
            }]);
        
        return respawnListRouter;
    }
}