import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
    faUser,
    faUserAltSlash,
    faTrophy,
    faRunning,
    faBookmark,
    faEdit,
    faList,
    faCopy,
    faAlignCenter,
  } from "@fortawesome/free-solid-svg-icons";
import { useHistory, Redirect } from 'react-router-dom';
import {
    ListGroup,
    Row,
    Col,
    Modal,
    InputGroup,
    FormControl,
    Table,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import DeleteAT from "../manifest/OldManifest";
import DeleteGR from "../manifest/OldManifest/deleteGR.jsx";
import EditGR from "../manifest/OldManifest/editGR.jsx";
import EditIS from "../manifest/OldManifest/editIS.jsx";
import EditAT from "../manifest/OldManifest/EditAT.jsx";
import ShowATList from "../manifest/OldManifest/ShowATList";
import ShowISList from "../manifest/OldManifest/ShowISList";
import MustDoAT from "../manifest/OldManifest/MustDoAT";
import EditIcon from "../manifest/OldManifest/EditIcon.jsx";
import CopyIcon from "../manifest/OldManifest/CopyIcon.jsx";
import CopyGR from "../manifest/OldManifest/CopyGR.jsx";
import { Container } from 'react-grid-system';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
    buttonSelection: {
        width: '20%',
        height: '70px',
        borderBottomLeftRadius: '25%',
        borderBottomRightRadius: '25%',
        color: '#FFFFFF',
        backgroundColor: '#bbc8d7',
        textTransform: 'capitalize',
      },
      buttonContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-end',
        textTransform: 'lowercase',
      },
  
      dateContainer: {
        height: '70px',
        width: 'relative',
        color: '#FFFFFF',
        // flex: 1,
        // display: 'flex',
      },
})

