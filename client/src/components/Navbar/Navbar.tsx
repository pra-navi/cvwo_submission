import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Avatar, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';
import useStyles from './styles.ts';
import * as actionType from '../../constants/actionTypes.ts';
import { useAppDispatch } from '../../hooks.ts';

import LEARNersLogo from "../../images/LEARNersLogo.png";
import LEARNersText from '../../images/LEARNersText.png';

const Navbar: React.FC = () => {

    const classes = useStyles();
    const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem('profile') || '{}')); 
    const dispatch = useAppDispatch();
    const history = useHistory();
    const location = useLocation();

    const logout = () => {
        dispatch({ type: actionType.LOGOUT });
        history.push('/auth');
        setUser(null);
    };

    useEffect(() => {
        const token = user?.token;
        if(token) {
            const decodedToken: any = decode(token);
            if(decodedToken.exp * 1000 < new Date().getTime()) logout();
        }

        setUser(JSON.parse(localStorage.getItem('profile') ?? '{}'));
    }, [location]);

    return (
        <AppBar className={classes.appBar} position="static" color="inherit">
            <Link to="/" className={classes.brandContainer}>
                <img className={classes.image} src={LEARNersLogo} alt="logo" height="50px" />
                <img src={LEARNersText} alt="icon" height="45px" />
            </Link>
            <Toolbar className={classes.toolbar}>
                { user && Object.keys(user).length !== 0  ? (
                        <div className={classes.profile}>
                        <Avatar className={classes.purple} alt={user?.result?.name} src={user?.result?.imageUrl}>{user?.result?.name.charAt(0)}</Avatar>
                        <Link to={`/user/profile/${user?.result?.id}`}>
                            <Typography className={classes.userName} variant="h6">{user?.result?.name}</Typography>
                        </Link>
                        <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>Logout</Button>
                    </div>
                ) : (
                    <Button variant="contained" color="primary" onClick={() => history.push('/auth')} >Log In</Button>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;