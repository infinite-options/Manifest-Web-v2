import React, { useContext } from 'react';
import { useState } from 'react'
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import LoginContext from '../LoginContext';
import axios from 'axios'

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
    width: '30%',
    textTransform: 'capitalize',
    margin: '4px',
  },
});

/* Navigation Bar component function */
export function Navigation() {
  const history = useHistory();

  const classes = useStyles();

  const loginContext = useContext(LoginContext);
  const listOfUsers = loginContext.loginState.usersOfTA;
  const selectedUser = loginContext.loginState.curUser;

  const [showNewUser, toggleNewUser] = useState(false);
  const [showGiveAccess, toggleGiveAccess] = useState(false);
  const [showConfirmed, toggleConfirmed] = useState(false);
  const [taListCreated, toggleGetTAList] = useState(false);
  const [patientName, setPatiantName] = useState('');
  const [taName, setTAName] = useState('');
  const [taID, setTAID] = useState('');
  const [taList, setTAList] = useState([])

  //var taList = []

  const API_URL = 'https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/'

  console.log('User list', listOfUsers)
  console.log('Cur user', selectedUser)

  const userListRendered = () => {
      if (loginContext.loginState.loggedIn) {
      console.log("list of users")
      console.log(listOfUsers)
      const elements = listOfUsers.map((user) => (
        <option
          key={user.user_unique_id}
          // value={user.user_unique_id}
          value={JSON.stringify({user_unique_id: user.user_unique_id, user_name: user.user_name})}
        >
          {user.user_name}
        </option>
      ));
      return (
        <div>
          Patient:&nbsp;
          <select
            className={classes.myButton}
            value={selectedUser.user_unique_id}
            onChange={(e) => {
              console.log(JSON.parse(e.target.value))
              
              loginContext.setLoginState({
                ...loginContext.loginState,
                curUser: JSON.parse(e.target.value).user_unique_id,
              })
              toggleGetTAList(false)

              setPatiantName(JSON.parse(e.target.value).user_name)
            }}
          >
            {elements}
          </select>
        </div>
      );
    }
  }

  const taListRendered = () => {
    console.log('ta list')
    console.log(taList)
    const elements = taList.map((ta) => (
      <option
        key={ta.ta_unique_id}
        value={JSON.stringify(
          {
            ta_unique_id: ta.ta_unique_id, 
            ta_first_name: ta.ta_first_name,
            ta_last_name: ta.ta_last_name
          })}
      >
        {ta.ta_last_name}, {ta.ta_first_name}
      </option>
    ))
    return elements
  }

  const getTAList = () => {
    if (!taListCreated) {
      console.log('in getTAList: '+selectedUser)
      axios
        .get(API_URL+'listAllTA/'+selectedUser)
        .then(response=>{
          console.log(response.data)
          //taList = response.data.result
          setTAList(response.data.result)
          console.log(taList)

          toggleGetTAList(true)
        })
        .catch((err) => {
          if (err.response) {
            console.log(err.response);
          }
          console.log(err);
        })

        //console.log(elements)

        // const ret = elements.map((ta) => (
        //   <option
        //     key={ta.ta_unique_id}
        //     // value={user.user_unique_id}
        //     value={JSON.stringify({ta_unique_id: ta.ta_unique_id, ta_name: ta.ta_first_name + ' ' + ta.ta_last_name})}
        //   >
        //     {ta.ta_last_name + ', ' + ta.ta_first_name}
        //   </option>
        // ))
    }
  }

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
            <div style={{textAlign: 'center', marginBottom: '20px'}}>Are you sure you want to give {taName} access to the information of user, {patientName}</div>
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
                // let myObj = {
                //   ta_people_id: taID,
                //   user_id: selectedUser
                // }

                axios
                  .post(API_URL+'anotherTAAccess',
                    {
                      ta_people_id: taID,
                      user_id: selectedUser
                    }
                  )
                  .then(response => {
                    console.log(response)
                  })

                toggleConfirmed(true)
                toggleGetTAList(false)
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
            <div style={{textAlign: 'center', marginBottom: '20px'}}>{taName} now has access to the information of user, {patientName}</div>
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

  console.log('from nav')
  console.log(loginContext)
  getTAList()
  console.log(taList)
  return (
    <>
      {newUserModal()}
      {giveAccessModal()}
      {confirmedModal()}
      <AppBar className={classes.navigationBar} style={{position: 'static'}}>
        <Toolbar>
          <div className={classes.displayNav}>
            <div style={{width: '40%'}}>
              {userListRendered()}
            </div>
            
            {/* {userListRendered()} */}

            <div style={{width: '20%', textAlign: 'center'}}>
            <Box className={classes.titleElement} style={{textAlign: 'center'}}>
              <Typography style={{fontSize: '30px', fontWeight: 'bold'}}
                onClick={()=>{history.push('/home')}}
              >MANIFEST</Typography>
            </Box>
            </div>

            <div className={classes.buttonContainer} style = {{width: '40%', textAlign: 'justify'}}>
              {/* <Button
                className={classes.buttonColor}
                variant="text"
                onClick={homeNavigation}
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
              </Button> */}
              {loginContext.loginState.loggedIn ? (
                <div style = {{width: '100%', textAlign: 'justify'}}>
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
                    style={{float: 'right'}}
                    onClick={(e) => {
                      loginContext.setLoginState({
                        ...loginContext.loginState,
                        loggedIn: false,
                        ta: {
                          ...loginContext.loginState.ta,
                          id: "",
                          email: "",
                        },
                        usersOfTA: [],
                        curUser: '',
                      });
                      history.push('/')
                    }}
                  >
                    Logout
                  </Button>
                  
                  <select
                    //className={classes.buttonColor}
                    //variant="text"
                    //onClick={homeNavigation}
                    className = {classes.myButton}
                    style={{float: 'right'}}
                    onChange = {e => {
                      if (e.target.value != null){
                        console.log(JSON.parse(e.target.value))
                        setTAName(JSON.parse(e.target.value).ta_first_name + ' ' + JSON.parse(e.target.value).ta_last_name)
                        setTAID(JSON.parse(e.target.value).ta_unique_id)
                        toggleGiveAccess(true)
                      }
                    }}
                  >
                    {/* Give another Advisor Access */}
                    <option value={null}>
                      Give another Advisor Access
                    </option>
                    {/* <option>
                      test name
                    </option> */}
                    {taListRendered()}
                  </select>

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
                  style={{float: 'right'}}
                  onClick={(e) => {
                    // googleLogIn();
                    toggleNewUser(!showNewUser)

                  }}
                  >
                    Create New User
                  </Button>
                  
                </div>
              ) : (null)}
              
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
}
