import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Avatar, Paper, Typography, Button, Grid, Divider } from '@material-ui/core';
import useStyles from '../styles';

// import List from './List/List';
// import { getPostTitle } from '../../actions/posts';

const MyLists = () => {
    // { listIdNameArray }
    const classes = useStyles();
    
    return (
        <>
            <Paper className={classes.personal} elevation={6}>In Progress</Paper>
        </>
    )
};
export default MyLists;
