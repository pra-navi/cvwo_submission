import { CREATE_LIST, DELETE_LIST, EDIT_LIST, FETCH_LIST, REMOVE_POST, SAVE_POST, DONE_POST, FETCH_TITLES, FETCH_POINT } from '../constants/actionTypes';

const listReducer = (state = { list: null, titles: null, point: 0 }, action) => {
    let profile = JSON.parse(localStorage.getItem('profile'));
    switch (action.type) {
        case FETCH_TITLES:
            return {...state, titles: action.payload};
        case CREATE_LIST:
        case DELETE_LIST:
        case EDIT_LIST: 
            if(profile?.result?.myLists) {profile.result.myLists = action?.data;};
            localStorage.setItem('profile', JSON.stringify({ ...profile }));
            return state;
        case FETCH_LIST:
        case DONE_POST:
        case REMOVE_POST:
            return { ...state, list: action.payload };
        case FETCH_POINT:
            return { ...state, point: action.payload };
        case SAVE_POST:
        default:
            return state;
    }
};

export default listReducer;