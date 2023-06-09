import { FETCH_ALL, FETCH_BY_SEARCH, CREATE, UPDATE, DELETE, LIKE, DISLIKE } from '../constants/actionTypes';

const postReducer = (state = [], action) => {
    switch (action.type) {
        case DISLIKE:
            return state.map((post) => post._id === action.payload._id ? action.payload : post);
        case LIKE:
            return state.map((post) => post._id === action.payload._id ? action.payload : post);
        case DELETE:
            return state.filter((post) => post._id !== action.payload);
        case UPDATE:
            return state.map((post) => post._id === action.payload._id ? action.payload : post);
        case FETCH_ALL:
            return {
                ...state,
                posts: action.payload.data,
                currentPage: action.payload.currentPage,
                numberOfPages: action.payload.numberOfPages,
            };
        case FETCH_BY_SEARCH:
            return {
                ...state,
                posts: action.payload
            };
        case CREATE:
            return [...state, action.payload];
        default:
            return state;
    }
};

export default postReducer;