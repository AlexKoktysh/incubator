import { genSalt, hash, compare } from "bcryptjs";

export const hashPassword = async (password: string) => {
    const salt = await genSalt(10);
    const hashPassword = await hash(password, salt);
    return hashPassword;
};

export const comparePassword = async (
    bodyPassword: string,
    serverPassword: string,
) => {
    const isPasswordValid = await compare(bodyPassword, serverPassword);
    return isPasswordValid;
};
