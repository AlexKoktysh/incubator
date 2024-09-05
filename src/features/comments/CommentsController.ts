import { Response, Request } from "express";
import { OutputErrorsType } from "../../utils";
import { CommentType, UpdateCommentDto } from "./types";
import { CommentMongoRepository } from "./CommentMongoRepository";

export const getCommentById = async (
    req: Request<{ id: string }>,
    res: Response<CommentType | OutputErrorsType>,
) => {
    try {
        const blog = await CommentMongoRepository.find(req.params.id);
        res.status(200).json(blog as CommentType);
    } catch (err: any) {
        res.status(500).json(err);
    }
};

export const deleteCommentController = async (
    req: Request<{ id: string }>,
    res: Response<OutputErrorsType | string>,
) => {
    try {
        await CommentMongoRepository.del(req.params.id);
        res.status(204).json("OK");
    } catch (err: any) {
        res.status(500).json(err);
    }
};

export const updateCommentController = async (
    req: Request<{ id: string }, any, UpdateCommentDto>,
    res: Response<OutputErrorsType | string>,
) => {
    try {
        await CommentMongoRepository.put(req.body, req.params.id);
        res.status(204).json("OK");
    } catch (err: any) {
        res.status(500).json(err);
    }
};
