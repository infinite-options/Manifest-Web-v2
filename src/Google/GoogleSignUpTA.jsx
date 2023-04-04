import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { Button } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useHistory } from 'react-router-dom';
import { Container, Col, Form, Modal, Row } from 'react-bootstrap';

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;
let CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID_LIFE;
let CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET_LIFE;
let SCOPES =
  'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/photoslibrary.readonly';
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
  buttonLayout: {
    width: '100%',
    padding: '0',
    margin: '0',
    display: 'flex',
    justifyContent: 'center',
  },

  textfield: {
    background: '##757575',
    borderRadius: '25px',
    marginBottom: '0.2rem',
    color: '#b28d42',
    padding: '10px 20px',
    width: '300px',
  },
});
function GoogleSignUpTA(props) {
  const classes = useStyles();
  const history = useHistory();
  const {
    signupSuccessful,
    setSignupSuccessful,
    socialSignUpModalShow,
    setSocialSignUpModalShow,
    newEmail,
    setNewEmail,
    newFName,
    setNewFName,
    newLName,
    setNewLName,
    socialId,
    setSocialId,
    accessToken,
    setAccessToken,
    refreshToken,
    setRefreshToken,
    accessExpiresIn,
    setAccessExpiresIn,
    alreadyExists,
    setAlreadyExists,
  } = props;

  let codeClient = {};
  function getAuthorizationCode() {
    // Request authorization code and obtain user consent,  method of the code client to trigger the user flow
    codeClient.requestCode();
  }
  const formatPhoneNumber = (value) => {
    if (!value) return value;

    const phoneNumber = value.replace(/[^\d]/g, '');

    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 4) return phoneNumber;

    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }

    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`;
  };
  useEffect(() => {
    /* global google */

    if (window.google) {
      console.log('in here signup');

      // initialize a code client for the authorization code flow.
      codeClient = google.accounts.oauth2.initCodeClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
          console.log(tokenResponse);
          // gets back authorization code
          if (tokenResponse && tokenResponse.code) {
            let auth_code = tokenResponse.code;
            let authorization_url =
              'https://accounts.google.com/o/oauth2/token';

            console.log('auth_code', auth_code);
            var details = {
              code: auth_code,
              client_id: CLIENT_ID,
              client_secret: CLIENT_SECRET,
              redirectUri: 'postmessage',
              grant_type: 'authorization_code',
            };

            var formBody = [];
            for (var property in details) {
              var encodedKey = encodeURIComponent(property);
              var encodedValue = encodeURIComponent(details[property]);
              formBody.push(encodedKey + '=' + encodedValue);
            }
            formBody = formBody.join('&');
            // use authorization code, send it to google endpoint to get back ACCESS TOKEN n REFRESH TOKEN
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
              //   got ACCESS TOKEN n REFRESH TOKEN

              .then((data) => {
                console.log(data);
                let at = data['access_token'];
                let rt = data['refresh_token'];
                let ax = data['expires_in'];
                //  expires every 1 hr
                setAccessToken(at);
                // stays the same and used to refresh ACCESS token
                setRefreshToken(rt);
                setAccessExpiresIn(ax);
                //  use ACCESS token, to get email and other account info
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
                    axios
                      .get(BASE_URL + 'GetTAEmailId/' + e)
                      .then((response) => {
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
          }
        },
      });
    }
  }, [getAuthorizationCode]);

  return (
    <Row xs={12} className={classes.buttonLayout}>
      <Row xs={12} className={classes.buttonLayout}>
        <Col></Col>
        <Col id="signUpDiv">
          <Button
            class="btn btn-outline-dark"
            onClick={() => getAuthorizationCode()}
            role="button"
            style={{
              textTransform: 'none',
              borderRadius: '5px',
              backgroundColor: 'white',
              width: '250px',
              marginBottom: '0.2rem',
            }}
          >
            <img
              width="20px"
              style={{
                marginBottom: '3px',
                marginRight: '5px',
              }}
              alt="Google sign-in"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
            />
            Sign Up with Google
          </Button>
        </Col>
        <Col></Col>
      </Row>
    </Row>
  );
}

export default GoogleSignUpTA;
