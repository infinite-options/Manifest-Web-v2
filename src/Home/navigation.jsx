import React from 'react';
import { useState } from 'react'
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import axios from "axios"


/* Custom Hook to make styles */
const useStyles = makeStyles({
  /* navigationContainer */
  navigationBar: {
    background: '#889AB5',
    width: '100%',
  },

  /* displaying the navigationBar as flex Containers */
  displayNav: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
  },

  /* Title of the Navigation Bar */
  titleElement: {
    flex: 1.5,
    fontSize: '150%',

    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  /* Button  container for the navigation Bar */
  buttonContainer: {
    flex: 1,

    display: 'flex',

    justifyContent: 'flex-start',

    textTransform: 'none',

    justifyContent: 'center'
  },

  /* Color of the Button in Navigation Bar */
  buttonColor: {
    color: '#FFFFFF',
  },

  myButton: {
    backgroundColor: "#889AB5",
    color: 'white',
    border: 'solid',
    borderWidth: '2px',
    borderRadius: '20px',
    "&:hover, &:focus":{
      backgroundColor: 'white',
      color: "#889AB5"
    },
    height: '40px',
    width: '200px',
    textTransform: 'capitalize',
  },
});
// const [showNewUser, toggleNewUser] = useState(false);

const googleLogIn = () => {
  axios
    .get("/auth-url")
    .then((response) => {
      console.log(response);
      window.location.href = response.data;
    })
    .catch((error) => {
      console.log("Error Occurred " + error);
    });
};

