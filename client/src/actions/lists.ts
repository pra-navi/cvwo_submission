import { CREATE_LIST, FETCH_LIST, SAVE_POST, REMOVE_POST, DONE_POST, FETCH_TITLES, FETCH_POINT } from '../constants/actionTypes.ts';
import * as api from '../api/index.ts';

export const createList = (newList) => async (dispatch) => {
    try {
        const { data } = await api.createList(newList);
        dispatch({ type: CREATE_LIST, data });
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log(error.response.data.message);
        } else {
            console.log(error);
            console.log('An error occurred. Please try again.');
        } 
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
    } catch (error) {
        console.log(error);
    }
};

export const removePost = (postId, listObj) => async (dispatch) => {
    try {
        const { data } = await api.removePost(postId, listObj);
        dispatch({ type: REMOVE_POST, payload: data });
    } catch (error) {
        console.log(error);
    }
};

export const donePost = (postId, listObj) => async (dispatch) => {
    try {
        const { data } = await api.donePost(postId, listObj);
        dispatch({ type: DONE_POST, payload: data });
    } catch (error) {
        console.log(error);
    }
};

export const getTitles = (listId) => async (dispatch) => {
    try {
        const { data } = await api.fetchTitles(listId);
        dispatch({ type: FETCH_TITLES, payload: data });
    } catch (error) {
        console.log(error);
    }
};

export const getPoint = (userId) => async (dispatch) => {
    try {
        const { data } = await api.fetchPoint(userId);
        dispatch({ type: FETCH_POINT, payload: data });
    } catch (error) {
        console.log(error);
    }
};