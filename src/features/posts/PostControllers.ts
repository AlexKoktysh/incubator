import { Response, Request } from "express";
import { CreatePostDto, PostType } from "./types";
import { PostsMongoRepository as PostsRepository } from "./PostMongoRepository";
import { OutputErrorsType } from "../../utils";
import { PostDbType } from "../../db/post-db.type";
import { CommentType, UpdateCommentDto } from "../comments/types";
import { CommentMongoRepository } from "../comments/CommentMongoRepository";
import { AuthMongoRepository } from "../auth/AuthMongoRepository";
import { UserDbType } from "../../db/user-db.type";

export const getAllPostsController = async (
    req: Request<
        {},
        {},
        {},
        {
            pageNumber?: string;
            pageSize?: string;
            sortBy?: string;
            sortDirection?: "asc" | "desc";
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
        } = req.query;
        const { posts, totalCount } = await PostsRepository.getAllByCondition({
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
        });
        res.status(200).json({
            items: posts,
            totalCount,
            pagesCount: Math.ceil(totalCount / +pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
        });
    } catch (err: any) {
        console.log("error", err);
        res.status(500).json(err);
    }
};

export const getPostByIdController = async (
    req: Request<{ id: string }>,
    res: Response<PostType | OutputErrorsType>,
) => {
    try {
        const post = await PostsRepository.find(req.params.id);
        res.status(200).json(post as PostDbType);
    } catch (err: any) {
        res.status(500).json(err);
    }
};

export const createPostController = async (
    req: Request<{ id: string }, any, CreatePostDto>,
    res: Response<PostType | OutputErrorsType>,
) => {
    try {
        const newPostId = await PostsRepository.create(req.body);
        const post = await PostsRepository.find(newPostId);
        res.status(201).json(post as PostDbType);
    } catch (err: any) {
        res.status(500).json(err);
    }
};

export const updatePostController = async (
    req: Request<{ id: string }, any, CreatePostDto>,
    res: Response<PostType | OutputErrorsType | string>,
) => {
    try {
        await PostsRepository.put(req.body, req.params.id);
        res.status(204).json("OK");
    } catch (err: any) {
        res.status(500).json(err);
    }
};

export const deletePostController = async (
    req: Request<{ id: string }>,
    res: Response<PostType | OutputErrorsType | string>,
) => {
    try {
        await PostsRepository.del(req.params.id);
        res.status(204).json("OK");
    } catch (err: any) {
        res.status(500).json(err);
    }
};

export const getComments = async (
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
    res: Response,
) => {
    try {
        const {
            pageNumber = String(1),
            pageSize = String(10),
            sortBy = "createdAt",
            sortDirection = "desc",
        } = req.query;
        const { comments, totalCount } = await PostsRepository.getAllComments({
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
        });
        res.status(200).json({
            items: comments,
            totalCount,
            pagesCount: Math.ceil(totalCount / +pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
        });
    } catch (err: any) {
        res.status(500).json(err);
    }
};

export const createComment = async (
    req: Request<{ id: string }, any, UpdateCommentDto>,
    res: Response<CommentType | OutputErrorsType>,
) => {
    try {
        const user = await AuthMongoRepository.find(req.userId as string);
        const commentId = await CommentMongoRepository.create(
            req.body,
            user as UserDbType,
        );
        const comment = await CommentMongoRepository.find(commentId);
        res.status(201).json(comment as CommentType);
    } catch (err: any) {
        res.status(500).json(err);
    }
};
