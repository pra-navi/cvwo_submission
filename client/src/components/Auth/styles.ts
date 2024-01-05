import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    width: '100%', 
    margin: theme.spacing(3, 0, 2),
  },
  googleButton: {
    width: '100%', 
    marginBottom: theme.spacing(2),
  },
  error: { //adjust if necessary
    color: 'red',
    fontSize: '12px',
    margin: '0px',
    padding: '0px',
  }
}));