import { Response, Request } from "express";
import { QueryPaginationByBlogType } from "../blogs/types";

export const postsController = {
    async getAllPostsController(
        req: Request<{}, {}, {}, Required<QueryPaginationByBlogType>>,
        res: Response<any>,
    ) {
        try {
            const {
                pageNumber = String(1),
                pageSize = String(10),
                sortBy = "createdAt",
                sortDirection = "desc",
            } = req.query;
            const { posts, totalCount } =
                await PostsRepository.getAllByCondition({
                    pageNumber,
                    pageSize,
                    sortBy,
                    sortDirection,
                });
            res.status(200).json({
                items: posts,
                totalCount,
                pagesCount: Math.ceil(totalCount / +pageSize),
                page: +pageNumber,
                pageSize: +pageSize,
            });
        } catch (err: any) {
            console.log("error", err);
            res.status(500).json(err);
        }
    },
};
