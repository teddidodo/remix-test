import { db } from "~/utils/db.server";
// app/models/post.server.ts
let posts: Post[] = [];
  
  export type Post = {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
  };
  
  export async function getPosts(): Promise<Post[]> {
    return await db.post.findMany({
      orderBy: { createdAt: "desc" },
    });
  }
  
  export async function getPost(id: string): Promise<Post | undefined> {
    if (isNaN(Number(id))) {
      return undefined;
    }

    const post = await db.post.findUnique({
      where: { id: Number(id) },
    });
    return post ?? undefined;
  }
  
  export async function createPost(post: Omit<Post, "id" | "createdAt">): Promise<Post> 
  {
    const newPost = {
      ...post,
      id: Date.now(),
      createdAt: new Date(),
    };
    posts.push(newPost);
    await db.post.create({
      data: { title: post.title, content: post.content },
    });

    return newPost;
  }
  
  export async function updatePost(id: string, updates: Partial<Omit<Post, "id" | "createdAt">>): Promise<Post | null> 
  {
    if (isNaN(Number(id))) {
      return null;
    }
    const post = await db.post.update({
      where: { id: Number(id) },
      data: updates,
    });
    return post
  }
  
  export async function deletePost(id: string): Promise<boolean> 
  {
    if (isNaN(Number(id))) {
      return false;
    }
    await db.post.delete({
      where: { id: Number(id) },
    });
    return true;
  }