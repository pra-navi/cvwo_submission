import React, { useState } from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import { GoogleLogin } from '@react-oauth/google'; // googleLogout
import jwt_decode from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Icon from './icon';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import useStyles from './styles';
import Input from './Input';
import { signup, login, googleLogin } from '../../actions/auth';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {
    const classes =  useStyles();
    const [showPassword, setShowPassword] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const history = useHistory();
    const [error, setError] = useState('');

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            if(isSignUp) {
                await dispatch(signup(formData, history));
            } else {
                await dispatch(login(formData, history));
            }
            setFormData(initialState);
            setError('');
            history.push('/');
        } catch (error) {
            setError(error.message);
        }
        
    };

    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const switchMode = () => {
        setIsSignUp((prevIsSignUp) => !prevIsSignUp);
        setShowPassword(false);
        setError('');
    };

    const googleSuccess = async (res) => {
        //ans from the comment
        const token = res?.credential;
        const result = jwt_decode(token);
        const gglForm = { 
            firstName: result?.given_name, 
            lastName: result?.family_name ? result?.family_name : '', 
            email: result?.email, 
            password: result?.sub, //sth like googleId
            confirmPassword: '' 
        };
        try{
            await dispatch(googleLogin(gglForm, history));
            setError('');
            history.push('/');
        } catch (error) {
            setError(error.message);
        }
        /*
        const result = res?.profileObj;
        const token = res?.tokenId;
        
        try {
            dispatch({ type: 'AUTH', data: { result, token } });
            history.push('/');
        } catch (error) {
            console.log(error);
        }
        */
    };

    const googleFailure = (error) => {
        console.log(error);
        console.log("Google Log In was unsuccessful. Try again later");
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}> <LockOutlinedIcon /> </Avatar>
                <Typography variant="h5">{isSignUp ? 'Sign Up' : 'Log In'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {
                            isSignUp && (
                                <>
                                    <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                                    <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                                </>
                            )
                        }
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                        <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
                        { isSignUp && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" /> }
                    </Grid>
                    { error && <Typography variant="body2" className={classes.error} color="error"> {error} </Typography> }
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                        { isSignUp ? 'Sign Up' : 'Log In' }
                    </Button>
                    <GoogleLogin 
                        render={(renderProps) => (
                            <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon /> } variant="contained">Google Log In</Button>
                        )}
                        onSuccess={googleSuccess}
                        onError={googleFailure}
                        cookiePolicy="single_host_origin"
                    />
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Button onClick={switchMode}>
                                { isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up" }
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>

    )
};

export default Auth;