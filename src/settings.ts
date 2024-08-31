import { config } from "dotenv";
config();

export const SETTINGS = {
    PORT: process.env.PORT || 3003,
    PATH: {
        BLOGS: "/blogs",
        POST: "/posts",
    },
    MONGO_URL: process.env.MONGO_URL ?? "",
    DB_NAME: "incubatorALEX",
    BLOG_COLLECTION_NAME: "blogs",
    POST_COLLECTION_NAME: "posts",
};
