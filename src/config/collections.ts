import { UserDBType } from "../features";
import { BlogDBType } from "../features/blogs/types";

export const collectionsConfig = {
    BLOGS: "blogs",
    POSTS: "posts",
    USERS: "users",
    COMMENTS: "comments",
} as const;

export type CollectionTypes = {
    BLOGS: BlogDBType;
    POSTS: any;
    USERS: UserDBType;
    COMMENTS: any;
};
