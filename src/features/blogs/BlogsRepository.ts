import { BlogDbType } from "../../db/blog-db-type";
import { db, setDB } from "../../db/db";
import { BlogType, CreateBlogDto } from "./types";

export const BlogsRepository = {
    getAll() {
        return db.blogs;
    },
    create(blog: CreateBlogDto) {
        const newBlog: BlogDbType = {
            id: new Date().toISOString() + Math.random(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
        };
        // db.blogs = [...db.blogs, newBlog];
        setDB({ blogs: [...db.blogs, newBlog] });
        return newBlog.id;
    },
    find(id: string) {
        return db.blogs.find((b) => b.id === id);
    },
    findAndMap(id: string) {
        const blog = this.find(id)!;
        return this.map(blog);
    },
    map(blog: BlogDbType) {
        const blogForOutput: BlogType = {
            id: blog.id,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            name: blog.name,
        };
        return blogForOutput;
    },
    put(blog: CreateBlogDto, id: string) {
        const findBlog = this.find(id)!;
        if (findBlog) {
            const newBlog = this.map({ ...blog, id: findBlog.id });
            setDB({
                blogs: db.blogs.map((blog) =>
                    blog.id === newBlog.id ? newBlog : blog,
                ),
            });
            return newBlog;
        }
        return null;
    },
    del(id: string) {
        const findBlog = this.find(id)!;
        findBlog &&
            setDB({
                blogs: db.blogs.filter((blog) => blog.id !== findBlog.id),
            });
        return findBlog;
    },
};
