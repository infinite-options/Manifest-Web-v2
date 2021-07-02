import React from "react";
import firebase from "./firebase";
import AddNewPeople from "./AddNewPeople";
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
import UploadPeopleImages from "./UploadPeopleImages";

class FutureModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
      motivation:[],
      happy: [],
      feelings:[],
      important:[]
    };
  }

  componentDidMount() {
    // this.grabFireBaseAboutMeData();
    this.grabFireBaseAllPeopleNames();
  }

  hideFutureForm = (e) => {
    this.props.CameBackFalse();
  };

  
  // Currently working on right now
  grabFireBaseAllPeopleNames = () => {
    let url1 =  this.props.BASE_URL + "motivation/";

    // let url2 = this.props.BASE_URL + "feelings/";

    let url3 = this.props.BASE_URL + "happy/";

    let url4 = this.props.BASE_URL + "important/";

    let motivationList = {};
    let feelingsList = {};
    let happyList = {};
    let importantList = {};

    axios
      .get(url1 + this.props.theCurrentUserId)
      .then((response) => {
        motivationList = response.data.result[0];
        var array = JSON.parse("[" + motivationList['options'] + "]");
        if(array[0].length >= 0){
          this.setState({
            motivation: array[0]
          });
        }
          
      })
      .catch((err) => {
        console.log("Error getting motivation list", err);
      });

      // axios
      // .get(url2 + this.props.theCurrentUserId)
      // .then((response) => {
      //   feelingsList = response.data.result[0];
      //   var array = JSON.parse("[" + feelingsList['feelings'] + "]");
      //   if(array[0].length >= 0){
      //     this.setState({
      //       feelings: array[0]
      //     });
      //   }
          
      // })
      // .catch((err) => {
      //   console.log("Error getting feelings list", err);
      // });

      axios
      .get(url3 + this.props.theCurrentUserId)
      .then((response) => {
        happyList = response.data.result[0];
        var array = JSON.parse("[" + happyList['options'] + "]");
        console.log(array)
        if(array[0].length >= 0){
          this.setState({
            happy: array[0]
          });
        }
          
      })
      .catch((err) => {
        console.log("Error getting happy list", err);
      });

      axios
      .get(url4 + this.props.theCurrentUserId)
      .then((response) => {
        importantList = response.data.result[0];
        var array = JSON.parse("[" + importantList['options'] + "]");
        if(array[0].length >= 0){
          this.setState({
            important: array[0]
          });
        }
       
          
      })
      .catch((err) => {
        console.log("Error getting important list", err);
      });
  };

  newInputSubmit = () => {
    
    let motivationList = Object.values(this.state.motivation);
    // let feelingsList = Object.values(this.state.feelings);
    let importantList = Object.values(this.state.important);
    let happyList = Object.values(this.state.happy);

    
    let motivationUrl = this.props.BASE_URL +  "updateMotivation";
    // let feelingsUrl = this.props.BASE_URL +  "updateFeelings";
    let importantUrl = this.props.BASE_URL +  "updateImportant";
    let happyUrl = this.props.BASE_URL +  "updateHappy";

    const body1 = {
      user_id: this.props.theCurrentUserId,
      motivation: motivationList
    };

    // const body2 = {
    //   user_id: this.props.theCurrentUserId,
    //   feelings: feelingsList
    // };

    const body3 = {
      user_id: this.props.theCurrentUserId,
      important: importantList
    };

    const body4 = {
      user_id: this.props.theCurrentUserId,
      happy: happyList
    };
    
    axios
      .post(motivationUrl, body1)
        .then(() => {
          console.log("Updated Details");
        })
        .catch((err) => {
          console.log("Error updating Details", err);
        });

    // axios
    // .post(feelingsUrl, body2)
    //   .then(() => {
    //     console.log("Updated Details");
    //   })
    //   .catch((err) => {
    //     console.log("Error updating Details", err);
    //   });

    axios
    .post(importantUrl, body3)
      .then(() => {
        console.log("Updated Details");
      })
      .catch((err) => {
        console.log("Error updating Details", err);
      });

    axios
    .post(happyUrl, body4)
      .then(() => {
        console.log("Updated Details");
        this.hideFutureForm();
      })
      .catch((err) => {
        console.log("Error updating Details", err);
      });
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
              this.hideFutureForm();
            }}
          >
            <Modal.Title>
              <h5 className="normalfancytext">Notes To Future Self</h5>{" "}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Motivation:</Form.Label>
              <Row>
                <Col xs={50} style={{ paddingLeft: "70px" }}>
                  {this.state.motivation.length >= 0 ?
                   (<Form.Control
                   type="text"
                   placeholder="Motivation"
                   value={this.state.motivation[0] || ""}
                   onChange={(e) => {
                     e.stopPropagation();
                     var a = this.state.motivation
                     a[0] = e.target.value
                     this.setState({motivation: a});
                   }}
                 />) : (
                  <Form.Control
                  type="text"
                  placeholder="Motivation"
                  value={""}
                  onChange={(e) => {
                    e.stopPropagation();
                    var a = this.state.motivation
                     a[0] = e.target.value
                     this.setState({motivation: a});
                  }}
                />
                 )
                  }
                </Col>
              </Row>
              <Row>
                <Col xs={50} style={{ paddingLeft: "70px" }}>
                {this.state.motivation.length >= 1 ?
                   (<Form.Control
                   type="text"
                   placeholder="Motivation"
                   value={this.state.motivation[1] || ""}
                   onChange={(e) => {
                    e.stopPropagation();
                    var a = this.state.motivation
                    a[1] = e.target.value
                    this.setState({motivation: a});
                   }}
                 />) : (
                  <Form.Control
                  type="text"
                  placeholder="Motivation"
                  value={""}
                  onChange={(e) => {
                    e.stopPropagation();
                    var a = this.state.motivation
                     a[1] = e.target.value
                     this.setState({motivation: a});
                  }}
                />
                 )
                  }
                </Col>
              </Row>
              <Row>
                <Col xs={50} style={{ paddingLeft: "70px" }}>
                {this.state.motivation.length >= 2 ?
                   (<Form.Control
                   type="text"
                   placeholder="Motivation"
                   value={this.state.motivation[2] || ""}
                   onChange={(e) => {
                     e.stopPropagation();
                     var a = this.state.motivation
                     a[2] = e.target.value
                     this.setState({motivation: a});
                   }}
                 />) : (
                  <Form.Control
                  type="text"
                  placeholder="Motivation"
                  value={""}
                  onChange={(e) => {
                    e.stopPropagation();
                    var a = this.state.motivation
                     a[2] = e.target.value
                     this.setState({motivation: a});
                  }}
                />
                 )
                  }
                </Col>
              </Row>
              <Row>
                <Col xs={50} style={{ paddingLeft: "70px" }}>
                {this.state.motivation.length >= 3 ?
                   (<Form.Control
                   type="text"
                   placeholder="Motivation"
                   value={this.state.motivation[3] || ""}
                   onChange={(e) => {
                     e.stopPropagation();
                     var a = this.state.motivation
                     a[3] = e.target.value
                     this.setState({motivation: a});
                   }}
                 />) : (
                  <Form.Control
                  type="text"
                  placeholder="Motivation"
                  value={""}
                  onChange={(e) => {
                    e.stopPropagation();
                    var a = this.state.motivation
                     a[3] = e.target.value
                     this.setState({motivation: a});
                  }}
                />
                 )
                  }
                </Col>
              </Row>
              <Row>
                <Col xs={50} style={{ paddingLeft: "70px" }}>
                {this.state.motivation.length >= 4 ?
                   (<Form.Control
                   type="text"
                   placeholder="Motivation"
                   value={this.state.motivation[4] || ""}
                   onChange={(e) => {
                     e.stopPropagation();
                     var a = this.state.motivation
                     a[4] = e.target.value
                     this.setState({motivation: a});
                   }}
                 />) : (
                  <Form.Control
                  type="text"
                  placeholder="Motivation"
                  value={""}
                  onChange={(e) => {
                    e.stopPropagation();
                    var a = this.state.motivation
                     a[4] = e.target.value
                     this.setState({motivation: a});
                  }}
                />
                 )
                  }
                </Col>
              </Row>
              <Row>
                <Col xs={50} style={{ paddingLeft: "70px" }}>
                {this.state.motivation.length >= 5 ?
                   (<Form.Control
                   type="text"
                   placeholder="Motivation"
                   value={this.state.motivation[5] || ""}
                   onChange={(e) => {
                     e.stopPropagation();
                     var a = this.state.motivation
                     a[5] = e.target.value
                     this.setState({motivation: a});
                   }}
                 />) : (
                  <Form.Control
                  type="text"
                  placeholder="Motivation"
                  value={""}
                  onChange={(e) => {
                    e.stopPropagation();
                    var a = this.state.motivation
                     a[5] = e.target.value
                     this.setState({motivation: a});
                  }}
                />
                 )
                  }
                </Col>
              </Row>
              <Row>
                <Col xs={50} style={{ paddingLeft: "70px" }}>
                {this.state.motivation.length >= 6 ?
                   (<Form.Control
                   type="text"
                   placeholder="Motivation"
                   value={this.state.motivation[6] || ""}
                   onChange={(e) => {
                     e.stopPropagation();
                     var a = this.state.motivation
                     a[6] = e.target.value
                     this.setState({motivation: a});
                   }}
                 />) : (
                  <Form.Control
                  type="text"
                  placeholder="Motivation"
                  value={""}
                  onChange={(e) => {
                    e.stopPropagation();
                    var a = this.state.motivation
                     a[6] = e.target.value
                     this.setState({motivation: a});
                  }}
                />
                 )
                  }
                </Col>
              </Row>
            </Form.Group>

            <Form.Group>
              <Form.Label>Important:</Form.Label>
              <Row>
                <Col xs={50} style={{ paddingLeft: "70px" }}>
                {this.state.important.length >= 0 ?
                   (<Form.Control
                   type="text"
                   placeholder="Important"
                   value={this.state.important[0] || ""}
                   onChange={(e) => {
                     e.stopPropagation();
                     var a = this.state.important
                     a[0] = e.target.value
                     this.setState({important: a});
                   }}
                 />) : (
                  <Form.Control
                  type="text"
                  placeholder="Important"
                  value={""}
                  onChange={(e) => {
                    e.stopPropagation();
                    var a = this.state.important
                     a[0] = e.target.value
                     this.setState({important: a});
                  }}
                />
                 )
                  }
                </Col>
              </Row>
              <Row>
                <Col xs={50} style={{ paddingLeft: "70px" }}>
                {this.state.important.length >= 1 ?
                   (<Form.Control
                   type="text"
                   placeholder="Important"
                   value={this.state.important[1] || ""}
                   onChange={(e) => {
                     e.stopPropagation();
                     var a = this.state.important
                     a[1] = e.target.value
                     this.setState({important: a});
                   }}
                 />) : (
                  <Form.Control
                  type="text"
                  placeholder="Important"
                  value={""}
                  onChange={(e) => {
                    e.stopPropagation();
                    var a = this.state.important
                     a[1] = e.target.value
                     this.setState({important: a});
                  }}
                />
                 )
                  }
                </Col>
              </Row>
              <Row>
                <Col xs={50} style={{ paddingLeft: "70px" }}>
                {this.state.important.length >= 2 ?
                   (<Form.Control
                   type="text"
                   placeholder="Important"
                   value={this.state.important[2] || ""}
                   onChange={(e) => {
                     e.stopPropagation();
                     var a = this.state.important
                     a[2] = e.target.value
                     this.setState({important: a});
                   }}
                 />) : (
                  <Form.Control
                  type="text"
                  placeholder="Important"
                  value={""}
                  onChange={(e) => {
                    e.stopPropagation();
                    var a = this.state.important
                     a[2] = e.target.value
                     this.setState({important: a});
                  }}
                />
                 )
                  }
                </Col>
              </Row>
              <Row>
                <Col xs={50} style={{ paddingLeft: "70px" }}>
                {this.state.important.length >= 3 ?
                   (<Form.Control
                   type="text"
                   placeholder="Important"
                   value={this.state.important[3] || ""}
                   onChange={(e) => {
                     e.stopPropagation();
                     var a = this.state.important
                     a[3] = e.target.value
                     this.setState({important: a});
                   }}
                 />) : (
                  <Form.Control
                  type="text"
                  placeholder="Important"
                  value={""}
                  onChange={(e) => {
                    e.stopPropagation();
                    var a = this.state.important
                     a[3] = e.target.value
                     this.setState({important: a});
                  }}
                />
                 )
                  }
                </Col>
              </Row>
              <Row>
                <Col xs={50} style={{ paddingLeft: "70px" }}>
                {this.state.important.length >= 4 ?
                   (<Form.Control
                   type="text"
                   placeholder="Important"
                   value={this.state.important[4] || ""}
                   onChange={(e) => {
                     e.stopPropagation();
                     var a = this.state.important
                     a[4] = e.target.value
                     this.setState({important: a});
                   }}
                 />) : (
                  <Form.Control
                  type="text"
                  placeholder="Important"
                  value={""}
                  onChange={(e) => {
                    e.stopPropagation();
                    var a = this.state.important
                     a[4] = e.target.value
                     this.setState({important: a});
                  }}
                />
                 )
                  }
                </Col>
              </Row>
              <Row>
                <Col xs={50} style={{ paddingLeft: "70px" }}>
                {this.state.important.length >= 5 ?
                   (<Form.Control
                   type="text"
                   placeholder="Important"
                   value={this.state.important[5] || ""}
                   onChange={(e) => {
                     e.stopPropagation();
                     var a = this.state.important
                     a[5] = e.target.value
                     this.setState({important: a});
                   }}
                 />) : (
                  <Form.Control
                  type="text"
                  placeholder="Important"
                  value={""}
                  onChange={(e) => {
                    e.stopPropagation();
                    var a = this.state.important
                     a[5] = e.target.value
                     this.setState({important: a});
                  }}
                />
                 )
                  }
                </Col>
              </Row>
              <Row>
                <Col xs={50} style={{ paddingLeft: "70px" }}>
                {this.state.important.length >= 6 ?
                   (<Form.Control
                   type="text"
                   placeholder="Important"
                   value={this.state.important[6] || ""}
                   onChange={(e) => {
                     e.stopPropagation();
                     var a = this.state.important
                     a[6] = e.target.value
                     this.setState({important: a});
                   }}
                 />) : (
                  <Form.Control
                  type="text"
                  placeholder="Important"
                  value={""}
                  onChange={(e) => {
                    e.stopPropagation();
                    var a = this.state.important
                     a[6] = e.target.value
                     this.setState({important: a});
                  }}
                />
                 )
                  }
                </Col>
              </Row>
            </Form.Group>

            <Form.Group>
              <Form.Label>Happy:</Form.Label>
              <Row>
                <Col xs={50} style={{ paddingLeft: "70px" }}>
                {this.state.happy.length >= 0 ?
                   (<Form.Control
                   type="text"
                   placeholder="Happy"
                   value={this.state.happy[0] || ""}
                   onChange={(e) => {
                     e.stopPropagation();
                     var a = this.state.happy
                     a[0] = e.target.value
                     this.setState({happy: a});
                   }}
                 />) : (
                  <Form.Control
                  type="text"
                  placeholder="Happy"
                  value={""}
                  onChange={(e) => {
                    e.stopPropagation();
                    var a = this.state.happy
                     a[0] = e.target.value
                     this.setState({happy: a});
                  }}
                />
                 )
                  }
                </Col>
              </Row>
              <Row>
                <Col xs={50} style={{ paddingLeft: "70px" }}>
                {this.state.happy.length >= 1 ?
                   (<Form.Control
                   type="text"
                   placeholder="Happy"
                   value={this.state.happy[1] || ""}
                   onChange={(e) => {
                     e.stopPropagation();
                     var a = this.state.happy
                     a[1] = e.target.value
                     this.setState({happy: a});
                   }}
                 />) : (
                  <Form.Control
                  type="text"
                  placeholder="Happy"
                  value={""}
                  onChange={(e) => {
                    e.stopPropagation();
                    var a = this.state.happy
                    a[1] = e.target.value
                    this.setState({happy: a});
                  }}
                />
                 )
                  }
                </Col>
              </Row>
              <Row>
                <Col xs={50} style={{ paddingLeft: "70px" }}>
                {this.state.happy.length >= 2 ?
                   (<Form.Control
                   type="text"
                   placeholder="Happy"
                   value={this.state.happy[2] || ""}
                   onChange={(e) => {
                     e.stopPropagation();
                     var a = this.state.happy
                     a[2] = e.target.value
                     this.setState({happy: a});
                   }}
                 />) : (
                  <Form.Control
                  type="text"
                  placeholder="Happy"
                  value={""}
                  onChange={(e) => {
                    e.stopPropagation();
                    var a = this.state.happy
                     a[2] = e.target.value
                     this.setState({happy: a});
                  }}
                />
                 )
                  }
                </Col>
              </Row>
              <Row>
                <Col xs={50} style={{ paddingLeft: "70px" }}>
                {this.state.happy.length >= 3 ?
                   (<Form.Control
                   type="text"
                   placeholder="Happy"
                   value={this.state.happy[3] || ""}
                   onChange={(e) => {
                     e.stopPropagation();
                     var a = this.state.happy
                     a[3] = e.target.value
                     this.setState({happy: a});
                   }}
                 />) : (
                  <Form.Control
                  type="text"
                  placeholder="Happy"
                  value={""}
                  onChange={(e) => {
                    e.stopPropagation();
                    var a = this.state.happy
                     a[3] = e.target.value
                     this.setState({happy: a});
                  }}
                />
                 )
                  }
                </Col>
              </Row>
              <Row>
                <Col xs={50} style={{ paddingLeft: "70px" }}>
                {this.state.happy.length >= 4 ?
                   (<Form.Control
                   type="text"
                   placeholder="Happy"
                   value={this.state.happy[4] || ""}
                   onChange={(e) => {
                     e.stopPropagation();
                     var a = this.state.happy
                     a[4] = e.target.value
                     this.setState({happy: a});
                   }}
                 />) : (
                  <Form.Control
                  type="text"
                  placeholder="Happy"
                  value={""}
                  onChange={(e) => {
                    e.stopPropagation();
                    var a = this.state.happy
                     a[4] = e.target.value
                     this.setState({happy: a});
                  }}
                />
                 )
                  }
                </Col>
              </Row>
              <Row>
                <Col xs={50} style={{ paddingLeft: "70px" }}>
                {this.state.happy.length >= 5 ?
                   (<Form.Control
                   type="text"
                   placeholder="Happy"
                   value={this.state.happy[5] || ""}
                   onChange={(e) => {
                     e.stopPropagation();
                     var a = this.state.happy
                     a[5] = e.target.value
                     this.setState({happy: a});
                   }}
                 />) : (
                  <Form.Control
                  type="text"
                  placeholder="Happy"
                  value={""}
                  onChange={(e) => {
                    e.stopPropagation();
                    var a = this.state.happy
                     a[5] = e.target.value
                     this.setState({happy: a});
                  }}
                />
                 )
                  }
                </Col>
              </Row>
              <Row>
                <Col xs={50} style={{ paddingLeft: "70px" }}>
                {this.state.happy.length >= 6 ?
                   (<Form.Control
                   type="text"
                   placeholder="Happy"
                   value={this.state.happy[6] || ""}
                   onChange={(e) => {
                     e.stopPropagation();
                     var a = this.state.happy
                     a[6] = e.target.value
                     this.setState({happy: a});
                   }}
                 />) : (
                  <Form.Control
                  type="text"
                  placeholder="Happy"
                  value={""}
                  onChange={(e) => {
                    e.stopPropagation();
                    var a = this.state.happy
                     a[6] = e.target.value
                     this.setState({happy: a});
                  }}
                />
                 )
                  }
                </Col>
              </Row>
            </Form.Group>
          
          </Modal.Body>
          <Modal.Footer>
            <Container fluid>
            
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
                  <Button variant="secondary" onClick={this.hideFutureForm}>
                    Cancel
                  </Button>
                </Col>
              
              </Row>
            </Container>
          </Modal.Footer>
        </Modal.Dialog>
      
        
      </div>
    );
  }
}

export default FutureModal;
