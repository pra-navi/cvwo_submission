import React from 'react';
import { Grid, CircularProgress } from '@material-ui/core';
import { useAppSelector } from '../../hooks.ts';

import Post from './Post/Post.tsx';
import useStyles from './styles.ts';

interface PostsProps {
    setCurrentId: React.Dispatch<React.SetStateAction<null | number>>;
}

const Posts: React.FC<PostsProps> = ({ setCurrentId }) => {
    const { posts, isLoading } = useAppSelector((state) => state.posts);
    const classes = useStyles();

    if(!posts.length && !isLoading) return <div>'No posts'</div>;

    //console.log(posts);

    return (
        isLoading ? <CircularProgress /> : (
            <Grid className={classes.container} container alignItems="stretch" spacing={3}>
                {posts.map((post) => (
                    <Grid key={post._id} item xs={12} sm={12} md={6} lg={6}>
                        <Post post={post} setCurrentId={setCurrentId} />
                    </Grid>
                ))}
            </Grid>
        )
    );
}

export default Posts;