const VerticalRoutine = ({onlyAllowed, userID, sendRoutineToParent}) => {
    const history = useHistory();
    const currentUser = userID;
    const [routinesGot, setRoutines] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [onlyAllowedHere, setOAH] = useState([]);
    const classes = useStyles();
    console.log(onlyAllowed);

    if(onlyAllowed != onlyAllowedHere){ //see if we got new data to display
        console.log("new onlyAllowed in");
        setOAH(onlyAllowed);
        makeDisplays(onlyAllowed);
    }

    function makeDisplays(onlyAllowed){     //add displays to tempRows
        var tempRows = [];
        for (var i=0; i <onlyAllowed.length; i++){
            if (onlyAllowed[i].type == "Routine"){
                tempRows.push(displayRoutines(onlyAllowed[i]));
            }
            else if (onlyAllowed[i].type == "Action"){
                tempRows.push(displayActions(onlyAllowed[i]));
            }
            else {tempRows.push(displayInstructions(onlyAllowed[i]))}
        }
        setRows(tempRows);
    }

    function formatDateTime(str) {
        let newTime = new Date(str).toLocaleTimeString();
        newTime = newTime.substring(0, 5) + " " + newTime.slice(-2);
        return newTime;
      }

   

    function displayRoutines(r){
        return(
            <div
            
                style={{ height:'6rem', width:'100%', backgroundColor:'#BBC7D7' , marginBottom:'0px', marginTop: '2px'}}
            >
                
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                <div flex='1' style={{marginLeft:'1rem', marginTop:'1rem', height:'4.5rem', borderRadius:'10px',width:'65%', display:'flex', justifyContent:'space-between', backgroundColor:'#FF6B4A', boxShadow:
                    "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
                zIndex:'50%'}}>
                <div flex='1' style={{marginTop:'0.5rem', display:'flex', flexDirection:'column', justifyContent:'flex-start' }} >
                <div style={{ marginLeft:'1rem'}} >
                {r["startTime"] && r["endTime"] ? (
                    <div
                    style={{
                        fontSize: "8px",
                        color:'#ffffff'
                    }}
                    >
                    {
                        formatDateTime(
                        r["startTime"]  
                        )}
                        -
                    {
                        formatDateTime(
                        r["endTime"]
                        )}
                    </div>
                ) : (
                    <Col> </Col>
                )}
                
                </div>

                <div style={{color:'#ffffff', size:'24px', textDecoration:'underline', fontWeight:'bold', marginLeft: "10px",}}>
                {r["name"]}
                </div>
                    
                    {/* ({date}) */}
                </div>

            <div style={{display:'flex', flexDirection:'column', justifyContent:'space-evenly'}}>
                <div>

                <Col xs={7} style={{ paddingRight: "1rem"  ,marginTop:'0.5rem'}}>
                        <img
                        src={r["gr_photo"]}
                        alt="Routines"
                        className="center"
                        height="28px"
                        width="28px"
                        />
                    </Col>
                </div>
                <div style={{marginLeft:'1.5rem'}}>
                {(r.is_sublist_available === "True") ? (
                            <div>
                            <FontAwesomeIcon
                            icon={faList}
                            title="SubList Available"
                            style={{ color: "#ffffff" }}
                            size="small"
                            onClick = {()=> {
                                sendRoutineToParent(r.name);
                                setLoading(!isLoading);
                            }}
                            />
                        </div>
                        ) : (
                            <div
                            // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShowATModal: false})}}>
                            >
                            </div>
                        )}
                </div>
                </div>
                </div>

                <div style={{ display:"flex" , marginTop:'1rem'}}>
                <div style={{marginRight:'1rem',display:'flex', justifyContent:'space-evenly', flexDirection:'column', alignItems:'left'}}>
                    <div style={{flex:'1'}}>

                <CopyIcon
                    //   openCopyModal={() => {
                    //     this.setState({
                    //     showCopyModal: true,
                    //     indexEditing: this.findIndexByID(tempID),

                    //     })
                    //   }}
                    //   indexEditing={this.state.indexEditing}
                    //     i={this.findIndexByID(tempID)} //index to edit
                    //   showModal={this.state.showCopyModal}
                    />
                    </div>

                    <div style={{flex:'1', marginLeft:'1rem'}}>

                    <Row >
                        {r["is_available"] ? (
                            <div >
                            <FontAwesomeIcon
                                title="Available to the user"
                                style={{
                                color: "#ffffff",
                                }}
                                onClick={(e) => {
                                e.stopPropagation();
                                alert("Item Is Availble to the user");
                                }}
                                icon={faUser}
                                size="small"
                            />{" "}
                            </div>
                        ) : (
                            <div>
                            <FontAwesomeIcon
                                title="Unavailable to the user"
                                style={{ color: "#000000" }}
                                onClick={(e) => {
                                e.stopPropagation();
                                alert("Item Is NOT Availble to the user");
                                }}
                                icon={faUserAltSlash}
                                size="small"
                            />
                            </div>
                        )}
                        
                        </Row>
                    </div>

                    <div style={{flex:'1'}} >
                    <DeleteGR
                        //   BASE_URL={this.props.BASE_URL}
                        //     deleteIndex={this.findIndexByID(tempID)}
                        //     Array={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                        //     // Path={firebase
                        //     //   .firestore()
                        //     //   .collection("users")
                        //     //   .doc(this.props.theCurrentUserID)}
                        //     // refresh={this.grabFireBaseRoutinesGoalsData}
                        //     theCurrentUserId={this.props.theCurrentUserID}
                        //     theCurrentTAID={this.props.theCurrentTAID}
                        />
                        </div>
                </div>
                    <div style={{marginRight:'1rem',display:'flex', justifyContent:'space-evenly', flexDirection:'column'}}>
                
                    <div>
                        <FontAwesomeIcon
                            icon={faBookmark}
                            title="Must Do"
                            style={{ color: "#ffffff" }}
                            // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShow: false}); this.editFirBaseFalse()}}
                            // onClick={(e) => {
                            //     e.stopPropagation();
                            //     this.toggleFBmustDo(!this.state.iconShow);
                            // }}
                            size="small"
                        />
                    {/* <MustDoAT
                        // BASE_URL={this.props.BASE_URL}
                        //   Index={i}
                        //    Array={this.props.originalGoalsAndRoutineArr}
                        //   // SingleAT={this.state.singleATitemArr[i]}
                        //   // Path={this.state.singleGR.fbPath}
                        /> */}
                    </div>

                    <div>
                    <EditIcon
                            // openEditModal={() => {
                            //   this.setState({
                            //     showEditModal: true,
                            //     indexEditing: this.findIndexByID(tempID),
                            //   });
                            
                            // }}
                            // showModal={this.state.showEditModal}
                            // indexEditing={this.state.indexEditing}
                            // i={this.findIndexByID(tempID)} //index to edit
                            // ATArray={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                            // // FBPath={firebase
                            // //   .firestore()
                            // //   .collection("users")
                            // //   .doc(this.props.theCurrentUserID)}
                            // // refresh={this.grabFireBaseRoutinesGoalsData}
                        />

                    </div>

                    <div>
                    <FontAwesomeIcon
                            icon={faList}
                            title="SubList Available"
                            style={{ color: "#ffffff"}}
                            // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShow: false}); this.editFirBaseFalse()}}
                            onClick={(e)=>{
                            //  style.color = "#000000"
                            }}
                            size="small"
                            />
                    </div>
                    </div>
                </div>
                </div>
            </div>
        )
    }

    function displayActions(a){
        return(
            <div
            
                style={{ height:'98px', width:'100%', backgroundColor:'#BBC7D7' , marginBottom:'0px'}}
            >
                
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                <div flex='1' style={{marginLeft:'1.5rem', marginTop:'1rem', height:'4.25rem', borderRadius:'10px',width:'65%', display:'flex', justifyContent:'space-between', backgroundColor:'#F8BE28', boxShadow:
                    "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
                zIndex:'50%'}}>
                <div flex='1' style={{marginTop:'0.5rem', display:'flex', flexDirection:'column', justifyContent:'flex-start' }} >
                <div style={{ marginLeft:'1rem'}} >
                {true ? (
                    <div
                    style={{
                        fontSize: "8px",
                        color:'#F8BE28'
                    }}
                    >
                    {
                        formatDateTime(
                            "6/23/2021, 7:31:19 AM"  
                        )}
                        -
                    {
                        formatDateTime(
                            "6/23/2021, 8:31:56 AM"
                        )}
                    </div>
                ) : (
                    <Col> </Col>
                )}
                
                </div>

                <div style={{color:'#ffffff', size:'24px', textDecoration:'underline', fontWeight:'bold', marginLeft: "10px",}}>
                {a["name"]}
                </div>
                    
                    {/* ({date}) */}
                </div>

            <div style={{display:'flex', flexDirection:'column', justifyContent:'space-evenly'}}>
                <div>

                <Col xs={7} style={{ paddingRight: "1rem"  ,marginTop:'0.5rem'}}>
                        <img
                        src={a["at_photo"]}
                        alt="Routines"
                        className="center"
                        height="28px"
                        width="28px"
                        />
                    </Col>
                </div>
                <div style={{marginLeft:'1.5rem'}}>
                {(a.is_sublist_available === "True") ? (
                            <div>
                            <FontAwesomeIcon
                            icon={faList}
                            title="SubList Available"
                            style={{ color: "#ffffff" }}
                            size="small"
                            onClick = {()=> {
                                sendRoutineToParent(a.name);
                                setLoading(!isLoading);}}
                            />
                        </div>
                        ) : (
                            <div
                            // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShowATModal: false})}}>
                            >
                            </div>
                        )}
                </div>
                </div>
                </div>

                <div style={{ display:"flex" , marginTop:'1rem'}}>
                <div style={{marginRight:'1rem',display:'flex', justifyContent:'space-evenly', flexDirection:'column', alignItems:'left'}}>
                    <div style={{flex:'1'}}>

                <CopyIcon
                    //   openCopyModal={() => {
                    //     this.setState({
                    //     showCopyModal: true,
                    //     indexEditing: this.findIndexByID(tempID),

                    //     })
                    //   }}
                    //   indexEditing={this.state.indexEditing}
                    //     i={this.findIndexByID(tempID)} //index to edit
                    //   showModal={this.state.showCopyModal}
                    />
                    </div>

                    <div style={{flex:'1', marginLeft:'1rem'}}>

                    <Row >
                        {(a.is_available === "True") ? (
                            <div >
                            <FontAwesomeIcon
                                title="Available to the user"
                                style={{
                                color: "#ffffff",
                                }}
                                onClick={(e) => {
                                e.stopPropagation();
                                alert("Item Is Availble to the user");
                                }}
                                icon={faUser}
                                size="small"
                            />{" "}
                            </div>
                        ) : (
                            <div>
                            <FontAwesomeIcon
                                title="Unavailable to the user"
                                style={{ color: "#000000" }}
                                onClick={(e) => {
                                e.stopPropagation();
                                alert("Item Is NOT Availble to the user");
                                }}
                                icon={faUserAltSlash}
                                size="small"
                            />
                            </div>
                        )}
                        
                        </Row>
                    </div>

                    <div style={{flex:'1'}} >
                    <DeleteGR
                        //   BASE_URL={this.props.BASE_URL}
                        //     deleteIndex={this.findIndexByID(tempID)}
                        //     Array={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                        //     // Path={firebase
                        //     //   .firestore()
                        //     //   .collection("users")
                        //     //   .doc(this.props.theCurrentUserID)}
                        //     // refresh={this.grabFireBaseRoutinesGoalsData}
                        //     theCurrentUserId={this.props.theCurrentUserID}
                        //     theCurrentTAID={this.props.theCurrentTAID}
                        />
                        </div>
                </div>
                    <div style={{marginRight:'1rem',display:'flex', justifyContent:'space-evenly', flexDirection:'column'}}>
                
                    <div>
                        <FontAwesomeIcon
                            icon={faBookmark}
                            title="Must Do"
                            style={{ color: "#ffffff" }}
                            // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShow: false}); this.editFirBaseFalse()}}
                            // onClick={(e) => {
                            //     e.stopPropagation();
                            //     this.toggleFBmustDo(!this.state.iconShow);
                            // }}
                            size="small"
                        />
                    {/* <MustDoAT
                        // BASE_URL={this.props.BASE_URL}
                        //   Index={i}
                        //    Array={this.props.originalGoalsAndRoutineArr}
                        //   // SingleAT={this.state.singleATitemArr[i]}
                        //   // Path={this.state.singleGR.fbPath}
                        /> */}
                    </div>

                    <div>
                    <EditIcon
                            // openEditModal={() => {
                            //   this.setState({
                            //     showEditModal: true,
                            //     indexEditing: this.findIndexByID(tempID),
                            //   });
                            
                            // }}
                            // showModal={this.state.showEditModal}
                            // indexEditing={this.state.indexEditing}
                            // i={this.findIndexByID(tempID)} //index to edit
                            // ATArray={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                            // // FBPath={firebase
                            // //   .firestore()
                            // //   .collection("users")
                            // //   .doc(this.props.theCurrentUserID)}
                            // // refresh={this.grabFireBaseRoutinesGoalsData}
                        />

                    </div>

                    <div>
                    <FontAwesomeIcon
                            icon={faList}
                            title="SubList Available"
                            style={{ color: "#ffffff"}}
                            // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShow: false}); this.editFirBaseFalse()}}
                            onClick={(e)=>{
                            //  style.color = "#000000"
                            }}
                            size="small"
                            />
                    </div>
                    </div>
                </div>
                </div>

            </div>
        )
    }

    function displayInstructions(i){
        return(
            <div
            
                style={{ height:'98px', width:'100%', backgroundColor:'#BBC7D7' , marginBottom:'0px'}}
            >
                
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                <div flex='1' style={{marginLeft:'2rem', marginTop:'1rem', height:'4rem', borderRadius:'10px',width:'65%', display:'flex', justifyContent:'space-between', backgroundColor:'#67ABFC', boxShadow:
                    "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
                zIndex:'50%'}}>
                <div flex='1' style={{marginTop:'0.5rem', display:'flex', flexDirection:'column', justifyContent:'flex-start' }} >
                <div style={{ marginLeft:'1rem'}} >
                {true ? (
                    <div
                    style={{
                        fontSize: "8px",
                        color:'#67ABFC'
                    }}
                    >
                    {
                        formatDateTime(
                            "6/23/2021, 8:31:56 AM"  
                        )}
                        -
                    {
                        formatDateTime(
                            "6/23/2021, 8:31:56 AM"
                        )}
                    </div>
                ) : (
                    <Col> </Col>
                )}
                
                </div>

                <div style={{color:'#ffffff', size:'24px', textDecoration:'underline', fontWeight:'bold', marginLeft: "10px",}}>
                {i["name"]}
                </div>
                    
                    {/* ({date}) */}
                </div>

            <div style={{display:'flex', flexDirection:'column', justifyContent:'space-evenly'}}>
                <div>

                <Col xs={7} style={{ paddingRight: "1rem"  ,marginTop:'0.5rem'}}>
                        <img
                        src={i["is_photo"]}
                        alt="Routines"
                        className="center"
                        height="28px"
                        width="28px"
                        />
                    </Col>
                </div>
                <div style={{marginLeft:'1.5rem'}}>
                {/* {a["is_sublist_available"] ? (
                            <div>
                            <FontAwesomeIcon
                            icon={faList}
                            title="SubList Available"
                            style={{ color: "#ffffff" }}
                            size="small"
                            />
                        </div>
                        ) : (
                            <div
                            // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShowATModal: false})}}>
                            >
                            </div>
                        )} */}
                </div>
                </div>
                </div>

                <div style={{ display:"flex" , marginTop:'1rem'}}>
                <div style={{marginRight:'1rem',display:'flex', justifyContent:'space-evenly', flexDirection:'column', alignItems:'left'}}>
                    <div style={{flex:'1'}}>

                <CopyIcon
                    //   openCopyModal={() => {
                    //     this.setState({
                    //     showCopyModal: true,
                    //     indexEditing: this.findIndexByID(tempID),

                    //     })
                    //   }}
                    //   indexEditing={this.state.indexEditing}
                    //     i={this.findIndexByID(tempID)} //index to edit
                    //   showModal={this.state.showCopyModal}
                    />
                    </div>

                    <div style={{flex:'1', marginLeft:'1rem'}}>

                    <Row >
                        {i.is_available ? (
                            <div >
                            <FontAwesomeIcon
                                title="Available to the user"
                                style={{
                                color: "#ffffff",
                                }}
                                onClick={(e) => {
                                e.stopPropagation();
                                alert("Item Is Availble to the user");
                                }}
                                icon={faUser}
                                size="small"
                            />{" "}
                            </div>
                        ) : (
                            <div>
                            <FontAwesomeIcon
                                title="Unavailable to the user"
                                style={{ color: "#000000" }}
                                onClick={(e) => {
                                e.stopPropagation();
                                alert("Item Is NOT Availble to the user");
                                }}
                                icon={faUserAltSlash}
                                size="small"
                            />
                            </div>
                        )}
                        
                        </Row>
                    </div>

                    <div style={{flex:'1'}} >
                    <DeleteGR
                        //   BASE_URL={this.props.BASE_URL}
                        //     deleteIndex={this.findIndexByID(tempID)}
                        //     Array={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                        //     // Path={firebase
                        //     //   .firestore()
                        //     //   .collection("users")
                        //     //   .doc(this.props.theCurrentUserID)}
                        //     // refresh={this.grabFireBaseRoutinesGoalsData}
                        //     theCurrentUserId={this.props.theCurrentUserID}
                        //     theCurrentTAID={this.props.theCurrentTAID}
                        />
                        </div>
                </div>
                    <div style={{marginRight:'1rem',display:'flex', justifyContent:'space-evenly', flexDirection:'column'}}>
                
                    <div>
                        <FontAwesomeIcon
                            icon={faBookmark}
                            title="Must Do"
                            style={{ color: "#ffffff" }}
                            // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShow: false}); this.editFirBaseFalse()}}
                            // onClick={(e) => {
                            //     e.stopPropagation();
                            //     this.toggleFBmustDo(!this.state.iconShow);
                            // }}
                            size="small"
                        />
                    {/* <MustDoAT
                        // BASE_URL={this.props.BASE_URL}
                        //   Index={i}
                        //    Array={this.props.originalGoalsAndRoutineArr}
                        //   // SingleAT={this.state.singleATitemArr[i]}
                        //   // Path={this.state.singleGR.fbPath}
                        /> */}
                    </div>

                    <div>
                    <EditIcon
                            // openEditModal={() => {
                            //   this.setState({
                            //     showEditModal: true,
                            //     indexEditing: this.findIndexByID(tempID),
                            //   });
                            
                            // }}
                            // showModal={this.state.showEditModal}
                            // indexEditing={this.state.indexEditing}
                            // i={this.findIndexByID(tempID)} //index to edit
                            // ATArray={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                            // // FBPath={firebase
                            // //   .firestore()
                            // //   .collection("users")
                            // //   .doc(this.props.theCurrentUserID)}
                            // // refresh={this.grabFireBaseRoutinesGoalsData}
                        />

                    </div>

                    <div>
                    <FontAwesomeIcon
                            icon={faList}
                            title="SubList Available"
                            style={{ color: "#ffffff"}}
                            // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShow: false}); this.editFirBaseFalse()}}
                            onClick={(e)=>{
                            //  style.color = "#000000"
                            }}
                            size="small"
                            />
                    </div>
                    </div>
                </div>
                </div>

                
            </div>
        )
    }



    // if(isLoading){
    //     return(
    //         <div>
    //             <h1>Loading...</h1>
    //         </div>
    //     )
    // }
    return(
        <Box width = "350px">
            <Button className={classes.buttonSelection} onClick={() => history.push(
                {pathname: "/matts"})} id="one">
                History
        </Button>
            <Button className={classes.buttonSelection} id="one">
                Events
        </Button>
            <Button
                className={classes.buttonSelection}
                onClick={() => history.push({pathname: "/home"})}
                id="one">
                Routines
        </Button>

            <Button className={classes.buttonSelection} onClick={() => history.push(
                { pathname: "/main", state: currentUser })} id="one">
                Goals
        </Button>
            <Button className={classes.buttonSelection} id="one">
                About
        </Button>
        <p style={{height:"54.5px", margin:"0px"}}></p>
        <row>
                {rows}
        </row>
        </Box>
    )

}

export default VerticalRoutine;