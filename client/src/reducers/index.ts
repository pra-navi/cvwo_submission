import { combineReducers } from "redux";

import posts from "./posts.ts";
import auth from "./auth.ts";
import lists from "./lists.ts";

const reducers = combineReducers({ posts, auth, lists });

export default reducers;
