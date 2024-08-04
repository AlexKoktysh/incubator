import { Request, Response } from "express";
import { db, setDB } from "../../db/db";
import { BlogType } from "./types";
import { CreateBlogSchema } from "./blogValidation";

export const getAllBlogs = async (req: Request, res: Response) => {
    const blogs = db.blogs;
    res.status(200).json(blogs);
};

export const getBlogById = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    const findBlog = db.blogs.find((blog) => blog.id === Number(req.params.id));

    findBlog
        ? res.status(200).json(findBlog)
        : res
              .status(404)
              .json({ errorsMessages: { message: "error!!!!", field: "id" } });
};

export const createBlog = async (req: Request, res: Response) => {
    const { error } = CreateBlogSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const formattedErrors = error.details.map((err) => ({
            message: "error!!!!",
            field: err.path.join("."),
        }));
        return res.status(400).json({ errorsMessages: formattedErrors });
    }

    const newBlog: BlogType = {
        id: db.blogs.length + 1,
        ...req.body,
    };

    const blogs = [...db.blogs, newBlog];
    setDB({ blogs });

    return res.status(201).json(newBlog);
};

export const updateBlog = async (req: Request, res: Response) => {
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
            message: "error!!!!",
            field: err.path.join("."),
        }));
        return res.status(400).json({ errorsMessages: formattedErrors });
    }

    const blog = db.blogs.find((u) => u.id === parseInt(req.params.id)) || null;

    if (blog) {
        Object.assign(blog, req.body);
        setDB({
            blogs: db.blogs.map((u) => {
                if (u.id === parseInt(req.params.id)) {
                    return blog;
                }
                return u;
            }),
        });
        return res.status(204).json("OK");
    } else {
        return res
            .status(404)
            .json({ errorsMessages: [{ message: "error!!!!", field: "id" }] });
    }
};

export const deleteBlog = async (req: Request, res: Response) => {
    if (!req.params.id) {
        return res
            .status(404)
            .json({ errorsMessages: [{ message: "error!!!!", field: "id" }] });
    }

    const index = db.blogs.findIndex((u) => u.id === parseInt(req.params.id));
    if (index !== -1) {
        setDB({
            blogs: db.blogs.filter((u) => u.id !== parseInt(req.params.id)),
        });
        return res.status(204).json("OK");
    } else {
        return res.status(404);
    }
};
