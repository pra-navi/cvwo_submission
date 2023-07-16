//create all handlers for routes
import mongoose from 'mongoose';

import PostMessage from '../models/postMessage.js';
import User from '../models/user.js';

export const getPosts = async (req, res) => {
    const { page } = req.query;

    try {
        const LIMIT = 8; // number of post per page
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
        const total = await PostMessage.countDocuments({}); // count how many pages

        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        // console.log(posts[0]);
        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
/* The old one, not as clean as the new one below
export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags, sort } = req.query;

    const sortValue = req.query.sort || '';

    try {
        let posts;

        if (searchQuery && tags) {
            const title = new RegExp(searchQuery, 'i');
            const tagsArray = tags.split(',');
            if (sortValue === 'new' || sortValue === 'old') {
                posts = await PostMessage.find({ $and: [{ $or: [{ title }] }, { tags: { $in: tagsArray } }] }).sort({createdAt:sortValue == "new" ? -1 : 1});
            } else if (sortValue === 'mostliked' || sortValue === 'leastliked') {
                const sortDirection = sortValue === 'mostliked' ? -1 : 1;
                posts = await PostMessage.aggregate([
                    { $match: { $and: [{ $or: [{ title }] }, { tags: { $in: tagsArray } }] } },
                    { $addFields: { likesCount: { $size: '$likes' } } },
                    { $sort: { likesCount: sortDirection } },
                ]);
            } else if (sortValue === 'mostdisliked' || sortValue === 'leastdisliked') {
                const sortDirection = sortValue === 'mostdisliked' ? -1 : 1;
                posts = await PostMessage.aggregate([
                    { $match: { $and: [{ $or: [{ title }] }, { tags: { $in: tagsArray } }] } },
                    { $addFields: { dislikesCount: { $size: '$dislikes' } } },
                    { $sort: { dislikesCount: sortDirection } },
                ]);
            } else if (sortValue == 'highestrating' || 'lowestrating' ) {
                posts = await PostMessage.find({ $and: [{ $or: [{ title }] }, { tags: { $in: tagsArray } }] }).sort({averageRating:sortValue == "lowestrating" ? -1 : 1});
            }
        } else if (tags) { // the logic here: show post if any tag matches in the search (not matches all)
            const tagsArray = tags.split(',');
            if (sortValue === 'new' || sortValue === 'old') {
                posts = await PostMessage.find({ tags: { $in: tagsArray } }).sort({createdAt:sortValue == "new" ? -1 : 1});
            } else if (sortValue === 'mostliked' || sortValue === 'leastliked') {
                const sortDirection = sortValue === 'mostliked' ? -1 : 1;
                posts = await PostMessage.aggregate([
                    { $match: { tags: { $in: tagsArray } } },
                    { $addFields: { likesCount: { $size: '$likes' } } },
                    { $sort: { likesCount: sortDirection } },
                ]);
            } else if (sortValue === 'mostdisliked' || sortValue === 'leastdisliked') {
                const sortDirection = sortValue === 'mostdisliked' ? -1 : 1;
                posts = await PostMessage.aggregate([
                    { $match: { tags: { $in: tagsArray } } },
                    { $addFields: { dislikesCount: { $size: '$dislikes' } } },
                    { $sort: { dislikesCount: sortDirection } },
                ]);            
            } else if (sortValue == 'highestrating' || 'lowestrating' ) {
                posts = await PostMessage.find({ tags: { $in: tagsArray } }).sort({averageRating:sortValue == "lowestrating" ? -1 : 1});
            }
        } else if (searchQuery) {
            const title = new RegExp(searchQuery, 'i');
            if (sortValue === 'new' || sortValue === 'old') {
                posts = await PostMessage.find({ title }).sort({createdAt:sortValue == "new" ? -1 : 1});
            } else if (sortValue === 'mostliked' || sortValue === 'leastliked') {
                const sortDirection = sortValue === 'mostliked' ? -1 : 1;
                posts = await PostMessage.aggregate([
                    { $match: { title } },
                    { $addFields: { likesCount: { $size: '$likes' } } },
                    { $sort: { likesCount: sortDirection } },
                ]);
            } else if (sortValue === 'mostdisliked' || sortValue === 'leastdisliked') {
                const sortDirection = sortValue === 'mostdisliked' ? -1 : 1;
                posts = await PostMessage.aggregate([
                    { $match: { title } },
                    { $addFields: { dislikesCount: { $size: '$dislikes' } } },
                    { $sort: { dislikesCount: sortDirection } },
                ]);            
            } else if (sortValue == 'highestrating' || 'lowestrating' ) {
                posts = await PostMessage.find({ title }).sort({averageRating:sortValue == "lowestrating" ? -1 : 1});
            }
        } else {
            first = await PostMessage.find();
        }
      
        //res.status(200).json({ data: posts });
        res.json({ data: posts });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
*/
export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags, sort } = req.query;
    const sortValue = req.query.sort || '';
  
    try {
        let posts;
    
        const matchQuery = { $or: [] };
        const sortQuery = {};
    
        if (searchQuery) {
            const title = new RegExp(searchQuery, 'i');
            matchQuery.$or.push({ title });
        }
    
        if (tags) {
            const tagsArray = tags.split(',');
            matchQuery.$or.push({ tags: { $in: tagsArray } });
        }
    
        if (sortValue === 'new' || sortValue === 'old') {
            sortQuery.createdAt = sortValue === 'new' ? -1 : 1;
        } else if (sortValue === 'mostliked' || sortValue === 'leastliked') {
            const sortDirection = sortValue === 'mostliked' ? -1 : 1;
            sortQuery.likesCount = sortDirection;
        } else if (sortValue === 'mostdisliked' || sortValue === 'leastdisliked') {
            const sortDirection = sortValue === 'mostdisliked' ? -1 : 1;
            sortQuery.dislikesCount = sortDirection;
        } else if (sortValue === 'highestrating' || sortValue === 'lowestrating') {
            sortQuery.averageRating = sortValue === 'lowestrating' ? -1 : 1;
        }
    
        if (matchQuery.$or.length > 0) {
            if (sortQuery.likesCount || sortQuery.dislikesCount) {
                posts = await PostMessage.aggregate([
                    { $match: matchQuery },
                    { $addFields: { likesCount: { $size: '$likes' }, dislikesCount: { $size: '$dislikes' } } },
                    { $sort: sortQuery },
                ]);
            } else {
                posts = await PostMessage.find(matchQuery).sort(sortQuery);
            }
        } else {
            posts = await PostMessage.find();
        }
    
        res.json({ data: posts });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
  

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
    const {title, message, tags, timeTaken} = req.body;
    if (!req.userId) return res.json({ message: 'Unauthenticated' });

    if (!title || !message || !tags || !timeTaken) {
        const errorMessage = 'Please fill in all fields.';
        console.log(errorMessage);
        return res.status(400).json({ message: errorMessage });
    }
    // remove duplicate tags
    const newTags = [...new Set(tags)];

    const newPost = new PostMessage({ ...req.body, tags: newTags, creator: req.userId, createdAt: new Date().toISOString() });
    try {
        await newPost.save();
        await User.findByIdAndUpdate(req.userId, { $inc: { postCreated: 1 } }, { new: true });
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
    if (!req.userId) return res.json({ message: 'Unauthenticated' });

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');
    await PostMessage.findByIdAndRemove(id);
    await User.findByIdAndUpdate(req.userId, { $inc: { postCreated: -1 } }, { new: true });
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