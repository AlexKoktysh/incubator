import { ObjectId } from "mongodb";
import { blogsQueryRepository } from "../../blogs/repositories";
import { CreatePostDto, PostViewType } from "../types";
import { BlogViewType } from "../../blogs/types";
import { database } from "../../../db";
import { postsQueryRepository } from "./posts.query-repository";

export const postRepository = {
    async create(post: CreatePostDto) {
        const blog = await blogsQueryRepository.find(new ObjectId(post.blogId));
        const newPost = {
            title: post.title,
            content: post.content,
            shortDescription: post.shortDescription,
            createdAt: new Date().toISOString(),
            blogId: post.blogId,
            blogName: (blog as BlogViewType).name,
        };
        const response = await (
            await database.getCollection("POSTS")
        ).insertOne(newPost);
        return await postsQueryRepository.findById(response.insertedId);
    },
    async update(post: CreatePostDto, id: string) {
        const updatedPost = await postsQueryRepository.findById(
            new ObjectId(id),
        );
        const newPost = {
            ...(updatedPost as PostViewType),
            ...post,
        };
        await (
            await database.getCollection("POSTS")
        ).updateOne({ _id: id }, { $set: newPost });
    },
    async delete(id: string) {
        await (
            await database.getCollection("POSTS")
        ).deleteOne({
            _id: new ObjectId(id),
        });
    },
};
