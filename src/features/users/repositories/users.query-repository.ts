import { ObjectId } from "mongodb";
import { database } from "../../../db";
import { QueryPaginationByUserType, UserDBType, UserViewType } from "../types";
import { viewProtection } from "../helpers";

export const usersQueryRepository = {
    async findByCondition(
        field: string,
        value: string | ObjectId,
    ): Promise<UserViewType | null> {
        const user = (await (
            await database.getCollection("USERS")
        ).findOne({ [field]: value }, viewProtection)) as UserViewType | null;
        return user;
    },

    async findForLogin(loginOrEmail: string): Promise<UserDBType | null> {
        const filter = {
            $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
        };
        return await (await database.getCollection("USERS")).findOne(filter);
    },

    async getMany(
        query: Required<QueryPaginationByUserType>,
    ): Promise<{ users: UserViewType[]; totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchLoginTerm,
            searchEmailTerm,
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
