import { get } from 'http';
import pool from '../models/db.js';
import { insertListQuery, updateUserQuery, getListQuery, getPostQuery, updateLearningListQuery, updateDoneListQuery, updateListOfPostQuery, updateBothListsQuery, getPostTitleQuery, getTimeQuery, getPostCreatedQuery, getUserQuery } from '../models/listQueries.js'

export const createList = async (req, res) => {
    const { listName } = req.body;
    if (!listName) return res.status(400).json({ message: 'Please provide the name of the list.' });

    if (!req.userId) return res.json({ message: 'Unauthenticated' });
    const ownerId = req.userId;
    try {
        const newListResult = await pool.query(insertListQuery, [listName, ownerId]);
        const newList = newListResult.rows[0];

        const updatedUserResult = await pool.query(updateUserQuery, [JSON.stringify([{ listId: newList.listid, listName: listName }]), ownerId]);
        const updatedUser = updatedUserResult.rows[0];
        res.json(updatedUser.mylists); // return myLists
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const getList = async (req, res) => {
    const { listId } = req.params;

    if (!listId) return res.status(400).json({ message: 'Please provide the ID of the list.' });

    try {
        const listResult = await pool.query(getListQuery, [listId]);
        if (listResult.rowCount === 0) return res.status(404).send('No list with that id');
        const list = listResult.rows[0];
        res.status(200).json(list);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const savePost = async (req, res) => {
    const { postId } = req.params;
    const { listId } = req.body;
    if (!listId) return res.status(400).json({ message: 'Please provide the ID of the list.' });
    if (!req.userId) return res.json({ message: 'Unauthenticated' });

    try {
        const getListResult = await pool.query(getListQuery, [listId]);
        if (getListResult.rowCount === 0) return res.status(404).send('No list with that id');

        const getPostResult = await pool.query(getPostQuery, [postId]);
        if (getPostResult.rowCount === 0) return res.status(404).send('No post with that id');

        const list = getListResult.rows[0];
        const post = getPostResult.rows[0];

        // check if post is already in the list
        // const index = list.learningList.findIndex((id) => id === postId);
        const index = list.learninglist.indexOf(postId);
        if (index === -1) {
            list.learninglist.push(postId);
            await pool.query(updateLearningListQuery, [list.learninglist, listId]);
        }

        // check if list is already in the listIds of the post
        // const index2 = post.listIds.findIndex((id) => id === listId);
        const index2 = post.listids.indexOf(listId);
        if (index2 === -1) {
            post.listids.push(listId);
            await pool.query(updateListOfPostQuery, [post.listids, postId]);
        }
        res.status(201).json(listId);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const removePost = async (req, res) => {
    const { postId } = req.params;
    const { listId } = req.body;
    if (!listId) return res.status(400).json({ message: 'Please provide the ID of the list.' });
    if (!req.userId) return res.json({ message: 'Unauthenticated' });

    try {
        const getListResult = await pool.query(getListQuery, [listId]);
        if (getListResult.rowCount === 0) return res.status(404).send('No list with that id');

        const getPostResult = await pool.query(getPostQuery, [postId]);
        if (getPostResult.rowCount === 0) return res.status(404).send('No post with that id');

        const list = getListResult.rows[0];
        const post = getPostResult.rows[0];
    
        const index1 = list.learninglist.findIndex((id) => id === post.id);
        const index2 = list.donelist.findIndex((id) => id === post.id);
        if (index1 !== -1) {
            list.learninglist = list.learninglist.filter((id) => id !== post.id);
            await pool.query(updateLearningListQuery, [list.learninglist, list.listid]);
        }
        if (index2 !== -1) {
            list.donelist = list.donelist.filter((id) => id !== post.id);
            list.totaltime -= post.timetaken;
            await pool.query(updateDoneListQuery, [list.donelist, list.totaltime, list.listid]);
        }
        
        const index3 = post.listids.findIndex((id) => id === listId);
        if (index3 !== -1) {
            post.listids = post.listids.filter((id) => id !== listId);
            await pool.query(updateListOfPostQuery, [post.listids, postId]);
        }
        res.status(201).json(list);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const donePost = async (req, res) => {
    const { postId } = req.params;
    const { listId } = req.body;
    if (!listId) return res.status(400).json({ message: 'Please provide the ID of the list.' });
    if (!req.userId) return res.json({ message: 'Unauthenticated' });

    try {
        const getListResult = await pool.query(getListQuery, [listId]);
        if (getListResult.rowCount === 0) return res.status(404).send('No list with that id');

        const getPostResult = await pool.query(getPostQuery, [postId]);
        if (getPostResult.rowCount === 0) return res.status(404).send('No post with that id');

        const list = getListResult.rows[0];
        const post = getPostResult.rows[0];
        const timeTaken = post.timetaken;

        const index1 = list.learninglist.findIndex((id) => id === post.id);
        const index2 = list.donelist.findIndex((id) => id === post.id);
        if (index1 !== -1 && index2 !== -1) {
            // a post in both lists > remove from learningList
            list.learninglist = list.learninglist.filter((id) => id !== post.id);
        } else if (index1 !== -1) { //inside learningList only (done function)
            list.learninglist = list.learninglist.filter((id) => id !== post.id);
            list.donelist.push(post.id);
            list.totaltime += timeTaken;
        } else if (index2 !== -1) { // inside doneList only > move to learningList (undone function)
            list.donelist = list.donelist.filter((id) => id !== post.id);
            list.learninglist.push(post.id);
            list.totaltime -= post.timetaken;
        }
        const updateListResult = await pool.query(updateBothListsQuery, [list.learninglist, list.donelist, list.totaltime, list.listid]);
        const updatedList = updateListResult.rows[0];
        res.status(201).json(updatedList);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const getTitles = async (req, res) => {
    const { listId } = req.params;
    if (!listId) return res.status(400).json({ message: 'Please provide the ID of the list.' });
    
    try {
        const getListResult = await pool.query(getListQuery, [listId]);
        if (getListResult.rowCount === 0) return res.status(404).send('No list with that id');

        const list = getListResult.rows[0];
        let result = {};

        const learningList = list.learninglist;
        for (const postId of learningList) {
            const getPostTitleResult = await pool.query(getPostTitleQuery, [postId]);
            if (getPostTitleResult.rowCount === 1) {
                const post = getPostTitleResult.rows[0];
                result = {...result, [postId]: post.title};
            }
        }

        const doneList = list.donelist;
        for (const postId of doneList) {
            const getPostTitleResult = await pool.query(getPostTitleQuery, [postId]);
            if (getPostTitleResult.rowCount === 1) {
                const post = getPostTitleResult.rows[0];
                result = {...result, [postId]: post.title};
            }
        }
        res.status(201).json(result);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const getPoint = async (req, res) => {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: 'Please provide the ID of the user.' });

    try {
        const getUserResult = await pool.query(getUserQuery, [userId]);
        if (getUserResult.rowCount === 0) return res.status(404).send('No user with that id');
        const userLists = getUserResult.rows[0].mylists;

        let hrs = 0;
        if (userLists != undefined) {
            for (const listObj of userLists) {
                const getTimeResult = await pool.query(getTimeQuery, [listObj.listId]);
                if (getTimeResult.rowCount === 1) {
                    hrs += getTimeResult.rows[0].totaltime || 0;
                }
            }
        }

        const getPostCreatedResult = await pool.query(getPostCreatedQuery, [userId]);
        if (getPostCreatedResult.rowCount === 1) {
            const postCreated = getPostCreatedResult.rows[0].postcreated || 0;
            const totalPoint = postCreated * 100 + Math.ceil(hrs * 50);
            res.status(200).json(totalPoint);
        } else {
            res.status(404).send('No user with that id');
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
