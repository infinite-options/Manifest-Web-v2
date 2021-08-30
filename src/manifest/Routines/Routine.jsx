import React, { useState } from "react"
import { Box, TextField, Button } from '@material-ui/core';
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import axios from "axios";


const useStyles = makeStyles({

    textFieldBackgorund:{
            backgroundColor:'#FFFFFF',
            
    },

    buttonImage:{
       // backgroundImage: `url(${Ellipse})`
    },
   
});

/* Navigation Bar component function */
 export default function Routine(props){
    const classes = useStyles();
    const [routine, setRoutine] = useState(false)
    const [action, setAction] = useState(false)
    const [Step, setStep] = useState(false)

    const [actionTitle, setActionTitle] = useState([])

    function handleRoutineClick(){
        handleAction()
        setAction(!action)
    }

    function handleActionClick(){
        setStep(!Step)
    }

    function handleAction() {
        props.itemId.map(item => {
            axios.get("https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/actionsTasks/" + item.toString())
            .then((response) => {
                console.log('here-test 8');
              console.log("actions",response);
              for(var i =0; i< response.data.result.length; i++){
                console.log("routine",response.data.result[i].at_title);
                actionTitle.push(response.data.result[i].at_title);
                //routinesId.push(response.data.result[i].gr_unique_id);
              }
            })
            .catch((error) => {
              console.log(error);
            });
      })
    }


    console.log("id", props.itemId)


    return(
        <Box display="flex" marginTop="2%"  >

            <Box flex='1' >
             
                <Box style={{  backgroundColor:"#FF6B4A" , borderRadius:'15px' }} height="4rem">
                 <Box paddingTop='2rem' paddingLeft="6rem">
                 Routine
                     </Box>
                
                </Box>
                
                {props.items.map(item => {
                    return <Button
                    style={{ height:'50%', backgroundColor:"#FF6B4A" , marginTop:'5%', width:'100%'}}
                    onClick = {handleRoutineClick} >
                       {item}
                   </Button>
                })}
               
               
               
            </Box>

            <Box flex='1'>
             
             <Box style={{  backgroundColor:"#F8BE28" , borderRadius:'15px' }} height="4rem">
              <Box paddingTop='2rem' paddingLeft="6rem">
              Action
              </Box>
             
             </Box>
             
             {/* {props.itemId.map(item => {
                    return <Button
                    style={{ height:'50%', backgroundColor:"#F8BE28" , marginTop:'5%', width:'100%'}}
                    onClick = {handleActionClick} >
                       {handleAction(item)}
                   </Button>
            })} */}

            {actionTitle.map(item => {
                    return <Button
                    style={{ height:'50%', backgroundColor:"#F8BE28" , marginTop:'5%', width:'100%'}}
                    onClick = {handleActionClick} >
                       {item}
                   </Button>
            })}
             {/* <Button
             style = {{height:"100%"}}
             fullWidth={true} 
             onClick={handleActionClick}>
                   Action
            </Button> */}
         </Box>


         <Box flex='1'>
             
             <Box style={{  backgroundColor:"#67ABFC" , borderRadius:'15px' }} height="4rem">
              <Box paddingTop='2rem' paddingLeft="6rem">
              Steps
                  </Box>
             
             </Box>
             
             <Box hidden={!Step} style={{ height:'100%',  backgroundColor:"#67ABFC" , marginTop:'5%'}}>
                Steps 
             </Box>
         </Box>
            

            
        </Box>
    );
}