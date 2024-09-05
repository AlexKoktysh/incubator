import { ObjectId } from "mongodb";
import { commentsCollection } from "../../db/mongo-db";
import { CommentType, UpdateCommentDto } from "./types";
import { UserDbType } from "../../db/user-db.type";

export const CommentMongoRepository = {
    async find(id: string) {
        return await commentsCollection.findOne(
            { id: id },
            { projection: { _id: 0 } },
        );
    },
    async del(id: string) {
        await commentsCollection.deleteOne({
            id: id,
        });
    },
    async put(comment: UpdateCommentDto, id: string) {
        const findComment = await commentsCollection.findOne({ id: id });
        const newComment = {
            ...findComment,
            ...comment,
        };
        await commentsCollection.updateOne({ id: id }, { $set: newComment });
    },
    async create(comment: UpdateCommentDto, user: UserDbType) {
        const newComment: CommentType = {
            id: new ObjectId().toString(),
            content: comment.content,
            createdAt: new Date().toISOString(),
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login,
            },
        };
        await commentsCollection.insertOne(newComment);
        return newComment.id;
        // const findComment = await commentsCollection.findOne({ id: id });
        // const newComment = {
        //     ...findComment,
        //     ...comment,
        // };
        // await commentsCollection.updateOne({ id: id }, { $set: newComment });
    },
};
