import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    // justifyContent: 'center', // Vertically center-aligns items
    alignItems: 'center', 
    height: '100%',
    marginBottom: '20px', 
    marginTop: '20px', 
    position: 'relative',
  },
  cardAction: {
    display: 'block',
    textAlign: 'initial',
    backgroundColor: '#E8DBE9', 
    borderRadius: '3px',
    width: '100%', 
    elevation: '6',
    padding: '10px 16px 10px 16px',
  },
  title: {
    marginRight: '150px', 
  },
  overlay2: {
    position: 'absolute',
    top: '10px', 
    right: '20px',
  },
  buttonLeft: {
    color: 'white',
    backgroundColor: '#3f51b5', 
    marginRight: '10px', 
  },
  buttonRight: {
    color: 'white',
    backgroundColor: '#f50057', 
  },
});