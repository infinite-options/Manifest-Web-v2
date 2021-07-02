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
// import DateAndTimePickers from "./DatePicker";
import DatePicker from 'react-datepicker'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'


class PeopleModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // firebaseRootPath: firebase
      //   .firestore()
      //   .collection("users")
      //   .doc(this.props.theCurrentUserId),
     
      imageChanged: false,
      importantPeople1id: null,
      importantPeople2id: null,
      importantPeople3id: null,
      importantPeople4id: null,
      importantPeople5id: null,
      importantPeople6id: null,
      familyArray : {},
      friendsArray : {},
      peopleNamesArray: {},
      importantPoeplArrayLength: "0",
      importantPeople1: {
        have_pic: false,
        important: false,
        name: "",
        email: "",
        phone_number: "",
        pic: "",
        relationship: "",
        unique_id: "",
        url: "",
      },
      importantPeople2: {
        have_pic: false,
        important: false,
        name: "",
        email: "",
        phone_number: "",
        pic: "",
        relationship: "",
        unique_id: "",
        url: "",
      },
      importantPeople3: {
        have_pic: false,
        important: false,
        name: "",
        email: "",
        phone_number: "",
        pic: "",
        relationship: "",
        unique_id: "",
        url: "",
      },

      importantPeople4: {
        have_pic: false,
        important: false,
        name: "",
        email: "",
        phone_number: "",
        pic: "",
        relationship: "",
        unique_id: "",
        url: "",
      },
      importantPeople5: {
        have_pic: false,
        important: false,
        name: "",
        email: "",
        phone_number: "",
        pic: "",
        relationship: "",
        unique_id: "",
        url: "",
      },
      importantPeople6: {
        have_pic: false,
        important: false,
        name: "",
        email: "",
        phone_number: "",
        pic: "",
        relationship: "",
        unique_id: "",
        url: "",
      },

      ImporPersonOneChange: false,
      ImporPersonTwoChange: false,
      ImporPersonThreeChange: false,
      ImporPersonFourChange: false,
      ImporPersonFiveChange: false,
      ImporPersonSixChange: false,
      importantPeople1Previous: {},
      importantPeople2Previous: {},
      importantPeople3Previous: {},
      importantPeople4Previous: {},
      importantPeople5Previous: {},
      importantPeople6Previous: {},
      importantPeople1DocRefChanged: null,
      importantPeople2DocRefChanged: null,
      importantPeople3DocRefChanged: null,
      importantPeople4DocRefChanged: null,
      importantPeople5DocRefChanged: null,
      importantPeople6DocRefChanged: null,
      showAddNewPeopleModal: false,
      saveButtonEnabled: true,
      enableDropDown: false,
      url: "",
      allPeopleList: {},
      nonImportantPeople: {},
    };
  }

  componentDidMount() {
    this.grabFireBaseAllPeopleNames();
  }

  hidePeopleForm = (e) => {
    this.props.CameBackFalse();
  };

  setPhotoURLFunction1 = (photo, photo_url) => {
    let temp = this.state.importantPeople1;
    temp.pic = photo;
    temp.url = photo_url;
    temp.have_pic = true;
    this.setState({ importantPeople1: temp });
  };

  setPhotoURLFunction2 = (photo, photo_url) => {
    let temp = this.state.importantPeople2;
    temp.pic = photo;
    temp.url = photo_url;
    temp.have_pic = true;
    this.setState({ importantPeople2: temp });
    console.log(this.state.importantPeople2);
  };

  setPhotoURLFunction3 = (photo, photo_url) => {
    let temp = this.state.importantPeople3;
    temp.pic = photo;
    temp.url = photo_url;
    temp.have_pic = true;
    this.setState({ importantPeople3: temp });
  };

  setPhotoURLFunction4 = (photo, photo_url) => {
    let temp = this.state.importantPeople4;
    temp.pic = photo;
    temp.url = photo_url;
    temp.have_pic = true;
    this.setState({ importantPeople4: temp });
  };

  setPhotoURLFunction5 = (photo, photo_url) => {
    let temp = this.state.importantPeople5;
    temp.pic = photo;
    temp.url = photo_url;
    temp.have_pic = true;
    this.setState({ importantPeople5: temp });
  };

  setPhotoURLFunction6 = (photo, photo_url) => {
    let temp = this.state.importantPeople6;
    temp.pic = photo;
    temp.url = photo_url;
    temp.have_pic = true;
    this.setState({ importantPeople6: temp });
  };

  handleImpPeople1 = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const file2 = event.target.files[0]; //stores file uploaded in file
    console.log(file2);

    this.setState({
      saveButtonEnabled: false,
    });

    let targetFile = file2;
    if (
      targetFile !== null &&
      Object.keys(this.state.importantPeople1).length !== 0
    ) {
      let temp = this.state.importantPeople1;
      temp.have_pic = true;
      temp.pic = file2;
      temp.url = URL.createObjectURL(event.target.files[0]);
      this.setState({
        importantPeople1: temp,
        saveButtonEnabled: true,
      });
      console.log(this.state.url);
    }
    console.log(this.state.importantPeople1.url);
    console.log(event.target.files[0].name);
  };

  handleImpPeople2 = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const file3 = event.target.files[0]; //stores file uploaded in file
    console.log(file3);

    this.setState({
      saveButtonEnabled: false,
    });

    let targetFile = file3;
    if (
      targetFile !== null &&
      Object.keys(this.state.importantPeople2).length !== 0
    ) {
      let temp = this.state.importantPeople2;
      temp.have_pic = true;
      temp.pic = file3;
      temp.url = URL.createObjectURL(event.target.files[0]);
      this.setState({
        importantPeople2: temp,
        saveButtonEnabled: true,
      });
      console.log(this.state.url);
    }
    console.log(this.state.importantPeople2.pic);
    console.log(event.target.files[0].name);
  };

  handleImpPeople3 = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const file4 = event.target.files[0]; //stores file uploaded in file
    console.log(file4);

    this.setState({
      saveButtonEnabled: false,
    });

    let targetFile = file4;
    if (
      targetFile !== null &&
      Object.keys(this.state.importantPeople3).length !== 0
    ) {
      let temp = this.state.importantPeople3;
      temp.have_pic = true;
      temp.pic = file4;
      temp.url = URL.createObjectURL(event.target.files[0]);
      this.setState({
        importantPeople3: temp,
        saveButtonEnabled: true,
      });
      console.log(this.state.url);
    }
    console.log(this.state.importantPeople3.pic);
    console.log(event.target.files[0].name);
  };

  handleImpPeople4 = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const file2 = event.target.files[0]; //stores file uploaded in file
    console.log(file2);

    this.setState({
      saveButtonEnabled: false,
    });

    let targetFile = file2;
    if (
      targetFile !== null &&
      Object.keys(this.state.importantPeople4).length !== 0
    ) {
      let temp = this.state.importantPeople4;
      temp.have_pic = true;
      temp.pic = file2;
      temp.url = URL.createObjectURL(event.target.files[0]);
      this.setState({
        importantPeople4: temp,
        saveButtonEnabled: true,
      });
      console.log(this.state.url);
    }
    console.log(event.target.files[0].name);
  };


  handleImpPeople5 = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const file2 = event.target.files[0]; //stores file uploaded in file
    console.log(file2);

    this.setState({
      saveButtonEnabled: false,
    });

    let targetFile = file2;
    if (
      targetFile !== null &&
      Object.keys(this.state.importantPeople5).length !== 0
    ) {
      let temp = this.state.importantPeople5;
      temp.have_pic = true;
      temp.pic = file2;
      temp.url = URL.createObjectURL(event.target.files[0]);
      this.setState({
        importantPeople5: temp,
        saveButtonEnabled: true,
      });
      console.log(this.state.url);
    }
    console.log(event.target.files[0].name);
  };

  handleImpPeople6 = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const file2 = event.target.files[0]; //stores file uploaded in file
    console.log(file2);

    this.setState({
      saveButtonEnabled: false,
    });

    let targetFile = file2;
    if (
      targetFile !== null &&
      Object.keys(this.state.importantPeople6).length !== 0
    ) {
      let temp = this.state.importantPeople6;
      temp.have_pic = true;
      temp.pic = file2;
      temp.url = URL.createObjectURL(event.target.files[0]);
      this.setState({
        importantPeople6: temp,
        saveButtonEnabled: true,
      });
      console.log(this.state.url);
    }
    console.log(event.target.files[0].name);
  };


  // Currently working on right now
  grabFireBaseAllPeopleNames = () => {
    let url = this.props.BASE_URL + "listPeople/";

    let allPeopleList = {};
    let importantPeopleArray = [];
    let nonImportantPeople = {};
    let test = {};
    let impCount = 0;
    let familyList = {};
    let friendsList = {};

    axios
      .get(url + this.props.theCurrentUserId)
      .then((response) => {
        let peopleList = response.data.result.result;

        if (peopleList && peopleList.length !== 0) {

          peopleList.forEach((d, i) => {
            allPeopleList[d.ta_people_id] = d;
            
            if ((d.important.toLowerCase() === "true") && (importantPeopleArray.length < 6)) {
              importantPeopleArray.push(d);
              impCount++;
            } else if ((d.important.toLowerCase() === "false") || (importantPeopleArray.length == 6)){
              test[d.ta_people_id] = d.name;
              nonImportantPeople[d.ta_people_id] = d;
            }
          });

          if (importantPeopleArray.length >= 6) {
            
            this.setState({
              peopleNamesArray: test,
              enableDropDown: true,
              importantPoeplArrayLength: impCount,
              importantPeople1: importantPeopleArray[0],
              importantPeople2: importantPeopleArray[1],
              importantPeople3: importantPeopleArray[2],
              importantPeople4: importantPeopleArray[3],
              importantPeople5: importantPeopleArray[4],
              importantPeople6: importantPeopleArray[5],
              nonImportantPeople: nonImportantPeople,
              allPeopleList: allPeopleList,
            });
            let temp1 = this.state.importantPeople1;
            temp1.url = "";
            temp1.have_pic = this.state.importantPeople1.have_pic
              ? this.state.importantPeople1.have_pic.toLowerCase() === "true"
              : false;
            let temp2 = this.state.importantPeople2;
            temp2.url = "";
            temp2.have_pic = this.state.importantPeople2.have_pic
              ? this.state.importantPeople2.have_pic.toLowerCase() === "true"
              : false;
            let temp3 = this.state.importantPeople3;
            temp3.url = "";
            temp3.have_pic = this.state.importantPeople3.have_pic
              ? this.state.importantPeople3.have_pic.toLowerCase() === "true"
              : false;
              let temp4 = this.state.importantPeople4;

              temp4.url = "";
              temp4.have_pic = this.state.importantPeople4.have_pic
                ? this.state.importantPeople4.have_pic.toLowerCase() === "true"
                : false;
                let temp5 = this.state.importantPeople5;

                temp5.url = "";
                temp5.have_pic = this.state.importantPeople5.have_pic
                  ? this.state.importantPeople5.have_pic.toLowerCase() === "true"
                  : false;
                  let temp6 = this.state.importantPeople6;

              temp6.url = "";
              temp6.have_pic = this.state.importantPeople6.have_pic
                ? this.state.importantPeople6.have_pic.toLowerCase() === "true"
                : false;

            this.setState({
              importantPeople1: temp1,
              importantPeople2: temp2,
              importantPeople3: temp3,
              importantPeople4: temp4,
              importantPeople5: temp5,
              importantPeople6: temp6,
            });
          } else if (importantPeopleArray.length === 5) {
            
            this.setState({
              peopleNamesArray: test,
              enableDropDown: true,
              importantPoeplArrayLength: impCount,
              importantPeople1: importantPeopleArray[0],
              importantPeople2: importantPeopleArray[1],
              importantPeople3: importantPeopleArray[2],
              importantPeople4: importantPeopleArray[3],
              importantPeople5: importantPeopleArray[4],
              nonImportantPeople: nonImportantPeople,
              allPeopleList: allPeopleList,
            });
            let temp1 = this.state.importantPeople1;
            temp1.url = "";
            temp1.have_pic = this.state.importantPeople1.have_pic
              ? this.state.importantPeople1.have_pic.toLowerCase() === "true"
              : false;
            let temp2 = this.state.importantPeople2;
            temp2.url = "";
            temp2.have_pic = this.state.importantPeople2.have_pic
              ? this.state.importantPeople2.have_pic.toLowerCase() === "true"
              : false;
            let temp3 = this.state.importantPeople3;
            temp3.url = "";
            temp3.have_pic = this.state.importantPeople3.have_pic
              ? this.state.importantPeople3.have_pic.toLowerCase() === "true"
              : false;
              let temp4 = this.state.importantPeople4;

              temp4.url = "";
              temp4.have_pic = this.state.importantPeople4.have_pic
                ? this.state.importantPeople4.have_pic.toLowerCase() === "true"
                : false;
                let temp5 = this.state.importantPeople5;

                temp5.url = "";
                temp5.have_pic = this.state.importantPeople5.have_pic
                  ? this.state.importantPeople5.have_pic.toLowerCase() === "true"
                  : false;


            this.setState({
              importantPeople1: temp1,
              importantPeople2: temp2,
              importantPeople3: temp3,
              importantPeople4: temp4,
              importantPeople5: temp5,
            });
          } else if (importantPeopleArray.length === 4) {
            
            this.setState({
              peopleNamesArray: test,
              enableDropDown: true,
              importantPoeplArrayLength: impCount,
              importantPeople1: importantPeopleArray[0],
              importantPeople2: importantPeopleArray[1],
              importantPeople3: importantPeopleArray[2],
              importantPeople4: importantPeopleArray[3],
              
              nonImportantPeople: nonImportantPeople,
              allPeopleList: allPeopleList,
            });
            let temp1 = this.state.importantPeople1;
            temp1.url = "";
            temp1.have_pic = this.state.importantPeople1.have_pic
              ? this.state.importantPeople1.have_pic.toLowerCase() === "true"
              : false;
            let temp2 = this.state.importantPeople2;
            temp2.url = "";
            temp2.have_pic = this.state.importantPeople2.have_pic
              ? this.state.importantPeople2.have_pic.toLowerCase() === "true"
              : false;
            let temp3 = this.state.importantPeople3;
            temp3.url = "";
            temp3.have_pic = this.state.importantPeople3.have_pic
              ? this.state.importantPeople3.have_pic.toLowerCase() === "true"
              : false;
              let temp4 = this.state.importantPeople4;

              temp4.url = "";
              temp4.have_pic = this.state.importantPeople4.have_pic
                ? this.state.importantPeople4.have_pic.toLowerCase() === "true"
                : false;
               
            this.setState({
              importantPeople1: temp1,
              importantPeople2: temp2,
              importantPeople3: temp3,
              importantPeople4: temp4,
             
            });
          } else if (importantPeopleArray.length === 3) {
            
            this.setState({
              peopleNamesArray: test,
              enableDropDown: true,
              importantPoeplArrayLength: impCount,
              importantPeople1: importantPeopleArray[0],
              importantPeople2: importantPeopleArray[1],
              importantPeople3: importantPeopleArray[2],
            
              nonImportantPeople: nonImportantPeople,
              allPeopleList: allPeopleList,
            });
            let temp1 = this.state.importantPeople1;
            temp1.url = "";
            temp1.have_pic = this.state.importantPeople1.have_pic
              ? this.state.importantPeople1.have_pic.toLowerCase() === "true"
              : false;
            let temp2 = this.state.importantPeople2;
            temp2.url = "";
            temp2.have_pic = this.state.importantPeople2.have_pic
              ? this.state.importantPeople2.have_pic.toLowerCase() === "true"
              : false;
            let temp3 = this.state.importantPeople3;
            temp3.url = "";
            temp3.have_pic = this.state.importantPeople3.have_pic
              ? this.state.importantPeople3.have_pic.toLowerCase() === "true"
              : false;
             
            this.setState({
              importantPeople1: temp1,
              importantPeople2: temp2,
              importantPeople3: temp3,
           
            });
          }
          else if (importantPeopleArray.length === 2) {
            this.setState({
              peopleNamesArray: test,
              enableDropDown: true,
              importantPoeplArrayLength: importantPeopleArray.length,
              importantPeople1: importantPeopleArray[0],
              importantPeople2: importantPeopleArray[1],
              nonImportantPeople: nonImportantPeople,
              allPeopleList: allPeopleList,
            });
            let temp1 = this.state.importantPeople1;
            temp1.url = "";
            temp1.have_pic = this.state.importantPeople1.have_pic
              ? this.state.importantPeople1.have_pic.toLowerCase() === "true"
              : false;
            let temp2 = this.state.importantPeople2;
            temp2.url = "";
            temp2.have_pic = this.state.importantPeople2.have_pic
              ? this.state.importantPeople2.have_pic.toLowerCase() === "true"
              : false;

            this.setState({
              importantPeople1: temp1,
              importantPeople2: temp2,
            });
          } else if (importantPeopleArray.length === 1) {
            this.setState({
              peopleNamesArray: test,
              enableDropDown: true,
              importantPoeplArrayLength: importantPeopleArray.length,
              importantPeople1: importantPeopleArray[0],
              nonImportantPeople: nonImportantPeople,
              allPeopleList: allPeopleList,
            });
            let temp1 = this.state.importantPeople1;
            temp1.url = "";
            temp1.have_pic = this.state.importantPeople1.have_pic
              ? this.state.importantPeople1.have_pic.toLowerCase() === "true"
              : false;

            this.setState({
              importantPeople1: temp1,
            });
          } else if (importantPeopleArray.length === 0) {
            this.setState({
              peopleNamesArray: test,
              enableDropDown: true,
              importantPoeplArrayLength: importantPeopleArray.length,
              nonImportantPeople: nonImportantPeople,
              allPeopleList: allPeopleList,
            });
          }
        } else {
          console.log("No people list");
        }
      })
      .catch((err) => {
        console.log("Error getting all people list", err);
      });
  };
  
  hidePeopleModal = () => {
    this.setState({ showAddNewPeopleModal: false });
  };

  updatePeopleArray = () => {
    this.grabFireBaseAllPeopleNames();
  };


  changeImpPersonOne = (Reference) => {

    let temp = this.state.nonImportantPeople[Reference];
    console.log(temp)
    temp.important = true;
    temp.url = "";
    let nonImp = this.state.nonImportantPeople

    if(typeof(temp.have_pic) === "string"){
      temp.have_pic = temp.have_pic ? temp.have_pic.toLowerCase() === "true": false;
    }
    
    let temp2 = {};
    let test = this.state.peopleNamesArray

    temp2 = this.state.importantPeople1;
    test[temp2.ta_people_id] = temp2.name;

    if (this.state.ImporPersonOneChange === false) {
      temp2 = this.state.importantPeople1;
      temp2.important = false;
    } else {
      temp2 = this.state.importantPeople1Previous;
    }

    delete test[Reference]

    nonImp[temp2.ta_people_id] = temp2

    this.setState({
      ImporPersonOneChange: true,
      importantPeople1Previous: temp2,
      importantPeople1: temp,
      peopleNamesArray: test,
      nonImportantPeople: nonImp
    });

    
    console.log("Updated Important Person One in Client");
  };

  changeImpPersonTwo = (Reference) => {
    let temp = this.state.nonImportantPeople[Reference];
    console.log(temp)
    temp.important = true;
    temp.url = "";
    let nonImp = this.state.nonImportantPeople

    if(typeof(temp.have_pic) === "string"){
      temp.have_pic = temp.have_pic ? temp.have_pic.toLowerCase() === "true": false;
    }
    
    let temp2 = {};
    let test = this.state.peopleNamesArray

    temp2 = this.state.importantPeople2;
    test[temp2.ta_people_id] = temp2.name;

    if (this.state.ImporPersonTwoChange === false) {
      temp2 = this.state.importantPeople2;
      temp2.important = false;
    } else {
      temp2 = this.state.importantPeople2Previous;
    }

    delete test[Reference]

    nonImp[temp2.ta_people_id] = temp2

    this.setState({
      ImporPersonTwoChange: true,
      importantPeople2Previous: temp2,
      importantPeople2: temp,
      peopleNamesArray: test,
      nonImportantPeople: nonImp

    });

    
    console.log("Updated Important Person Two in Client");
  };

  
  changeImpPersonThree = (Reference) => {
    let temp = this.state.nonImportantPeople[Reference];
    console.log(temp)
    temp.important = true;
    temp.url = "";
    let nonImp = this.state.nonImportantPeople

    if(typeof(temp.have_pic) === "string"){
      temp.have_pic = temp.have_pic ? temp.have_pic.toLowerCase() === "true": false;
    }
    
    let temp2 = {};
    let test = this.state.peopleNamesArray

    temp2 = this.state.importantPeople3;
    test[temp2.ta_people_id] = temp2.name;

    if (this.state.ImporPersonThreeChange === false) {
      temp2 = this.state.importantPeople3;
      temp2.important = false;
    } else {
      temp2 = this.state.importantPeople3Previous;
    }

    delete test[Reference]

    nonImp[temp2.ta_people_id] = temp2

    this.setState({
      ImporPersonThreeChange: true,
      importantPeople3Previous: temp2,
      importantPeople3: temp,
      peopleNamesArray: test,
      nonImportantPeople: nonImp
    });

    
    console.log("Updated Important Person One in Client");
  };

  changeImpPersonFour = (Reference) => {
    let temp = this.state.nonImportantPeople[Reference];
    console.log(temp)
    temp.important = true;
    temp.url = "";
    let nonImp = this.state.nonImportantPeople

    if(typeof(temp.have_pic) === "string"){
      temp.have_pic = temp.have_pic ? temp.have_pic.toLowerCase() === "true": false;
    }
    
    let temp2 = {};
    let test = this.state.peopleNamesArray

    temp2 = this.state.importantPeople4;
    test[temp2.ta_people_id] = temp2.name;

    if (this.state.ImporPersonFourChange === false) {
      temp2 = this.state.importantPeople4;
      temp2.important = false;
    } else {
      temp2 = this.state.importantPeople4Previous;
    }

    delete test[Reference]

    nonImp[temp2.ta_people_id] = temp2

    this.setState({
      ImporPersonFourChange: true,
      importantPeople4Previous: temp2,
      importantPeople4: temp,
      peopleNamesArray: test,
      nonImportantPeople: nonImp
    });

    
    console.log("Updated Important Person One in Client");
  };

  changeImpPersonFive = (Reference) => {
    let temp = this.state.nonImportantPeople[Reference];
    console.log(temp)
    temp.important = true;
    temp.url = "";
    let nonImp = this.state.nonImportantPeople

    if(typeof(temp.have_pic) === "string"){
      temp.have_pic = temp.have_pic ? temp.have_pic.toLowerCase() === "true": false;
    }
    
    let temp2 = {};
    let test = this.state.peopleNamesArray

    temp2 = this.state.importantPeople5;
    test[temp2.ta_people_id] = temp2.name;

    if (this.state.ImporPersonFiveChange === false) {
      temp2 = this.state.importantPeople5;
      temp2.important = false;
    } else {
      temp2 = this.state.importantPeople5Previous;
    }

    delete test[Reference]

    nonImp[temp2.ta_people_id] = temp2

    this.setState({
      ImporPersonFiveChange: true,
      importantPeople5Previous: temp2,
      importantPeople5: temp,
      peopleNamesArray: test,
      nonImportantPeople: nonImp
    });

    
    console.log("Updated Important Person One in Client");
  };

  changeImpPersonSix = (Reference) => {
    let temp = this.state.nonImportantPeople[Reference];
    console.log(temp)
    temp.important = true;
    temp.url = "";
    let nonImp = this.state.nonImportantPeople

    if(typeof(temp.have_pic) === "string"){
      temp.have_pic = temp.have_pic ? temp.have_pic.toLowerCase() === "true": false;
    }
    
    let temp2 = {};
    let test = this.state.peopleNamesArray

    temp2 = this.state.importantPeople6;
    test[temp2.ta_people_id] = temp2.name;

    if (this.state.ImporPersonSixChange === false) {
      temp2 = this.state.importantPeople6;
      temp2.important = false;
    } else {
      temp2 = this.state.importantPeople6Previous;
    }

    delete test[Reference]

    nonImp[temp2.ta_people_id] = temp2

    this.setState({
      ImporPersonSixChange: true,
      importantPeople6Previous: temp2,
      importantPeople6: temp,
      peopleNamesArray: test,
      nonImportantPeople: nonImp
    });

    
    console.log("Updated Important Person One in Client");
  };

  newInputSubmit = () => {
   
    let people = Object.values(this.state.allPeopleList);

    people.forEach((d, i) => {
      if (d.email) delete d.email;
      // delete d.phone_number;
      if (d.user_id) delete d.user_id;
      if (d.user_name) delete d.user_name;
      if (d.user_uid) delete d.user_uid;
      if (!d.pic) d.pic = "";
    });

    if (this.state.importantPeople1.important === true) {
      if (this.state.ImporPersonOneChange === true) {
        if (this.state.importantPeople1Previous.ta_people_id) {
          this.state.allPeopleList[
            this.state.importantPeople1Previous.ta_people_id
          ].important = "FALSE";
        }
        this.state.allPeopleList[
          this.state.importantPeople1.ta_people_id
        ].important = "TRUE";
      }
    }

    if (this.state.importantPeople2.important === true) {
      if (this.state.ImporPersonTwoChange === true) {
        if (this.state.importantPeople2Previous.ta_people_id) {
          this.state.allPeopleList[
            this.state.importantPeople2Previous.ta_people_id
          ].important = "FALSE";
        }
        this.state.allPeopleList[
          this.state.importantPeople2.ta_people_id
        ].important = "TRUE";
      }
    }

    if (this.state.importantPeople3.important === true) {
      if (this.state.ImporPersonThreeChange === true) {
        if (this.state.importantPeople3Previous.ta_people_id) {
          this.state.allPeopleList[
            this.state.importantPeople3Previous.ta_people_id
          ].important = "FALSE";
        }
        this.state.allPeopleList[
          this.state.importantPeople3.ta_people_id
        ].important = "TRUE";
      }
    }

    if (this.state.importantPeople4.important === true) {
      if (this.state.ImporPersonFourChange === true) {
        if (this.state.importantPeople4Previous.ta_people_id) {
          this.state.allPeopleList[
            this.state.importantPeople4Previous.ta_people_id
          ].important = "FALSE";
        }
        this.state.allPeopleList[
          this.state.importantPeople4.ta_people_id
        ].important = "TRUE";
      }
    }

    if (this.state.importantPeople5.important === true) {
      if (this.state.ImporPersonFiveChange === true) {
        if (this.state.importantPeople5Previous.ta_people_id) {
          this.state.allPeopleList[
            this.state.importantPeople5Previous.ta_people_id
          ].important = "FALSE";
        }
        this.state.allPeopleList[
          this.state.importantPeople5.ta_people_id
        ].important = "TRUE";
      }
    }

    if (this.state.importantPeople6.important === true) {
      if (this.state.ImporPersonSixChange === true) {
        if (this.state.importantPeople6Previous.ta_people_id) {
          this.state.allPeopleList[
            this.state.importantPeople6Previous.ta_people_id
          ].important = "FALSE";
        }
        this.state.allPeopleList[
          this.state.importantPeople6.ta_people_id
        ].important = "TRUE";
      }
    }

    for (let i = 0; i < people.length; ++i) {
      let currentPeople = {};
      currentPeople.user_id = this.props.theCurrentUserId;
      currentPeople.ta_people_id = people[i].ta_people_id;
      currentPeople.have_pic = people[i].have_pic;
      if (typeof people[i].pic === "string") {
        currentPeople.photo_url = people[i].pic;
        currentPeople.pic = "";
      } else {
        currentPeople.pic = people[i].pic;
        currentPeople.photo_url = "";
      }
      currentPeople.pic = people[i].pic;
      currentPeople.important = people[i].important;
      currentPeople.name = people[i].name;
      currentPeople.relationship = people[i].relationship;
      currentPeople.phone_number = people[i].phone_number;
      currentPeople.ta_id = this.props.theCurrentTAId;
      let peopleUrl = this.props.BASE_URL + "updatePeople";

      let peopleFormData = new FormData();
      Object.entries(currentPeople).forEach((entry) => {
        if(entry[0] === 'pic'){
            if(entry[1].name !== undefined){
              if (typeof entry[1].name == "string") {
                peopleFormData.append(entry[0], entry[1]);
              }
            }
          }
         else if (entry[1] instanceof Object) {
          entry[1] = JSON.stringify(entry[1]);
          peopleFormData.append(entry[0], entry[1]);
        } else {
          peopleFormData.append(entry[0], entry[1]);
        }
      });

      axios
        .post(peopleUrl, peopleFormData)
        .then(() => {
          console.log("Updated Details");
          this.hidePeopleForm();
        })
        .catch((err) => {
          console.log("Error updating Details", err);
        });
    }
   };

  

  render() {
    const selectStyle = {
      display: "inline-block",
    };
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
              this.hidePeopleForm();
            }}
          >
            <Modal.Title>
              <h5 className="normalfancytext">Important People</h5>{" "}
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form.Group>

              <Row>
                <Col>
                  {this.state.importantPeople1.have_pic === false ? (
                    <div>
                      <FontAwesomeIcon
                        icon={faImage}
                        size="6x"
                        style={{ marginLeft: "5px" }}
                      />
                      {this.state.importantPeople1.important === false ? (
                        <input
                          style={{
                            color: "transparent",
                            marginTop: "15px",
                            width: "100px",
                            overflow: "hidden",
                          }}
                          type="file"
                          accept="image/*"
                          disabled
                        />
                      ) : (
                        <UploadPeopleImages
                          parentFunction={this.setPhotoURLFunction1}
                          currentTAId={this.props.theCurrentTAId}
                          BASE_URL={this.props.BASE_URL}
                        />
                      )}
                    </div>
                  ) : (
                    <div>
                      {this.state.importantPeople1.url === "" ? (
                        <img
                          style={{
                            display: "block",
                            width: "80%",
                            height: "70px",
                            marginTop: "10px",
                            marginLeft: "5px",
                          }}
                          src={this.state.importantPeople1.pic}
                          alt="Important People 1"
                        />
                      ) : (
                        <img
                          style={{
                            display: "block",
                            width: "80%",
                            height: "70px",
                            marginTop: "10px",
                            marginLeft: "5px",
                          }}
                          src={this.state.importantPeople1.url}
                          alt="Important People 1"
                        />
                      )}
                      <UploadPeopleImages
                        parentFunction={this.setPhotoURLFunction1}
                        currentTAId={this.props.theCurrentTAId}
                        BASE_URL={this.props.BASE_URL}
                      />
                    </div>
                  )}
                </Col>
                <Col xs={7} style={{ paddingLeft: "0px", marginTop: "10px" }}>
                  <div className="d-flex flex-row">
                    {this.state.importantPeople1.important === false ? (
                      <Form.Control
                        style={{ width: "150px", display: "inline-block" }}
                        type="text"
                        placeholder="Name ..."
                        value=""
                        disabled
                      />
                    ) : (
                      <Form.Control
                        style={{ width: "150px", display: "inline-block" }}
                        type="text"
                        placeholder="Name ..."
                        value={this.state.importantPeople1.name || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          let temp = this.state.importantPeople1;
                          temp.name = e.target.value;
                          this.setState({ importantPeople1: temp });
                        }}
                      />
                    )}
                    {this.state.enableDropDown === false ? (
                      <DropdownButton
                        style={{ display: "inline-block" }}
                        title=""
                        disabled
                      ></DropdownButton>
                    ) : (
                      <DropdownButton title="">
                        {Object.keys(this.state.peopleNamesArray).map(
                          (keyName, keyIndex) => (
                            // use keyName to get current key's name
                            // and a[keyName] to get its value
                            <Dropdown.Item
                              key={keyName}
                              onClick={(e) => {
                                this.changeImpPersonOne(keyName);
                              }}
                            >
                              {this.state.peopleNamesArray[keyName]}
                            </Dropdown.Item>
                          )
                        )}
                      </DropdownButton>
                    )}
                  </div>
                  {this.state.importantPeople1.important === false ? (
                    <div>
                      <Form.Control
                        type="text"
                        placeholder="Relationship"
                        value=""
                        disabled
                      />
                      <Form.Control
                        type="text"
                        placeholder="Phone Number"
                        value=""
                        disabled
                      />
                      <Form.Control type="text" placeholder="Email" value="" />
                    </div>
                  ) : (
                    <div>
                      <DropdownButton
                title={this.state.importantPeople1.relationship}
                style={selectStyle}
                variant="light"
              >
                <Dropdown.Item
                  eventKey="Family"
                  onSelect={(eventKey) => {
                    let temp = this.state.importantPeople1;
                    temp.relationship = eventKey;
                    this.setState({ importantPeople1: temp });
                  }}
                >
                  Family
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="Friends"
                  onSelect={(eventKey) => {
                    let temp = this.state.importantPeople1;
                    temp.relationship = eventKey;
                    this.setState({ importantPeople1: temp });
                  }
                  }
                >
                  Friends
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="Advisor"
                  onSelect={(eventKey) => {
                    let temp = this.state.importantPeople1;
                    temp.relationship = eventKey;
                    this.setState({ importantPeople1: temp });
                  }}
                >
                  Advisor
                </Dropdown.Item>
               
              </DropdownButton>
                      <Form.Control
                        type="text"
                        placeholder="Phone Number"
                        value={this.state.importantPeople1.phone_number || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          let temp = this.state.importantPeople1;
                          temp.phone_number = e.target.value;
                          this.setState({ importantPeople1: temp });
                        }}
                      />
                      <Form.Control
                        type="text"
                        placeholder="Email"
                        value={this.state.importantPeople1.email || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          let temp = this.state.importantPeople1;
                          temp.email = e.target.value;
                          this.setState({ importantPeople1: temp });
                        }}
                      />
                    </div>
                  )}
                </Col>
                {this.state.importantPeople1.important === false && (
                  <p style={{ fontSize: "0.9em", marginLeft: "20px" }}>
                    {" "}
                    Choose a person or add a new one
                  </p>
                )}
              </Row>
              <Row>
                <Col>
                  {this.state.importantPeople2.have_pic === false ? (
                    <div>
                      <FontAwesomeIcon
                        icon={faImage}
                        size="6x"
                        style={{ marginLeft: "5px" }}
                      />
                      {this.state.importantPeople2.important === false ? (
                        <input
                          style={{
                            color: "transparent",
                            marginTop: "15px",
                            width: "100px",
                            overflow: "hidden",
                          }}
                          type="file"
                          accept="image/*"
                          disabled
                        />
                      ) : (
                        <UploadPeopleImages
                          parentFunction={this.setPhotoURLFunction2}
                          currentTAId={this.props.theCurrentTAId}
                          BASE_URL={this.props.BASE_URL}
                        />
                      )}
                    </div>
                  ) : (
                    <div>
                      {this.state.importantPeople2.url === "" ? (
                        <img
                          style={{
                            display: "block",
                            width: "80%",
                            height: "70px",
                            marginTop: "10px",
                            marginLeft: "5px",
                          }}
                          src={this.state.importantPeople2.pic}
                          alt="Important People 2"
                        />
                      ) : (
                        <img
                          style={{
                            display: "block",
                            width: "80%",
                            height: "70px",
                            marginTop: "10px",
                            marginLeft: "5px",
                          }}
                          src={this.state.importantPeople2.url}
                          alt="Important People 1"
                        />
                      )}
                      <UploadPeopleImages
                        parentFunction={this.setPhotoURLFunction2}
                        currentTAId={this.props.theCurrentTAId}
                        BASE_URL={this.props.BASE_URL}
                      />
                    </div>
                  )}
                </Col>
                <Col xs={7} style={{ paddingLeft: "0px", marginTop: "10px" }}>
                  <div className="d-flex flex-row">
                    {this.state.importantPeople2.important === false ? (
                      <Form.Control
                        style={{ width: "150px", display: "inline-block" }}
                        type="text"
                        placeholder="Name ..."
                        value=""
                        disabled
                      />
                    ) : (
                      <Form.Control
                        style={{ width: "150px", display: "inline-block" }}
                        type="text"
                        placeholder="Name ..."
                        value={this.state.importantPeople2.name || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          let temp = this.state.importantPeople2;
                          temp.name = e.target.value;
                          this.setState({ importantPeople2: temp });
                        }}
                      />
                    )}
                    {this.state.enableDropDown === false ? (
                      <DropdownButton
                        style={{ display: "inline-block" }}
                        title=""
                        disabled
                      ></DropdownButton>
                    ) : (
                      <DropdownButton title="">
                        {Object.keys(this.state.peopleNamesArray).map(
                          (keyName, keyIndex) => (
                            // use keyName to get current key's name
                            // and a[keyName] to get its value
                            <Dropdown.Item
                              key={keyName}
                              onClick={(e) => {
                                this.changeImpPersonTwo(keyName);
                              }}
                            >
                              {this.state.peopleNamesArray[keyName]}
                            </Dropdown.Item>
                          )
                        )}
                      </DropdownButton>
                    )}
                  </div>
                  {this.state.importantPeople2.important === false ? (
                    <div>
                      <Form.Control
                        type="text"
                        placeholder="Relationship"
                        value=""
                        disabled
                      />
                      <Form.Control
                        type="text"
                        placeholder="Phone Number"
                        value=""
                        disabled
                      />
                      <Form.Control type="text" placeholder="Email" value="" />
                    </div>
                  ) : (
                    <div>
                          <DropdownButton
                title={this.state.importantPeople2.relationship}
                style={selectStyle}
                variant="light"
              >
                <Dropdown.Item
                  eventKey="Family"
                  onSelect={(eventKey) => {
                    let temp = this.state.importantPeople2;
                    temp.relationship = eventKey;
                    this.setState({ importantPeople2: temp });
                  }}
                >
                  Family
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="Friends"
                  onSelect={(eventKey) => {
                    let temp = this.state.importantPeople2;
                    temp.relationship = eventKey;
                    this.setState({ importantPeople2: temp });
                  }}
                >
                  Friends
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="Advisor"
                  onSelect={(eventKey) => {
                    let temp = this.state.importantPeople2;
                    temp.relationship = eventKey;
                    this.setState({ importantPeople2: temp });
                  }}
                >
                  Advisor
                </Dropdown.Item>
               
              </DropdownButton>
                      <Form.Control
                        type="text"
                        placeholder="Phone Number"
                        value={this.state.importantPeople2.phone_number || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          let temp = this.state.importantPeople2;
                          temp.phone_number = e.target.value;
                          this.setState({ importantPeople2: temp });
                        }}
                      />
                      <Form.Control
                        type="text"
                        placeholder="Email"
                        value={this.state.importantPeople2.email || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          let temp = this.state.importantPeople2;
                          temp.email = e.target.value;
                          this.setState({ importantPeople2: temp });
                        }}
                      />
                    </div>
                  )}
                </Col>
                {this.state.importantPeople2.important === false && (
                  <p style={{ fontSize: "0.9em", marginLeft: "20px" }}>
                    {" "}
                    Choose a person or add a new one
                  </p>
                )}
              </Row>
             
              <Row>
                <Col>
                  {this.state.importantPeople3.have_pic === false ? (
                    <div>
                      <FontAwesomeIcon
                        icon={faImage}
                        size="6x"
                        style={{ marginLeft: "5px" }}
                      />
                      {this.state.importantPeople3.important === false ? (
                        <input
                          style={{
                            color: "transparent",
                            marginTop: "15px",
                            width: "100px",
                            overflow: "hidden",
                          }}
                          type="file"
                          accept="image/*"
                          disabled
                        />
                      ) : (
                        <UploadPeopleImages
                          parentFunction={this.setPhotoURLFunction3}
                          currentTAId={this.props.theCurrentTAId}
                          BASE_URL={this.props.BASE_URL}
                        />
                      )}
                    </div>
                  ) : (
                    <div>
                      {this.state.importantPeople3.url === "" ? (
                        <img
                          style={{
                            display: "block",
                            width: "80%",
                            height: "70px",
                            marginTop: "10px",
                            marginLeft: "5px",
                          }}
                          src={this.state.importantPeople3.pic}
                          alt="Important People 1"
                        />
                      ) : (
                        <img
                          style={{
                            display: "block",
                            width: "80%",
                            height: "70px",
                            marginTop: "10px",
                            marginLeft: "5px",
                          }}
                          src={this.state.importantPeople3.url}
                          alt="Important People 1"
                        />
                      )}
                      <UploadPeopleImages
                        parentFunction={this.setPhotoURLFunction3}
                        currentTAId={this.props.theCurrentTAId}
                        BASE_URL={this.props.BASE_URL}
                      />
                    </div>
                  )}
                </Col>
                <Col xs={7} style={{ paddingLeft: "0px", marginTop: "10px" }}>
                  <div className="d-flex flex-row">
                    {this.state.importantPeople3.important === false ? (
                      <Form.Control
                        style={{ width: "150px", display: "inline-block" }}
                        type="text"
                        placeholder="Name ..."
                        value=""
                        disabled
                      />
                    ) : (
                      <Form.Control
                        style={{ width: "150px", display: "inline-block" }}
                        type="text"
                        placeholder="Name ..."
                        value={this.state.importantPeople3.name || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          let temp = this.state.importantPeople3;
                          temp.name = e.target.value;
                          this.setState({ importantPeople3: temp });
                        }}
                      />
                    )}
                    {this.state.enableDropDown === false ? (
                      <DropdownButton
                        style={{ display: "inline-block" }}
                        title=""
                        disabled
                      ></DropdownButton>
                    ) : (
                      <DropdownButton title="">
                        {Object.keys(this.state.peopleNamesArray).map(
                          (keyName, keyIndex) => (
                            // use keyName to get current key's name
                            // and a[keyName] to get its value
                            <Dropdown.Item
                              key={keyName}
                              onClick={(e) => {
                                this.changeImpPersonThree(keyName);
                              }}
                            >
                              {this.state.peopleNamesArray[keyName]}
                            </Dropdown.Item>
                          )
                        )}
                      </DropdownButton>
                    )}
                  </div>
                  {this.state.importantPeople3.important === false ? (
                    <div>
                      <Form.Control
                        type="text"
                        placeholder="Relationship"
                        value=""
                        disabled
                      />
                      <Form.Control
                        type="text"
                        placeholder="Phone Number"
                        value=""
                        disabled
                      />
                      <Form.Control type="text" placeholder="Email" value="" />
                    </div>
                  ) : (
                    <div>
                          <DropdownButton
                title={this.state.importantPeople3.relationship}
                style={selectStyle}
                variant="light"
              >
                <Dropdown.Item
                  eventKey="Family"
                  onSelect={(eventKey) => {
                    let temp = this.state.importantPeople3;
                    temp.relationship = eventKey;
                    this.setState({ importantPeople3: temp });
                  }}
                >
                  Family
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="Friends"
                  onSelect={(eventKey) => {
                    let temp = this.state.importantPeople3;
                    temp.relationship = eventKey;
                    this.setState({ importantPeople3: temp });
                  }
                  }
                >
                  Friends
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="Advisor"
                  onSelect={(eventKey) => {
                    let temp = this.state.importantPeople3;
                    temp.relationship = eventKey;
                    this.setState({ importantPeople3: temp });
                  }}
                >
                  Advisor
                </Dropdown.Item>
               
              </DropdownButton>
                      <Form.Control
                        type="text"
                        placeholder="Phone Number"
                        value={this.state.importantPeople3.phone_number || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          let temp = this.state.importantPeople3;
                          temp.phone_number = e.target.value;
                          this.setState({ importantPeople3: temp });
                        }}
                      />
                      <Form.Control
                        type="text"
                        placeholder="Email"
                        value={this.state.importantPeople3.email || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          let temp = this.state.importantPeople3;
                          temp.email = e.target.value;
                          this.setState({ importantPeople3: temp });
                        }}
                      />
                    </div>
                  )}
                </Col>
               
              </Row>

              <Row>
                <Col>
                  {this.state.importantPeople4.have_pic === false ? (
                    <div>
                      <FontAwesomeIcon
                        icon={faImage}
                        size="6x"
                        style={{ marginLeft: "5px" }}
                      />
                      {this.state.importantPeople4.important === false ? (
                        <input
                          style={{
                            color: "transparent",
                            marginTop: "15px",
                            width: "100px",
                            overflow: "hidden",
                          }}
                          type="file"
                          accept="image/*"
                          disabled
                        />
                      ) : (
                        <UploadPeopleImages
                          parentFunction={this.setPhotoURLFunction4}
                          currentTAId={this.props.theCurrentTAId}
                          BASE_URL={this.props.BASE_URL}
                        />
                      )}
                    </div>
                  ) : (
                    <div>
                      {this.state.importantPeople4.url === "" ? (
                        <img
                          style={{
                            display: "block",
                            width: "80%",
                            height: "70px",
                            marginTop: "10px",
                            marginLeft: "5px",
                          }}
                          src={this.state.importantPeople4.pic}
                          alt="Important People 4"
                        />
                      ) : (
                        <img
                          style={{
                            display: "block",
                            width: "80%",
                            height: "70px",
                            marginTop: "10px",
                            marginLeft: "5px",
                          }}
                          src={this.state.importantPeople4.url}
                          alt="Important People 4"
                        />
                      )}
                      <UploadPeopleImages
                        parentFunction={this.setPhotoURLFunction4}
                        currentTAId={this.props.theCurrentTAId}
                        BASE_URL={this.props.BASE_URL}
                      />
                    </div>
                  )}
                </Col>
                <Col xs={7} style={{ paddingLeft: "0px", marginTop: "10px" }}>
                  <div className="d-flex flex-row">
                    {this.state.importantPeople4.important === false ? (
                      <Form.Control
                        style={{ width: "150px", display: "inline-block" }}
                        type="text"
                        placeholder="Name ..."
                        value=""
                        disabled
                      />
                    ) : (
                      <Form.Control
                        style={{ width: "150px", display: "inline-block" }}
                        type="text"
                        placeholder="Name ..."
                        value={this.state.importantPeople4.name || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          let temp = this.state.importantPeople4;
                          temp.name = e.target.value;
                          this.setState({ importantPeople4: temp });
                        }}
                      />
                    )}
                    {this.state.enableDropDown === false ? (
                      <DropdownButton
                        style={{ display: "inline-block" }}
                        title=""
                        disabled
                      ></DropdownButton>
                    ) : (
                      <DropdownButton title="">
                        {Object.keys(this.state.peopleNamesArray).map(
                          (keyName, keyIndex) => (
                            // use keyName to get current key's name
                            // and a[keyName] to get its value
                            <Dropdown.Item
                              key={keyName}
                              onClick={(e) => {
                                this.changeImpPersonFour(keyName);
                              }}
                            >
                              {this.state.peopleNamesArray[keyName]}
                            </Dropdown.Item>
                          )
                        )}
                      </DropdownButton>
                    )}
                  </div>
                  {this.state.importantPeople4.important === false ? (
                    <div>
                      <Form.Control
                        type="text"
                        placeholder="Relationship"
                        value=""
                        disabled
                      />
                      <Form.Control
                        type="text"
                        placeholder="Phone Number"
                        value=""
                        disabled
                      />
                      <Form.Control type="text" placeholder="Email" value="" />
                    </div>
                  ) : (
                    <div>
                          <DropdownButton
                title={this.state.importantPeople4.relationship}
                style={selectStyle}
                variant="light"
              >
                <Dropdown.Item
                  eventKey="Family"
                  onSelect={(eventKey) => {
                    let temp = this.state.importantPeople4;
                    temp.relationship = eventKey;
                    this.setState({ importantPeople4: temp });
                  }}
                >
                  Family
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="Friends"
                  onSelect={(eventKey) => {
                    let temp = this.state.importantPeople4;
                    temp.relationship = eventKey;
                    this.setState({ importantPeople4: temp });
                  }
                  }
                >
                  Friends
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="Advisor"
                  onSelect={(eventKey) => {
                    let temp = this.state.importantPeople4;
                    temp.relationship = eventKey;
                    this.setState({ importantPeople4: temp });
                  }}
                >
                  Advisor
                </Dropdown.Item>
               
              </DropdownButton>
                      <Form.Control
                        type="text"
                        placeholder="Phone Number"
                        value={this.state.importantPeople4.phone_number || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          let temp = this.state.importantPeople4;
                          temp.phone_number = e.target.value;
                          this.setState({ importantPeople4: temp });
                        }}
                      />
                      <Form.Control
                        type="text"
                        placeholder="Email"
                        value={this.state.importantPeople4.email || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          let temp = this.state.importantPeople4;
                          temp.email = e.target.value;
                          this.setState({ importantPeople4: temp });
                        }}
                      />
                    </div>
                  )}
                </Col>
               
              </Row>
             
              <Row style={{ marginTop: "20px" }}>
                <Col>
                  {this.state.importantPeople5.have_pic === false ? (
                    <div>
                      <FontAwesomeIcon
                        icon={faImage}
                        size="6x"
                        style={{ marginLeft: "5px" }}
                      />
                      {this.state.importantPeople5.important === false ? (
                        <input
                          style={{
                            color: "transparent",
                            marginTop: "15px",
                            width: "100px",
                            overflow: "hidden",
                          }}
                          type="file"
                          accept="image/*"
                          disabled
                        />
                      ) : (
                        <UploadPeopleImages
                          parentFunction={this.setPhotoURLFunction5}
                          currentTAId={this.props.theCurrentTAId}
                          BASE_URL={this.props.BASE_URL}
                        />
                      )}
                    </div>
                  ) : (
                    <div>
                      {this.state.importantPeople5.url === "" ? (
                        <img
                          style={{
                            display: "block",
                            width: "80%",
                            height: "70px",
                            marginTop: "10px",
                            marginLeft: "5px",
                          }}
                          src={this.state.importantPeople5.pic}
                          alt="Important People 2"
                        />
                      ) : (
                        <img
                          style={{
                            display: "block",
                            width: "80%",
                            height: "70px",
                            marginTop: "10px",
                            marginLeft: "5px",
                          }}
                          src={this.state.importantPeople5.url}
                          alt="Important People 2"
                        />
                      )}
                      <UploadPeopleImages
                        parentFunction={this.setPhotoURLFunction5}
                        currentTAId={this.props.theCurrentTAId}
                        BASE_URL={this.props.BASE_URL}
                      />
                    </div>
                  )}
                </Col>
                <Col xs={7} style={{ paddingLeft: "0px", marginTop: "10px" }}>
                  <div className="d-flex flex-row">
                    {this.state.importantPeople5.important === false ? (
                      <Form.Control
                        style={{ width: "150px", display: "inline-block" }}
                        type="text"
                        placeholder="Name ..."
                        value=""
                        disabled
                      />
                    ) : (
                      <Form.Control
                        style={{ width: "150px", display: "inline-block" }}
                        type="text"
                        placeholder="Name ..."
                        value={this.state.importantPeople5.name || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          let temp = this.state.importantPeople5;
                          temp.name = e.target.value;
                          this.setState({ importantPeople5: temp });
                        }}
                      />
                    )}

                    {this.state.enableDropDown === false ? (
                      <DropdownButton
                        style={{ display: "inline-block" }}
                        title=""
                        disabled
                      ></DropdownButton>
                    ) : (
                      <DropdownButton title="">
                        {Object.keys(this.state.peopleNamesArray).map(
                          (keyName, keyIndex) => (
                            // use keyName to get current key's name
                            // and a[keyName] to get its value
                            <Dropdown.Item
                              key={keyName}
                              onClick={(e) => {
                                this.changeImpPersonFive(keyName);
                              }}
                            >
                              {this.state.peopleNamesArray[keyName]}
                            </Dropdown.Item>
                          )
                        )}
                      </DropdownButton>
                    )}
                  </div>
                  {this.state.importantPeople5.important === false ? (
                    <div>
                      <Form.Control
                        type="text"
                        placeholder="Relationship"
                        value=""
                        disabled
                      />
                      <Form.Control
                        type="text"
                        placeholder="Phone Number"
                        value=""
                        disabled
                      />
                      <Form.Control type="text" placeholder="Email" value="" />
                    </div>
                  ) : (
                    <div>
                          <DropdownButton
                title={this.state.importantPeople5.relationship}
                style={selectStyle}
                variant="light"
              >
                <Dropdown.Item
                  eventKey="Family"
                  onSelect={(eventKey) => {
                    let temp = this.state.importantPeople5;
                    temp.relationship = eventKey;
                    this.setState({ importantPeople5: temp });
                  }}
                >
                  Family
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="Friends"
                  onSelect={(eventKey) => {
                    let temp = this.state.importantPeople5;
                    temp.relationship = eventKey;
                    this.setState({ importantPeople5: temp });
                  }
                  }
                >
                  Friends
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="Advisor"
                  onSelect={(eventKey) => {
                    let temp = this.state.importantPeople5;
                    temp.relationship = eventKey;
                    this.setState({ importantPeople5: temp });
                  }}
                >
                  Advisor
                </Dropdown.Item>
               
              </DropdownButton>
                      <Form.Control
                        type="text"
                        placeholder="Phone Number"
                        value={this.state.importantPeople5.phone_number || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          let temp = this.state.importantPeople5;
                          temp.phone_number = e.target.value;
                          this.setState({ importantPeople5: temp });
                        }}
                      />
                      <Form.Control
                        type="text"
                        placeholder="Email"
                        value={this.state.importantPeople5.email || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          let temp = this.state.importantPeople5;
                          temp.email = e.target.value;
                          this.setState({ importantPeople5: temp });
                        }}
                      />
                    </div>
                  )}
                </Col>
               
              </Row>
              <Row style={{ marginTop: "20px" }}>
                <Col>
                  {this.state.importantPeople6.have_pic === false ? (
                    <div>
                      <FontAwesomeIcon
                        icon={faImage}
                        size="6x"
                        style={{ marginLeft: "5px" }}
                      />
                      {this.state.importantPeople6.important === false ? (
                        <input
                          style={{
                            color: "transparent",
                            marginTop: "15px",
                            width: "100px",
                            overflow: "hidden",
                          }}
                          type="file"
                          accept="image/*"
                          disabled
                        />
                      ) : (
                        <UploadPeopleImages
                          parentFunction={this.setPhotoURLFunction6}
                          currentTAId={this.props.theCurrentTAId}
                          BASE_URL={this.props.BASE_URL}
                        />
                      )}
                    </div>
                  ) : (
                    <div>
                      {this.state.importantPeople6.url === "" ? (
                        <img
                          style={{
                            display: "block",
                            width: "80%",
                            height: "70px",
                            marginTop: "10px",
                            marginLeft: "5px",
                          }}
                          src={this.state.importantPeople6.pic}
                          alt="Important People 6"
                        />
                      ) : (
                        <img
                          style={{
                            display: "block",
                            width: "80%",
                            height: "70px",
                            marginTop: "10px",
                            marginLeft: "5px",
                          }}
                          src={this.state.importantPeople6.url}
                          alt="Important People 3"
                        />
                      )}

                      <UploadPeopleImages
                        parentFunction={this.setPhotoURLFunction6}
                        currentTAId={this.props.theCurrentTAId}
                        BASE_URL={this.props.BASE_URL}
                      />
                    </div>
                  )}
                </Col>
                <Col xs={7} style={{ paddingLeft: "0px", marginTop: "15px" }}>
                  <div className="d-flex flex-row">
                    {this.state.importantPeople6.important === false ? (
                      <Form.Control
                        style={{ width: "150px", display: "inline-block" }}
                        type="text"
                        placeholder="Name ..."
                        value=""
                        disabled
                      />
                    ) : (
                      <Form.Control
                        style={{ width: "150px", display: "inline-block" }}
                        type="text"
                        placeholder="Name ..."
                        value={this.state.importantPeople6.name || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          let temp = this.state.importantPeople6;
                          temp.name = e.target.value;
                          this.setState({ importantPeople6: temp });
                        }}
                      />
                    )}

                    {this.state.enableDropDown === false ? (
                      <DropdownButton
                        style={{ display: "inline-block" }}
                        title=""
                        disabled
                      ></DropdownButton>
                    ) : (
                      <DropdownButton title="">
                        {Object.keys(this.state.peopleNamesArray).map(
                          (keyName, keyIndex) => (
                            // use keyName to get current key's name
                            // and a[keyName] to get its value
                            <Dropdown.Item
                              key={keyName}
                              onClick={(e) => {
                                this.changeImpPersonSix(keyName);
                              }}
                            >
                              {this.state.peopleNamesArray[keyName]}
                            </Dropdown.Item>
                          )
                        )}
                      </DropdownButton>
                    )}
                  </div>
                  {this.state.importantPeople6.important === false ? (
                    <div>
                      <Form.Control
                        type="text"
                        placeholder="Relationship"
                        value=""
                        disabled
                      />
                      <Form.Control
                        type="text"
                        placeholder="Phone Number"
                        value=""
                        disabled
                      />
                      <Form.Control type="text" placeholder="Email" value="" />
                    </div>
                  ) : (
                    <div>
                          <DropdownButton
                title={this.state.importantPeople6.relationship}
                style={selectStyle}
                variant="light"
              >
                <Dropdown.Item
                  eventKey="Family"
                  onSelect={(eventKey) => {
                    let temp = this.state.importantPeople6;
                    temp.relationship = eventKey;
                    this.setState({ importantPeople6: temp });
                  }}
                >
                  Family
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="Friends"
                  onSelect={(eventKey) => {
                    let temp = this.state.importantPeople6;
                    temp.relationship = eventKey;
                    this.setState({ importantPeople6: temp });
                  }
                  }
                >
                  Friends
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="Advisor"
                  onSelect={(eventKey) => {
                    let temp = this.state.importantPeople6;
                    temp.relationship = eventKey;
                    this.setState({ importantPeople6: temp });
                  }}
                >
                  Advisor
                </Dropdown.Item>
               
              </DropdownButton>
                      <Form.Control
                        type="text"
                        placeholder="Phone Number"
                        value={this.state.importantPeople6.phone_number || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          let temp = this.state.importantPeople6;
                          temp.phone_number = e.target.value;
                          this.setState({ importantPeople6: temp });
                        }}
                      />
                      <Form.Control
                        type="text"
                        placeholder="Email"
                        value={this.state.importantPeople6.email || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          let temp = this.state.importantPeople6;
                          temp.email = e.target.value;
                          this.setState({ importantPeople6: temp });
                        }}
                      />
                    </div>
                  )}
                </Col>
                {this.state.importantPeople6.important === false && (
                  <p style={{ fontSize: "0.9em", marginLeft: "20px" }}>
                    {" "}
                    Choose a person or add a new one
                  </p>
                )}
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
                  <Button variant="secondary" onClick={this.hidePeopleForm}>
                    Cancel
                  </Button>
                </Col>
                <Col xs={4}>
                  <Button
                    variant="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.setState({ showAddNewPeopleModal: true });
                    }}
                  >
                    Add People
                  </Button>
                </Col>
              </Row>
            </Container>
          </Modal.Footer>
        </Modal.Dialog>
        {this.state.showAddNewPeopleModal && (
          <AddNewPeople
            BASE_URL={this.props.BASE_URL}
            closeModal={this.hidePeopleModal}
            newPersonAdded={this.updatePeopleArray}
            currentUserId={this.props.theCurrentUserId}
          />
        )}
      </div>
    );
  }
}

export default PeopleModal;
