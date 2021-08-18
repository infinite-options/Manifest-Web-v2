import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SettingPage from '../OldManifest/SettingPage';
import {
  Form,
  Row,
  Col,
  Modal,
  Button,
  Container,
  Dropdown,
  DropdownButton,
  FormLabel,
  ModalBody,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faTemperatureHigh } from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';
import DatePicker from 'react-datepicker';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Input, TextField } from '@material-ui/core';
import MiniNavigation from '../miniNavigation'
import LoginContext from '../../LoginContext'
import { useHistory, Redirect } from 'react-router-dom';

const useStyles = makeStyles({
  table: {
    width: 100,
  },
  formGroupTitle: {
    margin: '20px 0',
    color: 'white',
  },
  formGroupItem: {
    borderRadius: '10px',
    border: '1px solid #889AB5',
    width: '250px',
    height: '38px',
    margin: '5px 0',
  },
});



export default function AboutModal(props) {
  const classes = useStyles();
  //states
  const [imageChanged, setImageChanged] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);
  const [enableDropDown, setEnableDropDown] = useState(false);
  const [url, setUrl] = useState('');
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

  if (
    document.cookie
      .split(";")
      .some(item => item.trim().startsWith("ta_uid="))
  ) {
    console.log(document.cookie.split('; ').find(row => row.startsWith('ta_uid=')).split('=')[1])
  } else {
    history.push('/')
  }

  const [motivation0 , setMotivation0] = useState('')
  const [motivation1 , setMotivation1] = useState('')
  const [motivation2 , setMotivation2] = useState('')
  const [motivation3 , setMotivation3] = useState('')
  const [motivation4 , setMotivation4] = useState('')

  const [feelings0 , setFeelings0] = useState('')
  const [feelings1 , setFeelings1] = useState('')
  const [feelings2 , setFeelings2] = useState('')
  const [feelings3 , setFeelings3] = useState('')
  const [feelings4 , setFeelings4] = useState('')

  const [happy0 , setHappy0] = useState('')
  const [happy1 , setHappy1] = useState('')
  const [happy2 , setHappy2] = useState('')
  const [happy3 , setHappy3] = useState('')
  const [happy4 , setHappy4] = useState('')

  const loginContext = useContext(LoginContext);
  const userID = loginContext.loginState.curUser;
  //const userID = document.cookie.split('; ').find(row => row.startsWith('ta_uid=')).split('=')[1];

  // if (document.cookie
  //   .split(";")
  //   .some(item => item.trim().startsWith("ta_uid="))
  //   ) {
  //     userID = document.cookie.split('; ').find(row => row.startsWith('ta_uid=')).split('=')[1]
  //     console.log('userID', userID)
  //   }

  function grabFireBaseAboutMeData() {
    let url =
      'https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/aboutme/';
    console.log(userID)
    axios
      .get(url + userID) //this.props.theCurrentUserId)
      .then((response) => {
        if (response.data.result.length !== 0) {
          console.log(response)
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
        } else {
          console.log('No user details');
        }
      })
      .catch((err) => {
        console.log('Error getting user details', err);
      });
      console.log('check userID')
      console.log(userID)
    axios
      .get("https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/motivation/" + userID)
      .then((response) => {
        console.log('motivation')
        console.log(JSON.parse(response.data.result[0].options))
        //var temp = ["", "", "", "", ""]
        if (JSON.parse(response.data.result[0].options) != null) {
          for (let i = 0; i < JSON.parse(response.data.result[0].options).length; i++) {
            switch(i){
              case 0:
                setMotivation0(JSON.parse(response.data.result[0].options)[i])
                break;
              case 1:
                setMotivation1(JSON.parse(response.data.result[0].options)[i])
                break;
              case 2:
                setMotivation2(JSON.parse(response.data.result[0].options)[i])
                break;
              case 3:
                setMotivation3(JSON.parse(response.data.result[0].options)[i])
                break;
              case 4:
                setMotivation4(JSON.parse(response.data.result[0].options)[i])
                break;
                                  
            }
          }
        }
        
      })
      .catch((err) => {
        console.log('Error getting user details', err);
      });
    axios
      .get("https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/important/" + userID)
      .then((response) => {
        console.log('feelings')
        //console.log(JSON.parse(response.data.result[0].options))
        //var temp = ["", "", "", "", ""]
        if (JSON.parse(response.data.result[0].options) != null) {
          for (let i = 0; i < JSON.parse(response.data.result[0].options).length; i++) {
            switch(i){
              case 0:
                setFeelings0(JSON.parse(response.data.result[0].options)[i])
                break;
              case 1:
                setFeelings1(JSON.parse(response.data.result[0].options)[i])
                break;
              case 2:
                setFeelings2(JSON.parse(response.data.result[0].options)[i])
                break;
              case 3:
                setFeelings3(JSON.parse(response.data.result[0].options)[i])
                break;
              case 4:
                setFeelings4(JSON.parse(response.data.result[0].options)[i])
                break;            
            }
          }
        }
      })
      .catch((err) => {
        console.log('Error getting user details', err);
      });
    axios
      .get("https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/happy/" + userID)
      .then((response) => {
        console.log('motivation')
        console.log(JSON.parse(response.data.result[0].options))
        //var temp = ["", "", "", "", ""]
        if (JSON.parse(response.data.result[0].options) != null) {
          for (let i = 0; i < JSON.parse(response.data.result[0].options).length; i++) {
            switch(i){
              case 0:
                setHappy0(JSON.parse(response.data.result[0].options)[i])
                break;
              case 1:
                setHappy1(JSON.parse(response.data.result[0].options)[i])
                break;
              case 2:
                setHappy2(JSON.parse(response.data.result[0].options)[i])
                break;
              case 3:
                setHappy3(JSON.parse(response.data.result[0].options)[i])
                break;
              case 4:
                setHappy4(JSON.parse(response.data.result[0].options)[i])
                break; 
                                  
            }
          }
        }
      })
      .catch((err) => {
        console.log('Error getting user details', err);
      });
  }

  function handleFileSelected(event) {
    event.preventDefault();
    event.stopPropagation();

    const file = event.target.files[0]; //stores file uploaded in file
    console.log(file);

    setSaveButtonEnabled(false);
    setImageChanged(true);

    let targetFile = file;
    if (targetFile !== null && Object.keys(aboutMeObject).length !== 0) {
      setAboutMeObject((prevState) => ({
        ...prevState,
        have_pic: true,
        pic: file,
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
  }

  function componentDidMount() {
    grabFireBaseAboutMeData();
  }

  useEffect(() => {
    setMotivation0('')
    setMotivation1('')
    setMotivation2('')
    setMotivation3('')
    setMotivation4('')

    setFeelings0('')
    setFeelings1('')
    setFeelings2('')
    setFeelings3('')
    setFeelings4('')

    setHappy0('')
    setHappy1('')
    setHappy2('')
    setHappy3('')
    setHappy4('')

    grabFireBaseAboutMeData()

    axios.get("https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/usersOfTA/" + document.cookie.split('; ').find(row => row.startsWith('ta_email=')).split('=')[1])
      .then((response) =>{
          console.log(response);
          if (response.result !== false){
            const usersOfTA = response.data.result;
            const curUserID = usersOfTA[0].user_unique_id;
            // console.log('pog', loginContext.loginState.curUser)
            if (loginContext.loginState.curUser == '') {
              // edge case on refresh
              loginContext.setLoginState({
                ...loginContext.loginState,
                usersOfTA: response.data.result,
                curUser: curUserID
              })
            } else {
              loginContext.setLoginState({
                ...loginContext.loginState,
                usersOfTA: response.data.result,
                //curUser: curUserID
              })
            }
            
            console.log(curUserID);
            // setUserID(curUserID);
            // console.log(userID);
            //GrabFireBaseRoutinesGoalsData();
            // return userID;
          }
          else{console.log("No User Found");}
      })
      .catch((error) => {
          console.log(error);
      });
  }, [userID])

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
      picture: aboutMeObject.pic,
      timeSettings: aboutMeObject.timeSettings,
      history: aboutMeObject.history,
      major_events: aboutMeObject.major_events,
      phone_number: aboutMeObject.phone_number,
      birth_date: aboutMeObject.birth_date
    };
    console.log('body', body);
    if (aboutMeObject.phone_number === 'undefined') {
      body.phone_number = '';
    } else {
      body.phone_number = aboutMeObject.phone_number;
    }
    if (aboutMeObject.birth_date_change) {
      console.log('hi')
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

    let url =
      'https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/updateAboutMe';

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
    for (let value of formData.values()) {
      console.log(value);
    }
    axios
      .post(url, formData)
      .then((response) => {
        console.log(response);
        // this.hideAboutForm();

        if (imageChanged) {
          props.updateProfilePic(body.first_name + ' ' + body.last_name, url);
        } else {
          props.updateProfilePic(
            body.first_name + ' ' + body.last_name,
            aboutMeObject.pic
          );
        }
        props.updateProfileTimeZone(aboutMeObject.timeSettings['timeZone']);
      })
      .catch((err) => {
        console.log('Error updating Details', err);
      });

    let motivationJSON = {
      user_id: userID,
      motivation: [motivation0, motivation1, motivation2, motivation3, motivation4]
    }
    
    console.log(motivationJSON)

    axios
      .post('https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/updateMotivation', motivationJSON)
      .then(response => {
        console.log(response)
      })

    let importantJSON = {
      user_id: userID,
      important: [feelings0, feelings1, feelings2, feelings3, feelings4]
    }

    console.log(importantJSON)
  
    axios
      .post('https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/updateImportant', importantJSON)
      .then(response => {
        console.log(response)
      })

    let happyJSON = {
      user_id: userID,
      happy: [happy0, happy1, happy2, happy3, happy4]
    }
  
    console.log(happyJSON)
  
    axios
      .post('https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/updateHappy', happyJSON)
      .then(response => {
        console.log(response)
      })

  }





  function startTimePicker() {
    return (
      <DatePicker
        className="form-control"
        type="text"
        placeholder="Enter Birth Date"
        selected={aboutMeObject.birth_date}
        onChange={(date) => {
          console.log(date)
          setAboutMeObject({
            ...aboutMeObject,
            birth_date: date
          })
        }}
        dateFormat="MMMM d, yyyy"
      />
    );
  }

  function ToggleShowEditRoutine() {
    // history.push('/main');
  }

  function ToggleShowAbout() {
    // history.push('/about');
  }

  // grabFireBaseAboutMeData()
  console.log(aboutMeObject)

  return (
    <div>
      <div style={{height: '3px'}}></div>
      <div backgroundColor="#bbc8d7">
        <MiniNavigation/>
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
            width: '70%',
            float: 'left',
            //margin: '25px',
            paddingRight: '5%',
            
          }}
        >
          <div style={{width:'47.5%', float: 'left', marginRight: '2.5%'}}>
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
              <Row style={{width: '100%'}}>
                <Col style={{ color: 'white', width: '50%'}}>
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
                    Upload from Computer
                  </div>
                  <div
                    style={{
                      fontSize: '16px',
                      textDecoration: 'underline',
                    }}
                  >
                    User's library
                  </div>
                </Col>
                <Col style={{ color: 'white', width: '50%'}}>
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
                        width: '100px',
                        height: '100px',
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
                        width: '100px',
                        height: '100px',
                        marginBottom: '15px',
                      }}
                      src={aboutMeObject.pic}
                      alt="Profile"
                    />
                  )}
                </Col>
                <Col >
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
                </Col>
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
                      console.log(date.target.value)
                      setAboutMeObject({
                        ...aboutMeObject,
                        birth_date: date.target.value,
                        birth_date_change: true,
                      })
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
              <Form.Label>Time Settings</Form.Label>
              <Form.Control
                style={{ borderRadius: '10px' }}
                type="text"
                rows="4"
                type="text"
                //placeholder="(GMT-08:00) Pacific Time"
                value={aboutMeObject.timeSettings.timeZone || ''}
                onChange={(e) => {
                  e.stopPropagation();
                  setAboutMeObject((prevState) => ({
                    ...prevState,
                    message_card: e.target.value,
                    timeSettings: {
                      ...prevState.timeSettings,
                    },
                  }));
                }}
              />
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
                    onChange = {(e) => setAboutMeObject({
                      ...aboutMeObject,
                      timeSettings: {
                        ...aboutMeObject.timeSettings,
                        morning: e.target.value
                      }
                    })}
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
                    onChange = {(e) => setAboutMeObject({
                      ...aboutMeObject,
                      timeSettings: {
                        ...aboutMeObject.timeSettings,
                        afternoon: e.target.value
                      }
                    })}
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
                    onChange = {(e) => setAboutMeObject({
                      ...aboutMeObject,
                      timeSettings: {
                        ...aboutMeObject.timeSettings,
                        evening: e.target.value
                      }
                    })}
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
                    onChange = {(e) => setAboutMeObject({
                      ...aboutMeObject,
                      timeSettings: {
                        ...aboutMeObject.timeSettings,
                        night: e.target.value
                      }
                    })}
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
                    onChange = {(e) => setAboutMeObject({
                      ...aboutMeObject,
                      timeSettings: {
                        ...aboutMeObject.timeSettings,
                        dayStart: e.target.value
                      }
                    })}
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
                    onChange = {(e) => setAboutMeObject({
                      ...aboutMeObject,
                      timeSettings: {
                        ...aboutMeObject.timeSettings,
                        dayEnd: e.target.value
                      }
                    })}
                  ></input>
                </td>
              </tr>
            </table>

           
          
          </div>

          <div style={{width:'47.5%', float: 'left', marginLeft: '2.5%'}}>
            <Form.Group
              controlId="AboutMessage"
              style={{
                marginTop: '10px',
                fontWeight: 'bolder',
                color: 'white',
              }}
            >
              <Form.Label>Medication</Form.Label>
              <Form.Control
                style={{ borderRadius: '10px' }}
                as="textarea"
                rows="12"
                type="text"
                value={aboutMeObject.message_day || ""}
                onChange={(e) => {
                  console.log(e.target.value)
                  e.stopPropagation();
                  setAboutMeObject({
                    ...aboutMeObject,
                    message_day: e.target.value
                  }
                    
                  );
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
                Medication Schedule
              </Form.Label>
              <Form.Control
                style={{ borderRadius: '10px' }}
                as="textarea"
                rows="12"
                type="text"
                value={aboutMeObject.message_card || ''}
                onChange={(e) => {
                  console.log(e.target.value)
                  e.stopPropagation();
                  setAboutMeObject({
                    ...aboutMeObject,
                    message_card: e.target.value
                  }
                    
                  );
                }}
              />
            </Form.Group>
          </div>

          
          <table style={{ marginLeft: '20px', width: '100%', paddingTop: '40px'}}>
              <tr style={{ margin: '20px' }}>
                <th className={classes.formGroupTitle}>What motivates you?</th>
                <th className={classes.formGroupTitle}>
                  What’s important to you?
                </th>
                <th className={classes.formGroupTitle}>What makes you happy?</th>
              </tr>
              <tr style={{ margin: '20px' }}>
                <td>
                  <input className={classes.formGroupItem}
                    value={motivation0 || ''}
                    onChange={(e) => {
                      //motivationArrayTemp = motivationArray
                      // motivationArrayTemp[0] = e.target.value
                      // console.log(motivationArrayTemp)
                      // setMotivationArray(motivationArrayTemp)
                      setMotivation0(e.target.value)
                    }}
                  ></input>
                </td>
                <td>
                  <input className={classes.formGroupItem}
                    value={feelings0 || ''}
                    onChange={(e) => {
                      //motivationArrayTemp = motivationArray
                      // motivationArrayTemp[0] = e.target.value
                      // console.log(motivationArrayTemp)
                      // setMotivationArray(motivationArrayTemp)
                      setFeelings0(e.target.value)
                    }}
                  ></input>
                </td>
                <td>
                  <input className={classes.formGroupItem}
                    value={happy0 || ''}
                    onChange={(e) => {
                      //motivationArrayTemp = motivationArray
                      // motivationArrayTemp[0] = e.target.value
                      // console.log(motivationArrayTemp)
                      // setMotivationArray(motivationArrayTemp)
                      setHappy0(e.target.value)
                    }}
                  ></input>
                </td>
              </tr>
              <tr style={{ margin: '20px' }}>
                <td>
                  <input className={classes.formGroupItem}
                    value={motivation1 || ''}
                    onChange={(e) => {
                      setMotivation1(e.target.value)
                    }}
                  ></input>
                </td>
                <td>
                  <input className={classes.formGroupItem}
                    value={feelings1 || ''}
                    onChange={(e) => {
                      setFeelings1(e.target.value)
                    }}
                  ></input>
                </td>
                <td>
                  <input className={classes.formGroupItem}
                    value={happy1 || ''}
                    onChange={(e) => {
                      setHappy1(e.target.value)
                    }}
                  ></input>
                </td>
              </tr>
              <tr style={{ margin: '20px' }}>
                <td>
                  <input className={classes.formGroupItem}
                    value={motivation2 || ''}
                    onChange={(e) => {
                      setMotivation2(e.target.value)
                    }}
                  ></input>
                </td>
                <td>
                  <input className={classes.formGroupItem}
                    value={feelings2 || ''}
                    onChange={(e) => {
                      setFeelings2(e.target.value)
                    }}
                  ></input>
                </td>
                <td>
                  <input className={classes.formGroupItem}
                    value={happy2 || ''}
                    onChange={(e) => {
                      setHappy2(e.target.value)
                    }}
                  ></input>
                </td>
              </tr>
              <tr style={{ margin: '20px' }}>
                <td>
                  <input className={classes.formGroupItem}
                    value={motivation3 || ''}
                    onChange={(e) => {
                      setMotivation3(e.target.value)
                    }}
                  ></input>
                </td>
                <td>
                  <input className={classes.formGroupItem}
                    value={feelings3 || ''}
                    onChange={(e) => {
                      setFeelings3(e.target.value)
                    }}
                  ></input>
                </td>
                <td>
                  <input className={classes.formGroupItem}
                    value={happy3 || ''}
                    onChange={(e) => {
                      setHappy3(e.target.value)
                    }}
                  ></input>
                </td>
              </tr>
              <tr style={{ margin: '20px' }}>
                <td>
                  <input className={classes.formGroupItem}
                    value={motivation4 || ''}
                    onChange={(e) => {
                      setMotivation4(e.target.value)
                    }}
                  ></input>
                </td>
                <td>
                  <input className={classes.formGroupItem}
                    value={feelings4 || ''}
                    onChange={(e) => {
                      setFeelings4(e.target.value)
                    }}
                  ></input>
                </td>
                <td>
                  <input className={classes.formGroupItem}
                    value={happy4 || ''}
                    onChange={(e) => {
                      setHappy4(e.target.value)
                    }}
                  ></input>
                </td>
              </tr>
            </table>
          


        </div>
        {/* <div
          style={{
            width: '29%',
            float: 'left',
            margin: '25px',
            paddingRight: '10%',
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
            <Form.Label>Medication</Form.Label>
            <Form.Control
              style={{ borderRadius: '10px' }}
              as="textarea"
              rows="4"
              type="text"
              value={aboutMeObject.message_day || ""}
              onChange={(e) => {
                console.log(e.target.value)
                e.stopPropagation();
                setAboutMeObject({
                  ...aboutMeObject,
                  message_day: e.target.value
                }
                  
                );
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
              Medication Schedule
            </Form.Label>
            <Form.Control
              style={{ borderRadius: '10px' }}
              as="textarea"
              rows="4"
              type="text"
              value={aboutMeObject.message_card || ''}
              onChange={(e) => {
                console.log(e.target.value)
                e.stopPropagation();
                setAboutMeObject({
                  ...aboutMeObject,
                  message_card: e.target.value
                }
                  
                );
              }}
            />
          </Form.Group>
          
        </div> */}
        <div
          style={{
            width: '29%',
            float: 'left',
            //margin: '25px',
            paddingRight: '10%',
            //border: 'solid',
            // height: '2000px'
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
            <Form.Label style={{ width: '100%', }}>
              Important people in life
            </Form.Label>
            <table style={{ width: '100%' }}>
              <tr>
                <div
                  style={{
                    height: '77px',
                    width: '77px',
                    borderRadius: '10px',
                    backgroundColor: 'white',
                    float: 'left',
                  }}
                ></div>
                <div
                  style={{
                    width: '300px',
                    borderRadius: '10px',
                    backgroundColor: '#BBC7D7',
                    float: 'left',
                    marginLeft: '20px',
                    textAlign: 'center',
                    marginTop: '10px',
                  }}
                >
                  <p style={{ color: 'white', paddingTop: '10px' }}>Name</p>
                </div>
              </tr>
              <tr style={{ width: '100%' }}>
                <div
                  style={{
                    height: '77px',
                    width: '77px',
                    borderRadius: '10px',
                    backgroundColor: 'white',
                    float: 'left',
                    marginTop: '20px',
                  }}
                ></div>
                <div
                  style={{
                    width: '300px',
                    marginTop: '30px',
                    borderRadius: '10px',
                    backgroundColor: '#BBC7D7',
                    float: 'left',
                    marginLeft: '20px',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ color: 'white', paddingTop: '10px' }}>Name</p>
                </div>
              </tr>
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
                  <p style={{ color: 'white', paddingTop: '10px' }}>
                    Add Person
                  </p>
                </div>
              </tr>
            </table>
          </Form.Group>
        </div>
        <div></div>
        {/* <hr style={{ border: '1px solid white' }} /> */}
        {/* <div >
          <table style={{ marginLeft: '20px', width: '66%' }}>
            <tr style={{ margin: '20px' }}>
              <th className={classes.formGroupTitle}>What motivates you?</th>
              <th className={classes.formGroupTitle}>
                What’s important to you?
              </th>
              <th className={classes.formGroupTitle}>What makes you happy?</th>
            </tr>
            <tr style={{ margin: '20px' }}>
              <td>
                <input className={classes.formGroupItem}
                  value={motivation0 || ''}
                  onChange={(e) => {
                    //motivationArrayTemp = motivationArray
                    // motivationArrayTemp[0] = e.target.value
                    // console.log(motivationArrayTemp)
                    // setMotivationArray(motivationArrayTemp)
                    setMotivation0(e.target.value)
                  }}
                ></input>
              </td>
              <td>
                <input className={classes.formGroupItem}
                  value={feelings0 || ''}
                  onChange={(e) => {
                    //motivationArrayTemp = motivationArray
                    // motivationArrayTemp[0] = e.target.value
                    // console.log(motivationArrayTemp)
                    // setMotivationArray(motivationArrayTemp)
                    setFeelings0(e.target.value)
                  }}
                ></input>
              </td>
              <td>
                <input className={classes.formGroupItem}
                  value={happy0 || ''}
                  onChange={(e) => {
                    //motivationArrayTemp = motivationArray
                    // motivationArrayTemp[0] = e.target.value
                    // console.log(motivationArrayTemp)
                    // setMotivationArray(motivationArrayTemp)
                    setHappy0(e.target.value)
                  }}
                ></input>
              </td>
            </tr>
            <tr style={{ margin: '20px' }}>
              <td>
                <input className={classes.formGroupItem}
                  value={motivation1 || ''}
                  onChange={(e) => {
                    setMotivation1(e.target.value)
                  }}
                ></input>
              </td>
              <td>
                <input className={classes.formGroupItem}
                  value={feelings1 || ''}
                  onChange={(e) => {
                    setFeelings1(e.target.value)
                  }}
                ></input>
              </td>
              <td>
                <input className={classes.formGroupItem}
                  value={happy1 || ''}
                  onChange={(e) => {
                    setHappy1(e.target.value)
                  }}
                ></input>
              </td>
            </tr>
            <tr style={{ margin: '20px' }}>
              <td>
                <input className={classes.formGroupItem}
                  value={motivation2 || ''}
                  onChange={(e) => {
                    setMotivation2(e.target.value)
                  }}
                ></input>
              </td>
              <td>
                <input className={classes.formGroupItem}
                  value={feelings2 || ''}
                  onChange={(e) => {
                    setFeelings2(e.target.value)
                  }}
                ></input>
              </td>
              <td>
                <input className={classes.formGroupItem}
                  value={happy2 || ''}
                  onChange={(e) => {
                    setHappy2(e.target.value)
                  }}
                ></input>
              </td>
            </tr>
            <tr style={{ margin: '20px' }}>
              <td>
                <input className={classes.formGroupItem}
                  value={motivation3 || ''}
                  onChange={(e) => {
                    setMotivation3(e.target.value)
                  }}
                ></input>
              </td>
              <td>
                <input className={classes.formGroupItem}
                  value={feelings3 || ''}
                  onChange={(e) => {
                    setFeelings3(e.target.value)
                  }}
                ></input>
              </td>
              <td>
                <input className={classes.formGroupItem}
                  value={happy3 || ''}
                  onChange={(e) => {
                    setHappy3(e.target.value)
                  }}
                ></input>
              </td>
            </tr>
            <tr style={{ margin: '20px' }}>
              <td>
                <input className={classes.formGroupItem}
                  value={motivation4 || ''}
                  onChange={(e) => {
                    setMotivation4(e.target.value)
                  }}
                ></input>
              </td>
              <td>
                <input className={classes.formGroupItem}
                  value={feelings4 || ''}
                  onChange={(e) => {
                    setFeelings4(e.target.value)
                  }}
                ></input>
              </td>
              <td>
                <input className={classes.formGroupItem}
                  value={happy4 || ''}
                  onChange={(e) => {
                    setHappy4(e.target.value)
                  }}
                ></input>
              </td>
            </tr>
          </table>
        </div> */}
        <div style={{ width: '100%', float: 'left',}}>
          <div style={{ marginLeft: '40%' }}>
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