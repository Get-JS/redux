import { combineReducers } from "redux";
import { POST, postReducer } from "./post";
import { USER, userReducer } from "./user";

const rootReducer = combineReducers({
  [POST]: postReducer,
  [USER]: userReducer,
});

export default rootReducer;
