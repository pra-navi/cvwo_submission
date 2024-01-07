import React, { useEffect } from "react";
import { Pagination, PaginationItem } from '@material-ui/lab';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks.ts';

import { getPosts } from "../actions/posts.ts";

import useStyles from './styles.ts';

type RootState = {
    posts: {
      posts: any;
      currentPage: any;
      numberOfPages: any;
      isLoading: boolean;
      title: string;
    } | {
      posts: any;
      isLoading: boolean;
      title: string;
    } | {
      post: any;
      isLoading: boolean;
      posts: never[];
      title: string;
    };
};

interface PaginateProps {
    page: number;
}

const Paginate: React.FC<PaginateProps> = ({ page }) => {
    const { numberOfPages } = useAppSelector((state: RootState) => 'numberOfPages' in state.posts ? state.posts.numberOfPages : 0);
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
