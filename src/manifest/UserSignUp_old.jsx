import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import TimezoneSelect from 'react-timezone-select';
import { Box, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Ellipse from '../manifest/LoginAssets/Ellipse.svg';
import Google from '../manifest/LoginAssets/Google.svg';
import Apple from '../manifest/LoginAssets/Apple.svg';
import GooglePlayStore from '../manifest/LoginAssets/GooglePlayStore.png';
import AppleAppStore from '../manifest/LoginAssets/AppleAppStore.png';
import LoginContext from 'LoginContext';
import './login.css';

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;
let CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID_SPACE;
let CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET_SPACE;
export default function UserSignUp() {
  const history = useHistory();
  const loginContext = useContext(LoginContext);
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [newFName, setNewFName] = useState('');
  const [newLName, setNewLName] = useState('');
  const [selectedTimezone, setSelectedTimezone] = useState({});
  const [socialId, setSocialId] = useState('');
  const [refreshToken, setrefreshToken] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [accessExpiresIn, setaccessExpiresIn] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);
  const [socialSignUpModalShow, setSocialSignUpModalShow] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);
  let redirecturi = 'https://manifestmy.space';
  useEffect(() => {
    if (BASE_URL.substring(8, 18) == 'gyn3vgy3fb') {
      console.log('base_url', BASE_URL.substring(8, 18));
      CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID_SPACE;
      CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET_SPACE;
      console.log(CLIENT_ID, CLIENT_SECRET);
    } else {
      console.log('base_url', BASE_URL.substring(8, 18));
      CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID_LIFE;
      CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET_LIFE;
      console.log(CLIENT_ID, CLIENT_SECRET);
    }
  }, [loginContext.loginState.reload]);

  const responseGoogle = (response) => {
    console.log('response', response);

    let auth_code = response.code;
    let authorization_url = 'https://accounts.google.com/o/oauth2/token';

    if (BASE_URL.substring(8, 18) == 'gyn3vgy3fb') {
      console.log('base_url', BASE_URL.substring(8, 18));
      CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID_SPACE;
      CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET_SPACE;

      console.log(CLIENT_ID, CLIENT_SECRET);
    } else {
      console.log('base_url', BASE_URL.substring(8, 18));
      CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID_LIFE;
      CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET_LIFE;

      console.log(CLIENT_ID, CLIENT_SECRET);
    }
    if (BASE_URL.substring(8, 18) == '3s3sftsr90') {
      console.log('base_url', BASE_URL.substring(8, 18));
      redirecturi = 'https://manifestmy.space';
    } else {
      console.log('base_url', BASE_URL.substring(8, 18));
      redirecturi = 'https://manifestmy.life';
    }

    console.log('auth_code', auth_code);
    var details = {
      code: auth_code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      //  redirect_uri: 'http://localhost:3000',
      redirect_uri: redirecturi,
      grant_type: 'authorization_code',
    };

    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    fetch(authorization_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: formBody,
    })
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        console.log(responseData);
        return responseData;
      })
      .then((data) => {
        console.log(data);
        let at = data['access_token'];
        let rt = data['refresh_token'];
        let ax = data['expires_in'];
        setAccessToken(at);
        setrefreshToken(rt);
        setaccessExpiresIn(ax);
        console.log('res', at, rt);

        axios
          .get(
            'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' +
              at
          )
          .then((response) => {
            console.log(response.data);

            let data = response.data;
            //setUserInfo(data);
            let e = data['email'];
            let fn = data['given_name'];
            let ln = data['family_name'];
            let si = data['id'];

            setNewEmail(e);
            setNewFName(fn);
            setNewLName(ln);
            setSocialId(si);
            axios.get(BASE_URL + 'GetUserEmailId/' + e).then((response) => {
              console.log(response.data);
              if (response.data.message === 'User ID doesnt exist') {
                setSocialSignUpModalShow(!socialSignUpModalShow);
              } else {
                setAlreadyExists(!alreadyExists);
              }
            });
          })
          .catch((error) => {
            console.log('its in landing page');
            console.log(error);
          });

        // setSocialSignUpModalShow(!socialSignUpModalShow);

        return (
          accessToken,
          refreshToken,
          accessExpiresIn,
          newEmail,
          newFName,
          newLName,
          socialId
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
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
            <Modal.Title>User Account Exists</Modal.Title>
          </Modal.Header>

          <Modal.Body style={bodyStyle}>
            <div>
              The User with email: {newEmail} exists! Please contact your TA for
              further details!
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
              ></Col>
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
                  onClick={hideAlreadyExists}
                  style={{
                    background: '#4D94FF 0% 0% no-repeat padding-box',
                    borderRadius: '20px',
                    opacity: 1,
                    width: '300px',
                  }}
                >
                  Okay
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  };
  const socialSignUpModal = () => {
    return (
      <Modal
        show={socialSignUpModalShow}
        onHide={hideSignUp}
        style={{ marginTop: '70px' }}
      >
        <Form as={Container}>
          <h3
            className="bigfancytext formEltMargin"
            style={{
              textAlign: 'center',
              letterSpacing: '0.49px',
              color: '#000000',
              opacity: 1,
            }}
          >
            Sign Up with Social Media
          </h3>
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
                  plaintext
                  readOnly
                  value={newEmail}
                  style={{
                    background: '#FFFFFF 0% 0% no-repeat padding-box',
                    borderRadius: '26px',
                    opacity: 1,
                    width: '500px',
                  }}
                />
              </Form.Group>
            </Col>
          </Form.Group>
          <Col>
            <Form.Group as={Row} className="formEltMargin">
              <div
                className="select-wrapper"
                style={{
                  background: '#FFFFFF 0% 0% no-repeat padding-box',
                  borderRadius: '26px',
                  opacity: 1,
                  width: '500px',
                }}
              >
                <TimezoneSelect
                  value={selectedTimezone}
                  onChange={setSelectedTimezone}
                />
              </div>
            </Form.Group>
          </Col>
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
                onClick={handleSocialSignUpDone}
                style={{
                  background: '#4D94FF 0% 0% no-repeat padding-box',
                  borderRadius: '20px',
                  opacity: 1,
                  width: '300px',
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
                  background: '#FFB84D 0% 0% no-repeat padding-box',
                  borderRadius: '20px',
                  opacity: 1,
                  width: '300px',
                }}
              >
                Cancel
              </Button>
            </div>
          </Form.Group>
        </Form>
      </Modal>
    );
  };
  const hideSignUp = () => {
    //setSignUpModalShow(false);
    setSocialSignUpModalShow(false);
    history.push('/');
    // setRegisterSuccess(true);
    setNewEmail('');
    setNewPassword('');
    setNewFName('');
    setNewLName('');
  };

  const hideAlreadyExists = () => {
    //setSignUpModalShow(false);
    setAlreadyExists(!alreadyExists);
    history.push('/');
  };

  const signupSuccess = () => {
    //setSignUpModalShow(false);
    setSocialSignUpModalShow(false);
    setShowSignUp(false);
    setRegisterSuccess(true);
    setNewEmail('');
    setNewPassword('');
    setNewFName('');
    setNewLName('');
    setErrorMessage('');
  };
  console.log('socialSignUpModalShow', socialSignUpModalShow);
  console.log('showSignUp', showSignUp);
  console.log('registerSuccess', registerSuccess);
  const handleSocialSignUpDone = () => {
    if (
      (newEmail === '' ||
        confirmEmail === '' ||
        newPassword === '' ||
        confirmPassword === '') &&
      showSignUp == true
    ) {
      console.log('in if');
      setErrorMessage('Please fill out all fields');
      return;
    }
    if (newEmail !== confirmEmail && showSignUp == true) {
      setErrorMessage('Emails must match');
      return;
    }
    if (newPassword !== confirmPassword && showSignUp == true) {
      setErrorMessage('Passwords must match');
      return;
    }
    const user = {
      email_id: newEmail,
      password: newPassword,
      first_name: newFName,
      last_name: newLName,
      time_zone: selectedTimezone.value,
      google_auth_token: accessToken,
      google_refresh_token: refreshToken,
      social_id: socialId,
      access_expires_in: accessExpiresIn.toString(),
      ta_people_id: '200-000001',
    };
    console.log('user', user);
    if (accessToken.length > 0) {
      console.log('in if google');
      axios
        .post(BASE_URL + 'addNewUser', user)
        .then((response) => {
          console.log(response);
          if (response.status != 200) {
            setErrorMessage(response.message);
            return;
            // add validation
          } else {
            console.log('in else');
            signupSuccess();
          }
          // setErrorMessage('');
        })
        .catch((error) => {
          console.log('its in landing page');
          console.log(error);
        });
    } else {
      console.log('in else');
      axios.get(BASE_URL + 'GetUserEmailId/' + newEmail).then((response) => {
        console.log(response.data);
        if (response.data.message != 'User ID doesnt exist') {
          setAlreadyExists(!alreadyExists);
        } else {
          axios
            .post(BASE_URL + 'addNewUser', user)
            .then((response) => {
              console.log(response);
              if (response.status != 200) {
                setErrorMessage(response.message);
                return;
                // add validation
              } else {
                console.log('in else');
                signupSuccess();
              }
              // setErrorMessage('');
            })
            .catch((error) => {
              console.log('its in landing page');
              console.log(error);
            });
        }
      });
    }
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

  return (
    <Box
      display="flex"
      //flexDirection="column"
      justifyContent="center"
      alignIems="center"
      style={{ width: '100%', height: '100vh', backgroundColor: '#F2F7FC' }}
    >
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
      {!registerSuccess ? (
        <Box
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
              User Sign Up
            </h3>
          </Row>
          <Row
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: '500px',
              marginTop: '1rem',
            }}
            hidden={showSignUp}
          >
            {' '}
            <Box
              display="flex"
              flexDirection="column"
              style={{ width: '15rem' }}
            >
              <Box
                display="flex"
                justifyContent="center"
                flexDirection="column"
                marginTop="1rem"
              >
                <div>
                  <Button>
                    <GoogleLogin
                      //clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                      //clientId={CLIENT_ID}
                      clientId={
                        BASE_URL.substring(8, 18) == 'gyn3vgy3fb'
                          ? process.env.REACT_APP_GOOGLE_CLIENT_ID_SPACE
                          : process.env.REACT_APP_GOOGLE_CLIENT_ID_LIFE
                      }
                      accessType="offline"
                      prompt="consent"
                      responseType="code"
                      buttonText="Log In"
                      ux_mode="redirect"
                      isSignedIn={false}
                      disable={true}
                      cookiePolicy={'single_host_origin'}
                      redirectUri={
                        BASE_URL.substring(8, 18) == '3s3sftsr90'
                          ? 'https://manifestmy.space'
                          : 'https://manifestmy.life'
                      }
                      scope="https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/photoslibrary.readonly"
                      // redirectUri="http://localhost:3000"
                      onSuccess={responseGoogle}
                      onFailure={responseGoogle}
                      render={(renderProps) => (
                        <img
                          src={Google}
                          onClick={renderProps.onClick}
                          disabled={renderProps.disabled}
                          alt={''}
                          style={{ width: '100%' }}
                        ></img>
                      )}
                    />
                  </Button>
                </div>
                <div>
                  <Button>
                    <img
                      src={Apple}
                      variant="contained"
                      alt={''}
                      style={{ width: '100%' }}
                      onClick={() => {
                        window.AppleID.auth.signIn();
                      }}
                    ></img>
                  </Button>
                </div>
              </Box>
            </Box>
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
                  background: '#4D94FF 0% 0% no-repeat padding-box',
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
                      <div
                        className="select-wrapper"
                        style={{
                          background: '#FFFFFF 0% 0% no-repeat padding-box',
                          borderRadius: '26px',
                          opacity: 1,
                          width: '500px',
                        }}
                      >
                        <TimezoneSelect
                          value={selectedTimezone}
                          onChange={setSelectedTimezone}
                        />
                      </div>
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
                      onClick={handleSocialSignUpDone}
                      style={{
                        background: '#4D94FF 0% 0% no-repeat padding-box',
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
                        background: '#FFB84D 0% 0% no-repeat padding-box',
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
        </Box>
      ) : (
        <Box
          marginTop="-20%"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Row
            style={{ fontSize: '40px', fontWeight: 'bold', marginTop: '1rem' }}
          >
            Registration Successful!
          </Row>
          <Row
            style={{ fontSize: '40px', fontWeight: 'bold', marginTop: '1rem' }}
          >
            Welcome to Manifest
          </Row>
          <Row style={{ fontSize: '20px', marginTop: '1rem' }}>
            Please download the Mobile App
          </Row>
          <Row style={{ marginTop: '1rem' }}>
            <Col>
              <a
                href="https://apps.apple.com/us/app/manifest-mylife/id1523013751"
                target="_blank"
              >
                <img
                  className="img"
                  src={AppleAppStore}
                  style={{
                    width: '177px',
                    height: '70px',
                  }}
                />
              </a>
            </Col>
            <Col>
              <a
                href="https://play.google.com/store/apps/details?id=com.infiniteoptions_manifestmy.life"
                target="_blank"
              >
                <img
                  className="img"
                  src={GooglePlayStore}
                  style={{
                    width: '177px',
                    height: '70px',
                  }}
                />
              </a>
            </Col>
          </Row>
          <Row style={{ fontSize: '20px', marginTop: '1rem' }}>
            Wait for your Trusted Advisor to add Goals, Routines and Events to
            your schedule.
          </Row>
        </Box>
      )}

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
      {socialSignUpModal()}
      {alreadyExistsModal()}

      {/* <Box hidden={loggedIn === true}>
                  <Loading/>
            </Box> */}
    </Box>
  );
}
