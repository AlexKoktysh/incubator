import { Router } from "express";
import { devicesController } from "./devices.controller";
import { bearerAuthMiddleware } from "../../middleware";
import {
    queryValidationIdMiddleware,
    queryValidationMiddleware,
} from "../../utils";
import { devicesQueryRepository } from "./repositories";

export const devicesRouter = Router();

devicesRouter.get("/", bearerAuthMiddleware, devicesController.getAll);
devicesRouter.delete("/", bearerAuthMiddleware, devicesController.deleteAll);
devicesRouter.delete(
    "/:id",
    bearerAuthMiddleware,
    queryValidationIdMiddleware,
    queryValidationMiddleware(devicesQueryRepository.find),
    devicesController.deleteById,
);
