import { configureStore } from '@reduxjs/toolkit';
import postReducer from './reducers/posts.ts';
import listReducer from './reducers/lists.ts';
import authReducer from './reducers/auth.ts';

export const store = configureStore({
  reducer: {
    posts: postReducer,
    lists: listReducer,
    auth: authReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, lists: ListsState, auth: AuthState}
export type AppDispatch = typeof store.dispatch