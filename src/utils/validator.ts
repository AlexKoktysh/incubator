import {
    AvailableResolutionsEnum,
    CreateVideoDto,
    UpdateVideoDto,
} from "../videos";
import { OutputErrorsType } from "./types";

export const InputValidation = (data: CreateVideoDto | UpdateVideoDto) => {
    const errors: OutputErrorsType = {
        errorsMessages: [],
    };

    if (!data.author) {
        errors.errorsMessages.push({
            message: "error!!!!",
            field: "author",
        });
    }
    if (!data.title) {
        errors.errorsMessages.push({
            message: "error!!!!",
            field: "title",
        });
    }
    if (
        !Array.isArray(data.availableResolutions) ||
        data.availableResolutions.find((p) => !AvailableResolutionsEnum[p])
    ) {
        errors.errorsMessages.push({
            message: "error!!!!",
            field: "availableResolution",
        });
    }
    if (data?.title?.length > 40 || !data?.title) {
        errors.errorsMessages.push({
            message: "error!!!!",
            field: "title",
        });
    }
    if (data?.author?.length > 20 || !data?.author) {
        errors.errorsMessages.push({
            message: "error!!!!",
            field: "author",
        });
    }
    const minAgeRestriction = (data as UpdateVideoDto)?.minAgeRestriction;
    if (
        minAgeRestriction &&
        (minAgeRestriction > 18 || minAgeRestriction < 1)
    ) {
        errors.errorsMessages.push({
            message: "error!!!!",
            field: "minAgeRestriction",
        });
    }
    return errors;
};
