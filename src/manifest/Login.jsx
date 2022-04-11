import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  Button,
  TextField,
  Typography,
  InputAdornment,
} from '@material-ui/core';
import { Col, Container, Form, Modal, Row } from 'react-bootstrap';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import LoginContext from 'LoginContext';
import Events from '../images/Events.png';
import Routines from '../images/Routines.png';
import Goals from '../images/Goals.png';
import Google from '../manifest/LoginAssets/Google.svg';
import Apple from '../manifest/LoginAssets/Apple.svg';
import Email from '../manifest/LoginAssets/Email.svg';

import BackArrow from '../manifest/LoginAssets/Back_arrow.svg';
import Footer from './Footer';

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;

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
    textAlign: 'left',
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
    textAlign: 'left',
    font: 'normal normal 22px Quicksand-Bold',
    color: '#FFFFFF',
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
  signupbuttons: {
    background: '#ffffff 0% 0% no-repeat padding-box',
    borderRadius: '10px',
    font: 'normal normal bold 16px Quicksand-Bold',
    color: '#000000',
    margin: '1rem',
    textTransform: 'none',
  },
  signupbutton: {
    background: '#000000 0% 0% no-repeat padding-box',
    borderRadius: '10px',
    font: 'normal normal bold 16px Quicksand-Bold',
    color: '#ffffff',
    margin: '1rem',
    textTransform: 'none',
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
});

