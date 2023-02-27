import React, { useRef, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useHistory } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Box } from '@material-ui/core';

/* Custom Hook to make styles */
const useStyles = makeStyles({
 /* default button style*/ 
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
  /* button group container*/ 
  buttonContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-start',
    textTransform: 'none',
    background: '#F2F7FC 0% 0% no-repeat padding-box',
    paddingBottom: '0.5rem',
  },
  /* active button style*/ 
  activeButton: {
    width: '21%',
    height: '28px',
    textTransform: 'capitalize',
    borderRadius: '0%',
    color: "#fff",
    marginLeft: '.5%',
    marginRight: '.5%',
    background: "#000000 0% 0% no-repeat padding-box",
    border: '1px solid #000000',
    borderRadius: '10px',
  }
});

/* Navigation Bar component function */
export default function MiniNavigation(props) {
  const history = useHistory();

  const classes = useStyles();
  const [ activeButton, setActiveButton ] = useState(props.activeButtonSelection);

  // function homeNavigation() {
  //   history.push('/home');
  // }

  // function aboutNavigation() {
  //   history.push('/about');
  // }

  // function historyNavigation() {
  //   history.push('/history');
  // }

  // return document.cookie
  //   .split(';')
  //   .some((item) => item.trim().startsWith('ta_uid=')) ? (
  //   <div
  //     className={classes.buttonContainer}
  //     style={{ width: '100%', paddingTop: '0.5rem' }}
  //   >
  //     <Button
  //       id="calendar"
  //       className={activeButton === this.id ? `${classes.activeButton}` : classes.buttonSelection}
  //       onClick={homeNavigation}
  //     >
  //       Calendar
  //     </Button>
  //     <Button
  //       id="history"
  //       className={activeButton === this.id ? `${classes.activeButton}` : classes.buttonSelection}
  //       onClick={historyNavigation}
  //     >
  //       History
  //     </Button>
  //     <Button
  //       id="about"
  //       className={activeButton === this.id ? `${classes.activeButton}` : classes.buttonSelection}
  //       onClick={aboutNavigation}
  //     >
  //       About
  //     </Button>

  //     <div style={{ width: '25%' }}></div>
  //   </div>
  // ) : (
  //   ''
  // );


  const clickedButtonHandler = (name) => {
    // setActiveButton(name);
    if (name == "calendar") history.push('/home');
    else history.push('/' + name);
    setActiveButton(name);
  };

  const buttons = ["calendar", "history", "about"];

  return document.cookie
    .split(';')
    .some((item) => item.trim().startsWith('ta_uid=')) ? (
    <Container className={classes.buttonContainer}>
        {buttons.map((name) => (
          <Button
            name={name}
            className={activeButton === name ? `${classes.activeButton}` : classes.buttonSelection}
            onClick={() => clickedButtonHandler(name)}
          >
            {name}
          </Button>
        ))}
    </Container>
  ): (
  ''
  );
}
