/*
import React from 'react';
import { Typography, Divider, Paper } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import useStyles from './styles';
import { savePost, donePost } from '../../../actions/auth';

import ListRow from './ListRow/ListRow'


const List = ({ isOwnProfile, isLearningList, postIds, handleClick }) => {

    const classes = useStyles();
    const dispatch = useDispatch();

    const done = (postId) => {
        dispatch(savePost(postId))
        .then(() => {
            dispatch(donePost(postId))
            .then(() => {
                handleClick();
            });
        }).catch((error) => {
            console.log(error);
        });
    };

    const unSave = (postId) => { // no problem(update instantly)
        dispatch(savePost(postId)).then(() => {handleClick();})
    };

    const unDone = (postId) => {
        dispatch(donePost(postId))
        .then(() => {
            dispatch(savePost(postId))
            .then(() => {
                handleClick();
            });
        }).catch((error) => {
          console.log(error);
        });
    };

    const deleteFromDone = (postId) => { // no problem(update instantly)
        dispatch(donePost(postId)).then(() => {handleClick();})
    };

    return (
        <Paper className={classes.lists} elevation={6}>
            <Typography variant="h4" component="h2">
                {isLearningList ? "Learning List" : "Done List"}
            </Typography>
            <Divider style={{ margin: '20px 0 10px 0' }} />
            {postIds?.map((postId) => {
                if (isLearningList) {
                    return (<ListRow key={postId} isOwnProfile={isOwnProfile} isLearningList={isLearningList} postId={postId}  
                    funOne={done} funTwo={unSave} />);
                } else {
                    return (<ListRow key={postId} isOwnProfile={isOwnProfile} isLearningList={isLearningList} postId={postId}  
                        funOne={unDone} funTwo={deleteFromDone} />);
                }
            })}
        </Paper>
    );
};

export default List;
   //console.log(postIds); // normal but haven't test the windowlistener
    //const { authData } = useSelector((state) => state.auth); //cannot as state will dissappear after refresh the website
    /*
        useEffect(() => {
        console.log("trigger");
    }, [location]);
    const [viewer, setViewer] = useState(JSON.parse(localStorage.getItem('profile')));
    
    // Define a function to handle the storage event
    const handleStorageChange = (event) => {
        if (event.key === 'profile') {
            const updatedViewer = JSON.parse(localStorage.getItem('profile'));
            setViewer(updatedViewer);
        }
    };
    // Attach the storage event listener
    window.addEventListener('storage', handleStorageChange);

    if (isOwnProfile) { // overriden the default one
        if (isLearningList) {
            postIds = viewer?.result?.learningList;
        } else {
            postIds = viewer?.result?.doneList;
        }
    }
        useEffect(() => {
        if (prevPath.current !== history.location.pathname) {
            // Remove the storage event listener
            console.log("closing");
            window.removeEventListener('storage', handleStorageChange);
        }
    }, [history]);

     */