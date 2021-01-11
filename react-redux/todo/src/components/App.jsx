import React from "react"
import { HashRouter as Router, Route } from "react-router-dom"
import Home from "../routes/Home"
import HomeToolkit from "../routes/HomeToolkit"
import Detail from "../routes/Detail"

function App() {
  return (
    <Router>
      {/* <Route path="/" exact component={Home}></Route> */}
      <Route path="/" exact component={HomeToolkit}></Route>
      <Route path="/:id" component={Detail}></Route>
    </Router>
  );
}

export default App