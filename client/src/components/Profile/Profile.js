import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Avatar, Paper, Typography, Button, Grid, Divider } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import useStyles from './styles';
import { getUser } from '../../actions/auth'; 

import List from './List/List';
import { getPostTitle } from '../../actions/posts';

const Profile = () => {
    const classes = useStyles();
    

    return (
        <>
            <Paper className={classes.personal} elevation={6}>Profile</Paper>
        </>
    )
};
export default Profile;
//later handle lists are private

//use the key of Grid to re-render the component
/*
const history = useHistory();
    const dispatch = useDispatch();

    const { id } = useParams();
    
    useEffect(() => {
        dispatch(getUser(id));
    }, [id]);

    const { user } = useSelector((state) => state.auth); //auth.js in reducer

    const viewer = JSON.parse(localStorage.getItem('profile'));
    const viewerId = viewer?.result?._id;
    const isOwnProfile = (id === viewerId);
    const arePrivate = viewer?.result?.listsArePrivate;

    //initialise the array, logic for normal viewer
    const [viewLearningList, setLearningList] = useState(user?.learningList);
    const [viewDoneList, setDoneList] = useState(user?.doneList);
    const [count, setCount] = useState(0);

    useEffect(() => {
        setLearningList(user?.learningList);
        setDoneList(user?.doneList);
        viewLearningList?.map((id) => dispatch(getPostTitle(id)));
        viewDoneList?.map((id) => dispatch(getPostTitle(id)));
    }, [user]);

    const changeSetting = () => {
        history.push(`/user/profileSetting`);
    }

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
    }, [count]);
    const userName = user?.name;
    const userListsArePrivate = user?.listsArePrivate;

    const seeMyPosts = () => {
        history.push(`/creators/${id}`);
    };
<Paper className={classes.personal} elevation={6}>
                <div className={classes.leftRight}>
                    <Avatar className={classes.purple} alt={userName} src={user?.imageUrl}>{userName?.charAt(0)}</Avatar>
                    <Typography variant="h3" component="h2">{userName}</Typography>
                </div>
                <Button className={classes.myPostsButton} onClick={seeMyPosts}>
                    My Posts
                </Button>
                {isOwnProfile && 
                    <div className={classes.leftRight}>
                        <Typography variant="h5" component="h2">My lists are {arePrivate ? "private" : "public "} &nbsp;</Typography>
                        <Button className={classes.privacyButton} onClick={changeSetting}>
                            change setting
                        </Button>
                    </div>
                }
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
            {((!isOwnProfile) && userListsArePrivate) &&
                <Paper className={classes.information}>
                    <Typography variant="h6" align="center"> This user's lists are private. </Typography>
                </Paper>
            }
*/