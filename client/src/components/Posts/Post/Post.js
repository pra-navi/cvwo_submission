import React, { useState } from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, ButtonBase } from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { deletePost, likePost, dislikePost } from '../../../actions/posts';
import { useHistory } from 'react-router-dom';

import useStyles from './styles';

const Post = ({ post, setCurrentId }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));
    const history = useHistory();
    const [likes, setLikes] = useState(post?.likes);
    const [dislikes, setDislikes] = useState(post?.dislikes);

    const userId = user?.result?.googleId || user?.result?._id;
    const hasLikedPost = likes.find((like) => like === (userId));
    const hasDislikedPost = dislikes.find((dislike) => dislike === (userId));

    const handleLikeClick = async () => {
        dispatch(likePost(post._id));

        if(hasLikedPost) {
            setLikes(likes.filter((id) => id !== (userId)));
        } else {
            setLikes([...likes, (userId)]);
        }
    }

    const handleDislikeClick = async () => {
        dispatch(dislikePost(post._id));

        if(hasDislikedPost) {
            setDislikes(dislikes.filter((id) => id !== (userId)));
        } else {
            setDislikes([...dislikes, (userId)]);
        }
    }

    const Likes = () => {
        if(likes.length > 0) {
            return likes.find((like) => like === (userId))
            ? (
                <><ThumbUpAltIcon fontSize="small" />&nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}` }</>
            ) : (
                <><ThumbUpAltIcon fontSize="small" />&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</>
            );
        }

        return <><ThumbUpAltIcon fontSize="small" />&nbsp;Like</>;
    }

    const Dislikes = () => {
        if(dislikes.length > 0) {
            return dislikes.find((dislike) => dislike === (userId))
            ? (
                <><ThumbDownAltIcon fontSize="small" />&nbsp;{dislikes.length > 2 ? `You and ${dislikes.length - 1} others` : `${dislikes.length} dislike${dislikes.length > 1 ? 's' : ''}` }</>
            ) : (
                <><ThumbDownAltIcon fontSize="small" />&nbsp;{dislikes.length} {dislikes.length === 1 ? 'Dislike' : 'Dislikes'}</>
            );
        }

        return <><ThumbDownAltIcon fontSize="small" />&nbsp;Dislike</>;
    }

    const openPost = () => {
        history.push(`/posts/${post._id}`);
    }

    return (
        <Card className={classes.card} raised elevation={6}>
            <ButtonBase className={classes.cardAction} onClick={openPost}>
                <CardMedia className={classes.media} image={post.selectedFile || require('../../../images/no_image.jpg').default} title={post.title} />
                <div className={classes.overlay}>
                    <Typography variant="h6">{post.name}</Typography>
                    <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
                </div>
                <div className={classes.details}>
                    <Typography variant="body2" color="textSecondary">{post.tags.map((tag) => `#${tag} `)}</Typography>
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
            <CardActions className={classes.cardActions}>
                <Button size="small" color="primary" disabled={!user?.result} onClick={handleLikeClick}>
                    <Likes />
                </Button>
                <Button size="small" color="primary" disabled={!user?.result} onClick={handleDislikeClick}>
                    <Dislikes />
                </Button>
                {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
                    <Button size="small" color="primary" onClick={() => dispatch(deletePost(post._id))}>
                        <DeleteIcon fontSize="small" />
                        &nbsp; Delete
                    </Button>
                )}
            </CardActions>
        </Card>
    );
}

export default Post;