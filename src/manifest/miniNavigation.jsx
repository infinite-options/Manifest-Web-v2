import React from 'react';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useHistory } from 'react-router-dom';

/* Custom Hook to make styles */
const useStyles = makeStyles({
  buttonSelection: {
    width: '21%',
    height: '28px',
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
});

/* Navigation Bar component function */
export default function MiniNavigation() {
  const history = useHistory();

  const classes = useStyles();

  function homeNavigation() {
    history.push('/home');
  }

  function aboutNavigation() {
    history.push('/about');
  }

  function historyNavigation() {
    history.push('/history');
  }

  return document.cookie
    .split(';')
    .some((item) => item.trim().startsWith('ta_uid=')) ? (
    <div
      className={classes.buttonContainer}
      style={{ width: '100%', paddingTop: '0.5rem' }}
    >
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
  ) : (
    ''
  );
}
