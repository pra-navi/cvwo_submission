import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
  paper: {
    padding: theme.spacing(2),
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center', 
  },
  fileInput: {
    width: '97%',
    margin: '10px 0',
  },
  buttonSubmit: {
    marginTop: 15,
    marginBottom: 10,
  },
  tagsInput: {
    '& .MuiOutlinedInput-root': {
      fontSize: '5px',
    },
  }, 
  errorMessage: {
    marginTop: 10,
    color: 'red',
  },
  atRight: {
    marginLeft: 'auto', 
    width: '15%', 
  }, 
  atLeft: {
    marginRight: 'auto', 
    width: '70%', 
  }, 
  marBottom: {
    marginBottom: '15px', 
  }, 
}));