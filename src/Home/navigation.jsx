import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import makeStyles from '@material-ui/core/styles/makeStyles';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import LoginContext from '../LoginContext';

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;

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
      color: '#000000',
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
  const curUserPic = loginContext.loginState.curUserPic;
  const curUserName = loginContext.loginState.curUserName;
  var curUserID = '';
  var curUserTZ = '';

  let CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID_SPACE;
  let CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET_SPACE;
  const [taImage, setTaImage] = useState('');
  const [userImage, setUserImage] = useState('');
  console.log(currentUser, curUserPic);
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
    // axios.get(BASE_URL + 'getPeopleImages/' + selectedUser).then((response) => {
    //   console.log(response);
    //   setTaImage(response.data.result[0].url);
    //   setUserImage(curUserPic);
    // });
  }, []);
  const getTAImage = () => {
    axios.get(BASE_URL + 'getPeopleImages/' + selectedUser).then((response) => {
      console.log(response);
      if (response.data.result.length == 0) {
        setTaImage('');
      } else {
        setTaImage(response.data.result[0].url);
      }
    });
  };
  useEffect(() => {
    getTAImage();
    setUserImage(curUserPic);
  }, [loginContext.loginState.reload]);
  // useEffect(() => {
  //   setUserImage(curUserPic);
  // }, [currentUser]);
  console.log(CLIENT_ID, CLIENT_SECRET);
  const [taListCreated, toggleGetTAList] = useState(false);
  const [patientName, setPatientName] = useState('');

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
    console.log('document cookie list of users', listOfUsers);
    let elements = [];

    elements = listOfUsers.map((user) => (
      <option
        key={user.user_unique_id}
        // value={user.user_unique_id}
        style={{
          font: 'normal normal bold 16px Quicksand-Bold',
          color: '#000000',
        }}
        value={JSON.stringify({
          user_unique_id: user.user_unique_id,
          user_name: user.user_name,
          time_zone: user.time_zone,
          user_email_id: user.user_email_id,
          user_picture: user.user_picture,
        })}
      >
        {user.user_name}
        {/* {
          document.cookie
            .split('; ')
            .find((row) => row.startsWith('patient_name='))
            .split('=')[1]
        } */}
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
          document.cookie = 'patient_pic=' + listOfUsers[0].user_picture;
        }
      }
    } else {
      if (listOfUsers[0]) {
        console.log('document cookie set to first user');
        document.cookie = 'patient_email=' + listOfUsers[0].user_email_id;
        document.cookie = 'patient_name=' + listOfUsers[0].user_name;
        document.cookie = 'patient_timeZone=' + listOfUsers[0].time_zone;
        document.cookie = 'patient_uid=' + listOfUsers[0].user_unique_id;
        document.cookie = 'patient_pic=' + listOfUsers[0].user_picture;

        console.log('document cookie set to loading');
        document.cookie = 'patient_name=Loading';
      }
    }
    return elements;
  };

  return (
    <>
      <AppBar
        className={classes.navigationBar}
        style={{
          position: 'static',
          paddingTop: '0.3rem',
          paddingLeft: '0',
          paddingRight: '0',
        }}
      >
        <Toolbar className={classes.customizeToolbar}>
          <div className={classes.displayNav}>
            <Col xs={4}>
              <img
                src="/Logo.png"
                style={{ maxWidth: '70%', minWidth: '70%' }}
              />
            </Col>

            {document.cookie
              .split(';')
              .some((item) => item.trim().startsWith('ta_uid=')) ? (
              <Col
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'right',
                  padding: 0,
                }}
              >
                <Row
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <Col
                    xs={12}
                    style={{
                      display: 'flex',
                      justifyContent: 'right',
                      padding: 0,
                    }}
                  >
                    <Col
                      xs={8}
                      style={{
                        display: 'flex',
                        justifyContent: 'right',
                        padding: 0,
                        paddingRight: '1rem',
                      }}
                    >
                      {document.cookie
                        .split(';')
                        .some((item) =>
                          item.trim().startsWith('patient_pic=')
                        ) ? (
                        document.cookie
                          .split('; ')
                          .find((row) => row.startsWith('patient_pic='))
                          .split('=')[1] !== '' ? (
                          <img
                            src={
                              document.cookie
                                .split('; ')
                                .find((row) => row.startsWith('patient_pic='))
                                .split('=')[1]
                            }
                            style={{
                              width: '45px',
                              height: '45px',
                              borderRadius: '100%',
                            }}
                          />
                        ) : (
                          <img
                            src={'/UserNoImage.png'}
                            style={{
                              width: '45px',
                              height: '45px',
                              borderRadius: '100%',
                            }}
                          />
                        )
                      ) : (
                        <img
                          src={'/UserNoImage.png'}
                          style={{
                            width: '45px',
                            height: '45px',
                            borderRadius: '100%',
                          }}
                        />
                      )}
                    </Col>

                    <Col
                      style={{
                        // display: 'flex',
                        // justifyContent: 'left',
                        padding: 0,
                      }}
                    >
                      <Row
                        style={{
                          height: '0.3rem',
                          alignItems: 'left',
                        }}
                      >
                        <p
                          style={{
                            color: '#000000',
                            font: 'normal normal bold 12px Quicksand-Bold',
                            marginBottom: '0',
                            marginTop: '-0.2rem',
                            // paddingLeft: '1rem',
                            padding: 0,
                            textAlign: 'right',
                          }}
                        >
                          Patient:
                        </p>
                      </Row>
                      <Row style={{ alignItems: 'left' }}>
                        <select
                          className={classes.myButton}
                          value={selectedUser.user_unique_id}
                          onChange={(e) => {
                            console.log('e.target.value', e.target.value);
                            setUserImage(
                              JSON.parse(e.target.value).user_picture
                            );
                            document.cookie =
                              'patient_uid=' +
                              JSON.parse(e.target.value).user_unique_id;
                            document.cookie =
                              'patient_name=' +
                              JSON.parse(e.target.value).user_name;
                            document.cookie =
                              'patient_timeZone=' +
                              JSON.parse(e.target.value).time_zone;
                            document.cookie =
                              'patient_email=' +
                              JSON.parse(e.target.value).user_email_id;
                            document.cookie =
                              'patient_pic=' +
                              JSON.parse(e.target.value).user_picture;
                            console.log(document.cookie);
                            loginContext.setLoginState({
                              ...loginContext.loginState,
                              curUser: JSON.parse(e.target.value)
                                .user_unique_id,
                              curUserTimeZone: JSON.parse(e.target.value)
                                .time_zone,
                              curUserEmail: JSON.parse(e.target.value)
                                .user_email_id,
                              curUserPic: JSON.parse(e.target.value)
                                .user_picture,
                              curUserName: JSON.parse(e.target.value).user_name,
                            });
                            // setUserImage(
                            //   JSON.parse(e.target.value).user_picture
                            // );

                            toggleGetTAList(false);
                            // toggleGetUnassignedList(false);

                            setPatientName(
                              JSON.parse(e.target.value).user_name
                            );
                          }}
                          style={{
                            font: 'normal normal bold 16px Quicksand-Bold',
                            background: '#FFFFFF 0% 0% no-repeat padding-box',
                            border: '1px solid #707070',
                            borderRadius: '10px',
                            width: '80%',
                          }}
                        >
                          <option selected disabled>
                            {
                              document.cookie
                                .split('; ')
                                .find((row) => row.startsWith('patient_name='))
                                .split('=')[1]
                            }
                          </option>
                          {/* <option selected disabled>
                            {
                              document.cookie
                                .split('; ')
                                .find((row) => row.startsWith('patient_name='))
                                .split('=')[1]
                            }
                          </option> */}
                          {userListRendered()}
                        </select>
                      </Row>
                    </Col>
                  </Col>
                </Row>
                <Col
                  xs={1}
                  style={{
                    display: 'flex',
                    justifyContent: 'right',
                    padding: 0,
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'right',
                    }}
                  >
                    <img
                      src="/Search.png"
                      style={{
                        width: '45px',
                        height: '45px',
                        borderRadius: '100%',
                      }}
                      onClick={() => history.push('/admin')}
                    />
                  </div>
                </Col>
                <Col
                  xs={1}
                  style={{
                    display: 'flex',
                    justifyContent: 'right',
                    padding: 0,
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'right',
                    }}
                  >
                    {' '}
                    {taImage === '' ? (
                      <img
                        src={'/UserNoImage.png'}
                        style={{
                          width: '45px',
                          height: '45px',
                          borderRadius: '100%',
                          cursor: 'pointer',
                        }}
                        onClick={() => history.push('/admin')}
                      />
                    ) : (
                      <img
                        src={taImage}
                        style={{
                          width: '45px',
                          height: '45px',
                          borderRadius: '100%',
                          cursor: 'pointer',
                        }}
                        onClick={() => history.push('/admin')}
                      />
                    )}
                  </div>
                </Col>
              </Col>
            ) : null}
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
}
