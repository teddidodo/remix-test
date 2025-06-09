import { json, redirect, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { getPost, updatePost } from "~/models/post.server";

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.id) {
    throw new Response("Post ID is required", { status: 400 });
  }
  
  const post = await getPost(params.id);
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ post });
}

export async function action({ request, params }: ActionFunctionArgs) {
  if (!params.id) {
    throw new Response("Post ID is required", { status: 400 });
  }

  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");

  const errors: Record<string, string> = {};

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    errors.title = "Title is required";
  }

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    errors.content = "Content is required";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  const updatedPost = await updatePost(params.id, { 
    title: title?.toString().trim(), 
    content: content?.toString().trim()
  });

  if (!updatedPost) {
    throw new Response("Post not found", { status: 404 });
  }

  return redirect(`/posts/${params.id}`);
}

export default function EditPost() {
  const { post } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <header className="header">
        <div className="container">
          <h1>Edit Post</h1>
        </div>
      </header>

      <div className="container">
        <div className="card">
          <Form method="post">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                defaultValue={post.title}
                required
              />
              {actionData?.errors?.title && (
                <div style={{ color: "#dc2626", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                  {actionData.errors.title}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                name="content"
                className="form-control"
                defaultValue={post.content}
                required
              />
              {actionData?.errors?.content && (
                <div style={{ color: "#dc2626", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                  {actionData.errors.content}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button type="submit" className="btn">
                Update Post
              </button>
              <Link to={`/posts/${post.id}`} className="btn" style={{ background: "#6b7280" }}>
                Cancel
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}