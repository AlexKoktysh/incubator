import express from "express";
import cors from "cors";
import { SETTINGS } from "./settings";
import { TestingsRouter } from "./testing";
import { BlogsRouter } from "./features/blogs";
import { PostsRouter } from "./features/posts";

export const app = express();
app.use(express.json());
app.use(cors());

app.use(`${SETTINGS.PATH.BLOGS}`, BlogsRouter);
app.use(`${SETTINGS.PATH.POST}`, PostsRouter);

app.use("/testing", TestingsRouter);
app.get("/", (_req, res) => {
    res.status(200).json({ version: "1.0" });
});
