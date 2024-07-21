import { VideoType } from "../videos/types";

export type DBType = {
    videos: VideoType[];
};

export const db: DBType = {
    videos: [],
};

export const setDB = (dataset?: Partial<DBType>) => {
    if (!dataset) {
        db.videos = [];
        return;
    }

    db.videos = dataset.videos || db.videos;
};
