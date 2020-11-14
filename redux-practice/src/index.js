import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import store from "./modules/store";
import { Provider } from "react-redux";

import "./utils/api/server";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
