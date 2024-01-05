import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
    appBarSearch: {
        borderRadius: 4,
        marginBottom: '1rem',
        display: 'flex',
        padding: '16px', 
    }, 
    pagination: {
        borderRadius: 4,
        marginTop: '1rem', 
        padding: '16px', 
    }, 
    gridContainer: {
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column-reverse', 
        }, 
    },
    searchButton: { // adjust if necessary
        marginTop: '1rem', 
        marginBottom: '1rem', 
    },
    orderButton: { // adjust if necessary
        marginTop: '1rem', 
        marginBottom: '1rem', 
    },
}))