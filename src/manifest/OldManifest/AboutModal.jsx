import React from "react";
import firebase from "./firebase";
import SettingPage from "./SettingPage";
import {
  Form,
  Row,
  Col,
  Modal,
  Button,
  Container,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faTemperatureHigh } from "@fortawesome/free-solid-svg-icons";
import { storage } from "./firebase";
import axios from "axios";
import DatePicker from 'react-datepicker'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

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
    let url = this.props.BASE_URL + "aboutme/";

    axios
      .get(url + '100-000028')//this.props.theCurrentUserId)
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
      user_id: this.props.theCurrentUserId,
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      have_pic: this.state.aboutMeObject.have_pic,
      message_card: this.state.aboutMeObject.message_card,
      message_day: this.state.aboutMeObject.message_day,
      picture: this.state.aboutMeObject.pic,
      timeSettings: this.state.aboutMeObject.timeSettings,
      history: this.state.aboutMeObject.history,
      major_events: this.state.aboutMeObject.major_events
    };

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

    let url =  this.props.BASE_URL + "updateAboutMe";

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

    axios
      .post(url, formData)
      .then(() => {
        console.log("Updated Details");
        this.hideAboutForm();
     
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
      <div>
        <Modal.Dialog
          style={{
            borderRadius: "15px",
            boxShadow:
              "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
            marginLeft: "35px",
            width: "350px",
            marginTop: "0",
          }}
        >
          <Modal.Header
            closeButton
            onHide={() => {
              this.hideAboutForm();
            }}
          >
            <Modal.Title>
              <h5 className="normalfancytext">About Me</h5>{" "}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Name:</Form.Label>
              <Row>
                <Col style={{ paddingRight: "0px" }}>
                  <label style={{ marginTop: "10px", marginLeft: "10px" }}>
                    First:
                  </label>
                </Col>
                <Col xs={9} style={{ paddingLeft: "0px" }}>
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
                <Col style={{ paddingRight: "0px" }}>
                  <label style={{ marginTop: "10px", marginLeft: "10px" }}>
                    Last:
                  </label>
                </Col>
                <Col xs={9} style={{ paddingLeft: "0px" }}>
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
                <Col style={{ paddingRight: "0px" }}>
                  <label style={{ marginTop: "10px", marginLeft: "10px" }}>
                    Birth Date:
                  </label>
                </Col>
                <Col xs={9} style={{ paddingLeft: "0px" }}>
                  {this.startTimePicker()}
                </Col>
              </Row>
              <Row>
                <Col style={{ paddingRight: "0px" }}>
                  <label style={{ marginTop: "10px", marginLeft: "10px" }}>
                    Phone Number:
                  </label>
                </Col>
                <Col xs={8} style={{ paddingLeft: "0px" }}>
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
                </Col>
              </Row>
            </Form.Group>
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
                    }}
                    src={this.state.url}
                    alt="Profile"
                  />
                )}
              </Col>
              <Col xs={8}>
                <label>Upload A New Image</label>
                <input
                  style={{ color: "transparent" }}
                  accept="image/*"
                  type="file"
                  onChange={this.handleFileSelected}
                  id="ProfileImage"
                />
              </Col>
            </Row>

            <Form.Group controlId="AboutMessage" style={{ marginTop: "10px" }}>
              <Form.Label>Message (My Day):</Form.Label>
              <Form.Control
                as="textarea"
                rows="4"
                type="text"
                placeholder="You are a strong ..."
                value={this.state.aboutMeObject.message_day || ""}
                onChange={(e) => {
                  e.stopPropagation();
                  let temp = this.state.aboutMeObject;
                  temp.message_day = e.target.value;
                  this.setState({ aboutMeObject: temp });
                }}
              />
            </Form.Group>
            <Form.Group controlId="AboutMessageCard">
              <Form.Label>Message (My Card):</Form.Label>
              <Form.Control
                as="textarea"
                rows="4"
                type="text"
                placeholder="You are a safe ..."
                value={this.state.aboutMeObject.message_card || ""}
                onChange={(e) => {
                  e.stopPropagation();
                  let temp = this.state.aboutMeObject;
                  temp.message_card = e.target.value;
                  this.setState({ aboutMeObject: temp });
                }}
              />
            </Form.Group>

            <Form.Group controlId="MajorEvents" style={{ marginTop: "10px" }}>
              <Form.Label>Major Events:</Form.Label>
              <Form.Control
                as="textarea"
                rows="4"
                type="text"
                placeholder="Please add your Life's Major Events ..."
                value={this.state.aboutMeObject.major_events || ""}
                onChange={(e) => {
                  e.stopPropagation();
                  let temp = this.state.aboutMeObject;
                  temp.major_events = e.target.value;
                  this.setState({ aboutMeObject: temp });
                }}
              />
            </Form.Group>
            <Form.Group controlId="HistoryCard">
              <Form.Label>History:</Form.Label>
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
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Container fluid>
              <Row>
                {/* style={{ display: "inline-block", margin: "10px", marginBottom: "0" }} */}

                <Button
                  variant="outline-primary"
                  style={{
                    display: "inline-block",
                    marginLeft: "15px",
                    marginBottom: "10px",
                  }}
                  onClick={() => {
                    this.setState({
                      showTimeModal: true,
                    });
                  }}
                >
                  Time Settings
                </Button>
              </Row>
              <Row>
                <Col xs={3}>
                  {this.state.saveButtonEnabled === false ||
                  this.state.showAddNewPeopleModal === true ? (
                    <Button variant="info" type="submit" disabled>
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="info"
                      type="submit"
                      onClick={(e) => {
                        e.stopPropagation();
                        this.newInputSubmit();
                      }}
                    >
                      Save
                    </Button>
                  )}
                </Col>
                <Col xs={4}>
                  <Button variant="secondary" onClick={this.hideAboutForm}>
                    Cancel
                  </Button>
                </Col>
           
              </Row>
            </Container>
          </Modal.Footer>
        </Modal.Dialog>
       
        {this.state.showTimeModal && (
          <SettingPage
            closeTimeModal={this.hideTimeModal}
            currentTimeSetting={this.state.aboutMeObject.timeSettings || {}}
            newTimeSetting={this.updateTimeSetting}
          />
        )}
      </div>
    );
  }
}

export default AboutModal;
