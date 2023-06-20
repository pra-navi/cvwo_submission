import { FETCH_POST_TITLE, FETCH_ALL, FETCH_BY_SEARCH, FETCH_BY_CREATOR, FETCH_POST, START_LOADING, END_LOADING, CREATE, UPDATE, DELETE, LIKE, DISLIKE, COMMENT, UPDATEAVERAGE } from '../constants/actionTypes';
import * as api from '../api';

// Action Creators- functions that return actions
export const getPost = (id) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data } = await api.fetchPost(id);
        
        dispatch({ type: FETCH_POST, payload: data });
        dispatch({ type: END_LOADING });
    } catch (error) {
        console.log(error.message);
    }
};

export const getPostTitle = (id) => async (dispatch) => {
    try {
        let { data } = await api.fetchPostTitle(id);
        //console.log(data); //check the title
        
        dispatch({ type: FETCH_POST_TITLE, payload: {id: id, data: data} });
    } catch (error) {
        console.log(error);
    }
};

export const getPosts = (page) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data } = await api.fetchPosts(page);
        
        dispatch({ type: FETCH_ALL, payload: data });
        dispatch({ type: END_LOADING });
    } catch (error) {
        console.log(error.message);
    }
};

export const getPostsByCreator = (creator) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data: { data } } = await api.fetchPostsByCreator(creator);
    
        dispatch({ type: FETCH_BY_CREATOR, payload: { data } });
        dispatch({ type: END_LOADING });
    } catch (error) {
        console.log(error);
    }
};
  

export const getPostBySearch = (searchQuery) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data: { data } } = await api.fetchPostsBySearch(searchQuery);
        dispatch({ type: FETCH_BY_SEARCH, payload: data });
        dispatch({ type: END_LOADING });
    } catch (error) {
        console.log(error);

    }
}

export const createPost = (post, history) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data } = await api.createPost(post);
        dispatch({ type: CREATE, payload: data });
        history.push(`/posts/${data._id}`);
        // dispatch({ type: END_LOADING }); // no need but not sure
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log(error.response.data.message); // Print the error message to the console
          } else {
            console.log(error);
            console.log('An error occurred. Please try again.');
          } 
    }
};

export const updatePost = (id, post) => async (dispatch) => {
    try {
        const { data } = await api.updatePost(id, post);
        dispatch({ type: UPDATE, payload: data });
    } catch (error) {
        console.log(error.message); // can use console.log(error) if error message not showing where is the problem
    }
};

export const deletePost = (id) => async (dispatch) => {
    try {
        await api.deletePost(id);
        dispatch({ type: DELETE, payload: id });
    } catch (error) {
        console.log(error.message);
    }
};

export const likePost = (id) => async (dispatch) => {
    try {
        const { data } = await api.likePost(id);
        dispatch({ type: LIKE, payload: data });
    } catch (error) {
        console.log(error.message);
    }
};

export const dislikePost = (id) => async (dispatch) => {
    try {
        const { data } = await api.dislikePost(id);
        dispatch({ type: DISLIKE, payload: data });
    } catch (error) {
        console.log(error.message);
    }
};

export const commentPost = (comment, id) => async (dispatch) => {
    try {
        const { data } = await api.commentPost(comment, id);
        dispatch({ type: COMMENT, payload: data });
        return data.comments;
    } catch (error) {
        console.log(error.message);
    }
};



