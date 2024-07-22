import express from "express";
import cors from "cors";
import { VideosRouter } from "./videos";
import { SETTINGS } from "./settings";
import { TestingsRouter } from "./testing";

export const app = express();
app.use(express.json());
app.use(cors());

app.use(`${SETTINGS.PATH.VIDEOS}`, VideosRouter);
app.use("/testing", TestingsRouter);
app.get("/", (_req, res) => {
    res.status(200).json({ version: "1.0" });
});
