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
        const post = await List.findById(listId);
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const savePost = async (req, res) => {
    const { postId } = req.params;
    const { listId } = req.body;
    console.log(listId);
    console.log(postId);
    if (!mongoose.Types.ObjectId.isValid(listId)) return res.status(404).send('No list with that id');
    if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(404).send('No post with that id');
    if (!req.userId) return res.json({ message: 'Unauthenticated' });
    const ownerId = req.userId;

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
        console.log("controller");
        res.status(201).json(listId); // return listId first
    } catch (error) {
        console.log(error);
        res.status(409).json({ message: error.message });
    }
}
