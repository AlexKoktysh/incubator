import { BlogType } from "../entities/blogs";
import { PostType } from "../entities/posts";
import { AvailableResolutionsEnum, VideoType } from "../videos/types";

export type DBType = {
    videos: VideoType[];
    blogs: BlogType[];
    posts: PostType[];
};

export const db: DBType = {
    videos: [],
    blogs: [],
    posts: [],
};

export const setDB = (dataset?: Partial<DBType>) => {
    if (!dataset) {
        db.videos = [];
        db.blogs = [];
        db.posts = [];
        return;
    }

    db.videos = dataset.videos || db.videos;
    db.blogs = dataset.blogs || db.blogs;
    db.posts = dataset.posts || db.posts;
};
