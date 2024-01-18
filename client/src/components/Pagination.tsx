import React, { useEffect } from "react";
import { Pagination, PaginationItem } from '@material-ui/lab';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks.ts';

import { getPosts } from "../actions/posts.ts";

import useStyles from './styles.ts';

interface PaginateProps {
    page: number;
}

const Paginate: React.FC<PaginateProps> = ({ page }) => {

    const { posts: { numberOfPages } } = useAppSelector((state) => state);
    const classes = useStyles();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (page) dispatch(getPosts(page));
    }, [page]);

    return (
        <Pagination 
            classes={{ ul: classes.ul }}
            count={numberOfPages}
            page={Number(page) || 1}
            variant="outlined"
            color="primary"
            renderItem={(item) => (
                <PaginationItem { ...item} component={Link} to={`/posts?page=${item.page}`}/>
            )}
        />
    );
};

export default Paginate;
