import { SAVE_POST, AUTH, LOGOUT, FETCH_USER, START_LOADING, END_LOADING, DONE_POST, CHANGE_PRIVACY } from '../constants/actionTypes.ts';

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
        case CHANGE_PRIVACY:
            let cprofile = JSON.parse(localStorage.getItem('profile') || '{}'); // or follow lists.ts
            if(cprofile?.result) {cprofile.result.listsArePrivate = action?.data;};
            localStorage.setItem('profile', JSON.stringify({ ...cprofile }));
            return { ...state, authData: cprofile };
        default:
            return state;
    }
};

export default authReducer;