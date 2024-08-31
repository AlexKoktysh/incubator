import { Response, Request } from "express";
import { CreatePostDto, PostType } from "./types";
import { PostsMongoRepository as PostsRepository } from "./PostMongoRepository";
import { OutputErrorsType } from "../../utils";
import { PostDbType } from "../../db/post-db.type";

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
    const post = await PostsRepository.find(req.params.id);
    return res.status(200).json(post as PostDbType);
};

export const createPostController = async (
    req: Request<any, any, CreatePostDto>,
    res: Response<PostType | OutputErrorsType>,
) => {
    const newPostId = await PostsRepository.create(req.body);
    const post = await PostsRepository.find(newPostId);

    return res.status(201).json(post as PostDbType);
};

export const updatePostController = async (
    req: Request<{ id: string }, any, CreatePostDto>,
    res: Response<PostType | OutputErrorsType | string>,
) => {
    await PostsRepository.put(req.body, req.params.id);
    return res.status(204).json("OK");
};

export const deletePostController = async (
    req: Request<{ id: string }>,
    res: Response<PostType | OutputErrorsType | string>,
) => {
    await PostsRepository.del(req.params.id);
    return res.status(204).json("OK");
};
