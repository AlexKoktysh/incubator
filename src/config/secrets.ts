import { config } from "dotenv";
config();

export const secretsConfig = {
    PORT: process.env.PORT || 3003,
    MONGO_URL: process.env.MONGO_URL ?? "",
    DB_NAME: process.env.DB_NAME ?? "",
    GMAIL_USER: process.env.GMAIL_USER ?? "",
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD ?? "",
    SECRET_ACCESS_TOKEN_KEY: process.env.SECRET_ACCESS_TOKEN_KEY ?? "",
    SECRET_CONFIRM_CODE: process.env.SECRET_CONFIRM_CODE ?? "",
};