/* Navigation Bar component function */
export default function Privacy() {
  const loginContext = useContext(LoginContext);
  console.log('in login page');
  const classes = useStyles();
  const history = useHistory();

  let CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID_SPACE;
  let CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET_SPACE;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState();
  const [validation, setValidation] = useState('');
  const [doNotExistShow, setDoNotExistShow] = useState(false);
  const [userExistShow, setUserExistShow] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [idToken, setIdToken] = useState('');
  const [socialId, setSocialId] = useState('');
  const [taID, setTaID] = useState('');
  const [emailLogin, setEmailLogin] = useState(false);
  const [passVisible, setPassvisble] = React.useState({
    password: '',
    showPassword: false,
  });
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

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleClickShowPassword = () => {
    setPassvisble({ ...passVisible, showPassword: !passVisible.showPassword });
  };

  const responseGoogle = (response) => {
    console.log(response);
    if (response.profileObj) {
      let email = response.profileObj.email;
      let ta_id = '';
      setEmail(response.profileObj.email);
      setSocialId(response.googleId);
      axios.get(BASE_URL + `taTokenEmail/${email}`).then((response) => {
        console.log(
          'in events',
          response['data']['ta_unique_id'],
          response['data']['ta_google_auth_token']
        );
        console.log('in events', response);
        setAccessToken(response['data']['ta_google_auth_token']);
        let url =
          'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
        document.cookie = 'ta_uid=' + response['data']['ta_unique_id'];
        document.cookie = 'ta_email=' + email;
        document.cookie = 'patient_name=Loading';
        loginContext.setLoginState({
          ...loginContext.loginState,
          reload: true,
          loggedIn: true,
          ta: {
            ...loginContext.loginState.ta,
            id: response['data']['ta_unique_id'],
            email: email.toString(),
          },
          usersOfTA: [],
          curUser: '',
          curUserTimeZone: '',
          curUserEmail: '',
        });
        console.log('Login successful');
        console.log(email);
        history.push({
          pathname: '/home',
          state: email,
        });
        setTaID(response['data']['ta_unique_id']);
        ta_id = response['data']['ta_unique_id'];
        var old_at = response['data']['ta_google_auth_token'];
        console.log('in events', old_at);
        var refreshToken = response['data']['ta_google_refresh_token'];

        let checkExp_url = url + old_at;
        console.log('in events', checkExp_url);
        fetch(
          `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${old_at}`,
          {
            method: 'GET',
          }
        )
          .then((response) => {
            console.log('in events', response);
            if (response['status'] === 400) {
              console.log('in events if');
              let authorization_url =
                'https://accounts.google.com/o/oauth2/token';

              var details = {
                refresh_token: refreshToken,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'refresh_token',
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
                  'Content-Type':
                    'application/x-www-form-urlencoded;charset=UTF-8',
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
                  var id_token = data['id_token'];
                  setAccessToken(at);
                  setIdToken(id_token);
                  console.log('in events', at);
                  let url = BASE_URL + `UpdateAccessToken/${ta_id}`;
                  axios
                    .post(url, {
                      google_auth_token: at,
                    })
                    .then((response) => {})
                    .catch((err) => {
                      console.log(err);
                    });
                  return accessToken;
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              setAccessToken(old_at);
              console.log(old_at);
            }
          })
          .catch((err) => {
            console.log(err);
          });
        console.log('in events', refreshToken, accessToken);
      });

      _socialLoginAttempt(email, accessToken, socialId, 'GOOGLE');
    }
  };

  const _socialLoginAttempt = (email, at, socialId, platform) => {
    axios
      .get(BASE_URL + 'loginSocialTA/' + email)
      .then((res) => {
        console.log('loginSocialTA in events', res.data.result);
        if (res.data.result !== false) {
          // setTaID(res.data.result[0]);
          document.cookie = 'ta_uid=' + res.data.result[0];
          document.cookie = 'ta_email=' + email;
          document.cookie = 'patient_name=Loading';
          setAccessToken(res.data.result[1]);
          setLoggedIn(true);
          loginContext.setLoginState({
            ...loginContext.loginState,
            reload: true,
            loggedIn: true,
            ta: {
              ...loginContext.loginState.ta,
              id: res.data.result,
              email: email.toString(),
            },
            usersOfTA: [],
            curUser: '',
            curUserTimeZone: '',
            curUserEmail: '',
          });
          console.log('Login successful');
          console.log(email);
          history.push({
            pathname: '/home',
            state: email,
          });
          // Successful log in, Try to update tokens, then continue to next page based on role
        } else {
          axios
            .get(BASE_URL + 'GetUserEmailId/' + email)
            .then((response) => {
              if (response.data.message === 'User ID doesnt exist') {
                console.log('log in error');
                // history.push('/signup');
                setDoNotExistShow(true);
              } else {
                setUserExistShow(true);
              }
            })
            .catch((error) => {
              console.log('its in landing page');
              console.log(error);
            });
        }
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('event', event, email, password);
    axios
      .get(BASE_URL + 'loginTA/' + email.toString() + '/' + password.toString())
      .then((response) => {
        if (response.data.result !== false) {
          console.log('respnse true', response.data.result);
          console.log('response', response.data);
          document.cookie = 'ta_uid=' + response.data.result;
          document.cookie = 'ta_email=' + email;
          document.cookie = 'patient_name=Loading';
          setLoggedIn(true);
          console.log('response id', response.data.result, loggedIn);
          loginContext.setLoginState({
            ...loginContext.loginState,
            reload: true,
            loggedIn: true,
            ta: {
              ...loginContext.loginState.ta,
              id: response.data.result,
              email: email.toString(),
            },
            usersOfTA: [],
            curUser: '',
            curUserTimeZone: '',
            curUserEmail: '',
          });
          history.push({
            pathname: '/home',
            state: email.toString(),
          });
        } else {
          console.log('respnse true', response.data.result);
          setLoggedIn(false);
          setValidation(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const taDoNotExist = () => {
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
        show={doNotExistShow}
        onHide={hideDoNotExist}
        style={{ marginTop: '70px', padding: 0 }}
      >
        <Form>
          <Modal.Header style={headerStyle} closeButton>
            <Modal.Title>TA Account Does Not Exist</Modal.Title>
          </Modal.Header>

          <Modal.Body style={bodyStyle}>
            <div>
              The TA with email: {email} does not exist! Please Sign Up!
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
                  type="submit"
                  onClick={hideDoNotExist}
                  className={classes.signupbutton}
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
                  onClick={() => history.push('/signup')}
                  className={classes.signupbuttons}
                >
                  Sign Up
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  };
  const hideDoNotExist = () => {
    setDoNotExistShow(false);
  };

  const userExistModal = () => {
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
      display: 'flex',
      flexDirection: 'row',
    };
    const bodyStyle = {
      backgroundColor: ' #F2F7FC',
      font: 'normal normal 600 16px Quicksand-Regular',
    };
    return (
      <Modal
        show={userExistShow}
        onHide={hideUserExist}
        style={{ marginTop: '70px', padding: 0 }}
      >
        <Form>
          <Modal.Header style={headerStyle} closeButton>
            <Modal.Title>User Account Exists</Modal.Title>
          </Modal.Header>

          <Modal.Body style={bodyStyle}>
            <div>
              The User with email: {email} exists! Please contact your TA for
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
              <Col></Col>
              <Col
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Button
                  type="submit"
                  onClick={hideUserExist}
                  className={classes.signupbutton}
                >
                  Okay
                </Button>
              </Col>
              <Col></Col>
            </Row>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  };
  const hideUserExist = () => {
    setUserExistShow(false);
    history.push('/');
  };

  if (
    document.cookie.split(';').some((item) => item.trim().startsWith('ta_uid='))
  ) {
    console.log('we are here');
    console.log(document.cookie);
    //console.log(ta_uid);
    history.push('/home');
  } else {
    //document.cookie = 'ta_uid=' + taID;
  }
  return (
    <div
      style={{
        background: '#F2F7FC',
        height: '100vh',
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
          </Row>
          <br />
          <Row className={classes.subHeading}>
            A little help to manage your everyday
          </Row>
          <Row className={classes.boxLayout}>
            {emailLogin === false ? (
              <Row xs={12} className={classes.buttonLayout}>
                <Row xs={12} className={classes.buttonLayout}>
                  <Col></Col>
                  <Col xs={8} className={classes.loginbuttons}>
                    <div className={classes.body}>
                      Trusted Advisors please log in using one of the following
                      methods:
                    </div>
                  </Col>
                  <Col></Col>
                </Row>
                <Row xs={12} className={classes.buttonLayout}>
                  <Col></Col>
                  <Col xs={8} className={classes.loginbuttons}>
                    <Button>
                      <GoogleLogin
                        clientId={CLIENT_ID}
                        render={(renderProps) => (
                          <img
                            src={Google}
                            onClick={renderProps.onClick}
                            disabled={renderProps.disabled}
                            alt={''}
                            style={{ width: '60%', padding: '0', margin: 0 }}
                          ></img>
                        )}
                        buttonText="Log In"
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        isSignedIn={false}
                        disable={false}
                        cookiePolicy={'single_host_origin'}
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
                        alt={''}
                        className={classes.buttonLayout}
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
                        style={{ width: '60%', padding: '0', margin: '0' }}
                        onClick={() => {
                          setEmailLogin(true);
                        }}
                      ></img>
                    </Button>
                  </Col>
                  <Col></Col>
                </Row>
              </Row>
            ) : (
              <Row className={classes.buttonLayout}>
                <Row className={classes.buttonLayout}>
                  <Col></Col>
                  <Col xs={8}>
                    {' '}
                    <TextField
                      className={classes.textfield}
                      variant="outlined"
                      label="Email address"
                      size="small"
                      error={validation}
                      fullWidth={true}
                      onChange={handleEmailChange}
                    />
                  </Col>
                  <Col></Col>
                </Row>

                <Row className={classes.buttonLayout}>
                  <Col></Col>
                  <Col xs={8}>
                    <TextField
                      className={classes.textfield}
                      variant="outlined"
                      label="Password"
                      size="small"
                      type={passVisible.showPassword ? 'text' : 'password'}
                      error={validation}
                      fullWidth={true}
                      onChange={handlePasswordChange}
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
                <Row xs={12} className={classes.buttonLayout}>
                  <Col className={classes.bodylogin}>Forgot Password? </Col>
                  <Col xs={4}></Col>
                </Row>
                <Row className={classes.buttonLayout}>
                  <Col></Col>
                  <Col xs={8}>
                    <Typography
                      style={{
                        color: 'black',
                        textTransform: 'lowercase',
                        textAlign: 'center',
                      }}
                    >
                      {validation}
                    </Typography>
                  </Col>
                  <Col></Col>
                </Row>
                <Row className={classes.buttonLayout}>
                  <Col></Col>
                  <Col xs={8}>
                    <Button
                      className={classes.loginbutton}
                      onClick={handleSubmit}
                    >
                      Log In
                    </Button>
                  </Col>
                  <Col></Col>
                </Row>
              </Row>
            )}

            <Row xs={12} className={classes.buttonLayout}>
              <Col></Col>
              <Col xs={8} className={classes.bodylogin}>
                Don't have an account?{' '}
                <span
                  className={classes.bodyLink}
                  onClick={() => history.push('/signup')}
                >
                  Sign Up
                </span>
              </Col>
              <Col></Col>
            </Row>
          </Row>
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
      {taDoNotExist()}
      {userExistModal()}
    </div>
  );
}
