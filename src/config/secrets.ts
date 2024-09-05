import { config } from "dotenv";
config();

export const secretsConfig = {
    PORT: process.env.PORT || 3003,
    MONGO_URL: process.env.MONGO_URL ?? "",
    DB_NAME: process.env.DB_NAME ?? "",
};
