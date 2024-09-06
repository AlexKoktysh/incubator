import { Response, Request } from "express";
import { OutputErrorsType, setDefaultQueryParams } from "../../utils";
import { postRepository, postsQueryRepository } from "./repositories";
import {
    CreatePostDto,
    PostViewType,
    QueryPaginationByPostType,
} from "./types";
import { ObjectId } from "mongodb";

export const postsController = {
    async getAll(
        req: Request<{}, {}, {}, Required<QueryPaginationByPostType>>,
        res: Response<any>,
    ) {
        try {
            const { pageNumber, pageSize, sortBy, sortDirection } = {
                ...setDefaultQueryParams(req.query),
            };
            const { posts, totalCount } = await postsQueryRepository.getAll({
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
                blogId: "",
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
    async getById(
        req: Request<{ id: string }>,
        res: Response<PostViewType | OutputErrorsType>,
    ) {
        try {
            const post = await postsQueryRepository.findById(
                new ObjectId(req.params.id),
            );
            res.status(200).json(post as PostViewType);
        } catch (err: any) {
            res.status(500).json(err);
        }
    },
    async create(
        req: Request<{ id: string }, any, CreatePostDto>,
        res: Response<PostViewType | OutputErrorsType>,
    ) {
        try {
            const newPost = await postRepository.create(req.body);
            res.status(201).json(newPost as PostViewType);
        } catch (err: any) {
            res.status(500).json(err);
        }
    },
    async update(
        req: Request<{ id: string }, any, CreatePostDto>,
        res: Response<PostViewType | OutputErrorsType | string>,
    ) {
        try {
            await postRepository.update(req.body, req.params.id);
            res.status(204).json("OK");
        } catch (err: any) {
            res.status(500).json(err);
        }
    },
    async delete(
        req: Request<{ id: string }>,
        res: Response<PostViewType | OutputErrorsType | string>,
    ) {
        try {
            await postRepository.delete(req.params.id);
            res.status(204).json("OK");
        } catch (err: any) {
            res.status(500).json(err);
        }
    },
};

// export const getComments = async (
//     req: Request<
//         { id: string },
//         {},
//         {},
//         {
//             pageNumber?: string;
//             pageSize?: string;
//             sortBy?: string;
//             sortDirection?: "asc" | "desc";
//         }
//     >,
//     res: Response,
// ) => {
//     try {
//         const {
//             pageNumber = String(1),
//             pageSize = String(10),
//             sortBy = "createdAt",
//             sortDirection = "desc",
//         } = req.query;
//         const { comments, totalCount } = await PostsRepository.getAllComments({
//             pageNumber,
//             pageSize,
//             sortBy,
//             sortDirection,
//         });
//         res.status(200).json({
//             items: comments,
//             totalCount,
//             pagesCount: Math.ceil(totalCount / +pageSize),
//             page: +pageNumber,
//             pageSize: +pageSize,
//         });
//     } catch (err: any) {
//         res.status(500).json(err);
//     }
// };

// export const createComment = async (
//     req: Request<{ id: string }, any, UpdateCommentDto>,
//     res: Response<CommentType | OutputErrorsType>,
// ) => {
//     try {
//         const user = await AuthMongoRepository.find(req.userId as string);
//         const commentId = await CommentMongoRepository.create(
//             req.body,
//             user as UserDbType,
//         );
//         const comment = await CommentMongoRepository.find(commentId);
//         res.status(201).json(comment as CommentType);
//     } catch (err: any) {
//         res.status(500).json(err);
//     }
// };
