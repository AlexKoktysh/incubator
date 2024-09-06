import { genSalt, hash, compare } from "bcryptjs";

export const bcryptService = {
    async hashPassword(password: string) {
        const salt = await genSalt(10);
        const hashPassword = await hash(password, salt);
        return hashPassword;
    },
    async comparePassword(bodyPassword: string, serverPassword: string) {
        const isPasswordValid = await compare(bodyPassword, serverPassword);
        return isPasswordValid;
    },
};
