import { Response, Request } from "express";
import {
    HttpStatuses,
    OutputErrorsType,
    QueryPaginationType,
    setDefaultQueryParams,
} from "../../utils";
import { postRepository, postsQueryRepository } from "./repositories";
import {
    CreatePostDto,
    PostViewType,
    QueryPaginationByPostType,
} from "./types";
import { ObjectId } from "mongodb";
import {
    commentsQueryRepository,
    commentsRepository,
} from "../comments/repositories";
import { CommentViewType, UpdateCommentDto } from "../comments/types";
import { usersQueryRepository } from "../users";
import { UserViewType } from "../users/types";

export const postsController = {
    async getAll(
        req: Request<{}, {}, {}, Required<QueryPaginationByPostType>>,
        res: Response<any>,
    ) {
        try {
            const { pageNumber, pageSize, sortBy, sortDirection } = {
                ...setDefaultQueryParams(req.query),
            };
            const { posts, totalCount } = await postsQueryRepository.getAll({
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
                blogId: "",
            });
            res.status(HttpStatuses.Success).json({
                items: posts,
                totalCount,
                pagesCount: Math.ceil(totalCount / +pageSize),
                page: +pageNumber,
                pageSize: +pageSize,
            });
        } catch (err: any) {
            res.status(HttpStatuses.Error).json(err);
        }
    },
    async getById(
        req: Request<{ id: string }>,
        res: Response<PostViewType | OutputErrorsType>,
    ) {
        try {
            const post = await postsQueryRepository.findById(req.params.id);
            res.status(HttpStatuses.Success).json(post as PostViewType);
        } catch (err: any) {
            res.status(HttpStatuses.Error).json(err);
        }
    },
    async create(
        req: Request<{ id: string }, any, CreatePostDto>,
        res: Response<PostViewType | OutputErrorsType>,
    ) {
        try {
            const newPost = await postRepository.create(req.body);
            res.status(HttpStatuses.Created).json(newPost as PostViewType);
        } catch (err: any) {
            res.status(HttpStatuses.Error).json(err);
        }
    },
    async update(
        req: Request<{ id: string }, any, CreatePostDto>,
        res: Response<PostViewType | OutputErrorsType | string>,
    ) {
        try {
            await postRepository.update(req.body, req.params.id);
            res.status(HttpStatuses.NoContent).json("OK");
        } catch (err: any) {
            res.status(HttpStatuses.Error).json(err);
        }
    },
    async delete(
        req: Request<{ id: string }>,
        res: Response<PostViewType | OutputErrorsType | string>,
    ) {
        try {
            await postRepository.delete(req.params.id);
            res.status(HttpStatuses.NoContent).json("OK");
        } catch (err: any) {
            res.status(HttpStatuses.Error).json(err);
        }
    },

    async getComments(
        req: Request<{ id: string }, {}, {}, Required<QueryPaginationType>>,
        res: Response,
    ) {
        try {
            const { pageNumber, pageSize, sortBy, sortDirection } = {
                ...setDefaultQueryParams(req.query),
            };
            const { comments, totalCount } =
                await commentsQueryRepository.getByPostId({
                    pageNumber,
                    pageSize,
                    sortBy,
                    sortDirection,
                    postId: req.params.id,
                });
            res.status(HttpStatuses.Success).json({
                items: comments,
                totalCount,
                pagesCount: Math.ceil(totalCount / +pageSize),
                page: +pageNumber,
                pageSize: +pageSize,
            });
        } catch (err: any) {
            res.status(HttpStatuses.Error).json(err);
        }
    },
    async createComment(
        req: Request<{ id: string }, any, UpdateCommentDto>,
        res: Response<CommentViewType | OutputErrorsType>,
    ) {
        try {
            const user = await usersQueryRepository.findById(
                req.userId as string,
            );
            const newComment = await commentsRepository.create(
                req.body,
                user as UserViewType,
                req.params.id,
            );
            res.status(HttpStatuses.Created).json(
                newComment as CommentViewType,
            );
        } catch (err: any) {
            res.status(HttpStatuses.Error).json(err);
        }
    },
};
