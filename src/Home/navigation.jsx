import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { GoogleLogin } from 'react-google-login';
import TimezoneSelect from 'react-timezone-select';
import LoginContext from '../LoginContext';
import axios from 'axios';
import { CompareSharp } from '@material-ui/icons';
import { faYenSign } from '@fortawesome/free-solid-svg-icons';

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;
const ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;

/* Custom Hook to make styles */
const useStyles = makeStyles({
  /* navigationContainer */
  navigationBar: {
    background: '#F2F7FC',
    width: '100%',
  },
  customizeToolbar: {
    minHeight: 36,
  },

  /* displaying the navigationBar as flex Containers */
  displayNav: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
  },

  /* Title of the Navigation Bar */
  titleElement: {
    flex: 1.5,
    fontSize: '150%',
    font: 'normal normal bold 32px/40px Quicksand-Bold',
    color: '#000000',
    fontWeight: 'bold',
  },

  /* Button  container for the navigation Bar */
  buttonContainer: {
    flex: 1,

    display: 'flex',

    justifyContent: 'flex-start',

    textTransform: 'none',
  },

  /* Color of the Button in Navigation Bar */
  buttonColor: {
    color: '#FFFFFF',
  },

  myButton: {
    backgroundColor: '#F2F7FC',
    color: '#000000',
    border: '2px solid #000000',
    borderRadius: '15px',
    '&:hover, &:focus': {
      backgroundColor: '#000000',
      color: '#F2F7FC',
    },
    height: '40px',
    width: '30%',
    textTransform: 'capitalize',
    margin: '4px',
  },
});

