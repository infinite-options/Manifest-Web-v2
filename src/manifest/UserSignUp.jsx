import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GoogleLogin } from 'react-google-login';
import { useHistory, Link } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TimezoneSelect from 'react-timezone-select';
import { Button, TextField, InputAdornment } from '@material-ui/core';
import { Col, Container, Form, Modal, Row } from 'react-bootstrap';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Events from '../images/Events.png';
import Routines from '../images/Routines.png';
import Goals from '../images/Goals.png';
import Email from '../manifest/LoginAssets/Email.svg';
import Google from '../manifest/LoginAssets/Google.svg';
import Apple from '../manifest/LoginAssets/AppleSignUp.svg';
import GooglePlayStore from '../manifest/LoginAssets/GooglePlayStore.png';
import AppleAppStore from '../manifest/LoginAssets/AppleAppStore.png';
import BackArrow from '../manifest/LoginAssets/Back_arrow.svg';
import LoginContext from 'LoginContext';
import Footer from './Footer';

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;
let CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID_SPACE;
let CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET_SPACE;

/* Custom Hook to make styles */
const useStyles = makeStyles({
  boxLayout: {
    border: '1px solid #707070',
    borderRadius: '10px',
    backgroundColor: 'rgba(0,0,0,.2)',
    maxWidth: '90%',
    width: '50%',
    padding: '1rem',
    marginTop: '1rem',
    marginBottom: '1rem',
  },
  heading: {
    font: 'normal normal 600 50px Quicksand-Book',
    color: '#000000',
    textAlign: 'center',
    marginTop: '1rem',
    paddingLeft: '7rem',
  },
  backArrowImage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '1rem',
    width: '50px',
    height: '50px',
    cursor: 'pointer',
  },
  subHeading: {
    font: 'normal normal 600 22px Quicksand-Book',
    color: '#000000',
    textAlign: 'center',
  },
  headers: {
    textAlign: 'center',
    font: 'normal normal 22px Quicksand-Bold',
    color: '#FFFFFF',
    marginBottom: '1rem',
  },
  body: {
    textAlign: 'center',
    font: 'normal normal 600 16px Quicksand-Regular',
    color: '#FFFFFF',
  },
  bodyCenter: {
    textAlign: 'center',
    font: 'normal normal 600 16px Quicksand-Regular',
    color: '#FFFFFF',
    margin: '0.5rem 0rem',
  },
  bodylogin: {
    textAlign: 'center',
    font: 'normal normal 600 13px Quicksand-Regular',
    color: '#FFFFFF',
    marginTop: '0.3rem',
  },
  bodyLink: {
    textAlign: 'center',
    font: 'normal normal 600 13px Quicksand-Regular',
    color: '#FFFFFF',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  loginbuttons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginbutton: {
    background: '#000000 0% 0% no-repeat padding-box',
    borderRadius: '10px',
    font: 'normal normal  16px Quicksand-Regular',
    color: '#ffffff',
    textTransform: 'none',
    width: '100%',
    marginTop: '0.3rem',
  },
  buttonLayout: { width: '100%', padding: '0', margin: '0' },
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
    width: '80px',
    height: '80px',
  },
  textfield: {
    background: '#FFFFFF',
    borderRadius: '10px',
    marginBottom: '0.2rem',
  },
  signupbuttons: {
    background: '#ffffff 0% 0% no-repeat padding-box',
    borderRadius: '10px',
    font: 'normal normal bold 16px Quicksand-Bold',
    color: '#000000',
    textTransform: 'none',
    width: '100%',
    marginTop: '0.3rem',
  },
});

