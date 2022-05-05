import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Button, TextField } from '@material-ui/core';
import { Col, Form, Row } from 'react-bootstrap';
import TimezoneSelect from 'react-timezone-select';
import Events from '../images/Events.png';
import Routines from '../images/Routines.png';
import Goals from '../images/Goals.png';
import GooglePlayStore from '../manifest/LoginAssets/GooglePlayStore.png';
import AppleAppStore from '../manifest/LoginAssets/AppleAppStore.png';
import BackArrow from '../manifest/LoginAssets/Back_arrow.svg';
import Footer from './Footer';
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
export default function AppleSignUp() {
  console.log('in applesignup page');
  const classes = useStyles();
  const history = useHistory();
  let uid = window.location.href.split('/')[4];
  console.log(uid);
  const [profile, setProfile] = useState(false);

  const [signupSuccessful, setSignupSuccessful] = useState(false);
  const [signupTASuccessful, setSignupTASuccessful] = useState(false);
  const [signupUserSuccessful, setSignupUserSuccessful] = useState(false);

  const [newEmail, setNewEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [selectedTimezone, setSelectedTimezone] = useState({});
  const [newFName, setNewFName] = useState('');
  const [newLName, setNewLName] = useState('');
  const [newEmployer, setNewEmployer] = useState('');

  const signupSuccess = () => {
    setSignupSuccessful(true);
    setNewEmail('');
    setNewFName('');
    setNewLName('');
  };
  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = () => {
    if (uid.charAt(0) === 2) {
      axios
        .get(BASE_URL + 'TAProfile/' + uid)
        .then((response) => {
          console.log('TAPROFILE', response.data.result[0]);
          setProfile(response.data.result[0]);
          setNewEmail(response.data.result[0].ta_email_id);
          setSignupTASuccessful(true);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .get(BASE_URL + 'UserProfile/' + uid)
        .then((response) => {
          console.log('USERPROFILE', response.data.result[0]);
          setProfile(response.data.result[0]);
          setNewEmail(response.data.result[0].user_email_id);
          setSignupUserSuccessful(true);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleSignUpDone = () => {
    let taFormData = new FormData();

    taFormData.append('first_name', newFName);
    taFormData.append('last_name', newLName);
    taFormData.append('phone_number', newPhoneNumber);
    taFormData.append('employer', newEmployer);
    taFormData.append('ta_time_zone', selectedTimezone.value);
    taFormData.append('ta_unique_id', profile.ta_unique_id);

    axios
      .post(BASE_URL + 'UpdateTA', taFormData)
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
  };

  const handleUserSignUpDone = () => {
    let taFormData = new FormData();

    taFormData.append('first_name', newFName);
    taFormData.append('last_name', newLName);
    taFormData.append('user_time_zone', selectedTimezone.value);
    taFormData.append('user_unique_id', profile.user_unique_id);

    axios
      .post(BASE_URL + 'UpdateUser', taFormData)
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
          width: '100%',
          backgroundImage: `url(${'/login_background.jpg'})`,
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
            {signupSuccessful === false && signupTASuccessful === true ? (
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
                  <Col xs={8} className={classes.headers}>
                    {newEmail}
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
                    <Form.Group>
                      <div
                        style={{
                          opacity: 1,
                          background: '#FFFFFF',
                          borderRadius: '10px',
                          alignItems: 'center',
                          marginBottom: '-0.8rem',
                        }}
                      >
                        <TimezoneSelect
                          value={selectedTimezone}
                          onChange={setSelectedTimezone}
                        />
                      </div>
                    </Form.Group>
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
            ) : signupSuccessful === false && signupUserSuccessful === true ? (
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
                  <Col xs={8} className={classes.headers}>
                    {newEmail}
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
                    <Form.Group>
                      <div
                        style={{
                          opacity: 1,
                          background: '#FFFFFF',
                          borderRadius: '10px',
                          alignItems: 'center',
                        }}
                      >
                        <TimezoneSelect
                          value={selectedTimezone}
                          onChange={setSelectedTimezone}
                        />
                      </div>
                    </Form.Group>
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
                      onClick={handleUserSignUpDone}
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
            ) : signupSuccessful === true && signupUserSuccessful === true ? (
              <Row className={classes.buttonLayout}>
                <Row className={classes.buttonLayout}>
                  <Col></Col>
                  <Col className={classes.headers} xs={10}>
                    User Sign Up Successful
                  </Col>
                  <Col></Col>
                </Row>
                <Row className={classes.buttonLayout}>
                  <Col></Col>
                  <Col className={classes.body} xs={10}>
                    Your next step is to download our Mobile App. You can begin
                    using Manifest once your Trusted Advisor adds Goals,
                    Routines and Event to your schedule. <br /> Thanks for
                    Signing Up!
                  </Col>
                  <Col></Col>
                </Row>
                <Row className={classes.buttonLayout}>
                  <Col xs={1}></Col>
                  <Col
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: '1rem',
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
                            width: '217px',
                            height: '65px',
                            objectFit: 'cover',
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
                            width: '217px',
                            // height: '74px',
                            objectFit: 'cover',
                          }}
                        />
                      </a>
                    </Col>
                  </Col>
                  <Col xs={1}></Col>
                </Row>
              </Row>
            ) : signupSuccessful === true ? (
              <Row className={classes.buttonLayout}>
                <Row className={classes.buttonLayout}>
                  <Col></Col>
                  <Col className={classes.headers} xs={10}>
                    Trusted Advisor Sign Up Successful
                  </Col>
                  <Col></Col>
                </Row>
                <Row className={classes.buttonLayout}>
                  <Col></Col>
                  <Col className={classes.body} xs={10}>
                    If you want to receive notifications, your next step is to
                    download our Mobile App. Thanks for Signing Up!
                  </Col>
                  <Col></Col>
                </Row>
                <Row className={classes.buttonLayout}>
                  <Col xs={1}></Col>
                  <Col
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: '1rem',
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
                            width: '217px',
                            height: '65px',
                            objectFit: 'cover',
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
                            width: '217px',
                            // height: '74px',
                            objectFit: 'cover',
                          }}
                        />
                      </a>
                    </Col>
                  </Col>
                  <Col xs={1}></Col>
                </Row>
                <Row xs={12} className={classes.buttonLayout}>
                  <Col></Col>
                  <Col style={{ marginTop: '1rem' }}>
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
    </div>
  );
}
