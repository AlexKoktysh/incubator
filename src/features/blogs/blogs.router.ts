import { Router } from "express";

import { blogsController } from "./blogs.controller";
import { basicAuthMiddleware } from "../../middleware";
import {
    createQuerySchemaByPagination,
    validateBodyParams,
    validateQueryByPagination,
} from "../../utils";
import {
    CreateBlogSchema,
    querySchemaByPaginationForBlog,
} from "./utils/validationSchemes";

import { queryValidationMiddleware } from "../../utils";
import { blogsQueryRepository } from "./repositories";

export const blogsRouter = Router();

blogsRouter.get(
    "/",
    validateQueryByPagination(createQuerySchemaByPagination({})),
    blogsController.getAll,
);
blogsRouter.get("/:id", queryValidationMiddleware, blogsController.getById);
// blogsRouter.get(
//     "/:id/posts",
//     queryValidationMiddleware(blogsQueryRepository.find),
//     validateQueryByPagination(querySchemaByPaginationForBlog),
//     getPostsByBlogId,
// );
blogsRouter.post(
    "/",
    basicAuthMiddleware,
    validateBodyParams(CreateBlogSchema),
    blogsController.create,
);
// blogsRouter.post(
//     "/:id/posts",
//     basicAuthMiddleware,
//     queryValidationMiddleware,
//     createPostValidationMiddleware,
//     createPostController,
// );
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
