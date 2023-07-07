import {makeStyles} from "@material-ui/core/styles";

export default makeStyles((theme) => ({
    listInfo: {
        padding: '20px', 
        borderRadius: '15px', 
        backgroundColor: '#E8DBE9', 
    },
    sublistsInfo: {
        padding: '20px', 
        borderRadius: '5px', 
        backgroundColor: 'white', 
    },
    lists: {
        padding: '20px', 
        borderRadius: '5px', 
    },
    deleteListButton: {
        size: "large",  
        variant: "contained", 
        color: "white", 
        marginTop: 30,
        marginBottom: 10,
        backgroundColor: '#5E545E', 
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