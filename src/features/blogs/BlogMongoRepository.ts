import { ObjectId, Sort } from "mongodb";
import { BlogDbType } from "../../db/blog-db-type";
import { CreateBlogDto } from "./types";
import { collectionsConfig } from "../../config";
import { database } from "../../db";

export const BlogsMongoRepository = {
    async getAll({
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
        searchNameTerm,
    }: {
        pageNumber: string;
        pageSize: string;
        sortBy: string;
        sortDirection: "asc" | "desc";
        searchNameTerm: string;
    }) {
        const filter = {
            name: { $regex: searchNameTerm, $options: "i" },
        };
        const totalCount = await database
            .getCollection(collectionsConfig.BLOGS)
            .countDocuments(filter);
        const blogs = await blogCollection
            .find(filter, {
                projection: { _id: 0 },
                sort: { [sortBy]: sortDirection === "asc" ? 1 : -1 },
                skip: (+pageNumber - 1) * +pageSize,
                limit: parseInt(pageSize),
            })
            .toArray();
        return { blogs, totalCount };
    },
    async create(blog: CreateBlogDto) {
        const newBlog = {
            id: new ObjectId().toString(),
            ...blog,
            createdAt: new Date().toISOString(),
            isMembership: false,
        };
        await blogCollection.insertOne(newBlog);
        return await this.find(newBlog.id);
    },
    async find(id: string) {
        return await blogCollection.findOne(
            { id: id },
            { projection: { _id: 0 } },
        );
    },
    async put(blog: CreateBlogDto, id: string) {
        const findBlog = await blogCollection.findOne({ id: id });
        const newBlog = {
            ...(findBlog as BlogDbType),
            ...blog,
        };
        await blogCollection.updateOne({ id: id }, { $set: newBlog });
    },
    async del(id: string) {
        await blogCollection.deleteOne({
            id: id,
        });
    },
};
