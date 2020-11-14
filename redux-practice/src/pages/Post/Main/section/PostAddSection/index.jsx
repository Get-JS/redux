import React from "react";
import { useDispatch, useSelector } from "react-redux";

import PostAddForm from "../../../../../components/organism/PostAddForm";
import { USER } from "../../../../../modules/user";
import { postAction } from "../../../../../modules/post";
const { postAdded } = postAction;

function PostAddSection() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state[USER]);

  const postAddFlow = (formData) => {
    dispatch(postAdded(formData));
  };

  return (
    <section>
      <h2>Add a New Post</h2>
      <PostAddForm users={users} postAdd={postAddFlow} />
    </section>
  );
}

export default PostAddSection;
