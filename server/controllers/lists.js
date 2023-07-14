import mongoose from 'mongoose';

import List from '../models/list.js';
import User from '../models/user.js';
import PostMessage from '../models/postMessage.js';

export const createList = async (req, res) => {
    const { listName, ownerName } = req.body;
    if (!listName) return res.status(400).json({ message: 'Please provide name of list.' });
    if (!req.userId) return res.json({ message: 'Unauthenticated' });
    const ownerId = req.userId;
    try {
        const newList = new List({ listName: listName, ownerId: ownerId, ownerName: ownerName });
        await newList.save();
        const owner = await User.findById(ownerId);
        owner.myLists.push({ listId: newList._id, listName: listName });
        const updatedOwner = await User.findByIdAndUpdate(ownerId, owner, { new: true });
        res.json(owner.myLists); // return myLists
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const editList = async (req, res) => {
    const { listId, listName } = req.body;
    if (!listName) return res.status(400).json({ message: 'Please provide name of list.' });
    if (!req.userId) return res.json({ message: 'Unauthenticated' });
    const ownerId = req.userId;
    try {
        //if id is not valid, return error
        if (!mongoose.Types.ObjectId.isValid(listId)) return res.status(404).send('No list with that id');
        await List.findByIdAndUpdate(listId, { $set: { listName: listName } }, { new: true });

        const owner = await User.findById(ownerId);
        owner.myLists = owner.myLists.map((idNamePair) => {
            if(idNamePair.listId === String(listId)) {
                return { ...idNamePair, listName: listName}
            } else {
                return idNamePair;
            }
        })
        const updatedOwner = await User.findByIdAndUpdate(ownerId, owner, { new: true });
        res.json(owner.myLists); // return myLists
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const deleteList = async (req, res) => {
    const { listId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(listId)) return res.status(404).send('No list with that id');
    if (!req.userId) return res.json({ message: 'Unauthenticated' });
    const ownerId = req.userId;
    try {
        await List.findByIdAndRemove(listId);

        const owner = await User.findById(ownerId);
        owner.myLists = owner.myLists.filter((obj) => obj.listId !== String(listId));
        await User.findByIdAndUpdate(ownerId, owner, { new: true });
        res.status(201).json(owner.myLists); // return user
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const getList = async (req, res) => {
    const { listId } = req.params;

    try {
        const list = await List.findById(listId);
        res.status(200).json(list);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const savePost = async (req, res) => {
    const { postId } = req.params;
    const { listId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(listId)) return res.status(404).send('No list with that id');
    if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(404).send('No post with that id');
    if (!req.userId) return res.json({ message: 'Unauthenticated' });

    try {
        const list = await List.findById(listId);
        const index = list.learningList.findIndex((id) => id === String(postId));
        if (index === -1) {
            list.learningList.push(postId);
            await List.findByIdAndUpdate(listId, list, { new: true });
        }

        const post = await PostMessage.findById(postId);
        const index2 = post.listIds.findIndex((id) => id === String(listId));
        if (index2 === -1) {
            post.listIds.push(listId);
            await PostMessage.findByIdAndUpdate(postId, post, { new: true });
        }
        res.status(201).json(listId); // return listId first
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const removePost = async (req, res) => {
    const { postId } = req.params;
    const { listId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(listId)) return res.status(404).send('No list with that id');
    if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(404).send('No post with that id');
    if (!req.userId) return res.json({ message: 'Unauthenticated' });

    try {
        const list = await List.findById(listId);
        const post = await PostMessage.findById(postId);

        const index1 = list.learningList.findIndex((id) => id === String(postId));
        const index2 = list.doneList.findIndex((id) => id === String(postId));
        if (index1 !== -1) list.learningList = list.learningList.filter((id) => id !== String(postId));
        if (index2 !== -1) {
            list.doneList = list.doneList.filter((id) => id !== String(postId));
            list.totalTime -= post.timeTaken;
        }
        await List.findByIdAndUpdate(listId, list, { new: true });

        
        const index3 = post.listIds.findIndex((id) => id === String(listId));
        if (index3 !== -1) {
            post.listIds = post.listIds.filter((id) => id !== String(listId));
            await PostMessage.findByIdAndUpdate(postId, post, { new: true });
        }
        res.status(201).json(list); // return list
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const donePost = async (req, res) => {
    const { postId } = req.params;
    const { listId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(listId)) return res.status(404).send('No list with that id');
    if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(404).send('No post with that id');
    if (!req.userId) return res.json({ message: 'Unauthenticated' });

    try {
        const list = await List.findById(listId);
        const post = await PostMessage.findById(postId);
        const timeTaken = post.timeTaken;

        const index1 = list.learningList.findIndex((id) => id === String(postId));
        const index2 = list.doneList.findIndex((id) => id === String(postId));
        if (index1 !== -1 && index2 !== -1) {
            // a post in both lists > remove from learningList
            list.learningList = list.learningList.filter((id) => id !== String(postId));
        } else if (index1 !== -1) { //inside learningList only (done function)
            list.learningList = list.learningList.filter((id) => id !== String(postId));
            list.doneList.push(postId);
            list.totalTime += timeTaken;
        } else if (index2 !== -1) { // inside doneList only > move to learningList (undone function)
            list.doneList = list.doneList.filter((id) => id !== String(postId));
            list.learningList.push(postId);
            list.totalTime -= post.timeTaken;
        }
        await List.findByIdAndUpdate(listId, list, { new: true });

        res.status(201).json(list); // return list
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const getTitles = async (req, res) => {
    const { listId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(listId)) return res.status(404).send('No list with that id');
    
    try {
        const list = await List.findById(listId);
        let result = {};
        const learningList = list.learningList;
        for (const postId of learningList) {
            const post = await PostMessage.findById(postId);
            result = {...result, [postId]: post.title};
        }
        const doneList = list.doneList;
        for (const postId of doneList) {
            const post = await PostMessage.findById(postId);
            result = {...result, [postId]: post.title};
        }
        res.status(201).json(result); // return the object
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const getPoint = async (req, res) => {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(404).send('No user with that id');

    try {
        const user = await User.findById(userId);
        const userLists = user.myLists;
        let hrs = 0;
        for (const listObj of userLists) {
            const list = await List.findById(listObj.listId);
            hrs += list.totalTime;
        }
        const totalPoint = user.postCreated * 100 + Math.ceil(hrs * 50);
        
        res.status(200).json(totalPoint);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}