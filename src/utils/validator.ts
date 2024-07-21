import { AvailableResolutionsEnum, CreateVideoDto } from "../videos";
import { OutputErrorsType } from "./types";

export const InputValidation = (data: CreateVideoDto) => {
    const errors: OutputErrorsType = {
        errorsMessages: [],
    };

    if (
        !Array.isArray(data.availableResolutions) ||
        data.availableResolutions.find((p) => !AvailableResolutionsEnum[p])
    ) {
        errors.errorsMessages.push({
            message: "error!!!!",
            field: "availableResolution",
        });
    }
    return errors;
};
