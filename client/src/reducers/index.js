import { combineReducers } from "redux";

import posts from "./posts";
import auth from "./auth";
import lists from "./lists";

const reducers = combineReducers({ posts, auth, lists });

export default reducers;

