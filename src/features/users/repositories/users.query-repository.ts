import { ObjectId } from "mongodb";
import { database } from "../../../db";
import { QueryPaginationByUserType, UserViewType } from "../types";

export const usersQueryRepository = {
    async findByCondition(
        field: string,
        value: string | ObjectId,
    ): Promise<UserViewType | null> {
        const user = await (
            await database.getCollection("USERS")
        ).findOne({ [field]: value }, { projection: { password: 0 } });
        return user ? { ...user, id: user._id } : null;
    },

    async getMany(
        query: QueryPaginationByUserType,
    ): Promise<{ users: UserViewType[]; totalCount: number }> {
        const {
            pageNumber = String(1),
            pageSize = String(10),
            sortBy = "createdAt",
            sortDirection = "desc",
            searchLoginTerm = null,
            searchEmailTerm = null,
        } = query;
        const filter = {
            $or: [
                {
                    login: {
                        $regex: searchLoginTerm ?? "",
                        $options: "i",
                    },
                },
                {
                    email: {
                        $regex: searchEmailTerm ?? "",
                        $options: "i",
                    },
                },
            ].filter(Boolean),
        };
        const totalCount = await (
            await database.getCollection("USERS")
        ).countDocuments(filter);
        const users = await (
            await database.getCollection("USERS")
        )
            .aggregate([
                { $match: filter },
                {
                    $project: {
                        _id: 0,
                        id: "$_id",
                        password: 0,
                    },
                },
                { $sort: { [sortBy]: sortDirection === "asc" ? 1 : -1 } },
                { $skip: (+pageNumber - 1) * +pageSize },
                { $limit: parseInt(pageSize) },
            ])
            .toArray();
        return { users: users as UserViewType[], totalCount };
    },
};
