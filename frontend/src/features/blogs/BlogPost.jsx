import { useState, useEffect } from "react";
import * as Blog from "../../api/blog";
import * as Users from "../../api/users";
import { useAuthentication } from "../authentication";

export function BlogPost({ name, title }) {
  const [user, login, logout, refresh] = useAuthentication();
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    Blog.getAll().then(async (blogPosts) => {
      const blogPostsWithExtraDataPromises = blogPosts.map(async (blogPost) => {
        const user = await Users.getUserById(blogPost.user_id);

        return Promise.resolve({
          id: blogPost.id,
          date: new Date(blogPost.date).toLocaleDateString(),
          time: blogPost.time,
          user_id: blogPost.user_id,
          title: blogPost.title,
          content: blogPost.content,
          user,
        });
      });

      const blogPostsWithExtraData = await Promise.all(
        blogPostsWithExtraDataPromises
      );
      // setBlogPosts(blogPosts)
      setBlogPosts(blogPostsWithExtraData);
    });
  }, [blogPosts]);

  return (
    <>
      {blogPosts.map((post) => {
        return (
          <div
            className="collapse shadow-lg collapse-arrow border border-base-300 bg-base-100 m-auto md:w-96"
            key={post.id}
          >
            <input type="checkbox" />
            <div className="collapse-title text-xl font-semibold">
              {" "}
              {post.title}
              <div className="block text-sm pt-4">
                <div className="avatar">
                  <div className="w-6 rounded-full mr-2">
                    <img
                      src="avatar-icon.jpg"
                      alt="Tailwind-CSS-Avatar-component"
                    />
                  </div>
                </div>
                <span className="text-xs font-medium">
                  {post.user.first_name + " " + post.user.last_name}
                </span>
              </div>
            </div>

            <div className="collapse-content">{post.content}</div>
          </div>
        );
      })}
    </>
  );
}
