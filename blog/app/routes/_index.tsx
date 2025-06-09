import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPosts } from "~/models/post.server";

export async function loader() {
  const posts = await getPosts();
  return json({ posts });
}

export default function Index() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <div>
      <header className="header">
        <div className="container">
          <h1>My Simple Blog</h1>
        </div>
      </header>
      
      <div className="container">
        <div style={{ marginBottom: "2rem", textAlign: "right" }}>
          <Link to="/posts/new" className="btn">
            New Post
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="card">
            <p>No posts yet. <Link to="/posts/new">Create your first post!</Link></p>
          </div>
        ) : (
          posts.map((post) => (
            <article key={post.id} className="card">
              <h2>
                <Link 
                  to={`/posts/${post.id}`}
                  style={{ color: "#2563eb", textDecoration: "none" }}
                >
                  {post.title}
                </Link>
              </h2>
              <div className="post-meta">
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
              <p>{post.content.substring(0, 200)}...</p>
              <div className="post-actions">
                <Link to={`/posts/${post.id}`} className="btn">
                  Read More
                </Link>
                <Link to={`/posts/${post.id}/edit`} className="btn">
                  Edit
                </Link>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}