import { Request, Response } from "express";
import { db, setDB } from "../db/db";
import { CreateVideoDto, VideoType } from "./types";
import { InputValidation } from "../utils";

export const getVideos = async (req: Request, res: Response) => {
    const videos = db.videos;

    res.status(200).json(videos);
};

export const createVideo = async (
    req: Request<{}, {}, CreateVideoDto>,
    res: Response,
) => {
    const errors = InputValidation(req.body);

    if (errors.errorsMessages.length) {
        res.status(400).json(errors);
        return;
    }

    const newVideo: VideoType = {
        id: db.videos.length + 1,
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        ...req.body,
    };
    const videos = [...db.videos, newVideo];
    setDB({ videos });

    res.status(201).json(newVideo);
};

export const findVideo = async (
    req: Request<{}, {}, {}, number>,
    res: Response,
) => {
    const findVideo = db.videos.find((video) => video.id === req.query);
    console.log("findVideo", findVideo);

    res.status(200).json(findVideo);
};

export const deleteVideo = async () => {};
