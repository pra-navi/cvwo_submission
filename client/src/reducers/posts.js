import { FETCH_POST_TITLE, FETCH_ALL, FETCH_BY_SEARCH, FETCH_BY_CREATOR, FETCH_POST, CREATE, UPDATE, DELETE, LIKE, DISLIKE, START_LOADING, END_LOADING, COMMENT } from '../constants/actionTypes';

const postReducer = (state = { isLoading: true, posts: [], title: 'loading title...' }, action) => {
    switch (action.type) {
        case START_LOADING:
            return { ...state, isLoading: true };
        case END_LOADING:
            return { ...state, isLoading: false };
        case CREATE:
            return { ...state, posts: [...state.posts, action.payload] };
        case DISLIKE:
            return { ...state, posts: state.posts.map((post) => post._id === action.payload._id ? action.payload : post) };
        case LIKE:
            return { ...state, posts: state.posts.map((post) => post._id === action.payload._id ? action.payload : post) };
        case COMMENT:
            return { ...state, posts: state.posts.map((post) => post._id === action.payload._id ? action.payload : post) };
        case DELETE:
            return { ...state, posts: state.posts.filter((post) => post._id !== action.payload) };
        case UPDATE:
            return { ...state, posts: state.posts.map((post) => post._id === action.payload._id ? action.payload : post) };
        case FETCH_ALL:
            return {
                ...state,
                posts: action.payload.data,
                currentPage: action.payload.currentPage,
                numberOfPages: action.payload.numberOfPages,
            };
        case FETCH_BY_SEARCH:
            return { ...state, posts: action.payload };
        case FETCH_BY_CREATOR:
            return { ...state, posts: action.payload.data };
        case FETCH_POST:
            return { ...state, post: action.payload };
        case FETCH_POST_TITLE:
            var titleArray = JSON.parse(localStorage.getItem('title'));
            if (titleArray === null) {titleArray = [];}
            titleArray.push([action.payload.id, action.payload.data]);
            localStorage.setItem('title', JSON.stringify(titleArray));
            return { ...state, title: action.data};
        default:
            return state;
    }
};

export default postReducer;