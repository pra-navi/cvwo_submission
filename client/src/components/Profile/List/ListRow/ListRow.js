import React from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, Button, ButtonBase, Card } from '@material-ui/core';
import useStyles from './styles';


const ListRow = ({ isOwnProfile, isLearningList, postId, funOne, funTwo }) => {

    const classes = useStyles();
    const history = useHistory();

    const openPost = () => {
        history.push(`/posts/${postId}`);
    }

    return (
        <Card className={classes.card} raised elevation={6}>
            <ButtonBase className={classes.cardAction} onClick={openPost}>
                <Typography variant="h6">{postId}</Typography>
            </ButtonBase>
            {(isOwnProfile) && (
                    <div className={classes.overlay2}>
                        <Button  className={classes.buttonLeft} color="primary" size="small" onClick={() => funOne(postId)}>
                            {isLearningList ? "DONE" : "UNDONE"}
                        </Button>
                        <Button className={classes.buttonRight} color="secondary" size="small" onClick={() => funTwo(postId)}>
                            DELETE
                        </Button>
                    </div>
            )} 
        </Card>
    );
}

export default ListRow;