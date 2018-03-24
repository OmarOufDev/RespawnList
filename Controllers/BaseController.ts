import { IBaseController } from "./IBaseController";
import { NextFunction } from "express";

export class BaseController implements IBaseController {
    readonly name: string;

    constructor(name) {
        if(!name) {
            throw new TypeError("Controller doesnt have a name");
        }
        this.name = name;
    }

    protected async runWithErrorHandling(logic: Function, next: NextFunction) {
        if (!next) {
            throw new TypeError("next function must be set");
        }

        if (!logic) {
            throw new TypeError("logic function must be set");
        }

        try {
            await logic();
        } catch (err) {
            next(err);
        }
    }

}