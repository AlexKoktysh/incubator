import jwt from "jsonwebtoken";
import { UserDBType } from "../features";

const SECRET_ACCESS_TOKEN_KEY = process.env.SECRET_ACCESS_TOKEN_KEY || "TEST";

export const jwtService = {
    generateJwtTokens(user: UserDBType) {
        try {
            const accessToken = jwt.sign(
                { login: user.login, email: user.email, id: user._id },
                SECRET_ACCESS_TOKEN_KEY,
                {
                    expiresIn: "24h",
                },
            );
            return { accessToken };
        } catch (err) {
            throw err;
        }
    },
    getUserByToken(token: string) {
        try {
            const user: { id: string } = jwt.verify(
                token,
                SECRET_ACCESS_TOKEN_KEY,
            ) as { id: string };
            return user;
        } catch (err) {
            return null;
        }
    },
};
