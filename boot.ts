import * as bodyParser from "body-parser";
import * as express from "express";
import { bottle } from "./BaseLayer/BottleManager"; 
import { CustomError, ErrorCategory } from "./Errors/CustomError";
import * as swaggerJSDoc from "swagger-jsdoc";
import * as ejs from "ejs";
import * as path from "path";

class Startup {

    public static main() {
        const portNumber: number = 3000;
        const server = express();

        // set the view engine to ejs
        server.engine('html', ejs.renderFile);
        server.set("view engine", "html");

        server.listen(portNumber, (error) => {
            if (error) {
                console.error("Server failed to startup");
            } else {
                this.init(server);
                this.initSwagger(server, portNumber);
                this.hookRouters(server);
                console.log(`Server listening on port ${portNumber} `);
            }
        });
    }

    private static init(server: express.Application) {
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

    public static initSwagger(server: express.Application,portNumber: number) {

        const options = {
            swaggerDefinition: {
                info: { // API informations (required)
                title: 'RespawnList API', // Title (required)
                version: '0.0.0', // Version (required)
                description: 'List of all publicly available api', // Description (optional)
                },
                host: `localhost:${portNumber}`, // Host (optional)
                basePath: '/', // Base path (optional)
            },
            apis: [
                // routes
                './Controllers/**/*.js',
                // add models and other later?
            ]
        }

        const swaggerSpec = swaggerJSDoc(options);

        // Serve swagger docs the way you like (Recommendation: swagger-tools)
        server.get('/swagger.json', function(req, res) {
            res.setHeader('Content-Type', 'application/json');
            res.send(swaggerSpec);
        });

        server.use(express.static(path.join(__dirname + "/Views")));
        server.set("views", path.join(__dirname + "/Views"));

        server.get(`/api-doc`, function (req, res) {
            res.render(`./api-doc/index.html`, {
                url: `http://localhost:${portNumber}/swagger.json`
            });
        });

    }

    private static hookRouters(server: express.Application) {
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
                console.error(`Error Category : ${ErrorCategory[err.ErrorCategory]} \t  Error Message: ${err.errorMessage}`);
                console.error(err.stack);
                res.status(errResponse.status).json(errResponse.error).end();
                return;
            }
            // anything that triggers this. needs to be fixed.
            console.error(err)
            console.log(err.stack);
            res.status(500).json("something broke :/").end();
        });

        // Handles if Route is not found, sends 404 request.
        server.get("*", (req, res) => {
            res.status(404).json("Route Doesnt Exist").end();
        });
    }
}

try {
    Startup.main();
} catch (exception) {
    console.log(exception);
}
