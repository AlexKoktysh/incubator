import { ObjectId } from "mongodb";
import { BlogDBType, BlogViewType, CreateBlogDto } from "../types";
import { database } from "../../../db";
import { blogsQueryRepository } from "./blogs.query-repository";

export const blogsRepository = {
    async create(blog: CreateBlogDto): Promise<BlogViewType | null> {
        const newBlog: Partial<BlogDBType> = {
            ...blog,
            createdAt: new Date().toISOString(),
            isMembership: false,
        };
        const response = await (
            await database.getCollection("BLOGS")
        ).insertOne(newBlog as BlogDBType);
        return await blogsQueryRepository.find(response.insertedId);
    },
    async update(blog: CreateBlogDto, id: ObjectId) {
        const findBlog = await blogsQueryRepository.find(new ObjectId(id));
        const newBlog = {
            ...findBlog,
            ...blog,
        };
        await (
            await database.getCollection("BLOGS")
        ).updateOne({ _id: new ObjectId(id) }, { $set: newBlog });
    },
    async delete(id: ObjectId) {
        await (
            await database.getCollection("BLOGS")
        ).deleteOne({
            _id: new ObjectId(id),
        });
    },
};
