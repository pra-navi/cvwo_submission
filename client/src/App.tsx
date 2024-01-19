import React from 'react';
import { Container } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { useEffect } from 'react';

import PostDetails from './components/PostDetails/PostDetails.tsx';
import Home from './components/Home/Home.tsx';
import Auth from './components/Auth/Auth.tsx';
import CreatorOrTag from './components/CreatorOrTag/CreatorOrTag.tsx';
import Navbar from './components/Navbar/Navbar.tsx';
import Profile from './components/Profile/Profile.tsx';
import ProfileSetting from './components/Profile/ProfileSetting.tsx';
import ListDetails from './components/ListDetails/ListDetails.tsx';

const App: React.FC = () => {
    useEffect(() => {
        try {
            const userProfileString = localStorage.getItem('profile') ?? '{}';
            const userProfile = JSON.parse(userProfileString);
    
            const userId = userProfile?.result?._id;
        } catch (error) {
            console.error('Error parsing or retrieving user profile:', error);
        }
    }, []);

    return (
            <Router>
                <Container maxWidth="xl">
                    <Navbar />
                    <Switch>
                        <Route path="/" exact component={() => <Redirect to="/posts" />} />
                        <Route path="/posts" exact component={Home} />
                        <Route path="/posts/search" exact component={Home} />
                        <Route path="/posts/:id" component={PostDetails} />
                        <Route path={['/creators/:name', '/tags/:name']} component={CreatorOrTag} />
                        <Route path="/auth" exact component={() => Object.keys(JSON.parse(localStorage.getItem('profile') || '{}')).length === 0 ? <Auth /> : <Redirect to="/posts/" />} />
                        <Route path="/user/profile/:id" exact component={Profile} />
                        <Route path="/user/profileSetting" exact component={() => (JSON.parse(localStorage.getItem('profile') || '{}') ? <ProfileSetting /> : <Redirect to="/auth/" />)} />
                        <Route path="/list/:listId" exact component={ListDetails} />
                    </Switch>
                </Container>      
            </Router>
    );
};

export default App;