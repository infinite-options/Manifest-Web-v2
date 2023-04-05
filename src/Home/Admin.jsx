import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Col, Container, Form, Modal, Row, FormLabel } from 'react-bootstrap';
import { TextField } from '@material-ui/core';
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
import UploadImage from '../Home/UploadImage';
import GooglePhotos from '../Home/GooglePhotos';
import ModalBody from 'rsuite/lib/Modal/ModalBody';
import './Admin_style.css';

import MiniNavigation from '../manifest/miniNavigation';
import GoogleSignUpUser from 'Google/GoogleSignUpUser';
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
  cancelButtons: {
    backgroundColor: '#FFFFFF',
    color: '#7D7D7D',
    border: '1px solid #A7A7A7',
    borderRadius: '5px',
    width: '30%',
    marginLeft: '10%',
    marginRight: '10%',
    marginTop: '2%',
  },
  saveButtons: {
    backgroundColor: '#09B4FF',
    color: 'white',
    border: '1px solid #FFFFFF',
    borderRadius: '5px',
    width: '30%',
    marginLeft: '10%',
    marginRight: '10%',
    marginTop: '2%',
  },
});

export function Admin() {
  const history = useHistory();
  const classes = useStyles();
  const loginContext = useContext(LoginContext);

  let CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID_LIFE;
  let CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET_LIFE;

  const listOfUsers = loginContext.loginState.usersOfTA;
  var selectedTA = loginContext.loginState.ta.id;
  // const currentUser = loginContext.loginState.curUser;
  // const curUserPic = loginContext.loginState.curUserPic;
  // const curUserName = loginContext.loginState.curUserName;
  console.log('selectedTA is ', loginContext);

  var usrID = '';
  var tID = '';
  var userTime_zone = '';
  var userEmail = '';
  var userN = '';
  var userPic = '';
  var taPic = '';

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
    taPic = document.cookie
      .split('; ')
      .find((row) => row.startsWith('ta_pic='))
      .split('=')[1];
    // setTaPhoto(taPic)
  } else {
    usrID = loginContext.loginState.curUser;
    userTime_zone = loginContext.loginState.curUserTimeZone;
    userEmail = loginContext.loginState.curUserEmail;
    userPic = loginContext.loginState.curUserPic;
    userN = loginContext.loginState.curUserName;
  }

  var currentTaPicture = loginContext.loginState.ta.picture;
  if (
    document.cookie.split(';').some((item) => item.trim().startsWith('ta_pic='))
  ) {
    currentTaPicture = document.cookie
      .split('; ')
      .find((row) => row.startsWith('ta_pic='))
      .split('=')[1];
  }

  console.log(selectedTA, usrID, userN);
  const [called, toggleCalled] = useState(false);
  const [showNewUser, toggleNewUser] = useState(false);
  const [showGiveAccess, toggleGiveAccess] = useState(false);
  const [showAssignUser, toggleAssignUser] = useState(false);
  const [showConfirmed, toggleConfirmed] = useState(false);
  const [showAssignConfirmed, toggleAssignConfirmed] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [emailUser, setEmailUser] = useState('');
  const [socialId, setSocialId] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [accessExpiresIn, setAccessExpiresIn] = useState('');
  const [signupSuccessful, setSignupSuccessful] = useState(false);
  const [taPhoto, setTaPhoto] = useState('');
  const [taImage, setTaImage] = useState(null);
  const [taPhotoURL, setTaPhotoURL] = useState('');
  const [showUploadImage, toggleUploadImage] = useState(false);
  const [taFirstName, setTaFirstName] = useState('');
  const [taLastName, setTaLastName] = useState('');
  const [taObject, setTaObject] = useState({});

  const [socialSignUpModalShow, setSocialSignUpModalShow] = useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [patientName, setPatientName] = useState('');
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
  const [duplicateRelationships, setDuplicateRelationships] = useState(false);
  const [duplicateList, setDuplicateList] = useState([]);
  const [selectedRelationship, setSelectedRelationship] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState('');
  const [advisorLookup, setAdvisorLookup] = useState(false);
  const [advisorList, setAdvisorList] = useState([]);
  const [access, setAccess] = useState(false);
  const [assign, setAssign] = useState(false);
  const [showAdvisors, setShowAdvisors] = useState(false);
  const [listPeople, setListPeople] = useState([]);
  const [listTaUser, setListTaUser] = useState([]);
  const [currentTaID, setCurrentTaID] = useState('');
  const [currentTaTimeZone, setCurrentTaTimeZone] = useState('');
  const [currentTaPhoto, setCurrentTaPhoto] = useState('');

  // const [advisorList, setAdvisorList] = useState([]);
  let redirecturi = 'https://manifestmy.life';

  console.log('taListUser', taListUser.length);

  useEffect(() => {
    console.log('in listPeople');
    axios
      .get(BASE_URL + 'listPeople/' + usrID)
      .then((response) => {
        console.log('listPeople', response.data.result.result);
        setListPeople(response.data.result.result);
        if (
          document.cookie
            .split(';')
            .some((item) => item.trim().startsWith('ta_pic='))
        ) {
          setTaPhoto(
            document.cookie
              .split('; ')
              .find((row) => row.startsWith('ta_pic='))
              .split('=')[1]
          );
          setCurrentTaPhoto(
            document.cookie
              .split('; ')
              .find((row) => row.startsWith('ta_pic='))
              .split('=')[1]
          );
          console.log(
            '******** TA PHOTO FROM DOCUMENT COOKIES',
            document.cookie
              .split('; ')
              .find((row) => row.startsWith('ta_pic='))
              .split('=')[1]
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(BASE_URL + 'TAProfile/' + tID)
      .then((response) => {
        console.log('TAProfile', response.data.result[0]);
        setListTaUser(response.data.result[0]);
        setTaFirstName(response.data.result[0].ta_first_name);
        setTaLastName(response.data.result[0].ta_last_name);
        setCurrentTaID(response.data.result[0].ta_unique_id);
        setCurrentTaTimeZone(response.data.result[0].ta_time_zone);
        setCurrentTaPhoto(response.data.result[0].ta_picture);
        console.log(
          'in TAProfile ta first name',
          response.data.result[0].ta_first_name
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const getUserOfTA = () => {
    if (
      document.cookie
        .split(';')
        .some((item) => item.trim().startsWith('usersOfTA='))
    ) {
      console.log('got usersOfTA from document.cookie');

      var usersOfTA_result = JSON.parse(
        document.cookie
          .split('; ')
          .find((row) => row.startsWith('usersOfTA='))
          .split('=')[1]
      );

      if (usersOfTA_result.length > 0) {
        const usersOfTA = usersOfTA_result;
        var curUserID = usersOfTA[0].user_unique_id;
        var curUserTZ = usersOfTA[0].time_zone;
        var curUserEI = usersOfTA[0].user_email_id;
        var curUserP = usersOfTA[0].user_picture;
        var curUserN = usersOfTA[0].user_name;
        var uID, uTime_zone, uEmail, uPic, uName;
        if (
          document.cookie
            .split(';')
            .some((item) => item.trim().startsWith('patient_uid='))
        ) {
          uID = document.cookie
            .split('; ')
            .find((row) => row.startsWith('patient_uid='))
            .split('=')[1];
          uTime_zone = document.cookie
            .split('; ')
            .find((row) => row.startsWith('patient_timeZone='))
            .split('=')[1];
          uEmail = document.cookie
            .split('; ')
            .find((row) => row.startsWith('patient_email='))
            .split('=')[1];
          uPic = document.cookie
            .split('; ')
            .find((row) => row.startsWith('patient_pic='))
            .split('=')[1];
          uName = document.cookie
            .split('; ')
            .find((row) => row.startsWith('patient_name='))
            .split('=')[1];

          curUserID = uID;
          curUserTZ = uTime_zone;
          curUserEI = uEmail;
          curUserP = uPic;
          curUserN = uName;
        } else {
          document.cookie = 'patient_name=' + curUserN;
          document.cookie = 'patient_timeZone=' + curUserTZ;
          document.cookie = 'patient_uid=' + curUserID;
          document.cookie = 'patient_email=' + curUserEI;
          document.cookie = 'patient_pic=' + curUserP;
        }
        loginContext.setLoginState({
          ...loginContext.loginState,
          usersOfTA: usersOfTA,
          curUser: curUserID,
          curUserTimeZone: curUserTZ,
          curUserEmail: curUserEI,
          curUserPic: curUserP,
          curUserName: curUserN,
          ta: {
            ...loginContext.loginState.ta,
            picture: currentTaPicture,
          },
        });
      } else {
        loginContext.setLoginState({
          ...loginContext.loginState,
          usersOfTA: usersOfTA_result,
          curUser: '',
          curUserTimeZone: '',
          curUserEmail: '',
          curUserPic: '',
          curUserName: '',
          ta: {
            ...loginContext.loginState.ta,
            picture: currentTaPicture,
          },
        });
        console.log('No User Found');
      }

      // ***********
    } else {
      console.log('got usersOfTA from usersOfTA/ API call');
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
          console.log('userOfTA response ', response);
          if (response.data.result.length > 0) {
            const usersOfTA = response.data.result;
            const curUserID = usersOfTA[0].user_unique_id;
            const curUserTZ = usersOfTA[0].time_zone;
            const curUserEI = usersOfTA[0].user_email_id;
            const curUserP = usersOfTA[0].user_picture;
            const curUserN = usersOfTA[0].user_name;
            loginContext.setLoginState({
              ...loginContext.loginState,
              usersOfTA: response.data.result,
              curUser: curUserID,
              curUserTimeZone: curUserTZ,
              curUserEmail: curUserEI,
              curUserPic: curUserP,
              curUserName: curUserN,
              ta: {
                ...loginContext.loginState.ta,
                picture: currentTaPicture,
              },
            });
            console.log(curUserID);
          } else {
            loginContext.setLoginState({
              ...loginContext.loginState,
              usersOfTA: response.data.result,
              curUser: '',
              curUserTimeZone: '',
              curUserEmail: '',
              curUserPic: '',
              curUserName: '',
              ta: {
                ...loginContext.loginState.ta,
                picture: currentTaPicture,
              },
            });
            console.log('No User Found');
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const UploadTAImage = async (event) => {
    let body = {
      ta_unique_id: currentTaID,
      ta_photo_url: taPhoto,
      ta_picture: taImage,
    }
    if (typeof body.ta_photo_url !== 'string') {
      body.ta_photo_url = '';
    }
    let formData = new FormData();
    Object.entries(body).forEach((entry) => {
      formData.append(entry[0], entry[1]);
    });
    try {
      const response = await axios({
        method: 'post',
        url: BASE_URL + 'UploadTAImage',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('UploadTAImage RESPONSE : ', response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const UpdatePerson = async (event) => {
    var phone_number;
    var employer;
    if (listPeople[0] && listPeople[0].phone_number === 'undefined') {
      phone_number = '';
      employer = '';
    } else {
      phone_number = listPeople[0].phone_number;
      employer = listPeople[0].employer;
    }
    let body = {
      // user_id: listPeople[0].user_uid,

      // ta_unique_id: listTaUser[0].ta_unique_id,
      ta_unique_id: currentTaID,
      first_name: taFirstName,
      last_name: taLastName,
      phone_number: listPeople[0].phone_number,
      employer: listPeople[0].employer,
      // ta_time_zone: listTaUser[0].ta_time_zone,
      ta_time_zone: currentTaTimeZone,
      // ta_photo_url: taPhoto,
      // ta_picture: taImage,
    };
    console.log('updateTA body', body);
    // if (typeof body.ta_photo_url === 'string') {
      // body.photo_url = body.people_pic;
      // body.people_pic = '';
    // } else {
    //   body.ta_photo_url = '';
    // }
    let formData = new FormData();
    Object.entries(body).forEach((entry) => {
      formData.append(entry[0], entry[1]);
    });

    // Object.entries(body).forEach((entry) => {
    //   if (entry[0] === 'ta_picture') {
    //     if (entry[1].name !== undefined) {
    //       if (typeof entry[1].name == 'string') {
    //         formData.append(entry[0], entry[1]);
    //       }
    //     }
    //   } else if (entry[1] instanceof Object) {
    //     entry[1] = JSON.stringify(entry[1]);
    //     formData.append(entry[0], entry[1]);
    //   } else {
    //     formData.append(entry[0], entry[1]);
    //   }
    // });
    // formData.append('ta_picture', taImage);
    console.log(
      'updateTA ta_picture in formdata = ',
      formData.getAll('ta_picture')
    );

    try {
      const response = await axios({
        method: 'post',
        url: BASE_URL + 'UpdateTA',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('updateTA RESPONSE : ', response.data);
      // toggleConfirmed(true);
      // toggleCalled(!called);
    } catch (error) {
      console.log(error);
    }
  };

  const getTAofUser = () => {
    axios
      .get(BASE_URL + 'ListAllTAUser/' + usrID)
      .then((response) => {
        console.log('listAllTAUser', response.data.result);
        setTaListUser(response.data.result);
        // setTaFirstName(response.data.result[0].ta_first_name);
        // setTaLastName(response.data.result[0].ta_last_name);
        // console.log('in ListAllTAUser ta frist name getTAofUser', response.data.result[0].ta_first_name);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getUserOfTA();
    getTAofUser();
  }, [usrID, loginContext.loginState.reload, socialSignUpModalShow]);

  const taListRendered = () => {
    taList.sort((a, b) => a.ta_name.localeCompare(b.ta_name));
    return (
      <div class="listofusers">
        {taList.map((ta) => {
          return (
            <div
              class="grid_cut"
              onClick={(event) => {
                console.log('event', ta);
                if (ta != null) {
                  console.log('Another', ta);
                  setTAName(ta.ta_name);
                  setTAID(ta.ta_unique_id);
                  // toggleGiveAccess(true);
                }
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 7fr 1fr 1fr',
                  gridTemplateRows: '3fr 3fr',
                  gridTemplateAreas: `  "s1 s2 s4 s5"
        "s1 s3 s4 s5"`,
                  backgroundColor:
                    ta.TA_status === 'Exi' ? '#9FFFCB' : '#FFFFFF',
                  borderRadius: '20px',
                  border:
                    taID === ta.ta_unique_id
                      ? '4px solid #9FFFCB'
                      : ta.TA_status === 'Exi'
                      ? '4px solid #9FFFCB'
                      : '4px solid #FFFFFF',
                }}
              >
                <div class="g s1">
                  <div class="circle">
                    {ta.ta_picture == '' ? (
                      <img
                        src={'/UserNoImage.png'}
                        alt="Default Image"
                        style={{
                          borderRadius: '100%',
                          height: '47px',
                          width: '47px',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <img
                        src={ta.ta_picture}
                        alt="Default Image"
                        style={{
                          borderRadius: '100%',
                          height: '47px',
                          width: '47px',
                        }}
                      />
                    )}
                  </div>
                </div>
                <div class="g s2_1"> {ta.ta_name}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  //  list of all tas, with relationship status with user
  const getTAList = (usid) => {
    console.log('in getTAList: ');
    var bodyFormData = new FormData();
    let uid = usid;
    bodyFormData.append('user_full_name', uid);
    console.log(bodyFormData);
    axios
      .post(BASE_URL + 'NewExiTA/', bodyFormData)
      // .get(BASE_URL + 'listAllTA/' + selectedTA)
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
  // list of all users in the system
  const getAllUsers = () => {
    console.log('in getAllUsers: ' + selectedTA);

    axios
      .get(BASE_URL + 'listAllUsersDropDownList/')
      // .get(BASE_URL + 'listAllTA/' + selectedTA)
      .then((response) => {
        console.log(response.data);
        //taList = response.data.result
        response.data.result.sort((a, b) =>
          a.user_name.localeCompare(b.user_name)
        );
        setAllUsers(response.data.result);
        setAdvisorLookup(true);
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  };
  // list of duplicate relationships
  const getDuplicateRelationships = () => {
    console.log('in getDuplicateRelationships: ');
    axios
      .get(BASE_URL + 'relationships')
      .then((response) => {
        console.log(response.data.result[0]);
        //taList = response.data.result
        response.data.result.sort((a, b) =>
          a.user_name.localeCompare(b.user_name)
        );
        setDuplicateList(response.data.result);
        setDuplicateRelationships(true);
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  };
  // list of all tas of a user
  const getTAInfo = (usid) => {
    console.log('in getTAInfo: ');
    var bodyFormData = new FormData();
    let uid = usid;
    bodyFormData.append('user_full_name', uid);
    console.log(bodyFormData);
    axios
      .post(BASE_URL + 'gettasgivenusername/', bodyFormData)
      .then((response) => {
        console.log(response.data.result[0]);
        //taList = response.data.result
        setAdvisorList(response.data.result);
        setShowAdvisors(true);
        // setUserID('');
        // setAdvisorLookup(true);
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  };
  // list of all users with only admin as ta
  const getUnassignedList = () => {
    console.log('in getUnassignedList: ');
    axios
      .get(BASE_URL + 'ListAllAdminUsers')
      .then((response) => {
        console.log(response.data);
        //uaList = response.data.result
        setUnassignedList(response.data.result);
        setAssign(true);
        console.log('ua list GET', uaList);
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  };

  useEffect(() => {
    if (taImage !== null) {
      const salt = Math.floor(Math.random() * 9999999999);
      let image_name = taImage.name;
      image_name = image_name + salt.toString();
      setTaPhotoURL(URL.createObjectURL(taImage));
      console.log('upload URL:', taPhotoURL);
    }
  }, [taImage])
  //upload from computer for TA
  const uploadImageModal = () => {
    return (
      <Modal
        show={showUploadImage}
        onHide={() => {
          toggleUploadImage(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload Image</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div>Upload Image</div>
          <input
            type="file"
            onChange={(e) => {
              console.log('here: selecting image');
              if (e.target.files[0]) {
                const image1 = e.target.files[0];
                // console.log(image1.name);
                console.log('image1 = ', image1);
                setTaImage(image1);
              }
            }}
          />
          {/* <Button
            variant="dark"
            onClick={() => {
              console.log('here: uploading image');
              if (taImage === null) {
                alert('Please select an image to upload');
                return;
              }
              const salt = Math.floor(Math.random() * 9999999999);
              let image_name = taImage.name;
              image_name = image_name + salt.toString();
              setTaPhotoURL(URL.createObjectURL(taImage));
              // setTaPhoto(taPhotoURL);
              console.log('upload URL:', taPhotoURL);
            }}
          >
            Upload
          </Button> */}
          <img
            src={taPhotoURL || 'http://via.placeholder.com/400x300'}
            alt="Uploaded images"
            height="300"
            width="400"
          />
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setTaPhotoURL('');
              toggleUploadImage(false);
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (taImage === null) {
                alert('Please select an image to upload');
                return;
              }
              console.log('here: Confirming changes');
              setTaPhoto(taPhotoURL);
              setCurrentTaPhoto(taPhotoURL);
              toggleUploadImage(false);
              console.log('confirm URL: ', taPhotoURL);
              if (taPhotoURL) {
                document.cookie = 'ta_pic=' + taPhotoURL;
                loginContext.setLoginState({
                  ...loginContext.loginState,
                  ta: {
                    ...loginContext.loginState.ta,
                    picture: taPhotoURL,
                  },
                });
              }
              UploadTAImage();
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  // modal which displays list of unassigned users
  const assignUserListModal = () => {
    if (assign) {
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
              width: '900px',
              height: '500px',
              overflow: 'scroll',
              color: '#000000',
              padding: '40px',
              font: 'normal normal bold 16px Quicksand-Bold',
            }}
          >
            <div style={{ textAlign: 'center' }}>Assign User</div>
            <div style={{ textAlign: 'center' }}>
              Select the user you want to be assigned as the TA!
            </div>
            <Table
              style={{
                textAlign: 'left',
                // marginBottom: '20px',
                width: '100%',
                height: '200px',
                overflow: 'scroll',
              }}
            >
              <TableHead>
                <TableRow style={{ borderBottom: '2px solid #000000' }}>
                  <TableCell
                    style={{ font: 'normal normal bold 16px Quicksand-Bold' }}
                  >
                    User Name
                  </TableCell>
                  <TableCell
                    style={{ font: 'normal normal bold 16px Quicksand-Bold' }}
                  >
                    User ID
                  </TableCell>
                  <TableCell
                    style={{ font: 'normal normal bold 16px Quicksand-Bold' }}
                  >
                    Timezone
                  </TableCell>
                  <TableCell
                    style={{ font: 'normal normal bold 16px Quicksand-Bold' }}
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {uaList == '' ? (
                  <TableRow>
                    <TableCell
                      style={{
                        font: 'normal normal normal 16px Quicksand-Regular',
                        textAlign: 'center',
                      }}
                    ></TableCell>
                    <TableCell
                      style={{
                        font: 'normal normal normal 16px Quicksand-Regular',
                        textAlign: 'center',
                      }}
                    >
                      No Unassigned User
                    </TableCell>
                    <TableCell
                      style={{
                        font: 'normal normal normal 16px Quicksand-Regular',
                        textAlign: 'center',
                      }}
                    ></TableCell>
                  </TableRow>
                ) : (
                  uaList.map((ua) => {
                    return (
                      <TableRow onClick={() => setUserID(ua.user_unique_id)}>
                        <TableCell
                          style={{
                            font: 'normal normal normal 16px Quicksand-Regular',
                          }}
                        >
                          {ua.name}
                        </TableCell>
                        <TableCell
                          style={{
                            font: 'normal normal normal 16px Quicksand-Regular',
                          }}
                        >
                          {ua.user_unique_id}
                        </TableCell>
                        <TableCell
                          style={{
                            font: 'normal normal normal 16px Quicksand-Regular',
                          }}
                        >
                          {ua.user_unique_id}
                        </TableCell>
                        <TableCell
                          style={{
                            font: 'normal normal normal 16px Quicksand-Regular',
                          }}
                        >
                          <button
                            style={{
                              backgroundColor: '#FFFFFF',
                              color: '#7D7D7D',
                              border: '1px solid #A7A7A7',
                              borderRadius: '5px',
                              // width: '30%',
                              height: '22px',
                              margin: '4px',
                              font: 'normal normal normal 16px Quicksand-Regular',
                            }}
                            onClick={() => {
                              setPatientName(ua.name);
                              setUserID(ua.user_unique_id);
                              toggleAssignUser(true);
                            }}
                          >
                            Become TA
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            <Row
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                postion: 'fixed',
              }}
            >
              <button
                className={classes.cancelButtons}
                onClick={() => {
                  setAssign(false);
                }}
              >
                Close
              </button>
            </Row>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };
  // modal which displays list of duplicate relationships
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
            <div style={{ textAlign: 'center' }}>
              Select the duplicate relationship you want to delete!
            </div>
            <Table
              class="relationTable"
              style={{
                textAlign: 'left',
                // marginBottom: '20px',
                height: '200px',
                overflow: 'scroll',
              }}
            >
              <TableHead>
                <TableRow style={{ borderBottom: '2px solid #000000' }}>
                  <TableCell
                    style={{ font: 'normal normal bold 16px Quicksand-Bold' }}
                  >
                    User Name
                  </TableCell>
                  <TableCell
                    style={{ font: 'normal normal bold 16px Quicksand-Bold' }}
                  >
                    TA Name
                  </TableCell>
                  <TableCell
                    style={{ font: 'normal normal bold 16px Quicksand-Bold' }}
                  >
                    Relationship Created
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {duplicateList == '' ? (
                  <TableRow>
                    <TableCell
                      style={{
                        font: 'normal normal normal 16px Quicksand-Regular',
                        textAlign: 'center',
                      }}
                    ></TableCell>
                    <TableCell
                      style={{
                        font: 'normal normal normal 16px Quicksand-Regular',
                        textAlign: 'center',
                      }}
                    >
                      No Duplicate Relationships
                    </TableCell>
                    <TableCell
                      style={{
                        font: 'normal normal normal 16px Quicksand-Regular',
                        textAlign: 'center',
                      }}
                    ></TableCell>
                  </TableRow>
                ) : (
                  duplicateList.map((relation) => {
                    return (
                      <TableRow
                        style={{
                          cursor: 'pointer',
                          backgroundColor:
                            selectedRelationship === relation.id
                              ? 'white'
                              : null,
                        }}
                        onClick={() => setSelectedRelationship(relation.id)}
                      >
                        <TableCell
                          style={{
                            font: 'normal normal normal 16px Quicksand-Regular',
                          }}
                        >
                          {relation.user_name}
                        </TableCell>
                        <TableCell
                          style={{
                            font: 'normal normal normal 16px Quicksand-Regular',
                          }}
                        >
                          {relation.ta_name}
                        </TableCell>
                        <TableCell
                          style={{
                            font: 'normal normal normal 16px Quicksand-Regular',
                          }}
                        >
                          {moment(relation.r_timestamp).format(
                            'MMMM DD, YYYY, hh:mm a'
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            <div>
              <button
                className={classes.saveButtons}
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
                Delete
              </button>
              <button
                className={classes.cancelButtons}
                onClick={() => {
                  setDuplicateRelationships(false);
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
  // modal to give another access
  const anotherTAAccessModal = () => {
    if (access) {
      return (
        <div
          style={{
            height: '100%',
            maxHeight: '100%',
            width: '100%',
            zIndex: '101',
            left: '0',
            top: '0',
            overflow: 'scroll',
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
              backgroundColor: '#F1F1F1',
              width: '800px',
              minHeight: 'auto',
              // overflow: 'scroll',
              color: '#000000',
              padding: '40px',
              font: 'normal normal bold 16px Quicksand-Bold',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              Give another TA access
            </div>
            <Row>
              <Col>
                <div class="listofusers">
                  {listOfUsers.map((users) => {
                    return (
                      <div
                        class="grid_cut"
                        onClick={() => {
                          getTAList(users.user_unique_id);
                          setUserID(users.user_unique_id);
                          document.cookie =
                            'patient_uid=' + users.user_unique_id;
                          document.cookie = 'patient_name=' + users.user_name;
                          document.cookie =
                            'patient_timeZone=' + users.time_zone;
                          document.cookie =
                            'patient_email=' + users.user_email_id;
                          document.cookie = 'patient_pic=' + users.user_picture;
                          console.log(document.cookie);
                          loginContext.setLoginState({
                            ...loginContext.loginState,
                            curUser: users.user_unique_id,
                            curUserTimeZone: users.time_zone,
                            curUserEmail: users.user_email_id,
                            curUserPic: users.user_picture,
                            curUserName: users.user_name,
                            ta: {
                              ...loginContext.loginState.ta,
                              picture: currentTaPicture,
                            },
                          });
                        }}
                      >
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 7fr 1fr 1fr',
                            gridTemplateRows: '3fr 3fr',
                            gridTemplateAreas: `  "s1 s2 s4 s5"
        "s1 s3 s4 s5"`,
                            backgroundColor: '#FFFFFF',
                            border:
                              usrID === users.user_unique_id
                                ? '4px solid #9FFFCB'
                                : '4px solid #FFFFFF',
                            borderRadius: '20px',
                          }}
                        >
                          <div class="g s1">
                            <div class="circle">
                              {users.user_picture == '' ? (
                                <img
                                  src={'/UserNoImage.png'}
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
                          <div class="g s2_1"> {users.user_name}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Col>
              <Col>{taListRendered()}</Col>
            </Row>
            <div style={{ marginTop: '20px' }}>
              <button
                className={classes.saveButtons}
                onClick={() => {
                  console.log('Relation', selectedRelationship);
                  toggleGiveAccess(true);
                  // setShowDeleteConfirm(true);
                  // setDuplicateRelationships(false);
                }}
              >
                Give Access
              </button>
              <button
                className={classes.cancelButtons}
                onClick={() => {
                  setAccess(false);
                  setTAID('');
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
  // modal which displays list of users and their advisors
  const advisorLookupModal = () => {
    if (advisorLookup) {
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
              backgroundColor: '#FFFFFF',
              width: '900px',
              height: '500px',
              overflow: 'scroll',
              color: '#000000',
              padding: '40px',
              font: 'normal normal bold 20px Quicksand-Bold',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              Trusted Advisor Look Up
            </div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              Please select a user, then click 'Trusted Advisors'.
            </div>

            <Table
              style={{
                textAlign: 'left',
                // marginBottom: '20px',
                height: '200px',
                overflow: 'scroll',
              }}
            >
              <TableHead>
                <Row
                  style={{
                    borderBottom: '2px solid #A8A8A8',
                    borderTop: '2px solid #000000',
                    height: '32px',
                  }}
                >
                  <Col
                    xs={3}
                    style={{ font: 'normal normal bold 16px Quicksand-Bold' }}
                  >
                    User Name
                  </Col>
                  <Col
                    xs={3}
                    style={{ font: 'normal normal bold 16px Quicksand-Bold' }}
                  >
                    User ID
                  </Col>
                  <Col
                    xs={3}
                    style={{ font: 'normal normal bold 16px Quicksand-Bold' }}
                  >
                    Timezone
                  </Col>
                  <Col
                    xs={3}
                    style={{ font: 'normal normal bold 16px Quicksand-Bold' }}
                  ></Col>
                </Row>
              </TableHead>
              <TableBody>
                {allUsers.map((user) => {
                  return (
                    <Row
                      style={{
                        width: '100%',

                        display: 'flex',
                        flexDirection: 'column',
                        borderBottom: '2px solid #A8A8A8',
                      }}
                    >
                      <Row style={{ height: '32px' }}>
                        <Col
                          xs={3}
                          style={{
                            font: 'normal normal normal 16px Quicksand-Regular',
                          }}
                        >
                          {user.user_name}
                        </Col>
                        <Col
                          xs={3}
                          style={{
                            font: 'normal normal normal 16px Quicksand-Regular',
                          }}
                        >
                          {user.user_unique_id}
                        </Col>
                        <Col
                          xs={3}
                          style={{
                            font: 'normal normal normal 16px Quicksand-Regular',
                          }}
                        >
                          {user.time_zone}
                        </Col>
                        <Col xs={3}>
                          <button
                            style={{
                              backgroundColor: '#FFFFFF',
                              color: '#7D7D7D',
                              border: '1px solid #A7A7A7',
                              borderRadius: '5px',
                              // width: '30%',
                              height: '22px',
                              margin: '4px',
                              font: 'normal normal normal 16px Quicksand-Regular',
                            }}
                            onClick={() => {
                              setUserID(user.user_unique_id);
                              getTAInfo(user.user_unique_id);
                            }}
                          >
                            Trusted Advisors
                          </button>
                        </Col>
                      </Row>
                      <Row style={{ maxHeight: '150px', overflow: 'scroll' }}>
                        {showAdvisors && user.user_unique_id === userID ? (
                          <Row
                            style={{
                              width: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              marginLeft: '10%',
                            }}
                          >
                            {console.log('advisorList', advisorList)}
                            <Row style={{ height: '32px' }}>
                              <Col
                                style={{
                                  font: 'normal normal bold 16px Quicksand-Bold',
                                }}
                              >
                                Trusted Advisors
                              </Col>
                              <Col
                                style={{
                                  font: 'normal normal bold 16px Quicksand-Bold',
                                }}
                              >
                                TA ID
                              </Col>
                              <Col
                                style={{
                                  font: 'normal normal bold 16px Quicksand-Bold',
                                }}
                              ></Col>
                              <Col
                                style={{
                                  font: 'normal normal bold 16px Quicksand-Bold',
                                }}
                              ></Col>
                            </Row>
                            {advisorList.map((advisor) => {
                              return (
                                <Row style={{ border: 'none', height: '32px' }}>
                                  <Col
                                    style={{
                                      font: 'normal normal normal 16px Quicksand-Regular',
                                    }}
                                  >
                                    {advisor.ta_name}
                                  </Col>
                                  <Col
                                    style={{
                                      font: 'normal normal normal 16px Quicksand-Regular',
                                    }}
                                  >
                                    {advisor.ta_people_id}
                                  </Col>
                                  <Col
                                    style={{
                                      font: 'normal normal normal 16px Quicksand-Regular',
                                    }}
                                  >
                                    <a href={`tel:${advisor.ta_phone_number}`}>
                                      <img
                                        src={'/Phone.png'}
                                        style={{
                                          width: '26px',
                                          height: '26px',
                                        }}
                                      />
                                    </a>
                                    <a href={`mailto:${advisor.ta_email_id}`}>
                                      <img
                                        src={'/Mail.png'}
                                        style={{
                                          width: '26px',
                                          height: '26px',
                                        }}
                                      />
                                    </a>
                                  </Col>
                                  <Col></Col>
                                </Row>
                              );
                            })}
                          </Row>
                        ) : null}
                      </Row>
                    </Row>
                  );
                })}
              </TableBody>
            </Table>

            <Row
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                postion: 'fixed',
              }}
            >
              <button
                className={classes.cancelButtons}
                onClick={() => {
                  setAdvisorLookup(false);
                  setShowAdvisors(false);
                }}
              >
                Okay
              </button>
            </Row>
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
            zIndex: '1040',
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
              color: '#000000',
              padding: '40px',
              font: 'normal normal bold 16px Quicksand-Bold',
            }}
          >
            {/* <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              Give another advisor access
            </div> */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              You are giving {taName} access to {userN}'s profile.
            </div>
            <div>
              <button
                className={classes.saveButtons}
                onClick={() => {
                  console.log('TA', taID, usrID);

                  axios
                    .post(BASE_URL + 'anotherTAAccess', {
                      ta_people_id: taID,
                      user_id: usrID,
                    })
                    .then((response) => {
                      console.log(response);
                    });

                  toggleConfirmed(true);
                  toggleGiveAccess(false);
                  setAccess(false);
                  setTAID('');
                  setTAList([]);
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
            zIndex: '1040',
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
              You are assigning {patientName} as your user. You will now become
              their TA.
            </div>
            <div>
              <button
                className={classes.saveButtons}
                onClick={() => {
                  axios
                    .post(BASE_URL + 'AssociateUser', {
                      ta_people_id: tID,
                      user_id: userID,
                    })
                    .then((response) => {
                      console.log('user', userID, 'assigned to ta', tID);
                      console.log('Assign User', response);
                    });

                  toggleAssignConfirmed(true);
                  toggleAssignUser(false);
                  setAssign(false);
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
              color: '#000000',
              padding: '40px',
              font: 'normal normal bold 16px Quicksand-Bold',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              Delete User
            </div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              Are you sure you want to delete the user?
            </div>
            <div style={{ textAlign: 'center' }}>
              <button
                className={classes.saveButtons}
                onClick={() => {
                  deleteUserFunc();
                }}
              >
                Yes
                {console.log('list of users', loginContext.loginState.reload)}
              </button>
              <button
                className={classes.cancelButtons}
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
              color: '#000000',
              padding: '40px',
              font: 'normal normal bold 16px Quicksand-Bold',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              Remove Advisor Role
            </div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              Are you sure you want to remove your role as the advisor?
            </div>
            <div style={{ textAlign: 'center' }}>
              <button
                className={classes.saveButtons}
                onClick={() => {
                  removeRoleFunc();
                }}
              >
                Yes
              </button>
              <button
                className={classes.cancelButtons}
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
                className={classes.cancelButtons}
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
            zIndex: '1040',
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
              color: '#000000',
              padding: '40px',
              font: 'normal normal bold 16px Quicksand-Bold',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              Access Granted
            </div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              {taName} now has access to the information of user, {userN}
            </div>
            <div style={{ textAlign: 'center' }}>
              <button
                className={classes.cancelButtons}
                onClick={() => {
                  toggleConfirmed(false);
                  loginContext.setLoginState({
                    ...loginContext.loginState,
                    reload: !loginContext.loginState.reload,
                    ta: {
                      ...loginContext.loginState.ta,
                      picture: currentTaPicture,
                    },
                  });
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
            zIndex: '1040',
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
                className={classes.cancelButtons}
                onClick={() => {
                  toggleAssignConfirmed(false);
                  loginContext.setLoginState({
                    ...loginContext.loginState,
                    reload: !loginContext.loginState.reload,
                    ta: {
                      ...loginContext.loginState.ta,
                      picture: currentTaPicture,
                    },
                  });
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

  // const responseGoogle = (response) => {
  //   console.log('response', response);

  //   let auth_code = response.code;
  //   let authorization_url = 'https://oauth2.googleapis.com/token';

  //   console.log('auth_code', auth_code);

  //   var details = {
  //     code: auth_code,
  //     client_id: CLIENT_ID,
  //     client_secret: CLIENT_SECRET,
  //     redirect_uri: 'https://manifestmy.life',
  //     // redirect_uri: 'http://localhost:3000',
  //     grant_type: 'authorization_code',
  //   };

  //   var formBody = [];
  //   for (var property in details) {
  //     var encodedKey = encodeURIComponent(property);
  //     var encodedValue = encodeURIComponent(details[property]);
  //     formBody.push(encodedKey + '=' + encodedValue);
  //   }
  //   formBody = formBody.join('&');

  //   fetch(authorization_url, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  //     },
  //     body: formBody,
  //   })
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((responseData) => {
  //       console.log(responseData);
  //       return responseData;
  //     })
  //     .then((data) => {
  //       console.log(data);
  //       let at = data['access_token'];
  //       let rt = data['refresh_token'];
  //       let ax = data['expires_in'].toString();
  //       setAccessToken(at);
  //       setrefreshToken(rt);
  //       setaccessExpiresIn(ax);
  //       console.log('res', at, rt);

  //       axios
  //         .get(
  //           'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' +
  //             at
  //         )
  //         .then((response) => {
  //           console.log(response.data);

  //           let data = response.data;
  //           //setUserInfo(data);
  //           let e = data['email'];
  //           let fn = data['given_name'];
  //           let ln = data['family_name'];
  //           let si = data['id'];

  //           setEmailUser(e);
  //           setFirstName(fn);
  //           setLastName(ln);
  //           setSocialId(si);
  //         })
  //         .catch((error) => {
  //           console.log('its in landing page');
  //           console.log(error);
  //         });

  //       toggleNewUser(!showNewUser);

  //       return (
  //         accessToken,
  //         refreshToken,
  //         accessExpiresIn,
  //         emailUser,
  //         firstName,
  //         lastName,
  //         socialId
  //       );
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  // remove advisor role
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
        reload: !loginContext.loginState.reload,
        ta: {
          ...loginContext.loginState.ta,
          picture: currentTaPicture,
        },
      });
      history.push('/home');
    });
  }
  // delete user
  function deleteUserFunc() {
    let body = {
      user_id: usrID,
    };
    axios.post(BASE_URL + 'deleteUser', body).then((response) => {
      console.log('deleting');
      console.log(response.data);
      setDeleteUser(!deleteUser);
      toggleCalled(!called);
      document.cookie = 'patient_name=' + listOfUsers[0].user_name;
      document.cookie = 'patient_timeZone=' + listOfUsers[0].time_zone;
      document.cookie = 'patient_uid=' + listOfUsers[0].user_unique_id;
      document.cookie = 'patient_email=' + listOfUsers[0].user_email_id;
      document.cookie = 'patient_pic=' + listOfUsers[0].user_picture;
      loginContext.setLoginState({
        ...loginContext.loginState,
        reload: !loginContext.loginState.reload,
        ta: {
          ...loginContext.loginState.ta,
          picture: currentTaPicture,
        },
      });
      history.push('/home');
    });
  }

  // create new user
  function onSubmitUser() {
    let body = {
      email_id: emailUser,
      password: '',
      first_name: firstName,
      last_name: lastName,
      time_zone: selectedTimezone.value,
      google_auth_token: accessToken,
      google_refresh_token: refreshToken,
      social_id: socialId,
      access_expires_in: accessExpiresIn.toString(),
      ta_people_id: tID,
    };
    console.log('body', body);
    axios
      .post(BASE_URL + 'addNewUser', body)
      .then((response) => {
        console.log(response.data);

        axios
          .get(
            BASE_URL +
              'usersOfTA/' +
              document.cookie
                .split('; ')
                .find((row) => row.startsWith('ta_email='))
                .split('=')[1]
          )
          .then((resUTA) => {
            console.log('list of users home', resUTA.data.result);
            if (resUTA.data.result.length > 0) {
              const usersOfTA = resUTA.data.result;
              const curUserID = usersOfTA[0].user_unique_id;
              const curUserTZ = usersOfTA[0].time_zone;
              const curUserEI = usersOfTA[0].user_email_id;
              const curUserP = usersOfTA[0].user_picture;
              const curUserN = usersOfTA[0].user_name;
              console.log('timezone', curUserTZ);
              loginContext.setLoginState({
                ...loginContext.loginState,
                usersOfTA: resUTA.data.result,
                curUser: curUserID,
                curUserTimeZone: curUserTZ,
                curUserEmail: curUserEI,
                curUserPic: curUserP,
                curUserName: curUserN,
              });
              console.log(curUserID);
              console.log('timezone', curUserTZ);
            } else {
              console.log('No User Found');
            }
          })
          .catch((error) => {
            console.log(error);
          });
        setSocialSignUpModalShow(!socialSignUpModalShow);

        // loginContext.setLoginState({
        //   ...loginContext.loginState,
        //   reload: !loginContext.loginState.reload,
        // });

        loginContext.setLoginState({
          ...loginContext.loginState,
          reload: !loginContext.loginState.reload,
          ta: {
            ...loginContext.loginState.ta,
            picture: currentTaPicture,
          },
        });
      })
      .catch((error) => {
        console.log('its in landing page');
        console.log(error);
      });
  }
  console.log(socialSignUpModalShow);
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
            <Modal.Title>User Account Exists</Modal.Title>
          </Modal.Header>

          <Modal.Body style={bodyStyle}>
            <div>
              The User with email: {emailUser} exists! Please contact your TA
              for further details!
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
              ></Col>
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
                  onClick={hideAlreadyExists}
                  className={classes.signupbuttons}
                >
                  Okay
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  };
  const socialSignUpModal = () => {
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
      font: 'normal normal 600 16px Quicksand-Regular',
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
            <Form.Group>
              <Form.Group>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={classes.textfield}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={classes.textfield}
                  />
                </Col>
              </Form.Group>

              <Col>
                <Form.Group>
                  <Form.Control
                    plaintext
                    readOnly
                    value={emailUser}
                    className={classes.textfield}
                  />
                </Form.Group>
              </Col>
            </Form.Group>
            <Col>
              <TimezoneSelect
                value={selectedTimezone}
                onChange={setSelectedTimezone}
              />
            </Col>
          </Modal.Body>
          <Modal.Footer style={footerStyle}>
            <Row
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '1rem',
                width: '100%',
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
                <Button onClick={onSubmitUser} className={classes.loginbutton}>
                  Sign Up
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
                <Button onClick={hideSignUp} className={classes.signupbuttons}>
                  Cancel
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  };
  const hideSignUp = () => {
    setSocialSignUpModalShow(false);
    setEmailUser('');
    setFirstName('');
    setLastName('');
    setSelectedTimezone('');
  };

  const hideAlreadyExists = () => {
    //setSignUpModalShow(false);
    setAlreadyExists(!alreadyExists);
    history.push('/');
  };

  const signupSuccess = () => {
    setSocialSignUpModalShow(false);
    setSignupSuccessful(true);
    setEmailUser('');
    setFirstName('');
    setLastName('');
  };

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
            <div
              style={{
                font: 'normal normal 600 20px Quicksand-Bold',
                textAlign: 'center',
                marginBottom: '2rem',
              }}
            >
              New User Sign Up
            </div>
            <div
              style={{
                font: 'normal normal 600 16px Quicksand-Regular',
                textAlign: 'center',
                marginBottom: '1rem',
              }}
            >
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
      {advisorLookupModal()}
      {anotherTAAccessModal()}
      {assignUserListModal()}
      {uploadImageModal()}

      {socialSignUpModal()}
      {alreadyExistsModal()}
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

                  <Col xs={3}></Col>
                </Row>
                <div class="listofusers">
                  {listOfUsers.map((users) => {
                    return (
                      <div
                        class="grid_cut"
                        onClick={() => {
                          document.cookie =
                            'patient_uid=' + users.user_unique_id;
                          document.cookie = 'patient_name=' + users.user_name;
                          document.cookie =
                            'patient_timeZone=' + users.time_zone;
                          document.cookie =
                            'patient_email=' + users.user_email_id;
                          document.cookie = 'patient_pic=' + users.user_picture;
                          console.log(document.cookie);
                          loginContext.setLoginState({
                            ...loginContext.loginState,
                            curUser: users.user_unique_id,
                            curUserTimeZone: users.time_zone,
                            curUserEmail: users.user_email_id,
                            curUserPic: users.user_picture,
                            curUserName: users.user_name,
                            ta: {
                              ...loginContext.loginState.ta,
                              picture: currentTaPicture,
                            },
                          });
                        }}
                      >
                        <div class="grid">
                          <div class="g s1">
                            <div class="circle">
                              {users.user_picture == '' ? (
                                <img
                                  src={'/UserNoImage.png'}
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
                              onClick={() => {
                                history.push('/about');
                              }}
                            />
                          </div>
                          <div class="g s5">
                            <img
                              src="/Delete.png"
                              style={{ width: '25px', height: '25px' }}
                              onClick={() =>
                                taListUser.length > 1
                                  ? setRelinquishRole(!relinquishRole)
                                  : setDeleteUser(!deleteUser)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: '1rem' }}>
                  Sign Up a New User
                  <GoogleSignUpUser
                    signupSuccessful={signupSuccessful}
                    setSignupSuccessful={setSignupSuccessful}
                    newFName={firstName}
                    setNewFName={setFirstName}
                    newLName={lastName}
                    setNewLName={setLastName}
                    newEmail={emailUser}
                    setNewEmail={setEmailUser}
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
                </div>
              </div>
            </div>
          </Col>

          <Col
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div>
              <Row style={{
                height: '300px'
              }}>
          <Col>
          <Row style={{
            width: '40%',
            marginLeft: '30%',
          }}>
          {taPhoto == '' ? (
                  <img
                    style={{
                      display: 'block',
                      float: 'right',
                      width: '5rem',
                      height: '5rem',
                      objectFit: 'cover',
                      marginTop: '15px',
                    }}
                    src={'/UserNoImage.png'}
                    alt="TA Profile"
                  />
                ) : (
                  <img
                    style={{
                      display: 'block',
                      float: 'right',
                      width: '5rem',
                      height: '5rem',
                      objectFit: 'cover',
                      marginTop: '15px',
                    }}
                    src={currentTaPhoto}
                    alt="TA Profile"
                  />
                )}
          </Row>
          <Row style={{
            width: '40%',
            marginLeft: '30%',
          }}>
          <h6>Change Image</h6>
                
                <div
                  onClick={() => {
                    toggleUploadImage(!showUploadImage);
                  }}
                  style={{
                    marginLeft: '12px',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  Upload from Computer
                </div>
                <UploadImage
                  photoUrl={taPhotoURL}
                  setPhotoUrl={setTaPhoto}
                  currentUserId={userID}
                />
                <GooglePhotos photoUrl={taPhotoURL} setPhotoUrl={setTaPhoto} />
          </Row>
          </Col>
                <Col style={{
                  marginTop: '50px'
                }}>
          <Form.Group>
            <Row>
                
                  <label
                  style={{
                    marginTop: '5px',
                    marginRight: '10px',
                    fontWeight: 'bolder',
                    color: '#000000',
                  }}
                >
                  First Name:
                </label>
                
                  <TextField
                        id="taFirstName"
                        placeholder="Loading"
                        value={taFirstName}
                        onChange={(e) => {
                          e.stopPropagation();
                          console.log("first name update",e.target.value);
                          setTaFirstName(e.target.value)
                        }}
                  >
                  </TextField>
            </Row>
            <Row>
                <label
                  style={{
                    marginTop: '5px',
                    marginRight: '10px',
                    fontWeight: 'bolder',
                    color: '#000000',
                  }}
                >
                  Last Name:
                </label>
                <TextField
                        id="taLastName"
                        placeholder="Loading"
                        value={taLastName}
                        onChange={(e) => {
                          e.stopPropagation();
                          console.log("last name update",e.target.value);
                          setTaLastName(e.target.value)
                        }}
                  >
                </TextField>
            </Row>
            
            <Row>
                <label
                  style={{
                    marginTop: '5px',
                    marginRight: '10px',
                    fontWeight: 'bolder',
                    color: '#000000',
                  }}
                >
                  Email: 
                </label>
                <div
                  style={{
                    marginTop: '5px',
                    marginRight: '10px',
                    color: '#000000',
                  }}
                >
                  {document.cookie
      .split('; ')
      .find((row) => row.startsWith('ta_email='))
                .split('=')[1]}
                </div>
            </Row>
          <Row>
                <label
                  style={{
                    marginTop: '5px',
                    marginRight: '10px',
                    fontWeight: 'bolder',
                    color: '#000000',
                  }}
                >
                  User ID:
                </label>
                <div
                  style={{
                    marginTop: '5px',
                    marginRight: '10px',
                    color: '#000000',
                  }}
                >
                  {document.cookie
      .split('; ')
      .find((row) => row.startsWith('ta_uid='))
                .split('=')[1]}
                </div>
            </Row>
            <br />
            <br />
            <Row>
            <div>
            <button
                style={{
                  color: '#000000',
                  border: 'solid',
                  borderWidth: '2px',
                  borderRadius: '25px',
                }}
                onClick={() => {
                  // if (taPhotoURL) {
                  //     setTaPhoto(taPhotoURL);
                  //     document.cookie = 'ta_pic=' + taPhotoURL;
                  //   }
                  UpdatePerson();
                }}
              >
                Save Changes
              </button>
              <button
                style={{
                  color: '#000000',
                  border: 'solid',
                  borderWidth: '2px',
                  borderRadius: '25px',
                  marginLeft: '20px',
                }}
                onClick={() => {
                  
                }}
              >
                Cancel
              </button>
            </div>
            </Row>
            </Form.Group>
            </Col>
            </Row>
            </div>

            <div class="con">
              <button
                class="duperr"
                onClick={(e) => {
                  setAccess(true);
                }}
              >
                Give Another TA Access
              </button>
            </div>
            <div class="con">
              <button class="duperr" onClick={() => getAllUsers()}>
                Trusted Advisor Look Up
              </button>
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
                  // handleClickUser(e);
                }}
              >
                Assign User
              </button>
            </div>

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
              console.log('delete')
            )}
            {taListUser.length == 1 ? (
              <div class="con">
                <button
                  class="deleteButton"
                  onClick={() => setDeleteUser(!deleteUser)}
                >
                  Delete User
                </button>
              </div>
            ) : (
              console.log('relinquish')
            )}
          </Col>
        </Row>

        <div class="g comp3">
          <div class="bottom">
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
                    picture: '',
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
