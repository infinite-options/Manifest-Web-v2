import React, { useContext, useEffect, useState } from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import GoogleLogin from 'react-google-login';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Grid, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { Col, Container, Form, Modal, Row } from 'react-bootstrap';
//import { AuthContext } from '../auth/AuthContext';
import { withRouter } from 'react-router';
import Facebook from '../manifest/LoginAssets/Facebook.svg';
import Google from '../manifest/LoginAssets/Google.svg';
import Apple from '../manifest/LoginAssets/Apple.svg';
import LoginContext from 'LoginContext';

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;
let CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID_SPACE;
let CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET_SPACE;

function SocialLogin(props) {
  // const Auth = useContext(AuthContext);
  const loginContext = useContext(LoginContext);
  const history = useHistory();
  const [socialSignUpModalShow, setSocialSignUpModalShow] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [newFName, setNewFName] = useState('');
  const [newLName, setNewLName] = useState('');
  const [newEmployer, setNewEmployer] = useState('');

  const [socialId, setSocialId] = useState('');
  const [refreshToken, setrefreshToken] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [accessExpiresIn, setaccessExpiresIn] = useState('');
  let redirecturi = 'https://manifestmy.space';
  useEffect(() => {
    if (BASE_URL.substring(8, 18) == '3s3sftsr90') {
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

  // const responseGoogle = (response) => {
  //   console.log('response', response);
  //   if (response.profileObj) {
  //     console.log('Google login successful');
  //     let email = response.profileObj.email;
  //     let accessToken = response.accessToken;
  //     let socialId = response.googleId;
  //     _socialLoginAttempt(email, accessToken, socialId);
  //   } else {
  //     console.log('Google login unsuccessful');
  //   }
  // };
  const responseGoogle = (response) => {
    console.log('response', response);

    let auth_code = response.code;
    let authorization_url = 'https://accounts.google.com/o/oauth2/token';

    if (BASE_URL.substring(8, 18) == '3s3sftsr90') {
      console.log('base_url', BASE_URL.substring(8, 18));
      CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID_SPACE;
      CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET_SPACE;
      redirecturi = 'https://manifestmy.space';
      console.log(CLIENT_ID, CLIENT_SECRET);
    } else {
      console.log('base_url', BASE_URL.substring(8, 18));
      CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID_LIFE;
      CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET_LIFE;
      redirecturi = 'https://manifestmy.life';
      console.log(CLIENT_ID, CLIENT_SECRET);
    }

    console.log('auth_code', auth_code);
    var details = {
      code: auth_code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      //redirect_uri: 'http://localhost:3000',
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
            axios.get(BASE_URL + 'GetTAEmailId/' + e).then((response) => {
              console.log(response.data);
              if (response.data.message === 'User ID doesnt exist') {
                setSocialSignUpModalShow(!socialSignUpModalShow);
              } else {
                console.log('ACCESS', accessToken);
                document.cookie = 'ta_uid=' + response.data.result;
                document.cookie = 'ta_email=' + newEmail;
                document.cookie = 'patient_name=Loading';
                loginContext.setLoginState({
                  ...loginContext.loginState,
                  loggedIn: true,
                  ta: {
                    ...loginContext.loginState.ta,
                    id: response.data.result.toString(),
                    email: newEmail.toString(),
                  },
                  usersOfTA: [],
                  curUser: '',
                  curUserTimeZone: '',
                  curUserEmail: '',
                });
                //setLoggedIn(true);

                history.push({
                  pathname: '/home',
                  state: {
                    email: e.toString(),
                    accessToken: accessToken.toString(),
                  },
                });
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
  console.log(newEmail);
  const responseFacebook = (response) => {
    console.log(response);
    if (response.email) {
      console.log('Facebook login successful');
      let email = response.email;
      let accessToken = response.accessToken;
      let socialId = response.id;
      _socialLoginAttempt(email, accessToken, socialId);
    } else {
      console.log('Facebook login unsuccessful');
    }
  };

  const _socialLoginAttempt = (email, accessToken, socialId) => {
    axios
      .get(BASE_URL + 'loginSocialTA/' + email)
      .then((res) => {
        console.log('loginSocialTA', res);
        if (res.data.result !== false) {
          document.cookie = 'ta_uid=' + res.data.result[0];
          document.cookie = 'ta_email=' + email;
          document.cookie = 'patient_name=Loading';
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
          setNewEmail(email);
          //props.history.push('/socialsignup');
          setSocialSignUpModalShow(true);
        }
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  };

  const hideSignUp = () => {
    //setSignUpModalShow(false);
    setSocialSignUpModalShow(false);
    history.push('/');
    setNewPhoneNumber('');
    setNewFName('');
    setNewLName('');
    setNewEmployer('');
  };
  const handleNewEmailChange = (event) => {
    setNewEmail(event.target.value);
  };

  const handleNewPhoneNumberChange = (event) => {
    setNewPhoneNumber(event.target.value);
  };

  const handleNewFNameChange = (event) => {
    setNewFName(event.target.value);
  };

  const handleNewLNameChange = (event) => {
    setNewLName(event.target.value);
  };

  const handleNewEmployerChange = (event) => {
    setNewEmployer(event.target.value);
  };
  const handleSocialSignUpDone = () => {
    axios
      .post(BASE_URL + 'addNewSocialTA', {
        email_id: newEmail,
        first_name: newFName,
        last_name: newLName,
        phone_number: newPhoneNumber,
        employer: newEmployer,
        ta_time_zone: '',
        ta_google_auth_token: accessToken,
        ta_google_refresh_token: refreshToken,
        ta_social_id: socialId,
        ta_access_expires_in: accessExpiresIn.toString(),
      })
      .then((response) => {
        console.log(response);
        hideSignUp();
      })
      .catch((error) => {
        console.log(error);
      });
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
                  onChange={handleNewFNameChange}
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
                  onChange={handleNewLNameChange}
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
                  onChange={handleNewEmployerChange}
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
                  onChange={handleNewPhoneNumberChange}
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
                  background: '#F8BE28 0% 0% no-repeat padding-box',
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
                  background: '#FF6B4A 0% 0% no-repeat padding-box',
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
  return (
    <Grid
      container
      spacing={3}
      display="flex"
      flexDirection="row"
      justifyContent="center"
    >
      <Grid item xs={4}>
        <FacebookLogin
          appId={process.env.REACT_APP_FACEBOOK_APP_ID}
          autoLoad={false}
          fields="name,email,picture"
          onClick="return false"
          callback={responseFacebook}
          size="small"
          // icon={<SiFacebook/>}
          textButton="Continue with Facebook"
          render={(renderProps) => (
            <img
              src={Facebook}
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              alt={''}
            ></img>
          )}
        />
      </Grid>
      <Grid item xs={4}>
        <Button style={{}}>
          <GoogleLogin
            //clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            //clientId={CLIENT_ID}
            clientId={
              BASE_URL.substring(8, 18) == '3s3sftsr90'
                ? process.env.REACT_APP_GOOGLE_CLIENT_ID_SPACE
                : process.env.REACT_APP_GOOGLE_CLIENT_ID_LIFE
            }
            accessType="offline"
            prompt="consent"
            responseType="code"
            buttonText="Log In"
            ux_mode="redirect"
            isSignedIn={false}
            buttonText="Continue with Google"
            disable={true}
            cookiePolicy={'single_host_origin'}
            redirectUri={
              BASE_URL.substring(8, 18) == '3s3sftsr90'
                ? 'https://manifestmy.space'
                : 'https://manifestmy.life'
            }
            scope="https://www.googleapis.com/auth/calendar"
            //redirectUri="http://localhost:3000"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            render={(renderProps) => (
              <img
                src={Google}
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                alt={''}
              ></img>
            )}
          />
          {console.log(CLIENT_ID)}
        </Button>
      </Grid>

      <Grid item xs={4}>
        <img
          src={Apple}
          variant="contained"
          alt={''}
          onClick={() => {
            window.AppleID.auth.signIn();
          }}
        ></img>
      </Grid>
      {socialSignUpModal()}
    </Grid>
  );
}

export default withRouter(SocialLogin);
