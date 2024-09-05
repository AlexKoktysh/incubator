import { Response, Request } from "express";
import { BlogsMongoRepository as BlogsRepository } from "./BlogMongoRepository";
import { OutputErrorsType } from "../../utils";
import { BlogType, CreateBlogDto } from "./types";
import { BlogDbType } from "../../db/blog-db-type";
import { CreatePostDto, PostType } from "../posts/types";
import { PostsMongoRepository } from "../posts/PostMongoRepository";
import { PostDbType } from "../../db/post-db.type";

export const getAllBlogsController = async (
    req: Request<
        {},
        {},
        {},
        {
            pageNumber: string;
            pageSize: string;
            sortBy: string;
            sortDirection: "asc" | "desc";
            searchNameTerm: string;
        }
    >,
    res: Response<any>,
) => {
    try {
        const {
            pageNumber = String(1),
            pageSize = String(10),
            sortBy = "createdAt",
            sortDirection = "desc",
            searchNameTerm = "",
        } = req.query;
        const { blogs, totalCount } = await BlogsRepository.getAll({
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm,
        });
        res.status(200).json({
            items: blogs,
            totalCount,
            pagesCount: Math.ceil(totalCount / +pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
        });
    } catch (err: any) {
        res.status(500).json(err);
    }
};

export const getBlogById = async (
    req: Request<{ id: string }>,
    res: Response<BlogType | OutputErrorsType>,
) => {
    try {
        const blog = await BlogsRepository.find(req.params.id);
        res.status(200).json(blog as BlogDbType);
    } catch (err: any) {
        res.status(500).json(err);
    }
};

export const createBlogController = async (
    req: Request<any, any, CreateBlogDto>,
    res: Response<BlogType | OutputErrorsType>,
) => {
    try {
        const newBlog = await BlogsRepository.create(req.body);
        res.status(201).json(newBlog as BlogDbType);
    } catch (err: any) {
        res.status(500).json(err);
    }
};

export const updateBlogController = async (
    req: Request<{ id: string }, any, CreateBlogDto>,
    res: Response<BlogType | OutputErrorsType | string>,
) => {
    try {
        await BlogsRepository.put(req.body, req.params.id);
        res.status(204).json("OK");
    } catch (err: any) {
        res.status(500).json(err);
    }
};

export const deleteBlogController = async (
    req: Request<{ id: string }>,
    res: Response<BlogType | OutputErrorsType | string>,
) => {
    try {
        await BlogsRepository.del(req.params.id);
        res.status(204).json("OK");
    } catch (err: any) {
        res.status(500).json(err);
    }
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
