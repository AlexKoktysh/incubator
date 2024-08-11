import { BlogDbType } from "./blog-db-type";
import { PostDbType } from "./post-db.type";

export type DBType = {
    blogs: BlogDbType[];
    posts: PostDbType[];
};

export const db: DBType = {
    blogs: [],
    posts: [],
};

export type ReadonlyDBType = {
    blogs: Readonly<BlogDbType[]>;
    posts: Readonly<PostDbType[]>;
};

export const setDB = (dataset?: Partial<ReadonlyDBType>) => {
    if (!dataset) {
        db.blogs = [];
        db.posts = [];
        return;
    }

    db.blogs = dataset.blogs?.map((b) => ({ ...b })) || db.blogs;
    db.posts = dataset.posts?.map((p) => ({ ...p })) || db.posts;
};
