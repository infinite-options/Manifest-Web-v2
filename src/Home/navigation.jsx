import React, { useContext } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import LoginContext from '../LoginContext';

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
});

/* Navigation Bar component function */
export function Navigation() {
  const history = useHistory();

  const classes = useStyles();

  const loginContext = useContext(LoginContext);
  const listOfUsers = loginContext.loginState.usersOfTA;
  const selectedUser = loginContext.loginState.curUser;

  console.log('User list', listOfUsers)
  console.log('Cur user', selectedUser)

  const userListRendered = () => {
    const elements = listOfUsers.map((user) => (
      <option
        key={user.user_unique_id}
        value={user.user_unique_id}
      >
        {user.user_name}
      </option>
    ));
    return (
      <div>
        Patient:&nbsp;
        <select
          value={selectedUser.user_unique_id}
          onChange={(e) => {
            loginContext.setLoginState({
              ...loginContext.loginState,
              curUser: e.target.value,
            })
          }}
        >
          {elements}
        </select>
      </div>
    );
  }

  /* History of the HomePage URL which is shown url tab */
  function homeNavigation() {
    history.push('/home');
  }

  /* History of the ContactPage URL which is shown url tab */
  function loginNavigation() {
    history.push('/login');
  }

  return (
    <AppBar className={classes.navigationBar}>
      <Toolbar>
        <div className={classes.displayNav}>
          <Box className={classes.titleElement}>
            <Typography>MANIFEST</Typography>
          </Box>
          {userListRendered()}

          <div className={classes.buttonContainer}>
            <Button
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
            </Button>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
}
