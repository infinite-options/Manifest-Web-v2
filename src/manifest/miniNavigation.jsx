import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

/* Custom Hook to make styles */
const useStyles = makeStyles({
  buttonSelection: {
    width: '14%',
    height: '70px',
    // borderBottomLeftRadius: '25%',
    // borderBottomRightRadius: '25%',
    borderRadius: '0%',
    textTransform: 'capitalize',
    color: '#FFFFFF',
    backgroundColor: '#bbc8d7',
    marginLeft: '.5%',
    marginRight: '.5%',
  },
  buttonContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-start',
    textTransform: 'none',
  },

  dateContainer: {
    height: '70px',
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
    <div className={classes.buttonContainer} style={{ width: '35%' }}>
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
      <Button
        className={classes.buttonSelection}
        onClick={eventNavigation}
        id="one"
      >
        Events
      </Button>
      <Button
        className={classes.buttonSelection}
        onClick={goalHomeNavigation}
        id="one"
      >
        Goals
      </Button>
      <Button
        className={classes.buttonSelection}
        onClick={homeNavigation}
        id="one"
      >
        Routines
      </Button>

      <div style={{ width: '25%' }}></div>
    </div>
  );
}
