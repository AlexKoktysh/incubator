import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { UserDBType } from "../features";
import { constantsConfig, secretsConfig } from "../config";

export const jwtService = {
    createToken(
        user: UserDBType,
        secret: string,
        expiresIn: string,
        deviceId?: string,
    ) {
        let meta = {
            login: user.login,
            email: user.email,
            id: user._id.toString(),
            deviceId,
        };
        if (!deviceId) {
            meta = { ...meta, deviceId: uuidv4() };
        }
        const token = jwt.sign(meta, secret, {
            expiresIn,
        });
        return token;
    },
    generateJwtTokens(user: UserDBType, deviceId?: string) {
        try {
            const accessToken = jwtService.createToken(
                user,
                secretsConfig.SECRET_ACCESS_TOKEN_KEY,
                `${constantsConfig.expiresAccessToken}s`,
                deviceId,
            );
            const refreshToken = jwtService.createToken(
                user,
                secretsConfig.SECRET_REFRESH_TOKEN_KEY,
                `${constantsConfig.expiresRefreshToken}s`,
                deviceId,
            );
            return { accessToken, refreshToken };
        } catch (err) {
            throw err;
        }
    },
    getUserByToken(token: string, type: "access" | "refresh") {
        try {
            const user: { id: string; deviceId: string; iat: number } =
                jwt.verify(
                    token,
                    secretsConfig[
                        type === "access"
                            ? "SECRET_ACCESS_TOKEN_KEY"
                            : "SECRET_REFRESH_TOKEN_KEY"
                    ],
                ) as { id: string; deviceId: string; iat: number };
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
