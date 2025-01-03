import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { TestingsRouter } from "./testing";
import {
    authRouter,
    blogsRouter,
    commentsRouter,
    devicesRouter,
    postsRouter,
    usersRouter,
} from "./features";
import { pathConfig } from "./config";
import { HttpStatuses } from "./utils";

export const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.set("trust proxy", true);

app.use(`${pathConfig.BLOGS}`, blogsRouter);
app.use(`${pathConfig.POST}`, postsRouter);
app.use(`${pathConfig.USERS}`, usersRouter);
app.use(`${pathConfig.AUTH}`, authRouter);
app.use(`${pathConfig.COMMENTS}`, commentsRouter);
app.use(`${pathConfig.DEVICES}`, devicesRouter);

app.use("/testing", TestingsRouter);
app.get("/", (_req, res) => {
    res.status(HttpStatuses.Success).json({ version: "1.0" });
});
