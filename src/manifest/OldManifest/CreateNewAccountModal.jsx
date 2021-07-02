import * as axios from "axios";
import React, { Component } from "react";
import firebase from "./firebase";
import {Button, Modal, Row, Col, DropdownButton, Dropdown} from "react-bootstrap";
import TimezonePicker from 'react-bootstrap-timezone-picker';

export default class AddNewPeople extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    itemToEdit: {
      email_id: "",
      first_name: "",
      last_name: "",
      google_auth_token:"",
      google_refresh_token:"",
    },
    copy_from_user: "",
    copy_from_user_name: "Copy Exisiting Client",
    unique_id: "",
    // UserDocsPath: firebase
    // .firestore()
    // .collection("users"),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
  
  newUserInputSubmit = () => {
    console.log("In newUserInputSubmit");
    console.log("newAccountID from Props: ", this.props.newAccountID)
    console.log("ta_people_id from Props: ", this.props.theCurrentTAID)
    
    let body = {
      ta_email: this.props.loggedInEmail,
      email: this.props.email,
      first_name: this.state.itemToEdit.first_name,
      last_name: this.state.itemToEdit.last_name,
      timeZone: this.state.timeZone,
      ta_people_id: this.props.theCurrentTAID,
      currentUserId: this.props.newAccountID
    }
    
    console.log("body in newUserInputSubmit")
    console.log(body)
    axios
       .post("/updateNewUser", body)
       .then((result) => {
         this.props.newUserAdded();
         result.redirect("/main");
       })
       .catch((err) => {
         console.log(err);
       });
  }

    handleTimeZoneChange = (e) => {
      console.log(e);
      this.setState({ timeZone : e });
    }

    render() {
      return (
        <Modal.Dialog style={{marginLeft:"10px", width:"500px", paddingLeft:"0px", marginTop:"10px"}}>
        {/* <Modal.Header closeButton onHide={this.props.closeModal} >
        <Modal.Title>
        <h5 className="normalfancytext">
        Create Account
        </h5>{" "}
        </Modal.Title>
        </Modal.Header> */}
        <Modal.Body style ={{width:"500px"}}>
        <Row>

        <Col xs={5}>

        <label>Email</label>
        <div className="input-group mb-3">
        <label style={{"fontSize":"12px",paddingTop: "3px"}}> {this.props.email} </label>
        </div>
        </Col>
        <Col xs={3} style ={{paddingLeft:"5px", marginLeft: "-10px"}}>

        <label> First Name</label>
        <div className="input-group mb-3">
        <input
        style={{ width: "125px"}}
        placeholder="Enter Name"
        value={this.state.itemToEdit.first_name}
        onChange={e => {
          e.stopPropagation();
          let temp = this.state.itemToEdit;
          temp.first_name = e.target.value;
          this.setState({ itemToEdit: temp });
        }}

        />
        </div>
        </Col>
        <Col xs={4} style ={{paddingLeft:"25px"}}>

        <label>Last Name</label>
        <div className="input-group mb-3">
        <input
        style={{ width: "125px" }}
        placeholder="Enter Name "
        value={this.state.itemToEdit.last_name}
        onChange={e => {
          e.stopPropagation();
          let temp = this.state.itemToEdit;
          temp.last_name = e.target.value;
          this.setState({ itemToEdit: temp });
        }}

        />
        </div>

        </Col>
        </Row>
        <Row>
        <Col xs={5}>
        <TimezonePicker
          value = {this.state.timeZone}
          absolute      = {true}
          // defaultValue  = "Europe/Moscow"
          placeholder   = "Select timezone..."
          onChange      = {this.handleTimeZoneChange}
          style = {{width:"220px", fontSize: 16, border: "1px solid #666"}}
        />
        </Col>
        <Col xs={3}>
        <Button style = {{marginLeft:"30px"}} variant="secondary" onClick = {this.props.closeModal}>
        Close
        </Button>
        </Col>
        <Col xs={4}>
        <Button variant="info" style = {{marginRight:"30px"}} type="submit" onClick={(e) => {e.stopPropagation(); this.newUserInputSubmit()}}>
        Save changes
        </Button>
        </Col>
        </Row>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button style = {{marginLeft:"10px"}} variant="secondary" onClick = {this.props.closeModal}>
          Close
          </Button>
          <Button variant="info" style = {{marginLeft:"50px", marginRight:"30px"}} type="submit" >
          Save changes
          </Button>

          </Modal.Footer> */}
          </Modal.Dialog>
        );
      }
    }
