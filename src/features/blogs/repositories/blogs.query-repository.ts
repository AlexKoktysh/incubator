import { ObjectId } from "mongodb";
import { database } from "../../../db";
import { viewProtection } from "../helpers";
import { BlogViewType, QueryPaginationByBlogType } from "../types";

export const blogsQueryRepository = {
    async getAll({
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
        searchNameTerm,
    }: Required<QueryPaginationByBlogType>) {
        const filter = {
            name: { $regex: searchNameTerm, $options: "i" },
        };
        const totalCount = await (
            await database.getCollection("BLOGS")
        ).countDocuments(filter);
        const blogs = await (await database.getCollection("BLOGS"))
            .aggregate([
                { $match: filter },
                viewProtection,
                { $sort: { [sortBy]: sortDirection === "asc" ? 1 : -1 } },
                { $skip: (+pageNumber - 1) * +pageSize },
                { $limit: parseInt(pageSize) },
            ])
            .toArray();
        return { blogs: blogs as BlogViewType[], totalCount };
    },
    async find(id: ObjectId): Promise<BlogViewType | null> {
        return (await (
            await database.getCollection("BLOGS")
        ).findOne({ _id: id }, viewProtection)) as BlogViewType | null;
    },
};
