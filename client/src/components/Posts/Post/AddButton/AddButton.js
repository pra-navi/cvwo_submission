import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Box, TextField, MenuItem
} from '@material-ui/core';
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { removePost, savePost } from '../../../../actions/lists';
// import useStyles from '../styles';
  
const AddButton = ({ post }) => {
    // const classes = useStyles();
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile')); 
    const [openOne, setOpenOne] = useState(false); // for the save dialog
    const [openTwo, setOpenTwo] = useState(false); // for the delete dialog

    const [curListId, setListId] = useState('');
    const [commonList, setCommonList] = useState(null); // for remove list

    //initial status of icon
    const userLists = user?.result?.myLists;
    const postListIds = post?.listIds;

    const checkAdded = (arr1, arr2) => {
        if (!arr1 || !arr2) {return false;}
        const set = new Set(arr1);
        for (let i = 0; i < arr2.length; i++) {
            if (set.has(arr2[i].listId)) {
                setCommonList(arr2[i]);
                return true;
            }
        }
        return false;
    };
    const [hasAdded, setHasAdded] = useState(false); // for non-login user
    useEffect(()=>{
        if (userLists) {
            setHasAdded(checkAdded(postListIds, userLists));
        }
	}, [])

    if(!post) return null;

    const handleAddClick = () => { hasAdded ? setOpenTwo(true) :setOpenOne(true); };

    const addPost = async (e) => {
        e.preventDefault();
        //dispatch save post
        await dispatch(savePost(post._id, {listId: curListId}));
        setHasAdded(true);
        setOpenOne(false);
    };

    const rPost = async (e) => {
        e.preventDefault();
        console.log(commonList?.listId);
        console.log(post._id);
        //dispatch remove post
        await dispatch(removePost(post._id, {listId: commonList?.listId}));
        setHasAdded(false);
        setOpenTwo(false);
    };

    return (
        <>
            <Button size="small" color="primary" disabled={!user?.result} onClick={handleAddClick}>
                {hasAdded ? <><BookmarkIcon /> &nbsp;{"Added"}</> : <><BookmarkBorderIcon /> &nbsp;{"Add"}</>}
            </Button>

            <Dialog
                open={openOne}
                onClose={() => setOpenOne(false)}
                aria-labelledby='dialog-title'
                aria-describedby='dialog-description'>
                <DialogTitle id='dialog-title'>Save this post to: </DialogTitle>
                <DialogContent>
                    <DialogContentText id='dialog-description'>
                        Please select the list to save this post.
                    </DialogContentText>
                    <Box width='500px'>
                        <TextField
                            fullWidth
                            label='Select list'
                            select
                            size='small'
                            color='primary'
                            helperText='Please select your list'
                            value={curListId}
                            onChange={(e) => {setListId(e.target.value)}}>
                            {userLists?.map((obj) => {
                                return <MenuItem key={obj.listId} value={obj.listId}>{obj?.listName}</MenuItem>
                            })}
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenOne(false)}>Cancel</Button>
                    <Button onClick={addPost} autoFocus>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openTwo}
                onClose={() => setOpenTwo(false)}
                aria-labelledby='dialog-title'
                aria-describedby='dialog-description'>
                <DialogTitle id='dialog-title'>Removed the post?</DialogTitle>
                <DialogContent>
                    <DialogContentText id='dialog-description'>
                        Are you sure you want to remove this post from your list: {commonList?.listName} ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenTwo(false)}>Cancel</Button>
                    <Button onClick={rPost} autoFocus>
                        Remove
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AddButton;
    /*
    useEffect(() => {        
        // Check if the post is already added when the component mounts
        setHasAdded(checkAdded(postListIds, userLists));
    }, [postListIds, userLists]);
    */