import React from 'react';
import { useHistory } from 'react-router-dom';
import { Avatar, Paper, Typography, Button } from '@material-ui/core';
import useStyles from './styles';

const Profile = () => {
    const classes = useStyles();
    const history = useHistory();

    const user = JSON.parse(localStorage.getItem('profile'));
    const userName = user?.result?.name;
    const userId = user?.result?._id;

    /*if(!user?.result) {
        return (
            <Paper className={classes.personal}>
                <Typography variant="h6" align="center"> Please Sign In to See Your Profile. </Typography>
            </Paper>
        );
    }*/

    const seeMyPosts = () => {
        history.push(`/creators/${userId}`);
    };

    return (
        <Paper className={classes.personal} elevation={6}>
            <div className={classes.leftRight}>
                <Avatar className={classes.purple} alt={user.result.name} src={user.result.imageUrl}>{user.result.name.charAt(0)}</Avatar>
                <Typography variant="h3" component="h2">{userName}</Typography>
            </div>
            <Button className={classes.myPostsButton} disabled={!user?.result} onClick={seeMyPosts}>
                My Posts
            </Button>
        </Paper>
    )
};

export default Profile;