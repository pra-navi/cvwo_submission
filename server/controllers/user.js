import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import sendVerificationEmail from '../utils/sendEmail.js';

import User from '../models/user.js';

export const googleLogin = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;
    const name = lastName === '' ? firstName : `${firstName} ${lastName}`;

    try {
        if (!name) return res.status(400).json({ message: "Username is empty." });
        const existingUser = await User.findOne({ email });
        
        if (!existingUser) {
            //signup by email
            const existingUserFullName = await User.findOne({ name: `${firstName} ${lastName}` });
            if(existingUserFullName) return res.status(400).json({ message: "User with this full name already exists. Please login via another way." });
            const hashedPassword = await bcrypt.hash(password, 12);
            const result = await User.create({ email, password: hashedPassword, name: name });

            const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: "1h" });
            res.status(200).json({ result, token });
        } else {
            //login by email
            const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
            // the password is not google id
            if(!isPasswordCorrect) return res.status(400).json({ message: "User with this email already exists. Please login via another way." });

            const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: "1h" });
            res.status(200).json({ result: existingUser, token });
        }
    } catch (error) {
        res.status(500).json({ message: "Something went wrong." });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist." });
        if(!existingUser.isEmailVerified) return res.status(400).json({ message: "Please confirm your email to login." });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        
        if(!isPasswordCorrect) return res.status(400).json({ message: "Password is incorrect." });

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: "1h" });

        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong." });
    }
}

export const signup = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    try {
        const existingUserEmail = await User.findOne({ email });

        const existingUserFullName = await User.findOne({ name: `${firstName} ${lastName}` });

        if(existingUserFullName) return res.status(400).json({ message: "User with this full name already exists." });

        if(existingUserEmail) return res.status(400).json({ message: "User with this email already exists." });

        if(password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match." });

        const hashedPassword = await bcrypt.hash(password, 12);

        const verificationToken = await bcrypt.genSalt(10);

        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}`, verificationToken: verificationToken });

        const verificationLink = `http://localhost:3000/verify-email/${verificationToken}`; //change when deploying

        sendVerificationEmail(result.email, verificationLink);

        const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: "1h" });

        res.status(200).json({ result, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong." });
    }
}

export const getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);

        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
// noticed here don't have try and catch
/*
export const savePost = async (req, res) => {
    const { postId } = req.params;

    if (!req.userId) return res.json({ message: 'Unauthenticated' });

    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(404).send('No post with that postId');
    const user = await User.findById(userId);
    const index = user.learningList.findIndex((id) => id === String(postId));
    const indexTwo = user.doneList.findIndex((id) => id === String(postId)); //check
    if (index === -1 && indexTwo === -1) {
        user.learningList.push(postId);
    } else if (index === -1) { //post alr in doneList, but not in learningList
        //do nothing (bcs a post cannot in both list)
    } else { // unsave
        user.learningList = user.learningList.filter((id) => id !== String(postId));
    }
    const updatedUser = await User.findByIdAndUpdate(userId, user, { new: true });
    res.json(user.learningList);
}

export const donePost = async (req, res) => {
    const { postId } = req.params;

    if (!req.userId) return res.json({ message: 'Unauthenticated' });

    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(404).send('No post with that postId');
    const user = await User.findById(userId);
    const index = user.doneList.findIndex((id) => id === String(postId));
    const indexTwo = user.learningList.findIndex((id) => id === String(postId)); //check
    if (index === -1 && indexTwo === -1) {
        user.doneList.push(postId);
    } else if (index === -1) { //post alr in doneList, but not in learningList
        // do nothing (bcs a post cannot in both list)
    } else { // undone
        user.doneList = user.doneList.filter((id) => id !== String(postId));
    }
    const updatedUser = await User.findByIdAndUpdate(userId, user, { new: true });
    res.json(user.doneList);
}
*/
export const changePrivacy = async (req, res) => {
    if (!req.userId) return res.json({ message: 'Unauthenticated' });

    const userId = req.userId;

    const user = await User.findById(userId);
    const original = user.listsArePrivate;
 
    user.listsArePrivate = !original;
    const updatedUser = await User.findByIdAndUpdate(userId, user, { new: true });
 
    res.json(user.listsArePrivate);
}