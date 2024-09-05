import { usersQueryRepository } from "../repositories";
import { CreateUserDto } from "../types";

const isUniqueEmail = async (email: string) => {
    try {
        const user = await usersQueryRepository.findByCondition("email", email);
        return !user;
    } catch (err) {
        console.error("isUniqueEmail", err);
        return true;
    }
};

const isUniqueLogin = async (login: string) => {
    try {
        const user = await usersQueryRepository.findByCondition("login", login);
        return !user;
    } catch (err) {
        console.error("isUniqueLogin", err);
        return true;
    }
};

export const isUniqueUser = async ({ email, login }: CreateUserDto) => {
    const isUniqueUserByEmail = await isUniqueEmail(email);
    const isUniqueUserByLogin = await isUniqueLogin(login);
    return !isUniqueUserByEmail || !isUniqueUserByLogin;
};
