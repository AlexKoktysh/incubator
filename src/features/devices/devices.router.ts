import { Router } from "express";
import { devicesController } from "./devices.controller";
import {
    queryValidationIdMiddleware,
    queryValidationMiddleware,
} from "../../utils";
import { devicesQueryRepository } from "./repositories";
import { checkRefreshTokenMiddleware } from "../auth/middlewares";

export const devicesRouter = Router();

devicesRouter.get("/", checkRefreshTokenMiddleware, devicesController.getAll);
devicesRouter.delete(
    "/",
    checkRefreshTokenMiddleware,
    devicesController.deleteAll,
);
devicesRouter.delete(
    "/:id",
    checkRefreshTokenMiddleware,
    queryValidationIdMiddleware,
    queryValidationMiddleware(devicesQueryRepository.find),
    devicesController.deleteById,
);
