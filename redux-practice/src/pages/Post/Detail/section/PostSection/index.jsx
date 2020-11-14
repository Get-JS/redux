import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import PostAuthor from "../../../../../components/organism/PostAuthor";
import TimeAgo from "../../../../../components/organism/TimeAgo";
import ReactionButtonList from "../../../../../components/organism/ReactionButtonList";
import { POST, postAction } from "../../../../../modules/post";
import { USER } from "../../../../../modules/user";
const { reactionAdded } = postAction;

function PostSection() {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const post = useSelector((state) =>
    state[POST].find((post) => post.id === postId)
  );
  const author = useSelector((state) =>
    state[USER].find((user) => user.id === post.user)
  );
  const reactionAddFlow = (formData) => {
    dispatch(reactionAdded(formData));
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
      <article className="post">
        <h2>{post.title}</h2>
        <div>
          <PostAuthor author={author} />
          <TimeAgo timestamp={post.date} />
        </div>
        <p className="post-content">{post.content}</p>
        <ReactionButtonList post={post} reactionAdd={reactionAddFlow} />
        <Link to={`/editPost/${post.id}`} className="button">
          Edit Post
        </Link>
      </article>
    </section>
  );
}

export default PostSection;
