import mongoose from 'mongoose';

import List from '../models/list.js';
import User from '../models/user.js';

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
        owner.myLists.filter((obj) => obj.listId !== String(listId));
        const updatedOwner = await User.findByIdAndUpdate(ownerId, owner, { new: true });
        res.status(201).json(updatedOwner); // return user
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}
