import { Router } from "express";

export interface IBaseRouter {

    readonly getPath: string;

    getRouter: Router;
}