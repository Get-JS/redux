import React from "react";
import { useSelector } from "react-redux";

import PostList from "../../organism/PostList";
import { POST } from "../../../../../modules/post";

function PostAddSection() {
  const posts = useSelector((state) => state[POST]);

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      <PostList data={posts} />
    </section>
  );
}

export default PostAddSection;
