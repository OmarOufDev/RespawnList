import * as Bottle from "bottlejs";
import { OptionsVerification, IRespawnListLogic, RespawnListLogic } from "../Services/_Services.index";
import { Utilities } from "../MISC/Utilities";
import { IBaseRouter, IndexRouter, RespawnListRouter, RespawnListController } from "../Controllers/_Controllers.index";

const bottle = new Bottle();

// Routers

bottle.service("IndexRouter", IndexRouter);
bottle.service("RespawnListRouter", RespawnListRouter);

// Controllers

bottle.service("RespawnListController", RespawnListController);

// Services

bottle.service("Utilities", Utilities);
bottle.factory("OptionsVerification", () => OptionsVerification);
bottle.service("RespawnListLogic", RespawnListLogic);

export { bottle };

declare module "bottlejs" {
    interface IContainer {
        // Routers
        IndexRouter: IBaseRouter,
        RespawnListRouter: IBaseRouter,

        // Controllers
        RespawnListController: RespawnListController,

        // Services
        Utilities: Utilities,
        // OptionsVerification: OptionsVerification,
        RespawnListLogic: IRespawnListLogic
    }
}
