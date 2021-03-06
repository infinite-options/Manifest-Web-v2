import React, { useEffect, useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Button } from '@material-ui/core';
import { Col, Container, Form, Modal, Row } from 'react-bootstrap';

/* Custom Hook to make styles */
const useStyles = makeStyles({
  loginbutton: {
    font: 'normal normal bold 14px Quicksand-Bold',
    color: '#000000',
    marginLeft: '2rem',
    textTransform: 'none',
  },
  buttonLayout: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/* Navigation Bar component function */
export default function Footer() {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Row
      style={{
        background: '#F2F7FC',
        position: 'fixed',
        bottom: 0,
        width: ' 100%',
        height: '2.5rem',
      }}
    >
      <Button
        className={classes.loginbutton}
        onClick={() => history.push('/privacy')}
      >
        Privacy Policy
      </Button>
      <Button
        className={classes.loginbutton}
        onClick={() => history.push('/aboutus')}
      >
        How we use your data
      </Button>
    </Row>
  );
}
