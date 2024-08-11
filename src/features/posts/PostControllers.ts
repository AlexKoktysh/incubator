import { Response, Request } from "express";
import { CreatePostDto, PostType } from "./types";
import { PostsRepository } from "./PostsRepository";
import { OutputErrorsType } from "../../utils";
import { CreatePostSchema } from "./middlewares/validator";
import { BlogsRepository } from "../blogs/BlogsRepository";

export const getAllPostsController = (
    _req: Request,
    res: Response<PostType[]>,
) => {
    const posts = PostsRepository.getAll();
    res.status(200).json(posts);
};

export const getPostByIdController = (
    req: Request<{ id: string }>,
    res: Response<PostType | OutputErrorsType>,
) => {
    if (!req.params.id)
        return res
            .status(404)
            .json({ errorsMessages: [{ message: "error!!!!", field: "id" }] });

    const post = PostsRepository.find(req.params.id);
    return post
        ? res.status(200).json(post)
        : res.status(404).json({
              errorsMessages: [{ message: "error!!!!", field: "id" }],
          });
};

export const createPostController = (
    req: Request<any, any, CreatePostDto>,
    res: Response<PostType | OutputErrorsType>,
) => {
    const findBlog = BlogsRepository.find(req.body.blogId);
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
        return res.status(400).json({ errorsMessages: formattedErrors });
    }
    if (!findBlog) {
        return res
            .status(400)
            .json({ errorsMessages: [{ message: "Error", field: "blogId" }] });
    }
    const newPostId = PostsRepository.create(req.body);
    if (!newPostId)
        return res.status(400).json({
            errorsMessages: [{ message: "ERROR!!!!", field: "id" }],
        });
    const newPost = PostsRepository.findAndMap(newPostId);

    return res.status(201).json(newPost);
};

export const updatePostController = (
    req: Request<{ id: string }, any, CreatePostDto>,
    res: Response<PostType | OutputErrorsType | string>,
) => {
    if (!req.params.id) {
        return res
            .status(404)
            .json({ errorsMessages: [{ message: "error!!!!", field: "id" }] });
    }
    const findBlog = BlogsRepository.find(req.body.blogId);

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
        return res.status(400).json({ errorsMessages: formattedErrors });
    }
    if (!findBlog) {
        return res
            .status(400)
            .json({ errorsMessages: [{ message: "Error", field: "blogId" }] });
    }

    const updatePost = PostsRepository.put(req.body, req.params.id);

    if (!updatePost)
        return res
            .status(404)
            .json({ errorsMessages: [{ message: "error!!!!", field: "id" }] });

    return res.status(204).json("OK");
};

export const deletePostController = (
    req: Request<{ id: string }>,
    res: Response<PostType | OutputErrorsType | string>,
) => {
    if (!req.params.id) {
        console.log("404");
        return res
            .status(404)
            .json({ errorsMessages: [{ message: "error!!!!", field: "id" }] });
    }

    const deletePost = PostsRepository.del(req.params.id);

    if (!deletePost) {
        return res
            .status(404)
            .json({ errorsMessages: [{ message: "error!!!!", field: "id" }] });
    }
    return res.status(204).json("OK");
};
