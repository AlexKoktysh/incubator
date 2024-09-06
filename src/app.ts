import express from "express";
import cors from "cors";
import { TestingsRouter } from "./testing";
import { CommentsRouter } from "./features/comments";
import { authRouter, blogsRouter, postsRouter, usersRouter } from "./features";
import { pathConfig } from "./config";

export const app = express();
app.use(express.json());
app.use(cors());

app.use(`${pathConfig.BLOGS}`, blogsRouter);
app.use(`${pathConfig.POST}`, postsRouter);
app.use(`${pathConfig.USERS}`, usersRouter);
app.use(`${pathConfig.AUTH}`, authRouter);
app.use(`${pathConfig.COMMENTS}`, CommentsRouter);

app.use("/testing", TestingsRouter);
app.get("/", (_req, res) => {
    res.status(200).json({ version: "1.0" });
});
