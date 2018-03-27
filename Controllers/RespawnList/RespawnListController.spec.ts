import { RequestHandler } from "express";
import { RespawnListModel } from "../../Models";
import { IBaseController } from "../IBaseController";


export interface IRespawnListController extends IBaseController {
    getEntries: RequestHandler;
    getEntry: RequestHandler;
    createEntry: RequestHandler;
}