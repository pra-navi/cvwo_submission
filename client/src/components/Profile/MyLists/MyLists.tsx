import React from 'react';
import { Typography, Grid, Divider } from '@material-ui/core';

import ListComponent from './ListComponent/ListComponent.tsx';

interface MyListsProps {
    isOwnProfile: boolean;
    listsArr: Array<{ listName: string, listId: number }>;
    setCurrentId: React.Dispatch<React.SetStateAction<null | number>>;
    setCurrentName: React.Dispatch<React.SetStateAction<null | string>>;
}

const MyLists: React.FC<MyListsProps> = ({ isOwnProfile, listsArr, setCurrentId, setCurrentName}) => {
    
    return (
        <>
            <Typography variant="h4" align="center"> My Lists </Typography>
            <Divider style={{ margin: '10px 0 20px 0' }} />
            <Grid container alignItems="stretch" spacing={3}>
                { listsArr?.map((idNamePair) => 
                    <Grid key={idNamePair.listId} item xs={12} sm={12} md={4} lg={4}>
                        <ListComponent isOwnProfile={isOwnProfile} idNamePair={idNamePair} setCurrentId={setCurrentId} setCurrentName={setCurrentName}/>
                    </Grid>
                ) }
            </Grid>
        </>
    )
};
export default MyLists;
