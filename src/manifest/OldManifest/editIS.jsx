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
import axios from "axios";

export default class editIS extends Component {
  constructor(props) {
    super(props);
    console.log("from editIS: ", this.props.timeSlot);
    this.state = {
      type: "",
      showEditModal: false,
      itemToEdit: this.props.ISArray[this.props.i],
      photo_url: this.props.ISArray[this.props.i].photo
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.ISArray !== this.props.ISArray) {
      this.setState({ itemToEdit: this.props.ISArray[this.props.i] });
    }
  }

  setPhotoURLFunction = (photo, photo_url, type) => {
    let temp = this.state.itemToEdit;
    temp.photo = photo;
    this.setState({ itemToEdit: temp, photo_url: photo_url, type: type });
  };

  newInputSubmit = () => {
    
    let newArr = this.props.ISArray;

    if (this.state.itemToEdit.title === "") {
      alert("Missing title");
      return "";
    }
    // if (!this.validateTime()) {
    //   return;
    // }

    if (this.state.itemToEdit.photo_url === "") {
      this.state.itemToEdit.photo_url =
        "https://manifest-image-db.s3-us-west-1.amazonaws.com/instruction.png";
    }
    let url = this.props.BASE_URL +  "updateIS"

let body = newArr[this.props.i]

body.photo_url = this.state.photo_url
    body.type = this.state.type
    if (body.at_id) delete body.at_id;
  if (body.ta_notifications) delete body.ta_notifications;
  if (body.user_notifications) delete body.user_notifications;
  if (body.available_end_time) delete body.available_end_time;
  if (body.available_start_time) delete body.available_start_time;
  if (body.datetime_completed) delete body.datetime_completed;
  if (body.datetime_started) delete body.datetime_started;
  if (body.audio) delete body.audio;
  if (body.id) delete body.id;

  let formData = new FormData();
  Object.entries(body).forEach((entry) => {
    if (entry[1] instanceof Object) {
      entry[1] = JSON.stringify(entry[1]);
      formData.append(entry[0], entry[1]);
    } else {
      formData.append(entry[0], entry[1]);
    }
  });
  console.log(formData);

  axios
    .post(url, formData)
    .then((response) => {
      this.setState({ showEditModal: false });
      this.props.refresh(newArr);
      // this.updateEntireArray(newArr);

      console.log("Added Instuction/Step to Database");
    })
    .catch((err) => {
      console.log("Error adding Action/TaskInstuction/Step", err);
    });
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
      alert("Step/Instruction should not start eariler than the action/task");
    } else if (startTimeObject > initEndTimeObject) {
      invalid = true;
      alert("Step/Instruction should not start later than the action/task");
    } else if (endTimeObject > initEndTimeObject) {
      alert("Step/Instruction should not end later than the action/task");
      invalid = true;
    } else {
      invalid = false;
    }
    return invalid ? false : true;
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

  editISForm = () => {
    return (
      // <div style={{margin: '0', width: "315px", padding:'20px'}}>
      <Row
        style={{
          marginLeft: '0rem',
          width:'300px',
          border: "2px",
          marginTop: "1rem",
          backgroundColor:'#67ABFC'
        }}
      >
        {/* <label style={{fontWeight:'bold', color:'#ffffff'}}>Title</label>
        <div className="input-group mb-3">
          <input
            style={{ width: "200px" }}
            placeholder="Enter Title"
            value={this.state.itemToEdit.title}
            onChange={(e) => {
              e.stopPropagation();
              let temp = this.state.itemToEdit;
              temp.title = e.target.value;
              this.setState({ itemToEdit: temp });
            }}
          />
        </div> */}

        <Form.Group>
          <Row>
          <div style={{display:'flex', justifyContent:'space-between', marginTop:'3rem', marginLeft:'1rem', paddingRight:'1rem'}}>
            <div style={{display:'flex', flexDirection:'column'}}>
            <Form.Label style={{display:'flex', fontWeight:'bold', color:'#ffffff', marginTop:'1rem'}}> Change Icon </Form.Label>
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
            <div style={{ marginTop: "10px" }}>
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

        {/* <Row style={{ marginLeft: "3px" }}>
          <section>
            Start Time
            <TimePicker
              setTime={this.setTime}
              name="start_time"
              time={this.state.itemToEdit.available_start_time}
            />
          </section>
          <br />
          <section style={{ marginLeft: "15px" }}>
            End Time
            <TimePicker
              setTime={this.setTime}
              name="end_time"
              time={this.state.itemToEdit.available_end_time}
            />
          </section>
        </Row> */}
        {/* <br />
            <div style={{ marginTop: "10px", marginBottom: "10px" }}>
              <label>Instruction/Step Sequence: </label>
              <input
                style={{ width: "200px" }}
                placeholder="Enter Sequence"
                value={this.state.itemToEdit.is_sequence}
                onChange={(e) => {
                  e.stopPropagation();
                  let temp = this.state.itemToEdit;
                  temp.is_sequence = e.target.value;
                  this.setState({ itemToEdit: temp });
                }}
              />
            </div> */}
            
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
                style={{ marginTop: ".25rem", paddingRight: "0px" , borderRadius:'5px'}}
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
          </Row>
        </div>
        <div className="input-group mb-3" style={{ marginTop: "1rem", display:'flex', justifyContent:'space-between', padding:'1rem' }}>
          <label style={{fontWeight:'bold', color:'#ffffff'}} className="form-check-label">Time the user</label>
          <input
            style={{ marginTop: "5px", marginLeft: "5px" }}
            name="Timed"
            type="checkbox"
            checked={this.state.itemToEdit.is_timed}
            onChange={(e) => {
              e.stopPropagation();
              let temp = this.state.itemToEdit;
              // console.log(temp.is_timed)
              temp.is_timed = !temp.is_timed;
              this.setState({ itemToEdit: temp });
            }}
          />
        </div>

        <div className="input-group mb-3" style={{ display:'flex', justifyContent:'space-between', padding:'1rem' }}>
          <label  style={{fontWeight:'bold', color:'#ffffff'}} className="form-check-label">Available to the user</label>
          <input
            style={{ marginTop: "5px", marginLeft: "5px" }}
            name="Available"
            type="checkbox"
            checked={this.state.itemToEdit.is_available}
            onChange={(e) => {
              e.stopPropagation();
              let temp = this.state.itemToEdit;
              // console.log(temp.is_available)
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
        {/* </div> */}
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
      <div>
        {/* {(this.state.showEditModal) ? <div> </div> : this.showIcon()}
                {(this.state.showEditModal ? this.editISForm() : <div> </div>)} */}
        {this.state.showEditModal ? this.editISForm() : this.showIcon()}
      </div>
    );
  }
}