import { ObjectId } from "mongodb";
import { QueryPaginationType } from "../../../utils";

export type UpdateCommentDto = {
    content: string;
};

export interface QueryPaginationByCommentsType extends QueryPaginationType {
    postId?: string;
}

export type CommentatorInfoType = {
    userId: ObjectId;
    userLogin: string;
};

export type CommentViewType = {
    id: string;
    content: string;
    commentatorInfo: CommentatorInfoType;
    createdAt: string;
};
