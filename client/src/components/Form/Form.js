import { useHistory } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import FileBase from 'react-file-base64';
import { useSelector, useDispatch } from 'react-redux';

import useStyles from './styles';
import { createPost, updatePost } from '../../actions/posts';

import { defaultImage } from './defaultImage';

const Form = ({ currentId, setCurrentId }) => {
    const history = useHistory();

    const [postData, setPostData] = useState({
        title: '', message: '', tags: '', timeTaken: '', selectedFile: defaultImage
    });
    const [fileMessage, setFileMessage] = useState('[Using default image as cover]');
    const [errorMessage, setErrorMessage] = useState('');   
    const post = useSelector((state) => currentId ? state.posts.posts.find((p) => p._id === currentId) : null);

    const allowedFileTypes = ['image/jpg', 'image/jpeg', 'image/png'];
    function handleFileUpload({ base64, file }) {
        if (allowedFileTypes.includes(file.type)) {
          // Process the file
          setPostData({ ...postData, selectedFile: base64 });
          setFileMessage('[Using selected image as cover]');
        } else {
          // Display an error message or perform appropriate actions
          setFileMessage('[Using default image as cover (ignore choosen file)]');
          alert('Please upload a JPG or PNG file.');
        }
    }

    const classes = useStyles();
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));

    useEffect(() => {
        if(post) setPostData(post);
    }, [post, fileMessage]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!postData.title || !postData.message || !postData.tags ||!postData.timeTaken) {
            setErrorMessage('Please fill in all fields.');
            return;
        }

        if (postData.timeTaken < 0 || postData.timeTaken > 100) {
            alert('Hours Taken must be between 0 and 100');
            return;
        }

        try {
            if(currentId) {
                await dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }, history));
                clear();
            } else {
                await dispatch(createPost({ ...postData, name: user?.result?.name }, history));
                clear();
            }
            setErrorMessage('');
        } catch (error) {
            console.log(error);
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
            title: '', message: '', tags: '', selectedFile: defaultImage
        });
        setFileMessage('[Using default image as cover]');
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
                    value={postData.title.split(': ')[0]}
                    onChange={(e) => setPostData({ ...postData, title: `${e.target.value}: ${postData.title.split(': ')[1]}` })}
                />
                <TextField
                    InputLabelProps={{ shrink: true }}
                    name="title"
                    variant="outlined"
                    label="Title"
                    fullWidth
                    value={postData.title.split(': ')[1]}
                    onChange={(e) => setPostData({ ...postData, title: `${postData.title.split(': ')[0]}: ${e.target.value}` })}
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
                onChange={(e) => setPostData({ ...postData, timeTaken: e.target.value })}
                /> 
                }
                <Typography variant="body2">*Hours Taken cannot be modified after creating a post</Typography>
                <div className={classes.fileInput}>
                    <FileBase
                        type="file"
                        multiple={false}
                        accept=".jpg,.jpeg,.png" //this is useless at my side
                        onDone={handleFileUpload}
                    />
                </div>

                <Typography variant="body2">{fileMessage}</Typography>

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