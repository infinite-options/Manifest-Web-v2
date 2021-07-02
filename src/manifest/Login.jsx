import React from "react"
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Box, TextField, Button } from '@material-ui/core';
import { useHistory } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Ellipse from '../manifest/LoginAssets/Ellipse.svg';
import LoginImage from '../manifest/LoginAssets/Login.svg';
import Facebook from '../manifest/LoginAssets/Facebook.svg';
import Google from '../manifest/LoginAssets/Google.svg';
import Apple from '../manifest/LoginAssets/Apple.svg';
import SignUpImage from '../manifest/LoginAssets/SignUp.svg';
import Cookies from 'js-cookie';
import { AuthContext } from '../auth/AuthContext';

import { GoogleLogin } from "react-google-login";
import axios from "axios";
import { useState, useContext } from "react";
import SocialLogin from '../components/LogIn/SocialLogin'



/* Custom Hook to make styles */
const useStyles = makeStyles({

    textFieldBackgorund:{
            backgroundColor:'#FFFFFF',
            
    },

    buttonImage:{
        backgroundImage: `url(${Ellipse})`
    },
   
});

/* Navigation Bar component function */
 export default function Login(){

  const Auth = useContext(AuthContext);

    const classes = useStyles();
    const history = useHistory();
 
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loggedIn, setLoggedIn] = useState()
    const [validation, setValidation] = useState("");


    const handleEmailChange = (event) => {
        setEmail( event.target.value );
      };
    
    const handlePasswordChange = (event) => {
        setPassword(event.target.value );
      };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('event',event, email, password);
        axios.get("https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev//api/v2/loginTA/" + email.toString() + "/" + password.toString())
          .then((response) => {
            console.log("response",response.data);
            if (response.data.result !== false) {
              setLoggedIn(true);
              console.log("response id",response.data.result, loggedIn)
              history.push("/home");
            }else{
              setLoggedIn(false);
              setValidation(response.data.message)
            }
          })
          .catch((error) => {
            console.log(error);
          });
      };

    const responseGoogle = (response) => {
        console.log("response",response)
        if (response.profileObj !== null || response.profileObj !== undefined) {
          let e = response.profileObj.email;
          let at = response.accessToken;
          let rt = response.googleId;
          let first_name = response.profileObj.givenName;
          let last_name = response.profileObj.familyName;
          console.log(e, at, rt, first_name, last_name);
          axios
            .get("https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/loginSocialTA/" + e) //, {
             // username: e,  1009120542229-9nq0m80rcnldegcpi716140tcrfl0vbt.apps.googleusercontent.com
            //})
            .then((response) => {
              console.log(response.data);
              if (response.data !== false) {
                console.log("Login successful")
                history.push("/home");
              } else {
                console.log("social sign up with", e);
                this.setState({
                  socialSignUpModal: true,
                  newEmail: e,
                });
                console.log("social sign up modal displayed");
              }
            })
            .catch((error) => {
              console.log("error",error);
            });
        }
      };

    return(

        <Box display="flex" style={{  width:'100%', height:'100%', backgroundColor:'#F2F7FC', }}>
          
            <Box  style={{position:'fixed', top:'100px' , left:'-100px'}}>
            <img src={Ellipse} alt="Ellipse"/>

            </Box>
            <Box display="flex" marginTop="35%" marginLeft="30%">

            <Button 
                style={{ width:"7.5rem", height:'7.5rem', backgroundImage: `url(${SignUpImage})` }}>
            </Button>

            </Box>
            <Box>

            </Box>

            <Box  marginTop="15%" display="flex" flexDirection="column" style={{width:"15rem"}}>

                <Box marginBottom="1rem"  width="100%">
                    <TextField 
                    className ={classes.textFieldBackgorund}
                    variant="outlined"
                    label="Email"
                    size="small"
                    error = {validation}
                    fullWidth={true} 
                    onChange={handleEmailChange}
                    />
                </Box>

                <Box>
                    <TextField 
                    className ={classes.textFieldBackgorund}
                    variant="outlined"
                    label="Password"
                    size="small" 
                    type="password"
                    error = {validation}
                    fullWidth={true}
                    onChange={handlePasswordChange}/>
                </Box>

               <Box color="red" style={{textTransform:'lowercase'}}>
                 <Typography>
                 {validation}
                 </Typography>
                </Box>
                <Box justifyContent="flex-start">
                    <Button 
                    style={{textTransform:'lowercase', fontWeight:'bold'}}>
                        Forgot Password?
                    </Button>
                </Box>

                <Box marginTop="1rem" display="flex" justifyContent="center" style={{fontWeight:'bold'}} >
                    Or Login With
                </Box>

                <Box display="flex" justifyContent="center" marginTop="1rem">
                    <Box>
                        <Button
                        disableRipple={true}
                        disableFocusRipple={true}
                        disableTouchRipple={true}
                        disableElevation={true}
                        style={{ borderRadius:'32px', height:'3rem' ,backgroundImage: `url(${Facebook})` }}>

                        </Button>
                    </Box>
                    <Box>
                    {/* <SocialLogin/> */}
                       

                            <GoogleLogin
                                clientId="1009120542229-9nq0m80rcnldegcpi716140tcrfl0vbt.apps.googleusercontent.com"
                                render={renderProps => (
                                <Button 
                                    style={{ borderRadius:'32px', height:'3rem' ,backgroundImage: `url(${Google})` }}
                                    onClick={renderProps.onClick} 
                                    disabled={renderProps.disabled}>
                                </Button>
                                )}
                                buttonText="Log In"
                                onSuccess={responseGoogle}
                                onFailure={responseGoogle}
                                isSignedIn={false}
                                disable={false}
                                cookiePolicy={"single_host_origin"}
                                />          
                    </Box>
                    <Box>
                        <Button
                        disableRipple={true}
                        disableFocusRipple={true}
                        disableTouchRipple={true}
                        disableElevation={true}
                        style={{ borderRadius:'32px', height:'3rem' ,backgroundImage: `url(${Apple})` }}>

                        </Button>
                    </Box>
                </Box>

                <Box display="flex" justifyContent="center" marginTop="5rem" marginBottom="7.5rem" style={{fontWeight:'bold'}}>
                    Don't have an account?
                </Box>
            </Box>

            <Box marginTop="14%" marginLeft="2rem" >
                <Button 
                onClick = {handleSubmit}
                style={{ width:"7.5rem", height:'7.5rem', backgroundImage: `url(${LoginImage})` }}>
                </Button>

            </Box>

            <Box  style={{position:'fixed', right:'-100px' , bottom:'-100px'}} >
            <img src={Ellipse} alt="Ellipse"/>

            </Box>
            
            {/* <Box hidden={loggedIn === true}>
                  <Loading/>
            </Box> */}
        </Box>
     
    )
}
