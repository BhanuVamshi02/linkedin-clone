import { combineReducers } from "redux";

import userReducer from "./userReducer.jsx";
import articleReducer from "./articleReducer.jsx";

const rootReducer = combineReducers({
  userState: userReducer,
  articleState: articleReducer,
});

export default rootReducer;
