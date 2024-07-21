import { Request, Response } from "express";

export enum AvailableResolutionsEnum {
    "P144" = "P144",
    "P240" = "P240",
    "P360" = "P360",
    "P480" = "P480",
    "P720" = "P720",
    "P1080" = "P1080",
    "P1440" = "P1440",
    "P2160" = "P2160",
}

export type CreateVideoDto = {
    title: string;
    author: string;
    availableResolutions: AvailableResolutionsEnum[];
};

export type VideoType = {
    id: number;
    title: string;
    author: string;
    canBeDownloaded: boolean;
    minAgeRestriction: number | null;
    createdAt: string;
    publicationDate: string;
    availableResolutions: AvailableResolutionsEnum[];
};

export type ParamType = {
    id: string;
};

export type BodyType = {
    id: number;
    title: string;
};

export type QueryType = {
    search?: string;
};

export type OutputType = void;

export const someController = (
    req: Request<ParamType, OutputType, BodyType, QueryType>,
    res: Response<OutputType>,
) => {};
