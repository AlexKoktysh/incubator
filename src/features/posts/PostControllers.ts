import { Response, Request } from "express";
import { CreatePostDto, PostType } from "./types";
import { PostsMongoRepository as PostsRepository } from "./PostMongoRepository";
import { OutputErrorsType } from "../../utils";
import { CreatePostSchema } from "./middlewares/validator";
import { BlogsMongoRepository as BlogsRepository } from "../blogs/BlogMongoRepository";

export const getAllPostsController = async (
    _req: Request,
    res: Response<PostType[]>,
) => {
    const posts = await PostsRepository.getAll();
    res.status(200).json(posts);
};

export const getPostByIdController = async (
    req: Request<{ id: string }>,
    res: Response<PostType | OutputErrorsType>,
) => {
    if (!req.params.id)
        return res
            .status(404)
            .json({ errorsMessages: [{ message: "error!!!!", field: "id" }] });

    const post = await PostsRepository.find(req.params.id);
    return post
        ? res.status(200).json(post)
        : res.status(404).json({
              errorsMessages: [{ message: "error!!!!", field: "id" }],
          });
};

export const createPostController = async (
    req: Request<any, any, CreatePostDto>,
    res: Response<PostType | OutputErrorsType>,
) => {
    const findBlog = await BlogsRepository.find(req.body.blogId);
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
    const newPostId = await PostsRepository.create(req.body);
    if (!newPostId)
        return res.status(400).json({
            errorsMessages: [{ message: "ERROR!!!!", field: "id" }],
        });
    const newPost = await PostsRepository.findAndMap(newPostId);
    if (!newPost)
        return res.status(400).json({
            errorsMessages: [{ message: "ERROR!!!!", field: "id" }],
        });

    return res.status(201).json(newPost);
};

export const updatePostController = async (
    req: Request<{ id: string }, any, CreatePostDto>,
    res: Response<PostType | OutputErrorsType | string>,
) => {
    if (!req.params.id) {
        return res
            .status(404)
            .json({ errorsMessages: [{ message: "error!!!!", field: "id" }] });
    }
    const findPost = await PostsRepository.find(req.params.id);
    const findBlog = await BlogsRepository.find(req.body.blogId);

    if (!findPost) {
        return res
            .status(404)
            .json({ errorsMessages: [{ message: "Error", field: "postID" }] });
    }

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

    const updatePost = await PostsRepository.put(req.body, req.params.id);

    if (!updatePost)
        return res
            .status(404)
            .json({ errorsMessages: [{ message: "error!!!!", field: "id" }] });

    return res.status(204).json("OK");
};

export const deletePostController = async (
    req: Request<{ id: string }>,
    res: Response<PostType | OutputErrorsType | string>,
) => {
    if (!req.params.id) {
        return res
            .status(404)
            .json({ errorsMessages: [{ message: "error!!!!", field: "id" }] });
    }

    const deletePost = await PostsRepository.del(req.params.id);

    if (!deletePost) {
        return res
            .status(404)
            .json({ errorsMessages: [{ message: "error!!!!", field: "id" }] });
    }
    return res.status(204).json("OK");
};
