import { ObjectId } from "mongodb";
import { BlogDbType } from "../../db/blog-db-type";
import { blogCollection } from "../../db/mongo-db";
import { BlogType, CreateBlogDto } from "./types";

export const BlogsMongoRepository = {
    async getAll() {
        return await blogCollection
            .find({}, { projection: { _id: 0 } })
            .toArray();
    },
    async create(blog: CreateBlogDto) {
        const newBlog = {
            id: new ObjectId().toString(),
            ...blog,
            createdAt: new Date().toISOString(),
            isMembership: false,
        };
        await blogCollection.insertOne(newBlog);
        return {
            id: newBlog.id,
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: newBlog.createdAt,
            isMembership: newBlog.isMembership,
        };
    },
    async find(id: string) {
        return await blogCollection.findOne(
            { id: id },
            { projection: { _id: 0 } },
        );
    },
    async findAndMap(id: string) {
        const blog = await this.find(id)!;
        return blog && this.map(blog);
    },
    map(blog: BlogDbType) {
        const blogForOutput: BlogType = {
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            name: blog.name,
            createdAt: blog.createdAt,
            id: blog.id,
        };
        return blogForOutput;
    },
    async put(blog: CreateBlogDto, id: string) {
        const findBlog = await blogCollection.findOne({ id: id });
        console.log("findBlog", findBlog, id);
        if (findBlog) {
            const newBlog = this.map({
                ...findBlog,
                ...blog,
            });
            await blogCollection.updateOne({ id: id }, { $set: newBlog });
            return newBlog;
        }
        return null;
    },
    async del(id: string) {
        const findBlog = await this.find(id)!;
        findBlog &&
            (await blogCollection.deleteOne({
                id: id,
            }));
        return findBlog;
    },
};
