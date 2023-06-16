import {makeStyles} from "@material-ui/core/styles";
import { deepPurple } from '@material-ui/core/colors';

export default makeStyles((theme) => ({
    personal: {
        padding: '20px', 
        borderRadius: '15px', 
        backgroundColor: '#E8DBE9', 
    },
    lists: {
        padding: '20px', 
        borderRadius: '5px', 
    },
    myPostsButton: {
        size: "large",  
        variant: "contained", 
        color: "white", 
        marginTop: 30,
        marginBottom: 10,
        backgroundColor: '#5E545E', 
    },
    purple: {
        color: theme.palette.getContrastText(deepPurple[500]),
        backgroundColor: deepPurple[500],
        height: '80px', 
        width: '80px', 
        marginRight: '20px', 
    },
    leftRight: {
        display: 'flex', 
        alignItems: 'center'
    },
    privacyButton: {
        size: "large",  
        variant: "contained", 
        color: "white", 
        backgroundColor: '#5E545E', 
        marginLeft: 10, 
    },
}));