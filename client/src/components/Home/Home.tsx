import React, { useEffect, useState } from 'react';
import { Container, Grow, Grid, Paper, AppBar, TextField, Button, Select, MenuItem } from '@material-ui/core';
import SortIcon from '@material-ui/icons/Sort';
import { useAppDispatch } from '../../hooks.ts';
import { useHistory, useLocation } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';

import { getPostBySearch } from '../../actions/posts.ts';
import Pagination from '../Pagination.tsx';
import Posts from '../Posts/Posts.tsx';
import Form from '../Form/Form.tsx';

import useStyles from './styles.ts';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Home: React.FC = () => {
    const [currentId, setCurrentId] = useState<number | null>(0);
    const dispatch = useAppDispatch();
    const query = useQuery();
    const history = useHistory();
    const page = query.get('page') || 1;
    const searchQuery = query.get('searchQuery');
    const classes = useStyles();
    const [search, setSearch] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [sort, setSort] = useState<string>('new'); 

    const searchPost = () => {
        if(search.trim() || tags.length > 0) {

            const searchQueryValue = search;
            const tagsValue = tags.join(',');

            dispatch(getPostBySearch({ search: searchQueryValue, tags: tagsValue, sort: sort }));
            history.push(`/posts/search?searchQuery=${searchQueryValue}&tags=${tagsValue}&sort=${sort}`);
        } else {
            history.push('/');
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if(event.keyCode === 13) {
            //13 is enter key
            searchPost();
        }
    }

    const handleAdd = (tag: string) => setTags([...tags, tag]);

    const handleDelete = (tagToDelete: string) => setTags(tags.filter((tag) => tag !== tagToDelete));

    const changeOrder = async () => {
        let newSort;

        if (sort === 'new') {
            newSort = 'old';
        } else if (sort === 'old') {
            newSort = 'new';
        } else if (sort === 'mostliked') {
            newSort = 'leastliked';
        } else if (sort === 'leastliked') {
            newSort = 'mostliked';
        } else if (sort === 'mostdisliked') {
            newSort = 'leastdisliked';
        } else if (sort === 'leastdisliked') {
            newSort = 'mostdisliked';
        } else if (sort === 'highestrating') {
            newSort = 'lowestrating';
        } else if (sort === 'lowestrating') {
            newSort = 'highestrating';
        } else if (sort === 'mosttimetaken') {
            newSort = 'leasttimetaken';
        } else if (sort === 'leasttimetaken') {
            newSort = 'mosttimetaken';
        } else {
            newSort = 'new';
        }

        setSort(newSort);

        if(search.trim() || tags.length > 0) {

            const searchQueryValue = search;
            const tagsValue = tags.join(',');

            //cannot pass array through url parameter
            dispatch(getPostBySearch({ search: searchQueryValue, tags: tagsValue, sort: newSort }));
            history.push(`/posts/search?searchQuery=${searchQueryValue}&tags=${tagsValue}&sort=${newSort}`);
        } else {
            history.push('/');
        }
    }

    return (
            <Grow in>
                <Container maxWidth="xl">
                    <Grid container justifyContent="space-between" alignItems="stretch" spacing={3} className={classes.gridContainer}>
                        <Grid item xs={12} sm={6} md={9}>
                            <Posts setCurrentId={setCurrentId} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <AppBar className={classes.appBarSearch} position="static" color="inherit">
                                <TextField InputLabelProps={{ shrink: true }} name="search" variant="outlined" label="Search Post" onKeyPress={handleKeyPress} fullWidth value={search} onChange={(e) => setSearch(e.target.value)} />
                                <ChipInput
                                InputLabelProps={{ shrink: true }} 
                                style={{margin: '10px 0'}} 
                                value={tags} 
                                onAdd={handleAdd} 
                                onDelete={handleDelete} 
                                label="Search Difficulty Level"
                                variant="outlined"
                                />
                                <div className="sorting">
                                    <Select
                                        value={sort}
                                        onChange={(e) => setSort(e.target.value as unknown as string)}
                                        className="dropdown_btn"
                                        IconComponent={SortIcon}
                                    >
                                        <MenuItem value="new">Newest</MenuItem>
                                        <MenuItem value="old">Oldest</MenuItem>
                                        <MenuItem value="mostliked">Most Liked</MenuItem>
                                        <MenuItem value="leastliked">Least liked</MenuItem>
                                        <MenuItem value="mostdisliked">Most Disliked</MenuItem>
                                        <MenuItem value="leastdisliked">Least Disliked</MenuItem>
                                        <MenuItem value="mosttimetaken">Most Time Taken</MenuItem>
                                        <MenuItem value="leasttimetaken">Least Time Taken</MenuItem>
                                    </Select>
                                    <div><h3></h3></div>
                                </div>
                                <Button onClick={searchPost} className={classes.searchButton} variant="contained" color="primary">SEARCH</Button>   
                                <div><h3></h3></div>                             
                                <Button onClick={changeOrder} className={classes.orderButton} variant="contained" color="default">CHANGE ORDER</Button>
                            </AppBar>
                            <Form currentId={currentId} setCurrentId={setCurrentId} />
                            {(!searchQuery && !tags.length) && (
                                <Paper elevation={6} className={classes.pagination}>
                                    <Pagination page={Number(page)} />
                                </Paper>
                            ) // won't have pagination when searching (can modify)
                            }
                        </Grid>
                    </Grid>
                </Container>
            </Grow> 
    )
};

export default Home;