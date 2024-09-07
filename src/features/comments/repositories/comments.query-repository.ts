import { ObjectId } from "mongodb";
import { database } from "../../../db";
import { viewProtection } from "../helpers";
import { CommentViewType, QueryPaginationByCommentsType } from "../types";

export const commentsQueryRepository = {
    async find(id: string | ObjectId): Promise<CommentViewType | null> {
        return (await (
            await database.getCollection("COMMENTS")
        ).findOne(
            { _id: new ObjectId(id) },
            viewProtection,
        )) as CommentViewType | null;
    },

    async getByPostId({
        pageNumber,
        pageSize,
        postId,
        sortBy,
        sortDirection,
    }: Required<QueryPaginationByCommentsType>) {
        const condition = { postId: new ObjectId(postId) };
        const totalCount = await (
            await database.getCollection("COMMENTS")
        ).countDocuments(condition);

        const comments = await (
            await database.getCollection("COMMENTS")
        )
            .find(condition, {
                ...viewProtection,
                sort: { [sortBy]: sortDirection === "asc" ? 1 : -1 },
                skip: (+pageNumber - 1) * +pageSize,
                limit: parseInt(pageSize),
            })
            .toArray();
        return { comments, totalCount };
    },
};
