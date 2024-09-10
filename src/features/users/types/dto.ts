import { PaginationType, QueryPaginationType } from "../../../utils";

export type CreateUserDto = {
    login: string;
    password: string;
    email: string;
};

export type UserViewType = {
    id: string;
    login: string;
    email: string;
    createdAt: string;
};

export interface ListUsersViewType extends PaginationType {
    items: UserViewType[];
}

export interface QueryPaginationByUserType extends QueryPaginationType {
    searchLoginTerm?: string;
    searchEmailTerm?: string;
}
