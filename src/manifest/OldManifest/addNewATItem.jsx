import React, { Component } from "react";
import firebase from "./firebase";
import ShowNotifications from "./ShowNotifications";
import { Button, Modal } from "react-bootstrap";
import { Form, Row, Col } from "react-bootstrap";
import { firestore, storage } from "firebase";
import TimeField from "react-simple-timefield";

import TimePicker from "./TimePicker";

import AddIconModal from "./AddIconModal";
import UploadImage from "./UploadImage";
import axios from "axios";

export default class AddNewATItem extends Component {
  constructor(props) {
    super(props);
    console.log("In addNewATItem", this.props);
    this.state = {
      AT_arr: [], // Actions & Tasks array
      newActionTitle: "", //Old delete Later
      itemToEdit: {
        type: "",
        id: "",
        title: "",
        photo: "https://manifest-image-db.s3-us-west-1.amazonaws.com/action.png",
        photo_url:
          "https://manifest-image-db.s3-us-west-1.amazonaws.com/action.png",
        audio: "",
        is_must_do: true,
        is_complete: false,
        is_available: true,
        available_end_time: this.props.timeSlot[1],
        available_start_time: this.props.timeSlot[0],
        datetime_completed: "Sun, 23 Feb 2020 00:08:43 GMT",
        datetime_started: "Sun, 23 Feb 2020 00:08:43 GMT",
        is_timed: false,
        expected_completion_time: "00:10:00",
        is_sublist_available: false,
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
  }

  componentDidMount() {}

  newInputSubmit = () => {
    if (this.state.itemToEdit.title === "") {
      alert("Missing title");
      return;
    }
    if (this.state.itemToEdit.photo_url === "") {
      this.state.itemToEdit.photo_url =
        "https://manifest-image-db.s3-us-west-1.amazonaws.com/action.png";
    }
    if (!this.validateTime()) {
      return;
    }
    this.addNewDoc();
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

  addNewDoc = () => {
    let url =  this.props.BASE_URL + "addAT";

    if (this.props.ATArray.length > 0) {
      this.setState({
        AT_arr: this.props.ATArray,
      });
    }

    

    let body = this.state.itemToEdit;

    if (body.ta_notifications) delete body.ta_notifications;
    if (body.user_notifications) delete body.user_notifications;

    if (body.id || body.id === "") delete body.id;
    body.gr_id = this.props.ATItem.id;

    console.log(body);

    let formData = new FormData();
    Object.entries(body).forEach((entry) => {
      if (typeof entry[1].name == "string") {
        formData.append(entry[0], entry[1]);
      } else if (entry[1] instanceof Object) {
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
        let newArr = this.state.AT_arr;
        let temp = this.state.itemToEdit;
        temp.id = response.data.result;
        temp.at_unique_id = response.data.result;
        temp.is_sublist_available = false;
        // console.log("*****")
        // console.log(response.data.result)
        // console.log(newArr)
        newArr.push(temp);

        this.props.hideNewATModal();
        this.props.refresh(newArr);
        this.props.refreshGR();
        // this.updateEntireArray(newArr);

        console.log("Added Action/Task to Database");
      })
      .catch((err) => {
        console.log("Error adding Action/Task", err);
      });

   
  };


  setPhotoURLFunction = (photo, photo_url, type) => {
    let temp = this.state.itemToEdit;
    temp.photo = photo_url;
    temp.photo_url = photo_url;
    temp.type = type;
    this.setState({ itemToEdit: temp });
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
    return (
      <Modal.Dialog style={{ marginLeft: "0", width: this.props.width }}>
        <Modal.Header
          closeButton
          onHide={() => {
            this.props.hideNewATModal();
          }}
        >
          <Modal.Title>
            <h2 className="normalfancytext">Add New Task/Action</h2>{" "}
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
                parentFunction={this.setPhotoURLFunction}
                currentUserId={this.props.currentUserId}
                BASE_URL={this.props.BASE_URL}
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
            <Row style={{ marginLeft: "3px" }}>
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
            </Row>

            <br />
            <label>This Takes Me</label>
            <Row>
              <Col style={{ paddingRight: "0px" }}>
                <Form.Control
                  type="number"
                  placeholder="30"
                  value={this.convertToMinutes()}
                  style={{ marginTop: ".25rem", paddingRight: "0px" }}
                  onChange={(e) => {
                    e.stopPropagation();
                    let temp = this.state.itemToEdit;
                    temp.expected_completion_time = this.convertTimeToHRMMSS(e);
                    this.setState({ itemToEdit: temp });
                  }}
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
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              this.props.hideNewATModal();
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
