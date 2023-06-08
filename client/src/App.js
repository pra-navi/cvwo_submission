import React from 'react';
import { Container } from '@material-ui/core';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import Navbar from './components/Navbar/Navbar';
import { GoogleOAuthProvider } from '@react-oauth/google';

const App = () => (
    <GoogleOAuthProvider clientId="90323655673-7fthm7q6hkk9v1fk6m3o4sfn2esl0ms1.apps.googleusercontent.com">
        <BrowserRouter>
            <Container maxwidth="lg">
                <Navbar />
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/auth" exact component={Auth} />
                </Switch>
            </Container>
        </BrowserRouter>
    </GoogleOAuthProvider>
);

export default App;