import React, { useContext, useEffect, useState } from 'react';
import AppleLogin from 'react-apple-login';
import axios from 'axios';
import { Box, Button } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useHistory } from 'react-router-dom';
import TimezoneSelect from 'react-timezone-select';
import { Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { withRouter } from 'react-router';
import Apple from '../manifest/LoginAssets/AppleSignUp.svg';
import LoginContext from 'LoginContext';
import GoogleSignUpTA from 'Google/GoogleSignUpTA';

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;
let CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_SECRET_LIFE;
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
  const { signupSuccessful, setSignupSuccessful } = props;
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
  const [refreshToken, setRefreshToken] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [accessExpiresIn, setAccessExpiresIn] = useState('');
  const [alreadyExists, setAlreadyExists] = useState(false);

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
    setSignupSuccessful(true);
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
        <Col xs={8}>
          <GoogleSignUpTA
            signupSuccessful={signupSuccessful}
            setSignupSuccessful={setSignupSuccessful}
            newFName={newFName}
            setNewFName={setNewFName}
            newLName={newLName}
            setNewLName={setNewLName}
            newEmail={newEmail}
            setNewEmail={setNewEmail}
            socialId={socialId}
            setSocialId={setSocialId}
            refreshToken={refreshToken}
            setRefreshToken={setRefreshToken}
            accessToken={accessToken}
            setAccessToken={setAccessToken}
            accessExpiresIn={accessExpiresIn}
            setAccessExpiresIn={setAccessExpiresIn}
            socialSignUpModalShow={socialSignUpModalShow}
            setSocialSignUpModalShow={setSocialSignUpModalShow}
            alreadyExists={alreadyExists}
            setAlreadyExists={setAlreadyExists}
          />
        </Col>
        <Col></Col>
      </Row>
      <Row xs={12} className={classes.buttonLayout}>
        <Col></Col>
        <Col xs={8} className={classes.loginbuttons}>
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
