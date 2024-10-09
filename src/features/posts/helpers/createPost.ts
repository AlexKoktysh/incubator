import { ObjectId } from "mongodb";
import { CreatePostDto, PostDbType } from "../types";

export const createPost = (
    { title, content, shortDescription, blogId }: CreatePostDto,
    blogName: string,
): Partial<PostDbType> => {
    const newPost: Partial<PostDbType> = {
        title,
        content,
        shortDescription,
        createdAt: new Date().toISOString(),
        blogId: new ObjectId(blogId),
        blogName,
    };
    return newPost;
};
