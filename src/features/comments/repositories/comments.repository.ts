import { ObjectId } from "mongodb";
import { database } from "../../../db";
import { CommentDBType, UpdateCommentDto } from "../types";
import { UserViewType } from "../../users/types";
import { commentsQueryRepository } from "./comments.query-repository";

export const commentsRepository = {
    async delete(id: string) {
        await (
            await database.getCollection("COMMENTS")
        ).deleteOne({
            _id: new ObjectId(id),
        });
    },
    async update(comment: UpdateCommentDto, id: string) {
        const findComment = await (
            await database.getCollection("COMMENTS")
        ).findOne({ _id: new ObjectId(id) });
        const newComment = {
            ...findComment,
            ...comment,
        };
        await (
            await database.getCollection("COMMENTS")
        ).updateOne({ id: id }, { $set: newComment });
    },
    async create(comment: UpdateCommentDto, user: UserViewType) {
        const newComment: Partial<CommentDBType> = {
            content: comment.content,
            createdAt: new Date().toISOString(),
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login,
            },
        };
        const response = await (
            await database.getCollection("COMMENTS")
        ).insertOne(newComment as CommentDBType);
        return await commentsQueryRepository.find(response.insertedId);
    },
};
