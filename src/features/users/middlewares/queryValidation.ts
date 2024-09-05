import { usersQueryRepository } from "../repositories";
import { queryValidationMiddleware } from "../../../utils";
import { ObjectId } from "mongodb";

export const queryValidationByIdMiddleware = () => {
    return queryValidationMiddleware(async (id: string) => {
        const entity = await usersQueryRepository.findByCondition(
            "_id",
            new ObjectId(id),
        );
        return entity;
    });
};
