import { Request, Response } from "express";
import { db, setDB } from "../db/db";
import { CreateVideoDto, VideoType, UpdateVideoDto } from "./types";
import { OutputErrorsType } from "../utils";
import { CreateVideoSchema, UpdateVideoSchema } from "../utils/validator";

export const getVideos = async (req: Request, res: Response) => {
    const videos = db.videos;

    res.status(200).json(videos);
};

export const createVideo = async (
    req: Request<{}, {}, CreateVideoDto>,
    res: Response,
) => {
    const { error } = CreateVideoSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) {
        const formattedErrors = error.details.map((err) => ({
            message: "error!!!!",
            field:
                err.path[0] === "availableResolutions"
                    ? "availableResolutions"
                    : err.path.join("."),
        }));
        return res.status(400).json({ errorsMessages: formattedErrors });
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

    return res.status(201).json(newVideo);
};

export const findVideo = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    const findVideo = db.videos.find(
        (video) => video.id === Number(req.params.id),
    );

    findVideo
        ? res.status(200).json(findVideo)
        : res
              .status(404)
              .json({ errorsMessages: { message: "error!!!!", field: "id" } });
};

export const updateVideo = async (
    req: Request<{ id: string }, {}, UpdateVideoDto>,
    res: Response,
) => {
    const { error } = UpdateVideoSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) {
        const formattedErrors = error.details.map((err) => ({
            message: "error!!!!",
            field:
                err.path[0] === "availableResolutions"
                    ? "availableResolutions"
                    : err.path.join("."),
        }));
        return res.status(400).json({ errorsMessages: formattedErrors });
    }

    const updateVideo = db.videos.find(
        (video) => video.id === Number(req.params.id),
    );
    const updatedVideos = db.videos.map((video) => {
        if (video.id === Number(req.params.id))
            return {
                ...video,
                ...req.body,
            };
        return video;
    });
    setDB({ videos: updatedVideos });

    if (updateVideo) {
        return res.status(204).json("OK");
    } else {
        return res
            .status(404)
            .json({ errorsMessages: [{ message: "error!!!!", field: "id" }] });
    }
};

export const deleteVideo = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    const errors: OutputErrorsType = { errorsMessages: [] };
    if (!req.params.id) {
        errors.errorsMessages.push({
            message: "error!!!!",
            field: "params",
        });
    }

    if (errors.errorsMessages.length) {
        res.status(400).json(errors);
        return;
    }
    const deleteVideo = db.videos.find(
        (video) => video.id === Number(req.params.id),
    );
    const newVideos = db.videos.filter(
        (video) => video.id !== Number(req.params.id),
    );
    setDB({ videos: [...newVideos] });

    deleteVideo
        ? res.status(204).json(deleteVideo)
        : res
              .status(404)
              .json({ errorsMessages: { message: "error!!!!", field: "id" } });
};
