import { BlogDBType, CreateBlogDto } from "../types";

export const createBlog = (blog: CreateBlogDto): Partial<BlogDBType> => {
    const newBlog: Partial<BlogDBType> = {
        ...blog,
        createdAt: new Date().toISOString(),
        isMembership: false,
    };
    return newBlog;
};
