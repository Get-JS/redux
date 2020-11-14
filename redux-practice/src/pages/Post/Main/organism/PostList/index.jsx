import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import PostAuthor from "../../../../../components/organism/PostAuthor";
import TimeAgo from "../../../../../components/organism/TimeAgo";
import ReactionButtonList from "../../../../../components/organism/ReactionButtonList";
import { postAction } from "../../../../../modules/post";
import { USER } from "../../../../../modules/user";
const { reactionAdded } = postAction;

function PostsList({ data }) {
  const dispatch = useDispatch();
  // Sort posts in reverse chronological order by datetime string
  const orderedPosts = data
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));
  const author = useSelector((state) => state[USER]);
  const reactionAddFlow = (formData) => {
    dispatch(reactionAdded(formData));
  };

  return (
    <>
      {orderedPosts?.map((post) => (
        <article className="post-excerpt" key={post.id}>
          <h3>{post.title}</h3>
          <div>
            <PostAuthor author={author[post.user]} />
            <TimeAgo timestamp={post.date} />
          </div>
          <p className="post-content">{post.content.substring(0, 100)}</p>
          <ReactionButtonList post={post} reactionAdd={reactionAddFlow} />
          <Link to={`/posts/${post.id}`} className="button muted-button">
            View Post
          </Link>
        </article>
      ))}
    </>
  );
}

export default PostsList;
