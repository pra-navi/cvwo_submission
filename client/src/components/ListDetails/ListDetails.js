import React, { useEffect } from 'react';
import { Paper, Typography, CircularProgress, Divider, Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory, Link } from 'react-router-dom';

import useStyles from './styles';
import { deleteList, getList } from '../../actions/lists';


const ListDetails = () => {
    const history = useHistory();
    const { list } = useSelector((state) => state.lists);
    const dispatch = useDispatch();
    // const history = useHistory();
    const classes = useStyles();
    const { listId } = useParams();

    useEffect(() => {
        dispatch(getList(listId));
    }, [listId]);

    // console.log(list); // debug

    if (!list) return null;

    const listName = list.listName;
    const ownerName = list.ownerName;
    const ownerId = list.ownerId;

    const viewer = JSON.parse(localStorage.getItem('profile'));
    const viewerId = viewer?.result?._id;
    const isOwnProfile = (ownerId === viewerId);

    const deleteL = async (e) => {
        e.preventDefault();

        await dispatch(deleteList(listId));
        history.goBack();
    };

    return (
        <>
            <Paper className={classes.listInfo} elevation={6}>
                <Typography variant="h3" component="h2">List: {listName}</Typography>
                <Typography variant="h5" component="h2">Owner: {ownerName}</Typography>
                { isOwnProfile &&
                    <Button className={classes.deleteListButton} onClick={deleteL}>
                        DELETE
                    </Button>
                }
            </Paper>
        </>
    );
};

export default ListDetails;