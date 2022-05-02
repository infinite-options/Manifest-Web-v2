import React, { useEffect } from 'react';

import { Link } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Box, TextField, Button } from '@material-ui/core';
import PrivacyPic from '../manifest/LoginAssets/Privacy.png';
import { useState, useContext } from 'react';
import LoginContext from 'LoginContext';

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;

/* Custom Hook to make styles */
const useStyles = makeStyles({
  title: {
    font: 'normal normal 600 38px Quicksand-Book',
    color: '#000000',
    textAlign: 'center',
    marginTop: '1rem',
  },

  header: { font: 'normal normal bold 22px Quicksand-Bold' },
  body: {
    font: 'normal normal 600 16px Quicksand-Regular',
  },
});

/* Navigation Bar component function */
export default function AboutUs() {
  const loginContext = useContext(LoginContext);
  console.log('in login page');
  const classes = useStyles();

  return (
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
          width: '50rem',
          overflow: 'scroll',
        }}
      >
        <div className={classes.title}>Google OAuth2 Homepage</div>
        <br />

        <div>
          <div className={classes.header}>
            Google OAuth2 Homepage Accurately represents your app's identity:
          </div>
          <div className={classes.body}>
            The ManifestMy.Life App is designed for Trusted Advisors, Coaches
            and Parents to help their clients, patients and children manage
            their day. It provides a platform where the Advisors can create
            Goals, Routines and Events that will prompt their clients to take
            specific action. <br />{' '}
          </div>
        </div>
        <br />
        <div>
          <div className={classes.header}>
            What will this app do with user data?
          </div>
          <div className={classes.body}>
            The App requests access to your Calendar and Photo Library so that
            the Advisor can view and schedule events on your Google Calendar and
            incorporate photos from your Photo Library to make the Goals and
            Routines more meaningful. We also gain access to your name, email
            and profile so we can customize the App for each specific user.
          </div>
        </div>
        <br />
        <div>
          <div className={classes.header}>
            How does this app enhance user functionality?
          </div>
          <div className={classes.body}>
            Manifest My Life uses social media data to obtain your name, modify
            your calendar, and access your photos. This information allows the
            Coach or Advisor to login, confirm they are modifying the correct
            client’s data, create custom events for the client to attend, and
            enhance the client’s user experience by incorporating relevant
            photos.
          </div>
        </div>
        <br />
        <div>
          <div className={classes.header}>Link to Privacy Policy: </div>
          <div className={classes.body}>
            <Link to="/privacy">Click here</Link>
          </div>
        </div>
        <br />
        <div>
          <div className={classes.header}>
            Describe the content, context, or connection to the app:
          </div>
          <div className={classes.body}>
            The Manifest My Life App incorporates you Photos and Events into
            Goals and Routines so that the user better understands why the
            action is important at that time.
          </div>
        </div>
        <br />
        <div className={classes.title}>
          {' '}
          Google OAuth2 Limited Use Disclosure
        </div>
        <div className={classes.body}>
          The ManifestMy.Life App's use of information received from Google APIs
          will adhere to the{' '}
          <Link to="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes">
            Google API Services User Data Policy
          </Link>{' '}
          , including the Limited Use requirements.
        </div>
        <br />
        <div>
          <div className={classes.title}>Privacy Policy</div>
          <div className={classes.body}>
            Our Privacy Policy Can be found <Link to="/privacy">here</Link>{' '}
          </div>
        </div>
      </div>
    </div>
  );
}
