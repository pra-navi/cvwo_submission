import { AUTH, FETCH_USER, SAVE_POST, DONE_POST, CHANGE_PRIVACY } from '../constants/actionTypes.ts';
import * as api from '../api/index.ts';
import { AnyAction, Dispatch } from 'redux';

export const changePrivacy = () => async (dispatch) => {
    try {
        const { data } = await api.changePrivacy(); //now data is listsArePrivacy
        dispatch({ type: CHANGE_PRIVACY, data });
    } catch (error) {
        console.log(error.message);
    }
};

export const getUser = (id) => async (dispatch) => {
    try {
        const { data } = await api.fetchUser(id);
        
        dispatch({ type: FETCH_USER, payload: data });
    } catch (error) {
        console.log(error.message);
    }
};

export const login = (formData: any, history: any) => async (dispatch: Dispatch<AnyAction>) => {
    try {
        const { data } = await api.logIn(formData);
        dispatch({ type: AUTH, data } as const);

        history.push('/');
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}

export const signup = (formData: any, history: any) => async (dispatch: Dispatch<AnyAction>) => {
    try {
        const { data } = await api.signUp(formData);

        dispatch({ type: AUTH, data } as const);

        history.push('/');
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}