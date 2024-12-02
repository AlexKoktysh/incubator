import {
    BlogDBType,
    CommentDBType,
    PostDbType,
    UserDBType,
    DevicesDbType,
} from "../features";

export const collectionsConfig = {
    BLOGS: "blogs",
    POSTS: "posts",
    USERS: "users",
    COMMENTS: "comments",
    DEVICES: "devices",
} as const;

export type CollectionTypes = {
    BLOGS: BlogDBType;
    POSTS: PostDbType;
    USERS: UserDBType;
    COMMENTS: CommentDBType;
    DEVICES: DevicesDbType;
};
