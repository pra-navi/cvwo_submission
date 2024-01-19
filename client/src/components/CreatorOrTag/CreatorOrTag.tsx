import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { Typography, CircularProgress, Grid, Divider } from '@material-ui/core';

import Post from '../Posts/Post/Post.tsx';
import { getPostsByCreator, getPostBySearch } from '../../actions/posts.ts';
import { useAppDispatch, useAppSelector } from '../../hooks.ts';

interface CreatorOrTagProps {
    setCurrentId: React.Dispatch<React.SetStateAction<null | number>>;
}

const CreatorOrTag: React.FC<CreatorOrTagProps> = () => {
    interface Params {
        name: string;
    }

    const { name } = useParams<Params>();
    const dispatch = useAppDispatch();
    const { posts, isLoading } = useAppSelector((state) => state.posts);

    const [currentId, setCurrentId] = useState<number | null>(0);

    const location = useLocation();

    const typeIsTag = location.pathname.startsWith('/tags');

    useEffect(() => {
        if (typeIsTag) {
            dispatch(getPostBySearch({ tags: name }));
        } else {
            dispatch(getPostsByCreator(name));
        }
    }, []);

    const DisplayTagName: React.FC = () => {
        return (
            <Typography variant="h2" style={{ color: 'white' }}>{name}</Typography>
        );
    };

    const DisplayCreatorName: React.FC = () => {
        var displayName = name;
        if (posts) { displayName = posts[0]?.name; }
        return (
            <Link to={`/user/profile/${name}`}>
                <Typography variant="h2" style={{ color: 'white' }}>{displayName}</Typography>
            </Link>
        );
    };

    return (
        <div>
            {typeIsTag ? <DisplayTagName /> : <DisplayCreatorName />}
            <Divider style={{ margin: '20px 0 50px 0' }} />
            {isLoading ? <CircularProgress /> : (
                    <Grid item xs={12} sm={12} md={6} lg={8} container alignItems="stretch" spacing={3}>
                        {posts?.map((post) => (
                            <Grid key={post.id} item xs={12} sm={12} md={6} lg={6}>
                                <Post post={post} setCurrentId={setCurrentId} />
                            </Grid>
                        ))}
                    </Grid>
            )}
        </div>
    );
};

export default CreatorOrTag;