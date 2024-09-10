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
        ).updateOne({ _id: new ObjectId(id) }, { $set: newComment });
    },
    async create(
        comment: UpdateCommentDto,
        user: UserViewType,
        postId: string,
    ) {
        const newComment: Partial<CommentDBType> = {
            content: comment.content,
            createdAt: new Date().toISOString(),
            commentatorInfo: {
                userId: new ObjectId(user.id) as unknown as string,
                userLogin: user.login,
            },
            postId: new ObjectId(postId),
        };
        const response = await (
            await database.getCollection("COMMENTS")
        ).insertOne(newComment as CommentDBType);
        return await commentsQueryRepository.find(response.insertedId);
    },
};
