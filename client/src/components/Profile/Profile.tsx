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

const Profile: React.FC = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useAppDispatch();

    const { id } = useParams<{ id: string }>(); // the user id (not viewer)
    
    useEffect(() => {
        dispatch(getUser(parseInt(id)));
    }, [id]);
    useEffect(() => {
        dispatch(getPoint(parseInt(id)));
    }, []);

    const { user } = useAppSelector((state) => state.auth); //auth.js in reducer, cause profile to re-render
    const user2 = JSON.parse(localStorage.getItem('profile') || '{}');
    console.log(user2);
    const { point } = useAppSelector((state) => state.lists);
    const userName = user2.result.name || user?.name;
    const userListsArePrivate = user?.listsareprivate;

    const viewer = JSON.parse(localStorage.getItem('profile') || '{}');
    const viewerId = viewer?.result?.id;
    const isOwnProfile = (parseInt(id) === viewerId);
    const arePrivate = user?.listsareprivate;

    const seeMyPosts = () => {
        history.push(`/creators/${id}`);
    };
    const changeSetting = () => {
        history.push(`/user/profileSetting`);
    }

    // for edit list name
    const[currentId, setCurrentId] = useState<number | null>(null);
    const[currentName, setCurrentName] = useState<string | null>(null); 

    //initialise the array, change if isOwnProfile & create/edit the lists
    const [listsArr, setlistsArr] = useState(user?.mylists);
    console.log(listsArr);
    const [count, setCount] = useState(0);
    const handleClick = () => { setCount(count + 1); };
    useEffect(() => {
        if (isOwnProfile) {
            const me = JSON.parse(localStorage.getItem('profile') || '{}');
            setlistsArr(me?.result?.myLists);
        }
    }, [count]);
    useEffect(() => {
        setlistsArr(user?.mylists);
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
