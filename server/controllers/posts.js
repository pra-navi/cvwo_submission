//create all handlers for routes
import mongoose from 'mongoose';

import PostMessage from '../models/postMessage.js';

export const getPosts = async (req, res) => {
    const { page } = req.query;

    try {
        const LIMIT = 8; // number of post per page
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
        const total = await PostMessage.countDocuments({}); // count how many pages

        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        //console.log(postMessages);
        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;


    try {
        const title = new RegExp(searchQuery, 'i');

        const posts = await PostMessage.find({ $or: [{ title }, { tags: { $in: tags.split(',') } }] });
        //res.status(200).json({ data: posts });
        res.json({ data: posts });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPostsByCreator = async (req, res) => {
    const { creator } = req.query;

    try {
        const posts = await PostMessage.find({ creator });

        res.json({ data: posts });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const getPost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);

        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) => {
    const {title, message, tags} = req.body;

    if (!title || !message || !tags) {
        const errorMessage = 'Please fill in all fields.';
        console.log(errorMessage);
        return res.status(400).json({ message: errorMessage });
    }

    const newPost = new PostMessage({ ...req.body, creator: req.userId, createdAt: new Date().toISOString() });
    try {
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;

    //if id is not valid, return error
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');
    //if id is valid, find post by id and update it
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id }, { new: true });
    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');
    await PostMessage.findByIdAndRemove(id);
    res.json({ message: 'Post deleted successfully' });
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) return res.json({ message: 'Unauthenticated' });

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');
    const post = await PostMessage.findById(id);
    const index = post.likes.findIndex((id) => id === String(req.userId));
    if(index === -1) {
        post.likes.push(req.userId);
    } else {
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    res.json(updatedPost);
}

export const dislikePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) return res.json({ message: 'Unauthenticated' });

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');
    const post = await PostMessage.findById(id);
    const index = post.dislikes.findIndex((id) => id === String(req.userId));
    if(index === -1) {
        post.dislikes.push(req.userId);
    } else {
        post.dislikes = post.dislikes.filter((id) => id !== String(req.userId));
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    res.json(updatedPost);
}

export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { value, rating, name } = req.body;

    try {
        const post = await PostMessage.findById(id);

        const newComment = {
            message: value,
            rating: parseInt(rating),
            name
        };

        post.comments.push(newComment);

        const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

        res.json(updatedPost);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


export const getPostTitle = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);

        res.status(200).json(post.title);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}