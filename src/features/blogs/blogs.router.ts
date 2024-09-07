import { Router } from "express";

import { blogsController } from "./blogs.controller";
import { basicAuthMiddleware } from "../../middleware";
import {
    createQuerySchemaByPagination,
    validateBodyParams,
    validateQueryByPagination,
} from "../../utils";
import { CreateBlogSchema } from "./utils/validationSchemes";

import { queryValidationMiddleware } from "../../utils";
import { blogsQueryRepository } from "./repositories";
import { CreatePostSchema } from "../posts/utils/validationSchemes";

export const blogsRouter = Router();

blogsRouter.get(
    "/",
    validateQueryByPagination(createQuerySchemaByPagination({})),
    blogsController.getAll,
);
blogsRouter.get(
    "/:id",
    queryValidationMiddleware(blogsQueryRepository.find),
    blogsController.getById,
);
blogsRouter.get(
    "/:id/posts",
    queryValidationMiddleware(blogsQueryRepository.find),
    validateQueryByPagination(createQuerySchemaByPagination({})),
    blogsController.getPosts,
);
blogsRouter.post(
    "/",
    basicAuthMiddleware,
    validateBodyParams(CreateBlogSchema),
    blogsController.create,
);
blogsRouter.post(
    "/:id/posts",
    basicAuthMiddleware,
    queryValidationMiddleware(blogsQueryRepository.find),
    validateBodyParams(CreatePostSchema),
    blogsController.createPost,
);
blogsRouter.put(
    "/:id",
    basicAuthMiddleware,
    queryValidationMiddleware(blogsQueryRepository.find),
    validateBodyParams(CreateBlogSchema),
    blogsController.update,
);
blogsRouter.delete(
    "/:id",
    basicAuthMiddleware,
    queryValidationMiddleware(blogsQueryRepository.find),
    blogsController.delete,
);
