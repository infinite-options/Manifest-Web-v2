import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Col, Container, Form, Modal, Row } from 'react-bootstrap';
import axios from 'axios';
import Popover from '@material-ui/core/Popover';
import moment from 'moment';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { GoogleLogin } from 'react-google-login';
import TimezoneSelect from 'react-timezone-select';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import LoginContext from '../LoginContext';
import './Admin_style.css';

import MiniNavigation from '../manifest/miniNavigation';
const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;

const useStyles = makeStyles({
  loginbutton: {
    background: '#000000 0% 0% no-repeat padding-box',
    borderRadius: '10px',
    font: 'normal normal  16px Quicksand-Regular',
    color: '#ffffff',
    textTransform: 'none',
    width: '100%',
    marginTop: '0.3rem',
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
    textTransform: 'none',
    width: '100%',
    marginTop: '0.3rem',
  },
});

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
  var selectedTA = loginContext.loginState.ta.id;
  const currentUser = loginContext.loginState.curUser;
  const curUserPic = loginContext.loginState.curUserPic;
  const curUserName = loginContext.loginState.curUserName;

  var usrID = '';
  var tID = '';
  var userTime_zone = '';
  var userEmail = '';
  var userN = '';
  var userPic = '';

  if (
    document.cookie
      .split(';')
      .some((item) => item.trim().startsWith('patient_uid='))
  ) {
    usrID = document.cookie
      .split('; ')
      .find((row) => row.startsWith('patient_uid='))
      .split('=')[1];
    tID = document.cookie
      .split('; ')
      .find((row) => row.startsWith('ta_uid='))
      .split('=')[1];
    userTime_zone = document.cookie
      .split('; ')
      .find((row) => row.startsWith('patient_timeZone='))
      .split('=')[1];
    userEmail = document.cookie
      .split('; ')
      .find((row) => row.startsWith('patient_email='))
      .split('=')[1];
    userPic = document.cookie
      .split('; ')
      .find((row) => row.startsWith('patient_pic='))
      .split('=')[1];
    userN = document.cookie
      .split('; ')
      .find((row) => row.startsWith('patient_name='))
      .split('=')[1];
  } else {
    usrID = loginContext.loginState.curUser;
    userTime_zone = loginContext.loginState.curUserTimeZone;
    userEmail = loginContext.loginState.curUserEmail;
    userPic = loginContext.loginState.curUserPic;
    userN = loginContext.loginState.curUserName;
  }

  console.log(selectedTA, currentUser, curUserName);
  const [called, toggleCalled] = useState(false);
  const [showNewUser, toggleNewUser] = useState(false);
  const [showGiveAccess, toggleGiveAccess] = useState(false);
  const [showAssignUser, toggleAssignUser] = useState(false);
  const [showConfirmed, toggleConfirmed] = useState(false);
  const [showAssignConfirmed, toggleAssignConfirmed] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [emailUser, setEmailUser] = useState('');
  const [socialId, setSocialId] = useState('');
  const [refreshToken, setrefreshToken] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [accessExpiresIn, setaccessExpiresIn] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [deleteUser, setDeleteUser] = useState(false);
  const [relinquishRole, setRelinquishRole] = useState(false);
  const [taName, setTAName] = useState('');
  const [taID, setTAID] = useState('');
  const [taList, setTAList] = useState([]);
  const [uaList, setUnassignedList] = useState([]);
  const [userID, setUserID] = useState('');
  const [taListUser, setTaListUser] = useState([]);
  const [anchorElTA, setAnchorElTA] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [duplicateRelationships, setDuplicateRelationships] = useState(false);
  const [duplicateList, setDuplicateList] = useState([]);
  const [selectedRelationship, setSelectedRelationship] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState('');
  let redirecturi = 'https://manifestmy.space';

  console.log('taListUser', taListUser.length);

  const getUserOfTA = () => {
    axios
      .get(
        BASE_URL +
          'usersOfTA/' +
          document.cookie
            .split('; ')
            .find((row) => row.startsWith('ta_email='))
            .split('=')[1]
      )
      .then((response) => {
        console.log('list of users home', response.data.result);
        if (response.data.result.length > 0) {
          const usersOfTA = response.data.result;
          const curUserID = usersOfTA[0].user_unique_id;
          const curUserTZ = usersOfTA[0].time_zone;
          const curUserEI = usersOfTA[0].user_email_id;
          const curUserP = usersOfTA[0].user_picture;
          const curUserN = usersOfTA[0].user_name;
          console.log('timezone', curUserTZ);
          loginContext.setLoginState({
            ...loginContext.loginState,
            usersOfTA: response.data.result,
            curUser: curUserID,
            curUserTimeZone: curUserTZ,
            curUserEmail: curUserEI,
            curUserPic: curUserP,
            curUserName: curUserN,
          });
          console.log(curUserID);
          console.log('timezone', curUserTZ);

          //GoogleEvents();
          // return userID;
        } else {
          // const usersOfTA = 'Loading';
          // loginContext.setLoginState({
          //   ...loginContext.loginState,
          //   usersOfTA: response.data.result,
          //   curUser: '',
          //   curUserTimeZone: '',
          //   curUserEmail: '',
          // });
          console.log('No User Found');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getTAofUser = () => {
    axios
      .get(BASE_URL + 'ListAllTAUser/' + usrID)
      .then((response) => {
        console.log('listAllTAUser', response.data.result);
        setTaListUser(response.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getUserOfTA();
    getTAofUser();
  }, [usrID, loginContext.loginState.reload]);

  //popover open and close
  const handleClickTA = (event) => {
    setAnchorElTA(event.currentTarget);
  };

  const handleCloseTA = () => {
    setAnchorElTA(null);
  };

  const openTA = Boolean(anchorElTA);
  const idTA = openTA ? 'simple-popover' : undefined;

  //popover open and close
  const handleClickUser = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUser = () => {
    setAnchorElUser(null);
  };

  const openUser = Boolean(anchorElUser);
  const idUser = openUser ? 'simple-popover' : undefined;

  // const taListRendered = () => {
  //   console.log('ta list', taList);
  //   // console.log(taList)
  //   taList.sort((a, b) => a.ta_first_name.localeCompare(b.ta_first_name));
  //   const elements = taList.map((ta) => (
  //     <option
  //       key={ta.ta_unique_id}
  //       value={JSON.stringify({
  //         ta_unique_id: ta.ta_unique_id,
  //         ta_first_name: ta.ta_first_name,
  //         ta_last_name: ta.ta_last_name,
  //       })}
  //     >
  //       {ta.ta_last_name}, {ta.ta_first_name}
  //     </option>
  //   ));
  //   return elements;
  // };

  const taListRendered = () => {
    taList.sort((a, b) => a.ta_first_name.localeCompare(b.ta_first_name));
    return (
      <div>
        {taList.map((ta) => {
          return (
            <div
              style={{
                cursor: 'pointer',
              }}
              onClick={(event) => {
                console.log('event', ta);
                if (ta != null) {
                  console.log('Another', ta);
                  setTAName(ta.ta_first_name + ' ' + ta.ta_last_name);
                  setTAID(ta.ta_unique_id);
                  toggleGiveAccess(true);
                }
                handleCloseTA();
              }}
            >
              {ta.ta_last_name}, {ta.ta_first_name}
            </div>
          );
        })}
      </div>
    );
  };

  // const uaListRendered = () => {
  //   console.log('ua list', uaList);
  //   // console.log(uaList)
  //   // uaList.sort((a, b) => a.ua_first_name.localeCompare(b.ua_first_name));
  //   const elements = uaList.map((ua) => (
  //     <option
  //       key={ua.user_unique_id}
  //       value={JSON.stringify({
  //         user_unique_id: ua.user_unique_id,
  //         name: ua.name,
  //       })}
  //     >
  //       {ua.name}
  //     </option>
  //   ));
  //   return elements;
  // };

  const uaListRendered = () => {
    console.log('ua list', uaList);
    // console.log(uaList)
    // uaList.sort((a, b) => a.ua_first_name.localeCompare(b.ua_first_name));
    return uaList.map((ua) => (
      <div
        style={{
          cursor: 'pointer',
        }}
        onClick={(e) => {
          if (ua != null) {
            console.log('Assigning List', ua);

            setUserID(ua.user_unique_id);
            toggleAssignUser(true);
          }
          handleCloseUser();
        }}
      >
        {ua.name}
      </div>
    ));
  };

  const getTAList = () => {
    console.log('in getTAList: ' + selectedTA);
    axios
      .get(BASE_URL + 'listAllTA/' + selectedTA)
      .then((response) => {
        console.log(response.data);
        //taList = response.data.result
        setTAList(response.data.result);
        console.log(taList);
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  };
  const getDuplicateRelationships = () => {
    console.log('in getDuplicateRelationships: ');
    axios
      .get(BASE_URL + 'relationships')
      .then((response) => {
        console.log(response.data.result[0]);
        //taList = response.data.result
        setDuplicateList(response.data.result);
        console.log(taList);
        setDuplicateRelationships(true);
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  };
  const getUnassignedList = () => {
    console.log('in getUnassignedList: ');
    axios
      .get(BASE_URL + 'ListAllAdminUsers')
      .then((response) => {
        console.log(response.data);
        //uaList = response.data.result
        setUnassignedList(response.data.result);
        console.log('ua list GET', uaList);
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  };
  const deleteRelationshipModal = () => {
    if (duplicateRelationships) {
      return (
        <div
          style={{
            height: '100%',
            maxHeight: '100%',
            width: '100%',
            zIndex: '101',
            left: '0',
            top: '0',
            overflow: 'auto',
            position: 'fixed',
            display: 'grid',
            boxShadow: ' 0px 3px 6px #00000029',
            borderRadius: '5px',
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
              // width: '400px',
              minHeight: 'auto',
              // overflow: 'scroll',
              color: '#000000',
              padding: '40px',
              font: 'normal normal bold 16px Quicksand-Bold',
            }}
          >
            <div style={{ textAlign: 'center' }}>Duplicate Relationships</div>
            <Table
              style={{
                textAlign: 'center',
                // marginBottom: '20px',
                height: '200px',
                overflow: 'scroll',
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>User Name</TableCell>
                  <TableCell>TA Name</TableCell>
                  <TableCell>Relationship Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {duplicateList.map((relation) => {
                  return (
                    <TableRow
                      onClick={() => setSelectedRelationship(relation.id)}
                    >
                      <TableCell>{relation.user_name}</TableCell>
                      <TableCell>{relation.ta_name}</TableCell>
                      <TableCell>
                        {moment(relation.r_timestamp).format(
                          'MMMM DD, YYYY, hh:mm a'
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <div>
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
                  console.log('Relation', selectedRelationship);

                  axios
                    .post(
                      BASE_URL + 'deleteRelationships/' + selectedRelationship
                    )
                    .then((response) => {
                      console.log(response);
                    });

                  setShowDeleteConfirm(true);
                  setDuplicateRelationships(false);
                }}
              >
                Yes
              </button>
              <button
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#7D7D7D',
                  border: '1px solid #A7A7A7',
                  borderRadius: '5px',
                  width: '30%',
                  marginLeft: '10%',
                  marginRight: '10%',
                }}
                onClick={() => {
                  setDuplicateRelationships(false);
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

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
            boxShadow: ' 0px 3px 6px #00000029',
            borderRadius: '5px',
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
              font: 'normal normal bold 16px Quicksand-Bold',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              Give another advisor access
            </div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              Are you sure you want to give {taName} access to the information
              of user, {curUserName}
            </div>
            <div>
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
                  //   user_id: selectedTA
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
                  toggleGiveAccess(false);
                }}
              >
                Yes
              </button>
              <button
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#7D7D7D',
                  border: '1px solid #A7A7A7',
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
            boxShadow: ' 0px 3px 6px #00000029',
            borderRadius: '5px',
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
              font: 'normal normal bold 16px Quicksand-Bold',
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
                  //   user_id: selectedTA
                  // }
                  // console.log('TA', taID, currentUser);

                  axios
                    .post(BASE_URL + 'AssociateUser', {
                      ta_people_id: selectedTA,
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
                  toggleAssignUser(false);
                }}
              >
                Yes
              </button>
              <button
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#7D7D7D',
                  border: '1px solid #A7A7A7',
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
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };
  const deleteModal = () => {
    if (deleteUser) {
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
            boxShadow: ' 0px 3px 6px #00000029',
            borderRadius: '5px',
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
              font: 'normal normal bold 16px Quicksand-Bold',
            }}
          >
            {/* <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              Changes saved
            </div> */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              Are you sure you want to delete the user?
            </div>
            <div style={{ textAlign: 'center' }}>
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
                  deleteUserFunc();
                  // let body = {
                  //   user_id: usrID,
                  // };
                  // axios.post(BASE_URL + 'deleteUser', body).then((response) => {
                  //   console.log('deleting');
                  //   console.log(response.data);
                  //   // document.cookie = 'patient_uid=1;max-age=0';
                  //   // document.cookie = 'patient_name=1;max-age=0';
                  //   // document.cookie = 'patient_email=1;max-age=0';
                  //   // document.cookie = 'patient_pic=1;max-age=0';
                  //   loginContext.setLoginState({
                  //     ...loginContext.loginState,
                  //     reload: !loginContext.loginState.reload,
                  //   });
                  //   setDeleteUser(!deleteUser);
                  //   toggleCalled(!called);
                  //   history.push('/home');
                  // });
                }}
              >
                Yes
                {console.log('list of users', loginContext.loginState.reload)}
              </button>
              <button
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#7D7D7D',
                  border: '1px solid #A7A7A7',
                  borderRadius: '5px',
                  width: '30%',
                  marginLeft: '10%',
                  marginRight: '10%',
                }}
                onClick={() => {
                  setDeleteUser(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const removeRoleModal = () => {
    if (relinquishRole) {
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
            boxShadow: ' 0px 3px 6px #00000029',
            borderRadius: '5px',
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
              font: 'normal normal bold 16px Quicksand-Bold',
            }}
          >
            {/* <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              Changes saved
            </div> */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              Are you sure you want to remove your role as the advisor?
            </div>
            <div style={{ textAlign: 'center' }}>
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
                  removeRoleFunc();
                }}
              >
                Yes
              </button>
              <button
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#7D7D7D',
                  border: '1px solid #A7A7A7',
                  borderRadius: '5px',
                  width: '30%',
                  marginLeft: '10%',
                  marginRight: '10%',
                }}
                onClick={() => {
                  setRelinquishRole(!relinquishRole);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };
  const confirmedDeleteModal = () => {
    if (showDeleteConfirm) {
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
            boxShadow: ' 0px 3px 6px #00000029',
            borderRadius: '5px',
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
              font: 'normal normal bold 16px Quicksand-Bold',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              Deleted
            </div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              The duplicate relationship has now been deleted!
            </div>
            <div style={{ textAlign: 'center' }}>
              <button
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#7D7D7D',
                  border: '1px solid #A7A7A7',
                  borderRadius: '5px',
                  width: '30%',
                  marginLeft: '10%',
                  marginRight: '10%',
                }}
                onClick={() => {
                  setShowDeleteConfirm(false);
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
            boxShadow: ' 0px 3px 6px #00000029',
            borderRadius: '5px',
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
              font: 'normal normal bold 16px Quicksand-Bold',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              Access Granted
            </div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              {taName} now has access to the information of user, {curUserName}
            </div>
            <div style={{ textAlign: 'center' }}>
              <button
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#7D7D7D',
                  border: '1px solid #A7A7A7',
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
            boxShadow: ' 0px 3px 6px #00000029',
            borderRadius: '5px',
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
              font: 'normal normal bold 16px Quicksand-Bold',
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
                  backgroundColor: '#FFFFFF',
                  color: '#7D7D7D',
                  border: '1px solid #A7A7A7',
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

  // getTAList();
  // getUnassignedList();

  const info = (accessToken) => {
    fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`,
      {
        method: 'GET',
      }
    )
      .then(async (response) => {
        // get json response here
        let data = await response.json();

        if (response.status === 200) {
          // Process data here
          setUserInfo(data);
          console.log('res', userInfo);
        } else {
          // Rest of status codes (400,500,303), can be handled here appropriately
          console.log('err');
        }
      })
      .catch((err) => {
        console.log(err);
      });

    let e = userInfo['email'];
    let fn = userInfo['given_name'];
    let ln = userInfo['family_name'];
    let si = userInfo['id'];

    setEmailUser(e);
    setFirstName(fn);
    setLastName(ln);
    setSocialId(si);

    document.cookie = 'patient_name=' + firstName + ' ' + lastName;
    document.cookie = 'patient_email=' + emailUser;
    //document.cookie = 'patient_name=Loading';
  };

  const responseGoogle = (response) => {
    console.log('response', response);

    let auth_code = response.code;
    let authorization_url = 'https://oauth2.googleapis.com/token';

    console.log('auth_code', auth_code);

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
    if (BASE_URL.substring(8, 18) == '3s3sftsr90') {
      console.log('base_url', BASE_URL.substring(8, 18));
      redirecturi = 'https://manifestmy.space';
    } else {
      console.log('base_url', BASE_URL.substring(8, 18));
      redirecturi = 'https://manifestmy.life';
    }

    var details = {
      code: auth_code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      // redirect_uri: redirecturi,
      redirect_uri: 'http://localhost:3000',
      grant_type: 'authorization_code',
    };

    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    fetch(authorization_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: formBody,
    })
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        console.log(responseData);
        return responseData;
      })
      .then((data) => {
        console.log(data);
        let at = data['access_token'];
        let rt = data['refresh_token'];
        let ax = data['expires_in'].toString();
        setAccessToken(at);
        setrefreshToken(rt);
        setaccessExpiresIn(ax);
        console.log('res', at, rt);

        axios
          .get(
            'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' +
              at
          )
          .then((response) => {
            console.log(response.data);

            let data = response.data;
            //setUserInfo(data);
            let e = data['email'];
            let fn = data['given_name'];
            let ln = data['family_name'];
            let si = data['id'];

            setEmailUser(e);
            setFirstName(fn);
            setLastName(ln);
            setSocialId(si);
          })
          .catch((error) => {
            console.log('its in landing page');
            console.log(error);
          });

        //console.log('res', userInfo);
        //  let e = userInfo['email'];
        //  let fn = userInfo['given_name'];
        //  let ln = userInfo['family_name'];
        //  let si = userInfo['id'];

        //  setEmailUser(e);
        //  setFirstName(fn);
        //  setLastName(ln);
        //  setSocialId(si);
        toggleNewUser(!showNewUser);

        return (
          accessToken,
          refreshToken,
          accessExpiresIn,
          emailUser,
          firstName,
          lastName,
          socialId
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
  function removeRoleFunc() {
    let body = {
      user_id: usrID,
      ta_people_id: tID,
    };
    axios.post(BASE_URL + 'deletePeople', body).then((response) => {
      console.log('deleting');
      console.log(response.data);
      setRelinquishRole(!relinquishRole);
      toggleCalled(!called);
      document.cookie = 'patient_name=' + listOfUsers[0].user_name;
      document.cookie = 'patient_timeZone=' + listOfUsers[0].time_zone;
      document.cookie = 'patient_uid=' + listOfUsers[0].user_unique_id;
      document.cookie = 'patient_email=' + listOfUsers[0].user_email_id;
      document.cookie = 'patient_pic=' + listOfUsers[0].user_picture;
      loginContext.setLoginState({
        ...loginContext.loginState,
        reload: true,
      });
      history.push('/home');
    });
  }

  function deleteUserFunc() {
    let body = {
      user_id: usrID,
    };
    axios.post(BASE_URL + 'deleteUser', body).then((response) => {
      console.log('deleting');
      console.log(response.data);
      document.cookie = 'patient_name=' + listOfUsers[0].user_name;
      document.cookie = 'patient_timeZone=' + listOfUsers[0].time_zone;
      document.cookie = 'patient_uid=' + listOfUsers[0].user_unique_id;
      document.cookie = 'patient_email=' + listOfUsers[0].user_email_id;
      document.cookie = 'patient_pic=' + listOfUsers[0].user_picture;
      loginContext.setLoginState({
        ...loginContext.loginState,
        reload: !loginContext.loginState.reload,
      });
      setDeleteUser(!deleteUser);
      toggleCalled(!called);
      history.push('/home');
    });
  }
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
      ta_people_id: tID,
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
    <div
      style={{
        backgroundColor: '#F2F7FC',
        paddingBottom: '2rem',
      }}
    >
      <Box hidden={!showNewUser}>
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
            }}
          >
            <div style={{ font: 'normal normal 600 16px Quicksand-Regular' }}>
              New User Sign Up
            </div>
            <div style={{ font: 'normal normal 600 16px Quicksand-Regular' }}>
              {emailUser}
            </div>
            <Form.Control
              placeholder={firstName}
              className={classes.textfield}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
            <Form.Control
              placeholder={lastName}
              className={classes.textfield}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
            {/* <input placeholder="timezone" style={{marginBottom: '20px', height: '40px', width: "100%", borderRadius: '15px', border: 'none'}}></input>
             */}
            <div className="App">
              <div className="select-wrapper" style={{ color: '#000000' }}>
                <TimezoneSelect
                  value={selectedTimezone}
                  onChange={setSelectedTimezone}
                />
              </div>
            </div>
            <Row>
              <Col>
                <Button
                  className={classes.loginbutton}
                  onClick={() => {
                    toggleNewUser(false);
                    onSubmitUser();
                  }}
                >
                  Save
                </Button>
              </Col>
              <Col>
                <Button
                  className={classes.signupbuttons}
                  onClick={() => {
                    toggleNewUser(false);
                  }}
                >
                  Close
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      </Box>
      {deleteRelationshipModal()}
      {giveAccessModal()}
      {assignUserModal()}
      {confirmedModal()}
      {deleteModal()}
      {removeRoleModal()}
      {assignConfirmedModal()}
      {confirmedDeleteModal()}
      <div style={{ width: '30%' }}>
        <MiniNavigation />
      </div>
      <div class="mid">TA Admin Access</div>

      <div class="grid-container">
        <div class="one">
          <img
            src="/Arrow.png"
            style={{ width: ' 18px', height: '38px', cursor: 'pointer' }}
            onClick={() => history.push('/home')}
          />
        </div>
        <div class="two"></div>
      </div>
      <div class="biggrid">
        <Row style={{ width: '100%' }}>
          <Col
            sm={6}
            lg={6}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div class="graybox">
              <div class="YourUsers">
                <Row>
                  <Col xs={3}></Col>
                  <Col> Your Users ({listOfUsers.length})</Col>
                  <Col xs={3}>
                    <GoogleLogin
                      //clientId="1009120542229-9nq0m80rcnldegcpi716140tcrfl0vbt.apps.googleusercontent.com"
                      clientId={
                        BASE_URL.substring(8, 18) == 'gyn3vgy3fb'
                          ? process.env.REACT_APP_GOOGLE_CLIENT_ID_SPACE
                          : process.env.REACT_APP_GOOGLE_CLIENT_ID_LIFE
                      }
                      //clientId={ID}
                      render={(renderProps) => (
                        <button
                          class="buttonadd"
                          onClick={renderProps.onClick}
                          disabled={renderProps.disabled}
                        >
                          +
                        </button>
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
                      // redirectUri={
                      //   BASE_URL.substring(8, 18) == '3s3sftsr90'
                      //     ? 'https://manifestmy.space'
                      //     : 'https://manifestmy.life'
                      // }
                      redirectUri="http://localhost:3000"
                      scope="https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/photoslibrary.readonly"
                      onSuccess={responseGoogle}
                      onFailure={responseGoogle}
                      isSignedIn={false}
                      disable={true}
                      cookiePolicy={'single_host_origin'}
                    />
                  </Col>
                </Row>

                <div class="listofusers">
                  {listOfUsers.map((users) => {
                    return (
                      <div class="grid_cut">
                        <div class="grid">
                          <div class="g s1">
                            <div class="circle">
                              {users.user_picture == '' ? (
                                <img
                                  src={'/NoImage.png'}
                                  style={{
                                    borderRadius: '100%',
                                    height: '47px',
                                    width: '47px',
                                    objectFit: 'cover',
                                  }}
                                />
                              ) : (
                                <img
                                  src={users.user_picture}
                                  style={{
                                    borderRadius: '100%',
                                    height: '47px',
                                    width: '47px',
                                  }}
                                />
                              )}
                            </div>
                          </div>
                          <div class="g s2"> {users.user_name}</div>
                          <div class="g s3"> {users.time_zone}</div>
                          <div class="g s4">
                            <img
                              src="/Edit.png"
                              style={{ width: '25px', height: '25px' }}
                            />
                          </div>
                          <div class="g s5">
                            <img
                              src="/Delete.png"
                              style={{ width: '25px', height: '25px' }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Col>
          {/* <Col
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Row>
              <Col
                sm={6}
                lg={6}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div class="con">
                  <button
                    class="duperr"
                    onClick={(e) => {
                      getTAList();
                      handleClickTA(e);
                    }}
                  >
                    Give Another TA Access
                  </button>
                </div>
                <Popover
                  id={idTA}
                  open={openTA}
                  anchorEl={anchorElTA}
                  onClose={handleCloseTA}
                  // anchorReference="anchorPosition"
                  // anchorPosition={{ top: 285, left: 100 }}
                  anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  style={{
                    backgroundClip: 'context-box',
                    borderRadius: '20px',
                  }}
                >
                  {taListRendered()}
                </Popover>
                <div class="con">
                  <button class="duperr">Check of Duplicate Users</button>
                </div>

               
              </Col>
              <Col sm={6} lg={6} class="bigbox">
                <div class="con">
                  <button
                    class="duperr"
                    onClick={(e) => {
                      getUnassignedList();
                      handleClickUser(e);
                    }}
                  >
                    Assign User
                  </button>
                </div>
                <Popover
                  id={idUser}
                  open={openUser}
                  anchorEl={anchorElUser}
                  onClose={handleCloseUser}
                  // anchorReference="anchorPosition"
                  // anchorPosition={{ top: 285, left: 100 }}
                  anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  style={{
                    backgroundClip: 'context-box',
                    borderRadius: '20px',
                  }}
                >
                  {uaListRendered()}
                </Popover>
                <div class="con">
                  <button class="duperr">Trusted Advisor Look Up</button>
                </div>

                <div class="con">
                  <button class="duperr">Relinquish Advisor Roles</button>
                </div>
              </Col>
            </Row>
            <Row>
              <button class="deleteButton">Delete User</button>
            </Row>
          </Col> */}
          <Col
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div class="con">
              <button
                class="duperr"
                onClick={(e) => {
                  getTAList();
                  handleClickTA(e);
                }}
              >
                Give Another TA Access
              </button>
            </div>
            <Popover
              id={idTA}
              open={openTA}
              anchorEl={anchorElTA}
              onClose={handleCloseTA}
              // anchorReference="anchorPosition"
              // anchorPosition={{ top: 285, left: 100 }}
              anchorOrigin={{
                vertical: 'center',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              style={{
                backgroundClip: 'context-box',
                borderRadius: '20px',
              }}
            >
              {taListRendered()}
            </Popover>
            <div class="con">
              <button class="duperr">Trusted Advisor Look Up</button>
            </div>

            <div class="con">
              <button
                class="duperr"
                onClick={() => getDuplicateRelationships()}
              >
                Check for Duplicate Relationships
              </button>
            </div>
            <div class="con">
              <button
                class="duperr"
                onClick={(e) => {
                  getUnassignedList();
                  handleClickUser(e);
                }}
              >
                Assign User
              </button>
            </div>
            <Popover
              id={idUser}
              open={openUser}
              anchorEl={anchorElUser}
              onClose={handleCloseUser}
              // anchorReference="anchorPosition"
              // anchorPosition={{ top: 285, left: 100 }}
              anchorOrigin={{
                vertical: 'center',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              style={{
                backgroundClip: 'context-box',
                borderRadius: '20px',
              }}
            >
              {uaListRendered()}
            </Popover>
            {taListUser.length > 1 ? (
              <div class="con">
                <button
                  class="duperr"
                  onClick={() => setRelinquishRole(!relinquishRole)}
                >
                  Relinquish Advisor Role
                </button>
              </div>
            ) : (
              <div class="con">
                <button
                  class="deleteButton"
                  onClick={() => setDeleteUser(!deleteUser)}
                >
                  Delete User
                </button>
              </div>
            )}
            {/* {taListUser.length == 1 ? (
              <div class="con">
                <button
                  class="deleteButton"
                  onClick={() => setDeleteUser(!deleteUser)}
                >
                  Delete User
                </button>
              </div>
            ) : (
              ''
            )} */}
          </Col>
        </Row>

        <div class="g comp3">
          <div class="bottom">
            {/* <button class="button2">Save</button>
            <button class="button3">Cancel</button> */}

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
                  curUserPic: '',
                  curUserName: '',
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
