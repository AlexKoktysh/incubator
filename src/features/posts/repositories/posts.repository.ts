import { ObjectId } from "mongodb";
import { blogsQueryRepository } from "../../blogs/repositories";
import { CreatePostDto, PostDbType, PostViewType } from "../types";
import { BlogViewType } from "../../blogs/types";
import { database } from "../../../db";
import { postsQueryRepository } from "./posts.query-repository";
import { createPost } from "../helpers";

export const postRepository = {
    async create(post: CreatePostDto) {
        const blog = await blogsQueryRepository.find(post.blogId);
        await database.getCollection("POSTS");
        const newPost = createPost(post, (blog as BlogViewType).name);
        const response = await (
            await database.getCollection("POSTS")
        ).insertOne(newPost as PostDbType);
        return await postsQueryRepository.findById(response.insertedId);
    },
    async update(post: CreatePostDto, id: string) {
        const updatedPost = await postsQueryRepository.findById(
            new ObjectId(id),
        );
        const newPost: Partial<PostDbType> = {
            ...(updatedPost as PostViewType),
            ...post,
            blogId: new ObjectId(updatedPost?.blogId),
        };
        await (
            await database.getCollection("POSTS")
        ).updateOne({ _id: new ObjectId(id) }, { $set: newPost });
    },
    async delete(id: string) {
        await (
            await database.getCollection("POSTS")
        ).deleteOne({
            _id: new ObjectId(id),
        });
    },
};
