import React from 'react';
import { Link } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Box, TextField, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Ellipse from '../manifest/LoginAssets/Ellipse.svg';
import LoginImage from '../manifest/LoginAssets/Login.svg';

import { Col, Container, Form, Modal, Row } from 'react-bootstrap';
import axios from 'axios';
import { useState } from 'react';
import SocialLogin from './SocialLogin';

import './login.css';
const moment = require('moment');

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;

/* Custom Hook to make styles */
const useStyles = makeStyles({
  textFieldBackgorund: {
    backgroundColor: '#FFFFFF',
  },

  buttonImage: {
    backgroundImage: `url(${Ellipse})`,
  },
});

/* Navigation Bar component function */
export default function Login() {
  const classes = useStyles();
  const history = useHistory();

  console.log('In Sign Up page');
  const [loginSuccessful, setLoginSuccessful] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [newFName, setNewFName] = useState('');
  const [newLName, setNewLName] = useState('');
  const [newEmployer, setNewEmployer] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const signupSuccess = () => {
    setLoginSuccessful(true);
    setNewEmail('');
    setNewPassword('');
    setNewFName('');
    setNewLName('');
  };
  const hideSignUp = () => {
    history.push('/');
    setNewPhoneNumber('');
    setNewFName('');
    setNewLName('');
    setNewEmployer('');
  };

  const handleSignUpDone = () => {
    if (
      newEmail === '' ||
      confirmEmail === '' ||
      newPassword === '' ||
      confirmPassword === ''
    ) {
      setErrorMessage('Please fill out all fields');
      return;
    }
    if (newEmail !== confirmEmail) {
      setErrorMessage('Emails must match');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords must match');
      return;
    }
    const ta = {
      email_id: newEmail,
      password: newPassword,
      first_name: newFName,
      last_name: newLName,
      phone_number: newPhoneNumber,
      employer: newEmployer,
      ta_time_zone: moment.tz.guess(),
    };
    axios.get(BASE_URL + 'GetTAEmailId/' + newEmail).then((response) => {
      console.log(response.data);
      if (response.data.message != 'User ID doesnt exist') {
        setAlreadyExists(!alreadyExists);
      } else {
        axios
          .post(BASE_URL + 'addNewTA', ta)
          .then((response) => {
            console.log(response.data);
            if (response.code !== 200) {
              setErrorMessage(response.message);
              return;
              // add validation
            }
            setErrorMessage('');
            signupSuccess();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };
  const required =
    errorMessage === 'Please fill out all fields' ? (
      <span
        style={{
          color: '#E3441F',
          font: 'normal normal normal 11px/12px SFProDisplay-Regular',
        }}
        className="ms-1"
      >
        *
      </span>
    ) : (
      ''
    );

  const alreadyExistsModal = () => {
    const modalStyle = {
      position: 'absolute',
      top: '30%',
      left: '2%',
      width: '400px',
    };
    const headerStyle = {
      border: 'none',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#2C2C2E',
      textTransform: 'uppercase',
      backgroundColor: ' #FFFFFF',
    };
    const footerStyle = {
      border: 'none',
      backgroundColor: ' #FFFFFF',
    };
    const bodyStyle = {
      backgroundColor: ' #FFFFFF',
    };
    return (
      <Modal
        show={alreadyExists}
        onHide={hideAlreadyExists}
        style={{ marginTop: '70px' }}
      >
        <Form as={Container}>
          <Modal.Header style={headerStyle} closeButton>
            <Modal.Title>TA Account Exists</Modal.Title>
          </Modal.Header>

          <Modal.Body style={bodyStyle}>
            <div>
              The TA with email: {newEmail} exists! Please log in to continue
            </div>
          </Modal.Body>

          <Modal.Footer style={footerStyle}>
            <Row
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '1rem',
              }}
            >
              <Col
                xs={6}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Button
                  type="submit"
                  onClick={hideLoginSuccessful}
                  style={{
                    marginTop: '10px',
                    background: '#FF6B4A 0% 0% no-repeat padding-box',
                    borderRadius: '20px',
                    opacity: 1,
                    width: '300px',
                  }}
                >
                  Cancel
                </Button>
              </Col>
              <Col
                xs={6}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Button
                  type="submit"
                  onClick={() => history.push('/aboutus')}
                  style={{
                    background: '#F8BE28 0% 0% no-repeat padding-box',
                    borderRadius: '20px',
                    opacity: 1,
                    width: '300px',
                  }}
                >
                  Log in
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  };
  const hideAlreadyExists = () => {
    //setSignUpModalShow(false);
    setAlreadyExists(!alreadyExists);
    history.push('/aboutus');
  };
  const loginSuccessfulModal = () => {
    const modalStyle = {
      position: 'absolute',
      top: '30%',
      left: '2%',
      width: '400px',
    };
    const headerStyle = {
      border: 'none',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#2C2C2E',
      textTransform: 'uppercase',
      backgroundColor: ' #FFFFFF',
    };
    const footerStyle = {
      border: 'none',
      backgroundColor: ' #FFFFFF',
    };
    const bodyStyle = {
      backgroundColor: ' #FFFFFF',
    };
    return (
      <Modal
        show={loginSuccessful}
        onHide={hideLoginSuccessful}
        style={{ marginTop: '70px' }}
      >
        <Form as={Container}>
          <Modal.Header style={headerStyle} closeButton>
            <Modal.Title>Sign Up Successful</Modal.Title>
          </Modal.Header>

          <Modal.Body style={bodyStyle}>
            <div>
              You have successfully signed up as the TA! Please Login to
              continue!
            </div>
          </Modal.Body>

          <Modal.Footer style={footerStyle}>
            <Row
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '1rem',
              }}
            >
              <Col
                xs={6}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Button
                  type="submit"
                  onClick={hideLoginSuccessful}
                  style={{
                    marginTop: '10px',
                    background: '#FF6B4A 0% 0% no-repeat padding-box',
                    borderRadius: '20px',
                    opacity: 1,
                    width: '300px',
                  }}
                >
                  Cancel
                </Button>
              </Col>
              <Col
                xs={6}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Button
                  type="submit"
                  onClick={() => history.push('/aboutus')}
                  style={{
                    background: '#F8BE28 0% 0% no-repeat padding-box',
                    borderRadius: '20px',
                    opacity: 1,
                    width: '300px',
                  }}
                >
                  Log in
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  };
  const hideLoginSuccessful = () => {
    setLoginSuccessful(false);
  };

  return (
    <Box
      display="flex"
      //flexDirection="column"
      justifyContent="center"
      alignIems="center"
      style={{ width: '100%', height: '100vh', backgroundColor: '#F2F7FC' }}
    >
      {/* <Box style={{ position: 'fixed', top: '100px', left: '-100px' }}>
        <img src={Ellipse} alt="Ellipse" />
      </Box> */}
      <Box style={{ position: 'fixed', top: '100px', left: '-100px' }}>
        <div style={{ position: 'relative', color: 'white' }}>
          <img
            src={Ellipse}
            style={{ width: '120%', height: '100%' }}
            alt="Ellipse"
          />
          <div
            style={{
              position: 'absolute',
              top: '65%',
              left: '40%',
              transform: 'translate(-45%, -50%)',
            }}
            className="main"
          >
            <div style={{ font: 'normal normal bold 20px SF Pro' }}>
              What is Manifest My Life
            </div>
            <p style={{ font: 'normal normal normal 18px SF Pro' }}>
              Sometimes life is better with a Coach or Advisor. Manifest is an
              web app designed for Coaches and Advisors to create customized
              daily routines for their clients thus enabling clients to achieve
              their goals and live their best life.
            </p>
          </div>
        </div>
      </Box>

      <Box
        marginTop="50px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignIems="center"
      >
        <Row
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '500px',
          }}
        >
          {' '}
          <h3
            className="bigfancytext formEltMargin"
            style={{
              textAlign: 'center',
              letterSpacing: '0.49px',
              color: '#000000',
              opacity: 1,
            }}
          >
            Sign Up
          </h3>
        </Row>
        <Row
          hidden={showSignUp}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '500px',
            marginTop: '1rem',
          }}
        >
          <SocialLogin />
        </Row>
        <Row
          hidden={showSignUp}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '500px',
            marginTop: '1rem',
          }}
        >
          <Row
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: '500px',
            }}
          >
            {' '}
            <h3
              className="bigfancytext formEltMargin"
              style={{
                //textAlign: 'center',
                letterSpacing: '0.49px',
                color: '#000000',
                opacity: 1,
              }}
            >
              Or
            </h3>
          </Row>
          <Row
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: '500px',
            }}
          >
            <Button
              variant="primary"
              type="submit"
              onClick={() => setShowSignUp(!showSignUp)}
              style={{
                background: '#F8BE28 0% 0% no-repeat padding-box',
                borderRadius: '20px',
                opacity: 1,
                width: '300px',
                font: 'normal normal bold 16px/19px SF Pro',
                color: '#FFFFFF',
                textTransform: 'none',
              }}
            >
              Continue with Email
            </Button>
          </Row>
        </Row>
        <Row
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '1rem',
          }}
        >
          <Box hidden={!showSignUp}>
            <Form as={Container}>
              <Form.Group className="formEltMargin">
                <Form.Group as={Row} className="formEltMargin">
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="First Name"
                      value={newFName}
                      onChange={(e) => setNewFName(e.target.value)}
                      style={{
                        background: '#FFFFFF 0% 0% no-repeat padding-box',
                        borderRadius: '26px',
                        opacity: 1,
                        width: '230px',
                      }}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="Last Name"
                      value={newLName}
                      onChange={(e) => setNewLName(e.target.value)}
                      style={{
                        background: '#FFFFFF 0% 0% no-repeat padding-box',
                        borderRadius: '26px',
                        opacity: 1,
                        width: '230px',
                      }}
                    />
                  </Col>
                </Form.Group>
                <Col>
                  <Form.Group as={Row} className="formEltMargin">
                    <Form.Control
                      type="text"
                      placeholder="Employer"
                      value={newEmployer}
                      onChange={(e) => setNewEmployer(e.target.value)}
                      style={{
                        background: '#FFFFFF 0% 0% no-repeat padding-box',
                        borderRadius: '26px',
                        opacity: 1,
                        width: '500px',
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group as={Row} className="formEltMargin">
                    <Form.Control
                      type="tel"
                      placeholder="Phone Number"
                      pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                      value={newPhoneNumber}
                      onChange={(e) => setNewPhoneNumber(e.target.value)}
                      style={{
                        background: '#FFFFFF 0% 0% no-repeat padding-box',
                        borderRadius: '26px',
                        opacity: 1,
                        width: '500px',
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group as={Row} className="formEltMargin">
                    {newEmail === '' ? required : ''}
                    <Form.Control
                      type="text"
                      placeholder="Email address"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      style={{
                        background: '#FFFFFF 0% 0% no-repeat padding-box',
                        borderRadius: '26px',
                        opacity: 1,
                        width: '500px',
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group as={Row} className="formEltMargin">
                    {confirmEmail === '' ? required : ''}
                    <Form.Control
                      style={{
                        background: '#FFFFFF 0% 0% no-repeat padding-box',
                        borderRadius: '26px',
                        opacity: 1,
                        width: '500px',
                      }}
                      placeholder="Confirm Email Address"
                      type="email"
                      value={confirmEmail}
                      onChange={(e) => setConfirmEmail(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Form.Group>
              <Col>
                <Form.Group as={Row} className="formEltMargin">
                  {newPassword === '' ? required : ''}
                  <Form.Control
                    type="password"
                    placeholder="Create Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{
                      background: '#FFFFFF 0% 0% no-repeat padding-box',
                      borderRadius: '26px',
                      opacity: 1,
                      width: '500px',
                    }}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group as={Row} className="formEltMargin">
                  {confirmPassword === '' ? required : ''}
                  <Form.Control
                    placeholder="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      background: '#FFFFFF 0% 0% no-repeat padding-box',
                      borderRadius: '26px',
                      opacity: 1,
                      width: '500px',
                    }}
                  />
                </Form.Group>
              </Col>
              <div
                className="text-center"
                style={errorMessage === '' ? { visibility: 'hidden' } : {}}
              >
                <p
                  style={{
                    color: '#E3441F',
                    font: 'normal normal normal 11px/12px SFProDisplay-Regular',
                    fontSize: 'small',
                  }}
                >
                  {errorMessage}
                </p>
              </div>
              <Form.Group className="formEltMargin">
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={handleSignUpDone}
                    style={{
                      background: '#F8BE28 0% 0% no-repeat padding-box',
                      borderRadius: '20px',
                      opacity: 1,
                      width: '300px',
                      font: 'normal normal bold 16px/19px SF Pro',
                      color: '#FFFFFF',
                      textTransform: 'none',
                    }}
                  >
                    Sign Up
                  </Button>

                  <Button
                    variant="primary"
                    type="submit"
                    onClick={hideSignUp}
                    style={{
                      marginTop: '10px',
                      background: '#FF6B4A 0% 0% no-repeat padding-box',
                      borderRadius: '20px',
                      opacity: 1,
                      width: '300px',
                      font: 'normal normal bold 16px/19px SF Pro',
                      color: '#FFFFFF',
                      textTransform: 'none',
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </Form.Group>
            </Form>
          </Box>
        </Row>
        <Row style={{ width: '500px' }}>
          <Col
            xs={8}
            display="flex"
            justifyContent="center"
            marginTop="2rem"
            marginBottom="7.5rem"
            style={{ fontWeight: 'bold' }}
          >
            Already have an account?
          </Col>
          <Col>
            <Button
              onClick={() => history.push('/aboutus')}
              style={{
                width: '7.5rem',
                height: '7.5rem',
                backgroundImage: `url(${LoginImage})`,
              }}
            ></Button>
          </Col>
        </Row>
      </Box>

      {/* <Box
        style={{
          position: 'fixed',
          right: '-100px',
          bottom: '-100px',
          backgroundColor: '#F2F7FC',
        }}
      >
        <img src={Ellipse} alt="Ellipse" />
      </Box> */}
      <Box style={{ position: 'fixed', right: '-30px', bottom: '-50px' }}>
        <div style={{ position: 'relative', color: 'white' }}>
          <img src={Ellipse} style={{ width: '120%' }} alt="Ellipse" />
          <div
            style={{
              position: 'absolute',
              top: '60%',
              left: '40%',
              transform: 'translate(-45%, -50%)',
            }}
            className="text"
          >
            <p style={{ font: 'normal normal normal 18px SF Pro' }}>
              <div
                style={{
                  font: 'normal normal bold 21px SF Pro',
                }}
              >
                How we use your data
              </div>
              Manifest My Life uses social media data to obtain your name,
              modify your calendar, and access your photos. This information
              allows the Coach or Advisor to login, confirm they are modifying
              the correct client’s data, create custom events for the client to
              attend, and enhance the client’s user experience by incorporating
              relevant photos.
              <br />
              <Link
                style={{ color: 'white', textDecoration: 'underline' }}
                to="/privacy"
              >
                View our Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </Box>
      {/* {socialSignUpModal()} */}

      {/* <Box hidden={loggedIn === true}>
                  <Loading/>
            </Box> */}
      {loginSuccessfulModal()}

      {alreadyExistsModal()}
    </Box>
  );
}
