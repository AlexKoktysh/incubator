import express from "express";
import cors from "cors";
import { VideosRouter } from "./videos";
import { SETTINGS } from "./settings";
import { TestingsRouter } from "./testing";
import { BlogsRouter } from "./entities";
import { PostsRouter } from "./entities/posts";

export const app = express();
app.use(express.json());
app.use(cors());

app.use(`${SETTINGS.PATH.VIDEOS}`, VideosRouter);
app.use(`${SETTINGS.PATH.BLOGS}`, BlogsRouter);
app.use(`${SETTINGS.PATH.POST}`, PostsRouter);

app.use("/testing", TestingsRouter);
app.get("/", (_req, res) => {
    res.status(200).json({ version: "1.0" });
});
