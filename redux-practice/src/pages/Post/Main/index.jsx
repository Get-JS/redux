import React from "react";

import Foundation from "../Templates/Foundation";
import PostAddSection from "./section/PostAddSection";
import PostListSection from "./section/PostListSection";

function PostMainPage() {
  return (
    <Foundation>
      <PostAddSection />
      <PostListSection />
    </Foundation>
  );
}

export default PostMainPage;
