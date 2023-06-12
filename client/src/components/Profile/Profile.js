import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Avatar, Paper, Typography, Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import useStyles from './styles';
import { getUser } from '../../actions/auth'; 

const Profile = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const { id } = useParams();

    useEffect(() => {
        dispatch(getUser(id));
    }, [id]);

    // console.log(id);

    const { user, isLoading } = useSelector((state) => state.auth); //auth.js in reducer

    // console.log(user);

    const viewer = JSON.parse(localStorage.getItem('profile'));
    const viewerId = viewer?.result?._id;
    const isOwnProfile = (id === viewerId);

    const userName = user?.name;

    /*if(!user?.result) {
        return (
            <Paper className={classes.personal}>
                <Typography variant="h6" align="center"> Please Sign In. </Typography>
            </Paper>
        );
    }*/ //logic changed

    const seeMyPosts = () => {
        history.push(`/creators/${id}`);
    };

    return (
        <Paper className={classes.personal} elevation={6}>
            <div className={classes.leftRight}>
                <Avatar className={classes.purple} alt={userName} src={user?.imageUrl}>{userName?.charAt(0)}</Avatar>
                <Typography variant="h3" component="h2">{userName}</Typography>
            </div>
            <Button className={classes.myPostsButton} onClick={seeMyPosts}>
                My Posts
            </Button>
        </Paper>
    )

};

export default Profile;