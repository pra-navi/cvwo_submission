import React from 'react';
import { Container } from '@material-ui/core';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import PostDetails from './components/PostDetails/PostDetails';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import CreatorOrTag from './components/CreatorOrTag/CreatorOrTag';
import Navbar from './components/Navbar/Navbar';
import Profile from './components/Profile/Profile';

const App = () => {
    //const user = JSON.parse(localStorage.getItem('profile'));
    return (
        <GoogleOAuthProvider clientId="90323655673-7fthm7q6hkk9v1fk6m3o4sfn2esl0ms1.apps.googleusercontent.com">
            <BrowserRouter>
                <Container maxwidth="xl">
                    <Navbar />
                    <Switch>
                        <Route path="/" exact component={() => <Redirect to="/posts" />} />
                        <Route path="/posts" exact component={Home} />
                        <Route path="/posts/search" exact component={Home} />
                        <Route path="/posts/:id" component={PostDetails} />
                        <Route path={['/creators/:name', '/tags/:name']} component={CreatorOrTag} />
                        <Route path="/auth" exact component={() => (!JSON.parse(localStorage.getItem('profile')) ? <Auth /> : <Redirect to="/posts/" />)} />
                        <Route path="/profile" exact component={Profile} />
                    </Switch>
                </Container>      
            </BrowserRouter>
        </GoogleOAuthProvider>
    );
};

export default App;