import { AUTH, FETCH_USER, SAVE_POST, DONE_POST, CHANGE_PRIVACY } from '../constants/actionTypes';
import * as api from '../api';

export const changePrivacy = () => async (dispatch) => {
    try {
        const { data } = await api.changePrivacy(); //now data is listsArePrivacy
        dispatch({ type: CHANGE_PRIVACY, data });
    } catch (error) {
        console.log(error.message);
    }
};

export const savePost = (postId) => async (dispatch) => {
    try {
        const { data } = await api.savePost(postId); //now data changed to learning list
        dispatch({ type: SAVE_POST, data });
    } catch (error) {
        console.log(error.message);
    }
};

export const donePost = (postId) => async (dispatch) => {
    try {
        const { data } = await api.donePost(postId); //now data changed to done list
        dispatch({ type: DONE_POST, data });
    } catch (error) {
        console.log(error.message);
    }
};

export const getUser = (id) => async (dispatch) => {
    try {
        // dispatch({ type: START_LOADING });
        const { data } = await api.fetchUser(id);
        
        dispatch({ type: FETCH_USER, payload: data });
        // dispatch({ type: END_LOADING });
    } catch (error) {
        console.log(error.message);
    }
};

export const googleLogin = (gglForm, history) => async (dispatch) => {
    try {
        const { data } = await api.googleLogIn(gglForm);
        console.log("google login, action");

        dispatch({ type: AUTH, data });

        history.push('/');
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}

export const login = (formData, history) => async (dispatch) => {
    try {
        const { data } = await api.logIn(formData);

        dispatch({ type: AUTH, data });

        history.push('/');
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}

export const signup = (formData, history) => async (dispatch) => {
    try {
        const { data } = await api.signUp(formData);

        dispatch({ type: AUTH, data });

        history.push('/');
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}