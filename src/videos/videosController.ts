import { Request, Response } from "express";
import { db, setDB } from "../db/db";
import { CreateVideoDto, VideoType, UpdateVideoDto } from "./types";
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

    const createdAt = new Date();
    const publicationDate = new Date();
    publicationDate.setDate(publicationDate.getDate() + 1);

    const newVideo: VideoType = {
        id: db.videos.length + 1,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
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

    res.status(200).json(findVideo);
};

export const updateVideo = async (
    req: Request<{ id: string }, {}, UpdateVideoDto, number>,
    res: Response,
) => {
    const errors = InputValidation(req.body);

    if (errors.errorsMessages.length) {
        res.status(400).json(errors);
        return;
    }
    const updatedVideos = db.videos.map((video) => {
        if (video.id === Number(req.params.id))
            return {
                ...video,
                ...req.body,
            };
        return video;
    });
    setDB({ videos: updatedVideos });

    res.status(204).json("OK");
};

export const deleteVideo = async (
    req: Request<{}, {}, {}, number>,
    res: Response,
) => {
    const newVideos = db.videos.filter((video) => video.id === req.query);
    setDB({ videos: newVideos });

    res.status(204).json("OK");
};
