import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Box, TextField, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Ellipse from '../manifest/LoginAssets/Ellipse.svg';
import LoginImage from '../manifest/LoginAssets/Login.svg';
import Facebook from '../manifest/LoginAssets/Facebook.svg';
import Google from '../manifest/LoginAssets/Google.svg';
import Apple from '../manifest/LoginAssets/Apple.svg';
import SignUpImage from '../manifest/LoginAssets/SignUp.svg';
import Cookies from 'js-cookie';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import { useState, useContext } from 'react';
import LoginContext from 'LoginContext';
import { AlternateEmail } from '@material-ui/icons';
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
export default function Login() {
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
  const [socialSignUpModalShow, setSocialSignUpModalShow] = useState(false);
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

  const responseGoogle = (response) => {
    console.log(response);
    if (response.profileObj) {
      let email = response.profileObj.email;
      let ta_id = '';
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

  const responseFacebook = (response) => {
    // console.log(response);
    if (response.email) {
      // console.log('Facebook login successful');
      let email = response.email;
      let accessToken = response.accessToken;
      let socialId = response.id;
      _socialLoginAttempt(email, accessToken, socialId, 'FACEBOOK');
    }
  };

  const _socialLoginAttempt = (email, at, socialId, platform) => {
    axios
      .get(BASE_URL + 'loginSocialTA/' + email)
      .then((res) => {
        console.log('loginSocialTA', res.data.result);
        if (res.data.result !== false) {
          document.cookie = 'ta_uid=' + res.data.result[0];
          document.cookie = 'ta_email=' + email;
          document.cookie = 'patient_name=Loading';
          setAccessToken(res.data.result[1]);
          setLoggedIn(true);
          loginContext.setLoginState({
            ...loginContext.loginState,
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
          console.log('log in error');
          history.push('/signup');
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

  /*   const responseGoogle = (response) => {
    console.log('response', response);
    if (response.profileObj !== null || response.profileObj !== undefined) {
      let e = response.profileObj.email;
      let at = response.accessToken;
      let rt = response.googleId;
      let first_name = response.profileObj.givenName;
      let last_name = response.profileObj.familyName;
      console.log(e, at, rt, first_name, last_name);
      axios
        .get(BASE_URL + 'loginSocialTA/' + e)
        .then((response) => {
          console.log('social login');
          console.log(response.data.result);
          if (response.data !== false) {
            document.cookie = 'ta_uid=' + response.data.result;
            document.cookie = 'ta_email=' + e;
            document.cookie = 'patient_name=Loading';
            loginContext.setLoginState({
              ...loginContext.loginState,
              loggedIn: true,
              ta: {
                ...loginContext.loginState.ta,
                id: response.data.result,
                email: email.toString(),
              },
              usersOfTA: [],
              curUser: '',
              curUserTimeZone: '',
            });
            console.log('Login successful');
            console.log(e);
            history.push({
              pathname: '/home',
              state: e,
            });
          } else {
            console.log('social sign up with', e);
            this.setState({
              socialSignUpModalShow: true,
              newEmail: e,
            });
            history.push({
              pathname: '/signup',
              state: '',
            });
            console.log('social sign up modal displayed');
          }
        })
        .catch((error) => {
          console.log('error', error);
        });
    }
  }; */

  if (
    document.cookie.split(';').some((item) => item.trim().startsWith('ta_uid='))
  ) {
    console.log('we are here');
    console.log(document.cookie);
    //console.log(ta_uid);
    history.push('/home');
  } else {
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
      <Box display="flex" marginTop="35%" marginLeft="30%">
        <Button
          onClick={() => history.push('/signup')}
          style={{
            width: '7.5rem',
            height: '7.5rem',
            backgroundImage: `url(${SignUpImage})`,
          }}
        ></Button>
      </Box>
      <Box></Box>

      <Box
        marginTop="15%"
        display="flex"
        flexDirection="column"
        style={{ width: '15rem' }}
      >
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

        <Box display="flex" justifyContent="center" marginTop="1rem">
          <Box>
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
          </Box>
          <Box>
            <GoogleLogin
              clientId={CLIENT_ID}
              render={(renderProps) => (
                <Button
                  style={{
                    borderRadius: '32px',
                    height: '3rem',
                    backgroundImage: `url(${Google})`,
                  }}
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                ></Button>
              )}
              buttonText="Log In"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              isSignedIn={false}
              disable={false}
              cookiePolicy={'single_host_origin'}
            />
          </Box>
          <Box>
            <Button
              disableRipple={true}
              disableFocusRipple={true}
              disableTouchRipple={true}
              disableElevation={true}
              style={{
                borderRadius: '32px',
                height: '3rem',
                backgroundImage: `url(${Apple})`,
              }}
            ></Button>
          </Box>
        </Box>

        <Box
          display="flex"
          justifyContent="center"
          marginTop="5rem"
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

      {/* <Box hidden={loggedIn === true}>
                  <Loading/>
            </Box> */}
    </Box>
  );
}
