import { Response, Request } from "express";
import {
    BlogViewType,
    CreateBlogDto,
    ListBlogsViewType,
    QueryPaginationByBlogType,
} from "./types";
import {
    HttpStatuses,
    OutputErrorsType,
    QueryPaginationType,
    setDefaultQueryParams,
} from "../../utils";
import { blogsQueryRepository, blogsRepository } from "./repositories";
import { ObjectId } from "mongodb";
import { postsQueryRepository } from "../posts";
import { CreatePostDto, PostViewType } from "../posts/types";
import { postRepository } from "../posts/repositories";

export const blogsController = {
    async getAll(
        req: Request<{}, {}, {}, Required<QueryPaginationByBlogType>>,
        res: Response<ListBlogsViewType>,
    ) {
        try {
            const {
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
                searchNameTerm,
            } = {
                ...setDefaultQueryParams(req.query),
                searchNameTerm: req.query.searchNameTerm ?? "",
            };
            const { blogs, totalCount } = await blogsQueryRepository.getAll({
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
                searchNameTerm,
            });
            res.status(HttpStatuses.Success).json({
                items: blogs,
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
        res: Response<BlogViewType | OutputErrorsType>,
    ) {
        try {
            const blog = await blogsQueryRepository.find(
                new ObjectId(req.params.id),
            );
            res.status(HttpStatuses.Success).json(blog as BlogViewType);
        } catch (err: any) {
            res.status(HttpStatuses.Error).json(err);
        }
    },
    async create(
        req: Request<{}, {}, CreateBlogDto>,
        res: Response<BlogViewType | OutputErrorsType>,
    ) {
        try {
            const newBlog = await blogsRepository.create(req.body);
            res.status(HttpStatuses.Created).json(newBlog as BlogViewType);
        } catch (err: any) {
            res.status(HttpStatuses.Error).json(err);
        }
    },
    async update(
        req: Request<{ id: string }, {}, CreateBlogDto>,
        res: Response<BlogViewType | OutputErrorsType | string>,
    ) {
        try {
            await blogsRepository.update(req.body, new ObjectId(req.params.id));
            res.status(HttpStatuses.NoContent).json("OK");
        } catch (err: any) {
            res.status(HttpStatuses.Error).json(err);
        }
    },
    async delete(
        req: Request<{ id: string }>,
        res: Response<OutputErrorsType | string>,
    ) {
        try {
            await blogsRepository.delete(new ObjectId(req.params.id));
            res.status(HttpStatuses.NoContent).json("OK");
        } catch (err: any) {
            res.status(HttpStatuses.Error).json(err);
        }
    },
    async createPost(
        req: Request<{ id: string }, any, Omit<CreatePostDto, " blogId">>,
        res: Response<PostViewType | OutputErrorsType>,
    ) {
        try {
            const newPost = await postRepository.create({
                ...req.body,
                blogId: req.params.id,
            });
            res.status(HttpStatuses.Created).json(newPost as PostViewType);
        } catch (err: any) {
            res.status(HttpStatuses.Error).json(err);
        }
    },
    async getPosts(
        req: Request<{ id: string }, {}, {}, Required<QueryPaginationType>>,
        res: Response<any | OutputErrorsType>,
    ) {
        try {
            const { pageNumber, pageSize, sortBy, sortDirection } = {
                ...setDefaultQueryParams(req.query),
            };
            const { posts, totalCount } = await postsQueryRepository.getAll({
                blogId: req.params.id,
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
            });
            res.status(HttpStatuses.Success).json({
                items: posts,
                totalCount,
                pagesCount: pageSize ? Math.ceil(totalCount / +pageSize) : 0,
                page: +pageNumber,
                pageSize: +pageSize,
            });
        } catch (err: any) {
            res.status(HttpStatuses.Error).json(err);
        }
    },
};
