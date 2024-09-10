import { PaginationType, QueryPaginationType } from "../../../utils";

export interface QueryPaginationByBlogType extends QueryPaginationType {
    searchNameTerm?: string;
}

export type CreateBlogDto = {
    name: string;
    description: string;
    websiteUrl: string;
};

export type BlogViewType = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
};

export interface ListBlogsViewType extends PaginationType {
    items: BlogViewType[];
}
