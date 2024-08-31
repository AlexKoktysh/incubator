import { Response, Request } from "express";
import { BlogsMongoRepository as BlogsRepository } from "./BlogMongoRepository";
import { OutputErrorsType } from "../../utils";
import { BlogType, CreateBlogDto } from "./types";
import { BlogDbType } from "../../db/blog-db-type";

export const getAllBlogsController = async (
    _req: Request,
    res: Response<BlogType[]>,
) => {
    const blogs = await BlogsRepository.getAll();
    res.status(200).json(blogs);
};

export const getBlogById = async (
    req: Request<{ id: string }>,
    res: Response<BlogType | OutputErrorsType>,
) => {
    const blog = await BlogsRepository.find(req.params.id);
    res.status(200).json(blog as BlogDbType);
};

export const createBlogController = async (
    req: Request<any, any, CreateBlogDto>,
    res: Response<BlogType | OutputErrorsType>,
) => {
    const newBlog = await BlogsRepository.create(req.body);
    return res.status(201).json(newBlog);
};

export const updateBlogController = async (
    req: Request<{ id: string }, any, CreateBlogDto>,
    res: Response<BlogType | OutputErrorsType | string>,
) => {
    await BlogsRepository.put(req.body, req.params.id);
    return res.status(204).json("OK");
};

export const deleteBlogController = async (
    req: Request<{ id: string }>,
    res: Response<BlogType | OutputErrorsType | string>,
) => {
    await BlogsRepository.del(req.params.id);
    return res.status(204).json("OK");
};
