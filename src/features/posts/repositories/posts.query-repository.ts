import { ObjectId } from "mongodb";
import { database } from "../../../db";
import { viewProtection } from "../helpers";
import { PostViewType, QueryPaginationByPostType } from "../types";

export const postsQueryRepository = {
    async findById(id: ObjectId): Promise<PostViewType | null> {
        return (await (
            await database.getCollection("POSTS")
        ).findOne({ _id: id }, viewProtection)) as PostViewType | null;
    },
    async getAll({
        blogId,
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
    }: Required<QueryPaginationByPostType>) {
        const condition = blogId ? { blogId: new ObjectId(blogId) } : {};
        const totalCount = await (
            await database.getCollection("POSTS")
        ).countDocuments(condition);
        const posts = await (
            await database.getCollection("POSTS")
        )
            .find(condition, {
                ...viewProtection,
                sort: { [sortBy]: sortDirection === "asc" ? 1 : -1 },
                skip: (+pageNumber - 1) * +pageSize,
                limit: parseInt(pageSize),
            })
            .toArray();
        return { posts, totalCount };
    },
};
