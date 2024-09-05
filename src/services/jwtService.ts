import jwt from "jsonwebtoken";
import { UserDbType } from "../db/user-db.type";

const SECRET_ACCESS_TOKEN_KEY = process.env.SECRET_ACCESS_TOKEN_KEY || "TEST";

export const generateJwtTokens = (user: UserDbType) => {
    const accessToken = jwt.sign(
        { login: user.login, email: user.email, id: user.id },
        SECRET_ACCESS_TOKEN_KEY,
        {
            expiresIn: "24h",
        },
    );
    return { accessToken };
};

export const getUserByToken = (token: string) => {
    try {
        const user: { id: string } = jwt.verify(
            token,
            SECRET_ACCESS_TOKEN_KEY,
        ) as { id: string };
        return user;
    } catch (err) {
        return null;
    }
};
