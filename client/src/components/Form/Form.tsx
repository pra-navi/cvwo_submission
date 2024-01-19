import { useHistory } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import FileBase from 'react-file-base64';
import { useAppDispatch, useAppSelector } from '../../hooks.ts';

import useStyles from './styles.ts';
import { createPost, updatePost } from '../../actions/posts.ts';

interface PostData {
    hobby: string;
    title: string;
    message: string;
    tags: string[];
    timeTaken: number;
}

interface FormProps {
    currentId: number | null;
    setCurrentId: React.Dispatch<React.SetStateAction<number | null>>;
}

const Form: React.FC<FormProps> = ({ currentId, setCurrentId }) => {
    const history = useHistory();

    const [postData, setPostData] = useState<PostData>({
        hobby: '', title: '', message: '', tags: [], timeTaken: 0
    });
    const [errorMessage, setErrorMessage] = useState('');   
    const post = useAppSelector((state) => currentId ? state.posts.posts.find((p) => p.id === currentId) : null);

    const classes = useStyles();
    const dispatch = useAppDispatch();
    const user = JSON.parse(localStorage.getItem('profile') || '{}');

    useEffect(() => {
        if(post) {
            setPostData({ ...post, 
                hobby: post.title.split(': ')[0], 
                title: post.title.split(': ')[1]}
            );
        }
    }, [post]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if(currentId) {
            if (!postData.hobby || !postData.title || !postData.message || !postData.tags ) {
                setErrorMessage('Please fill in all fields.');
                return;
            }
        } else {
            if (!postData.hobby || !postData.title || !postData.message || !postData.tags || !postData.timeTaken) {
                setErrorMessage('Please fill in all fields.');
                return;
            }
            if (postData.timeTaken < 0 || postData.timeTaken > 100) {
                alert('Hours Taken must be between 0 and 100');
                return;
            }
        }

        try {
            if(currentId) {
                await dispatch(updatePost(currentId, { ...postData, title: postData.hobby + ": " + postData.title, name: user?.result?.name })); // had a third argument for history
                clear();
            } else {
                await dispatch(createPost({ ...postData, title: postData.hobby + ": " + postData.title, name: user?.result?.name }, history));
                clear();
            }
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Something went wrong. Please try again.');
        }
    }

    if(!user?.result?.name) {
        return (
            <Paper className={classes.paper}>
                <Typography variant="h6" align="center">
                    Please Sign In to create your own posts and interact with other's posts.
                </Typography>
            </Paper>
        );
    }

    const clear = () => {
        setCurrentId(null);
        setPostData({
            hobby: '', title: '', message: '', tags: [], timeTaken: 0
        });
        setErrorMessage('');
        history.push('/');
    }

    return (
        <Paper className={classes.paper} elevation={6}>
            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                <Typography variant="h6">{ currentId ? 'Editing' : 'Creating' } a Post</Typography>
                
                <TextField
                    InputLabelProps={{ shrink: true }}
                    name="hobby"
                    variant="outlined"
                    label="Hobby"
                    fullWidth
                    value={postData.hobby}
                    onChange={(e) => setPostData({ ...postData, hobby: e.target.value })}
                />
                <TextField
                    InputLabelProps={{ shrink: true }}
                    name="title"
                    variant="outlined"
                    label="Title"
                    fullWidth
                    value={postData.title}
                    onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                />
                <TextField
                    InputLabelProps={{ shrink: true }}
                    name="message"
                    variant="outlined"
                    label="Message"
                    fullWidth
                    value={postData.message}
                    onChange={(e) => setPostData({ ...postData, message: e.target.value })}
                />
                <TextField 
                    InputLabelProps={{ shrink: true }} 
                    name="tags" 
                    variant="outlined" 
                    label="Beginner/Medium/Advanced" 
                    fullWidth 
                    value={postData.tags} 
                    onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(',') })} 
                    InputProps={{className: classes.tagsInput}} 
                />
                { !currentId && 
                <TextField
                InputLabelProps={{ shrink: true }}
                name="timeTaken"
                type="number" 
                variant="outlined"
                label="Hours Taken"
                fullWidth
                value={postData.timeTaken}
                onChange={(e) => setPostData({ ...postData, timeTaken: parseInt(e.target.value) })}
                /> 
                }
                <Typography variant="body2">*Hours Taken cannot be modified after creating a post</Typography>

                {errorMessage && (
                    <Typography variant="body2" className={classes.errorMessage} color="error">
                        {errorMessage}
                    </Typography>
                )}

                <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
                <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button>
            </form>
        </Paper>
    );
}

export default Form;
