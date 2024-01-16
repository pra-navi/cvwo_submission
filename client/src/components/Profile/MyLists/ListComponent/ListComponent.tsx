import React from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, Button, ButtonBase, Card } from '@material-ui/core';
import useStyles from './styles.ts';

interface ListComponentProps {
    isOwnProfile: boolean;
    idNamePair: {
        listName: string;
        listId: number;
    };
    setCurrentId: React.Dispatch<React.SetStateAction<null | number>>;
    setCurrentName: React.Dispatch<React.SetStateAction<null | string>>;
}

const ListComponent: React.FC<ListComponentProps> = ({ isOwnProfile, idNamePair, setCurrentId, setCurrentName}) => {
    const classes = useStyles();
    const history = useHistory();
    
    const listName = idNamePair.listName;
    const listId = idNamePair.listId;

    const openList = () =>{
        history.push(`/list/${listId}`);
    };

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