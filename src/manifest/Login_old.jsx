import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Box, TextField, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Ellipse from '../manifest/LoginAssets/Ellipse.svg';
import LoginImage from '../manifest/LoginAssets/Login.svg';
import Google from '../manifest/LoginAssets/Google.svg';
import Apple from '../manifest/LoginAssets/Apple.svg';
import SignUpImage from '../manifest/LoginAssets/SignUp.svg';
import { Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import { useState, useContext } from 'react';
import LoginContext from 'LoginContext';
import './login.css';
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
export default function Login_old() {
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
  console.log('list of users home', loginContext.loginState.reload);
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

  // const responseGoogle = (response) => {
  //   // console.log(response);
  //   if (response.profileObj) {
  //     // console.log('Google login successful');
  //     let email = response.profileObj.email;
  //     let accessToken = response.accessToken;
  //     let socialId = response.googleId;
  //     _socialLoginAttempt(email, accessToken, socialId, 'GOOGLE');
  //   }
  // };

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
        show={doNotExistShow}
        onHide={hideDoNotExist}
        style={{ marginTop: '70px' }}
      >
        <Form as={Container}>
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
                  onClick={() => history.push('/signup')}
                  style={{
                    background: '#F8BE28 0% 0% no-repeat padding-box',
                    borderRadius: '20px',
                    opacity: 1,
                    width: '300px',
                  }}
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
        show={userExistShow}
        onHide={hideUserExist}
        style={{ marginTop: '70px' }}
      >
        <Form as={Container}>
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
                  onClick={hideUserExist}
                  style={{
                    marginTop: '10px',
                    background: '#FF6B4A 0% 0% no-repeat padding-box',
                    borderRadius: '20px',
                    opacity: 1,
                    width: '300px',
                  }}
                >
                  Ok
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
              ></Col>
            </Row>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  };
  const hideUserExist = () => {
    setUserExistShow(false);
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
    <Box
      display="flex"
      style={{ width: '100%', height: '100%', backgroundColor: '#F2F7FC' }}
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
      <Box
        display="flex"
        marginTop="35%"
        marginLeft="20%"
        justifyContent="space-around"
      >
        {/* <Button
          onClick={() => history.push('/signup')}
          style={{
            width: '7.5rem',
            height: '7.5rem',
            backgroundImage: `url(${SignUpImage})`,
          }}
        ></Button> */}
        <div
          style={{
            position: 'relative',
            color: 'white',
            cursor: 'pointer',
            marginRight: '-5rem',
          }}
          onClick={() => history.push('/signup')}
        >
          <img src={Ellipse} style={{ width: '40%' }} alt="Ellipse" />
          <div
            style={{
              position: 'absolute',
              top: '75%',
              left: '10%',
              transform: 'translate(-50%, -40%)',
              textAlign: 'center',
            }}
            className="text"
          >
            <div
              style={{
                font: 'normal normal bold 21px SF Pro',
                textAlign: 'center',
              }}
            >
              Sign Up as <br />
              TA
            </div>
          </div>
        </div>
        <div
          style={{
            position: 'relative',
            color: 'white',
            cursor: 'pointer',
            marginRight: '-5rem',
          }}
          onClick={() => history.push('/adduser')}
        >
          <img src={Ellipse} style={{ width: '40%' }} alt="Ellipse" />
          <div
            style={{
              position: 'absolute',
              top: '75%',
              left: '10%',
              transform: 'translate(-50%, -40%)',
              textAlign: 'center',
            }}
            className="text"
          >
            <div
              style={{
                font: 'normal normal bold 21px SF Pro',
              }}
            >
              Sign Up as <br />
              User
            </div>
          </div>
        </div>
      </Box>

      <Box
        marginTop="5%"
        marginLeft="-15%"
        display="flex"
        flexDirection="column"
        style={{ width: '15rem' }}
      >
        <Box>
          <h3
            className="bigfancytext formEltMargin"
            style={{
              textAlign: 'center',
              letterSpacing: '0.49px',
              color: '#000000',
              opacity: 1,
            }}
          >
            TA Login
          </h3>
        </Box>

        <Box marginBottom="1rem" width="100%">
          <TextField
            className={classes.textFieldBackgorund}
            variant="outlined"
            label="Email"
            size="small"
            error={validation}
            fullWidth={true}
            onChange={handleEmailChange}
          />
        </Box>

        <Box>
          <TextField
            className={classes.textFieldBackgorund}
            variant="outlined"
            label="Password"
            size="small"
            type="password"
            error={validation}
            fullWidth={true}
            onChange={handlePasswordChange}
          />
        </Box>

        <Box color="red" style={{ textTransform: 'lowercase' }}>
          <Typography>{validation}</Typography>
        </Box>
        <Box justifyContent="flex-start">
          <Button style={{ textTransform: 'lowercase', fontWeight: 'bold' }}>
            Forgot Password?
          </Button>
        </Box>

        <Box
          marginTop="1rem"
          display="flex"
          justifyContent="center"
          style={{ fontWeight: 'bold' }}
        >
          Or Login With
        </Box>

        <Box
          display="flex"
          justifyContent="center"
          flexDirection="column"
          marginTop="1rem"
        >
          {/* <Box>
            <Button
              disableRipple={true}
              disableFocusRipple={true}
              disableTouchRipple={true}
              disableElevation={true}
              style={{
                borderRadius: '32px',
                height: '3rem',
                backgroundImage: `url(${Facebook})`,
              }}
            ></Button>
          </Box> */}
          <div>
            <Button>
              <GoogleLogin
                clientId={CLIENT_ID}
                render={(renderProps) => (
                  <img
                    src={Google}
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    alt={''}
                    style={{ width: '100%' }}
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

        <Box
          display="flex"
          justifyContent="center"
          marginTop="2rem"
          marginBottom="7.5rem"
          style={{ fontWeight: 'bold' }}
        >
          Don't have an account?
        </Box>
      </Box>

      <Box marginTop="14%" marginLeft="2rem">
        <Button
          onClick={handleSubmit}
          style={{
            width: '7.5rem',
            height: '7.5rem',
            backgroundImage: `url(${LoginImage})`,
          }}
        ></Button>
      </Box>

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
      {taDoNotExist()}
      {userExistModal()}
      {/* <Box hidden={loggedIn === true}>
                  <Loading/>
            </Box> */}
    </Box>
  );
}