/* Navigation Bar component function */
export function Navigation() {
  const history = useHistory();

  const classes = useStyles();

  const loginContext = useContext(LoginContext);
  console.log(loginContext);
  const listOfUsers = loginContext.loginState.usersOfTA;
  var selectedUser = loginContext.loginState.curUser;
  const currentUser = loginContext.loginState.curUser;
  var curUserID = '';
  var curUserTZ = '';

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
  console.log(CLIENT_ID, CLIENT_SECRET);
  // const selectedUser = document.cookie.split('; ').find(row => row.startsWith('ta_uid=')).split('=')[1]
  // const [selectedUser, setSelectedUser] = useState('')
  const [showNewUser, toggleNewUser] = useState(false);
  const [showGiveAccess, toggleGiveAccess] = useState(false);
  const [showAssignUser, toggleAssignUser] = useState(false);
  const [showConfirmed, toggleConfirmed] = useState(false);
  const [showAssignConfirmed, toggleAssignConfirmed] = useState(false);
  const [taListCreated, toggleGetTAList] = useState(false);
  const [uaListCreated, toggleGetUnassignedList] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState({});
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [tokenInfo, setTokenInfo] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [patientName, setPatientName] = useState('');
  const [emailUser, setEmailUser] = useState('');
  const [socialId, setSocialId] = useState('');
  const [refreshToken, setrefreshToken] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [accessExpiresIn, setaccessExpiresIn] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [taName, setTAName] = useState('');
  const [taID, setTAID] = useState('');
  const [taList, setTAList] = useState([]);
  const [uaList, setUnassignedList] = useState([]);
  const [userID, setUserID] = useState('');
  let redirecturi = 'https://manifestmy.space';
  console.log(redirecturi);

  console.log('document cookie', document.cookie);
  if (
    document.cookie.split(';').some((item) => item.trim().startsWith('ta_uid='))
  ) {
    selectedUser = document.cookie
      .split('; ')
      .find((row) => row.startsWith('ta_uid='))
      .split('=')[1];
  }

  console.log('User list', listOfUsers);
  console.log('Cur ta', selectedUser);

  const userListRendered = () => {
    // if (
    //   document.cookie
    //     .split(';')
    //     .some((item) => item.trim().startsWith('ta_uid='))
    // ) {
    //   // var temp = document.cookie
    //   //   .split('; ')
    //   //   .find((row) => row.startsWith('ta_uid='))
    //   //   .split('=')[1];
    //   // console.log(temp)
    //   selectedUser = document.cookie
    //     .split('; ')
    //     .find((row) => row.startsWith('ta_uid='))
    //     .split('=')[1];

    console.log('document cookie list of users', listOfUsers);
    let elements = [];

    elements = listOfUsers.map((user) => (
      <option
        key={user.user_unique_id}
        // value={user.user_unique_id}
        value={JSON.stringify({
          user_unique_id: user.user_unique_id,
          user_name: user.user_name,
          time_zone: user.time_zone,
          user_email_id: user.user_email_id,
        })}
      >
        {user.user_name}
      </option>
    ));

    console.log('document cookie', document.cookie);
    if (
      document.cookie
        .split(';')
        .some((item) => item.trim().startsWith('patient_name='))
    ) {
      if (
        document.cookie
          .split('; ')
          .find((row) => row.startsWith('patient_name='))
          .split('=')[1] == 'Loading'
      ) {
        console.log('do something here', listOfUsers);
        if (listOfUsers[0]) {
          console.log('document cookie set to first user');
          document.cookie = 'patient_name=' + listOfUsers[0].user_name;
          document.cookie = 'patient_timeZone=' + listOfUsers[0].time_zone;
          document.cookie = 'patient_uid=' + listOfUsers[0].user_unique_id;
          document.cookie = 'patient_email=' + listOfUsers[0].user_email_id;
        }
      }
    } else {
      if (listOfUsers[0]) {
        console.log('document cookie set to first user');
        document.cookie = 'patient_email=' + listOfUsers[0].user_email_id;
        document.cookie = 'patient_name=' + listOfUsers[0].user_name;
        document.cookie = 'patient_timeZone=' + listOfUsers[0].time_zone;
        document.cookie = 'patient_uid=' + listOfUsers[0].user_unique_id;
      } else {
        console.log('document cookie set to loading');
        document.cookie = 'patient_name=Loading';
      }
    }
    return elements;
  };

  const taListRendered = () => {
    console.log('ta list', taList);
    // console.log(taList)
    taList.sort((a, b) => a.ta_first_name.localeCompare(b.ta_first_name));
    const elements = taList.map((ta) => (
      <option
        key={ta.ta_unique_id}
        value={JSON.stringify({
          ta_unique_id: ta.ta_unique_id,
          ta_first_name: ta.ta_first_name,
          ta_last_name: ta.ta_last_name,
        })}
      >
        {ta.ta_last_name}, {ta.ta_first_name}
      </option>
    ));
    return elements;
  };

  const uaListRendered = () => {
    console.log('ua list', uaList);
    // console.log(uaList)
    // uaList.sort((a, b) => a.ua_first_name.localeCompare(b.ua_first_name));
    const elements = uaList.map((ua) => (
      <option
        key={ua.user_unique_id}
        value={JSON.stringify({
          user_unique_id: ua.user_unique_id,
          name: ua.name,
        })}
      >
        {ua.name}
      </option>
    ));
    return elements;
  };

  const getTAList = () => {
    if (!taListCreated) {
      console.log('in getTAList: ' + selectedUser);
      axios
        .get(BASE_URL + 'listAllTA/' + selectedUser)
        .then((response) => {
          console.log(response.data);
          //taList = response.data.result
          setTAList(response.data.result);
          console.log(taList);

          toggleGetTAList(true);
        })
        .catch((err) => {
          if (err.response) {
            console.log(err.response);
          }
          console.log(err);
        });
    }
  };

  const getUnassignedList = () => {
    if (!uaListCreated) {
      console.log('in getUnassignedList: ');
      axios
        .get(BASE_URL + 'ListAllAdminUsers')
        .then((response) => {
          console.log(response.data);
          //uaList = response.data.result
          setUnassignedList(response.data.result);
          console.log('ua list GET', uaList);

          toggleGetUnassignedList(true);
        })
        .catch((err) => {
          if (err.response) {
            console.log(err.response);
          }
          console.log(err);
        });
    }
  };

  /* History of the HomePage URL which is shown url tab */
  function homeNavigation() {
    history.push('/home');
  }

  /* History of the ContactPage URL which is shown url tab */
  function loginNavigation() {
    history.push('/login');
  }

  function newUserModal() {
    // if (showNewUser) {
    // } else {
    //   return null
    // }
  }

  const giveAccessModal = () => {
    if (showGiveAccess) {
      return (
        <div
          style={{
            height: '100%',
            width: '100%',
            zIndex: '101',
            left: '0',
            top: '0',
            overflow: 'auto',
            position: 'fixed',
            display: 'grid',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          <div
            style={{
              position: 'relative',
              justifySelf: 'center',
              alignSelf: 'center',
              display: 'block',
              backgroundColor: '#E6E6E6',
              width: '400px',
              // height: "100px",
              color: '#000000',
              padding: '40px',
              font: ' normal normal bold 20px Quicksand-Bold',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              Give another advisor access
            </div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              Are you sure you want to give {taName} access to the information
              of user, {patientName}
            </div>
            <div>
              <button
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#7D7D7D',
                  border: '1px solid #7D7D7D',
                  borderRadius: '5px',
                  width: '30%',
                  marginLeft: '10%',
                  marginRight: '10%',
                }}
                onClick={() => {
                  toggleGiveAccess(false);
                }}
              >
                No
              </button>
              <button
                style={{
                  backgroundColor: '#09B4FF',
                  color: 'white',
                  border: '1px solid #FFFFFF',
                  borderRadius: '5px',
                  width: '30%',
                  marginLeft: '10%',
                  marginRight: '10%',
                }}
                onClick={() => {
                  // let myObj = {
                  //   ta_people_id: taID,
                  //   user_id: selectedUser
                  // }
                  console.log('TA', taID, currentUser);

                  axios
                    .post(BASE_URL + 'anotherTAAccess', {
                      ta_people_id: taID,
                      user_id: currentUser,
                    })
                    .then((response) => {
                      console.log(response);
                    });

                  toggleConfirmed(true);
                  toggleGetTAList(false);
                  toggleGiveAccess(false);
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  /* Sanmesh3 Assign User Modal */
  const assignUserModal = () => {
    if (showAssignUser) {
      return (
        <div
          style={{
            height: '100%',
            width: '100%',
            zIndex: '101',
            left: '0',
            top: '0',
            overflow: 'auto',
            position: 'fixed',
            display: 'grid',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          <div
            style={{
              position: 'relative',
              justifySelf: 'center',
              alignSelf: 'center',
              display: 'block',
              backgroundColor: '#F2F7FC',
              width: '400px',
              // height: "100px",
              color: '#000000',
              padding: '40px',
              font: 'normal normal bold 20px Quicksand-Bold',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              Assign user to TA
            </div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              Are you sure you want to assign selected user to TA?
            </div>
            <div>
              <button
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#7D7D7D',
                  border: '1px solid #7D7D7D',
                  borderRadius: '5px',
                  width: '30%',
                  marginLeft: '10%',
                  marginRight: '10%',
                }}
                onClick={() => {
                  toggleAssignUser(false);
                }}
              >
                No
              </button>
              <button
                style={{
                  backgroundColor: '#09B4FF',
                  color: 'white',
                  border: '1px solid #FFFFFF',
                  borderRadius: '5px',
                  width: '30%',
                  marginLeft: '10%',
                  marginRight: '10%',
                }}
                onClick={() => {
                  // let myObj = {
                  //   ta_people_id: taID,
                  //   user_id: selectedUser
                  // }
                  // console.log('TA', taID, currentUser);

                  axios
                    .post(BASE_URL + 'AssociateUser', {
                      ta_people_id: selectedUser,
                      user_id: userID,
                    })
                    .then((response) => {
                      console.log(response);
                      loginContext.setLoginState({
                        ...loginContext.loginState,
                        reload: !loginContext.loginState.reload,
                      });
                    });

                  toggleAssignConfirmed(true);
                  toggleGetUnassignedList(false);
                  toggleAssignUser(false);
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const confirmedModal = () => {
    if (showConfirmed) {
      return (
        <div
          style={{
            height: '100%',
            width: '100%',
            zIndex: '101',
            left: '0',
            top: '0',
            overflow: 'auto',
            position: 'fixed',
            display: 'grid',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          <div
            style={{
              position: 'relative',
              justifySelf: 'center',
              alignSelf: 'center',
              display: 'block',
              backgroundColor: '#E6E6E6',
              width: '400px',
              // height: "100px",
              color: '#000000',
              font: 'normal normal bold 20px Quicksand-Bold',
              padding: '40px',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              Access Granted
            </div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              {taName} now has access to the information of user, {patientName}
            </div>
            <div style={{ textAlign: 'center' }}>
              <button
                style={{
                  backgroundColor: '#09B4FF',
                  color: 'white',
                  border: 'solid',
                  borderWidth: '2px',
                  borderRadius: '5px',
                  width: '30%',
                  marginLeft: '10%',
                  marginRight: '10%',
                }}
                onClick={() => {
                  toggleConfirmed(false);
                }}
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  /* Sanmesh3 Assign User Modal */
  const assignConfirmedModal = () => {
    if (showAssignConfirmed) {
      return (
        <div
          style={{
            height: '100%',
            width: '100%',
            zIndex: '101',
            left: '0',
            top: '0',
            overflow: 'auto',
            position: 'fixed',
            display: 'grid',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          <div
            style={{
              position: 'relative',
              justifySelf: 'center',
              alignSelf: 'center',
              display: 'block',
              backgroundColor: '#E6E6E6',
              width: '400px',
              // height: "100px",
              color: '#000000',
              font: 'normal normal bold 20px Quicksand-Bold',
              padding: '40px',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              Access Granted
            </div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              Selected user now assigned to TA
            </div>
            <div style={{ textAlign: 'center' }}>
              <button
                style={{
                  backgroundColor: '#09B4FF',
                  color: 'white',
                  border: 'solid',
                  borderWidth: '2px',
                  borderRadius: '5px',
                  width: '30%',
                  marginLeft: '10%',
                  marginRight: '10%',
                }}
                onClick={() => {
                  toggleAssignConfirmed(false);
                }}
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  console.log('from nav');
  console.log(loginContext);
  getTAList();
  getUnassignedList();
  console.log(taList);
  console.log(uaList);

  function onSubmitUser() {
    let body = {
      email_id: emailUser,
      password: '',
      google_auth_token: accessToken,
      google_refresh_token: refreshToken,
      social_id: socialId,
      access_expires_in: accessExpiresIn,
      first_name: firstName,
      last_name: lastName,
      time_zone: selectedTimezone.value,
      ta_people_id: selectedUser,
    };
    console.log('body', body);
    axios
      .post(BASE_URL + 'addNewUser', body)
      .then((response) => {
        console.log(response.data);
        loginContext.setLoginState({
          ...loginContext.loginState,
          reload: !loginContext.loginState.reload,
        });
      })
      .catch((error) => {
        console.log('its in landing page');
        console.log(error);
      });
  }

  return (
    <>
      {/* {newUserModal()} */}

      {giveAccessModal()}
      {assignUserModal()}
      {confirmedModal()}
      {assignConfirmedModal()}
      <AppBar className={classes.navigationBar} style={{ position: 'static' }}>
        <Toolbar className={classes.customizeToolbar}>
          <div className={classes.displayNav}>
            <div style={{ width: '30%', textAlign: 'left' }}>
              <Box style={{ textAlign: 'left' }}>
                <Typography
                  className={classes.titleElement}
                  onClick={() => {
                    history.push('/home');
                  }}
                >
                  Manifest My Life
                </Typography>
              </Box>
            </div>
            {/* <div style={{ width: '30%' }}>{userListRendered()} </div> */}
            <div
              style={{
                width: '40%',
              }}
            >
              {document.cookie
                .split(';')
                .some((item) => item.trim().startsWith('ta_uid=')) ? (
                <div
                  style={{
                    width: '100%',
                  }}
                >
                  Patient:&nbsp;
                  <select
                    className={classes.myButton}
                    value={selectedUser.user_unique_id} // this is probably wrong
                    onChange={(e) => {
                      document.cookie =
                        'patient_uid=' +
                        JSON.parse(e.target.value).user_unique_id;
                      document.cookie =
                        'patient_name=' + JSON.parse(e.target.value).user_name;
                      document.cookie =
                        'patient_timeZone=' +
                        JSON.parse(e.target.value).time_zone;
                      document.cookie =
                        'patient_email=' +
                        JSON.parse(e.target.value).user_email_id;
                      console.log(document.cookie);
                      loginContext.setLoginState({
                        ...loginContext.loginState,
                        curUser: JSON.parse(e.target.value).user_unique_id,
                        curUserTimeZone: JSON.parse(e.target.value).time_zone,
                        curUserEmail: JSON.parse(e.target.value).user_email_id,
                      });
                      toggleGetTAList(false);
                      // toggleGetUnassignedList(false);

                      setPatientName(JSON.parse(e.target.value).user_name);
                    }}
                  >
                    <option selected disabled hidden>
                      {
                        document.cookie
                          .split('; ')
                          .find((row) => row.startsWith('patient_name='))
                          .split('=')[1]
                      }
                    </option>

                    {userListRendered()}
                  </select>
                </div>
              ) : null}
            </div>

            <div
              style={{
                width: '20%',
                marginLeft: '-17rem',
                // marginRight: '-10rem',
              }}
            >
              {document.cookie
                .split(';')
                .some((item) => item.trim().startsWith('ta_uid=')) ? (
                <div
                  style={{
                    width: '200%',
                  }}
                >
                  <select
                    className={classes.myButton}
                    style={{ textAlign: 'center', display: 'inline' }}
                    onChange={(e) => {
                      if (e.target.value != null) {
                        console.log(
                          'Assigning List',
                          JSON.parse(e.target.value)
                        );

                        setUserID(JSON.parse(e.target.value).user_unique_id);
                        toggleAssignUser(true);
                      }
                    }}
                  >
                    {/* Assign User Dropdown */}
                    <option value="null" selected>
                      Assign User
                    </option>
                    {uaListRendered()}
                  </select>
                </div>
              ) : null}
            </div>

            {/* {userListRendered()} */}

            <div
              className={classes.buttonContainer}
              style={{ width: '40%', textAlign: 'justify' }}
            >
              {/* <Button
                className={classes.buttonColor}
                variant="text"
                onClick={homeNavigation}
              >
                Home
              </Button>

              <Button
                className={classes.buttonColor}
                variant={'text'}
                onClick={loginNavigation}
              >
                Not Impossible
              </Button>

              <Button
                className={classes.buttonColor}
                variant={'text'}
                //  onClick={contactNavigation}
              >
                Infinite Options
              </Button>

              <Button
                className={classes.buttonColor}
                variant={'text'}
                // onClick={contactNavigation}
              >
                Sign In
              </Button> */}
              {document.cookie
                .split(';')
                .some((item) => item.trim().startsWith('ta_uid=')) ? (
                <div style={{ width: '100%', textAlign: 'justify' }}>
                  <Button
                    //className={classes.buttonColor}
                    //variant="text"
                    //onClick={homeNavigation}
                    // style={{
                    //   color: 'white',
                    //   border:'solid',
                    //   borderwidth: '1px',
                    //   borderRadius: '22px',
                    // }}
                    className={classes.myButton}
                    style={{ float: 'right' }}
                    onClick={(e) => {
                      document.cookie = 'ta_uid=1;max-age=0';
                      document.cookie = 'ta_email=1;max-age=0';
                      document.cookie = 'patient_uid=1;max-age=0';
                      document.cookie = 'patient_name=1;max-age=0';
                      document.cookie = 'patient_email=1;max-age=0';
                      document.cookie = 'patient_timeZone=1;max-age=0';

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
                  <div
                    style={{
                      float: 'left',
                      width: '60%',
                      borderRadius: '15px',
                    }}
                  >
                    <select
                      //className={classes.buttonColor}
                      //variant="text"
                      //onClick={homeNavigation}
                      className={classes.myButton}
                      style={{
                        float: 'left',
                        width: '100%',
                        backgroundColor: '#F2F7FC',
                      }}
                      onChange={(e) => {
                        if (e.target.value != null) {
                          console.log('Another', JSON.parse(e.target.value));
                          setTAName(
                            JSON.parse(e.target.value).ta_first_name +
                              ' ' +
                              JSON.parse(e.target.value).ta_last_name
                          );
                          setTAID(JSON.parse(e.target.value).ta_unique_id);
                          toggleGiveAccess(true);
                        }
                      }}
                    >
                      {/* Give another Advisor Access */}
                      <option value="null" selected>
                        Give Another Advisor Access
                      </option>
                      {/* <option>
                      test name
                    </option> */}
                      {taListRendered()}
                    </select>
                  </div>

                  {/* <Button
                  //className={classes.buttonColor}
                  //variant="text"
                  //onClick={homeNavigation}
                  // style={{
                  //   color: 'white',
                  //   border:'solid',
                  //   borderwidth: '1px',
                  //   borderRadius: '22px',
                  // }}
                  className = {classes.myButton}
                  style={{float: 'right'}}
                  onClick={(e) => {
                     googleLogIn();
                   // toggleNewUser(!showNewUser)

                  }}
                  >
                    Create New User
                  </Button> */}
                  {/* <GoogleLogin
                    //clientId="1009120542229-9nq0m80rcnldegcpi716140tcrfl0vbt.apps.googleusercontent.com"
                    clientId={
                      BASE_URL.substring(8, 18) == 'gyn3vgy3fb'
                        ? process.env.REACT_APP_GOOGLE_CLIENT_ID_SPACE
                        : process.env.REACT_APP_GOOGLE_CLIENT_ID_LIFE
                    }
                    //clientId={ID}
                    render={(renderProps) => (
                      <Button
                        className={classes.myButton}
                        style={{ float: 'right' }}
                        onClick={renderProps.onClick}
                        disabled={renderProps.disabled}
                      >
                        {' '}
                        Create New User
                      </Button>
                    )}
                    // accessType="offline"
                    // prompt="consent"
                    // responseType="code"
                    // buttonText="Log In"
                    accessType="offline"
                    prompt="consent"
                    responseType="code"
                    buttonText="Log In"
                    ux_mode="redirect"
                    redirectUri={
                      BASE_URL.substring(8, 18) == '3s3sftsr90'
                        ? 'https://manifestmy.space'
                        : 'https://manifestmy.life'
                    }
                    //redirectUri="http://localhost:3000"
                    scope="https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/photoslibrary.readonly"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    isSignedIn={false}
                    disable={true}
                    cookiePolicy={'single_host_origin'}
                  /> */}
                </div>
              ) : null}
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
}
