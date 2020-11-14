import React from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import PostEditForm from "../../organism/PostEditForm";
import { POST, postAction } from "../../../../../modules/post";
const { postUpdated } = postAction;

function PostEditSection() {
  const { postId } = useParams();
  const dispatch = useDispatch();

  const post = useSelector((state) =>
    state[POST].find((post) => post.id === postId)
  );

  const postupdateFlow = (formData) => {
    dispatch(postUpdated(formData));
  };

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  return (
    <section>
      <h2>Edit Post</h2>
      <PostEditForm data={post} postUpdate={postupdateFlow} />
    </section>
  );
}

export default PostEditSection;
