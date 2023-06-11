import { AUTH } from '../constants/actionTypes';
import * as api from '../api';

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