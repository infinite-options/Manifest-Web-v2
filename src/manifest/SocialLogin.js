import React, { useContext, useEffect, useState } from 'react';
import GoogleLogin from 'react-google-login';
import AppleLogin from 'react-apple-login';
import axios from 'axios';
import { Box, Button } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useHistory } from 'react-router-dom';
import TimezoneSelect from 'react-timezone-select';
import { Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { withRouter } from 'react-router';
import Google from '../manifest/LoginAssets/Google.svg';
import Apple from '../manifest/LoginAssets/AppleSignUp.svg';
import LoginContext from 'LoginContext';

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;
let CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID_SPACE;
let CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET_SPACE;
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
    background: '#ffffff 0% 0% no-repeat padding-box',
    borderRadius: '10px',
    font: 'normal normal bold 16px Quicksand-Bold',
    color: '#000000',
    margin: '1rem',
    textTransform: 'none',
  },
  buttonLayout: { width: '100%', padding: '0', margin: '0' },

  textfield: {
    background: '#FFFFFF',
    borderRadius: '10px',
    marginBottom: '0.2rem',
    width: '95%',
  },
});

function SocialLogin(props) {
  // const Auth = useContext(AuthContext);
  const loginContext = useContext(LoginContext);
  const classes = useStyles();
  const history = useHistory();
  const [socialSignUpModalShow, setSocialSignUpModalShow] = useState(false);
  const [loginSuccessful, setLoginSuccessful] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [newFName, setNewFName] = useState('');
  const [newLName, setNewLName] = useState('');
  const [newEmployer, setNewEmployer] = useState('');
  const [selectedTimezone, setSelectedTimezone] = useState({});
  const [socialId, setSocialId] = useState('');
  const [refreshToken, setrefreshToken] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [accessExpiresIn, setaccessExpiresIn] = useState('');
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
            axios.get(BASE_URL + 'GetTAEmailId/' + e).then((response) => {
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
  console.log(newEmail);

  const alreadyExistsModal = () => {
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
        show={alreadyExists}
        onHide={hideAlreadyExists}
        style={{ marginTop: '70px', padding: 0 }}
      >
        <Form>
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
                  className={classes.signupbuttons}
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
                  onClick={() => history.push('/login')}
                  className={classes.loginbutton}
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
    history.push('/');
  };
  const hideSignUp = () => {
    //setSignUpModalShow(false);
    setSocialSignUpModalShow(false);
    props.setSignupSuccessful(true);
    // setLoginSuccessful(true);
    // history.push('/aboutus');
    setNewPhoneNumber('');
    setNewFName('');
    setNewLName('');
    setNewEmployer('');
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
        ta_time_zone: selectedTimezone.value,
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
    const headerStyle = {
      border: 'none',
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center',
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
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
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
            <Form.Group className="formEltMargin">
              <Form.Group
                as={Row}
                className="formEltMargin"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Col
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Form.Control
                    type="text"
                    placeholder="First Name"
                    value={newFName}
                    onChange={handleNewFNameChange}
                    className={classes.textfield}
                  />
                </Col>
                <Col
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Form.Control
                    type="text"
                    placeholder="Last Name"
                    value={newLName}
                    onChange={handleNewLNameChange}
                    className={classes.textfield}
                  />
                </Col>
              </Form.Group>
              <Col>
                <Form.Group
                  as={Row}
                  className="formEltMargin"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <Form.Control
                    type="text"
                    placeholder="Employer"
                    value={newEmployer}
                    onChange={handleNewEmployerChange}
                    className={classes.textfield}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group
                  as={Row}
                  className="formEltMargin"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <Form.Control
                    type="tel"
                    placeholder="Phone Number"
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                    value={newPhoneNumber}
                    onChange={handleNewPhoneNumberChange}
                    className={classes.textfield}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="formEltMargin">
                  <TimezoneSelect
                    value={selectedTimezone}
                    onChange={setSelectedTimezone}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group
                  as={Row}
                  className="formEltMargin"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <Form.Control
                    plaintext
                    readOnly
                    value={newEmail}
                    className={classes.textfield}
                  />
                </Form.Group>
              </Col>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer style={footerStyle}>
            <Form.Group className="formEltMargin">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Button
                  variant="primary"
                  type="submit"
                  onClick={handleSocialSignUpDone}
                  className={classes.signupbuttons}
                >
                  Sign Up
                </Button>

                <Button
                  variant="primary"
                  type="submit"
                  onClick={hideSignUp}
                  className={classes.loginbutton}
                >
                  Cancel
                </Button>
              </div>
            </Form.Group>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  };

  const hideLoginSuccessful = () => {
    setLoginSuccessful(false);
  };

  return (
    <Row xs={12} className={classes.buttonLayout}>
      <Row xs={12} className={classes.buttonLayout}>
        <Col></Col>
        <Col xs={8} className={classes.loginbuttons}>
          <Button>
            <GoogleLogin
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
                    margin: 0,
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
          {/* <Button>
            <img
              src={Apple}
              alt={''}
              style={{
                minWidth: '70%',
                maxWidth: '70%',
                padding: '0',
                margin: 0,
              }}
              className={classes.buttonLayout}
              // onClick={() => {
              //   window.AppleID.auth.signIn();
              // }}
              onClick={() => responseApple()}
            ></img>
          </Button> */}
          <AppleLogin
            clientId={process.env.REACT_APP_APPLE_CLIENT_ID}
            onSuccess={(res) => {
              console.log('res', res);
            }}
            onError={(error) => console.log(error)}
            redirectURI={process.env.REACT_APP_TA_APPLE_REDIRECT_URI}
            usePopup={false}
            responseType={'code id_token'}
            responseMode={'form_post'}
            scope={'email name'}
            render={(renderProps) => (
              <img
                src={Apple}
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                alt={''}
                style={{
                  minWidth: '70%',
                  maxWidth: '70%',
                  padding: '0',
                  margin: 0,
                }}
              ></img>
            )}
          />
        </Col>
        <Col></Col>
      </Row>{' '}
      {socialSignUpModal()}
      {alreadyExistsModal()}
    </Row>
  );
}

export default withRouter(SocialLogin);
