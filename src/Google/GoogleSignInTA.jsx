import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { Container, Col, Form, Modal, Row } from 'react-bootstrap';
import makeStyles from '@material-ui/core/styles/makeStyles';
import LoginContext from 'LoginContext';

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;
let CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID_LIFE;
let CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET_LIFE;

const useStyles = makeStyles({
  loginbuttons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    background: '#b28d42 0% 0% no-repeat padding-box',
    borderRadius: '10px',
    font: 'normal normal bold 16px Quicksand-Bold',
    color: '#ffffff',
    margin: '1rem',
    textTransform: 'none',
  },
  buttonLayout: { width: '100%', padding: '0', margin: '0' },

  textfield: {
    background: '##757575',
    borderRadius: '25px',
    marginBottom: '0.2rem',
    color: '#b28d42',
    padding: '10px 20px',
    width: '300px',
  },
});
function GoogleSignInTA(props) {
  const loginContext = useContext(LoginContext);
  const history = useHistory();
  const classes = useStyles();
  const {
    signUpRequired,
    setSignUpRequired,
    doNotExistShow,
    setDoNotExistShow,
    userExistShow,
    setUserExistShow,
    email,
    setEmail,
  } = props;
  const listOfUsers = loginContext.loginState.usersOfTA;
  var selectedTA = loginContext.loginState.ta.id;
  const [taID, setTaID] = useState('');
  const [accessToken, setAccessToken] = useState('');
  let tokenClient = {};
  console.log('tc', tokenClient);

  function handleCallBackResponse(response) {
    console.log('Encoded JWT ID token:' + response.credential);
    var userObject = jwt_decode(response.credential);
    console.log('User object', userObject);
    setEmail(userObject.email);

    let email = userObject.email;
    let ta_id = '';
    axios
      .get(BASE_URL + 'taTokenEmail/' + email)
      .then((response) => {
        console.log('loginSocialTA in events', response);
        if (response.data.message === 'Email ID doesnt exist') {
          setDoNotExistShow(true);
          setEmail(email);
        } else {
          if (
            response.data.result.ta_google_auth_token === null ||
            response.data.result.ta_google_refresh_token === null
          ) {
            console.log('Auth token is null. Displaying SignUp');
            setSignUpRequired(true);
          } else {
            setAccessToken(response.data.result.ta_google_auth_token);
            let url =
              'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
            document.cookie = 'ta_uid=' + response.data.result.ta_unique_id;
            document.cookie = 'ta_email=' + email;
            document.cookie = 'patient_name=Loading';
            document.cookie = 'ta_pic=' + response.data.result.ta_picture;
            loginContext.setLoginState({
              ...loginContext.loginState,
              reload: false,
              loggedIn: true,
              ta: {
                ...loginContext.loginState.ta,
                id: response.data.result.ta_unique_id,
                email: email.toString(),
              },
              usersOfTA: [],
              curUser: '',
              curUserTimeZone: '',
              curUserEmail: '',
              curUserName: '',
            });
            console.log('Login successful');
            console.log(email);
            setTaID(response.data.result.ta_unique_id);
            ta_id = response.data.result.ta_unique_id;
            var old_at = response.data.result.ta_google_auth_token;
            console.log('in events', old_at);
            var refreshToken = response.data.result.ta_google_refresh_token;

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
                  console.log('Checking login formdata', formBody);

                  fetch(authorization_url, {
                    method: 'POST',
                    headers: {
                      'Content-Type':
                        'application/x-www-form-urlencoded;charset=UTF-8',
                    },
                    body: formBody,
                  })
                    .then((response) => {
                      console.log(
                        'Displaying login token API response',
                        response
                      );
                      return response.json();
                    })
                    .then((responseData) => {
                      console.log(
                        'Displaying login token API responseData',
                        responseData.error
                      );
                      if (
                        responseData.error === 'invalid_grant' ||
                        responseData.error === 'unauthorized_client'
                      ) {
                        console.log('Error : invalid_grant. Displaying SignUp');
                        setSignUpRequired(true);
                        return;
                      } else {
                        console.log('Displaying else block', responseData);
                        return responseData;
                      }
                    })
                    .then((data) => {
                      console.log(
                        'Displaying login token API data',
                        data.error
                      );
                      if (
                        data.error === 'invalid_grant' ||
                        data.error === 'unauthorized_client'
                      ) {
                        console.log('Error : invalid_grant. Displaying SignUp');
                        setSignUpRequired(true);
                        return;
                      } else {
                        let at = data['access_token'];
                        var id_token = data['id_token'];
                        setAccessToken(at);
                        console.log('in events UpdateAccessToken Login1', at);
                        let url = BASE_URL + `UpdateAccessToken/${ta_id}`;
                        axios
                          .post(url, {
                            ta_google_auth_token: at,
                          })
                          .then((response) => {})
                          .catch((err) => {
                            console.log(err);
                          });
                        history.push({
                          pathname: '/home',
                          state: email,
                        });
                        return accessToken;
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                } else {
                  setAccessToken(old_at);
                  console.log(old_at);
                  history.push({
                    pathname: '/home',
                    state: email,
                  });
                }
              })
              .catch((err) => {
                console.log(err);
              });
            console.log('in events', refreshToken, accessToken);
          }
        }
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
    // socialGoogle(email);
  }
  // const socialGoogle = (email) => {
  //   console.log('in socialgoogle');
  //   axios
  //     .get(BASE_URL + 'UserSocialLogin/' + email)
  //     .then((res) => {
  //       console.log('loginSocialTA in events', res);
  //       if (res.data.result !== false) {
  //         // setUserID(res.data.result[0]);
  //         history.push('/blog');

  //         Auth.setIsAuth(true);
  //         Auth.isLoggedIn(true);
  //         setError('');
  //         console.log('Login success');
  //         let customerInfo = res.data.result.result[0];
  //         console.log('Login success, customerInfo');
  //         Auth.setIsAuth(true);
  //         Cookies.set('login-session', 'good');
  //         Cookies.set('customer_uid', customerInfo.customer_uid);
  //         Cookies.set('role', customerInfo.role);
  //         setAccessToken(res.data.result.result[0].user_access_token);
  //         let newAccountType = customerInfo.role.toLowerCase();
  //         console.log(newAccountType);
  //         switch (newAccountType) {
  //           case 'admin':
  //             Auth.setAuthLevel(2);
  //             history.push('/blog');
  //             break;

  //           case 'customer':
  //             Auth.setAuthLevel(0);
  //             history.push('/home');
  //             break;

  //           default:
  //             Auth.setAuthLevel(1);
  //             history.push('/home');
  //             break;
  //         }
  //         console.log('Login successful');
  //         console.log(email);

  //         // Successful log in, Try to update tokens, then continue to next page based on role
  //       } else {
  //         console.log('do not exist');
  //         axios
  //           .get(BASE_URL + 'GetUserEmailId/' + email)
  //           .then((response) => {
  //             console.log('GetUserEmailId', response);
  //             if (response.data.message === 'User ID doesnt exist') {
  //               console.log('log in error');
  //               // history.push('/signup');
  //               console.log('do not exist');
  //               setDoNotExistShow(true);
  //             }
  //           })
  //           .catch((error) => {
  //             console.log('its in landing page');
  //             console.log(error);
  //           });
  //       }
  //     })
  //     .catch((err) => {
  //       if (err.response) {
  //         console.log(err.response);
  //       }
  //       console.log(err);
  //     });
  // };

  useEffect(() => {
    /* global google */

    if (window.google) {
      console.log('in here singnin');
      //  initializes the Sign In With Google client based on the configuration object
      google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCallBackResponse,
      });
      //    method renders a Sign In With Google button in your web pages.
      google.accounts.id.renderButton(document.getElementById('signInDiv'), {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'pill',
      });
      // access tokens
    }
  }, []);

  return (
    <div
      style={{
        marginBottom: '0.2rem',
      }}
    >
      <div id="signInDiv"></div>
    </div>
  );
}

export default GoogleSignInTA;
