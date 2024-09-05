import { ObjectId, Sort } from "mongodb";
import { PostDbType } from "../../db/post-db.type";
import { BlogsMongoRepository } from "../blogs/BlogMongoRepository";
import { CreatePostDto } from "./types";
import { commentsCollection, postCollection } from "../../db/mongo-db";
import { BlogDbType } from "../../db/blog-db-type";

export const PostsMongoRepository = {
    async create(post: CreatePostDto) {
        const blog = await BlogsMongoRepository.find(post.blogId);
        const newPost: PostDbType = {
            id: new ObjectId().toString(),
            title: post.title,
            content: post.content,
            shortDescription: post.shortDescription,
            createdAt: new Date().toISOString(),
            blogId: post.blogId,
            blogName: (blog as BlogDbType).name,
        };
        await postCollection.insertOne(newPost);
        return newPost.id;
    },
    async find(id: string) {
        return await postCollection.findOne(
            { id: id },
            { projection: { _id: 0 } },
        );
    },
    async getAll() {
        const posts = await postCollection
            .find({}, { projection: { _id: 0 } })
            .toArray();
        return posts;
    },
    async del(id: string) {
        await postCollection.deleteOne({
            id: id,
        });
    },
    async put(post: CreatePostDto, id: string) {
        const updatedPost = await this.find(id);
        const newPost = {
            ...(updatedPost as PostDbType),
            ...post,
        };
        await postCollection.updateOne({ id: id }, { $set: newPost });
    },
    async getAllByCondition({
        blogId,
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
    }: {
        blogId?: string;
        pageNumber: string;
        pageSize: string;
        sortBy: string;
        sortDirection: "asc" | "desc";
    }) {
        const condition = blogId ? { blogId: blogId } : {};
        const totalCount = await postCollection.countDocuments(condition);
        const posts = await postCollection
            .find(condition, {
                projection: { _id: 0 },
                sort: { [sortBy]: sortDirection === "asc" ? 1 : -1 },
                skip: (+pageNumber - 1) * +pageSize,
                limit: parseInt(pageSize),
            })
            .toArray();
        return { posts, totalCount };
    },
    async getAllComments({
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
    }: {
        pageNumber: string;
        pageSize: string;
        sortBy: string;
        sortDirection: "asc" | "desc";
    }) {
        const totalCount = await commentsCollection.countDocuments();
        const comments = await commentsCollection
            .find(
                {},
                {
                    projection: { _id: 0 },
                    sort: { [sortBy]: sortDirection === "asc" ? 1 : -1 },
                    skip: (+pageNumber - 1) * +pageSize,
                    limit: parseInt(pageSize),
                },
            )
            .toArray();
        return { comments, totalCount };
    },
};
