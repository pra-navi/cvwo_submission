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
  const profileString = localStorage.getItem('profile');
  
  if (profileString) {
      const profile = JSON.parse(profileString);
      if (profile && profile.token) {
          req.headers.Authorization = `Bearer ${profile.token}`;
      }
  }

  return req;
});

export const fetchPost = (id) => API.get(`/posts/${id}`);
export const fetchPosts = (page) => API.get(`/posts?page=${page}`);
export const fetchPostsByCreator = (creator) => API.get(`/posts/creator?creator=${creator}`);
export const fetchPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search}&tags=${searchQuery.tags}&sort=${searchQuery.sort}`);
export const createPost = (newPost) => API.post('/posts', newPost);
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
export const dislikePost = (id) => API.patch(`/posts/${id}/dislikePost`);

export const commentPost = (comment, id) => API.post(`/posts/${id}/commentPost`, { value: comment.message, rating: comment.rating, name: comment.name });
export const fetchPostTitle = (id) => API.get(`/posts/${id}/getPostTitle`);

export const logIn = (formData) => API.post('/user/login', formData);
export const signUp = (formData) => API.post('/user/signup', formData);
export const fetchUser = (id) => API.get(`/user/profile/${id}`);

export const createList = (newList) => API.post(`/list/createList`, newList);
export const fetchList = (listId) => API.get(`/list/${listId}`);

export const savePost = (postId, listObj) => API.patch(`/list/savePost/${postId}`, listObj);
export const removePost = (postId, listObj) => API.patch(`/list/removePost/${postId}`, listObj);
export const donePost = (postId, listObj) => API.patch(`/list/donePost/${postId}`, listObj);

export const fetchTitles = (listId) => API.get(`/list/getTitles/${listId}`);
export const fetchPoint = (userId) => API.get(`/list/getPoint/${userId}`);

export const changePrivacy = () => API.patch(`/user/profileSetting`);