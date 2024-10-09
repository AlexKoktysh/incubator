import { ObjectId } from "mongodb";
import { CommentDBType } from "../types";
import { UserViewType } from "../../users/types";

export const createComment = (
    content: string,
    { id, login }: UserViewType,
    postId: string,
): Partial<CommentDBType> => {
    const newComment: Partial<CommentDBType> = {
        content: content,
        createdAt: new Date().toISOString(),
        commentatorInfo: {
            userId: new ObjectId(id) as unknown as string,
            userLogin: login,
        },
        postId: new ObjectId(postId),
    };
    return newComment;
};
