import { ObjectId } from "mongodb";
import { PostDbType } from "../../db/post-db.type";
import { BlogsMongoRepository } from "../blogs/BlogMongoRepository";
import { CreatePostDto, PostType } from "./types";
import { postCollection } from "../../db/mongo-db";

export const PostsMongoRepository = {
    async create(post: CreatePostDto) {
        const blog = await BlogsMongoRepository.find(post.blogId);
        if (!blog) return null;
        const newPost: PostDbType = {
            id: new ObjectId().toString(),
            title: post.title,
            content: post.content,
            shortDescription: post.shortDescription,
            createdAt: new Date().toISOString(),
            blogId: post.blogId,
            blogName: blog.name,
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
    async findAndMap(id: string) {
        const post = await this.find(id);
        if (post) return this.map(post);
        return null;
    },
    async getAll() {
        const posts = await postCollection
            .find({}, { projection: { _id: 0 } })
            .toArray();
        return posts.map((p) => this.map(p));
    },
    async del(id: string) {
        const findPost = await this.find(id);
        if (findPost) {
            await postCollection.deleteOne({
                id: id,
            });
            return findPost;
        }
        return null;
    },
    async put(post: CreatePostDto, id: string) {
        const blog = await BlogsMongoRepository.find(post.blogId)!;
        const updatedPost = await this.find(id);
        if (blog && updatedPost) {
            const newPost = {
                ...updatedPost,
                ...post,
            };
            await postCollection.updateOne({ id: id }, { $set: newPost });
            return updatedPost;
        }
        return null;
    },
    map(post: PostDbType) {
        const postForOutput: PostType = {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
        };
        return postForOutput;
    },
};
