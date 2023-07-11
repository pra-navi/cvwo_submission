import { CREATE_LIST, DELETE_LIST, EDIT_LIST, FETCH_LIST, SAVE_POST } from '../constants/actionTypes';
import * as api from '../api';

export const createList = (newList) => async (dispatch) => {
    try {
        const { data } = await api.createList(newList);
        dispatch({ type: CREATE_LIST, data });
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log(error.response.data.message); // Print the error message to the console
        } else {
            console.log(error);
            console.log('An error occurred. Please try again.');
        } 
    }
};

export const deleteList = (listId) => async (dispatch) => {
    try {
        const { data } = await api.deleteList(listId);
        dispatch({ type: DELETE_LIST, data });
    } catch (error) {
        console.log(error);
    }
};

export const editList = (updateList) => async (dispatch) => {
    try {
        const { data } = await api.editList(updateList);
        dispatch({ type: EDIT_LIST, data });
    } catch (error) {
        console.log(error);
    }
};

export const getList = (listId) => async (dispatch) => {
    try {
        const { data } = await api.fetchList(listId);
        dispatch({ type: FETCH_LIST, payload: data });
    } catch (error) {
        console.log(error.message);
    }
};

export const savePost = (postId, listObj) => async (dispatch) => {
    try {
        const { data } = await api.savePost(postId, listObj);
        dispatch({ type: SAVE_POST, data });
        console.log("action2");
    } catch (error) {
        console.log(error);
    }
};