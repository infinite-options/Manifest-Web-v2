import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Button from '@material-ui/core/Button';
import LoginContext from '../LoginContext';
import './Admin_style.css';

import MiniNavigation from '../manifest/miniNavigation';
const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;

const useStyles = makeStyles({});

export function Admin() {
  const history = useHistory();
  const classes = useStyles();
  const loginContext = useContext(LoginContext);

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
  });

  const listOfUsers = loginContext.loginState.usersOfTA;
  var selectedUser = loginContext.loginState.curUser;
  const currentUser = loginContext.loginState.curUser;
  const curUserPic = loginContext.loginState.curUserPic;

  return (
    <div style={{ backgroundColor: '#F2F7FC' }}>
      <div style={{ width: '30%' }}>
        <MiniNavigation />
      </div>
      <div class="mid">TA Admin Access</div>

      <div class="grid-container">
        <div class="one">
          {' '}
          <img src="/Arrow.png" onClick={() => history.push('/home')} />
        </div>
        <div class="two"></div>
      </div>

      <div class="biggird">
        <div class="g comp1">
          <div class="bigbox">
            <div class="graybox">
              <div class="YourUsers">
                Your Users (3)
                <div class="gird_cut">
                  <div class="grid">
                    <div class="g s1">
                      <div class="circle"></div>
                    </div>
                    <div class="g s2"> Mike Johnson</div>
                    <div class="g s3"> 8:00 AM PST</div>
                    <div class="g s4">
                      <img src="edit.png" />
                    </div>
                    <div class="g s5">
                      <img src="delete.png" />
                    </div>
                  </div>
                </div>
                <div class="gird_cut">
                  <div class="grid">
                    <div class="g s1">
                      <div class="circle"></div>
                    </div>
                    <div class="g s2"> Jonathan Wang</div>
                    <div class="g s3"> 8:00 AM PST</div>
                    <div class="g s4">
                      <img src="edit.png" />
                    </div>
                    <div class="g s5">
                      <img src="delete.png" />
                    </div>
                  </div>
                </div>
                <div class="gird_cut">
                  <div class="grid">
                    <div class="g s1">
                      <div class="circle"></div>
                    </div>
                    <div class="g s2"> Ryan Rafati</div>
                    <div class="g s3"> 10:00 AM CST</div>
                    <div class="g s4">
                      <img src="edit.png" />
                    </div>
                    <div class="g s5">
                      <img src="delete.png" />
                    </div>
                  </div>
                </div>
              </div>
              <button class="buttonadd">Add User +</button>
            </div>
          </div>
        </div>

        <div class="g comp2">
          <div class="right">
            <div class="con">
              <button class="duperr">Assign a User</button>
            </div>

            <div class="con">
              <button class="duperr">Give Another TA Access</button>
            </div>

            <div class="con">
              <button class="duperr">Check of Duplicate Users</button>
            </div>

            <div class="con">
              <button class="duperr">Check of Duplicate Relationships</button>
            </div>
          </div>
        </div>

        <div class="g comp3">
          <div class="bottom">
            <button class="button2">Save</button>
            <button class="button3">Cancel</button>

            <Button
              class="button3"
              onClick={(e) => {
                document.cookie = 'ta_uid=1;max-age=0';
                document.cookie = 'ta_email=1;max-age=0';
                document.cookie = 'patient_uid=1;max-age=0';
                document.cookie = 'patient_name=1;max-age=0';
                document.cookie = 'patient_email=1;max-age=0';
                document.cookie = 'patient_timeZone=1;max-age=0';
                document.cookie = 'patient_pic=1;max-age=0';

                loginContext.setLoginState({
                  ...loginContext.loginState,
                  loggedIn: false,
                  reload: false,
                  ta: {
                    ...loginContext.loginState.ta,
                    id: '',
                    email: '',
                  },
                  usersOfTA: [],
                  curUser: '',
                  curUserTimeZone: '',
                  curUserEmail: '',
                });
                history.push('/');
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
