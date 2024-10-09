import jwt from "jsonwebtoken";
import { UserDBType } from "../features";
import { constantsConfig, secretsConfig } from "../config";

export const jwtService = {
    generateJwtTokens(user: UserDBType) {
        try {
            const accessToken = jwt.sign(
                { login: user.login, email: user.email, id: user._id },
                secretsConfig.SECRET_ACCESS_TOKEN_KEY,
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
                secretsConfig.SECRET_ACCESS_TOKEN_KEY,
            ) as { id: string };
            return user;
        } catch (err) {
            return null;
        }
    },
    async generateConfirmationCode(email: string) {
        const payload = { email };
        const options = { expiresIn: `${constantsConfig.EXPIRES_TIME}m` };
        return jwt.sign(payload, secretsConfig.SECRET_CONFIRM_CODE, options);
    },
    verifyConfirmationCode(token: string) {
        try {
            const decoded = jwt.verify(
                token,
                secretsConfig.SECRET_CONFIRM_CODE,
            );
            return { valid: true, email: (decoded as { email: string }).email };
        } catch (error) {
            return {
                valid: false,
                message: "Invalid or expired confirmation code",
            };
        }
    },
};
