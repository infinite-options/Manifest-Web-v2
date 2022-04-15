import React from 'react';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useHistory } from 'react-router-dom';

/* Custom Hook to make styles */
const useStyles = makeStyles({
  buttonSelection: {
    width: '7%',
    height: '33px',
    textTransform: 'capitalize',
    borderRadius: '0%',
    color: '#000000',
    marginLeft: '.5%',
    marginRight: '.5%',
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    border: '1px solid #000000',
    borderRadius: '10px',
  },
  buttonContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-start',
    textTransform: 'none',
    background: '#F2F7FC 0% 0% no-repeat padding-box',
    paddingBottom: '0.5rem',
  },

  dateContainer: {
    height: '33px',
    width: '100%',
    // borderBottomLeftRadius: "10%",
    // borderBottomRightRadius: "10%",
    paddingTpop: '100px',
    color: '#FFFFFF',
  },
});

/* Navigation Bar component function */
export default function MiniNavigation() {
  const history = useHistory();

  const classes = useStyles();

  /* History of the HomePage URL which is shown url tab */
  function homeNavigation() {
    history.push('/home');
  }
  function goalHomeNavigation() {
    history.push('/goalhome');
  }
  function eventNavigation() {
    history.push('/events');
  }

  function aboutNavigation() {
    history.push('/about');
  }

  /* function mainNavigation() {
    history.push('/main');
  } */

  /* History of the ContactPage URL which is shown url tab */
  function loginNavigation() {
    history.push('/login');
  }

  function historyNavigation() {
    history.push('/history');
  }

  return (
    <div className={classes.buttonContainer} style={{ width: '100%' }}>
      <Button
        className={classes.buttonSelection}
        onClick={homeNavigation}
        id="one"
      >
        Calendar
      </Button>
      <Button
        className={classes.buttonSelection}
        id="one"
        onClick={historyNavigation}
      >
        History
      </Button>
      <Button
        className={classes.buttonSelection}
        id="one"
        onClick={aboutNavigation}
      >
        About
      </Button>

      <div style={{ width: '25%' }}></div>
    </div>
  );
}
