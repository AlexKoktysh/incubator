import { Router } from "express";
import {
    getVideos,
    createVideo,
    findVideo,
    updateVideo,
    deleteVideo,
} from "./videosController";

export const VideosRouter = Router();

VideosRouter.get("/", getVideos);
VideosRouter.post("/", createVideo);
VideosRouter.get("/:id", findVideo);
VideosRouter.put("/:id", updateVideo);
VideosRouter.delete("/:id", deleteVideo);
