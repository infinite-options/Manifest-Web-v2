import React from "react"
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useHistory } from "react-router-dom";
import Typography from "@material-ui/core/Typography";

/* Custom Hook to make styles */
const useStyles = makeStyles({

    /* navigationContainer */
    navigationBar: {

        background: '#889AB5',
        width:'100%',

    },

    /* displaying the navigationBar as flex Containers */
    displayNav:{

        display:'flex',
        flex:1,
        justifyContent:'space-between',
        

    },

    /* Title of the Navigation Bar */
    titleElement: {

        fontSize:"150%",

        color:"#FFFFFF",
        fontWeight:"bold",

    },

    /* Button  container for the navigation Bar */
    buttonContainer: {

        flex:1,

        display: 'flex',

        justifyContent:'flex-end',

        textTransform: 'none'


    },

    /* Color of the Button in Navigation Bar */
    buttonColor: {


        color:'#FFFFFF',

    },
});

/* Navigation Bar component function */
export default function Navigation(){

    const history = useHistory();

    const classes = useStyles();

    /* History of the HomePage URL which is shown url tab */
    function homeNavigation(){

        history.push('/home');
    }

    /* History of the ContactPage URL which is shown url tab */
    function loginNavigation(){

        history.push('/login')
    }

    return(

        <AppBar className={classes.navigationBar}>

            <Toolbar>

                <div className={classes.displayNav}>

                    <Typography className={classes.titleElement}>

                        MANIFEST

                    </Typography>

                    <div className={classes.buttonContainer} >

                        <Button className={classes.buttonColor}
                                variant="text"
                                onClick={homeNavigation}
                                >
                            Home
                        </Button>

                        <Button className={classes.buttonColor}
                                variant={"text"}
                                onClick={loginNavigation}>

                            Not Impossible
                        </Button>

                        <Button className={classes.buttonColor}
                                variant={"text"}
                              //  onClick={contactNavigation}
                              >

                            Infinite Options
                        </Button>

                        <Button className={classes.buttonColor}
                                variant={"text"}
                               // onClick={contactNavigation}
                               >

                            Sign In
                        </Button>

                    </div>

                </div>

            </Toolbar>

        </AppBar>
    )
}