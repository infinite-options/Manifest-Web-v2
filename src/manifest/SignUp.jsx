import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Button, TextField, InputAdornment } from '@material-ui/core';
import { Col, Container, Form, Modal, Row } from 'react-bootstrap';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Events from '../images/Events.png';
import Routines from '../images/Routines.png';
import Goals from '../images/Goals.png';
import Email from '../manifest/LoginAssets/Email.svg';
import GooglePlayStore from '../manifest/LoginAssets/GooglePlayStore.png';
import AppleAppStore from '../manifest/LoginAssets/AppleAppStore.png';
import BackArrow from '../manifest/LoginAssets/Back_arrow.svg';
import Footer from './Footer';
import SocialLogin from './SocialLogin';
const moment = require('moment');
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
    textAlign: 'center',
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
    textAlign: 'center',
    font: 'normal normal 22px Quicksand-Bold',
    color: '#FFFFFF',
    marginBottom: '1rem',
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
  signupbuttons: {
    background: '#ffffff 0% 0% no-repeat padding-box',
    borderRadius: '10px',
    font: 'normal normal bold 16px Quicksand-Bold',
    color: '#000000',
    margin: '1rem',
    textTransform: 'none',
    width: '100%',
    marginTop: '0.3rem',
  },
});

/* Navigation Bar component function */
export default function Signup() {
  console.log('in signup page');
  const classes = useStyles();
  const history = useHistory();

  const [emailSignup, setEmailSignup] = useState(false);
  const [passVisible, setPassvisble] = React.useState({
    password: '',
    showPassword: false,
  });
  const [signupSuccessful, setSignupSuccessful] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [newFName, setNewFName] = useState('');
  const [newLName, setNewLName] = useState('');
  const [newEmployer, setNewEmployer] = useState('');
  const [alreadyExists, setAlreadyExists] = useState(false);
  const signupSuccess = () => {
    setSignupSuccessful(true);
    setEmailSignup(false);
    setNewEmail('');
    setNewPassword('');
    setNewFName('');
    setNewLName('');
  };
  const handleClickShowPassword = () => {
    setPassvisble({ ...passVisible, showPassword: !passVisible.showPassword });
  };
  const handleSignUpDone = () => {
    if (
      newEmail === '' ||
      confirmEmail === '' ||
      newPassword === '' ||
      confirmPassword === ''
    ) {
      setErrorMessage('Please fill out all fields');
      return;
    }
    if (newEmail !== confirmEmail) {
      setErrorMessage('Emails must match');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords must match');
      return;
    }
    const ta = {
      email_id: newEmail,
      password: newPassword,
      first_name: newFName,
      last_name: newLName,
      phone_number: newPhoneNumber,
      employer: newEmployer,
      ta_time_zone: moment.tz.guess(),
    };
    axios.get(BASE_URL + 'GetTAEmailId/' + newEmail).then((response) => {
      console.log(response.data);
      if (response.data.message != 'User ID doesnt exist') {
        setAlreadyExists(!alreadyExists);
      } else {
        axios
          .post(BASE_URL + 'addNewTA', ta)
          .then((response) => {
            console.log(response.data);
            setSignupSuccessful(true);
            if (response.code !== 200) {
              setErrorMessage(response.message);
              return;
              // add validation
            }
            setErrorMessage('');
            signupSuccess();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };
  const required =
    errorMessage === 'Please fill out all fields' ? (
      <span
        style={{
          color: '#E3441F',
          font: 'normal normal normal 11px/12px SFProDisplay-Regular',
        }}
        className="ms-1"
      >
        *
      </span>
    ) : (
      ''
    );

  const alreadyExistsModal = () => {
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
                  onClick={hideSignupSuccessful}
                  className={classes.loginbutton}
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
                  className={classes.signupbuttons}
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

  const hideSignupSuccessful = () => {
    setSignupSuccessful(false);
  };

  return (
    <div
      style={{
        flex: 1,
        background: '#F2F7FC',
        minHeight: '100vh',
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
            <Col></Col>
          </Row>
          <br />
          <Row className={classes.subHeading}>
            A little help to manage your everyday
          </Row>
          <Row className={classes.boxLayout}>
            {emailSignup === false && signupSuccessful === false ? (
              <Row xs={12} className={classes.buttonLayout}>
                <Row xs={12} className={classes.buttonLayout}>
                  <Col></Col>
                  <Col xs={8} className={classes.loginbuttons}>
                    <div className={classes.body}>
                      Trusted Advisors please sign up using one of the following
                      methods:
                    </div>
                  </Col>
                  <Col></Col>
                </Row>

                <SocialLogin
                  signupSuccessful={signupSuccessful}
                  setSignupSuccessful={setSignupSuccessful}
                />
                <Row xs={12} className={classes.buttonLayout}>
                  <Col></Col>
                  <Col xs={8} className={classes.loginbuttons}>
                    <Button>
                      <img
                        src={Email}
                        alt={''}
                        style={{
                          minWidth: '60%',
                          maxWidth: '70%',
                          padding: '0',
                          margin: '0',
                        }}
                        onClick={() => {
                          setEmailSignup(true);
                        }}
                      ></img>
                    </Button>
                  </Col>
                  <Col></Col>
                </Row>
                <Row xs={12} className={classes.buttonLayout}>
                  <Col></Col>
                  <Col xs={8} className={classes.bodylogin}>
                    Already have an account?
                    <span
                      className={classes.bodyLink}
                      onClick={() => history.push('/login')}
                    >
                      Log In
                    </span>
                  </Col>
                  <Col></Col>
                </Row>
              </Row>
            ) : emailSignup === true && signupSuccessful === false ? (
              <Row className={classes.buttonLayout}>
                <Row className={classes.buttonLayout}>
                  <Col></Col>
                  <Col xs={8} className={classes.headers}>
                    Sign Up
                  </Col>
                  <Col></Col>
                </Row>
                <Row className={classes.buttonLayout}>
                  <Col></Col>
                  <Col
                    xs={8}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Col
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        margin: 0,
                        marginRight: '5px',
                        padding: 0,
                      }}
                    >
                      <TextField
                        className={classes.textfield}
                        variant="outlined"
                        type="text"
                        placeholder="First Name"
                        value={newFName}
                        onChange={(e) => setNewFName(e.target.value)}
                        size="small"
                        fullWidth={true}
                      />
                    </Col>
                    <Col
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        margin: 0,
                        marginLeft: '5px',
                        padding: 0,
                      }}
                    >
                      <TextField
                        className={classes.textfield}
                        variant="outlined"
                        type="text"
                        placeholder="Last Name"
                        value={newLName}
                        onChange={(e) => setNewLName(e.target.value)}
                        size="small"
                        fullWidth={true}
                      />
                    </Col>
                  </Col>

                  <Col></Col>
                </Row>
                <Row className={classes.buttonLayout}>
                  <Col></Col>
                  <Col xs={8}>
                    <TextField
                      className={classes.textfield}
                      variant="outlined"
                      type="text"
                      placeholder="Employer"
                      value={newEmployer}
                      onChange={(e) => setNewEmployer(e.target.value)}
                      size="small"
                      fullWidth={true}
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
                      type="tel"
                      placeholder="Phone Number"
                      pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                      value={newPhoneNumber}
                      onChange={(e) => setNewPhoneNumber(e.target.value)}
                      size="small"
                      fullWidth={true}
                    />
                  </Col>
                  <Col></Col>
                </Row>
                <Row className={classes.buttonLayout}>
                  <Col></Col>
                  <Col xs={8}>
                    {newEmail === '' ? required : ''}
                    <TextField
                      className={classes.textfield}
                      variant="outlined"
                      type="email"
                      label="Email address"
                      size="small"
                      fullWidth={true}
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                  </Col>
                  <Col></Col>
                </Row>
                <Row className={classes.buttonLayout}>
                  <Col></Col>
                  <Col xs={8}>
                    {confirmEmail === '' ? required : ''}
                    <TextField
                      className={classes.textfield}
                      variant="outlined"
                      type="email"
                      label="Confirm email address"
                      size="small"
                      fullWidth={true}
                      value={confirmEmail}
                      onChange={(e) => setConfirmEmail(e.target.value)}
                    />
                  </Col>
                  <Col></Col>
                </Row>

                <Row className={classes.buttonLayout}>
                  <Col></Col>
                  <Col xs={8}>
                    {newPassword === '' ? required : ''}
                    <TextField
                      className={classes.textfield}
                      variant="outlined"
                      label="Password"
                      size="small"
                      type={passVisible.showPassword ? 'text' : 'password'}
                      fullWidth={true}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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
                <Row className={classes.buttonLayout}>
                  <Col></Col>
                  <Col xs={8}>
                    {confirmPassword === '' ? required : ''}
                    <TextField
                      className={classes.textfield}
                      variant="outlined"
                      label="Confirm Password"
                      size="small"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      type={passVisible.showPassword ? 'text' : 'password'}
                      fullWidth={true}
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

                <Row
                  className={classes.buttonLayout}
                  color="red"
                  style={errorMessage === '' ? { visibility: 'hidden' } : {}}
                >
                  <p
                    style={{
                      color: '#E3441F',
                      font: 'normal normal normal 11px/12px SFProDisplay-Regular',
                      fontSize: 'small',
                    }}
                  >
                    {errorMessage}
                  </p>
                </Row>
                <Row className={classes.buttonLayout}>
                  <Col></Col>
                  <Col xs={8}>
                    <Button
                      className={classes.loginbutton}
                      onClick={handleSignUpDone}
                    >
                      Sign Up
                    </Button>
                  </Col>
                  <Col></Col>
                </Row>
                <Row xs={12} className={classes.buttonLayout}>
                  <Col></Col>
                  <Col className={classes.bodylogin} xs={8}>
                    Already have an account?{' '}
                    <span
                      className={classes.bodyLink}
                      onClick={() => history.push('/login')}
                    >
                      Log In
                    </span>
                  </Col>
                  <Col></Col>
                </Row>
              </Row>
            ) : signupSuccessful === true ? (
              <Row className={classes.buttonLayout}>
                <Row className={classes.buttonLayout}>
                  <Col></Col>
                  <Col className={classes.headers}>
                    Trusted Advisor Sign Up successful
                  </Col>
                  <Col></Col>
                </Row>
                <Row className={classes.buttonLayout}>
                  <Col></Col>
                  <Col className={classes.body}>
                    If you want to receive notifications, your next step is to
                    download our Mobile App. Thanks for Signing Up!
                  </Col>
                  <Col></Col>
                </Row>
                <Row className={classes.buttonLayout}>
                  <Col></Col>
                  <Col
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Col>
                      <a
                        href="https://apps.apple.com/us/app/manifest-mylife/id1523013751"
                        target="_blank"
                      >
                        <img
                          className="img"
                          src={AppleAppStore}
                          style={{
                            width: '177px',
                            height: '70px',
                          }}
                        />
                      </a>
                    </Col>
                    <Col>
                      <a
                        href="https://play.google.com/store/apps/details?id=com.infiniteoptions_manifestmy.life"
                        target="_blank"
                      >
                        <img
                          className="img"
                          src={GooglePlayStore}
                          style={{
                            width: '177px',
                            height: '70px',
                          }}
                        />
                      </a>
                    </Col>
                  </Col>
                  <Col></Col>
                </Row>
                <Row xs={12} className={classes.buttonLayout}>
                  <Col></Col>
                  <Col>
                    <Button
                      className={classes.signupbuttons}
                      onClick={() => history.push('/login')}
                    >
                      Log In
                    </Button>
                  </Col>
                  <Col></Col>
                </Row>
              </Row>
            ) : (
              <Row></Row>
            )}
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
          paddingBottom: '3rem',
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
      {/* {signupSuccessfulModal()} */}
      {alreadyExistsModal()}
    </div>
  );
}
