import { PaginationType, QueryPaginationType } from "../../utils";

export type CreateUserDto = {
    login: string;
    password: string;
    email: string;
};

export type UserType = {
    id: string;
    login: string;
    email: string;
    createdAt: string;
};

export interface UsersDtoType extends PaginationType {
    items: UserType[];
}

export interface QueryPaginationByUserType extends QueryPaginationType {
    searchLoginTerm?: string;
    searchEmailTerm?: string;
}
