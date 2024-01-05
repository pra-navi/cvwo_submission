//create all handlers for routes
import mongoose from 'mongoose';

import PostMessage from '../models/postMessage';
import User from '../models/user';
import { Request, Response } from 'express';

interface AuthenticatedRequest extends Request {
    userId?: string;
}

export const getPosts = async (req: Request, res: Response) => {
    const { page } = req.query;

    try {
        const LIMIT = 8; // number of post per page
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
        const total = await PostMessage.countDocuments({}); // count how many pages

        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        // console.log(posts[0]);
        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ message: error.message });
        } else {
            // Handle other types of errors
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export const getPostsBySearch = async (req: Request, res: Response) => {
    const { searchQuery, tags, sort } = req.query;

    const sortValue = req.query.sort || '';

    // console.log('sortValue:', sortValue); //help debug

    try {
        let posts;

        if (searchQuery && tags) {
            const title = new RegExp(searchQuery as string, 'i');
            const tagsArray = typeof tags === 'string' ? tags.split(',') : undefined;
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
            } else if (sortValue == 'highestrating' || sortValue == 'lowestrating' ) {
                posts = await PostMessage.find({ $and: [{ $or: [{ title }] }, { tags: { $in: tagsArray } }] }).sort({averageRating:sortValue == "lowestrating" ? -1 : 1});
            } else if (sortValue == 'mosttimetaken' || sortValue == 'leasttimetaken' ) {
                posts = await PostMessage.find({ $and: [{ $or: [{ title }] }, { tags: { $in: tagsArray } }] }).sort({timeTaken:sortValue == "leasttimetaken" ? 1 : -1});
            }
        } else if (tags) { // the logic here: show post if any tag matches in the search (not matches all)
            const tagsArray = typeof tags === 'string' ? tags.split(',') : undefined;
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
            } else if (sortValue == 'highestrating' || sortValue == 'lowestrating' ) {
                posts = await PostMessage.find({ tags: { $in: tagsArray } }).sort({averageRating:sortValue == "lowestrating" ? -1 : 1});
            } else if (sortValue == 'mosttimetaken' || sortValue == 'leasttimetaken' ) {
                posts = await PostMessage.find({ tags: { $in: tagsArray } }).sort({timeTaken:sortValue == "leasttimetaken" ? 1 : -1});
            }
        } else if (searchQuery) {
            const title = new RegExp(searchQuery as string, 'i');
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
            } else if (sortValue == 'highestrating' || sortValue == 'lowestrating' ) {
                posts = await PostMessage.find({ title }).sort({averageRating:sortValue == "lowestrating" ? -1 : 1});
            } else if (sortValue == 'mosttimetaken' || sortValue == 'leasttimetaken' ) {
                posts = await PostMessage.find({ title }).sort({timeTaken:sortValue == "leasttimetaken" ? 1 : -1});
            }
        } else {
            posts = await PostMessage.find();
        }
      
        //res.status(200).json({ data: posts });
        res.json({ data: posts });
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ message: error.message });
        } else {
            // Handle other types of errors
            res.status(500).json({ message: 'Internal Server Error' });
        }    
    }
}


export const getPostsByCreator = async (req: Request, res: Response) => {
    const { creator } = req.query;

    try {
        const posts = await PostMessage.find({ creator });

        res.json({ data: posts });
    } catch (error) {    
        if (error instanceof Error) {
            res.status(404).json({ message: error.message });
        } else {
            // Handle other types of errors
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export const getPost = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);

        res.status(200).json(post);
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ message: error.message });
        } else {
            // Handle other types of errors
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export const createPost = async (req: AuthenticatedRequest, res: Response) => {
    const {title, message, tags, timeTaken} = req.body;
    if (!req.userId) return res.json({ message: 'Unauthenticated' });

    if (!title || !message || !tags || !timeTaken) {
        const errorMessage = 'Please fill in all fields.';
        console.log(errorMessage);
        return res.status(400).json({ message: errorMessage });
    }
    // remove duplicate tags
    const newTags: string[] = Array.from(new Set(tags));

    const newPost = new PostMessage({ ...req.body, tags: newTags, creator: req.userId, createdAt: new Date().toISOString() });
    try {
        await newPost.save();
        await User.findByIdAndUpdate(req.userId, { $inc: { postCreated: 1 } }, { new: true });
        res.status(201).json(newPost);
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ message: error.message });
        } else {
            // Handle other types of errors
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export const updatePost = async (req: Request, res: Response) => {
    const { id: _id } = req.params;
    const post = req.body;

    //if id is not valid, return error
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');
    //if id is valid, find post by id and update it
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id }, { new: true });
    res.json(updatedPost);
}

export const deletePost = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    if (!req.userId) return res.json({ message: 'Unauthenticated' });

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');
    await PostMessage.findByIdAndRemove(id);
    await User.findByIdAndUpdate(req.userId, { $inc: { postCreated: -1 } }, { new: true });
    res.json({ message: 'Post deleted successfully' });
}

export const likePost = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    if (!req.userId) return res.json({ message: 'Unauthenticated' });

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');
    const post = await PostMessage.findById(id);
    if (!post) {
        return res.status(404).send('No post with that id');
    }
    const index = post.likes.findIndex((id) => id === String(req.userId));
    if(index === -1) {
        post.likes.push(req.userId);
    } else {
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    res.json(updatedPost);
}

export const dislikePost = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    if (!req.userId) return res.json({ message: 'Unauthenticated' });

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');
    const post = await PostMessage.findById(id);
    if (!post) {
        return res.status(404).send('No post with that id');
    }
    const index = post.dislikes.findIndex((id) => id === String(req.userId));
    if(index === -1) {
        post.dislikes.push(req.userId);
    } else {
        post.dislikes = post.dislikes.filter((id) => id !== String(req.userId));
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    res.json(updatedPost);
}

export const commentPost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { value, rating, name } = req.body;

    try {
        const post = await PostMessage.findById(id);
        if (!post) {
            return res.status(404).send('No post with that id');
        }

        const newComment = {
            message: value,
            rating: parseInt(rating),
            name
        };

        post.comments.push(newComment);

        const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

        res.json(updatedPost);
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ message: error.message });
        } else {
            // Handle other types of errors
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}


export const getPostTitle = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);
        if (!post) {
            return res.status(404).send('No post with that id');
        }

        res.status(200).json(post.title);
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ message: error.message });
        } else {
            // Handle other types of errors
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}