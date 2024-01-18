import React, { useEffect, useState } from 'react';
import { Paper, Typography, CircularProgress, Divider, Button, Grid } from '@material-ui/core';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks.ts';

import useStyles from './styles.ts';
import { getList, getTitles } from '../../actions/lists.ts';
import List from './List/List.tsx';


const ListDetails: React.FC = () => {
    const history = useHistory();
    const { list, titles } = useAppSelector((state) => state.lists);
    const dispatch = useAppDispatch();
    const classes = useStyles();

    interface RouteParams {
        listId: string;
    }

    const { listId } = useParams<RouteParams>();
    const [count, setCount] = useState(0);

    useEffect(() => {
        dispatch(getList(parseInt(listId)));
    }, [listId]);
    useEffect(() => {
        dispatch(getTitles(listId));
    }, []);

    // console.log(list);

    if (!list) return null;

    const handleClick = () => { setCount(count + 1); };
    const listName = list.listname;
    const ownerName = list.ownername;
    const ownerId = list.ownerid;
    const lList = list.learninglist;
    const dList = list.donelist

    const viewer = JSON.parse(localStorage.getItem('profile') || '{}');
    const viewerId = viewer?.result?.id;
    const isOwnProfile = (ownerId === viewerId);

    return (
        <>
            <Paper className={classes.listInfo} elevation={6}>
                <Typography variant="h3" component="h2">List: {listName}</Typography>
                <Typography variant="h5" component="h2">Owner: {ownerName}</Typography>
            </Paper>
            <Divider style={{ margin: '20px 0 20px 0' }} />
            <Grid container alignItems="stretch" spacing={3}>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <List isOwnProfile={isOwnProfile} isLearningList={true} postIds={lList} handleClick={handleClick} listId={Number(listId)} titles={titles}/>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <List isOwnProfile={isOwnProfile} isLearningList={false} postIds={dList} handleClick={handleClick} listId={Number(listId)} titles={titles}/>
                </Grid>
            </Grid>
        </>
    );
};

export default ListDetails;