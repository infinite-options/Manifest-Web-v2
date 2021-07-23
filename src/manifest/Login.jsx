import React from 'react';
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
import { AuthContext } from '../auth/AuthContext';

import { Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import { useState, useContext } from 'react';

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
  const Auth = useContext(AuthContext);

  const classes = useStyles();
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState();
  const [validation, setValidation] = useState('');
  const [signUpModalShow, setSignUpModalShow] = useState(false);
  const [socialSignUpModalShow, setSocialSignUpModalShow] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [newFName, setNewFName] = useState('');
  const [newLName, setNewLName] = useState('');
  const [newEmployer, setNewEmployer] = useState('');
  const [newClients, setNewClients] = useState([]);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('event', event, email, password);
    axios
      .get(
        'https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev//api/v2/loginTA/' +
          email.toString() +
          '/' +
          password.toString()
      )
      .then((response) => {
        console.log('response', response.data);
        if (response.data.result !== false) {
          setLoggedIn(true);
          console.log('response id', response.data.result, loggedIn);
          history.push({
            pathname: '/home',
            state: email.toString(),
          });
        } else {
          setLoggedIn(false);
          setValidation(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSignUp = (event) => {
    console.log('sign up clicked');
    setSignUpModalShow(true);
    setSocialSignUpModalShow(false);
  };
  const hideSignUp = () => {
    setSignUpModalShow(false);
    setSocialSignUpModalShow(false);
    setEmail('');
    setPassword('');
    setNewPhoneNumber('');
    setNewFName('');
    setNewLName('');
    setNewEmployer('');
  };

  const handleNewEmailChange = (event) => {
    setNewEmail(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
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

  const handleSignUpDone = () => {
    axios
      .post(
        'https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/addNewTA',
        {
          email_id: newEmail,
          password: newPassword,
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
        console.log('its in landing page');
        console.log(error);
      });
  };
  const handleSocialSignUpDone = () => {
    axios
      .post('/TASocialSignUp', {
        email_id: newEmail,
        first_name: newFName,
        last_name: newLName,
        phone_number: newPhoneNumber,
        employer: newEmployer,
      })
      .then((response) => {
        console.log(response.data);
        hideSignUp();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const signUpModal = () => {
    return (
      <Modal show={signUpModalShow} onHide={hideSignUp}>
        <Form as={Container}>
          <h3 className="bigfancytext formEltMargin">Sign Up</h3>
          <Form.Group as={Row} className="formEltMargin">
            <Form.Label column sm="4">
              Email
            </Form.Label>
            <Col sm="8">
              <Form.Control
                type="text"
                placeholder="example@gmail.com"
                value={newEmail}
                onChange={handleNewEmailChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="formEltMargin">
            <Form.Label column sm="4">
              Password
            </Form.Label>
            <Col sm="8">
              <Form.Control
                type="password"
                value={newPassword}
                onChange={handleNewPasswordChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="formEltMargin">
            <Form.Label column sm="4">
              Phone Number
            </Form.Label>
            <Col sm="8">
              <Form.Control
                type="tel"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                placeholder="123-4567-8901"
                value={newPhoneNumber}
                onChange={handleNewPhoneNumberChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="formEltMargin">
            <Form.Label column sm="2">
              First Name
            </Form.Label>
            <Col sm="4">
              <Form.Control
                type="text"
                placeholder="John"
                value={newFName}
                onChange={handleNewFNameChange}
              />
            </Col>
            <Form.Label column sm="2">
              Last Name
            </Form.Label>
            <Col sm="4">
              <Form.Control
                type="text"
                placeholder="Doe"
                value={newLName}
                onChange={handleNewLNameChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="formEltMargin">
            <Form.Label column sm="4">
              Employer
            </Form.Label>
            <Col sm="8">
              <Form.Control
                type="text"
                value={newEmployer}
                onChange={handleNewEmployerChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="formEltMargin">
            <Col>
              <Button
                variant="primary"
                type="submit"
                onClick={handleSignUpDone}
              >
                Sign Up
              </Button>
            </Col>
            <Col>
              <Button variant="primary" type="submit" onClick={hideSignUp}>
                Cancel
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Modal>
    );
  };

  const socialSignUpModal = () => {
    return (
      <Modal show={socialSignUpModalShow} onHide={hideSignUp}>
        <Form as={Container}>
          <h3 className="bigfancytext formEltMargin">
            Sign Up with Social Media
          </h3>
          <Form.Group as={Row} className="formEltMargin">
            <Form.Label column sm="4">
              Email
            </Form.Label>
            <Col sm="8">
              <Form.Control plaintext readOnly value={newEmail} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="formEltMargin">
            <Form.Label column sm="4">
              Phone Number
            </Form.Label>
            <Col sm="8">
              <Form.Control
                type="tel"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                placeholder="123-4567-8901"
                value={newPhoneNumber}
                onChange={handleNewPhoneNumberChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="formEltMargin">
            <Form.Label column sm="2">
              First Name
            </Form.Label>
            <Col sm="4">
              <Form.Control
                type="text"
                placeholder="John"
                value={newFName}
                onChange={handleNewFNameChange}
              />
            </Col>
            <Form.Label column sm="2">
              Last Name
            </Form.Label>
            <Col sm="4">
              <Form.Control
                type="text"
                placeholder="Doe"
                value={newLName}
                onChange={handleNewLNameChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="formEltMargin">
            <Form.Label column sm="4">
              Employer
            </Form.Label>
            <Col sm="8">
              <Form.Control
                type="text"
                value={newEmployer}
                onChange={handleNewEmployerChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="formEltMargin">
            <Col>
              <Button
                variant="primary"
                type="submit"
                onClick={handleSocialSignUpDone}
              >
                Sign Up
              </Button>
            </Col>
            <Col>
              <Button variant="primary" type="submit" onClick={hideSignUp}>
                Cancel
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Modal>
    );
  };

  const responseGoogle = (response) => {
    console.log('response', response);
    if (response.profileObj !== null || response.profileObj !== undefined) {
      let e = response.profileObj.email;
      let at = response.accessToken;
      let rt = response.googleId;
      let first_name = response.profileObj.givenName;
      let last_name = response.profileObj.familyName;
      console.log(e, at, rt, first_name, last_name);
      axios
        .get(
          'https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/loginSocialTA/' +
            e
        ) //, {
        // username: e,  1009120542229-9nq0m80rcnldegcpi716140tcrfl0vbt.apps.googleusercontent.com
        //})
        .then((response) => {
          console.log(response.data);
          if (response.data !== false) {
            console.log('Login successful');
            console.log(e);
            history.push({
              pathname: '/home',
              state: e,
            });
          } else {
            console.log('social sign up with', e);
            setSocialSignUpModalShow(true);
            setNewEmail(e);
            /*  this.setState({
              socialSignUpModal: true,
              newEmail: e,
            }); */
            console.log('social sign up modal displayed');
          }
        })
        .catch((error) => {
          console.log('error', error);
        });
    }
  };

  return (
    <Box
      display="flex"
      style={{ width: '100%', height: '100%', backgroundColor: '#F2F7FC' }}
    >
      <Box style={{ position: 'fixed', top: '100px', left: '-100px' }}>
        <img src={Ellipse} alt="Ellipse" />
      </Box>
      <Box display="flex" marginTop="35%" marginLeft="30%">
        <Button
          //onClick={handleSignUp}
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
            {/* <SocialLogin/> */}

            <GoogleLogin
              clientId="1009120542229-9nq0m80rcnldegcpi716140tcrfl0vbt.apps.googleusercontent.com"
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

      <Box style={{ position: 'fixed', right: '-100px', bottom: '-100px' }}>
        <img src={Ellipse} alt="Ellipse" />
      </Box>
      {socialSignUpModal()}
      {signUpModal()}
      {/* <Box hidden={loggedIn === true}>
                  <Loading/>
            </Box> */}
    </Box>
  );
}
