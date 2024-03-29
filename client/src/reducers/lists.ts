import { CREATE_LIST, FETCH_LIST, REMOVE_POST, SAVE_POST, DONE_POST, FETCH_TITLES, FETCH_POINT } from '../constants/actionTypes.ts';

const listReducer = (state = { list: null, titles: null, point: 0 }, action) => {
    let profileString = localStorage.getItem('profile');
    let profile = profileString ? JSON.parse(profileString) : null;
    switch (action.type) {
        case FETCH_TITLES:
            return {...state, titles: action.payload};
        case CREATE_LIST:
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