import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Avatar, Paper, Typography, Button, Grid, Divider } from '@material-ui/core';
import { useAppDispatch, useAppSelector } from '../../hooks.ts';
import useStyles from './styles.ts';
import { getUser } from '../../actions/auth.ts'; 
import { getPoint } from '../../actions/lists.ts'; 

import MyLists from './MyLists/MyLists.tsx';
import ListForm from './MyLists/ListForm.tsx';
import trophy from '../../images/trophy.png';

const Profile = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useAppDispatch();

    const { id } = useParams(); // the user id (not viewer)
    
    useEffect(() => {
        dispatch(getUser(id));
    }, [id]);
    useEffect(() => {
        dispatch(getPoint(id));
    }, []);

    const { user } = useAppSelector((state) => state.auth); //auth.js in reducer, cause profile to re-render
    const { point } = useAppSelector((state) => state.lists);
    const userName = user?.name;
    const userListsArePrivate = user?.listsArePrivate;

    const viewer = JSON.parse(localStorage.getItem('profile') || '{}');
    const viewerId = viewer?.result?._id;
    const isOwnProfile = (id === viewerId);
    // console.log("isOwnProfile" + isOwnProfile); //debug
    const arePrivate = viewer?.result?.listsArePrivate;

    const seeMyPosts = () => {
        history.push(`/creators/${id}`);
    };
    const changeSetting = () => {
        history.push(`/user/profileSetting`);
    }

    // for edit list name
    const[currentId, setCurrentId] = useState(null);
    const[currentName, setCurrentName] = useState(null); 

    //initialise the array, change if isOwnProfile & create/edit the lists
    const [listsArr, setlistsArr] = useState(user?.myLists);
    // console.log(listsArr);
    const [count, setCount] = useState(0);
    const handleClick = () => { setCount(count + 1); };
    useEffect(() => {
        if (isOwnProfile) {
            const me = JSON.parse(localStorage.getItem('profile') || '{}');
            setlistsArr(me?.result?.myLists);
        }
    }, [count]);
    useEffect(() => {
        setlistsArr(user?.myLists);
    }, [user]);
    

    return (
        <>
            <Paper className={classes.personal} elevation={6}>
                <div className={classes.leftRight}>
                    <div>
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
                    </div>
                    <Paper className={classes.point}>
                        <div className={classes.leftRight}>
                            <img className={classes.image} src={trophy} alt="trophy" height="50px" />
                        </div>
                        <Typography variant="h4" align="center"> {"Point(s):"} </Typography>
                        <Typography variant="h3" align="center"> {point} </Typography>
                    </Paper>
                </div>
            </Paper>
            <Divider style={{ margin: '20px 0 20px 0' }} />
            { isOwnProfile && <ListForm currentId={currentId} setCurrentId={setCurrentId} currentName={currentName} handleClick={handleClick} /> }
            <Divider style={{ margin: '10px 0 10px 0' }} />
            {((isOwnProfile || !userListsArePrivate) && listsArr) ?
                (listsArr.length === 0 ? 
                    <Paper className={classes.information}>
                        <Typography variant="h6" align="center"> This user has no list. </Typography>
                    </Paper> 
                    :
                    <Paper className={classes.information}>
                        <MyLists isOwnProfile={isOwnProfile} listsArr={listsArr} setCurrentId={setCurrentId} setCurrentName={setCurrentName}/>
                    </Paper> 
                    )
                :
                <Paper className={classes.information}>
                    <Typography variant="h6" align="center"> This user's lists are private. </Typography>
                </Paper>
            }
        </>
    )
};
export default Profile;
// {isOwnProfile && }
// use the key of Grid to re-render the component
/*
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
*/
/*
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