import { Router } from "express";

import { blogsController } from "./blogs.controller";
import { basicAuthMiddleware } from "../../middleware";
import {
    createQuerySchemaByPagination,
    queryValidationIdMiddleware,
    validateBodyParams,
    validateQueryByPagination,
} from "../../utils";
import { CreateBlogSchema } from "./utils/validationSchemes";

import { queryValidationMiddleware } from "../../utils";
import { blogsQueryRepository } from "./repositories";
import { CreatePostSchemaForBlog } from "../posts/utils/validationSchemes";

export const blogsRouter = Router();

blogsRouter.get(
    "/",
    // validateQueryByPagination(createQuerySchemaByPagination({})),
    blogsController.getAll,
);
blogsRouter.get(
    "/:id",
    queryValidationIdMiddleware,
    queryValidationMiddleware(blogsQueryRepository.find),
    blogsController.getById,
);
blogsRouter.get(
    "/:id/posts",
    queryValidationIdMiddleware,
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
    queryValidationIdMiddleware,
    queryValidationMiddleware(blogsQueryRepository.find),
    validateBodyParams(CreatePostSchemaForBlog),
    blogsController.createPost,
);
blogsRouter.put(
    "/:id",
    basicAuthMiddleware,
    queryValidationIdMiddleware,
    queryValidationMiddleware(blogsQueryRepository.find),
    validateBodyParams(CreateBlogSchema),
    blogsController.update,
);
blogsRouter.delete(
    "/:id",
    basicAuthMiddleware,
    queryValidationIdMiddleware,
    queryValidationMiddleware(blogsQueryRepository.find),
    blogsController.delete,
);
