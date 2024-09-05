import { UserDBType } from "../features/users/types/user.db";

export const collectionsConfig = {
    BLOGS: "blogs",
    POSTS: "posts",
    USERS: "users",
    COMMENTS: "comments",
} as const;

export type CollectionTypes = {
    BLOGS: any;
    POSTS: any;
    USERS: UserDBType;
    COMMENTS: any;
};
