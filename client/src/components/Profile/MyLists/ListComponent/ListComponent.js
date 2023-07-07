import React from 'react';
import { Typography, Button, ButtonBase, Card } from '@material-ui/core';
import useStyles from './styles';

const ListComponent = ({ isOwnProfile, idNamePair, setCurrentId, setCurrentName}) => {
    const classes = useStyles();
    const listName = idNamePair.listName;
    const listId = idNamePair.listId;

    const openList = () =>{};
    // console.log("listcom");
    
    return (
        <Card className={classes.card} raised elevation={6}>
            <ButtonBase className={classes.cardAction} onClick={openList}>
                {isOwnProfile 
                ? <Typography className={classes.title} variant="h6">{listName}</Typography> 
                : <Typography variant="h6">{listName}</Typography>}
            </ButtonBase>
            {(isOwnProfile) && (
                    <div className={classes.overlay2}>
                        <Button className={classes.editButton} color="secondary" size="small" 
                            onClick={() => {
                                setCurrentName(listName);
                                setCurrentId(listId);
                            }}>
                            EDIT
                        </Button>
                    </div>
            )} 
        </Card>
    )
};
export default ListComponent;