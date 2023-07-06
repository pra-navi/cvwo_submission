import { CREATE_LIST } from '../constants/actionTypes';

const listReducer = (state = { titles: [] }, action) => {
    let profile = JSON.parse(localStorage.getItem('profile'));
    switch (action.type) {
        case CREATE_LIST:
            console.log(profile.result.myLists[0]);
            console.log(action?.data);
            console.log(action?.data[0]);
            if(profile?.result?.myLists) {profile.result.myLists = action?.data;};
            localStorage.setItem('profile', JSON.stringify({ ...profile }));
            return state;
        default:
            return state;
    }
};

export default listReducer;