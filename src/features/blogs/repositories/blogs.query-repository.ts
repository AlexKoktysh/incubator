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
    }: Required<QueryPaginationByBlogType>): Promise<{
        blogs: BlogViewType[];
        totalCount: number;
    }> {
        const filter = {
            name: { $regex: searchNameTerm, $options: "i" },
        };
        const totalCount = await (
            await database.getCollection("BLOGS")
        ).countDocuments(filter);
        const blogs = await (
            await database.getCollection("BLOGS")
        )
            .find(filter, {
                sort: { [sortBy]: sortDirection === "asc" ? 1 : -1 },
                skip: (+pageNumber - 1) * +pageSize,
                limit: parseInt(pageSize),
                projection: viewProtection,
            })
            .toArray();
        return { blogs: blogs as unknown as BlogViewType[], totalCount };
    },
    async find(id: string): Promise<BlogViewType | null> {
        const blog = await (
            await database.getCollection("BLOGS")
        ).findOne({ _id: new ObjectId(id) }, { projection: viewProtection });
        return blog as BlogViewType | null;
    },
};
