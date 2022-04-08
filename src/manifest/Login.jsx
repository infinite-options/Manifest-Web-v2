import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Button } from '@material-ui/core';
import { Col, Container, Form, Modal, Row } from 'react-bootstrap';
import LoginContext from 'LoginContext';
import Events from '../images/Events.png';
import Routines from '../images/Routines.png';
import Goals from '../images/Goals.png';
import Footer from './Footer';
/* Custom Hook to make styles */
const useStyles = makeStyles({
  boxLayout: {
    border: '1px solid #707070',
    borderRadius: '10px',
    backgroundColor: 'rgba(0,0,0,.2)',
    width: '90%',
    padding: '1rem',
    marginTop: '1rem',
    marginBottom: '1rem',
  },
  heading: {
    font: 'normal normal 600 50px Quicksand-Book',
    color: '#000000',
    textAlign: 'center',
    marginTop: '1rem',
  },
  subHeading: {
    font: 'normal normal 600 22px Quicksand-Book',
    color: '#000000',
    textAlign: 'center',
  },
  headers: {
    textAlign: 'left',
    font: 'normal normal 22px Quicksand-Bold',
    color: '#FFFFFF',
  },
  body: {
    textAlign: 'left',
    font: 'normal normal 600 16px Quicksand-Regular',
    color: '#FFFFFF',
  },
  bodyCenter: {
    textAlign: 'center',
    font: 'normal normal 600 16px Quicksand-Regular',
    color: '#FFFFFF',
    marginTop: '1rem',
  },
  signupbuttons: {
    background: '#000000 0% 0% no-repeat padding-box',
    borderRadius: '10px',
    font: 'normal normal bold 16px Quicksand-Bold',
    color: '#ffffff',
    margin: '1rem',
    textTransform: 'none',
  },
  loginbutton: {
    background: '#ffffff 0% 0% no-repeat padding-box',
    borderRadius: '10px',
    font: 'normal normal bold 16px Quicksand-Bold',
    color: '#000000',
    margin: '1rem',
    textTransform: 'none',
  },
  buttonLayout: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLayout: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRight: '2px solid black',
  },
  infoText: {
    marginTop: '0.5rem',
    textAlign: 'center',
    font: 'normal normal 600 16px Quicksand-Regular',
    color: '#000000',
    width: '80%',
  },
  infoImage: {
    width: '100px',
    height: '100px',
  },
});

/* Navigation Bar component function */
export default function Login() {
  const loginContext = useContext(LoginContext);
  console.log('in login page');
  const classes = useStyles();
  const history = useHistory();

  return (
    <div style={{ background: '#F2F7FC', height: '100vh' }}>
      <div
        fluid
        style={{
          backgroundImage: `url(${'login_background.jpg'})`,
          width: '100%',
          backgroundSize: 'cover',
          overflow: 'hidden',
          height: '60vh',
          backgroundPosition: 'center',
          justifyContent: 'center',
        }}
      >
        <Row
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            margin: 0,
            padding: 0,
          }}
        >
          <Row className={classes.heading}>Welcome to Manifest My Life</Row>
          <br />
          <Row className={classes.subHeading}>
            A little help to manage your everyday
          </Row>
          <Row className={classes.boxLayout}>
            <Row xs={12} style={{ width: '100%' }}>
              <Col xs={6} style={{ borderRight: '2px solid white' }}>
                <div className={classes.headers}>Trusted Advisors</div>
              </Col>
              <Col xs={6}>
                <div className={classes.headers} style={{ marginLeft: '1rem' }}>
                  Users
                </div>
              </Col>
            </Row>
            <Row xs={12} style={{ width: '100%' }}>
              <Col xs={6} style={{ borderRight: '2px solid white' }}>
                <div className={classes.body}>
                  Help your loved ones remember the important things. Trusted
                  advisors can help assign events, routines, and goals to make
                  everyday easier for the ones you care about.
                </div>
              </Col>
              <Col xs={6}>
                <div className={classes.body} style={{ marginLeft: '1rem' }}>
                  Alongside a Trusted Advisor, manage and organize your day to
                  get the most out of your time.
                </div>
              </Col>
            </Row>
            <Row xs={12} style={{ width: '100%' }}>
              <Col xs={6} style={{ borderRight: '2px solid white' }}>
                <div className={classes.bodyCenter}>
                  Create a Trusted Advisor Account
                </div>
              </Col>
              <Col xs={6}>
                <div
                  className={classes.bodyCenter}
                  style={{ marginLeft: '1rem' }}
                >
                  Create a User Account on mobile
                </div>
              </Col>
            </Row>
            <Row xs={12} style={{ width: '100%' }}>
              <Col xs={6} className={classes.buttonLayout}>
                <Button
                  className={classes.signupbuttons}
                  onClick={() => history.push('/signup')}
                >
                  Sign Up
                </Button>
                <Button
                  className={classes.loginbutton}
                  onClick={() => history.push('/addUser')}
                >
                  Log In
                </Button>
              </Col>
              <Col xs={6} className={classes.buttonLayout}>
                <Button
                  className={classes.signupbuttons}
                  onClick={() => history.push('/addUser')}
                >
                  Sign Up
                </Button>
              </Col>
            </Row>
            <Row style={{ justifyContent: 'center' }}>
              <Col xs={8} className={classes.bodyCenter}>
                With the use of Manifest's web application, the Trusted Advisor
                can assign events, routines, and goals to the patients schedule
                which they can then access on the mobile application.
              </Col>
            </Row>
          </Row>
        </Row>
      </div>
      <Row
        style={{
          display: 'flex',
          justifyContent: 'space-evenly',
          marginTop: '1rem',
        }}
      >
        <Col xs={4} className={classes.infoLayout}>
          <img className={classes.infoImage} src={Events} />
          <div className={classes.infoText}>Events</div>
          <div className={classes.infoText}>
            Schedule events and never forget another appointment or meeting
            again.
          </div>
        </Col>
        <Col xs={4} className={classes.infoLayout}>
          <img className={classes.infoImage} src={Routines} />
          <div className={classes.infoText}>Routines</div>
          <div className={classes.infoText}>
            Manage your day by creating routines with actionable steps and
            scheduling.
          </div>
        </Col>
        <Col xs={4} className={classes.infoLayout}>
          <img className={classes.infoImage} src={Goals} />
          <div className={classes.infoText}>Goals</div>
          <div className={classes.infoText}>
            Create goals to help motivate yourself to get what you need to get
            done.
          </div>
        </Col>
      </Row>
      <Footer />
    </div>
  );
}
