import React, { useState, useEffect, useContext } from 'react';
import { Box, FormControl, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SettingPage from '../Home/SettingPage';
import {
  Form,
  Row,
  Col,
  Modal,
  Button,
  FormLabel,
  ModalBody,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import MiniNavigation from '../miniNavigation';
import LoginContext from '../../LoginContext';
import { useHistory } from 'react-router-dom';
import AddIconModal from '../../Home/AddIconModal';
import UploadImage from '../../Home/UploadImage';
import TAUploadImage from '../../Home/TAUploadImage';
import momentTZ from 'moment-timezone';
import GooglePhotos from '../../Home/GooglePhotos';

const moment = require('moment');
const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;

const useStyles = makeStyles({
  table: {
    //width: 200,
  },
  formGroupTitle: {
    marginLeft: '3rem',
    color: 'white',
  },
  formGroupItem: {
    borderRadius: '10px',
    border: '1px solid #889AB5',
    width: '250px',
    height: '38px',
    marginRight: '2rem',
    marginTop: '1rem',
  },
});

export default function AboutModal(props) {
  const classes = useStyles();
  const loginContext = useContext(LoginContext);
  //states

  console.log(document.cookie);
  const [currentUser, setCU] = useState(loginContext.loginState.curUser);
  // Kyle cookie code
  var userID = '';
  var taID = '';
  var userTime_zone = '';
  var userEmail = '';
  if (
    document.cookie
      .split(';')
      .some((item) => item.trim().startsWith('patient_uid='))
  ) {
    userID = document.cookie
      .split('; ')
      .find((row) => row.startsWith('patient_uid='))
      .split('=')[1];
    taID = document.cookie
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
  } else {
    userID = loginContext.loginState.curUser;
    userTime_zone = loginContext.loginState.curUserTimeZone;
    userEmail = loginContext.loginState.curUserEmail;
  }
  console.log(taID);
  const [imageChanged, setImageChanged] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [addPerson, setAddPerson] = useState(false);
  const [addPersonName, setAddPersonName] = useState('');
  const [ta_user_id, setTa_user_id] = useState('');
  const [photo, setPhoto] = useState('');
  const [showConfirmed, toggleConfirmed] = useState(false);
  const [deleteUser, setDeleteUser] = useState(false);
  const [relinquishRole, setRelinquishRole] = useState(false);
  const [called, toggleCalled] = useState(false);
  const [saveConfirm, toggleSave] = useState(false);
  const [editPerson, setPerson] = useState(false);
  const [taObject, setTaObject] = useState({});
  //aboutMeObject states
  const [aboutMeObject, setAboutMeObject] = useState({
    birth_date: new Date(),
    birth_date_change: false,
    phone_number: '',
    have_pic: false,
    message_card: '',
    message_day: '',
    history: '',
    major_events: '',
    pic: '',
    timeSettings: {
      morning: '',
      afternoon: '',
      evening: '',
      night: '',
      dayStart: '',
      dayEnd: '',
      timeZone: '',
    },
  });

  const history = useHistory();

  const [motivation0, setMotivation0] = useState('');
  const [motivation1, setMotivation1] = useState('');
  const [motivation2, setMotivation2] = useState('');
  const [motivation3, setMotivation3] = useState('');
  const [motivation4, setMotivation4] = useState('');

  //console.log('props',userPhoto)

  const [feelings0, setFeelings0] = useState('');
  const [feelings1, setFeelings1] = useState('');
  const [feelings2, setFeelings2] = useState('');
  const [feelings3, setFeelings3] = useState('');
  const [feelings4, setFeelings4] = useState('');

  const [happy0, setHappy0] = useState('');
  const [happy1, setHappy1] = useState('');
  const [happy2, setHappy2] = useState('');
  const [happy3, setHappy3] = useState('');
  const [happy4, setHappy4] = useState('');

  const [listPeople, setListPeople] = useState([]);
  const [taPhoto, setTaPhoto] = useState(listPeople.pic);
  const [taImage, setTaImage] = useState(null);
  const [taPhotoURL, setTaPhotoURL] = useState('');
  const [people, togglePeople] = useState(false);
  const [userPhoto, setUserPhoto] = useState(aboutMeObject.pic);
  const [userImage, setUserImage] = useState(null);
  const [userPhotoURL, setUserPhotoURL] = useState('');

  const [showUploadImage, toggleUploadImage] = useState(false);
  const [showImage, toggleImage] = useState(false);
  const [taList, setTaList] = useState([]);
  //const userID = loginContext.loginState.curUser;

  console.log('currentUser: ' + currentUser);
  //const userID = document.cookie.split('; ').find(row => row.startsWith('ta_uid=')).split('=')[1];

  // const getTAList = () => {
  //   console.log('in getTAList: ' + currentUser);
  //   axios
  //     .get(BASE_URL + 'listAllTAUser/' + currentUser)
  //     .then((response) => {
  //       console.log(response.data);
  //       setTaList(response.data.result);
  //     })
  //     .catch((err) => {
  //       if (err.response) {
  //         console.log(err.response);
  //       }
  //       console.log(err);
  //     });
  // };
  useEffect(() => {
    console.log('yayayayayay');
    axios
      .get(BASE_URL + 'ListAllTAUser/' + userID)
      .then((response) => {
        console.log('listAllTAUser', response.data.result);
        setTaList(response.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [firstName, called, people]);
  //upload from computer for TA
  const uploadImageModal = () => {
    return (
      <Modal
        show={showImage}
        onHide={() => {
          toggleImage(false);
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
                /* setAboutMeObject({
                      ...aboutMeObject,
                      pic: image1,
                    }); */
                setTaImage(image1);
              }
            }}
          />
          <Button
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
              setTaObject({
                ...taObject,
                pic: taPhotoURL,
                photo_url: '',
              });
              setTaPhoto(taPhotoURL);
              console.log('URL: ', taPhotoURL);
            }}
          >
            Upload
          </Button>
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
              toggleImage(false);
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              console.log('here: Confirming changes');
              setTaPhoto(taPhotoURL);
              setTaObject({
                ...taObject,
                pic: taPhotoURL,
                photo_url: '',
              });
              toggleImage(false);
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  //upload from computer for user
  const uploadUserImageModal = () => {
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
                /* setAboutMeObject({
                  ...aboutMeObject,
                  pic: image1,
                }); */
                setUserImage(image1);
              }
            }}
          />
          <Button
            variant="dark"
            onClick={() => {
              console.log('here: uploading image');
              if (userImage === null) {
                alert('Please select an image to upload');
                return;
              }
              const salt = Math.floor(Math.random() * 9999999999);
              let image_name = userImage.name;
              image_name = image_name + salt.toString();
              setUserPhotoURL(URL.createObjectURL(userImage));
              setAboutMeObject({
                ...aboutMeObject,
                pic: userPhotoURL,
                photo_url: '',
              });
              setUserPhoto(userPhotoURL);
              console.log('URL: ', userPhotoURL);
            }}
          >
            Upload
          </Button>
          <img
            src={userPhotoURL || 'http://via.placeholder.com/400x300'}
            alt="Uploaded images"
            height="300"
            width="400"
          />
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              toggleUploadImage(false);
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              console.log('here: Confirming changes');
              setUserPhoto(userPhotoURL);
              setAboutMeObject({
                ...aboutMeObject,
                pic: userPhotoURL,
                photo_url: '',
              });
              toggleUploadImage(false);
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  // if (document.cookie
  //   .split(";")
  //   .some(item => item.trim().startsWith("ta_uid="))
  //   ) {
  //     userID = document.cookie.split('; ').find(row => row.startsWith('ta_uid=')).split('=')[1]
  //     console.log('userID', userID)
  //   }
  console.log('userID', userID);
  console.log('ta_user_id', ta_user_id);
  console.log('taObject', taObject);
  useEffect(() => {
    setMotivation0('');
    setMotivation1('');
    setMotivation2('');
    setMotivation3('');
    setMotivation4('');

    setFeelings0('');
    setFeelings1('');
    setFeelings2('');
    setFeelings3('');
    setFeelings4('');

    setHappy0('');
    setHappy1('');
    setHappy2('');
    setHappy3('');
    setHappy4('');

    grabFireBaseAboutMeData();

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
        console.log(response);
        if (response.data.result.length > 0) {
          const usersOfTA = response.data.result;
          const curUserID = usersOfTA[0].user_unique_id;
          const curUserTZ = usersOfTA[0].time_zone;
          const curUserEI = usersOfTA[0].user_email_id;
          // console.log('pog', loginContext.loginState.curUser)
          if (loginContext.loginState.curUser == '') {
            // edge case on refresh
            loginContext.setLoginState({
              ...loginContext.loginState,
              usersOfTA: response.data.result,
              curUser: curUserID,
              curUserTimeZone: curUserTZ,
              curUserEmail: curUserEI,
            });
          } else {
            loginContext.setLoginState({
              ...loginContext.loginState,
              usersOfTA: response.data.result,
              //curUser: curUserID
            });
          }

          console.log(curUserID);
          // setUserID(curUserID);
          // console.log(userID);
          //GrabFireBaseRoutinesGoalsData();
          // return userID;
        } else {
          loginContext.setLoginState({
            ...loginContext.loginState,
            usersOfTA: response.data.result,
            curUser: '',
            curUserTimeZone: '',
            curUserEmail: '',
          });
          console.log('No User Found');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [loginContext.loginState.reload]);

  useEffect(() => {
    console.log('yayayayayay');
    axios
      .get(BASE_URL + 'listPeople/' + userID)
      .then((response) => {
        console.log('listPeople', response.data.result.result);
        setListPeople(response.data.result.result);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [firstName, called, people]);

  function grabFireBaseAboutMeData() {
    let url = BASE_URL + 'aboutme/';
    console.log(userID);
    axios
      .get(url + userID) //this.props.theCurrentUserId)
      .then((response) => {
        if (response.data.result.length !== 0) {
          console.log('aboutMe res = ', response.data.result);
          let details = response.data.result[0];

          let x = {
            birth_date: details.user_birth_date,
            phone_number: details.user_phone_number,
            have_pic: details.user_have_pic
              ? details.user_have_pic.toLowerCase() === 'true'
              : false,
            message_card: details.message_card,
            message_day: details.message_day,
            pic: details.user_picture || '',
            history: details.user_history,
            major_events: details.user_major_events,
            timeSettings: {
              morning: details.morning_time,
              afternoon: details.afternoon_time,
              evening: details.evening_time,
              night: details.night_time,
              dayStart: details.day_start,
              dayEnd: details.day_end,
              timeZone: details.time_zone,
            },
          };
          setAboutMeObject(x);
          setFirstName(details.user_first_name);
          setLastName(details.user_last_name);
          setUserPhoto(details.user_picture);
        } else {
          console.log('No user details');
        }
      })
      .catch((err) => {
        console.log('Error getting user details', err);
      });
    console.log('check userID');
    console.log(userID);
    axios
      .get(BASE_URL + 'motivation/' + userID)
      .then((response) => {
        console.log('motivation');
        console.log(JSON.parse(response.data.result[0].options));
        //var temp = ["", "", "", "", ""]
        if (JSON.parse(response.data.result[0].options) != null) {
          for (
            let i = 0;
            i < JSON.parse(response.data.result[0].options).length;
            i++
          ) {
            switch (i) {
              case 0:
                setMotivation0(JSON.parse(response.data.result[0].options)[i]);
                break;
              case 1:
                setMotivation1(JSON.parse(response.data.result[0].options)[i]);
                break;
              case 2:
                setMotivation2(JSON.parse(response.data.result[0].options)[i]);
                break;
              case 3:
                setMotivation3(JSON.parse(response.data.result[0].options)[i]);
                break;
              case 4:
                setMotivation4(JSON.parse(response.data.result[0].options)[i]);
                break;
            }
          }
        }
      })
      .catch((err) => {
        console.log('Error getting user details', err);
      });
    axios
      .get(BASE_URL + 'important/' + userID)
      .then((response) => {
        console.log('feelings');
        //console.log(JSON.parse(response.data.result[0].options))
        //var temp = ["", "", "", "", ""]
        if (JSON.parse(response.data.result[0].options) != null) {
          for (
            let i = 0;
            i < JSON.parse(response.data.result[0].options).length;
            i++
          ) {
            switch (i) {
              case 0:
                setFeelings0(JSON.parse(response.data.result[0].options)[i]);
                break;
              case 1:
                setFeelings1(JSON.parse(response.data.result[0].options)[i]);
                break;
              case 2:
                setFeelings2(JSON.parse(response.data.result[0].options)[i]);
                break;
              case 3:
                setFeelings3(JSON.parse(response.data.result[0].options)[i]);
                break;
              case 4:
                setFeelings4(JSON.parse(response.data.result[0].options)[i]);
                break;
            }
          }
        }
      })
      .catch((err) => {
        console.log('Error getting user details', err);
      });
    axios
      .get(BASE_URL + 'happy/' + userID)
      .then((response) => {
        console.log('motivation');
        console.log(JSON.parse(response.data.result[0].options));
        //var temp = ["", "", "", "", ""]
        if (JSON.parse(response.data.result[0].options) != null) {
          for (
            let i = 0;
            i < JSON.parse(response.data.result[0].options).length;
            i++
          ) {
            switch (i) {
              case 0:
                setHappy0(JSON.parse(response.data.result[0].options)[i]);
                break;
              case 1:
                setHappy1(JSON.parse(response.data.result[0].options)[i]);
                break;
              case 2:
                setHappy2(JSON.parse(response.data.result[0].options)[i]);
                break;
              case 3:
                setHappy3(JSON.parse(response.data.result[0].options)[i]);
                break;
              case 4:
                setHappy4(JSON.parse(response.data.result[0].options)[i]);
                break;
            }
          }
        }
      })
      .catch((err) => {
        console.log('Error getting user details', err);
      });
  }

  useEffect(() => console.log('taObject = ', taObject), [taObject]);

  const tzMap = {
    'Pacific/Samoa': '(GMT-11:00)',
    'Pacific/Honolulu': '(GMT-10:00)',
    'Pacific/Marquesas': '(GMT-09:30)',
    'America/Juneau': '(GMT-09:00)',
    'America/Los_Angeles': '(GMT-08:00)',
    'America/Phoenix': '(GMT-07:00)',
    'America/Chicago': '(GMT-06:00)',
    'America/New_York': '(GMT-05:00)',
    'America/Puerto_Rico': '(GMT-04:00)',
    'Canada/Newfoundland': '(GMT-03:30)',
    'America/Buenos_Aires': '(GMT-03:00)',
    'America/Noronha': '(GMT-02:00)',
    'Atlantic/Azores': '(GMT-01:00)',
    'Europe/London': '(GMT+00:00)',
    'Europe/Berlin': '(GMT+01:00)',
    'Asia/Jerusalem': '(GMT+02:00)',
    'Europe/Moscow': '(GMT+03:00)',
    'Asia/Tehran': '(GMT+03:30)',
    'Asia/Dubai': '(GMT+04:00)',
    'Asia/Kabul': '(GMT+04:30)',
    'Asia/Karachi': '(GMT+05:00)',
    'Asia/Calcutta': '(GMT+05:30)',
    'Asia/Almaty': '(GMT+06:00)',
    'Indian/Cocos': '(GMT+06:30)',
    'Asia/Bangkok': '(GMT+07:00)',
    'Asia/Hong_Kong': '(GMT+08:00)',
    'Asia/Tokyo': '(GMT+09:00)',
    'Australia/Darwin': '(GMT+09:30)',
    'Australia/Brisbane': '(GMT+10:00)',
    'Australia/Lord_How': '(GMT+10:30)',
    'Asia/Magadan': '(GMT+11:00)',
    'Pacific/Fiji': '(GMT+12:00)',
    'Pacific/Apia': '(GMT+13:00)',
    'Pacific/Kiritimati': '(GMT+14:00)',
  };
  const tzList2 = [];
  for (let i = -8; i <= 8; i++) {
    const offset = i < 0 ? `GMT-${-1 * i}` : `GMT+${i}`;
    tzList2.push(moment().tz(`Etc/${offset}`).format('HH:MM') + ' ' + offset);
  }

  /* function handleFileSelected(event) {
    event.preventDefault();
    event.stopPropagation();

    const file = event.target.files[0]; //stores file uploaded in file

    setSaveButtonEnabled(false);
    setImageChanged(true);

    let targetFile = file;
    if (targetFile !== null && Object.keys(aboutMeObject).length !== 0) {
      const imageURL = URL.createObjectURL(file);
      setAboutMeObject((prevState) => ({
        ...prevState,
        have_pic: true,
        pic: imageURL,
        timeSettings: {
          ...prevState.timeSettings,
        },
      }));
      setSaveButtonEnabled(true);
      setUrl(URL.createObjectURL(event.target.files[0]));
      console.log(url);
    }
    console.log(aboutMeObject.pic);
    console.log(event.target.files[0].name);
  } */

  function componentDidMount() {
    grabFireBaseAboutMeData();
  }

  useEffect(
    () => console.log('loggy1: aboutMeObj = ', aboutMeObject),
    [aboutMeObject.message_card]
  );

  function hideAboutForm(e) {
    props.CameBackFalse();
  }

  function hideTimeModal() {
    setShowTimeModal(false);
  }

  function updateTimeSetting(time) {
    setAboutMeObject((prevState) => ({
      ...prevState,
      timeSettings: time,
    }));
    setShowTimeModal(false);
  }

  function newInputSubmit() {
    const body = {
      user_id: userID,
      first_name: firstName,
      last_name: lastName,
      have_pic: aboutMeObject.have_pic,
      message_card: aboutMeObject.message_card,
      message_day: aboutMeObject.message_day,
      picture: userPhoto,
      //photo_url: userPhoto,
      timeSettings: aboutMeObject.timeSettings,
      history: aboutMeObject.history,
      major_events: aboutMeObject.major_events,
      phone_number: aboutMeObject.phone_number,
      birth_date: aboutMeObject.birth_date,
    };
    console.log('body', body);
    if (aboutMeObject.phone_number === 'undefined') {
      body.phone_number = '';
    } else {
      body.phone_number = aboutMeObject.phone_number;
    }
    if (aboutMeObject.birth_date_change) {
      console.log('hi');
      // console.log(typeof aboutMeObject.birth_date)
      // console.log(body.birth_date)
      body.birth_date = aboutMeObject.birth_date;
    } else {
      // var date = new Date(aboutMeObject.birth_date);
      // body.birth_date = date;
      // var br = JSON.stringify(body.birth_date);
      // body.birth_date = br.substring(1, br.length - 1);
      body.birth_date = aboutMeObject.birth_date;
    }

    if (typeof body.picture === 'string') {
      body.photo_url = body.picture;
      body.picture = '';
    } else {
      body.photo_url = '';
    }

    let url = BASE_URL + 'updateAboutMe';

    let formData = new FormData();
    Object.entries(body).forEach((entry) => {
      if (entry[0] === 'picture') {
        if (entry[1].name !== undefined) {
          if (typeof entry[1].name == 'string') {
            formData.append(entry[0], entry[1]);
          }
        }
      } else if (entry[1] instanceof Object) {
        entry[1] = JSON.stringify(entry[1]);
        formData.append(entry[0], entry[1]);
      } else {
        formData.append(entry[0], entry[1]);
      }
    });
    formData.append('picture', userImage);
    for (let value of formData.values()) {
      console.log(value);
    }
    axios
      .post(BASE_URL + 'updateAboutMe', formData)
      .then((response) => {
        if (imageChanged) {
          props.updateProfilePic(body.first_name + ' ' + body.last_name, url);
        } else {
          props.updateProfilePic(
            body.first_name + ' ' + body.last_name,
            userPhoto
          );
        }
        props.updateProfileTimeZone(aboutMeObject.timeSettings['timeZone']);
        axios
          .get(BASE_URL + 'listPeople/' + userID)
          .then((response) => {
            setListPeople(response.data.result.result);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((err) => {
        console.log('Error updating Details', err);
      });

    let motivationJSON = {
      user_id: userID,
      motivation: [
        motivation0,
        motivation1,
        motivation2,
        motivation3,
        motivation4,
      ],
    };

    console.log(motivationJSON);

    axios
      .post(BASE_URL + 'updateMotivation', motivationJSON)
      .then((response) => {
        console.log(response);
      });

    let importantJSON = {
      user_id: userID,
      important: [feelings0, feelings1, feelings2, feelings3, feelings4],
    };

    console.log(importantJSON);

    axios.post(BASE_URL + 'updateImportant', importantJSON).then((response) => {
      console.log(response);
    });

    let happyJSON = {
      user_id: userID,
      happy: [happy0, happy1, happy2, happy3, happy4],
    };

    console.log(happyJSON);

    axios.post(BASE_URL + 'updateHappy', happyJSON).then((response) => {
      console.log(response);
    });
  }

  // grabFireBaseAboutMeData()
  console.log(aboutMeObject);

  var selectedTAid = '';
  function AddPerson() {
    let body = {
      user_id: userID,
      people_name: taObject.name,
      people_relationship: taObject.relationship,
      people_important: 'TRUE',
      people_pic: taPhoto,
      //photo_url: userPhoto,,
      photo_url: '',
      ta_time_zone: taObject.time_zone,
      people_email: taObject.email,
      people_employer: taObject.employer,
      people_phone_number: taObject.phone_number.replace(/\D/g, ''),
    };
    console.log('addPerson.body = ', body);
    if (typeof body.people_pic === 'string') {
      body.photo_url = body.people_pic;
      body.people_pic = '';
    } else {
      body.photo_url = '';
    }

    let formData = new FormData();
    Object.entries(body).forEach((entry) => {
      // if (typeof entry[1].name == 'string'){
      if (typeof entry[1] == 'string') {
        formData.append(entry[0], entry[1]);
      } else if (entry[1] instanceof Object) {
        entry[1] = JSON.stringify(entry[1]);
        formData.append(entry[0], entry[1]);
      } else {
        formData.append(entry[0], entry[1]);
      }
    });
    formData.append('people_pic', taImage);
    axios
      .post(BASE_URL + 'addPeople', formData)
      .then((response) => {
        console.log('addPeople.response = ', response.data);
        if (response.data.message == 'TA already exists.') {
          alert(response.data.message);
          toggleConfirmed(false);
        } else {
          toggleConfirmed(true);
          axios
            .get(BASE_URL + 'listPeople/' + userID)
            .then((response) => {
              setListPeople(response.data.result.result);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function UpdatePerson() {
    let body = {
      user_id: userID,
      ta_people_id: ta_user_id,
      people_name: taObject.name,
      people_relationship: taObject.relationship,
      people_phone_number: taObject.phone_number.replace(/\D/g, ''),
      people_employer: taObject.employer,
      people_email: taObject.email,
      people_important: 'True',
      people_have_pic: 'False',
      people_pic: taPhoto,
      photo_url: taImage,
      ta_time_zone: taObject.time_zone,
    };
    console.log('updatePerson', body);
    if (taObject.phone_number === 'undefined') {
      body.phone_number = '';
    } else {
      body.phone_number = taObject.phone_number;
    }
    if (typeof body.people_pic === 'string') {
      body.photo_url = body.people_pic;
      body.people_pic = '';
    } else {
      body.photo_url = '';
    }
    let formData = new FormData();
    Object.entries(body).forEach((entry) => {
      // if (typeof entry[1].name == 'string'){
      if (typeof entry[1] == 'string') {
        formData.append(entry[0], entry[1]);
      } else if (entry[1] instanceof Object) {
        entry[1] = JSON.stringify(entry[1]);
        formData.append(entry[0], entry[1]);
      } else {
        formData.append(entry[0], entry[1]);
      }
    });
    formData.append('people_pic', taImage);
    axios
      .post(BASE_URL + 'updatePeople', formData)
      .then((response) => {
        console.log(response.data);
        toggleConfirmed(true);
        toggleCalled(!called);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const editPersonModal = (taObject) => {
    if (editPerson || addPerson) {
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
              backgroundColor: '#889AB5',
              width: '400px',
              // height: "100px",
              color: 'white',
              padding: '40px',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              Person Info
            </div>
            <Form.Group>
              <Row>
                <Col style={{ paddingRight: '10px' }}>
                  <FormLabel
                    style={{
                      marginTop: '10px',
                      marginLeft: '10px',
                      fontWeight: 'bolder',
                      color: 'white',
                    }}
                  >
                    Name
                  </FormLabel>
                  <Form.Control
                    type="text"
                    placeholder="First Last"
                    value={taObject.name}
                    onChange={(e) => {
                      console.log(e.target.value);
                      setTaObject({
                        ...taObject,
                        name: e.target.value,
                      });
                    }}
                  />
                </Col>
              </Row>

              <br />
              <div style={{ fontWeight: 'bold', marginTop: '10px' }}>
                Change Icon
              </div>

              <Row
                style={{
                  textAlign: 'left',
                  float: 'left',
                  marginTop: '1rem',
                  width: '100%',
                }}
              >
                <Col
                  xs={8}
                  style={{
                    textDecoration: 'underline',
                    paddingLeft: '0',
                    marginLeft: '0',
                    width: '70%',
                    color: '#ffffff',
                    fontSize: '14px',
                  }}
                >
                  <Row>
                    <div
                      onClick={() => {
                        toggleImage(!showImage);
                      }}
                      style={{
                        marginLeft: '2rem',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                    >
                      Upload from Computer
                    </div>
                    <div
                      style={{
                        marginLeft: '1.2rem',
                        cursor: 'pointer',
                      }}
                    >
                      <TAUploadImage
                        photoUrl={taPhoto}
                        setPhotoUrl={setTaPhoto}
                        currentUserId={taObject.ta_people_id}
                      />
                    </div>
                  </Row>
                </Col>
                <Col xs={4}>
                  <div>
                    <img
                      style={{
                        height: '5rem',
                        width: '5rem',
                        backgroundColor: '#ffffff',
                        borderRadius: '10px',
                        objectFit: 'cover',
                      }}
                      src={taPhoto}
                    />
                  </div>
                </Col>
              </Row>

              <br />
              <Row style={{ display: 'block' }}>
                <Col style={{ paddingRight: '10px' }}>
                  <div
                    style={{
                      marginTop: '25px',
                      fontWeight: 'bold',
                      marginBottom: '10px',
                    }}
                  >
                    Relationship
                  </div>
                  <FormControl fullWidth>
                    <Select
                      value={taObject.relationship}
                      style={{ backgroundColor: 'white', paddingLeft: '15px' }}
                      renderValue={() => {
                        if (taObject.relationship === '') {
                          return <div>Enter a relationship</div>;
                        }

                        return taObject.relationship;
                      }}
                      onChange={(e) => {
                        setTaObject({
                          ...taObject,
                          relationship: e.target.value,
                        });
                      }}
                    >
                      <MenuItem value={'Advisor'}>{'Advisor'}</MenuItem>
                      <MenuItem value={'Friend'}>{'Friend'}</MenuItem>
                      <MenuItem value={'Relative'}>{'Relative'}</MenuItem>
                    </Select>
                  </FormControl>
                  <div
                    style={{
                      marginTop: '25px',
                      fontWeight: 'bold',
                      marginBottom: '10px',
                    }}
                  >
                    Time Zone
                  </div>
                  {console.log('timeSettings')}
                  <FormControl fullWidth>
                    <Select
                      value={taObject.time_zone || ''}
                      style={{ backgroundColor: 'white', paddingLeft: '15px' }}
                      onChange={(e) => {
                        setTaObject({
                          ...taObject,
                          time_zone: e.target.value,
                        });
                      }}
                      renderValue={() => {
                        console.log('timeZone1 = ', taObject.time_zone);
                        if (taObject.time_zone === '') {
                          return <div>Enter a timezone</div>;
                        }

                        return taObject.time_zone.split('_').join(' ');
                      }}
                    >
                      {Object.keys(tzMap).map((tz) => (
                        <MenuItem value={tz}>{`${tz.split('_').join(' ')}  ${
                          tzMap[tz]
                        }`}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Col>
              </Row>
              <br />
              <Row>
                <Col style={{ paddingRight: '10px' }}>
                  <label
                    style={{
                      marginTop: '10px',
                      fontWeight: 'bolder',
                      color: 'white',
                    }}
                  >
                    Phone Number
                  </label>
                  <Form.Control
                    type="phone"
                    value={taObject.phone_number}
                    placeholder="Enter phone number"
                    onChange={(e) => {
                      const re = /\D/g;
                      const test = e.target.value.replace(re, '');
                      console.log('test = ', test);
                      if (test.length > 10) return;
                      setTaObject({
                        ...taObject,
                        phone_number: e.target.value,
                      });
                    }}
                  />
                </Col>
              </Row>
              <br />
              <Row>
                <Col style={{ paddingRight: '10px' }}>
                  <label
                    style={{
                      marginTop: '10px',
                      fontWeight: 'bolder',
                      color: 'white',
                    }}
                  >
                    Email Address
                  </label>
                  <Form.Control
                    type="email"
                    placeholder="Email Address"
                    value={taObject.email}
                    onChange={(e) => {
                      console.log(e.target.value);
                      setTaObject({
                        ...taObject,
                        email: e.target.value,
                      });
                    }}
                  />
                </Col>
              </Row>
              <br />
              <Row>
                <Col style={{ paddingRight: '10px' }}>
                  <label
                    style={{
                      marginTop: '10px',
                      fontWeight: 'bolder',
                      color: 'white',
                    }}
                  >
                    Employer
                  </label>
                  <Form.Control
                    type="text"
                    placeholder="Employer"
                    value={taObject.employer}
                    onChange={(e) => {
                      console.log(e.target.value);
                      setTaObject({
                        ...taObject,
                        employer: e.target.value,
                      });
                    }}
                  />
                </Col>
              </Row>
            </Form.Group>
            <div>
              <button
                style={{
                  backgroundColor: '#FF6B4A',
                  color: 'white',
                  border: 'solid',
                  borderWidth: '2px',
                  borderRadius: '25px',
                  width: '30%',
                  marginLeft: '5%',
                  marginRight: '10%',
                }}
                onClick={() => {
                  setPerson(false);
                  setAddPerson(false);
                }}
              >
                Cancel
              </button>
              <button
                style={{
                  backgroundColor: '#51CC4E',
                  color: 'white',
                  border: 'solid',
                  borderWidth: '2px',
                  borderRadius: '25px',
                  width: '40%',
                  marginLeft: '10%',
                  marginRight: '5%',
                }}
                onClick={() => {
                  if (addPerson) AddPerson();
                  else UpdatePerson();
                  setPerson(false);
                  setAddPerson(false);
                }}
              >
                Save Changes
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
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          <div
            style={{
              position: 'relative',
              justifySelf: 'center',
              alignSelf: 'center',
              display: 'block',
              backgroundColor: '#889AB5',
              width: '400px',
              // height: "100px",
              color: 'white',
              padding: '40px',
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
                  backgroundColor: '#889AB5',
                  color: 'white',
                  border: 'solid',
                  borderWidth: '2px',
                  borderRadius: '25px',
                  width: '30%',
                  marginLeft: '10%',
                  marginRight: '10%',
                }}
                onClick={() => {
                  let body = {
                    user_id: userID,
                  };
                  axios.post(BASE_URL + 'deleteUser', body).then((response) => {
                    console.log('deleting');
                    console.log(response.data);
                    document.cookie = 'patient_uid=1;max-age=0';
                    document.cookie = 'patient_name=1;max-age=0';
                    document.cookie = 'patient_email=1;max-age=0';
                    loginContext.setLoginState({
                      ...loginContext.loginState,
                      reload: !loginContext.loginState.reload,
                    });
                    setDeleteUser(!deleteUser);
                    toggleCalled(!called);
                    history.push('/home');
                  });
                }}
              >
                Yes
                {console.log('list of users', loginContext.loginState.reload)}
              </button>
              <button
                style={{
                  backgroundColor: '#889AB5',
                  color: 'white',
                  border: 'solid',
                  borderWidth: '2px',
                  borderRadius: '25px',
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
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          <div
            style={{
              position: 'relative',
              justifySelf: 'center',
              alignSelf: 'center',
              display: 'block',
              backgroundColor: '#889AB5',
              width: '400px',
              // height: "100px",
              color: 'white',
              padding: '40px',
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
                  backgroundColor: '#889AB5',
                  color: 'white',
                  border: 'solid',
                  borderWidth: '2px',
                  borderRadius: '25px',
                  width: '30%',
                  marginLeft: '10%',
                  marginRight: '10%',
                }}
                onClick={() => {
                  let body = {
                    user_id: userID,
                    ta_people_id: taID,
                  };
                  axios
                    .post(BASE_URL + 'deletePeople', body)
                    .then((response) => {
                      console.log('deleting');
                      console.log(response.data);
                      setRelinquishRole(!relinquishRole);
                      toggleCalled(!called);

                      document.cookie = 'patient_uid=1;max-age=0';
                      document.cookie = 'patient_name=1;max-age=0';
                      document.cookie = 'patient_email=1;max-age=0';
                      loginContext.setLoginState({
                        ...loginContext.loginState,
                        reload: true,
                      });
                      history.push('/home');
                    });
                }}
              >
                Yes
              </button>
              <button
                style={{
                  backgroundColor: '#889AB5',
                  color: 'white',
                  border: 'solid',
                  borderWidth: '2px',
                  borderRadius: '25px',
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
              backgroundColor: '#889AB5',
              width: '400px',
              // height: "100px",
              color: 'white',
              padding: '40px',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              Changes saved
            </div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              User's about me changes have been saved.
            </div>
            <div style={{ textAlign: 'center' }}>
              <button
                style={{
                  backgroundColor: '#889AB5',
                  color: 'white',
                  border: 'solid',
                  borderWidth: '2px',
                  borderRadius: '25px',
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
  const confirmSaveModal = () => {
    if (saveConfirm) {
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
              backgroundColor: '#889AB5',
              width: '400px',
              // height: "100px",
              color: 'white',
              padding: '40px',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              Save Person
            </div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              Person added to the important people list.
            </div>
            <div style={{ textAlign: 'center' }}>
              <button
                style={{
                  backgroundColor: '#889AB5',
                  color: 'white',
                  border: 'solid',
                  borderWidth: '2px',
                  borderRadius: '25px',
                  width: '30%',
                  marginLeft: '10%',
                  marginRight: '10%',
                }}
                onClick={() => {
                  toggleSave(false);
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

  return (
    <div>
      {uploadImageModal()}
      {uploadUserImageModal()}
      {editPersonModal(taObject)}
      {confirmedModal()}
      {confirmSaveModal()}
      {deleteModal()}
      {removeRoleModal()}
      <div style={{ height: '3px' }}></div>
      <div backgroundColor="#bbc8d7">
        <MiniNavigation />
      </div>
      <ModalBody
        style={{
          backgroundColor: '#889AB5',
          width: '100%',
          float: 'left',
          marginRight: '20px',
          marginTop: '10px',
        }}
      >
        <div
          style={{
            width: '29%',
            float: 'left',
            margin: '25px',
            paddingRight: '10%',
          }}
        >
          <Form.Group>
            <Row>
              <Col style={{ paddingRight: '10px' }}>
                <FormLabel
                  style={{
                    marginTop: '10px',
                    marginLeft: '10px',
                    fontWeight: 'bolder',
                    color: 'white',
                  }}
                >
                  First Name:
                </FormLabel>
                <Form.Control
                  type="text"
                  placeholder="First Last"
                  value={firstName || ''}
                  onChange={(e) => {
                    e.stopPropagation();
                    setFirstName(e.target.value);
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col style={{ paddingRight: '10px' }}>
                <label
                  style={{
                    marginTop: '10px',
                    marginLeft: '10px',
                    fontWeight: 'bolder',
                    color: 'white',
                  }}
                >
                  Last Name:
                </label>

                <Form.Control
                  type="text"
                  placeholder="First Last"
                  value={lastName || ''}
                  onChange={(e) => {
                    e.stopPropagation();
                    setLastName(e.target.value);
                  }}
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col
                xs={8}
                style={{
                  width: '70%',
                  color: '#ffffff',
                  fontSize: '14px',
                }}
              >
                <h1
                  style={{
                    fontSize: '24px',
                    font: 'SF-Compact-Text-Semibold',
                  }}
                >
                  Change Image
                </h1>
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
                  photoUrl={userPhoto}
                  setPhotoUrl={setUserPhoto}
                  currentUserId={userID}
                />
                <GooglePhotos photoUrl={userPhoto} setPhotoUrl={setUserPhoto} />
              </Col>
              <Col xs={4}>
                {/* {aboutMeObject.have_pic === false ? (
                  <FontAwesomeIcon icon={faImage} size="6x" />
                ) : userPhoto === '' ? (
                  <div
                    style={{
                      display: 'block',
                      float: 'right',
                      width: '5rem',
                      height: '5rem',
                      objectFit: 'fill',
                      border: 'none',
                      borderRadius: '10px',
                      backgroundColor: 'white',
                      marginBottom: '15px',
                    }}
                  ></div>
                ) : ( */}
                <img
                  style={{
                    display: 'block',
                    float: 'right',
                    width: '5rem',
                    height: '5rem',
                    objectFit: 'cover',
                    marginTop: '15px',
                    //marginBottom: '15px',
                  }}
                  src={userPhoto}
                  alt="Profile"
                />
                {/* )} */}
              </Col>
              {/* <Col style={{ float: 'right' }} xs={4}>
                <img alt="icon" src={photo} style={{ width: '100%' }} />
              </Col> */}
              {/*  <Col style={{ color: 'white' }}>
                <h1
                  style={{
                    fontSize: '24px',
                    font: 'SF-Compact-Text-Semibold',
                  }}
                >
                  Change Image
                </h1>
                <div
                  style={{
                    fontSize: '16px',
                    textDecoration: 'underline',
                  }}
                >
                  User's library
                </div>
              </Col>
              <Col>
                {aboutMeObject.have_pic === false ? (
                  <FontAwesomeIcon icon={faImage} size="6x" />
                ) : aboutMeObject.pic === '' ? (
                  // <img
                  //   style={{
                  //     display: 'block',
                  //     marginLeft: 'auto',
                  //     marginRight: 'auto',
                  //     width: '100%',
                  //     height: '70px',
                  //     marginTop: '50px',
                  //     marginBottom: '50px',
                  //   }}
                  //   src={this.state.aboutMeObject.pic}
                  //   alt="Profile"
                  // />
                  <div
                    style={{
                      display: 'block',
                      float: 'right',
                      width: '5rem',
                      height: '5rem',
                      objectFit: 'fill',
                      // width: '100px',
                      // height: '100px',
                      border: 'none',
                      borderRadius: '10px',
                      backgroundColor: 'white',
                      marginBottom: '15px',
                    }}
                  ></div>
                ) : (
                  <img
                    style={{
                      display: 'block',
                      float: 'right',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      width: '5rem',
                      height: '5rem',
                      objectFit: 'cover',
                      marginBottom: '15px',
                    }}
                    src={aboutMeObject.pic}
                    alt="Profile"
                  />
                )}
              </Col>
              <Col xs={8}>
                <label
                  style={{
                    marginBottom: '15px',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  Upload A New Image
                </label>
                <input
                  style={{ color: 'transparent' }}
                  accept="image/*"
                  type="file"
                  onChange={handleFileSelected}
                  id="ProfileImage"
                />
              </Col> */}
            </Row>
            <br />
            <Row>
              <Col style={{ paddingRight: '10px' }}>
                <label
                  style={{
                    marginTop: '10px',
                    marginRight: '20px',
                    fontWeight: 'bolder',
                    color: 'white',
                  }}
                >
                  Birth Date:
                </label>
                <Form.Control
                  type="date"
                  value={aboutMeObject.birth_date}
                  // selected={aboutMeObject.birth_date}
                  onChange={(date) => {
                    console.log(date.target.value);
                    setAboutMeObject({
                      ...aboutMeObject,
                      birth_date: date.target.value,
                      birth_date_change: true,
                    });
                  }}
                  dateFormat="MMMM d, yyyy"
                />
                {/* <DatePicker
              className="form-control"
              type="text"
              placeholder="Enter Birth Date"
              selected={this.state.aboutMeObject.birth_date}
              onChange={(date) => {
                let temp = this.state.aboutMeObject;
                temp.birth_date = date;
                temp.birth_date_change = true;
                console.log(date);
                this.setState({
                  aboutmeObject: temp,
                });
              }}
              dateFormat="MMMM d, yyyy"
            /> */}
              </Col>
            </Row>
            <br />
            <Row>
              <Col style={{ paddingRight: '10px' }}>
                <label
                  style={{
                    marginTop: '10px',
                    fontWeight: 'bolder',
                    color: 'white',
                  }}
                >
                  Phone Number:
                </label>
                <PhoneInput
                  class="form-control"
                  placeholder="Enter phone number"
                  value={aboutMeObject.phone_number}
                  onChange={(e) => {
                    setAboutMeObject((prevState) => ({
                      ...prevState,
                      phone_number: e,
                      timeSettings: {
                        ...prevState.timeSettings,
                      },
                    }));
                  }}
                />
                {/* <input
            class= "form-control"
            type="text"
            placeholder="Enter phone number"
            value={this.state.aboutMeObject.phone_number}
            // value={this.state.aboutMeObject.phone_number}
            // onChange={(e) => {
            //   let temp = this.state.aboutMeObject
            //   temp.phone_number = e
            //   this.setState(
            //     {
            //       aboutMeObject: temp,
            //     });
            // }}
            /> */}
              </Col>
            </Row>
          </Form.Group>
          <Form.Group
            controlId="MajorEvents"
            style={{
              marginTop: '10px',
              fontWeight: 'bolder',
              color: 'white',
            }}
          >
            <div
              style={{
                marginTop: '25px',
                fontWeight: 'bold',
                marginBottom: '10px',
              }}
            >
              Time Settings
            </div>
            {console.log('timeSettings')}
            <FormControl fullWidth>
              <Select
                value={
                  aboutMeObject.timeSettings.timeZone.split('_').join(' ') || ''
                }
                style={{ backgroundColor: 'white', paddingLeft: '15px' }}
                onChange={(e) => {
                  e.stopPropagation();
                  setAboutMeObject((prevState) => ({
                    ...prevState,
                    timeSettings: {
                      ...prevState.timeSettings,
                      timeZone: e.target.value,
                    },
                  }));
                }}
                renderValue={() => {
                  console.log(
                    'timeZone1 = ',
                    aboutMeObject.timeSettings.timeZone
                  );
                  if (aboutMeObject.timeSettings.timeZone === '') {
                    return <div>Enter a timezone</div>;
                  }

                  return aboutMeObject.timeSettings.timeZone
                    .split('_')
                    .join(' ');
                }}
              >
                {Object.keys(tzMap).map((tz) => (
                  <MenuItem value={tz}>{`${tz.split('_').join(' ')}  ${
                    tzMap[tz]
                  }`}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Form.Group>
          <table>
            <tr>
              <td>
                <p
                  style={{
                    marginRight: '20px',
                    marginTop: '10px',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  Morning
                </p>
              </td>
              <td>
                <input
                  style={{
                    width: '90px',
                    padding: '3px 0',
                    borderRadius: '10px',
                    border: '1px solid #889AB5',
                  }}
                  value={aboutMeObject.timeSettings.morning || ''}
                  onChange={(e) =>
                    setAboutMeObject({
                      ...aboutMeObject,
                      timeSettings: {
                        ...aboutMeObject.timeSettings,
                        morning: e.target.value,
                      },
                    })
                  }
                ></input>
              </td>
              <td>
                <p
                  style={{
                    marginRight: '20px',
                    marginLeft: '20px',
                    marginTop: '10px',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  Afternoon
                </p>
              </td>
              <td>
                <input
                  style={{
                    width: '90px',
                    padding: '3px 0',
                    borderRadius: '10px',
                    border: '1px solid #889AB5',
                  }}
                  value={aboutMeObject.timeSettings.afternoon || ''}
                  onChange={(e) =>
                    setAboutMeObject({
                      ...aboutMeObject,
                      timeSettings: {
                        ...aboutMeObject.timeSettings,
                        afternoon: e.target.value,
                      },
                    })
                  }
                ></input>
              </td>
            </tr>
            <tr>
              <td>
                <p
                  style={{
                    marginRight: '20px',
                    marginTop: '10px',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  Evening
                </p>
              </td>
              <td>
                <input
                  style={{
                    width: '90px',
                    padding: '3px 0',
                    borderRadius: '10px',
                    border: '1px solid #889AB5',
                  }}
                  value={aboutMeObject.timeSettings.evening || ''}
                  onChange={(e) =>
                    setAboutMeObject({
                      ...aboutMeObject,
                      timeSettings: {
                        ...aboutMeObject.timeSettings,
                        evening: e.target.value,
                      },
                    })
                  }
                ></input>
              </td>
              <td>
                <p
                  style={{
                    marginRight: '20px',
                    marginLeft: '20px',
                    marginTop: '10px',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  Night
                </p>
              </td>
              <td>
                <input
                  style={{
                    width: '90px',
                    padding: '3px 0',
                    borderRadius: '10px',
                    border: '1px solid #889AB5',
                  }}
                  value={aboutMeObject.timeSettings.night || ''}
                  onChange={(e) =>
                    setAboutMeObject({
                      ...aboutMeObject,
                      timeSettings: {
                        ...aboutMeObject.timeSettings,
                        night: e.target.value,
                      },
                    })
                  }
                ></input>
              </td>
            </tr>
            <tr>
              <td>
                <p
                  style={{
                    marginRight: '20px',
                    // marginTop: '10px',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  Day Start
                </p>
              </td>
              <td>
                <input
                  style={{
                    width: '90px',
                    padding: '3px 0',
                    borderRadius: '10px',
                    border: '1px solid #889AB5',
                  }}
                  value={aboutMeObject.timeSettings.dayStart || ''}
                  onChange={(e) =>
                    setAboutMeObject({
                      ...aboutMeObject,
                      timeSettings: {
                        ...aboutMeObject.timeSettings,
                        dayStart: e.target.value,
                      },
                    })
                  }
                ></input>
              </td>
              <td>
                <p
                  style={{
                    marginRight: '20px',
                    marginLeft: '20px',
                    // marginTop: '10px',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  Day End
                </p>
              </td>
              <td>
                <input
                  style={{
                    width: '90px',
                    padding: '3px 0',
                    borderRadius: '10px',
                    border: '1px solid #889AB5',
                  }}
                  value={aboutMeObject.timeSettings.dayEnd || ''}
                  onChange={(e) =>
                    setAboutMeObject({
                      ...aboutMeObject,
                      timeSettings: {
                        ...aboutMeObject.timeSettings,
                        dayEnd: e.target.value,
                      },
                    })
                  }
                ></input>
              </td>
            </tr>
          </table>

          <div>
            <table style={{ width: '150%' }}>
              <tr style={{ marginLeft: '3rem ' }}>
                <th className={classes.formGroupTitle}>What motivates you?</th>
                <th className={classes.formGroupTitle}>
                  What’s important to you?
                </th>
                <th className={classes.formGroupTitle}>
                  What makes you happy?
                </th>
              </tr>
              <tr style={{ paddingRight: '20px' }}>
                <td>
                  <input
                    className={classes.formGroupItem}
                    value={motivation0 || ''}
                    onChange={(e) => {
                      //motivationArrayTemp = motivationArray
                      // motivationArrayTemp[0] = e.target.value
                      // console.log(motivationArrayTemp)
                      // setMotivationArray(motivationArrayTemp)
                      setMotivation0(e.target.value);
                    }}
                  ></input>
                </td>
                <td>
                  <input
                    className={classes.formGroupItem}
                    value={feelings0 || ''}
                    onChange={(e) => {
                      //motivationArrayTemp = motivationArray
                      // motivationArrayTemp[0] = e.target.value
                      // console.log(motivationArrayTemp)
                      // setMotivationArray(motivationArrayTemp)
                      setFeelings0(e.target.value);
                    }}
                  ></input>
                </td>
                <td>
                  <input
                    className={classes.formGroupItem}
                    value={happy0 || ''}
                    onChange={(e) => {
                      //motivationArrayTemp = motivationArray
                      // motivationArrayTemp[0] = e.target.value
                      // console.log(motivationArrayTemp)
                      // setMotivationArray(motivationArrayTemp)
                      setHappy0(e.target.value);
                    }}
                  ></input>
                </td>
              </tr>
              <tr style={{ margin: '20px' }}>
                <td>
                  <input
                    className={classes.formGroupItem}
                    value={motivation1 || ''}
                    onChange={(e) => {
                      setMotivation1(e.target.value);
                    }}
                  ></input>
                </td>
                <td>
                  <input
                    className={classes.formGroupItem}
                    value={feelings1 || ''}
                    onChange={(e) => {
                      setFeelings1(e.target.value);
                    }}
                  ></input>
                </td>
                <td>
                  <input
                    className={classes.formGroupItem}
                    value={happy1 || ''}
                    onChange={(e) => {
                      setHappy1(e.target.value);
                    }}
                  ></input>
                </td>
              </tr>
              <tr style={{ margin: '20px' }}>
                <td>
                  <input
                    className={classes.formGroupItem}
                    value={motivation2 || ''}
                    onChange={(e) => {
                      setMotivation2(e.target.value);
                    }}
                  ></input>
                </td>
                <td>
                  <input
                    className={classes.formGroupItem}
                    value={feelings2 || ''}
                    onChange={(e) => {
                      setFeelings2(e.target.value);
                    }}
                  ></input>
                </td>
                <td>
                  <input
                    className={classes.formGroupItem}
                    value={happy2 || ''}
                    onChange={(e) => {
                      setHappy2(e.target.value);
                    }}
                  ></input>
                </td>
              </tr>
              <tr style={{ margin: '20px' }}>
                <td>
                  <input
                    className={classes.formGroupItem}
                    value={motivation3 || ''}
                    onChange={(e) => {
                      setMotivation3(e.target.value);
                    }}
                  ></input>
                </td>
                <td>
                  <input
                    className={classes.formGroupItem}
                    value={feelings3 || ''}
                    onChange={(e) => {
                      setFeelings3(e.target.value);
                    }}
                  ></input>
                </td>
                <td>
                  <input
                    className={classes.formGroupItem}
                    value={happy3 || ''}
                    onChange={(e) => {
                      setHappy3(e.target.value);
                    }}
                  ></input>
                </td>
              </tr>
              <tr style={{ margin: '20px' }}>
                <td>
                  <input
                    className={classes.formGroupItem}
                    value={motivation4 || ''}
                    onChange={(e) => {
                      setMotivation4(e.target.value);
                    }}
                  ></input>
                </td>
                <td>
                  <input
                    className={classes.formGroupItem}
                    value={feelings4 || ''}
                    onChange={(e) => {
                      setFeelings4(e.target.value);
                    }}
                  ></input>
                </td>
                <td>
                  <input
                    className={classes.formGroupItem}
                    value={happy4 || ''}
                    onChange={(e) => {
                      setHappy4(e.target.value);
                    }}
                  ></input>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div
          style={{
            width: '20%',
            float: 'left',
            margin: '25px',
          }}
        >
          <Form.Group
            controlId="AboutMessage"
            style={{
              marginTop: '10px',
              fontWeight: 'bolder',
              color: 'white',
            }}
          >
            <Form.Label>Message Day</Form.Label>
            <Form.Control
              style={{ borderRadius: '10px', height: '100px' }}
              as="textarea"
              rows="9"
              type="text"
              value={aboutMeObject.message_day || ''}
              onChange={(e) => {
                console.log(e.target.value);
                e.stopPropagation();
                setAboutMeObject({
                  ...aboutMeObject,
                  message_day: e.target.value,
                });
              }}
            />
          </Form.Group>
          <Form.Group controlId="AboutMessageCard">
            <Form.Label
              style={{
                marginTop: '10px',
                fontWeight: 'bolder',
                color: 'white',
              }}
            >
              Message Card
            </Form.Label>
            <Form.Control
              style={{ borderRadius: '10px', height: '100px' }}
              as="textarea"
              rows="9"
              type="text"
              value={aboutMeObject.message_card || ''}
              onChange={(e) => {
                console.log(e.target.value);
                e.stopPropagation();
                setAboutMeObject({
                  ...aboutMeObject,
                  message_card: e.target.value,
                });
              }}
            />
          </Form.Group>
          <Form.Group controlId="AboutMessageCard">
            <Form.Label
              style={{
                marginTop: '10px',
                fontWeight: 'bolder',
                color: 'white',
              }}
            >
              Major Events
            </Form.Label>
            <Form.Control
              style={{ borderRadius: '10px', height: '100px' }}
              as="textarea"
              rows="9"
              type="text"
              value={aboutMeObject.major_events || ''}
              onChange={(e) => {
                console.log(e.target.value);
                e.stopPropagation();
                setAboutMeObject({
                  ...aboutMeObject,
                  major_events: e.target.value,
                });
              }}
            />
          </Form.Group>
        </div>
        <div
          style={{
            width: '29%',
            float: 'right',
            margin: '25px',
            paddingRight: '5%',
          }}
        >
          <Form.Group
            controlId="AboutMessage"
            style={{
              marginTop: '10px',
              fontWeight: 'bolder',
              color: 'white',
            }}
          >
            <Form.Label style={{ width: '100%' }}>
              Important people in life
            </Form.Label>
            <div id="divToReload">
              {listPeople.map((lp) => {
                console.log('lp = ', lp);
                return (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-evenly',
                      marginTop: '1rem',
                    }}
                  >
                    <div>
                      <img
                        style={{
                          width: '5rem',
                          height: '5rem',
                          objectFit: 'cover',
                          backgroundColor: '#ffffff',
                          borderRadius: '10px',
                        }}
                        src={lp.pic ? lp.pic : ''}
                      />
                    </div>

                    <div
                      style={{
                        width: '300px',
                        height: '3rem',
                        borderRadius: '10px',
                        borderColor: '#BBC7D7',
                        backgroundColor: '#BBC7D7',
                        float: 'left',
                        marginLeft: '20px',
                        textAlign: 'center',
                        marginTop: '1rem',
                      }}
                    >
                      <p style={{ color: 'white', paddingTop: '10px' }}>
                        {lp.name}
                      </p>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginTop: '1rem',
                      }}
                    >
                      <FontAwesomeIcon
                        title="Edit Person"
                        style={{
                          color: '#ffffff',
                          margin: '0.5rem',
                          cursor: 'pointer',
                        }}
                        icon={faEdit}
                        size="small"
                        onClick={(e) => {
                          setPerson(true);
                          setTa_user_id(lp.ta_people_id);
                          let temp_phone = '';
                          for (let i = 0; i < lp.phone_number.length; i++) {
                            temp_phone += lp.phone_number[i];
                            if (i === 2 || i === 5) temp_phone += '-';
                          }
                          console.log('temp_phone = ', temp_phone);
                          setTaObject({
                            ...lp,
                            phone_number: temp_phone,
                          });
                          setAddPersonName(lp.people_name);
                        }}
                      />
                      <FontAwesomeIcon
                        title="Delete Person"
                        onMouseOver={(event) => {
                          event.target.style.color = '#48D6D2';
                        }}
                        onMouseOut={(event) => {
                          event.target.style.color = '#FFFFFF';
                        }}
                        style={{
                          color: '#ffffff',
                          margin: '0.5rem',
                          cursor: 'pointer',
                        }}
                        icon={faTrashAlt}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          let body = {
                            user_id: userID,
                            ta_people_id: lp.ta_people_id,
                          };
                          axios
                            .post(BASE_URL + 'deletePeople', body)
                            .then((response) => {
                              console.log('deleting');
                              console.log(response.data);
                              toggleCalled(!called);
                            });
                        }}
                      />
                    </div>
                  </div>
                );
              })}
              <Box hidden={true}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    marginTop: '1rem',
                  }}
                >
                  <div>
                    <img
                      style={{
                        height: '5rem',
                        width: '5rem',
                        backgroundColor: '#ffffff',
                        borderRadius: '10px',
                      }}
                      src={photo}
                    />
                  </div>
                  <div
                    style={{
                      float: 'left',
                      marginLeft: '20px',
                      textAlign: 'center',
                      marginTop: '1rem',
                      marginRight: '4rem',
                    }}
                  >
                    <input
                      style={{
                        width: '280px',
                        height: '3rem',
                        borderRadius: '10px',
                        borderColor: '#BBC7D7',
                        backgroundColor: '#BBC7D7',
                      }}
                      onChange={(e) => {
                        setAddPersonName(e.target.value);
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      marginTop: '1rem',
                    }}
                  ></div>
                </div>
                <p> Change Image</p>
                <div> Upload Image from Computer </div>
                <AddIconModal photoUrl={photo} setPhotoUrl={setPhoto} />
                <div> User's Library </div>
                <Row>
                  <Button
                    style={{
                      color: 'white',
                      backgroundColor: '#889AB5',
                      border: '2px solid white',
                      borderRadius: '20px',
                      margin: '25px',
                      padding: '10px 20px ',
                    }}
                    type="submit"
                    onClick={(e) => {
                      AddPerson();
                      toggleSave(true);
                      togglePeople(!people);
                      setAddPerson(!addPerson);
                    }}
                  >
                    Save Person
                  </Button>

                  <Button
                    variant="secondary"
                    style={{
                      color: 'white',
                      backgroundColor: '#889AB5',
                      border: '2px solid white',
                      margin: '25px',
                      borderRadius: '20px',
                      padding: '10px 20px ',
                    }}
                    onClick={(e) => {
                      setAddPerson(!addPerson);
                    }}
                  >
                    Cancel
                  </Button>
                </Row>
              </Box>
              <tr style={{ width: '100%' }}>
                <div
                  style={{
                    width: '380px',
                    marginTop: '20px',
                    border: '2px solid white',
                    borderRadius: '10px',
                    float: 'left',
                    marginLeft: '20px',
                    textAlign: 'center',
                  }}
                >
                  <Button
                    style={{
                      color: 'white',
                      paddingTop: '10px',
                      backgroundColor: '#889AB5',
                      borderColor: '#889AB5',
                    }}
                    onClick={(e) => {
                      setAddPerson(!addPerson);
                      setTaObject({});
                    }}
                  >
                    Add Person +
                  </Button>
                </div>
              </tr>
            </div>
          </Form.Group>
        </div>
        {/* <hr style={{ border: '1px solid white' }} /> */}

        <div style={{ width: '100%', float: 'left' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Row>
              <Button
                style={{
                  color: 'white',
                  backgroundColor: '#889AB5',
                  border: '2px solid white',
                  borderRadius: '20px',
                  margin: '25px',
                  padding: '10px 20px ',
                }}
                type="submit"
                onClick={(e) => {
                  e.stopPropagation();
                  newInputSubmit();
                  toggleConfirmed(true);
                }}
              >
                Save Changes
              </Button>

              <Button
                variant="secondary"
                onClick={hideAboutForm}
                style={{
                  color: 'white',
                  backgroundColor: '#889AB5',
                  border: '2px solid white',
                  margin: '25px',
                  borderRadius: '20px',
                  padding: '10px 20px ',
                }}
              >
                Cancel
              </Button>
              {taList.length == 1 ? (
                <Button
                  variant="secondary"
                  onClick={() => setDeleteUser(!deleteUser)}
                  style={{
                    color: 'white',
                    backgroundColor: '#889AB5',
                    border: '2px solid white',
                    margin: '25px',
                    borderRadius: '20px',
                    padding: '10px 20px ',
                  }}
                >
                  Delete User
                </Button>
              ) : (
                <div>{console.log('listalltauser here')}</div>
              )}

              {console.log('listalltaUser', taList.length)}
              {taList.length == 1 ? (
                <div>{console.log('listalltauser here')}</div>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => setRelinquishRole(!relinquishRole)}
                  style={{
                    color: 'white',
                    backgroundColor: '#889AB5',
                    border: '2px solid white',
                    margin: '25px',
                    borderRadius: '20px',
                    padding: '10px 20px ',
                  }}
                >
                  Relinquish Advisor Role
                </Button>
              )}
            </Row>
          </div>
        </div>
        {showTimeModal && (
          <SettingPage
            closeTimeModal={hideTimeModal}
            currentTimeSetting={aboutMeObject.timeSettings || {}}
            newTimeSetting={updateTimeSetting}
          />
        )}
      </ModalBody>
    </div>
  );
}
