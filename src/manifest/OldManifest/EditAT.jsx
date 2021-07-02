import React, { Component } from "react";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import ShowNotifications from "./ShowNotifications";
import { Form, Row, Col } from "react-bootstrap";
import { firestore, storage } from "firebase";
import TimeField from "react-simple-timefield";
import TimePicker from "./TimePicker";

import AddIconModal from "./AddIconModal";
import UploadImage from "./UploadImage";
import axios from 'axios';

export default class editAT extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "",
      showEditModal: false,
      itemToEdit: this.props.ATArray[this.props.i],
      photo_url: this.props.ATArray[this.props.i].photo
    };
  }
 
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.ATArray !== this.props.ATArray) {
      this.setState({ itemToEdit: this.props.ATArray[this.props.i] });
    }
  }
  
  newInputSubmit = () => {
    
    if (this.state.itemToEdit.title === "") {
      alert("Missing title");
      return "";
    }
    
    if (!this.validateTime()) {
      return;
    }
    
    let newArr = this.props.ATArray;
    
    // console.log("EditAt: ", this.state.itemToEdit);
    
    if (this.state.photo_url === "") {
      this.state.photo_url = "https://manifest-image-db.s3-us-west-1.amazonaws.com/action.png"
    }
    
    newArr[this.props.i] = this.state.itemToEdit;
    
    //Add the below attributes in case they don't already exists
    if (!newArr[this.props.i]["datetime_completed"]) {
      newArr[this.props.i]["datetime_completed"] =
         "Sun, 23 Feb 2020 00:08:43 GMT";
    }
    if (!newArr[this.props.i]["audio"]) {
      newArr[this.props.i]["audio"] = "";
    }
    
    if (!newArr[this.props.i]["datetime_started"]) {
      newArr[this.props.i]["datetime_started"] =
         "Sun, 23 Feb 2020 00:08:43 GMT";
    }
    
    let url = this.props.BASE_URL +  "updateAT"
  
    // let body = JSON.parse(JSON.stringify(newArr[this.props.i]));
  
    let body = newArr[this.props.i];
    newArr[this.props.i]['photo'] = this.state.photo_url
    // changes to request body to make it compatible with RDS
    if (body.at_sequence) delete body.at_sequence;
    if (body.goal_routine_id) delete body.goal_routine_id;
    
    if (body.at_title) delete body.at_title
    body.type = this.state.type
    body.id = body.at_unique_id
    if (body.at_unique_id) delete body.at_unique_id
    body.photo_url = this.state.photo_url;
    console.log(body)
    let formData = new FormData();
    Object.entries(body).forEach(entry => {
        if (typeof entry[1].name == 'string'){
        
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
    console.log(formData)

    // console.log(body)
    axios.post(url, formData)
       .then(() => {
         console.log("Updated Action/Task to Database")
         this.setState({ showEditModal: false });
             this.props.refresh(newArr);
       })
       .catch((err) => {
         console.log("Error updating Action/Task", err);
       });
  };

  // newInputSubmit = () => {
  //
  //   if (this.state.itemToEdit.title === "") {
  //     alert("Missing title");
  //     return "";
  //   }
  //
  //   if (!this.validateTime()) {
  //     return;
  //   }
  //
  //   let newArr = this.props.ATArray;
  //
  //   // console.log("EditAt: ", this.state.itemToEdit);
  //
  //   if (this.state.itemToEdit.photo === "") {
  //     this.state.itemToEdit.photo =
  //       "https://firebasestorage.googleapis.com/v0/b/project-caitlin-c71a9.appspot.com/o/DefaultIconsPNG%2Ftask3.png?alt=media&token=03f049ce-a35c-4222-bdf7-fd8b585b1838";
  //   }
  //
  //   newArr[this.props.i] = this.state.itemToEdit;
  //
  //   //Add the below attributes in case they don't already exists
  //   if (!newArr[this.props.i]["datetime_completed"]) {
  //     newArr[this.props.i]["datetime_completed"] =
  //       "Sun, 23 Feb 2020 00:08:43 GMT";
  //   }
  //   if (!newArr[this.props.i]["audio"]) {
  //     newArr[this.props.i]["audio"] = "";
  //   }
  //
  //   if (!newArr[this.props.i]["datetime_started"]) {
  //     newArr[this.props.i]["datetime_started"] =
  //       "Sun, 23 Feb 2020 00:08:43 GMT";
  //   }
  //
  //
  //   this.props.FBPath.update({ "actions&tasks": newArr }).then((doc) => {
  //     console.log("this is the path ", this.props.FBPath.path.split('/')[3]);
  //     this.props.updateWentThroughATListObj(this.props.FBPath.path.split('/')[3]);
  //     // console.log('updateEntireArray Finished')
  //     // console.log(doc);
  //     if (this.props != null) {
  //       // console.log("refreshing FireBasev2 from updating ISItem");
  //       this.setState({ showEditModal: false });
  //       this.props.refresh(newArr);
  //     } else {
  //       console.log("update failure");
  //     }
  //   });
  // };

  validateTime = () => {
    let invalid = false;

    let initStartHour = this.props.timeSlot[0].substring(0, 2);
    let initStartMinute = this.props.timeSlot[0].substring(3, 5);

    let initEndHour = this.props.timeSlot[1].substring(0, 2);
    let initEndMinute = this.props.timeSlot[1].substring(3, 5);

    let startHour = this.state.itemToEdit.available_start_time.substring(0, 2);
    let startMinute = this.state.itemToEdit.available_start_time.substring(
      3,
      5
    );
    let endHour = this.state.itemToEdit.available_end_time.substring(0, 2);
    let endMinute = this.state.itemToEdit.available_end_time.substring(3, 5);

    let initStartTimeObject = new Date();
    initStartTimeObject.setHours(initStartHour, initStartMinute, 0);
    let initEndTimeObject = new Date();
    initEndTimeObject.setHours(initEndHour, initEndMinute, 0);

    let startTimeObject = new Date();
    startTimeObject.setHours(startHour, startMinute, 0);

    let endTimeObject = new Date(startTimeObject);
    endTimeObject.setHours(endHour, endMinute, 0);

    if (startTimeObject > endTimeObject) {
      alert("End time should not occur before start time.");
      invalid = true;
    } else if (startTimeObject < initStartTimeObject) {
      invalid = true;
      alert("Action should not start eariler than the goal/routine");
    } else if (startTimeObject > initEndTimeObject) {
      invalid = true;
      alert("Action should not start later than the goal/routine");
    } else if (endTimeObject > initEndTimeObject) {
      alert("Action should not end later than the goal/routine");
      invalid = true;
    } else {
      invalid = false;
    }
    return invalid ? false : true;
  };

  convertTimeToHRMMSS = (e) => {
    // console.log(e.target.value);
    let num = e.target.value;
    let hours = num / 60;
    let rhours = Math.floor(hours);
    let minutes = (hours - rhours) * 60;
    let rminutes = Math.round(minutes);
    if (rhours.toString().length === 1) {
      rhours = "0" + rhours;
    }
    if (rminutes.toString().length === 1) {
      rminutes = "0" + rminutes;
    }
    // console.log(rhours+":" + rminutes +":" + "00");
    return rhours + ":" + rminutes + ":" + "00";
  };

  convertToMinutes = () => {
    let myStr = this.state.itemToEdit.expected_completion_time.split(":");
    let hours = myStr[0];
    let hrToMin = hours * 60;
    let minutes = myStr[1] * 1 + hrToMin;
    // let seconds = myStr[2];

    // console.log("hours: " +hours + "minutes: " + minutes + "seconds: " + seconds);
    return minutes;
  };
  handleNotificationChange = (temp) => {
    // console.log(temp);
    this.setState({ itemToEdit: temp });
  };

  setPhotoURLFunction = (photo, photo_url, type) => {
    let temp = this.state.itemToEdit;
    temp.photo = photo_url;
    this.setState({ itemToEdit: temp, photo_url: photo_url, type: type });
    console.log(this.state.photo_url)
  };

  setTime = (name, time) => {
    let temp = this.state.itemToEdit;
    if (name === "start_time") {
      temp.available_start_time = time;
      this.setState({ itemToEdit: temp });
    } else {
      temp.available_end_time = time;
      this.setState({ itemToEdit: temp });
    }
  };

  editATForm = () => {
    return (
      // <div style={{ margin: '0', width: "315px", padding:'20px'}}>
      <Row
        style={{
          marginLeft: this.props.marginLeftV,
          width:"300px",
          marginTop:'3rem',
          border: "2px",
          backgroundColor:'#F8BE28'
        }}
      >
        <div style={{display:'flex', flexDirection:'column', alignItems:'flex-start', marginLeft:'1rem'}}>
        <label style={{fontWeight:'bold', color:'#ffffff', marginBottom:'0.5rem', marginTop:'0.5rem'}} >Title</label>
        <div className="input-group mb-3">
          <input
            style={{ width: "200px" , borderRadius:'5px'}}
            placeholder="Enter Title"
            value={this.state.itemToEdit.title}
            onChange={(e) => {
              e.stopPropagation();
              let temp = this.state.itemToEdit;
              temp.title = e.target.value;
              this.setState({ itemToEdit: temp });
            }}
            //TEMP FIX for SPACE BAR TRIGGERING KEY PRESS
            onKeyDown={(e) => {
              if (e.keyCode === 32) {
                let temp = this.state.itemToEdit;
                temp.title = e.target.value + " ";
                this.setState({ itemToEdit: temp });
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          />
        </div>
        </div>
        <Form.Group>
          <Row>
            <div style={{display:'flex', justifyContent:'space-between', marginTop:'1rem', marginLeft:'1rem', paddingRight:'1rem'}}>
            <div style={{display:'flex', flexDirection:'column'}}>
            <Form.Label style={{display:'flex', fontWeight:'bold', color:'#ffffff'}}> Change Icon </Form.Label>
            <div>
            <AddIconModal 
            BASE_URL={this.props.BASE_URL}
            parentFunction={this.setPhotoURLFunction} />
            </div>
            <div>
            <UploadImage 
            BASE_URL={this.props.BASE_URL}
            parentFunction={this.setPhotoURLFunction} 
              currentUserId = {this.props.currentUserId}/>
            <br />
            </div>
            </div>
            
          <div >
            <img
              alt="None"
              src={this.state.photo_url}
              height="70"
              width="auto"
            ></img>
          </div>
            </div>
          </Row>

        </Form.Group>
        <Row style={{ marginLeft: "1rem" }}>
          <section>
          <div style={{fontWeight:'bold', display:'flex', color:'#ffffff', marginTop:'1rem'}}>
            Start Time
            </div>
            <TimePicker
              setTime={this.setTime}
              name="start_time"
              time={this.state.itemToEdit.available_start_time}
            />
        
          </section>
          <br />
          <section>
          <div style={{fontWeight:'bold', display:'flex', color:'#ffffff', marginTop:'1rem'}}>
            End Time
            </div>
            <TimePicker
              setTime={this.setTime}
              name="end_time"
              time={this.state.itemToEdit.available_end_time}
            />
          </section>
        </Row>

        <div style={{marginLeft:'1rem', marginTop:'1rem'}}>
          <label  style={{fontWeight:'bold', display:'flex', color:'#ffffff'}}>
          This Takes Me
          </label>
          <Row>
            <Col style={{ paddingRight: "0px", display:'flex' }}>
              <Form.Control
                // value={this.state.newEventNotification}
                // onChange={this.handleNotificationChange}
                type="number"
                placeholder="30"
                value={this.convertToMinutes()}
                // value = {this.state.itemToEdit.expected_completion_time}
                style={{ marginTop: ".25rem", paddingRight: "0px", borderRadius:'5px'  }}
                onChange={
                  // (e) => {e.stopPropagation(); this.convertTimeToHRMMSS(e)}
                  (e) => {
                    e.stopPropagation();
                    let temp = this.state.itemToEdit;
                    temp.expected_completion_time = this.convertTimeToHRMMSS(e);
                    this.setState({ itemToEdit: temp });
                  }
                }
              />
               <p style={{ marginLeft: "10px", marginTop: "5px",fontWeight:'bold', color:'#ffffff' }}>minutes</p>
            </Col>
            <Col xs={8} style={{ paddingLeft: "0px" }}>
            </Col>
          </Row>
        </div>

        <div className="input-group mb-3" style={{ marginTop: "10px" }}>
          <label className="form-check-label">Time?</label>
          <input
            style={{ marginTop: "5px", marginLeft: "5px" }}
            name="Timed"
            type="checkbox"
            checked={this.state.itemToEdit.is_timed}
            onChange={(e) => {
              e.stopPropagation();
              let temp = this.state.itemToEdit;
              temp.is_timed = !temp.is_timed;
              this.setState({ itemToEdit: temp });
            }}
          />
        </div>
        <div className="input-group mb-3">
          <label className="form-check-label">Available to the user?</label>
          <input
            style={{ marginTop: "5px", marginLeft: "5px" }}
            name="Available"
            type="checkbox"
            checked={this.state.itemToEdit.is_available}
            onChange={(e) => {
              e.stopPropagation();
              let temp = this.state.itemToEdit;
              temp.is_available = !temp.is_available;
              this.setState({ itemToEdit: temp });
            }}
          />
        </div>
        {/* {this.state.itemToEdit.is_available && (
          <ShowNotifications
            itemToEditPassedIn={this.state.itemToEdit}
            notificationChange={this.handleNotificationChange}
          />
        )} */}
        <Button
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation();
            this.setState({ showEditModal: false });
          }}
        >
          Close
        </Button>
        <Button
          variant="info"
          onClick={(e) => {
            e.stopPropagation();
            this.newInputSubmit();
          }}
        >
          Save changes
        </Button>
      </Row>
    );
  };

  showIcon = () => {
    return (
      <div>
        <FontAwesomeIcon
       
          style={{ color: "#ffffff" }}
          onClick={(e) => {
            e.stopPropagation();
            e.target.style.color = "#000000"
            this.setState({ showEditModal: true });
          }}
          icon={faEdit}
          size="small"
        />
      </div>
    );
  };

  render() {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {this.state.showEditModal ? this.editATForm() : this.showIcon()}
      </div>
    );
  }
}
