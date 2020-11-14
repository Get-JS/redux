import React from "react";

function PostAuthor({ author }) {
  return <span>by {author ? author.name : "Unknown author"}</span>;
}

export default PostAuthor;
