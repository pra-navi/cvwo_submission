import React, { useState } from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, ButtonBase } from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import ThumbDownAltOutlined from '@material-ui/icons/ThumbDownAltOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import moment from 'moment';
import { useAppDispatch } from '../../../hooks.ts';
import { deletePost, likePost, dislikePost } from '../../../actions/posts.ts';
import { removePost } from '../../../actions/lists.ts';
import { useHistory } from 'react-router-dom';


import useStyles from './styles.ts';
import AddButton from './AddButton/AddButton.tsx';

interface PostProps {
    post: {
        id: number;
        name: string;
        title: string;
        message: string;
        tags: string[];
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
        listids: string[];
    };
    setCurrentId: React.Dispatch<React.SetStateAction<null | number>>;
}

const Post: React.FC<PostProps> = ({ post, setCurrentId }) => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const user = JSON.parse(localStorage.getItem('profile') || '{}'); // need to explicitly update this
    const history = useHistory();
    const [likes, setLikes] = useState(post?.likes);
    const [dislikes, setDislikes] = useState(post?.dislikes);

    if(!post) return null;

    const userId = user?.result?.googleId || user?.result?.id;
    const userEmail = user?.result?.email;
    const hasLikedPost = likes.find((like) => like === (userId));
    const hasDislikedPost = dislikes.find((dislike) => dislike === (userId));

    const handleLikeClick = async () => {
        dispatch(likePost(post.id));

        if(hasLikedPost) {
            setLikes(likes.filter((id) => id !== (userId)));
        } else {
            setLikes([...likes, (userId)]);
        }

        window.location.reload();
    }

    const handleDislikeClick = async () => {
        dispatch(dislikePost(post.id));

        if(hasDislikedPost) {
            setDislikes(dislikes.filter((id) => id !== (userId)));
        } else {
            setDislikes([...dislikes, (userId)]);
        }

        window.location.reload();
    }

    const Likes: React.FC = () => {
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

    const Dislikes: React.FC = () => {
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

    const Delete: React.FC = () => {
        return (
            <>
                <DeleteIcon fontSize="small" />
                &nbsp;{'Delete'} 
            </>
        );
    }

    const openPost = () => {
        history.push(`/posts/${post.id}`);
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

    const dPost = async () => {
        try {
            if (post.listids?.length !== undefined && post.listids?.length !== 0) {
                // Create an array to hold all the promises from dispatch calls
                const dispatchPromises: Promise<void>[] = [];
            
                for (const lId of post.listids) {
                    dispatchPromises.push(dispatch(removePost(post.id, { listId: lId })));
                }
            
                await Promise.all(dispatchPromises);
            }
      
            // All dispatches inside the loop have been completed
            dispatch(deletePost(post.id));

            window.location.reload();
        } catch (error) {
            console.error(error);
        }
      };

      // check CardMedia

    return (
        <Card className={classes.card} raised elevation={6}>
            <ButtonBase className={classes.cardAction} onClick={openPost}>
                <CardMedia className={classes.media} title={post.title} />
                <div className={classes.overlay}>
                    <Typography variant="h6">{post.name}</Typography>
                    <Typography variant="body2">{moment(post.createdat).fromNow()}</Typography>
                </div>
                <div className={classes.details}>
                    <Typography variant="body2" color="textSecondary">{post.tags.map((tag) => `#${tag.trim()} `)}</Typography>
                    <Typography variant="body2" color="textSecondary">Hours Taken: {post.timetaken}</Typography>

                </div>
                <Typography className={classes.title} variant="h5" gutterBottom>{post.title}</Typography>
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">{post.message}</Typography>
                </CardContent>
            </ButtonBase>
            {(user?.result?.googleId === post?.creatorid || user?.result?.id === post?.creatorid) && (
                    <div className={classes.overlay2}>
                        <Button style={{color: 'white'}} size="small" onClick={() => setCurrentId(post.id)}>
                            <MoreHorizIcon fontSize="medium" />
                        </Button>
                    </div>
            )} 
            {(userEmail === 'admin@gmail.com') && ( // Compare the user's email with the specific email account
                <div className={classes.overlay2}>
                    <Button style={{ color: 'white' }} size="small" onClick={() => setCurrentId(post.id)}>
                        <MoreHorizIcon fontSize="medium" />
                    </Button>
                </div>
            )}
            <CardActions className={classes.cardActions2}>
                <Typography className={classes.atLeft} variant="subtitle2" color="primary">Average Rating: {averageRating} / 5 </Typography>
                <div className={classes.atRight}> 
                    <AddButton post={post}/>
                </div>
            </CardActions>
            <CardActions className={classes.cardActions}>
                <Button size="small" color="primary" disabled={!user?.result} onClick={handleLikeClick}>
                    <Likes />
                </Button>
                <Button size="small" color="primary" disabled={!user?.result} onClick={handleDislikeClick}>
                    <Dislikes />
                </Button>
                {(user?.result?.googleId === post?.creatorid || user?.result?.id === post?.creatorid || userEmail === 'admin@gmail.com') && (
                    <Button size="small" color="primary" onClick={dPost}>
                        <Delete />
                    </Button>
                )}
            </CardActions>
        </Card>
    );
}

export default Post;
