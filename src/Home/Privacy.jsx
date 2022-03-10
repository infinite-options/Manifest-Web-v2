import React, { useEffect } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Box, TextField, Button } from '@material-ui/core';
import PrivacyPic from '../manifest/LoginAssets/Privacy.png';
import { useState, useContext } from 'react';
import LoginContext from 'LoginContext';

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;

/* Custom Hook to make styles */
const useStyles = makeStyles({
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '42px',
  },

  header: { fontWeight: 'bold', fontSize: '22px' },
  body: {},
});

/* Navigation Bar component function */
export default function Privacy() {
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
        <div className={classes.title}>
          Manifest Web and Mobile Privacy Policy
        </div>
        <br />
        <div>Last updated: June 22, 2020 </div>
        <br />
        <div>
          Infinite Options, LLC (”us”, "we", or "our") operates ManifestMyLife
          (the “web application") and Manifest (the “mobile application”). This
          page informs you of our policies regarding the collection, use and
          disclosure of Personal Information we receive from users of both the
          web application and the mobile application.
        </div>
        <br />
        <div>
          <div className={classes.header}>Definitions</div>
          The User is defined as someone who could benefit from additional
          assistance navigating their day. <br /> The Trusted Advisor is defined
          as a person who has a vested interest in the health and well being of
          the User.
        </div>
        <br />
        <div>
          <div className={classes.header}> Use Case </div>
          The mobile application is intended to be used by the User. The
          application provides assistance identifying Goals, Routines and Events
          that may be significant in the User’s life. <br />
          The web application is intended to be used by a Trusted Advisor or
          person who has a vested interest in the health and well being of the
          User. <br />
          We use both the User’s and Trusted Advisor’s Personal Information only
          for providing and improving the web application. By using either
          application, you agree to the collection and use of information in
          accordance with this policy.
        </div>
        <br />
        <div>
          <div className={classes.header}>Information Collection And Use</div>
          While using our mobile application, the User will be asked to grant
          access to read and write to their Google Calendar and to read from
          their Google Photos. For login convenience, the User also agrees to
          have their credentials stored on their mobile device. <br /> While
          using our web application, the Trusted Advisor agrees to provide us
          with certain personally identifiable information that can be used to
          contact or identify you. Personally identifiable information may
          include, but is not limited to your name, email, street address, and
          phone number ("Personal Information”). <br />
          Furthermore, the User understands and consents to the fact that the
          Trusted Advisor will have access to the Users Google Calendar and can
          view and create events.{' '}
        </div>
        <br />
        <div>
          <div className={classes.header}>Log Data </div>
          Like many application operators, we collect information that your web
          phone sends whenever you visit our web application ("Log Data").{' '}
          <br /> This Log Data may include information such as your phone’s
          Internet Protocol ("IP") address, phone type, software version, the
          pages of our Mobile application that you visit, the time and date of
          your visit, the time spent on those pages and other statistics. <br />
          In addition, we may use third party services such as Google Analytics
          that collect, monitor and analyze this information to improve the web
          application.
        </div>
        <br />
        <div>
          <div className={classes.header}>Communications</div>
          We may use your Personal Information to contact you with newsletters,
          marketing or promotional materials and other information regarding the
          web application.
        </div>
        <br />
        <div>
          <div className={classes.header}>Security</div>
          The security of your Personal Information is important to us, but
          remember that no method of transmission over the Internet, or method
          of electronic storage, is 100% secure. While we strive to use
          commercially acceptable means to protect your Personal Information, we
          cannot guarantee its absolute security.{' '}
        </div>
        <br />
        <div>
          <div className={classes.header}>Changes To This Privacy Policy</div>
          This Privacy Policy is effective as of June 22, 2020 and will remain
          in effect except with respect to any changes in its provisions in the
          future, which will be in effect immediately after being posted on this
          page. <br />
          We reserve the right to update or change our Privacy Policy at any
          time and you should check this Privacy Policy periodically. Your
          continued use of the Service after we post any modifications to the
          Privacy Policy on this page will constitute your acknowledgment of the
          modifications and your consent to abide and be bound by the modified
          Privacy Policy. <br />
          If we make any material changes to this Privacy Policy, we will notify
          you either through the email address you have provided us, or by
          placing a prominent notice on our web application.
        </div>
        <br />
        <div>
          <div className={classes.header}>Contact Us</div>
          If you have any questions about this Privacy Policy, please contact
          us: <br />
          Infinite Options, LLC <br /> info@infiniteoptions.com
        </div>
        <div style={{ textAlign: 'center' }}>
          <img src={PrivacyPic} style={{ width: '50%' }} />
        </div>
      </div>
    </div>
  );
}
