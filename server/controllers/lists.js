import mongoose from 'mongoose';

import List from '../models/list.js';
import User from '../models/user.js';

export const createList = async (req, res) => {
    const { listName } = req.params;
    const owner = req.userId;

    if (!listName) {
        const errorMessage = 'Please provide name of list.';
        console.log(errorMessage);
        return res.status(400).json({ message: errorMessage });
    }

    const newList = new List({ listName: listName, ownerId: owner });
    try {
        await newList.save();
        res.status(201).json(newList);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}