import React, { useState } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import { useAppDispatch } from '../../../hooks.ts';

import useStyles from './styles.ts';
import { createList } from '../../../actions/lists.ts';

interface ListFormProps {
    currentId: null | number;
    setCurrentId: React.Dispatch<React.SetStateAction<number | null>>;
    currentName: null | string;
    handleClick: () => void;
}

const ListForm: React.FC<ListFormProps> = ({ currentId, setCurrentId, currentName, handleClick }) => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const user = JSON.parse(localStorage.getItem('profile') || '{}');
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
            handleClick();

            window.location.reload();
        } catch (error) {
            setErrorMessage('Something went wrong. Please try again.');
        }

    }

    const clear = () => {
        setCurrentId(null);
        setName('');
        setErrorMessage('');
    }

    return (
        <Paper className={classes.paper} elevation={6}>
            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                <div className={classes.atLeft}>
                    <Typography className={classes.marBottom} variant="h4">Creating a List</Typography>
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