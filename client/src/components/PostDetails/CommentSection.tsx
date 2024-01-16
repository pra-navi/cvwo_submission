import React, { useState, useEffect, useRef } from 'react';
import { Typography, TextField, Button } from '@material-ui/core';
import { useAppDispatch } from '../../hooks.ts';

import useStyles from './styles.ts';
import { commentPost, updatePost } from '../../actions/posts.ts';

interface CommentSectionProps {
    post: {
        id: number;
        name: string;
        title: string;
        message: string;
        tags: string[];
        selectedfile: string;
        likes: string[];
        dislikes: string[];
        creatorid: number;
        createdat: Date;
        timetaken: number;
        comments: {
            rating: number;
            message: string;
            name: string;
        }[];
        averagerating: number;

        listIds: string[];
    };
}

const CommentSection: React.FC<CommentSectionProps> = ({ post }) => {
    const classes = useStyles();
    const [comments, setComments] = useState(post?.comments || []);
    const [comment, setComment] = useState({ message: '', rating: 0 });
    const user = JSON.parse(localStorage.getItem('profile') || '{}');
    const dispatch = useAppDispatch();
    const commentsRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setComments(post?.comments);
    }, [post]);

    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComment({ ...comment, message: event.target.value }); // Update the comment message as the user types
        console.log(comment.message);
    };

    const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComment({ ...comment, rating: Number(event.target.value) }); // Update the comment rating as the user types
        console.log(comment.rating);
    };

    const handleSubmit = async () => {
        if (comment.rating > 5 || comment.rating < 0) {
            alert('Rating must be between 0 and 5');
            return;
        }

        if (comment.message) {
            const finalComment = {
                message: comment.message,
                rating: comment.rating,
                name: user?.result?.name
            };
            const newComments = await dispatch(commentPost(finalComment, post.id));
            console.log("done w API");
            setComments(newComments);
            setComment({ message: '', rating: 0 });

            // Scroll down immediately to where the new comment was added
            commentsRef.current?.scrollIntoView({ behavior: 'smooth' });
            
            const updatedPost = {
                ...post,
                comments: newComments
            };
            dispatch(updatePost(post.id, updatedPost)); // used to be just updatedPost, now added another parameter

            window.location.reload();
        }
    };

    return (
        <div>
            <div className={classes.commentsOuterContainer}>
                <div className={classes.commentsInnerContainer}>
                    <Typography gutterBottom variant="h6">Comments</Typography>
                    {comments &&
                        comments
                        .slice()
                        .reverse()
                        .map((c, i) => (
                            <Typography key={i} gutterBottom variant="subtitle1">
                                <strong>{c.name}</strong>: {c.message}
                                <strong> ({c.rating}) </strong>
                            </Typography>
                    ))}
                    <div ref={commentsRef} /> 

                </div>
                {user?.result?.name && (
                <div style={{ width: '70%' }}>
                    <Typography gutterBottom variant="h6">Write a Comment</Typography>
                    <div style={{ marginBottom: '10px' }}>
                        <TextField fullWidth minRows={4} variant="outlined" label="Comment" multiline value={comment.message} onChange={handleCommentChange} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <TextField fullWidth type="number" label="Rating" inputProps={{ min: 0, max: 5 }} value={comment.rating} onChange={handleRatingChange} />
                    </div>
                    <Button style={{ marginTop: '10px' }} fullWidth disabled={!comment.message} variant="contained" color="primary" onClick={handleSubmit}>Comment</Button>
                </div>
                )}
            </div>
        </div>
    );
};

export default CommentSection;