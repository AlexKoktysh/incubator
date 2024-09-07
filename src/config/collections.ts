import { BlogDBType, CommentDBType, PostDbType, UserDBType } from "../features";

export const collectionsConfig = {
    BLOGS: "blogs",
    POSTS: "posts",
    USERS: "users",
    COMMENTS: "comments",
} as const;

export type CollectionTypes = {
    BLOGS: BlogDBType;
    POSTS: PostDbType;
    USERS: UserDBType;
    COMMENTS: CommentDBType;
};
