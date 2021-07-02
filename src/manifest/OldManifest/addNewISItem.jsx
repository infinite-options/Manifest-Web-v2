import React, { Component } from "react";
// import firebase from "./firebase";
import ShowNotifications from "./ShowNotifications";
import { Button, Modal } from "react-bootstrap";
import { Form, Row, Col } from "react-bootstrap";
import { firestore, storage } from "firebase";
import TimeField from "react-simple-timefield";
import TimePicker from "./TimePicker";

import AddIconModal from "./AddIconModal";
import UploadImage from "./UploadImage";
import axios from "axios";


/**
 *
 * This class is responsible for adding a new elemnt to the
 * firebase database. If it becomes successful then we update
 * the view on the firebasev2
 */

export default class AddNewISItem extends Component {
  constructor(props) {
    super(props);
    console.log("in addNewISItem", this.props);
  }

  state = {
    atArr: [], //goal, routine original array
    ISArr: [], //Instructions and steps array
    newInstructionTitle: "",
    itemToEdit: {
      //new item to add to array
      id: "",
      type: "",
      title: "",
      is_sequence: "",
      photo:"https://manifest-image-db.s3-us-west-1.amazonaws.com/instruction.png",
      photo_url:
        "https://manifest-image-db.s3-us-west-1.amazonaws.com/instruction.png",
      is_complete: false,
      is_available: true,
      available_end_time: this.props.timeSlot[1],
      available_start_time: this.props.timeSlot[0],
      datetime_completed: "Sun, 23 Feb 2020 00:08:43 GMT",
      datetime_started: "Sun, 23 Feb 2020 00:08:43 GMT",
      audio: "",
      is_timed: false,
      expected_completion_time: "00:05:00",
      is_in_progress: false,
      ta_notifications: {
        before: {
          is_enabled: false,
          is_set: false,
          message: "",
          time: "00:05:00",
        },
        during: {
          is_enabled: false,
          is_set: false,
          message: "",
          time: "00:30:00",
        },
        after: {
          is_enabled: false,
          is_set: false,
          message: "",
          time: "00:05:00",
        },
      },
      user_notifications: {
        before: {
          is_enabled: false,
          is_set: false,
          message: "",
          time: "00:05:00",
        },
        during: {
          is_enabled: false,
          is_set: false,
          message: "",
          time: "00:30:00",
        },
        after: {
          is_enabled: false,
          is_set: false,
          message: "",
          time: "00:05:00",
        },
      },
    },
  };

  setPhotoURLFunction = (photo, photo_url, type) => {
    let temp = this.state.itemToEdit;
    temp.photo = photo_url;
    temp.photo_url = photo_url;
    temp.type = type;
    this.setState({ itemToEdit: temp });
  };


  componentDidMount() {
    // console.log("AddNewISItem did mount");
    // console.log(this.props.ISArray);
    // console.log(this.props.ISItem);
  }

  handleInputChange = (e) => {
    console.log(e.target.value);
    this.setState({
      newInstructionTitle: e.target.value,
    });
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
      alert("Steps/Instructions should not start eariler than the action/task");
    } else if (startTimeObject > initEndTimeObject) {
      invalid = true;
      alert("Steps/Instructions should not start later than the action/task");
    } else if (endTimeObject > initEndTimeObject) {
      alert("Steps/Instructions should not end later than the action/task");
      invalid = true;
    } else {
      invalid = false;
    }
    return invalid ? false : true;
  };

  newInputSubmit = () => {
    if (this.state.itemToEdit.title === "") {
      alert("Invalid Input");
      return;
    }

    if (this.state.itemToEdit.photo_url === "") {
      this.state.itemToEdit.photo_url =
        "https://manifest-image-db.s3-us-west-1.amazonaws.com/instruction.png";
    }

    // if (!this.validateTime()) {
    //   return;
    // }

    let url =  this.props.BASE_URL + "addIS";
    const atArr = [...this.props.Array]

    if (this.props.ISArray.length > 0) {
      this.setState({
        ISArr: this.props.ISArray,
      });
    }

  let body = this.state.itemToEdit;

  if (body.ta_notifications) delete body.ta_notifications;
  if (body.user_notifications) delete body.user_notifications;
  if (body.available_end_time) delete body.available_end_time;
  if (body.available_start_time) delete body.available_start_time;
  if (body.datetime_completed) delete body.datetime_completed;
  if (body.datetime_started) delete body.datetime_started;
  if (body.audio) delete body.audio;
  if (body.id || body.id === "") delete body.id;

  body.at_id = this.props.ISItem.id;

  // console.log("BODY")
  console.log(body);

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
      let newArr = this.state.ISArr;
      let temp = this.state.itemToEdit;
     
      var res = response.data.result

         for (let i = 0; i < atArr.length; ++i){
            if(res.at_id == atArr[i].id){
              atArr[i].is_sublist_available = res.is_sublist_available.toLowerCase() === "true"
            }
         }
         temp.id = res.id;
      temp.unique_id = res.id;

      newArr.push(temp);

      this.props.hideNewISModal();
      this.props.refresh(newArr);
      this.props.refreshAT(atArr)
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

  render() {
    console.log("In render IS")
    return (
      <Modal.Dialog style={{ marginLeft: "0", width: this.props.width }}>
        <Modal.Header
          closeButton
          onHide={() => {
            this.props.hideNewISModal();
            console.log("closed button clicked");
          }}
        >
          <Modal.Title>
            <h2 className="normalfancytext">Add New Step</h2>{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <AddNewGRItem refresh={this.grabFireBaseRoutinesGoalsData} isRoutine={this.state.isRoutine} /> */}
          <div>
            <label>Title</label>
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
            </div>
            <Form.Label> Photo </Form.Label>
            <Row>
            <AddIconModal 
            BASE_URL={this.props.BASE_URL}
            parentFunction={this.setPhotoURLFunction} />
              <UploadImage
              BASE_URL={this.props.BASE_URL}
                parentFunction={this.setPhotoURLFunction}
                currentUserId={this.props.currentUserId}
              />
              <br />
            </Row>
            <div style={{ marginTop: "10px", marginBottom: "10px" }}>
              <label>Icon: </label>
              <img
                alt="None"
                src={this.state.itemToEdit.photo_url}
                height="70"
                width="auto"
              ></img>
            </div>
            <br />
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
            </div>

            <label>This Takes Me</label>
            <Row>
              <Col style={{ paddingRight: "0px" }}>
                <Form.Control
                  // value={this.state.newEventNotification}
                  // onChange={this.handleNotificationChange}
                  type="number"
                  placeholder="30"
                  value={this.convertToMinutes()}
                  // value = {this.state.itemToEdit.expected_completion_time}
                  style={{ marginTop: ".25rem", paddingRight: "0px" }}
                  onChange={
                    // (e) => {e.stopPropagation(); this.convertTimeToHRMMSS(e)}
                    (e) => {
                      e.stopPropagation();
                      let temp = this.state.itemToEdit;
                      temp.expected_completion_time = this.convertTimeToHRMMSS(
                        e
                      );
                      this.setState({ itemToEdit: temp });
                    }
                  }
                />
              </Col>
              <Col xs={8} style={{ paddingLeft: "0px" }}>
                <p style={{ marginLeft: "10px", marginTop: "5px" }}>minutes</p>
              </Col>
            </Row>

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
              <label className="form-check-label">
                Available to the user?
              </label>
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
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              this.props.hideNewISModal();
              console.log("closed button clicked");
            }}
          >
            Close
          </Button>
          <Button
            variant="info"
            onClick={() => {
              this.newInputSubmit();
            }}
          >
            Save changes
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  }
}