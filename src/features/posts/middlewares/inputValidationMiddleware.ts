import { NextFunction, Request, Response } from "express";
import { CreatePostSchema } from "../helpers/validator";
import { BlogsMongoRepository } from "../../blogs/BlogMongoRepository";
import { CreatePostDto } from "../types";

export const inputValidationMiddleware = async (
    req: Request<any, any, CreatePostDto>,
    res: Response,
    next: NextFunction,
) => {
    const findBlog = await BlogsMongoRepository.find(req.body.blogId);
    const { error } = CreatePostSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) {
        const formattedErrors = error.details.map((err) => ({
            message: err.message,
            field: err.path.join("."),
        }));
        if (!findBlog) {
            formattedErrors.push({ message: "Error", field: "blogId" });
        }
        res.status(400).json({ errorsMessages: formattedErrors });
    } else {
        next();
    }
};
