import express from "express";
import cors from "cors";
import { TestingsRouter } from "./testing";
import { BlogsRouter } from "./features/blogs";
import { PostsRouter } from "./features/posts";
import { AuthRouters } from "./features/auth";
import { CommentsRouter } from "./features/comments";
import { usersRouter } from "./features";
import { pathConfig } from "./config";

export const app = express();
app.use(express.json());
app.use(cors());

app.use(`${pathConfig.BLOGS}`, BlogsRouter);
app.use(`${pathConfig.POST}`, PostsRouter);
app.use(`${pathConfig.USERS}`, usersRouter);
app.use(`${pathConfig.AUTH}`, AuthRouters);
app.use(`${pathConfig.COMMENTS}`, CommentsRouter);

app.use("/testing", TestingsRouter);
app.get("/", (_req, res) => {
    res.status(200).json({ version: "1.0" });
});
