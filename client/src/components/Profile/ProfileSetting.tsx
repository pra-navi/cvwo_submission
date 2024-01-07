import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Avatar, Paper, Typography, Button, Divider } from '@material-ui/core';
import { useAppDispatch } from '../../hooks.ts';
import useStyles from './styles.ts';
import { changePrivacy } from '../../actions/auth.ts'; 


const ProfileSetting: React.FC = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useAppDispatch();

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile') || '{}'));
    const userName = user?.result?.name;
    const arePrivate = user?.result?.listsArePrivate;

    const change = () => {
        dispatch(changePrivacy()).then(
            () => {
                const me = JSON.parse(localStorage.getItem('profile') || '{}');
                setUser(me);
            }
        )
    }

    return (
        <>
            <Paper className={classes.personal} elevation={6}>
                <div className={classes.leftRight}>
                    <Avatar className={classes.purple} alt={userName} src={user?.imageUrl}>{userName?.charAt(0)}</Avatar>
                    <Typography variant="h3" component="h2">{userName}</Typography>
                </div>
                <Divider style={{ margin: '20px 0 20px 0' }} />
                <div className={classes.leftRight}>
                    <Typography variant="h5" component="h2">My lists are {arePrivate ? "private" : "public "} &nbsp;</Typography>
                    <Button className={classes.privacyButton} onClick={change}>
                        {arePrivate ? "change to public" : "change to private"}
                    </Button>
                </div>
            </Paper>
        </>
    )
};
export default ProfileSetting;
