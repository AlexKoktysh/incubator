import { ObjectId } from "mongodb";
import { database } from "../../../db";
import { viewProtection } from "../helpers";
import { PostViewType, QueryPaginationByPostType } from "../types";

export const postsQueryRepository = {
    async findById(id: ObjectId): Promise<PostViewType | null> {
        return await (
            await database.getCollection("POSTS")
        ).findOne({ _id: id }, viewProtection);
    },
    async getAll({
        blogId,
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
    }: Required<QueryPaginationByPostType>) {
        const condition = blogId ? { blogId: blogId } : {};
        const totalCount = await (
            await database.getCollection("POSTS")
        ).countDocuments(condition);
        const posts: PostViewType[] = await (
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
    // async getAllComments({
    //     pageNumber,
    //     pageSize,
    //     sortBy,
    //     sortDirection,
    // }: {
    //     pageNumber: string;
    //     pageSize: string;
    //     sortBy: string;
    //     sortDirection: "asc" | "desc";
    // }) {
    //     const totalCount = await commentsCollection.countDocuments();
    //     const comments = await commentsCollection
    //         .find(
    //             {},
    //             {
    //                 projection: { _id: 0 },
    //                 sort: { [sortBy]: sortDirection === "asc" ? 1 : -1 },
    //                 skip: (+pageNumber - 1) * +pageSize,
    //                 limit: parseInt(pageSize),
    //             },
    //         )
    //         .toArray();
    //     return { comments, totalCount };
    // },
};
