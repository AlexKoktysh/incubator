import { add } from "date-fns/add";
import { CreateUserDto, UserDBType } from "../types";
import { constantsConfig } from "../../../config";

export const createUser = (user: CreateUserDto): Partial<UserDBType> => {
    const newUser: Partial<UserDBType> = {
        ...user,
        emailConfirmation: {
            confirmationCode: "",
            expirationDate: add(new Date(), {
                minutes: constantsConfig.EXPIRES_TIME,
            }),
            isConfirmed: false,
        },
        createdAt: new Date().toISOString(),
    };
    return newUser;
};
