import React from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, Button, ButtonBase, Card } from '@material-ui/core';
import useStyles from './styles.ts';

interface ListRowProps {
    isOwnProfile: boolean;
    isLearningList: boolean;
    postId: number;
    funOne: (postId: number) => void;
    funTwo: (postId: number) => void;
    titles: {
        [key: number]: string;
    };
}

const ListRow: React.FC<ListRowProps> = ({ isOwnProfile, isLearningList, postId, funOne, funTwo, titles }) => {
    const classes = useStyles();
    const history = useHistory();

    if (!postId || !titles) return null;

    const title = titles[postId];

    const openPost = () => {
        history.push(`/posts/${postId}`);
    }

    return (
        <Card className={classes.card} raised elevation={6}>
            <ButtonBase className={classes.cardAction} onClick={openPost}>
                {isOwnProfile 
                ? <Typography className={classes.title} variant="h6">{title}</Typography> 
                : <Typography variant="h6">{title}</Typography>}
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
