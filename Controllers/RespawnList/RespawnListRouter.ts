import { IBaseRouter } from "../IBaseRouter";
import { Router } from "express";
import { bottle } from "../../BaseLayer/BottleManager";
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
                this.respawnListController.getEntries(req,res,next);
        }]);

        respawnListRouter.get("/:entryId",  [
            (req: Request, res: Response, next: NextFunction) => {
                this.respawnListController.getEntry(req,res,next);
        }]);

        respawnListRouter.post("/", [
            (req: Request, res: Response, next: NextFunction) => {
                this.respawnListController.createEntry(req,res,next);
        }]);
        
        return respawnListRouter;
    }
}