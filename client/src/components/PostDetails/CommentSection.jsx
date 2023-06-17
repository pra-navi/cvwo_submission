import React, { useState, useEffect, useRef } from 'react';
import { Typography, TextField, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';

import useStyles from './styles';
import { commentPost, updatePost } from '../../actions/posts';

const CommentSection = ({ post }) => {
    const classes = useStyles();
    const [comments, setComments] = useState(post?.comments || []);
    const [comment, setComment] = useState({ message: '', rating: 0 });
    const user = JSON.parse(localStorage.getItem('profile'));
    const dispatch = useDispatch();
    const commentsRef = useRef();

    useEffect(() => {
        setComments(post?.comments);
    }, [post]);

    const handleCommentChange = (event) => {
        setComment({ ...comment, message: event.target.value }); // Update the comment message as the user types
    };

    const handleRatingChange = (event) => {
        setComment({ ...comment, rating: event.target.value }); // Update the comment rating as the user types
    };
/*
    const updateAverageRating = () => {
        const sum = comments.reduce((total, comment) => total + comment.rating, 0);
        const averageRating = sum / comments.length;
        const updatedAverage = { ...post, averageRating };
        dispatch(updateAverage(updatedAverage));
    };
*/
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
            const newComments = await dispatch(commentPost(finalComment, post._id));
            setComments(newComments);
            setComment({ message: '', rating: 0 });


            // updateAverageRating();

            // Scroll down immediately to where the new comment was added
            commentsRef.current.scrollIntoView({ behavior: 'smooth' });
            
            const updatedPost = {
                ...post,
                comments: newComments
            };
            dispatch(updatePost(updatedPost));
            window.location.reload(); //Reload page to update average rating
        }
    };

    return (
        <div>
            <div className={classes.commentsOuterContainer}>
                <div className={classes.commentsInnerContainer}>
                    <Typography gutterBottom variant="h6">Comments</Typography>
                    {comments &&
                        comments.map((c, i) => (
                            <Typography key={i} gutterBottom variant="subtitle1">
                                <strong>{c.name}</strong>: {c.message}
                                <strong> {c.rating}</strong>
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