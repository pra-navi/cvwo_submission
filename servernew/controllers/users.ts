// const { title, message, creator, tags } = req.body;
// pool.query(select s from students s where s.email = $1, [email], (error, results) => {
    // if (results.rows.length) {
    //     res.send('User already exists');
    // pool.query('INSERT INTO posts (title, message, creator, tags) VALUES ($1, $2, $3, $4)', [title, message, creator, tags], (error, results) => {
        // if (err) {
        //     throw err;
        // }
        // res.status(201).send(`Post added successfully`);

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../models/db.js';
import { getUserFromEmailQuery, getUserFromIdQuery, getUserFromNameQuery, getUserQuery, updateVerificationTokenQuery, createNewUserQuery, updateUserPrivacyQuery } from '../models/userQueries.js'
import { Request, Response } from 'express';

interface AuthenticatedRequest extends Request {
    userId?: number;
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const getUserResult = await pool.query(getUserFromEmailQuery, [email]);
        if (getUserResult.rowCount === 0) {
            return res.status(404).json({ message: "User doesn't exist." });
        }
        const existingUser = getUserResult.rows[0];        

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        
        if(!isPasswordCorrect) return res.status(400).json({ message: "Password is incorrect." });

        const token = jwt.sign({ email: existingUser.email, id: existingUser.id }, 'test', { expiresIn: "1h" });

        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ message: error.message });
        } else {
            // Handle other types of errors
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export const signup = async (req: Request, res: Response) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    try {
        const getUserFromEmailResult = await pool.query(getUserFromEmailQuery, [email]);
        if (getUserFromEmailResult && getUserFromEmailResult.rowCount && getUserFromEmailResult.rowCount > 0) {
            return res.status(404).json({ message: "User with this email already exists." });
        }

        const getUserFromNameResult = await pool.query(getUserFromNameQuery, [`${firstName} ${lastName}`]);
        if (getUserFromNameResult && getUserFromNameResult.rowCount && getUserFromNameResult.rowCount > 0) {
            return res.status(404).json({ message: "User with this full name already exists." });
        }

        if (password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match." });

        const hashedPassword = await bcrypt.hash(password, 12);

        const createNewUserResult = await pool.query(createNewUserQuery, [email, hashedPassword, `${firstName} ${lastName}`]);
        const result = createNewUserResult.rows[0];

        const token = jwt.sign({ email: result.email, id: result.id }, 'test', { expiresIn: "1h" });

        res.status(200).json({ result, token });
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ message: error.message });
        } else {
            // Handle other types of errors
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const getUserResult = await pool.query(getUserFromIdQuery, [id]);
        if (getUserResult.rowCount === 0) {
            return res.status(404).json({ message: "User not found." });
        }
        const user = getUserResult.rows[0];

        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: "Something went wrong." });
    }
}

export const changePrivacy = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) return res.status(401).json({ message: 'Unauthenticated' });

    try {
        const userId = req.userId;

        const getUserResult = await pool.query(getUserFromIdQuery, [userId]);
        if (getUserResult.rowCount === 0) {
            return res.status(404).json({ message: "User not found." });
        }
        const user = getUserResult.rows[0];

        const original = user.listsareprivate;
        user.listsareprivate = !original;

        const updatedUserResult = await pool.query(updateUserPrivacyQuery, [user.listsareprivate, userId]);
        const updatedUser = updatedUserResult.rows[0];

        res.json(user?.listsareprivate);
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ message: error.message });
        } else {
            // Handle other types of errors
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
