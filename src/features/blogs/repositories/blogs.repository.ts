import { ObjectId } from "mongodb";
import { BlogDBType, BlogViewType, CreateBlogDto } from "../types";
import { database } from "../../../db";
import { blogsQueryRepository } from "./blogs.query-repository";
import { createBlog } from "../helpers";

export const blogsRepository = {
    async create(blog: CreateBlogDto): Promise<BlogViewType | null> {
        const newBlog = createBlog(blog);
        const response = await (
            await database.getCollection("BLOGS")
        ).insertOne(newBlog as BlogDBType);
        return await blogsQueryRepository.find(response.insertedId.toString());
    },
    async update(blog: CreateBlogDto, id: string) {
        const findBlog = await blogsQueryRepository.find(id);
        const newBlog = {
            ...findBlog,
            ...blog,
        };
        await (
            await database.getCollection("BLOGS")
        ).updateOne({ _id: new ObjectId(id) }, { $set: newBlog });
    },
    async delete(id: string) {
        await (
            await database.getCollection("BLOGS")
        ).deleteOne({
            _id: new ObjectId(id),
        });
    },
};
