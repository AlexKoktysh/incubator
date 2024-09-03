import { CreateUserDto } from "../types";
import { UsersMongoRepository } from "../UsersMongoRepository";

const isUniqueEmail = async (email: string) => {
    try {
        const user = await UsersMongoRepository.findByEmail(email);
        return !user;
    } catch (err) {
        console.error("isUniqueEmail", err);
        return true;
    }
};

const isUniqueLogin = async (login: string) => {
    try {
        const user = await UsersMongoRepository.findByLogin(login);
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
