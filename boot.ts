import * as bodyParser from "body-parser";
import * as express from "express";
import { bottle } from "./BaseLayer/BottleManager"; 

class Startup {

    public static main() {
        const portNumber: number = 3000;
        const server = express();

        server.listen(portNumber, (error) => {
            if (error) {
                console.error("Server failed to startup");
            } else {
                this.init(server);
                this.hookRouters(server);
                console.log(`Server listening on port ${portNumber} `);
            }
        });
    }

    private static init(server: express.Server) {
        // process global object available in node.
        // https://nodejs.org/api/process.html
        process.on("unhandledRejection", (error, reason) => {
            console.error(`Uncaught Exception: ${error}, reason: ${reason}`);
        });

        server.use(bodyParser.json());

        server.use((error, req, response, next) => {
            if (error) {
                response.status(400).json({
                    code: "MalformedInput",
                    message: "Invalid JSON",
                }).end();
            } else {
                next();
            }
        });
    }
    private static hookRouters(server: express.Server) {
        let mainRouter = express.Router();
        
        const t = bottle.container.IndexRouter;
        mainRouter.use(t.getPath,t.getRouter);

        server.use(mainRouter);

        // inject customRouter and link path , router.
        const customRouters = [
            bottle.container.RespawnListRouter,
        ];
        customRouters.forEach(r => {
            mainRouter.use(r.getPath,r.getRouter);
        });

        mainRouter.use(function errorHandler(err,req, res, next) {
            let errResponse: any = {};
            if(err && err instanceof CustomError) {
                errResponse.status = 500;
                errResponse.error = "Internal Server Error";
                console.log(err.ErrorCategory, "\t", err.errorMessage);
                res.status(errResponse.status).json(errResponse.error).end();
                return;
            }
        });

        // Handles if Route is not found, sends 404 request.
        server.get("*", (req, res) => {
            res.status(404).json("Route Doesnt Exist").end();
        });
    }
}
import { IBaseRouter } from "./Controllers/IBaseRouter";
import { RespawnListRouter } from "./Controllers/RespawnListRouter";
import { CustomError } from "./Errors/CustomError";

try {
    Startup.main();
} catch (exception) {
    console.log(exception);
}
