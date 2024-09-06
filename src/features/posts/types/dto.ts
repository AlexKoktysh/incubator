import { PaginationType, QueryPaginationType } from "../../../utils";

export interface QueryPaginationByPostType extends QueryPaginationType {
    blogId?: string;
}

export type CreatePostDto = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
};

export type PostViewType = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
};

export interface ListPostsViewType extends PaginationType {
    items: PostViewType[];
}
