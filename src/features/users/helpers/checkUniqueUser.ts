import { usersQueryRepository } from "../repositories";
import { CreateUserDto } from "../types";

export const isUniqueUser = async ({ email, login }: CreateUserDto) => {
    const isUniqueUser = await usersQueryRepository.findExist(email, login);
    return isUniqueUser;
};
