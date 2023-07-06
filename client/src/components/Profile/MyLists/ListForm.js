// import { useHistory } from 'react-router-dom';
import React, { useState } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import { useDispatch } from 'react-redux';

import useStyles from './styles';
import { createList } from '../../../actions/lists';

const ListForm = ({ handleClick }) => {
    const currentId = '';
    // const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));
    const userName = user?.result?.name;
    
    const [name, setName] = useState(''); // handle logic here if is edit
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) {
            setErrorMessage('Please fill in name of list.');
            return;
        }

        try {
            await dispatch(createList({ listName: name, ownerName: userName }));
            clear();
        } catch (error) {
            console.log(error);
            setErrorMessage('Something went wrong. Please try again.');
        }

    }

    const clear = () => {
        // setCurrentId(null);
        setName('');
        setErrorMessage('');
    }

    return (
        <Paper className={classes.paper} elevation={6}>
            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                <div className={classes.atLeft}>
                    <Typography variant="h6">{ currentId ? 'Editing' : 'Creating' } a List</Typography>
                    <TextField 
                        InputLabelProps={{ shrink: true }} 
                        name="listname" 
                        variant="outlined" 
                        label="List Name" 
                        fullWidth
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                    />
                    {errorMessage && (
                        <Typography variant="body2" className={classes.errorMessage} color="error">
                            {errorMessage}
                        </Typography>
                    )}
                </div>
                <div className={classes.atRight}>
                    <Button className={classes.buttonSubmit} variant="contained" color="primary" size="small" type="submit" fullWidth>Submit</Button>
                    <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button>
                </div>
            </form>
        </Paper>
    );
}

export default ListForm;