/* Navigation Bar component function */
export default function UserSignUp() {
  console.log('in user signup page');
  const classes = useStyles();
  const history = useHistory();
  const loginContext = useContext(LoginContext);
  const [emailSignup, setEmailSignup] = useState(false);
  const [signupSuccessful, setSignupSuccessful] = useState(false);
  const [passVisible, setPassvisble] = React.useState({
    password: '',
    showPassword: false,
  });
  const handleClickShowPassword = () => {
    setPassvisble({ ...passVisible, showPassword: !passVisible.showPassword });
  };

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
  const [socialSignUpModalShow, setSocialSignUpModalShow] = useState(false);
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

  useEffect(() => {
    window.AppleID.auth.init({
      clientId: process.env.REACT_APP_APPLE_CLIENT_ID, // This is the service ID we created.
      scope: 'name email', // To tell apple we want the user name and emails fields in the response it sends us.
      redirectURI: process.env.REACT_APP_USER_APPLE_REDIRECT_URI, // As registered along with our service ID
      // state: 'origin:web', // Any string of your choice that you may use for some logic. It's optional and you may omit it.
      usePopup: true, // Important if we want to capture the data apple sends on the client side.
    });
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
      // redirect_uri: 'http://localhost:3000',
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
      font: 'normal normal 600 20px Quicksand-Book',
      textTransform: 'uppercase',
      backgroundColor: ' #F2F7FC',
      padding: '1rem',
    };
    const footerStyle = {
      border: 'none',
      backgroundColor: ' #F2F7FC',
    };
    const bodyStyle = {
      backgroundColor: ' #F2F7FC',
    };
    return (
      <Modal
        show={alreadyExists}
        onHide={hideAlreadyExists}
        style={{ marginTop: '70px', padding: 0 }}
      >
        <Form>
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
                  className={classes.signupbuttons}
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
      font: 'normal normal 600 20px Quicksand-Book',
      textTransform: 'uppercase',
      backgroundColor: ' #F2F7FC',
      padding: '1rem',
    };
    const footerStyle = {
      border: 'none',
      backgroundColor: ' #F2F7FC',
    };
    const bodyStyle = {
      backgroundColor: ' #F2F7FC',
      font: 'normal normal 600 16px Quicksand-Regular',
    };
    return (
      <Modal
        show={socialSignUpModalShow}
        onHide={hideSignUp}
        style={{ marginTop: '70px', padding: 0 }}
      >
        <Form>
          <Modal.Header style={headerStyle} closeButton>
            <Modal.Title>Sign Up with social media</Modal.Title>
          </Modal.Header>
          <Modal.Body style={bodyStyle}>
            <Form.Group>
              <Form.Group>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="First Name"
                    value={newFName}
                    onChange={(e) => setNewFName(e.target.value)}
                    className={classes.textfield}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Last Name"
                    value={newLName}
                    onChange={(e) => setNewLName(e.target.value)}
                    className={classes.textfield}
                  />
                </Col>
              </Form.Group>

              <Col>
                <Form.Group>
                  <Form.Control
                    plaintext
                    readOnly
                    value={newEmail}
                    className={classes.textfield}
                  />
                </Form.Group>
              </Col>
            </Form.Group>
            <Col>
              <TimezoneSelect
                value={selectedTimezone}
                onChange={setSelectedTimezone}
              />
            </Col>
          </Modal.Body>
          <Modal.Footer style={footerStyle}>
            <Row
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '1rem',
                width: '100%',
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
                  onClick={handleSocialSignUpDone}
                  className={classes.loginbutton}
                >
                  Sign Up
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
                <Button onClick={hideSignUp} className={classes.signupbuttons}>
                  Cancel
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  };
  const hideSignUp = () => {
    //setSignUpModalShow(false);
    setSocialSignUpModalShow(false);
    // history.push('/');
    setEmailSignup(false);
    // setRegisterSuccess(true);
    setNewEmail('');
    setNewPassword('');
    setNewFName('');
    setNewLName('');
    setConfirmEmail('');
    setConfirmPassword('');
    setNewPassword('');
    setSelectedTimezone('');
  };

  const hideAlreadyExists = () => {
    //setSignUpModalShow(false);
    setAlreadyExists(!alreadyExists);
    history.push('/');
  };

  const signupSuccess = () => {
    //setSignUpModalShow(false);
    setSocialSignUpModalShow(false);
    setEmailSignup(false);
    setSignupSuccessful(true);
    // setRegisterSuccess(true);
    setNewEmail('');
    setNewPassword('');
    setNewFName('');
    setNewLName('');
    setErrorMessage('');
  };
  console.log('emailsignup', emailSignup, signupSuccessful);
  const handleSocialSignUpDone = () => {
    if (
      (newEmail === '' ||
        confirmEmail === '' ||
        newPassword === '' ||
        confirmPassword === '') &&
      emailSignup == true
    ) {
      console.log('in if');
      setErrorMessage('Please fill out all fields');
      return;
    }
    if (newEmail !== confirmEmail && emailSignup == true) {
      setErrorMessage('Emails must match');
      return;
    }
    if (newPassword !== confirmPassword && emailSignup == true) {
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
          setSignupSuccessful(true);
          if (response.status != 200) {
            setErrorMessage(response.message);
            return;
            // add validation
          }
          console.log('in else');
          signupSuccess();

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
    <div
      style={{
        flex: 1,
        background: '#F2F7FC',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      <div
        fluid
        style={{
          backgroundImage: `url(${'login_background.jpg'})`,
          width: '100%',
          backgroundSize: 'cover',
          minHeight: '60vh',
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
          <Row style={{ width: '100%' }}>
            <Col className={classes.backArrowImage}>
              <img src={BackArrow} onClick={() => history.push('/')} />
            </Col>
            <Col xs={10} className={classes.heading}>
              Welcome to Manifest My Life
            </Col>
            <Col></Col>
          </Row>
          <br />
          <Row className={classes.subHeading}>
            A little help to manage your everyday
          </Row>
          {signupSuccessful === false ? (
            <Row className={classes.boxLayout}>
              <Row
                xs={12}
                className={classes.buttonLayout}
                hidden={emailSignup}
              >
                <Row xs={12} className={classes.buttonLayout}>
                  <Col></Col>
                  <Col xs={8} className={classes.loginbuttons}>
                    <div className={classes.body}>
                      Users please sign up using one of the following methods:
                    </div>
                  </Col>
                  <Col></Col>
                </Row>
                <Row xs={12} className={classes.buttonLayout}>
                  <Col></Col>
                  <Col xs={8} className={classes.loginbuttons}>
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
                            style={{
                              minWidth: '70%',
                              maxWidth: '70%',
                              padding: '0',
                              margin: '0',
                            }}
                          ></img>
                        )}
                      />
                    </Button>
                  </Col>
                  <Col></Col>
                </Row>
                <Row xs={12} className={classes.buttonLayout}>
                  <Col></Col>
                  <Col xs={8} className={classes.loginbuttons}>
                    <Button>
                      <img
                        src={Apple}
                        variant="contained"
                        alt={''}
                        style={{
                          minWidth: '70%',
                          maxWidth: '70%',
                          padding: '0',
                          margin: '0',
                        }}
                        onClick={() => {
                          window.AppleID.auth.signIn();
                        }}
                      ></img>
                    </Button>
                  </Col>
                  <Col></Col>
                </Row>
                <Row xs={12} className={classes.buttonLayout}>
                  <Col></Col>
                  <Col xs={8} className={classes.loginbuttons}>
                    <Button>
                      <img
                        src={Email}
                        alt={''}
                        style={{
                          minWidth: '70%',
                          maxWidth: '70%',
                          padding: '0',
                          margin: '0',
                        }}
                        onClick={() => {
                          setEmailSignup(!emailSignup);
                        }}
                      ></img>
                    </Button>
                  </Col>
                  <Col></Col>
                </Row>
                <Row xs={12} className={classes.buttonLayout}>
                  <Col></Col>
                  <Col xs={8} className={classes.bodylogin}>
                    Already have an account? Please contact your Trusted
                    Advisor.
                  </Col>
                  <Col></Col>
                </Row>
              </Row>
              <Row className={classes.buttonLayout} hidden={!emailSignup}>
                <Row className={classes.buttonLayout}>
                  <Col></Col>
                  <Col xs={8} className={classes.headers}>
                    Sign Up
                  </Col>
                  <Col></Col>
                </Row>
                <Row className={classes.buttonLayout}>
                  <Col></Col>
                  <Col
                    xs={8}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Col
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        margin: 0,
                        marginRight: '5px',
                        padding: 0,
                      }}
                    >
                      <TextField
                        className={classes.textfield}
                        variant="outlined"
                        type="text"
                        placeholder="First Name"
                        value={newFName}
                        onChange={(e) => setNewFName(e.target.value)}
                        size="small"
                        fullWidth={true}
                      />
                    </Col>
                    <Col
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        margin: 0,
                        marginLeft: '5px',
                        padding: 0,
                      }}
                    >
                      <TextField
                        className={classes.textfield}
                        variant="outlined"
                        type="text"
                        placeholder="Last Name"
                        value={newLName}
                        onChange={(e) => setNewLName(e.target.value)}
                        size="small"
                        fullWidth={true}
                      />
                    </Col>
                  </Col>

                  <Col></Col>
                </Row>
                <Row className={classes.buttonLayout}>
                  <Col></Col>
                  <Col xs={8}>
                    <Form.Group>
                      <div
                        style={{
                          opacity: 1,
                          background: '#FFFFFF',
                          borderRadius: '10px',
                          alignItems: 'center',
                        }}
                      >
                        <TimezoneSelect
                          value={selectedTimezone}
                          onChange={setSelectedTimezone}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col></Col>
                </Row>
                <Row className={classes.buttonLayout}>
                  <Col></Col>
                  <Col xs={8}>
                    {newEmail === '' ? required : ''}
                    <TextField
                      className={classes.textfield}
                      variant="outlined"
                      type="email"
                      label="Email address"
                      size="small"
                      fullWidth={true}
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                  </Col>
                  <Col></Col>
                </Row>
                <Row className={classes.buttonLayout}>
                  <Col></Col>
                  <Col xs={8}>
                    {confirmEmail === '' ? required : ''}
                    <TextField
                      className={classes.textfield}
                      variant="outlined"
                      type="email"
                      label="Confirm email address"
                      size="small"
                      fullWidth={true}
                      value={confirmEmail}
                      onChange={(e) => setConfirmEmail(e.target.value)}
                    />
                  </Col>
                  <Col></Col>
                </Row>

                <Row className={classes.buttonLayout}>
                  <Col></Col>
                  <Col xs={8}>
                    {newPassword === '' ? required : ''}
                    <TextField
                      className={classes.textfield}
                      variant="outlined"
                      label="Password"
                      size="small"
                      type={passVisible.showPassword ? 'text' : 'password'}
                      fullWidth={true}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {passVisible.showPassword ? (
                              <VisibilityIcon
                                onClick={handleClickShowPassword}
                                style={{ color: '#797D83' }}
                                aria-hidden="false"
                              />
                            ) : (
                              <VisibilityOff
                                onClick={handleClickShowPassword}
                                style={{ color: '#797D83' }}
                                aria-hidden="false"
                              ></VisibilityOff>
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Col>
                  <Col></Col>
                </Row>
                <Row className={classes.buttonLayout}>
                  <Col></Col>
                  <Col xs={8}>
                    {confirmPassword === '' ? required : ''}
                    <TextField
                      className={classes.textfield}
                      variant="outlined"
                      label="Confirm Password"
                      size="small"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      type={passVisible.showPassword ? 'text' : 'password'}
                      fullWidth={true}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {passVisible.showPassword ? (
                              <VisibilityIcon
                                onClick={handleClickShowPassword}
                                style={{ color: '#797D83' }}
                                aria-hidden="false"
                              />
                            ) : (
                              <VisibilityOff
                                onClick={handleClickShowPassword}
                                style={{ color: '#797D83' }}
                                aria-hidden="false"
                              ></VisibilityOff>
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Col>
                  <Col></Col>
                </Row>

                <Row
                  className={classes.buttonLayout}
                  color="red"
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
                </Row>
                <Row className={classes.buttonLayout}>
                  <Col></Col>
                  <Col
                    xs={8}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Col>
                      <Button
                        className={classes.loginbutton}
                        onClick={handleSocialSignUpDone}
                      >
                        Sign Up
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        onClick={hideSignUp}
                        className={classes.signupbuttons}
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Col>
                  <Col></Col>
                </Row>
                <Row xs={12} className={classes.buttonLayout}>
                  <Col></Col>
                  <Col className={classes.bodylogin} xs={10}>
                    Already have an account? Please contact your Trusted
                    Advisor.
                  </Col>
                  <Col></Col>
                </Row>
              </Row>
            </Row>
          ) : (
            <Row className={classes.boxLayout}>
              <Row className={classes.buttonLayout}>
                <Row className={classes.buttonLayout}>
                  <Col></Col>
                  <Col className={classes.headers} xs={10}>
                    User Sign Up Successful
                  </Col>
                  <Col></Col>
                </Row>
                <Row className={classes.buttonLayout}>
                  <Col></Col>
                  <Col className={classes.body} xs={10}>
                    Your next step is to download our Mobile App. You can begin
                    using Manifest once your Trusted Advisor adds Goals,
                    Routines and Event to your schedule. <br /> Thanks for
                    Signing Up!
                  </Col>
                  <Col></Col>
                </Row>
                <Row className={classes.buttonLayout}>
                  <Col xs={1}></Col>
                  <Col
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: '1rem',
                    }}
                  >
                    <Col>
                      <a
                        href="https://apps.apple.com/us/app/manifest-mylife/id1523013751"
                        target="_blank"
                      >
                        <img
                          className="img"
                          src={AppleAppStore}
                          style={{
                            width: '217px',
                            height: '65px',
                            objectFit: 'cover',
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
                            width: '217px',
                            // height: '74px',
                            objectFit: 'cover',
                          }}
                        />
                      </a>
                    </Col>
                  </Col>
                  <Col xs={1}></Col>
                </Row>
              </Row>
            </Row>
          )}
          <Row style={{ justifyContent: 'center' }}>
            <Col xs={8} className={classes.bodyCenter}>
              With the use of Manifest's web application, the Trusted Advisor
              can assign events, routines, and goals to the patients schedule
              which they can then access on the mobile application.
            </Col>
          </Row>
        </Row>
      </div>
      <Row
        style={{
          display: 'flex',
          justifyContent: 'space-evenly',
          marginTop: '1rem',
          paddingBottom: '3rem',
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
      {socialSignUpModal()}
      {alreadyExistsModal()}
    </div>
  );
}
