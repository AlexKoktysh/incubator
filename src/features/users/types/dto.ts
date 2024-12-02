import {
    MailerTypeEnum,
    PaginationType,
    QueryPaginationType,
} from "../../../utils";

export type CreateUserDto = {
    login: string;
    password: string;
    email: string;
};

export type ConfirmUserDto = {
    code: string;
};

export type ResendingConfirmDto = {
    email: string;
};

export type UserViewType = {
    id: string;
    login: string;
    email: string;
    createdAt: string;
};

export type UpdateUserDto = {
    id: string;
    isConfirmed?: boolean;
    confirmationCode?: string;
    expirationDate?: Date;
};

export interface ListUsersViewType extends PaginationType {
    items: UserViewType[];
}

export interface QueryPaginationByUserType extends QueryPaginationType {
    searchLoginTerm?: string;
    searchEmailTerm?: string;
}

export type ConfirmUserType = {
    id: string;
    email: string;
    mailerType: MailerTypeEnum;
};
