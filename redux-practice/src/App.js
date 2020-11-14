import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import PostMainPage from "./pages/Post/Main";
import PostDetailPage from "./pages/Post/Detail";
import PostEditPage from "./pages/Post/Edit";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={PostMainPage} />
          <Route exact path="/posts/:postId" component={PostDetailPage} />
          <Route exact path="/editPost/:postId" component={PostEditPage} />
          <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
