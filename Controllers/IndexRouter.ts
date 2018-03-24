import { IBaseRouter } from "./IBaseRouter";
import * as express from "express";
import { Router } from "express";

export class IndexRouter implements IBaseRouter {

    get getPath(): string {
        return "/";
    }

    get getRouter(): Router {
        let tempRouter = express.Router();

        tempRouter.get("/", [async (req: any, res: any, next: any) => {
            res.status(200).json("Hello World").end();
        }]);

        return tempRouter;
    }

}