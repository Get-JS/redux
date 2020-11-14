import React, { useState } from "react";
import { useHistory } from "react-router-dom";

function PostEditForm({ data, postUpdate }) {
  const [title, setTitle] = useState(data.title);
  const [content, setContent] = useState(data.content);

  const history = useHistory();

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);

  const onSavePost = () => {
    if (title && content) {
      postUpdate({ id: data.id, title, content });
      history.push(`/posts/${data.id}`);
    }
  };

  return (
    <form onSubmit={onSavePost}>
      <label htmlFor="postTitle">Post Title:</label>
      <input
        type="text"
        id="postTitle"
        name="postTitle"
        placeholder="What's on your mind?"
        value={title}
        onChange={onTitleChanged}
      />
      <label htmlFor="postContent">Content:</label>
      <textarea
        id="postContent"
        name="postContent"
        value={content}
        onChange={onContentChanged}
      />
      <button type="submit">Save Post</button>
    </form>
  );
}

export default PostEditForm;