/* Navigation Bar component function */
export function Navigation() {
  const history = useHistory();

  const classes = useStyles();

  const [showNewUser, toggleNewUser] = useState(false);
  const [showGiveAccess, toggleGiveAccess] = useState(false);
  const [showConfirmed, toggleConfirmed] = useState(false);

  /* History of the HomePage URL which is shown url tab */
  function homeNavigation() {
    history.push('/home');
  }

  /* History of the ContactPage URL which is shown url tab */
  function loginNavigation() {
    history.push('/login');
  }

  const newUserModal = () => {
    if (showNewUser) {
      return (
        <div
          style={{
            height: "100%",
            width: "100%",
            zIndex: "101",
            left: "0",
            top: "0",
            overflow: "auto",
            position: "fixed",
            display: "grid",
            backgroundColor: 'rgba(255, 255, 255, 0.5)'
          }}
        >
          <div
            style={{
              position: "relative",
              justifySelf: "center",
              alignSelf: "center",
              display: "block",
              backgroundColor: "#889AB5",
              width: "400px",
              // height: "100px",
              color: "white",
              padding: "40px"
            }}
          >
            <div style={{textAlign: 'center', marginBottom: '20px'}}>New User</div>
            <div>Email:</div>
            <div style={{marginBottom: '20px'}}>NotARealEmail@something.com</div>
            <div>First Name:</div>
            <input placeholder="John" style={{marginBottom: '20px', height: '40px', width: "100%", borderRadius: '15px', border: 'none'}}></input>
            <div>Last Name:</div>
            <input placeholder="Doe" style={{marginBottom: '20px', height: '40px', width: "100%", borderRadius: '15px', border: 'none'}}></input>
            <input placeholder="timezone" style={{marginBottom: '20px', height: '40px', width: "100%", borderRadius: '15px', border: 'none'}}></input>
            <div>
              <button style = {{
                backgroundColor: "#889AB5",
                color: 'white',
                border: 'solid',
                borderWidth: '2px',
                borderRadius: '25px',
                width: '30%',
                marginLeft: "10%",
                marginRight: "10%"
              }}
              onClick = {() => {
                toggleNewUser(false)
              }}>Close</button>
              <button style = {{
                backgroundColor: "#889AB5",
                color: 'white',
                border: 'solid',
                borderWidth: '2px',
                borderRadius: '25px',
                width: '30%',
                marginLeft: "10%",
                marginRight: "10%"
              }}
              onClick = {() => {
                toggleNewUser(false)
              }}>Save</button>
            </div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  const giveAccessModal = () => {
    if (showGiveAccess) {
      return (
        <div
          style={{
            height: "100%",
            width: "100%",
            zIndex: "101",
            left: "0",
            top: "0",
            overflow: "auto",
            position: "fixed",
            display: "grid",
            backgroundColor: 'rgba(255, 255, 255, 0.5)'
          }}
        >
          <div
            style={{
              position: "relative",
              justifySelf: "center",
              alignSelf: "center",
              display: "block",
              backgroundColor: "#889AB5",
              width: "400px",
              // height: "100px",
              color: "white",
              padding: "40px"
            }}
          >
            <div style={{textAlign: 'center', marginBottom: '20px'}}>Give another advisor access</div>
            <div style={{textAlign: 'center', marginBottom: '20px'}}>Are you sure you want to give ADVISOR NAME access to the information of user, USER NAME</div>
            <div>
              <button style = {{
                backgroundColor: "red",
                color: 'white',
                border: 'solid',
                borderWidth: '2px',
                borderRadius: '25px',
                width: '30%',
                marginLeft: "10%",
                marginRight: "10%"
              }}
              onClick = {() => {
                toggleGiveAccess(false)
              }}
              >
                No
              </button>
              <button style = {{
                backgroundColor: "green",
                color: 'white',
                border: 'solid',
                borderWidth: '2px',
                borderRadius: '25px',
                width: '30%',
                marginLeft: "10%",
                marginRight: "10%"
              }}
              onClick = {() => {
                toggleConfirmed(true)
                toggleGiveAccess(false)
              }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  const confirmedModal = () => {
    if (showConfirmed) {
      return (
        <div
          style={{
            height: "100%",
            width: "100%",
            zIndex: "101",
            left: "0",
            top: "0",
            overflow: "auto",
            position: "fixed",
            display: "grid",
            backgroundColor: 'rgba(255, 255, 255, 0.5)'
          }}
        >
          <div
            style={{
              position: "relative",
              justifySelf: "center",
              alignSelf: "center",
              display: "block",
              backgroundColor: "#889AB5",
              width: "400px",
              // height: "100px",
              color: "white",
              padding: "40px"
            }}
          >
            <div style={{textAlign: 'center', marginBottom: '20px'}}>Access Granted</div>
            <div style={{textAlign: 'center', marginBottom: '20px'}}>ADVISOR NAME now has access to the information of user, USER NAME</div>
            <div style={{textAlign: 'center'}}>
              <button style = {{
                backgroundColor: "#889AB5",
                color: 'white',
                border: 'solid',
                borderWidth: '2px',
                borderRadius: '25px',
                width: '30%',
                marginLeft: "10%",
                marginRight: "10%"
              }}
              onClick = {() => {
                toggleConfirmed(false)
              }}
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  return (
    <>
      {newUserModal()}
      {giveAccessModal()}
      {confirmedModal()}
      
      <AppBar className={classes.navigationBar}>
        <Toolbar>
          <div className={classes.displayNav}>
            <Typography className={classes.titleElement}>MANIFEST</Typography>

            {/* <Typography
                className={classes.titleElement}
                // variant="text"
                onClick={homeNavigation}
              >
                Add TA+
              </Typography> */}

            <div className={classes.buttonContainer}>
              <Button
                //className={classes.buttonColor}
                //variant="text"
                //onClick={homeNavigation}
                // style={{
                //   color: 'white',
                //   border:'solid',
                //   borderwidth: '1px',
                //   borderRadius: '22px',
                // }}
                className = {classes.myButton}
                onClick={(e) => {
                  // googleLogIn();
                  toggleNewUser(!showNewUser)
                  
                }}
              >
                Create New User
              </Button>

              <select
                //className={classes.buttonColor}
                //variant="text"
                //onClick={homeNavigation}
                className = {classes.myButton}
                
                onChange = {e => {
                  toggleGiveAccess(true)
                }}
              >
                {/* Give another Advisor Access */}
                <option>
                  Give another Advisor Access
                </option>
                <option>
                  test name
                </option>
              </select>

              <Button
                className={classes.buttonColor}
                variant="text"
                //onClick={homeNavigation}
              >
                Home
              </Button>

              <Button
                className={classes.buttonColor}
                variant={'text'}
                onClick={loginNavigation}
              >
                Not Impossible
              </Button>

              <Button
                className={classes.buttonColor}
                variant={'text'}
                //  onClick={contactNavigation}
              >
                Infinite Options
              </Button>

              <Button
                className={classes.buttonColor}
                variant={'text'}
                // onClick={contactNavigation}
              >
                Sign In
              </Button>
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
}
