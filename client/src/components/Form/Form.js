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
        title: '', message: '', tags: '', selectedFile: defaultImage
    });
    const [fileMessage, setFileMessage] = useState('[Using default image as cover]');
    const post = useSelector((state) => currentId ? state.posts.find((p) => p._id === currentId) : null);

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

    const handleSubmit = (e) => {
        e.preventDefault();

        if(currentId) {
            dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }));
        } else {
            dispatch(createPost({ ...postData, name: user?.result?.name }));
        }
        clear();
    }

    if(!user?.result?.name) {
        return (
            <Paper className={classes.paper}>
                <Typography variant="h6" align="center">
                    Please Sign In to create your own posts and like other's posts.
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
        history.push('/');
    }

    return (
        <Paper className={classes.paper}>
            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                <Typography variant="h6">{ currentId ? 'Editing' : 'Creating' } a Post</Typography>
                
                <TextField name="title" variant="outlined" label="Title" fullWidth value={postData.title} onChange={(e) => setPostData({ ...postData, title: e.target.value })} />
                <TextField name="message" variant="outlined" label="Message" fullWidth value={postData.message} onChange={(e) => setPostData({ ...postData, message: e.target.value })} />
                <TextField name="tags" variant="outlined" label="Tags" fullWidth value={postData.tags} onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(',') })} />
                
                <div className={classes.fileInput}>
                    <FileBase
                        type="file"
                        multiple={false}
                        accept=".jpg,.jpeg,.png"
                        onDone={handleFileUpload}
                    />
                </div>

                <Typography variant="body2">{fileMessage}</Typography>

                <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
                <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button>
            </form>
        </Paper>
    );
}

export default Form;