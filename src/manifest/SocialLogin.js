import React, { useContext, useEffect, useState } from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import GoogleLogin from 'react-google-login';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Grid, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { AuthContext } from '../auth/AuthContext';
import { withRouter } from 'react-router';
import Facebook from '../manifest/LoginAssets/Facebook.svg';
import Google from '../manifest/LoginAssets/Google.svg';
import Apple from '../manifest/LoginAssets/Apple.svg';

function SocialLogin(props) {
  const Auth = useContext(AuthContext);
  const history = useHistory();
  const [socialSignUpModalShow, setSocialSignUpModalShow] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [newFName, setNewFName] = useState('');
  const [newLName, setNewLName] = useState('');
  const [newEmployer, setNewEmployer] = useState('');
  useEffect(() => {
    if (
      process.env.REACT_APP_APPLE_CLIENT_ID &&
      process.env.REACT_APP_APPLE_REDIRECT_URI
    ) {
      window.AppleID.auth.init({
        clientId: process.env.REACT_APP_APPLE_CLIENT_ID,
        scope: 'email',
        redirectURI: process.env.REACT_APP_APPLE_REDIRECT_URI,
      });
    }
    let queryString = props.location.search;
    let urlParams = new URLSearchParams(queryString);
    // Clear Query parameters
    window.history.pushState({}, document.title, window.location.pathname);
    console.log(props, urlParams);
    // Successful Log in with Apple, set cookies, context, redirect
    if (urlParams.has('id')) {
      let customerId = urlParams.get('id');
      Auth.setIsAuth(true);
      Cookies.set('login-session', 'good');
      Cookies.set('customer_uid', customerId);
      props.history.push('/admin');
    }
    // Log which media platform user should have signed in with instead of Apple
    // May eventually implement to display the message for which platform to Login
    else if (urlParams.has('media')) {
      console.log(urlParams.get('media'));
    }
  }, [Auth, props]);

  const responseGoogle = (response) => {
    console.log('response', response.profileObj.email);
    if (response.profileObj) {
      console.log('Google login successful');
      let email = response.profileObj.email;
      let accessToken = response.accessToken;
      let socialId = response.googleId;
      _socialLoginAttempt(email, accessToken, socialId, 'GOOGLE');
    } else {
      console.log('Google login unsuccessful');
    }
  };
  console.log(newEmail);
  const responseFacebook = (response) => {
    console.log(response);
    if (response.email) {
      console.log('Facebook login successful');
      let email = response.email;
      let accessToken = response.accessToken;
      let socialId = response.id;
      _socialLoginAttempt(email, accessToken, socialId, 'FACEBOOK');
    } else {
      console.log('Facebook login unsuccessful');
    }
  };

  const _socialLoginAttempt = (email, accessToken, socialId, platform) => {
    axios
      .get(
        'https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/loginSocialTA/' +
          email
      )

      .then((res) => {
        console.log('res', res);
        setNewEmail(email);
        //props.history.push('/socialsignup');
        setSocialSignUpModalShow(true);
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
      .post(
        'https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/addNewSocialTA',
        {
          email_id: newEmail,
          first_name: newFName,
          last_name: newLName,
          phone_number: newPhoneNumber,
          employer: newEmployer,
        }
      )
      .then((response) => {
        console.log(response.data);
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
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            //  clientId="1009120542229-9nq0m80rcnldegcpi716140tcrfl0vbt.apps.googleusercontent.com"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            isSignedIn={false}
            buttonText="Continue with Google"
            disable={false}
            cookiePolicy={'single_host_origin'}
            render={(renderProps) => (
              <img
                src={Google}
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                alt={''}
              ></img>
            )}
          />
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