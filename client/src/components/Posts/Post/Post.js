import React, { useState } from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, ButtonBase } from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import ThumbDownAltOutlined from '@material-ui/icons/ThumbDownAltOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import BookmarkIcon from '@material-ui/icons/Bookmark';

import moment from 'moment';
import { useDispatch } from 'react-redux';
import { deletePost, likePost, dislikePost } from '../../../actions/posts';
// import { savePost } from '../../../actions/auth';
import { useHistory } from 'react-router-dom';

import useStyles from './styles';

const Post = ({ post, setCurrentId }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile')); // need to explicitly update this
    const history = useHistory();
    const [likes, setLikes] = useState(post?.likes);
    const [dislikes, setDislikes] = useState(post?.dislikes);

    // const userLearningList = user?.result?.learningList;
    // const userDoneList = user?.result?.doneList;
    // const [hasSaved, setHasSaved] = useState(userLearningList?.includes(post._id) || false); // OR for non-login user
    const hasSaved = false;

    const userId = user?.result?.googleId || user?.result?._id;
    const userEmail = user?.result?.email;
    const hasLikedPost = likes.find((like) => like === (userId));
    const hasDislikedPost = dislikes.find((dislike) => dislike === (userId));

    const handleLikeClick = async () => {
        dispatch(likePost(post._id));

        if(hasDislikedPost) {
            // pressing the button does not do anything
            return;
        }

        if(hasLikedPost) {
            setLikes(likes.filter((id) => id !== (userId)));
        } else {
            setLikes([...likes, (userId)]);
        }
    }

    const handleDislikeClick = async () => {
        dispatch(dislikePost(post._id));

        if (hasLikedPost) {
            // pressing the button does not do anything
            return;
        }

        if(hasDislikedPost) {
            setDislikes(dislikes.filter((id) => id !== (userId)));
        } else {
            setDislikes([...dislikes, (userId)]);
        }
    }

    const handleSaveClick = () => {
        /*
        if (userDoneList?.includes(post._id)) {
            // console.log("error");
            alert('This post is in your Done List.');
        } else {
            dispatch(savePost(post._id));
            setHasSaved(!hasSaved);
        }
        */
    }

    const Likes = () => {
        if(likes.length > 0) {
            return likes.find((like) => like === (userId))
            ? (
                <><ThumbUpAltIcon fontSize="small" />&nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}` }</>
            ) : (
                <><ThumbUpAltOutlined fontSize="small" />&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</>
            );
        }

        return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>;
    }

    const Dislikes = () => {
        if(dislikes.length > 0) {
            return dislikes.find((dislike) => dislike === (userId))
            ? (
                <><ThumbDownAltIcon fontSize="small" />&nbsp;{dislikes.length > 2 ? `You and ${dislikes.length - 1} others` : `${dislikes.length} dislike${dislikes.length > 1 ? 's' : ''}` }</>
            ) : (
                <><ThumbDownAltOutlined fontSize="small" />&nbsp;{dislikes.length} {dislikes.length === 1 ? 'Dislike' : 'Dislikes'}</>
            );
        }

        return <><ThumbDownAltOutlined fontSize="small" />&nbsp;Dislike</>;
    }

    const Delete = () => {
        return (
            <>
                <DeleteIcon fontSize="small" />
                &nbsp;{'Delete'} 
            </>
        );
    }

    const Save = () => {
        if (hasSaved) {
            return (
                <><BookmarkIcon /> &nbsp;{"Saved"}</>
            );
        }
        return (
            <><BookmarkBorderIcon /> &nbsp;{"Save"}</>
        );
    }

    const openPost = () => {
        history.push(`/posts/${post._id}`);
    }

    const calculateAverageRating = () => {
        if (!post.comments || post.comments.length === 0) {
          return 0;
        }
    
        const sum = post.comments.reduce((total, comment) => total + comment.rating, 0);
        const average = sum / post.comments.length;
        return Math.round(average * 100) / 100; // Rounded to 2 decimal places
    };
    const averageRating = calculateAverageRating();

    return (
        <Card className={classes.card} raised elevation={6}>
            <ButtonBase className={classes.cardAction} onClick={openPost}>
                <CardMedia className={classes.media} image={post.selectedFile || require('../../../images/no_image.jpg').default} title={post.title} />
                <div className={classes.overlay}>
                    <Typography variant="h6">{post.name}</Typography>
                    <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
                </div>
                <div className={classes.details}>
                    <Typography variant="body2" color="textSecondary">{post.tags.map((tag) => `#${tag.trim()} `)}</Typography>
                </div>
                <Typography className={classes.title} variant="h5" gutterBottom>{post.title}</Typography>
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">{post.message}</Typography>
                </CardContent>
            </ButtonBase>
            {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
                    <div className={classes.overlay2}>
                        <Button style={{color: 'white'}} size="small" onClick={() => setCurrentId(post._id)}>
                            <MoreHorizIcon fontSize="medium" />
                        </Button>
                    </div>
            )} 
            {(userEmail === 'admin@gmail.com') && ( // Compare the user's email with the specific email account
                <div className={classes.overlay2}>
                    <Button style={{ color: 'white' }} size="small" onClick={() => setCurrentId(post._id)}>
                        <MoreHorizIcon fontSize="medium" />
                    </Button>
                </div>
            )}
            <CardActions className={classes.cardActions2}>
                <Typography className={classes.atLeft} variant="subtitle2" color="primary">Average Rating: {averageRating} / 5 </Typography>
                <Button className={classes.atRight} size="small" color="primary" disabled={!user?.result} onClick={handleSaveClick}>
                    <Save />
                </Button>
            </CardActions>
            <CardActions className={classes.cardActions}>
                <Button size="small" color="primary" disabled={!user?.result} onClick={handleLikeClick}>
                    <Likes />
                </Button>
                <Button size="small" color="primary" disabled={!user?.result} onClick={handleDislikeClick}>
                    <Dislikes />
                </Button>
                {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator || userEmail === 'admin@gmail.com') && (
                    <Button size="small" color="primary" onClick={() => dispatch(deletePost(post._id))}>
                        <Delete />
                    </Button>
                )}
            </CardActions>
        </Card>
    );
}

export default Post;
//<Typography variant="body2" color="textSecondary" component="p">Average Rating: {averageRating || 0}</Typography>