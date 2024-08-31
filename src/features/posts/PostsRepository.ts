import { ObjectId } from "mongodb";
import { db, setDB } from "../../db/db";
import { PostDbType } from "../../db/post-db.type";
import { BlogsMongoRepository as BlogsRepository } from "../blogs/BlogMongoRepository";
import { CreatePostDto, PostType } from "./types";

export const PostsRepository = {
    async create(post: CreatePostDto) {
        const blog = await BlogsRepository.find(post.blogId);
        if (!blog) return null;
        const newPost: PostDbType = {
            id: new Date().toISOString() + Math.random(),
            title: post.title,
            content: post.content,
            shortDescription: post.shortDescription,
            createdAt: new Date().toISOString(),
            blogId: post.blogId,
            blogName: blog.name,
        };
        setDB({ posts: [...db.posts, newPost] });
        // db.posts = [...db.posts, newPost];
        return newPost.id;
    },
    find(id: string) {
        return db.posts.find((p) => p.id === id);
    },
    findAndMap(id: string) {
        const post = this.find(id)!;
        return this.map(post);
    },
    getAll() {
        return db.posts.map((p) => this.map(p));
    },
    del(id: string) {
        const findPost = this.find(id);
        if (findPost) {
            setDB({
                posts: db.posts.filter((post) => post.id !== id),
            });
            return findPost;
        }
        return null;
    },
    async put(post: CreatePostDto, id: string) {
        const newPost = await BlogsRepository.find(post.blogId)!;
        const updatedPost = PostsRepository.find(id);
        if (newPost && updatedPost) {
            db.posts = db.posts.map((p) =>
                p.id === id ? { ...p, ...post, blogName: newPost.name } : p,
            );
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
