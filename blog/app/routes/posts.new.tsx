// app/routes/posts.new.tsx
import { PrismaClient } from "@prisma/client";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { createPost } from "~/models/post.server";
export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const title = formData.get("title") ?? "";
  const content = formData.get("content") ?? "";

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
  await createPost({ title: title.toString().trim(), content: content.toString().trim() });
  return redirect("/");
}

export default function NewPost() {
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <header className="header">
        <div className="container">
          <h1>Create New Post</h1>
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
                Create Post
              </button>
              <Link to="/" className="btn" style={{ background: "#6b7280" }}>
                Cancel
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}