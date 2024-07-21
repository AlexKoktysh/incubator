import express from "express";
import cors from "cors";
import { VideosRouter } from "./videos";
import { SETTINGS } from "./settings";

export const app = express();
app.use(express.json());
app.use(cors());

app.use(`${SETTINGS.PATH.VIDEOS}`, VideosRouter);
app.get("/", (req, res) => {
    res.status(200).json({ version: "1.0" });
});
