import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Box } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Ellipse from '../manifest/LoginAssets/Ellipse.svg';
import { useContext } from 'react';
import LoginContext from 'LoginContext';
import './login.css';
const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;

/* Custom Hook to make styles */
const useStyles = makeStyles({
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '42px',
  },

  header: { fontWeight: 'bold', fontSize: '20px' },
  subHeader: {
    fontWeight: 'bold',
    textDecoration: 'underline',
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

      <Box
        display="flex"
        marginTop="35%"
        marginLeft="30%"
        style={{ cursor: 'pointer' }}
        onClick={() => history.push('/')}
      >
        <div style={{ position: 'relative', color: 'white' }}>
          <img src={Ellipse} style={{ width: '40%' }} alt="Ellipse" />
          <div
            style={{
              position: 'absolute',
              top: '70%',
              left: '10%',
              transform: 'translate(-50%, -40%)',
              textAlign: 'center',
            }}
            className="text"
          >
            <p style={{ font: 'normal normal normal 18px SF Pro' }}>
              <div
                style={{
                  font: 'normal normal bold 21px SF Pro',
                }}
              >
                Manifest My
                <br /> Life
              </div>
            </p>
          </div>
        </div>
      </Box>

      <Box
        marginLeft="-25%"
        marginTop="2%"
        display="flex"
        flexDirection="column"
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#F2F7FC',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'left',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'left',
              justifyContent: 'left',
              width: '40rem',
              height: '28rem',
              overflow: 'scroll',
              border: '1px solid black',
              padding: '5px',
            }}
          >
            <div>
              <div className={classes.header}> Google OAuth2 Homepage</div>
              <span className={classes.subHeader}>
                Google OAuth2 Homepage Accurately represents your app's
                identity:
              </span>{' '}
              The ManifestMy.Life App is designed for Trusted Advisors, Coaches
              and Parents to help their clients, patients and children manage
              their day. It provides a platform where the Advisors can create
              Goals, Routines and Events that will prompt their clients to take
              specific action. <br />{' '}
              <span className={classes.subHeader}>
                What will this app do with user data?
              </span>{' '}
              The App requests access to your Calendar and Photo Library so that
              the Advisor can view and schedule events on your Google Calendar
              and incorporate photos from your Photo Library to make the Goals
              and Routines more meaningful. We also gain access to your name,
              email and profile so we can customize the App for each specific
              user. <br />
              <span className={classes.subHeader}>
                How does this app enhance user functionality?
              </span>{' '}
              Manifest My Life uses social media data to obtain your name,
              modify your calendar, and access your photos. This information
              allows the Coach or Advisor to login, confirm they are modifying
              the correct client’s data, create custom events for the client to
              attend, and enhance the client’s user experience by incorporating
              relevant photos. <br />{' '}
              <span className={classes.subHeader}>Link to Privacy Policy:</span>
              &nbsp;
              <Link style={{ textDecoration: 'underline' }} to="/privacy">
                Click here
              </Link>
              <br />
              <span className={classes.subHeader}>
                Describe the content, context, or connection to the app:
              </span>{' '}
              The Manifest My Life App incorporates you Photos and Events into
              Goals and Routines so that the user better understands why the
              action is important at that time.
            </div>
            <br />
            <div>
              <div className={classes.header}>
                Google OAuth2 Limited Use Disclosure
              </div>{' '}
              The ManifestMy.Life App's use of information received from Google
              APIs will adhere to the{' '}
              <Link to="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes">
                Google API Services User Data Policy
              </Link>{' '}
              , including the Limited Use requirements.
            </div>
            <br />
            <div>
              <div className={classes.header}>Privacy Policy</div>
              Our Privacy Policy Can be found{' '}
              <Link style={{ textDecoration: 'underline' }} to="/privacy">
                here
              </Link>{' '}
            </div>
          </div>
        </div>
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
