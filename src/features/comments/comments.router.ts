import { Router } from "express";

import { bearerAuthMiddleware } from "../../middleware";
import { queryValidationMiddleware, validateBodyParams } from "../../utils";
import { commentsQueryRepository } from "./repositories";
import { commentsController } from "./comments.controller";
import { UpdateCommentSchema } from "./utils/validationSchemes";
import { isOwnerMiddleware } from "./middlewares";

export const commentsRouter = Router();

commentsRouter.get(
    "/:id",
    queryValidationMiddleware(commentsQueryRepository.find),
    commentsController.find,
);
commentsRouter.delete(
    "/:id",
    bearerAuthMiddleware,
    queryValidationMiddleware(commentsQueryRepository.find),
    isOwnerMiddleware,
    commentsController.delete,
);
commentsRouter.put(
    "/:id",
    bearerAuthMiddleware,
    queryValidationMiddleware(commentsQueryRepository.find),
    isOwnerMiddleware,
    validateBodyParams(UpdateCommentSchema),
    commentsController.update,
);
