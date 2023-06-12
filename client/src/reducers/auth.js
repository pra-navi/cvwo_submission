import { AUTH, LOGOUT, FETCH_USER, START_LOADING, END_LOADING } from '../constants/actionTypes';

const authReducer = (state = { authData: null, isLoading: true, user: null }, action) => {
    switch (action.type) {
        case START_LOADING:
            return { ...state, isLoading: true };
        case END_LOADING:
            return { ...state, isLoading: false };
        case AUTH:
            localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
            return { ...state, authData: action?.data };
        case LOGOUT:
            localStorage.clear();
            return { ...state, authData: null };
        case FETCH_USER: 
            return { ...state, user: action.payload };
        default:
            return state;
    }
};

export default authReducer;