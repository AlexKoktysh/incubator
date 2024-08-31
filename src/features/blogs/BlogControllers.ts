import { Response, Request } from "express";
import { BlogsMongoRepository as BlogsRepository } from "./BlogMongoRepository";
import { CreateBlogSchema } from "./middlewares/validator";
import { OutputErrorsType } from "../../utils";
import { BlogType, CreateBlogDto } from "./types";

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
    if (!req.params.id)
        return res
            .status(404)
            .json({ errorsMessages: [{ message: "error!!!!", field: "id" }] });

    const blog = await BlogsRepository.find(req.params.id);
    return blog
        ? res.status(200).json(blog)
        : res.status(404).json({
              errorsMessages: [{ message: "error!!!!not find", field: "id" }],
          });
};

export const createBlogController = async (
    req: Request<any, any, CreateBlogDto>,
    res: Response<BlogType | OutputErrorsType>,
) => {
    const { error } = CreateBlogSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const formattedErrors = error.details.map((err) => ({
            message: err.message,
            field: err.path.join("."),
        }));
        return res.status(400).json({ errorsMessages: formattedErrors });
    }
    const newBlog = await BlogsRepository.create(req.body);
    return res.status(201).json(newBlog);
};

export const updateBlogController = async (
    req: Request<{ id: string }, any, CreateBlogDto>,
    res: Response<BlogType | OutputErrorsType | string>,
) => {
    if (!req.params.id) {
        return res
            .status(404)
            .json({ errorsMessages: [{ message: "error!!!!", field: "id" }] });
    }

    const { error } = CreateBlogSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const formattedErrors = error.details.map((err) => ({
            message: err.message,
            field: err.path.join("."),
        }));
        return res.status(400).json({ errorsMessages: formattedErrors });
    }

    const updateBlog = await BlogsRepository.put(req.body, req.params.id);

    if (!updateBlog)
        return res
            .status(404)
            .json({ errorsMessages: [{ message: "error!!!!", field: "id" }] });

    return res.status(204).json("OK");
};

export const deleteBlogController = async (
    req: Request<{ id: string }>,
    res: Response<BlogType | OutputErrorsType | string>,
) => {
    if (!req.params.id) {
        return res
            .status(404)
            .json({ errorsMessages: [{ message: "error!!!!", field: "id" }] });
    }

    const deleteBlog = await BlogsRepository.del(req.params.id);

    if (!deleteBlog)
        return res
            .status(404)
            .json({ errorsMessages: [{ message: "error!!!!", field: "id" }] });

    return res.status(204).json("OK");
};
