import { Request, Response } from "express";
import { db, setDB } from "../../db/db";
import { PostType } from "./types";
import { CreatePostSchema } from "./postValidation";

export const getAllPosts = async (req: Request, res: Response) => {
    const posts = db.posts;
    res.status(200).json(posts);
};

export const getPostById = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    const findPost = db.posts.find((post) => post.id === Number(req.params.id));

    findPost
        ? res.status(200).json(findPost)
        : res
              .status(404)
              .json({ errorsMessages: { message: "error!!!!", field: "id" } });
};

export const createPost = async (req: Request, res: Response) => {
    const { error } = CreatePostSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const formattedErrors = error.details.map((err) => ({
            message: "error!!!!",
            field: err.path.join("."),
        }));
        return res.status(400).json({ errorsMessages: formattedErrors });
    }
    const newPost: PostType = {
        id: db.posts.length + 1,
        ...req.body,
    };

    const posts = [...db.posts, newPost];
    setDB({ posts });

    return res.status(201).json(newPost);
};

export const updatePost = async (req: Request, res: Response) => {
    if (!req.params.id) {
        return res
            .status(404)
            .json({ errorsMessages: [{ message: "error!!!!", field: "id" }] });
    }

    const { error } = CreatePostSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) {
        const formattedErrors = error.details.map((err) => ({
            message: "error!!!!",
            field: err.path.join("."),
        }));
        return res.status(400).json({ errorsMessages: formattedErrors });
    }

    const post = db.posts.find((u) => u.id === parseInt(req.params.id)) || null;

    if (post) {
        Object.assign(post, req.body);
        setDB({
            posts: db.posts.map((u) => {
                if (u.id === parseInt(req.params.id)) {
                    return post;
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

export const deletePost = async (req: Request, res: Response) => {
    if (!req.params.id) {
        return res
            .status(404)
            .json({ errorsMessages: [{ message: "error!!!!", field: "id" }] });
    }
    const index = db.posts.findIndex((u) => u.id === parseInt(req.params.id));
    if (index !== -1) {
        setDB({
            posts: db.posts.filter((u) => u.id !== parseInt(req.params.id)),
        });
        return res.status(204).json("OK");
    } else {
        return res.status(404);
    }
};
