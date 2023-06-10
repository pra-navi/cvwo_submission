import axios from 'axios';

let baseURL;
if (process.env.NODE_ENV === 'development') {
  baseURL = process.env.REACT_APP_API_BASE_URL_LOCAL;
} else {
  baseURL = process.env.REACT_APP_API_BASE_URL_VERCEL;
}

const API = axios.create({ baseURL: baseURL });

API.interceptors.request.use((req) => {
    if(localStorage.getItem('profile')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    } 
    return req;
});

export const fetchPosts = (page) => API.get(`/posts?page=${page}`);
export const fetchPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`);
export const createPost = (newPost) => API.post('/posts', newPost);
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
export const dislikePost = (id) => API.patch(`/posts/${id}/dislikePost`);

export const logIn = (formData) => API.post('/user/login', formData);
export const signUp = (formData) => API.post('/user/signup', formData);