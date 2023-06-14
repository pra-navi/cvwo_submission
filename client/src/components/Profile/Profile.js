import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Avatar, Paper, Typography, Button, Grid, Divider } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import useStyles from './styles';
import { getUser } from '../../actions/auth'; 

import List from './List/List';

const Profile = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    // console.log("profile"); // not sure why it will render 4 times

    const { id } = useParams();

    useEffect(() => {
        dispatch(getUser(id));
    }, [id, dispatch]);

    const { user, isLoading } = useSelector((state) => state.auth); //auth.js in reducer
    //later handle isLoading

    const viewer = JSON.parse(localStorage.getItem('profile'));
    const viewerId = viewer?.result?._id;
    const isOwnProfile = (id === viewerId);

    //initialise the array, logic for normal viewer
    /*
    const viewLearningList = user?.learningList;
    const viewDoneList = user?.doneList; //this is undefined
    */
    const [viewLearningList, setLearningList] = useState(user?.learningList);
    const [viewDoneList, setDoneList] = useState(user?.doneList);
    const [count, setCount] = useState(0);

    const handleClick = () => {
        const newCount = count + 1;
        setCount(newCount);
    };

   useEffect(() => {
    if (isOwnProfile) {
        const me = JSON.parse(localStorage.getItem('profile'));
        setLearningList(me?.result?.learningList);
        setDoneList(me?.result?.doneList);
    }
}, [count, isOwnProfile]);

    const userName = user?.name;
    const userListsArePrivate = user?.listArePrivate;
    /*
    if(!viewer) {
        return (
            <Paper className={classes.personal}>
                <Typography variant="h6" align="center"> Please Sign In. </Typography>
            </Paper>
        );
    };
    */
    const seeMyPosts = () => {
        history.push(`/creators/${id}`);
    };
    //later handle lists are private

    //use the key of Grid to re-render the component

    return (
        <>
            <Paper className={classes.personal} elevation={6}>
                <div className={classes.leftRight}>
                    <Avatar className={classes.purple} alt={userName} src={user?.imageUrl}>{userName?.charAt(0)}</Avatar>
                    <Typography variant="h3" component="h2">{userName}</Typography>
                </div>
                <Button className={classes.myPostsButton} onClick={seeMyPosts}>
                    My Posts
                </Button>
            </Paper>
            <Divider style={{ margin: '20px 0 20px 0' }} />
            {(isOwnProfile || !userListsArePrivate) &&
                <Grid container alignItems="stretch" spacing={3}>
                    <Grid key={`learning-list-${count}`} item xs={12} sm={12} md={6} lg={6}>
                        <List isOwnProfile={isOwnProfile} isLearningList={true} postIds={viewLearningList} handleClick={handleClick}/>
                    </Grid>
                    <Grid key={`done-list-${count}`} item xs={12} sm={12} md={6} lg={6}>
                        <List isOwnProfile={isOwnProfile} isLearningList={false} postIds={viewDoneList} handleClick={handleClick}/>
                    </Grid>
                </Grid>
            }
        </>
    )
};
export default Profile;