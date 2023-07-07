import { CREATE_LIST, DELETE_LIST, EDIT_LIST } from '../constants/actionTypes';

const listReducer = (state = { titles: [] }, action) => {
    let profile = JSON.parse(localStorage.getItem('profile'));
    switch (action.type) {
        case CREATE_LIST:
        case EDIT_LIST: 
            if(profile?.result?.myLists) {profile.result.myLists = action?.data;};
            localStorage.setItem('profile', JSON.stringify({ ...profile }));
            return state;
        default:
            return state;
    }
};

export default listReducer;