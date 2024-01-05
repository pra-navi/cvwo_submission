import React from 'react';
import { Typography, Divider, Paper } from '@material-ui/core';
import { useAppDispatch } from '../../../hooks.ts';
import useStyles from './styles.ts';
import { savePost, donePost, removePost } from '../../../actions/lists.ts';

import ListRow from './ListRow/ListRow.tsx'


const List = ({ isOwnProfile, isLearningList, postIds, handleClick, listId, titles }) => {

    const classes = useStyles();
    const dispatch = useAppDispatch();

    const remove = (postId) => {
        dispatch(removePost(postId, {listId: listId}));
    };

    const done = (postId) => {
        dispatch(donePost(postId, {listId: listId}));
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
                    funOne={done} funTwo={remove} titles={titles}/>);
                } else {
                    return (<ListRow key={postId} isOwnProfile={isOwnProfile} isLearningList={isLearningList} postId={postId}  
                        funOne={done} funTwo={remove} titles={titles}/>);
                }
            })}
        </Paper>
    );
};

export default List;
