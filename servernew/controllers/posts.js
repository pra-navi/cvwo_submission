import pool from '../../servernew/models/db.js';
import { listAll, countQuery, searchAll, searchByCreator, postById, insertPostQuery, increaseUserQuery, decreaseUserQuery, updatePostQuery, deletePostQuery, likePostQuery, dislikePostQuery, commentPostQuery, updateCommentQuery } from '../models/postQueries.js';

export const getPosts = async (req, res) => {
    const { page } = req.query;

    try {
        const LIMIT = 8;

        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page

        const countResult = await pool.query(countQuery);
        const total = parseInt(countResult.rows[0].count); // count how many pages

        const postsResult = await pool.query(listAll, [LIMIT, startIndex]);
        const posts = postsResult.rows;

        if (posts.length === 0) {
            res.status(404).json({ message: 'No posts found' });
        } else {
            res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// come back to this later
export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags, sort } = req.query;

    const sortValue = req.query.sort || '';

    try {
        let posts;

        if (searchQuery && tags) {
            const title = `%${searchQuery}%`;
            const tagsArray = tags.split(',');
            const sortDirection = sortValue === 'new' || sortValue === 'mostliked' || sortValue === 'mostdisliked' || sortValue === 'highestrating' || sortValue === 'mosttimetaken' ? 'DESC' : 'ASC';

            const searchTitleAndTags = `SELECT *
                FROM posts
                WHERE (title ILIKE $1 OR $1 = '')
                AND (tags @> $2::text[] OR $2 IS NULL)
                ORDER BY
                    ${sortValue === 'new' || sortValue === 'old' ? 'createdAt' :
                    sortValue === 'mostliked' || sortValue === 'leastliked' ? 'array_length(likes, 1)' :
                    sortValue === 'mostdisliked' || sortValue === 'leastdisliked' ? 'array_length(dislikes, 1)' :
                    sortValue === 'highestrating' || sortValue === 'lowestrating' ? 'averageRating' :
                    sortValue === 'mosttimetaken' || sortValue === 'leasttimetaken' ? 'timeTaken' : 'createdAt'}
                    ${sortValue === 'new' || sortValue === 'mostliked' || sortValue === 'mostdisliked' || sortValue === 'highestrating' || sortValue === 'mosttimetaken' ? 'DESC' : 'ASC'}`;

            posts = await pool.query(
                searchTitleAndTags,
                [title, tagsArray, sortValue, sortDirection]
            );
        } else if (tags) {
            const tagsArray = tags.split(',');
            // const sortDirection = sortValue === 'new' || sortValue === 'mostliked' || sortValue === 'mostdisliked' || sortValue === 'highestrating' || sortValue === 'mosttimetaken' ? 'DESC' : 'ASC';
        
            const searchTags = `SELECT *
                FROM posts
                WHERE tags @> $1::text[]
                ORDER BY
                    ${sortValue === 'new' || sortValue === 'old' ? 'createdAt' :
                    sortValue === 'mostliked' || sortValue === 'leastliked' ? 'array_length(likes, 1)' :
                    sortValue === 'mostdisliked' || sortValue === 'leastdisliked' ? 'array_length(dislikes, 1)' :
                    sortValue === 'highestrating' || sortValue === 'lowestrating' ? 'averageRating' :
                    sortValue === 'mosttimetaken' || sortValue === 'leasttimetaken' ? 'timeTaken' : 'createdAt'}
                    ${sortValue === 'new' || sortValue === 'mostliked' || sortValue === 'mostdisliked' || sortValue === 'highestrating' || sortValue === 'mosttimetaken' ? 'DESC' : 'ASC'}`;

            posts = await pool.query(
                searchTags,
                [tagsArray, sortValue, sortDirection]
            );
        } else if (searchQuery) {
            const title = `%${searchQuery}%`;
            // const sortDirection = sortValue === 'new' || sortValue === 'mostliked' || sortValue === 'mostdisliked' || sortValue === 'highestrating' || sortValue === 'mosttimetaken' ? 'DESC' : 'ASC';
            
            const searchTitle = `SELECT *
                FROM posts
                WHERE title ILIKE $1
                ORDER BY
                    ${sortValue === 'new' || sortValue === 'old' ? 'createdAt' :
                    sortValue === 'mostliked' || sortValue === 'leastliked' ? 'array_length(likes, 1)' :
                    sortValue === 'mostdisliked' || sortValue === 'leastdisliked' ? 'array_length(dislikes, 1)' :
                    sortValue === 'highestrating' || sortValue === 'lowestrating' ? 'averageRating' :
                    sortValue === 'mosttimetaken' || sortValue === 'leasttimetaken' ? 'timeTaken' : 'createdAt'}
                    ${sortValue === 'new' || sortValue === 'mostliked' || sortValue === 'mostdisliked' || sortValue === 'highestrating' || sortValue === 'mosttimetaken' ? 'DESC' : 'ASC'}`;

            posts = await pool.query(
                searchTitle,
                [title, sortValue]
            );
        } else {
            posts = await pool.query(searchAll);
        }
        
        res.json({ data: posts.rows });      
        //res.status(200).json({ data: posts });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


export const getPostsByCreator = async (req, res) => {
    const { creator } = req.query;

    try {
        const result = await pool.query(searchByCreator, [creator]);
        const posts = result.rows;
        res.json({ data: posts });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const getPost = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(postById, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
      
        const post = result.rows[0];

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

    try {
        const result = await pool.query(insertPostQuery, [title, message, newTags, timeTaken, req.userId]);
        const newPost = result.rows[0];

        // Update user's postCreated count
        await pool.query(increaseUserQuery, [req.userId]);
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const postData = req.body;

        const result = await pool.query(postById, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const updatedPost = await pool.query(updatePostQuery, [postData.title, postData.message, postData.tags, postData.timetaken, id]);
        if (updatedPost.rows.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const post = updatedPost.rows[0];
        res.json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const deletePost = async (req, res) => {
    const { id } = req.params;
    if (!req.userId) return res.json({ message: 'Unauthenticated' });

    const result = await pool.query(postById, [id]);

    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Post not found' });
    }
    try {
        await pool.query(deletePostQuery, [id]);

        await pool.query(decreaseUserQuery, [req.userId]);

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) return res.json({ message: 'Unauthenticated' });

    const result = await pool.query(postById, [id]);

    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Post not found' });
    }
    try {
        const post = result.rows[0];

        const userLiked = post.likes.includes(req.userId);
        if(!userLiked) {
            post.likes.push(req.userId);
        } else {
            post.likes = post.likes.filter((id) => id !== req.userId);
        }
        const updatedPost = await pool.query(likePostQuery, [post.likes, id]);
        res.json(updatedPost.rows[0]);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const dislikePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) return res.json({ message: 'Unauthenticated' });

    const result = await pool.query(postById, [id]);

    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Post not found' });
    }
    try {
        const post = result.rows[0];

        const userDisliked = post.dislikes.includes(req.userId);
        if(!userDisliked) {
            post.dislikes.push(req.userId);
        } else {
            post.dislikes = post.dislikes.filter((id) => id !== req.userId);
        }
        const updatedPost = await pool.query(dislikePostQuery, [post.dislikes, id]);
        res.json(updatedPost.rows[0]);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { value, rating, name } = req.body;

    if (!req.userId) return res.json({ message: 'Unauthenticated' });

    try {
        const result = await pool.query(postById, [id]);
        const post = result.rows[0];
        console.log(post);

        const newComment = {
            message: value,
            rating: parseInt(rating),
            name, // need comma>
        };

        const updatedPostResult = await pool.query(updateCommentQuery, [JSON.stringify([newComment]), post.id]);
        const updatedPost = updatedPostResult.rows[0];
        console.log(updatedPost);
        res.json(updatedPost); // return myLists

        // post.comments.push(newComment);
        // console.log(post.comments);

        // const updatedPost = await pool.query(commentPostQuery, [post.comments, id]);
        // console.log(updatedPost);
        // console.log(updatedPost.rows[0]);
        // res.json(updatedPost.rows[0]);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


export const getPostTitle = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(postById, [id]);
        const post = result.rows[0];

        res.status(200).json(post.title);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
