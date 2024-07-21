import { Router } from "express";
import {
    getVideos,
    createVideo,
    findVideo,
    deleteVideo,
} from "./videosController";

export const VideosRouter = Router();

VideosRouter.get("/", getVideos);
VideosRouter.post("/", createVideo);
VideosRouter.get("/:id", findVideo);
VideosRouter.delete("/:id", deleteVideo);
