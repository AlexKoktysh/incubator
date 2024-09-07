import { ObjectId } from "mongodb";
import { CommentatorInfoType } from "./dto";

export type CommentDBType = {
    _id: ObjectId;
    content: string;
    commentatorInfo: CommentatorInfoType;
    createdAt: string;
    postId: ObjectId;
};
