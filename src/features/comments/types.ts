export type UpdateCommentDto = {
    content: string;
};

type CommentatorInfoType = {
    userId: string;
    userLogin: string;
};

export type CommentType = {
    id: string;
    content: string;
    commentatorInfo: CommentatorInfoType;
    createdAt: string;
};
