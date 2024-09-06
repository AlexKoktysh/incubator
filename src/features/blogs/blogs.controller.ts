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
    setDefaultQueryParams,
} from "../../utils";
import { blogsQueryRepository, blogsRepository } from "./repositories";
import { ObjectId } from "mongodb";

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
            res.status(204).json("OK");
        } catch (err: any) {
            res.status(500).json(err);
        }
    },
};

export const createPostController = async (
    req: Request<{ id: string }, any, Omit<CreatePostDto, " blogId">>,
    res: Response<PostType | OutputErrorsType>,
) => {
    try {
        const newPostId = await PostsMongoRepository.create({
            ...req.body,
            blogId: req.params.id,
        });
        const post = await PostsMongoRepository.find(newPostId);
        res.status(201).json(post as PostDbType);
    } catch (err: any) {
        console.log("err", err);
        res.status(500).json(err);
    }
};

export const getPostsByBlogId = async (
    req: Request<
        { id: string },
        {},
        {},
        {
            pageNumber?: string;
            pageSize?: string;
            sortBy?: string;
            sortDirection?: "asc" | "desc";
        }
    >,
    res: Response<any | OutputErrorsType>,
) => {
    const {
        pageNumber = String(1),
        pageSize = String(10),
        sortBy = "createdAt",
        sortDirection = "desc",
    } = req.query;
    try {
        const { posts, totalCount } =
            await PostsMongoRepository.getAllByCondition({
                blogId: req.params.id,
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
            });
        res.status(200).json({
            items: posts,
            totalCount,
            pagesCount: pageSize ? Math.ceil(totalCount / +pageSize) : 0,
            page: +pageNumber,
            pageSize: +pageSize,
        });
    } catch (err: any) {
        res.status(500).json(err);
    }
};
