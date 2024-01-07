import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Request, Response } from 'express';

import User from '../models/user';

interface AuthenticatedRequest extends Request {
    userId?: string;
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist." });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        
        if(!isPasswordCorrect) return res.status(400).json({ message: "Password is incorrect." });

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: "1h" });

        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong." });
    }
}

export const signup = async (req: Request, res: Response) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    try {
        const existingUserEmail = await User.findOne({ email });
        const existingUserFullName = await User.findOne({ name: `${firstName} ${lastName}` });
        if(existingUserFullName) return res.status(400).json({ message: "User with this full name already exists." });
        if(existingUserEmail) return res.status(400).json({ message: "User with this email already exists." });
        if(password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match." });
        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });
        const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: "1h" });

        res.status(200).json({ result, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong." });
    }
}

export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: "Something went wrong." });
    }
}

export const changePrivacy = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) return res.status(401).json({ message: 'Unauthenticated' });

    try {
        const userId = req.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const original = user.listsArePrivate;

        user.listsArePrivate = !original;

        const updatedUser = await User.findByIdAndUpdate(userId, user, { new: true });

        res.json(user?.listsArePrivate);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
