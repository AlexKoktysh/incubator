import { AvailableResolutionsEnum, VideoType } from "../videos/types";

export type DBType = {
    videos: VideoType[];
};

export const db: DBType = {
    videos: [
        {
            id: 1,
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: "2024-07-22T06:37:53.136Z",
            publicationDate: "2024-07-22T06:37:53.136Z",
            title: "Test111",
            author: "Author111",
            availableResolutions: [AvailableResolutionsEnum.P360],
        },
    ],
};

export const setDB = (dataset?: Partial<DBType>) => {
    if (!dataset) {
        db.videos = [];
        return;
    }

    db.videos = dataset.videos || db.videos;
};
