import { Router } from "express";
import { basicAuthMiddleware, bearerAuthMiddleware } from "../../middleware";
// import { updateCommentValidationMiddleware } from "../comments/middlewares";
import { postsController } from "./posts.controller";
import {
    createQuerySchemaByPagination,
    queryValidationMiddleware,
    validateBodyParams,
    validateQueryByPagination,
} from "../../utils";
import { postsQueryRepository } from "./repositories";
import { CreatePostSchema } from "./utils/validationSchemes";
import { blogsQueryRepository } from "../blogs";

export const postsRouter = Router();

postsRouter.get(
    "/",
    validateQueryByPagination(createQuerySchemaByPagination({})),
    postsController.getAll,
);
postsRouter.get(
    "/:id",
    queryValidationMiddleware(postsQueryRepository.findById),
    postsController.getById,
);
postsRouter.post(
    "/",
    basicAuthMiddleware,
    validateBodyParams(CreatePostSchema),
    queryValidationMiddleware(blogsQueryRepository.find),
    postsController.create,
);
postsRouter.put(
    "/:id",
    basicAuthMiddleware,
    queryValidationMiddleware,
    validateBodyParams(CreatePostSchema),
    postsController.update,
);
postsRouter.delete(
    "/:id",
    basicAuthMiddleware,
    queryValidationMiddleware(postsQueryRepository.findById),
    postsController.delete,
);

// postsRouter.get(
//     "/:id/comments",
//     queryValidationMiddleware,
//     validateQuery,
//     getComments,
// );
// postsRouter.post(
//     "/:id/comments",
//     bearerAuthMiddleware,
//     queryValidationMiddleware,
//     updateCommentValidationMiddleware,
//     createComment,
// );
