import * as Bottle from "bottlejs";
import { OptionsVerification, IRespawnListLogic, RespawnListLogic } from "../Services/_Services.index";
import { Utilities } from "../MISC/Utilities";
import { IBaseRouter, IndexRouter, RespawnListRouter } from "../Controllers/_Controllers.index";

const bottle = new Bottle();

// CONTROLLERS

bottle.service("IndexRouter", IndexRouter);
bottle.service("RespawnListRouter", RespawnListRouter);

// Services

bottle.service("Utilities", Utilities);
bottle.factory("OptionsVerification", () => OptionsVerification);
bottle.service("RespawnListLogic", RespawnListLogic);

export { bottle };

declare module "bottlejs" {
    interface IContainer {
        IndexRouter: IBaseRouter,
        RespawnListRouter: IBaseRouter,
        Utilities: Utilities,
        // OptionsVerification: OptionsVerification,
        RespawnListLogic: IRespawnListLogic
    }
}
