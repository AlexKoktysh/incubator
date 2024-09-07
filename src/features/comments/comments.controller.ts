import { Response, Request } from "express";
import { CommentViewType, UpdateCommentDto } from "./types";
import { HttpStatuses, OutputErrorsType } from "../../utils";
import { commentsQueryRepository, commentsRepository } from "./repositories";

export const commentsController = {
    async find(
        req: Request<{ id: string }>,
        res: Response<CommentViewType | OutputErrorsType>,
    ) {
        try {
            const comments = await commentsQueryRepository.find(req.params.id);
            res.status(HttpStatuses.Success).json(comments as CommentViewType);
        } catch (err: any) {
            res.status(HttpStatuses.Error).json(err);
        }
    },

    async delete(
        req: Request<{ id: string }>,
        res: Response<OutputErrorsType | string>,
    ) {
        try {
            await commentsRepository.delete(req.params.id);
            res.status(HttpStatuses.NoContent).json("OK");
        } catch (err: any) {
            res.status(HttpStatuses.Error).json(err);
        }
    },

    async update(
        req: Request<{ id: string }, any, UpdateCommentDto>,
        res: Response<OutputErrorsType | string>,
    ) {
        try {
            await commentsRepository.update(req.body, req.params.id);
            res.status(HttpStatuses.NoContent).json("OK");
        } catch (err: any) {
            res.status(HttpStatuses.Error).json(err);
        }
    },
};
