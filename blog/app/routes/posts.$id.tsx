import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { getPost, deletePost } from "~/models/post.server";
import { redirect } from "@remix-run/node";

export async function loader({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ post });
}

export async function action({ request, params }: { request: Request; params: { id: string } }) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "delete") {
    await deletePost(params.id);
    return redirect("/");
  }

  return null;
}

export default function PostDetail() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <div>
      <header className="header">
        <div className="container">
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            ← Back to Blog
          </Link>
        </div>
      </header>

      <div className="container">
        <article className="card">
          <h1>{post.title}</h1>
          <div className="post-meta">
            Published on {new Date(post.createdAt).toLocaleDateString()}
          </div>
          <div style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}>
            {post.content}
          </div>
          
          <div className="post-actions" style={{ marginTop: "2rem" }}>
            <Link to={`/posts/${post.id}/edit`} className="btn">
              Edit Post
            </Link>
            <Form method="post" style={{ display: "inline" }}>
              <input type="hidden" name="intent" value="delete" />
              <button 
                type="submit" 
                className="btn btn-danger"
                onClick={(e) => {
                  if (!confirm("Are you sure you want to delete this post?")) {
                    e.preventDefault();
                  }
                }}
              >
                Delete Post
              </button>
            </Form>
          </div>
        </article>
      </div>
    </div>
  );
}