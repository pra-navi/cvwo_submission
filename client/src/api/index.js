import axios from 'axios';
/*
let baseURL;
if (process.env.NODE_ENV === 'development') {
  baseURL = process.env.REACT_APP_API_BASE_URL_LOCAL;
} else {
  baseURL = process.env.REACT_APP_API_BASE_URL_VERCEL;
}

const API = axios.create({ baseURL: baseURL });
*/
const API = axios.create({ baseURL: 'http://localhost:5000' }); // cy local

API.interceptors.request.use((req) => {
    if(localStorage.getItem('profile')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    } 
    return req;
});

export const fetchPost = (id) => API.get(`/posts/${id}`);
export const fetchPosts = (page) => API.get(`/posts?page=${page}`);
export const fetchPostsByCreator = (creator) => API.get(`/posts/creator?creator=${creator}`);
export const fetchPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search}&tags=${searchQuery.tags}`);
export const createPost = (newPost) => API.post('/posts', newPost);
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
export const dislikePost = (id) => API.patch(`/posts/${id}/dislikePost`);

export const commentPost = (comment, id) => API.post(`/posts/${id}/commentPost`, { value: comment.message, rating: comment.rating, name: comment.name });
export const fetchPostTitle = (id) => API.get(`/posts/${id}/getPostTitle`);

export const googleLogIn = (formData) => API.post('/user/googleLogin', formData);
export const logIn = (formData) => API.post('/user/login', formData);
export const signUp = (formData) => API.post('/user/signup', formData);
export const fetchUser = (id) => API.get(`/user/profile/${id}`);
/*
export const savePost = (postId) => API.patch(`/user/savePost/${postId}`);
export const donePost = (postId) => API.patch(`/user/donePost/${postId}`);
*/
export const changePrivacy = (postId) => API.patch(`/user/changePrivacy`);