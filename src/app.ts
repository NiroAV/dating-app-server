import express, { Request, Response, NextFunction } from "express";
import dal from "./1-utils/dal";
import errorsHandler from "./2-middleware/errors-handler";
import ErrorModel from "./3-models/error-model";
import userController from "./5-controllers/user-controller"
import matchController from "./5-controllers/match-controller"
import fileUpload from "express-fileupload"
import bodyParser from "body-parser";
import dotenv from "dotenv";
import messageController from "./5-controllers/message-controller";
import config from "./1-utils/config";
import cors from "cors";

dotenv.config();
dal.connect();
const server = express();
server.use(bodyParser.urlencoded({ extended: true }));
server.use(fileUpload());
if (config.isDevelopment) server.use(cors());
server.use(express.json());
server.use("/api", userController);
server.use("/api", matchController);
server.use("/api", messageController);
server.use("*", (request: Request, response: Response, next: NextFunction) => next(new ErrorModel(404, "Route not found")));
server.use(errorsHandler);

server.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));
