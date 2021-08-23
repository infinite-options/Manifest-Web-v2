import React, { useState, useEffect, useContext } from 'react';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SettingPage from '../Home/SettingPage';
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
import { faImage, faTemperatureHigh,faEdit } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Input, TextField } from '@material-ui/core';
import MiniNavigation from '../miniNavigation'
import LoginContext from '../../LoginContext'
import { useHistory, Redirect } from 'react-router-dom';
import AddIconModal from '../../Home/AddIconModal';
import UploadImage from '../../Home/UploadImage';
const BASE_URL = process.env.REACT_APP_BASE_URL;

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
    width: '300px',
    height: '38px',
    marginRight: '2rem',
    marginTop:'1rem'
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
  const [addPerson, setAddPerson] = useState(false);
  const [addPersonName, setAddPersonName] = useState('');
  const [ta_user_id, setTa_user_id] = useState('');
  const [url, setUrl] = useState('');
  const [photo, setPhoto] = useState('')
  const [showConfirmed, toggleConfirmed] = useState(false);
  const [called, toggleCalled] = useState(false)
  const [saveConfirm, toggleSave] = useState(false);
  const [editPerson, setPerson] =useState(false)
  const [taObject, setTaObject] = useState({})
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

  const[listPeople, setListPeople] = useState([])
  const[people, togglePeople] = useState(false)
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
       console.log('userID', userID)
       console.log('ta_user_id', ta_user_id)
       console.log('taObject', taObject)

  useEffect(()=> {
      axios
        .get(
          BASE_URL + 'listPeople/' + userID )
          .then((response) => {
          console.log("listPeople",response.data.result.result);
          setListPeople(response.data.result.result)
        })
        .catch((error) => {
          console.log(error);
        });
  }, [firstName,called,people]);
    


  function grabFireBaseAboutMeData() {
    let url =
      BASE_URL + 'aboutme/';
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
      .get(BASE_URL + "motivation/" + userID)
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
      .get(BASE_URL + "important/" + userID)
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
      .get(BASE_URL + "happy/" + userID)
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

    axios.get(BASE_URL + "usersOfTA/" + document.cookie.split('; ').find(row => row.startsWith('ta_email=')).split('=')[1])
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
      .post(BASE_URL + "updateAboutMe", formData)
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
      .post(BASE_URL + 'updateMotivation', motivationJSON)
      .then(response => {
        console.log(response)
      })

    let importantJSON = {
      user_id: userID,
      important: [feelings0, feelings1, feelings2, feelings3, feelings4]
    }

    console.log(importantJSON)
  
    axios
      .post(BASE_URL + 'updateImportant', importantJSON)
      .then(response => {
        console.log(response)
      })

    let happyJSON = {
      user_id: userID,
      happy: [happy0, happy1, happy2, happy3, happy4]
    }
  
    console.log(happyJSON)
  
    axios
      .post(BASE_URL + 'updateHappy', happyJSON)
      .then(response => {
        console.log(response)
      })

  }


  // grabFireBaseAboutMeData()
  console.log(aboutMeObject)

  var selectedTAid = ""
  function AddPerson(){
   
    let body = {
      user_id : userID,
      //ta_people_id: selectedTAid,
      name: addPersonName,
      relationship: "",
      important:"TRUE",
      picture: "",
      photo_url:photo,
    }
    console.log("addPerson", body)
    let formData = new FormData();
    Object.entries(body).forEach(entry => {
      // if (typeof entry[1].name == 'string'){
      if (typeof entry[1] == 'string'){
          formData.append(entry[0], entry[1]);
      }
      else if (entry[1] instanceof Object) {
          entry[1] = JSON.stringify(entry[1])
          formData.append(entry[0], entry[1]);
      }
      
      else{
          formData.append(entry[0], entry[1]);
      }
  });
    axios
    .post(BASE_URL + 'addPeople' , formData)
      .then((response) => {
      console.log('addPeople',response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  } 

  function UpdatePerson(){
    /* if (
      document.cookie
        .split(";")
        .some(item => item.trim().startsWith("ta_uid="))
    ) {
      selectedTAid = document.cookie.split('; ').find(row => row.startsWith('ta_uid=')).split('=')[1]
    } else {
    } */

    let body = {
      user_id : userID,
      ta_id:'',
      ta_people_id: ta_user_id,
      people_name: taObject.name,
      people_relationship: taObject.relationship,
      people_phone_number: taObject.phone_number,
      people_employer:taObject.employer,
      people_email: taObject.email,
      people_important:"True",
      people_have_pic:'False',
      people_pic: "",
      photo_url:photo,
    }
    console.log("updatePerson", body)
    if (taObject.phone_number === 'undefined') {
      body.phone_number = '';
    } else {
      body.phone_number = taObject.phone_number;
    }
    let formData = new FormData();
    Object.entries(body).forEach(entry => {
      // if (typeof entry[1].name == 'string'){
      if (typeof entry[1] == 'string'){
          formData.append(entry[0], entry[1]);
      }
      else if (entry[1] instanceof Object) {
          entry[1] = JSON.stringify(entry[1])
          formData.append(entry[0], entry[1]);
      }
      
      else{
          formData.append(entry[0], entry[1]);
      }
  });
    axios
    .post(
      BASE_URL + 'updatePeople' , formData)
      .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  } 

  const editPersonModal = (taObject) => {
    if (editPerson) {
      return (
        <div
          style={{
            height: "100%",
            width: "100%",
            zIndex: "101",
            left: "0",
            top: "0",
            overflow: "auto",
            position: "fixed",
            display: "grid",
            backgroundColor: 'rgba(255, 255, 255, 0.5)'
          }}
        >
          <div
            style={{
              position: "relative",
              justifySelf: "center",
              alignSelf: "center",
              display: "block",
              backgroundColor: "#889AB5",
              width: "400px",
              // height: "100px",
              color: "white",
              padding: "40px"
            }}
          >
            <div style={{textAlign: 'center', marginBottom: '20px'}}>Person Info </div>
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
                    console.log(e.target.value)
                    setTaObject({
                      ...taObject,
                      name: e.target.value,
                    })
                  }}
                />
              </Col>
            </Row>
           
            <br />
            <div style={{ fontWeight: 'bold', marginTop: '10px' }}>
              Change Icon
            </div>
            <div style={{ textAlign: 'left', float:'left', marginTop: '1rem',width:'100%' }}>
            <Row >
              <Col style={{ textDecoration:'underline', paddingLeft:'0', marginLeft:'0', width:'70%'}}>
              <div style={{ marginBottom: '8px',  fontSize: '14px', }}>
                  Add icon to library
              </div>
              <div style={{ paddingLeft:'0', marginLeft:'-1rem'}}>
                <UploadImage 
                  photoUrl={photo}
                  setPhotoUrl={setPhoto}
                  currentUserId={props.CurrentId} /> 
              </div>
              <div style={{ paddingLeft:'0', marginLeft:'-1rem'}}>
                <AddIconModal
                  photoUrl = {photo}
                  setPhotoUrl = {setPhoto}
                />
              </div>
              
              </Col>
              <Col>
                <div  style={{ marginLeft: '1rem' }}>
                <img style={{height:'5rem', width:'5rem',backgroundColor:'#ffffff', borderRadius:'10px'}} src={photo}/> 
              </div> 
              </Col>
            </Row>
            </div>
            
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
                  Relationship
                </label>
                <Form.Control
                  type="text"
                  value={taObject.relationship}
                  placeholder="Enter relationship"
                  onChange={(e) => {
                    console.log(e.target.value)
                    setTaObject({
                      ...taObject,
                      relationship: e.target.value,
                    })
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
                  Phone Number
                </label>
                <Form.Control
                  type="phone"
                  value={taObject.phone_number}
                  placeholder="Enter phone number"
                  onChange={(e) => {
                    console.log(e.target.value)
                    setTaObject({
                      ...taObject,
                      phone_number: e.target.value,
                    })
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
                    console.log(e.target.value)
                    setTaObject({
                      ...taObject,
                      email: e.target.value,
                    })
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
                    console.log(e.target.value)
                    setTaObject({
                      ...taObject,
                      employer: e.target.value,
                    })
                  }}
                />
               
              </Col>
            </Row>
          </Form.Group>
            <div>
              <button style = {{
                backgroundColor: "#FF6B4A",
                color: 'white',
                border: 'solid',
                borderWidth: '2px',
                borderRadius: '25px',
                width: '30%',
                marginLeft: "5%",
                marginRight: "10%"
              }}
              onClick = {() => {
                setPerson(false)
              }}
              >
                Cancel
              </button>
              <button style = {{
                backgroundColor: "#51CC4E",
                color: 'white',
                border: 'solid',
                borderWidth: '2px',
                borderRadius: '25px',
                width: '40%',
                marginLeft: "10%",
                marginRight: "5%"
              }}
              onClick = {() => {
                UpdatePerson();
                toggleConfirmed(true)
                setPerson(false)
              }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }
  

  const confirmedModal = () => {
    if (showConfirmed) {
      return (
        <div
          style={{
            height: "100%",
            width: "100%",
            zIndex: "101",
            left: "0",
            top: "0",
            overflow: "auto",
            position: "fixed",
            display: "grid",
            backgroundColor: 'rgba(255, 255, 255, 0.5)'
          }}
        >
          <div
            style={{
              position: "relative",
              justifySelf: "center",
              alignSelf: "center",
              display: "block",
              backgroundColor: "#889AB5",
              width: "400px",
              // height: "100px",
              color: "white",
              padding: "40px"
            }}
          >
            <div style={{textAlign: 'center', marginBottom: '20px'}}>Changes saved</div>
            <div style={{textAlign: 'center', marginBottom: '20px'}}>User's about me changes have been saved.</div>
            <div style={{textAlign: 'center'}}>
              <button style = {{
                backgroundColor: "#889AB5",
                color: 'white',
                border: 'solid',
                borderWidth: '2px',
                borderRadius: '25px',
                width: '30%',
                marginLeft: "10%",
                marginRight: "10%"
              }}
              onClick = {() => {
                toggleConfirmed(false)
              }}
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }
  const confirmSaveModal = () => {
    if (saveConfirm) {
      return (
        <div
          style={{
            height: "100%",
            width: "100%",
            zIndex: "101",
            left: "0",
            top: "0",
            overflow: "auto",
            position: "fixed",
            display: "grid",
            backgroundColor: 'rgba(255, 255, 255, 0.5)'
          }}
        >
          <div
            style={{
              position: "relative",
              justifySelf: "center",
              alignSelf: "center",
              display: "block",
              backgroundColor: "#889AB5",
              width: "400px",
              // height: "100px",
              color: "white",
              padding: "40px"
            }}
          >
            <div style={{textAlign: 'center', marginBottom: '20px'}}>Save Person</div>
            <div style={{textAlign: 'center', marginBottom: '20px'}}>Person added to the important people list.</div>
            <div style={{textAlign: 'center'}}>
              <button style = {{
                backgroundColor: "#889AB5",
                color: 'white',
                border: 'solid',
                borderWidth: '2px',
                borderRadius: '25px',
                width: '30%',
                marginLeft: "10%",
                marginRight: "10%"
              }}
              onClick = {() => {
                toggleSave(false)
              }}
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }



  return (
    <div>
      {editPersonModal(taObject)}
      {confirmedModal()}
      {confirmSaveModal()}
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
          marginTop: '10px'
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
              <Col style={{ color: 'white' }}>
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
                      width: '100%',
                      height: '70px',
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

          <div>
          <table style={{ margin:'2rem', width: '150%' }}>
            <tr style={{ marginLeft: '3rem ' }}>
              <th className={classes.formGroupTitle}>What motivates you?</th>
              <th className={classes.formGroupTitle}>
                What’s important to you?
              </th>
              <th className={classes.formGroupTitle}>What makes you happy?</th>
            </tr>
            <tr style={{ paddingRight: '20px' }}>
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
            <Form.Label>Family Contacts</Form.Label>
            <Form.Control
              style={{ borderRadius: '10px' }}
              as="textarea"
              rows="9"
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
             Current Medication 
            </Form.Label>
            <Form.Control
              style={{ borderRadius: '10px' }}
              as="textarea"
              rows="9"
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
          <Form.Group controlId="AboutMessageCard">
            <Form.Label
              style={{
                marginTop: '10px',
                fontWeight: 'bolder',
                color: 'white',
              }}
            >
              Medicine Schedule
            </Form.Label>
            <Form.Control
              style={{ borderRadius: '10px' }}
              as="textarea"
              rows="9"
              type="text"
              value={aboutMeObject.major_events || ''}
              onChange={(e) => {
                console.log(e.target.value)
                e.stopPropagation();
                setAboutMeObject({
                  ...aboutMeObject,
                  major_events: e.target.value
                }
                  
                );
              }}
            />
          </Form.Group>
        </div>
        <div
          style={{
            width: '29%',
            float: 'right',
            margin: '25px',
            paddingRight:'5%'
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
              return(
                <div style={{display:'flex', justifyContent:'space-evenly', marginTop:'1rem'}}>
                
                <div  >
                  <img style={{height:'5rem', width:'5rem', backgroundColor:'#ffffff', borderRadius:'10px'}} src={lp.pic ? lp.pic : ''}/>
                </div>
                
                <div
                  style={{
                    width: '300px',
                    height:'3rem',
                    borderRadius: '10px',
                    borderColor: '#BBC7D7',
                    backgroundColor: '#BBC7D7',
                    float: 'left',
                    marginLeft: '20px',
                    textAlign: 'center',
                    marginTop: '1rem',
                  }}
                >
                  <p style={{ color: 'white', paddingTop: '10px' }}>{lp.name}</p>
                </div>
                <div style={{ display:'flex', flexDirection:'row', marginTop: '1rem',}}>
                <FontAwesomeIcon
                  title="Edit Person"
                  style={{
                  color: "#ffffff",
                  margin: '0.5rem',
                  cursor:'pointer'
                  }}
                  icon={faEdit}
                  size="small"
                  onClick={(e) => {
                    setPerson(true);
                    setTa_user_id(lp.ta_people_id);
                    setTaObject(lp);
                    setAddPersonName(lp.people_name)
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
                  color: "#ffffff",
                  margin: '0.5rem',
                  cursor:'pointer'
                  }}
                  icon={faTrashAlt}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    let body = {
                      user_id: userID, 
                      ta_people_id: lp.ta_people_id,
                    }
                    axios
                        .post(BASE_URL + 'deletePeople', body)
                        .then(response => {
                            console.log('deleting')
                            console.log(response.data)
                            toggleCalled(!called)
                    })
                  }}
                  />
                </div>
                      
                </div>
            
            )
          })
          }
             <Box hidden={!addPerson}>
             <div style={{display:'flex', justifyContent:'space-evenly', marginTop:'1rem'}}> 
             <div>
             <img style={{height:'5rem', width:'5rem',backgroundColor:'#ffffff', borderRadius:'10px'}} src={photo}/> 
              </div> 
             <div style={{
                  float: 'left',
                  marginLeft: '20px',
                  textAlign: 'center',
                  marginTop: '1rem',
                  marginRight:'4rem'
                }}>
             <input
                style={{
                  width: '280px',
                  height:'3rem',
                  borderRadius: '10px',
                  borderColor: '#BBC7D7',
                  backgroundColor: '#BBC7D7',
               
                }} 
                onChange = {(e) => {
                setAddPersonName(e.target.value)
             }} />
             </div>
             
            
            <div style={{ display:'flex', flexDirection:'row', marginTop: '1rem',}}>
                
                </div>
                        
             </div> 
            <p> Change Image</p>
            <div> Upload Image from Computer </div> 
            <AddIconModal
              photoUrl = {photo}
              setPhotoUrl = {setPhoto}
            />
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
                  setAddPerson(!addPerson)
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
                onClick={(e)=> {
                  setAddPerson(!addPerson)
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
                  style={{ color: 'white', paddingTop: '10px', backgroundColor:'#889AB5', borderColor:'#889AB5'}}
                  onClick ={ (e) => {
                      setAddPerson(!addPerson)
                  }}>
                    Add Person +
                  </Button>
                </div>
              </tr>
              </div>
          </Form.Group>   
           
          

        </div>
        {/* <hr style={{ border: '1px solid white' }} /> */}
       
        <div style={{ width: '100%', float: 'left' }}>
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