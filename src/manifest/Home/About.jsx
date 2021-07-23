




import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import SettingPage from "../OldManifest/SettingPage";
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
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faTemperatureHigh } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import DatePicker from 'react-datepicker'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { Input, TextField } from "@material-ui/core";

const useStyles = makeStyles({
  table: {
   width:100

  },
});



class AboutModal extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
    
      imageChanged: false,
    
      aboutMeObject: {
        birth_date: new Date(),
        birth_date_change: false,
        phone_number: "",
        have_pic: false,
        message_card: "",
        message_day: "",
        history: "",
        major_events: "",
        pic: "",
        timeSettings: {
          morning: "",
          afternoon: "",
          evening: "",
          night: "",
          dayStart: "",
          dayEnd: "",
          timeZone: "",
        },
      },

      firstName: "",
      lastName: "",
      showTimeModal: false,
      saveButtonEnabled: true,
      enableDropDown: false,
      url: "",
    };
  }
  
  componentDidMount() {
    this.grabFireBaseAboutMeData();
  }

  hideAboutForm = (e) => {
    this.props.CameBackFalse();
  };

  handleFileSelected = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.target.files[0]; //stores file uploaded in file
    console.log(file);

    this.setState({
      saveButtonEnabled: false,
      imageChanged: true,
    });

    let targetFile = file;
    if (
      targetFile !== null &&
      Object.keys(this.state.aboutMeObject).length !== 0
    ) {
      let temp = this.state.aboutMeObject;
      temp.have_pic = true;
      temp.pic = file;
      this.setState({
        aboutMeObject: temp,
        saveButtonEnabled: true,
        url: URL.createObjectURL(event.target.files[0]),
      });
      console.log(this.state.url);
    }
    console.log(this.state.aboutMeObject.pic);
    console.log(event.target.files[0].name);
  };

  grabFireBaseAboutMeData = () => {
    let url = "https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/aboutme/";

    axios
      .get(url + '100-000075')//this.props.theCurrentUserId)
      .then((response) => {
        if (response.data.result.length !== 0) {
          let details = response.data.result[0];
          
          let x = {
            birth_date: Date.parse(details.user_birth_date),
            phone_number: details.user_phone_number,
            have_pic: details.user_have_pic
              ? details.user_have_pic.toLowerCase() === "true"
              : false,
            message_card: details.message_card,
            message_day: details.message_day,
            pic: details.user_picture || "",
            history: details.user_history,
            major_events: details.user_major_events,
            timeSettings: {
              morning: details.morning_time,
              afternoon: details.afternoon_time,
              evening: details.evening_time,
              night: details.night_time,
              dayStart: details.day_start,
              dayEnd: details.day_end,
              timeZone: details.time_zone
            },
          };

          this.setState({
            aboutMeObject: x,
            firstName: details.user_first_name,
            lastName: details.user_last_name,
            url: "",
          });
        } else {
          console.log("No user details");
        }
      })
      .catch((err) => {
        console.log("Error getting user details", err);
      });
  };

  hideTimeModal = () => {
    this.setState({ showTimeModal: false });
  };

  updateTimeSetting = (time) => {
    let temp = this.state.aboutMeObject;
    temp.timeSettings = time;
    this.setState({ aboutMeObject: temp, showTimeModal: false });
  };

  newInputSubmit = () => {
   
    const body = {
      user_id: "100-000075",
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      have_pic: this.state.aboutMeObject.have_pic,
      message_card: this.state.aboutMeObject.message_card,
      message_day: this.state.aboutMeObject.message_day,
      picture: this.state.aboutMeObject.pic,
      timeSettings: this.state.aboutMeObject.timeSettings,
      history: this.state.aboutMeObject.history,
      major_events: this.state.aboutMeObject.major_events,
      phone_number:this.state.aboutMeObject.phone_number
    };
    console.log("body",body)
    if(this.state.aboutMeObject.phone_number === "undefined"){
      body.phone_number = ""
    }
    else{
      body.phone_number = this.state.aboutMeObject.phone_number
    }
    if(this.state.aboutMeObject.birth_date_change){
      body.birth_date = (this.state.aboutMeObject.birth_date).toISOString()
    }
    else{
      var date = new Date(this.state.aboutMeObject.birth_date)
      body.birth_date = date;
      var br = JSON.stringify(body.birth_date)
      body.birth_date = br.substring(1, br.length-1)
      
    }

    if (typeof body.picture === "string") {
      body.photo_url = body.picture;
      body.picture = "";
    } else {
      body.photo_url = "";
    }

    let url =  "https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/updateAboutMe";

    let formData = new FormData();
    Object.entries(body).forEach((entry) => {
      if(entry[0] === 'picture'){
        if(entry[1].name !== undefined){
          if (typeof entry[1].name == "string") {
            formData.append(entry[0], entry[1]);
          }
        }
      }
      else if (entry[1] instanceof Object) {
        entry[1] = JSON.stringify(entry[1]);
        formData.append(entry[0], entry[1]);

      } 
     else {
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
     
        if(this.state.imageChanged){
          this.props.updateProfilePic(body.first_name + " " + body.last_name, this.state.url)
        }
        else{
          this.props.updateProfilePic(body.first_name + " " + body.last_name, this.state.aboutMeObject.pic)
        }
        this.props.updateProfileTimeZone(this.state.aboutMeObject.timeSettings['timeZone'])
      })
      .catch((err) => {
        console.log("Error updating Details", err);
      });
  };

  startTimePicker = () => {
    return (
      <DatePicker
        className="form-control"
        type="text"
        placeholder="Enter Birth Date"
        selected={this.state.aboutMeObject.birth_date}
        onChange={(date) => {
          let temp = this.state.aboutMeObject;
          temp.birth_date = date
          temp.birth_date_change = true
          console.log(date)
          this.setState(
            {
              aboutmeObject: temp,
            });
        }}
        dateFormat="MMMM d, yyyy"
      />
    );
  };
 
  render() {
    return (
      <div >
       
          <ModalBody style={{backgroundColor:'#889AB5',width:'100%',float:'left',marginRight:'20px'}}>
            <div style={{width:"29%",float:'left',margin:'25px'}}>
            <Form.Group>
              
              <Row>
                <Col style={{ paddingRight: "10px" }}>
                  <FormLabel style={{ marginTop: "10px", marginLeft: "10px",fontWeight:"bolder",color:"white" }}>
                    First Name:
                  </FormLabel>
               
                  <Form.Control
                    type="text"
                    placeholder="First Last"
                    value={this.state.firstName || ""}
                    onChange={(e) => {
                      e.stopPropagation();
                      this.setState({ firstName: e.target.value });
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col style={{ paddingRight: "10px" }}>
                  <label style={{ marginTop: "10px", marginLeft: "10px" ,fontWeight:"bolder",color:"white"}}>
                    Last Name:
                  </label>
               
                  <Form.Control
                    type="text"
                    placeholder="First Last"
                    value={this.state.lastName || ""}
                    onChange={(e) => {
                      e.stopPropagation();
                      this.setState({ lastName: e.target.value });
                    }}
                  />
                </Col>
              </Row>
              <Row>
              <Col>
                {this.state.aboutMeObject.have_pic === false ? (
                  <FontAwesomeIcon icon={faImage} size="6x" />
                ) : this.state.url === "" ? (
                  <img
                    style={{
                      display: "block",
                      marginLeft: "auto",
                      marginRight: "auto",
                      width: "100%",
                      height: "70px",
                      marginTop:'50px',
                      marginBottom:'50px'
                    }}
                    src={this.state.aboutMeObject.pic}
                    alt="Profile"
                  />
                ) : (
                  <img
                    style={{
                      display: "block",
                      marginLeft: "auto",
                      marginRight: "auto",
                      width: "100%",
                      height: "70px",
                      marginTop:'50px',
                      marginBottom:'50px'
                    }}
                    src={this.state.url}
                    alt="Profile"
                  />
                )}
              </Col>
              <Col xs={8}>
                <label style={{marginTop:'50px',marginBottom:'15px',color:'white',fontWeight:'bold'}}>Upload A New Image</label>
                <input
                  style={{ color: "transparent" }}
                  accept="image/*"
                  type="file"
                  onChange={this.handleFileSelected}
                  id="ProfileImage"
                />
              </Col>
            </Row>
              <Row>
                <Col style={{ paddingRight: "10px" }}>
                  <label style={{ marginTop: "10px", marginLeft: "10px",marginRight:'20px',fontWeight:"bolder",color:"white" }}>
                    Birth Date:
                  </label>
                  <Form.Control
                    type="date"
                    selected={this.state.aboutMeObject.birth_date}
        onChange={(date) => {
          let temp = this.state.aboutMeObject;
          temp.birth_date = date
          temp.birth_date_change = true
          console.log(date)
          this.setState(
            {
              aboutmeObject: temp,
            });
        }}
        dateFormat="MMMM d, yyyy"
                  />
        <DatePicker
                    
        className="form-control"
        type="text"
        placeholder="Enter Birth Date"
        selected={this.state.aboutMeObject.birth_date}
        onChange={(date) => {
          let temp = this.state.aboutMeObject;
          temp.birth_date = date
          temp.birth_date_change = true
          console.log(date)
          this.setState(
            {
              aboutmeObject: temp,
            });
        }}
        dateFormat="MMMM d, yyyy"
      />
                  {/* {this.startTimePicker()} */}
                </Col>
              </Row>
              <Row>
                <Col style={{ paddingRight: "10px" }}>
                  <label style={{ marginTop: "10px", marginLeft: "10px",fontWeight:"bolder",color:"white" }}>
                    Phone Number:
                  </label>
                  <PhoneInput
                  class= "form-control"
                  placeholder="Enter phone number"
                  value={this.state.aboutMeObject.phone_number}
                  onChange={(e) => {
                    let temp = this.state.aboutMeObject
                    temp.phone_number = e
                    this.setState(
                      {
                        aboutMeObject: temp,
                      });
                  }}/>
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
            </div>
            <div style={{width:"29%",float:'left',margin:'25px'}}>
            <Form.Group controlId="AboutMessage" style={{ marginTop: "10px" ,fontWeight:"bolder",color:"white"}}>
              <Form.Label>Medication</Form.Label>
              <Form.Control
                as="textarea"
                rows="4"
                type="text"
                
                // value={this.state.aboutMeObject.message_day || ""}
                onChange={(e) => {
                  e.stopPropagation();
                  let temp = this.state.aboutMeObject;
                  temp.message_day = e.target.value;
                  this.setState({ aboutMeObject: temp });
                }}
              />
            </Form.Group>
            <Form.Group controlId="AboutMessageCard">
              <Form.Label style={{ marginTop: "10px" ,fontWeight:"bolder",color:"white"}}>Medication Schedule</Form.Label>
              <Form.Control
                as="textarea"
                rows="4"
                type="text"
                
                value={this.state.aboutMeObject.message_card || ""}
                onChange={(e) => {
                  e.stopPropagation();
                  let temp = this.state.aboutMeObject;
                  temp.message_card = e.target.value;
                  this.setState({ aboutMeObject: temp });
                }}
              />
            </Form.Group>
            <Form.Group controlId="AboutMessage" style={{ marginTop: "10px" ,fontWeight:"bolder",color:"white"}}>
              <Form.Label style={{width:'100%'}}>Important People</Form.Label>
              <table style={{width:'100%'}}>
                <tr>
              <div style={{height:'77px',width:'77px',borderRadius:'3px',backgroundColor:'white',float:'left'}}></div>
              <div style={{width:'300px',borderRadius:'3px',backgroundColor:'#BBC7D7',float:'left',marginLeft:'20px',textAlign:'center'}}><p style={{color:'white',paddingTop:'10px'}}>Name</p></div>
              </tr>
              <tr style={{width:'100%'}}>
              <div style={{height:'77px',width:'77px',borderRadius:'3px',backgroundColor:'white',float:'left',marginTop:'20px'}}></div>
              <div style={{width:'300px',marginTop:'20px',borderRadius:'3px',backgroundColor:'#BBC7D7',float:'left',marginLeft:'20px',textAlign:'center'}}><p style={{color:'white',paddingTop:'10px'}}>Name</p></div>
              </tr>
              <tr style={{width:'100%'}}>
              
              <div style={{width:'380px',marginTop:'20px',borderRadius:'3px',backgroundColor:'#BBC7D7',float:'left',marginLeft:'20px',textAlign:'center'}}><p style={{color:'white',paddingTop:'10px'}}>Add Person</p></div>
              </tr>
              </table>
            </Form.Group>
</div>
            <div style={{width:"29%",float:'left',margin:'25px'}}>
            <Form.Group controlId="MajorEvents" style={{ marginTop: "10px" ,fontWeight:"bolder",color:"white"}}>
              <Form.Label>Time Settings</Form.Label>
              <Form.Control
                type="text"
                rows="4"
                type="text"
                placeholder="(GMT-08:00) Pacific Time"
                value={this.state.aboutMeObject.message_card || ""}
                onChange={(e) => {
                  e.stopPropagation();
                  let temp = this.state.aboutMeObject;
                  temp.message_card = e.target.value;
                  this.setState({ aboutMeObject: temp });
                }}
              />
             
            </Form.Group>
            <table>
            <tr>
              <td><p style={{marginRight:'20px',marginTop:'10px',color:"white",fontWeight:'bold'}}>Morning</p></td>
              <td><input style={{width:'100px',borderRadius:'3px',border:'1px solid #889AB5'}}></input></td>
              <td><p style={{marginRight:'20px',marginLeft:'20px',marginTop:'10px',color:"white",fontWeight:'bold'}}>Morning</p></td>
              <td><input style={{width:'100px',borderRadius:'3px',border:'1px solid #889AB5'}}></input></td>
            </tr>
            <tr>
              <td><p style={{marginRight:'20px',marginTop:'10px',color:"white",fontWeight:'bold'}}>Evening</p></td>
              <td><input style={{width:'100px',borderRadius:'3px',border:'1px solid #889AB5'}}></input></td>
              <td><p style={{marginRight:'20px',marginLeft:'20px',marginTop:'10px',color:"white",fontWeight:'bold'}}>Night</p></td>
              <td><input style={{width:'100px',borderRadius:'3px',border:'1px solid #889AB5'}}></input></td>
            </tr>
            <tr>
              <td><p style={{marginRight:'20px',marginTop:'10px',color:"white",fontWeight:'bold'}}>Day Start</p></td>
              <td><input style={{width:'100px',borderRadius:'3px',border:'1px solid #889AB5'}}></input></td>
              <td><p style={{marginRight:'20px',marginLeft:'20px',marginTop:'10px',color:"white",fontWeight:'bold'}}>Day End</p></td>
              <td><input style={{width:'100px',borderRadius:'3px',border:'1px solid #889AB5'}}></input></td>
            </tr>
            
            </table>
            {/* <Form.Group controlId="HistoryCard">
              <Form.Label style={{ marginTop: "10px" ,fontWeight:"bolder",color:"white"}}>History:</Form.Label>
              <Form.Control
                as="textarea"
                rows="4"
                type="text"
                placeholder="Please Enter Your History...."
                value={this.state.aboutMeObject.history || ""}
                onChange={(e) => {
                  e.stopPropagation();
                  let temp = this.state.aboutMeObject;
                  temp.history = e.target.value;
                  this.setState({ aboutMeObject: temp });
                }}
              />
              
            </Form.Group> */}
            </div>
            <div>
              <table style={{width:'100%'}}>
                <tr style={{margin:'20px'}}>
                <th style={{margin:'30px',color:"white"}}>
                What motivates you?
                </th>
                <th style={{margin:'20px',color:"white"}}>
                What’s important to you?
                </th>
                <th style={{margin:'20px',color:"white"}}>
                What makes you happy?
                </th>
                </tr>
                <tr style={{marginBottom:'20px'}}>
                  <td ><input style={{margin:'15px',borderRadius:'3px',border:'1px solid #889AB5',width:'250px',height:'38px'}}></input></td>
                  <td><input style={{margin:'20px',borderRadius:'3px',border:'1px solid #889AB5',width:'250px',height:'38px'}}></input></td>
                  <td><input style={{margin:'20px',borderRadius:'3px',border:'1px solid #889AB5',width:'250px',height:'38px'}}></input></td>
                </tr>
                <tr>
                  <td><input style={{margin:'20px',borderRadius:'3px',border:'1px solid #889AB5',width:'250px',height:'38px'}}></input></td>
                  <td><input style={{margin:'20px',borderRadius:'3px',border:'1px solid #889AB5',width:'250px',height:'38px'}}></input></td>
                  <td><input style={{margin:'20px',borderRadius:'3px',border:'1px solid #889AB5',width:'250px',height:'38px'}}></input></td>
                </tr>
                <tr>
                  <td><input style={{margin:'20px',borderRadius:'3px',border:'1px solid #889AB5',width:'250px',height:'38px'}}></input></td>
                  <td><input style={{margin:'20px',borderRadius:'3px',border:'1px solid #889AB5',width:'250px',height:'38px'}}></input></td>
                  <td><input style={{margin:'20px',borderRadius:'3px',border:'1px solid #889AB5',width:'250px',height:'38px'}}></input></td>
                </tr>
                <tr>
                  <td><input style={{margin:'20px',borderRadius:'3px',border:'1px solid #889AB5',width:'250px',height:'38px'}}></input></td>
                  <td><input style={{margin:'20px',borderRadius:'3px',border:'1px solid #889AB5',width:'250px',height:'38px'}}></input></td>
                  <td><input style={{margin:'20px',borderRadius:'3px',border:'1px solid #889AB5',width:'250px',height:'38px'}}></input></td>
                </tr>
                <tr>
                  <td><input style={{margin:'20px',borderRadius:'3px',border:'1px solid #889AB5',width:'250px',height:'38px'}}></input></td>
                  <td><input style={{margin:'20px',borderRadius:'3px',border:'1px solid #889AB5',width:'250px',height:'38px'}}></input></td>
                  <td><input style={{margin:'20px',borderRadius:'3px',border:'1px solid #889AB5',width:'250px',height:'38px'}}></input></td>
                </tr>
              </table>
            </div>
            <div style={{width:'100%',float:'left'}}>
              <div style={{marginLeft:'40%'}}>

            <Row >
                
                  {/* {this.state.saveButtonEnabled === false ||
                  this.state.showAddNewPeopleModal === true ? ( */}
                    
                  {/* ) : ( */}
                    <Button
                    style={{color:"white",backgroundColor:"#889AB5",border:"2px solid white",borderRadius:"10px",margin:"25px"}}
                      type="submit"
                      onClick={(e) => {
                        e.stopPropagation();
                        this.newInputSubmit();
                      }}
                    >
                      Save Changes
                    </Button>
                  
                
                
                  <Button variant="secondary" onClick={this.hideAboutForm}
                  style={{color:"white",backgroundColor:"#889AB5",border:"2px solid white",margin:"25px",borderRadius:"10px"}}
                  >
                    Cancel
                  </Button>
                
           
              </Row>
              </div>
              </div>
              {this.state.showTimeModal && (<SettingPage
                  closeTimeModal={this.hideTimeModal}
                  currentTimeSetting={this.state.aboutMeObject.timeSettings || {}}
                  newTimeSetting={this.updateTimeSetting}
          />
              )}
          </ModalBody>
          {/* <ModalBody style={{backgroundColor:'#889AB5',width:'100%',float:'left',marginTop:'50px'}}>
            <div>
              <table style={{width:'100%'}}>
                <tr style={{margin:'20px'}}>
                <th style={{margin:'30px',color:"white"}}>
                What motivates you?
                </th>
                <th style={{margin:'20px',color:"white"}}>
                What’s important to you?
                </th>
                <th style={{margin:'20px',color:"white"}}>
                What makes you happy?
                </th>
                </tr>
                <tr style={{marginBottom:'20px'}}>
                  <td ><input style={{margin:'15px',borderRadius:'3px',border:'1px solid #889AB5',width:'250px',height:'38px'}}></input></td>
                  <td><input style={{margin:'20px',borderRadius:'3px',border:'1px solid #889AB5',width:'250px',height:'38px'}}></input></td>
                  <td><input style={{margin:'20px',borderRadius:'3px',border:'1px solid #889AB5',width:'250px',height:'38px'}}></input></td>
                </tr>
                <tr>
                  <td><input style={{margin:'20px',borderRadius:'3px',border:'1px solid #889AB5',width:'250px',height:'38px'}}></input></td>
                  <td><input style={{margin:'20px',borderRadius:'3px',border:'1px solid #889AB5',width:'250px',height:'38px'}}></input></td>
                  <td><input style={{margin:'20px',borderRadius:'3px',border:'1px solid #889AB5',width:'250px',height:'38px'}}></input></td>
                </tr>
                <tr>
                  <td><input style={{margin:'20px',borderRadius:'3px',border:'1px solid #889AB5',width:'250px',height:'38px'}}></input></td>
                  <td><input style={{margin:'20px',borderRadius:'3px',border:'1px solid #889AB5',width:'250px',height:'38px'}}></input></td>
                  <td><input style={{margin:'20px',borderRadius:'3px',border:'1px solid #889AB5',width:'250px',height:'38px'}}></input></td>
                </tr>
                <tr>
                  <td><input style={{margin:'20px',borderRadius:'3px',border:'1px solid #889AB5',width:'250px',height:'38px'}}></input></td>
                  <td><input style={{margin:'20px',borderRadius:'3px',border:'1px solid #889AB5',width:'250px',height:'38px'}}></input></td>
                  <td><input style={{margin:'20px',borderRadius:'3px',border:'1px solid #889AB5',width:'250px',height:'38px'}}></input></td>
                </tr>
                <tr>
                  <td><input style={{margin:'20px',borderRadius:'3px',border:'1px solid #889AB5',width:'250px',height:'38px'}}></input></td>
                  <td><input style={{margin:'20px',borderRadius:'3px',border:'1px solid #889AB5',width:'250px',height:'38px'}}></input></td>
                  <td><input style={{margin:'20px',borderRadius:'3px',border:'1px solid #889AB5',width:'250px',height:'38px'}}></input></td>
                </tr>
              </table>
            </div>
            </ModalBody>
          */}
        
       
       
      </div>
    );
  }
}

export default AboutModal;
