import React, { useEffect } from 'react';
import { Paper, Typography, CircularProgress, Divider } from '@material-ui/core';
import { useAppDispatch, useAppSelector } from '../../hooks.ts';
import moment from 'moment';
import { useParams, useHistory, Link } from 'react-router-dom';

import useStyles from './styles.ts';
import { getPost, getPostBySearch } from '../../actions/posts.ts';

import CommentSection from './CommentSection.tsx';

import StarRating from './StarRating.tsx';


const PostDetails = () => {

    const { post, posts, isLoading } = useAppSelector((state) => state.posts)  as { post: any; posts: any; isLoading: boolean };
    const dispatch = useAppDispatch();
    const history = useHistory();
    const classes = useStyles();
    const { id } = useParams();

    // console.log(post);

    useEffect(() => {
        dispatch(getPost(id));
    }, [id]);


    if (!post) return null;

    const calculateAverageRating = () => {
        if (!post.comments || post.comments.length === 0) {
            return 0;
        }

        const sum = post.comments.reduce((total, comment) => total + comment.rating, 0);
        const average = sum / post.comments.length;
        return Math.round(average * 100) / 100; // Rounded to 2 decimal places
    };

    if (isLoading) {
        return (
            <Paper elevation={6} className={classes.loadingPaper}>
                <CircularProgress size="7em" />
            </Paper>
        );
    }

    const averageRating = calculateAverageRating();

    return (
        <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
            <div className={classes.card}>
                <div className={classes.section}>
                    <Typography variant="h3" component="h2">{post.title}</Typography>
                    <Typography gutterBottom variant="h6" color="textSecondary" component="h2">Difficulty Level: {post.tags.map((tag) => (
                                                    ` ${tag} `

                    ))}</Typography>
                    <Typography gutterBottom variant="body2" component="p">Hours Taken: {post.timeTaken}</Typography>
                    <Typography gutterBottom variant="body1" component="p">{post.message}</Typography>
                    <Typography variant="h6">
                        Created by:
                        <Link to={`/user/profile/${post.creator}`} style={{ textDecoration: 'none', color: '#3f51b5' }}>
                            { // pass creator (id) to backend, but show name
                            }
                            {` ${post.name}`}
                        </Link>
                    </Typography>
                    <Typography variant="body1">{moment(post.createdAt).fromNow()}</Typography>
                    <Divider style={{ margin: '20px 0' }} />
                    <Typography variant="h4" component="h2">Average Rating: {averageRating} <StarRating averageRating={averageRating} /> </Typography>
                    <Divider style={{ margin: '20px 0' }} />
                    <CommentSection post={post} />
                    <Divider style={{ margin: '20px 0' }} />
                </div>
                <div className={classes.imageSection}>
                    <img className={classes.media} src={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt={post.title} />
                </div>
            </div>
        </Paper>
    );
};

export default PostDetails;