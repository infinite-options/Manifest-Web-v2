import React, { useState,useEffect } from "react";

import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import AppBar from "@material-ui/core/AppBar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useHistory, Redirect } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import "./Home.css";
import Routine from "../Routines/Routine"
import Main from "../OldManifest/Main"
// import WeekEvents from "./src/component/WeekEvents.jsx";

// import {
//   Form,
//   Container,
//   Row,
//   Col,
//   Modal,
//   Dropdown,
//   DropdownButton,
//   Spinner,
// } from "react-bootstrap";
import axios from "axios";
// import moment from "moment";
// import DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";

//import FirebaseV2 from "../component/Firebasev2";

/*Use states to define variables */

/* Custom Hook to make styles */
const BASE_URL = process.env.REACT_APP_BASE_URL;

const useStyles = makeStyles({
  buttonSelection: {
    width:"100%",
    height: "70px",
    borderBottomLeftRadius: "25%",
    borderBottomRightRadius: "25%",
    color: "#FFFFFF",
    backgroundColor: "#bbc8d7",
  },
  buttonContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-start",
    textTransform: "none",
  },

  dateContainer: {
    height: "70px",
    width: "100%",
    // borderBottomLeftRadius: "10%",
    // borderBottomRightRadius: "10%",
    paddingTpop: "100px",
    color: "#FFFFFF",
  },
});

/* Navigation Bar component function */
export default function Home() {
  const [calendarView] = useState();
  const history = useHistory();
  const classes = useStyles();
  const [routinesTitle, setRoutinesTitle] = useState([]);
  const [routinesId, setRoutinesId] = useState([]);
  const [routinesEdit, setRoutinesEdit] = useState(false);


  const [routine, setRoutine] = useState(true);
  function routineNavigation() {
    history.push("/routine");
  }

  function toggleShowRoutine() {
    <Box className={classes.buttonContainer}>
      <button p={50} backgroundColor="#bbc8d7">
        he
      </button>
    </Box>;
  }


  useEffect(() =>{
    
    axios.get(BASE_URL + "getgoalsandroutines/100-000027")
      .then((response) => {
        for(var i =0; i< response.data.result.length; i++){
          console.log("routine",response.data.result[i]);
          if (response.data.result[i].is_persistent === "True") {
          routinesTitle.push(response.data.result[i].gr_title);
          routinesId.push(response.data.result[i].gr_unique_id);
          } 
        }

      })
      .catch((error) => {
        console.log(error);
      });
  },[] ) 

  console.log(routinesTitle)
  console.log(routinesId)


  function ToggleShowEditRoutine(){
    history.push("/main")
  }

  function ToggleShowAbout(){
    history.push("/about")
  }

  return (

    <div style={{ width: "100%", height: "100vh", backgroundColor: "#f2f7fc" }}>
      HOME
      <Box display="flex"> 

      <Box flex='1' paddingTop={3} backgroundColor="#bbc8d7">
        <div className={classes.buttonContainer}>            
          <Button className={classes.buttonSelection} id="one">
            History
          </Button>
          <Button className={classes.buttonSelection} id="one">
            Events
          </Button>
          <Button
            className={classes.buttonSelection}
            onClick={toggleShowRoutine}
            id="one"
          >
            Routines
          </Button>
          <Button className={classes.buttonSelection} id="one" onClick={ToggleShowEditRoutine}>
            Goals
          </Button>
          <Button className={classes.buttonSelection} id="one" onClick={ToggleShowAbout}>
            About
          </Button>      
        </div>
        <Box height="75vh" style={{backgroundColor:'#bbc8d7'}}>
        Routine  
        <Button onClick = {()=> setRoutine(!routine)}> Click  </Button>  
        {/* {routinesTitle.map(item => {
          return <li>{item}</li>;
        })} */}

      </Box>
      </Box>

      <Box flex='1' hidden={routinesEdit}>
            {/* <Routine items={routinesTitle} itemId={routinesId} /> */}
         </Box>
      </Box>

    </div>

    );
}
