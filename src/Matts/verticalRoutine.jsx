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

export default function VerticalRoutine(userID) {
    const history = useHistory();
    const currentUser = userID;
    const [routinesGot, setRoutines] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [rows, setRows] = useState([]);
    const classes = useStyles();


    useEffect(() => {
        axios.get("https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/rts/" + currentUser)
        .then((response) => {
            for(var i=0; i<response.data.result.length; i++){
                routinesGot.push(response.data.result[i]);
            }
            console.log(routinesGot);
            setRoutines(routinesGot);
            setLoading(false);
            addShows(routinesGot);
        })
        .catch((error) => {
            console.log(error);
        });
    },[])


    function addShows(routinesGot){
        var routineCopy = routinesGot;
        for(var r=0; r<routineCopy.length; r++){
            routineCopy[r].showBelow = false;
            if(routineCopy[r].actions_tasks != undefined){
                console.log(routineCopy[r].actions_tasks);
                for(var a=0; r<routineCopy[r].actions_tasks.length; a++){
                    if(routineCopy[r].actions_tasks[a] == undefined){break;}
                    routineCopy[r].actions_tasks[a].showBelow = false;
                }
            }
        }
        setRoutines(routineCopy);
        console.log(routinesGot);
        displayThings(routinesGot);
    }

    function displayThings(routinesGot){
        var tempRows = [];
        for(const r of routinesGot){
            tempRows.push(displayRoutines(r));  //put display routine here
            if(r.showBelow){
                for(const a of r.actions_tasks){
                    tempRows.push(displayActions(a, r));  //put display action here
                    if(a.showBelow){
                        for(const i of a.instructions_steps){
                            tempRows.push(displayInstructions(i, a, r));
                        }
                    }
                }
            }
        }
        setRows(tempRows);
    }

    function formatDateTime(str) {
        let newTime = new Date(str).toLocaleTimeString();
        newTime = newTime.substring(0, 5) + " " + newTime.slice(-2);
        return newTime;
      }

    function changeShowBelow(myRoutine){
        var routineCopy = routinesGot;
        console.log("change show " + myRoutine.gr_title); //change for at_title
        for (var r=0; r<routineCopy.length; r++){
            if(myRoutine.at_unique_id != undefined){
                for (var a=0; a<routineCopy[r].actions_tasks.length; a++){
                    if(routineCopy[r].actions_tasks[a].at_unique_id == myRoutine.at_unique_id){
                        routineCopy[r].actions_tasks[a].showBelow = !routineCopy[r].actions_tasks[a].showBelow;
                    }
                }
            }
            else{
                if(myRoutine.gr_unique_id == routineCopy[r].gr_unique_id){
                    console.log("found and replaced");
                    routineCopy[r].showBelow = !routineCopy[r].showBelow;
                }
            }
        }
        setRoutines(routineCopy);
        displayThings(routinesGot);
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
                {r["start_day_and_time"] && r["end_day_and_time"] ? (
                    <div
                    style={{
                        fontSize: "8px",
                        color:'#ffffff'
                    }}
                    >
                        
                    {
                        formatDateTime(
                        r["start_day_and_time"]  
                        )}
                        -
                    {
                        formatDateTime(
                        r["end_day_and_time"]
                        )}
                    </div>
                ) : (
                    <Col> </Col>
                )}
                
                </div>

                <div style={{color:'#ffffff', size:'24px', textDecoration:'underline', fontWeight:'bold', marginLeft: "10px",}}>
                {r["gr_title"]}
                </div>
                    
                    {/* ({date}) */}
                </div>

            <div style={{display:'flex', flexDirection:'column', justifyContent:'space-evenly'}}>
                <div>

                <Col xs={7} style={{ paddingRight: "1rem"  ,marginTop:'0.5rem'}}>
                        <img
                        src={r["photo"]}
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
                            onClick = {()=> changeShowBelow(r)}
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

                {r["photo"] ? (
                <div>
            
                    {/* <EditGR
                    BASE_URL={this.props.BASE_URL}
                        closeEditModal={() => {
                        this.setState({ showEditModal: true });
                        this.props.updateFBGR();
                        }}
                        showModal={this.state.showEditModal}
                        indexEditing={this.state.indexEditing}
                        i={this.findIndexByID(tempID)} //index to edit
                        ATArray={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                        // FBPath={firebase
                        //   .firestore()
                        //   .collection("users")
                        //   .doc(this.props.theCurrentUserID)}
                        // refresh={this.grabFireBaseRoutinesGoalsData} //function to refresh IS data
                        theCurrentUserId={this.props.theCurrentUserID}
                        theCurrentTAID={this.props.theCurrentTAID}
                        // chnagePhoto = {this.changePhotoIcon()}
                    /> */}
                </div>
                ) : (
                <div>
                    <Row style={{ marginLeft: "100px" }} className="d-flex ">
                    {r["is_available"] ? (
                        <div style={{ marginLeft: "5px" }}>
                        <FontAwesomeIcon
                            title="Available to the user"
                            //style={{ color: this.state.availabilityColorCode }}
                            onClick={(e) => {
                            e.stopPropagation();
                            alert("Item Is Availble to the user");
                            }}
                            icon={faUser}
                            size="lg"
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
                            size="lg"
                        />
                        </div>
                    )}
                    {(r.is_sublist_available === "True") ? (
                            <div>
                            <FontAwesomeIcon
                            icon={faList}
                            title="SubList Available"
                            style={{ color: "#D6A34C", marginLeft: "20px" }}
                            // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShow: false}); this.editFirBaseFalse()}}
                            //onClick={this.ListFalse}
                            size="lg"
                            />
                        </div>
                        ) : (
                            <div
                            // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShowATModal: false})}}>
                            >
                            
                            </div>
                        )}
                    </Row>
                    <Row
                    style={{ marginTop: "15px", marginLeft: "100px" }}
                    className="d-flex "
                    >
                    <DeleteGR
                    //   BASE_URL={this.props.BASE_URL}
                    //     deleteIndex={this.findIndexByID(tempID)}
                    //     Array={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                    //     // Path={this.state.firebaseRootPath} //holds complete data for action task: fbPath, title, etc
                    //     // Path={firebase
                    //     //   .firestore()
                    //     //   .collection("users")
                    //     //   .doc(this.props.theCurrentUserID)}
                    //     // refresh={this.grabFireBaseRoutinesGoalsData}
                    //     theCurrentUserId={this.props.theCurrentUserID}
                    //     theCurrentTAID={this.props.theCurrentTAID}
                    />
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
                    </Row>
                    <Row>
                    <EditGR
                    //   BASE_URL={this.props.BASE_URL}
                    //     closeEditModal={() => {
                    //       this.setState({ showEditModal: false });
                    //       this.props.updateFBGR();
                    //     }}
                    
                    //     showModal={this.state.showEditModal}
                    //     indexEditing={this.state.indexEditing}
                    //     i={this.findIndexByID(tempID)} //index to edit
                    //     ATArray={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                    //     // FBPath={firebase
                    //     //   .firestore()
                    //     //   .collection("users")
                    //     //   .doc(this.props.theCurrentUserID)}
                    //     // refresh={this.grabFireBaseRoutinesGoalsData} //function to refresh IS data
                    //     theCurrentUserId={this.props.theCurrentUserID}
                    //     theCurrentTAID={this.props.theCurrentTAID}
                    />
                    </Row>
                </div>
                )}
                <Row>
                <CopyGR
                    //   BASE_URL={this.props.BASE_URL}
                    //   indexEditing={this.state.indexEditing}
                    //     i={this.findIndexByID(tempID)}
                    //   closeCopyModal={() => {
                    //     this.setState({
                    //     showCopyModal: false,
                    //     });
                    //   }}
                    //   showModal={this.state.showCopyModal}
                    //   title={tempTitle}
                    //   gr_id={tempID}
                    //   ATArray={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                    //   // refresh={this.grabFireBaseRoutinesGoalsData}
                    //   theCurrentUserId={this.props.theCurrentUserID}
                    //   theCurrentTAID={this.props.theCurrentTAID}
                    />
                </Row>
            

                <Row>
                {/* {this.props.showRoutine &&
                    (this.state.WentThroughATList[tempID] === false ||
                    this.state.WentThroughATList[tempID] === undefined)} */}

                {/* <Col
                    style={{
                    paddingRight: "0px",
                    paddingLeft: "0px",
                    marginLeft: "10px",
                    }}
                >
                    {this.showRoutineRepeatStatus(i)}
                </Col>

                <Col xs={6} style={{ paddingLeft: "0px", paddingRight: "0px" }}>
                    {this.thisTakesMeGivenVsSelected(i, tempID)}
                </Col> */}
                </Row>
            </div>
        )
    }

    function displayActions(a, r){
        return(
            <div
            
                style={{ height:'6rem', width:'100%', backgroundColor:'#BBC7D7' , marginBottom:'0px'}}
            >
                
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                <div flex='1' style={{marginLeft:'1.5rem', marginTop:'1rem', height:'4.25rem', borderRadius:'10px',width:'65%', display:'flex', justifyContent:'space-between', backgroundColor:'#F8BE28', boxShadow:
                    "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
                zIndex:'50%'}}>
                <div flex='1' style={{marginTop:'0.5rem', display:'flex', flexDirection:'column', justifyContent:'flex-start' }} >
                <div style={{ marginLeft:'1rem'}} >
                {r["start_day_and_time"] && r["end_day_and_time"] ? (
                    <div
                    style={{
                        fontSize: "8px",
                        color:'#F8BE28'
                    }}
                    >
                    {
                        formatDateTime(
                        r["start_day_and_time"]  
                        )}
                        -
                    {
                        formatDateTime(
                        r["end_day_and_time"]
                        )}
                    </div>
                ) : (
                    <Col> </Col>
                )}
                
                </div>

                <div style={{color:'#ffffff', size:'24px', textDecoration:'underline', fontWeight:'bold', marginLeft: "10px",}}>
                {a["at_title"]}
                </div>
                    
                    {/* ({date}) */}
                </div>

            <div style={{display:'flex', flexDirection:'column', justifyContent:'space-evenly'}}>
                <div>

                <Col xs={7} style={{ paddingRight: "1rem"  ,marginTop:'0.5rem'}}>
                        <img
                        src={a["photo"]}
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
                            onClick = {()=> changeShowBelow(a)}
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
                        {a["is_available"] ? (
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

                {a["photo"] ? (
                <div>
            
                    {/* <EditGR
                    BASE_URL={this.props.BASE_URL}
                        closeEditModal={() => {
                        this.setState({ showEditModal: true });
                        this.props.updateFBGR();
                        }}
                        showModal={this.state.showEditModal}
                        indexEditing={this.state.indexEditing}
                        i={this.findIndexByID(tempID)} //index to edit
                        ATArray={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                        // FBPath={firebase
                        //   .firestore()
                        //   .collection("users")
                        //   .doc(this.props.theCurrentUserID)}
                        // refresh={this.grabFireBaseRoutinesGoalsData} //function to refresh IS data
                        theCurrentUserId={this.props.theCurrentUserID}
                        theCurrentTAID={this.props.theCurrentTAID}
                        // chnagePhoto = {this.changePhotoIcon()}
                    /> */}
                </div>
                ) : (
                <div>
                    <Row style={{ marginLeft: "100px" }} className="d-flex ">
                    {a["is_available"] ? (
                        <div style={{ marginLeft: "5px" }}>
                        <FontAwesomeIcon
                            title="Available to the user"
                            //style={{ color: this.state.availabilityColorCode }}
                            onClick={(e) => {
                            e.stopPropagation();
                            alert("Item Is Availble to the user");
                            }}
                            icon={faUser}
                            size="lg"
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
                            size="lg"
                        />
                        </div>
                    )}
                    {(a.is_sublist_available === "True") ? (
                            <div>
                            <FontAwesomeIcon
                            icon={faList}
                            title="SubList Available"
                            style={{ color: "#D6A34C", marginLeft: "20px" }}
                            // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShow: false}); this.editFirBaseFalse()}}
                            //onClick={this.ListFalse}
                            size="lg"
                            />
                        </div>
                        ) : (
                            <div
                            // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShowATModal: false})}}>
                            >
                            
                            </div>
                        )}
                    </Row>
                    <Row
                    style={{ marginTop: "15px", marginLeft: "100px" }}
                    className="d-flex "
                    >
                    <DeleteGR
                    //   BASE_URL={this.props.BASE_URL}
                    //     deleteIndex={this.findIndexByID(tempID)}
                    //     Array={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                    //     // Path={this.state.firebaseRootPath} //holds complete data for action task: fbPath, title, etc
                    //     // Path={firebase
                    //     //   .firestore()
                    //     //   .collection("users")
                    //     //   .doc(this.props.theCurrentUserID)}
                    //     // refresh={this.grabFireBaseRoutinesGoalsData}
                    //     theCurrentUserId={this.props.theCurrentUserID}
                    //     theCurrentTAID={this.props.theCurrentTAID}
                    />
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
                    </Row>
                    <Row>
                    <EditGR
                    //   BASE_URL={this.props.BASE_URL}
                    //     closeEditModal={() => {
                    //       this.setState({ showEditModal: false });
                    //       this.props.updateFBGR();
                    //     }}
                    
                    //     showModal={this.state.showEditModal}
                    //     indexEditing={this.state.indexEditing}
                    //     i={this.findIndexByID(tempID)} //index to edit
                    //     ATArray={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                    //     // FBPath={firebase
                    //     //   .firestore()
                    //     //   .collection("users")
                    //     //   .doc(this.props.theCurrentUserID)}
                    //     // refresh={this.grabFireBaseRoutinesGoalsData} //function to refresh IS data
                    //     theCurrentUserId={this.props.theCurrentUserID}
                    //     theCurrentTAID={this.props.theCurrentTAID}
                    />
                    </Row>
                </div>
                )}
                <Row>
                <CopyGR
                    //   BASE_URL={this.props.BASE_URL}
                    //   indexEditing={this.state.indexEditing}
                    //     i={this.findIndexByID(tempID)}
                    //   closeCopyModal={() => {
                    //     this.setState({
                    //     showCopyModal: false,
                    //     });
                    //   }}
                    //   showModal={this.state.showCopyModal}
                    //   title={tempTitle}
                    //   gr_id={tempID}
                    //   ATArray={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                    //   // refresh={this.grabFireBaseRoutinesGoalsData}
                    //   theCurrentUserId={this.props.theCurrentUserID}
                    //   theCurrentTAID={this.props.theCurrentTAID}
                    />
                </Row>
            

                <Row>
                {/* {this.props.showRoutine &&
                    (this.state.WentThroughATList[tempID] === false ||
                    this.state.WentThroughATList[tempID] === undefined)} */}

                {/* <Col
                    style={{
                    paddingRight: "0px",
                    paddingLeft: "0px",
                    marginLeft: "10px",
                    }}
                >
                    {this.showRoutineRepeatStatus(i)}
                </Col>

                <Col xs={6} style={{ paddingLeft: "0px", paddingRight: "0px" }}>
                    {this.thisTakesMeGivenVsSelected(i, tempID)}
                </Col> */}
                </Row>
            </div>
        )
    }

    function displayInstructions(i, a, r){
        return(
            <div
            
                style={{ height:'6rem', width:'100%', backgroundColor:'#BBC7D7' , marginBottom:'0px'}}
            >
                
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                <div flex='1' style={{marginLeft:'2rem', marginTop:'1rem', height:'4rem', borderRadius:'10px',width:'65%', display:'flex', justifyContent:'space-between', backgroundColor:'#67ABFC', boxShadow:
                    "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
                zIndex:'50%'}}>
                <div flex='1' style={{marginTop:'0.5rem', display:'flex', flexDirection:'column', justifyContent:'flex-start' }} >
                <div style={{ marginLeft:'1rem'}} >
                {r["start_day_and_time"] && r["end_day_and_time"] ? (
                    <div
                    style={{
                        fontSize: "8px",
                        color:'#67ABFC'
                    }}
                    >
                    {
                        formatDateTime(
                        r["start_day_and_time"]  
                        )}
                        -
                    {
                        formatDateTime(
                        r["end_day_and_time"]
                        )}
                    </div>
                ) : (
                    <Col> </Col>
                )}
                
                </div>

                <div style={{color:'#ffffff', size:'24px', textDecoration:'underline', fontWeight:'bold', marginLeft: "10px",}}>
                {i["title"]}
                </div>
                    
                    {/* ({date}) */}
                </div>

            <div style={{display:'flex', flexDirection:'column', justifyContent:'space-evenly'}}>
                <div>

                <Col xs={7} style={{ paddingRight: "1rem"  ,marginTop:'0.5rem'}}>
                        <img
                        src={i["photo"]}
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
                        {i["is_available"] ? (
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

                {i["photo"] ? (
                <div>
            
                    {/* <EditGR
                    BASE_URL={this.props.BASE_URL}
                        closeEditModal={() => {
                        this.setState({ showEditModal: true });
                        this.props.updateFBGR();
                        }}
                        showModal={this.state.showEditModal}
                        indexEditing={this.state.indexEditing}
                        i={this.findIndexByID(tempID)} //index to edit
                        ATArray={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                        // FBPath={firebase
                        //   .firestore()
                        //   .collection("users")
                        //   .doc(this.props.theCurrentUserID)}
                        // refresh={this.grabFireBaseRoutinesGoalsData} //function to refresh IS data
                        theCurrentUserId={this.props.theCurrentUserID}
                        theCurrentTAID={this.props.theCurrentTAID}
                        // chnagePhoto = {this.changePhotoIcon()}
                    /> */}
                </div>
                ) : (
                <div>
                    <Row style={{ marginLeft: "100px" }} className="d-flex ">
                    {i["is_available"] ? (
                        <div style={{ marginLeft: "5px" }}>
                        <FontAwesomeIcon
                            title="Available to the user"
                            //style={{ color: this.state.availabilityColorCode }}
                            onClick={(e) => {
                            e.stopPropagation();
                            alert("Item Is Availble to the user");
                            }}
                            icon={faUser}
                            size="lg"
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
                            size="lg"
                        />
                        </div>
                    )}
                    {/* {a["is_sublist_available"] ? (
                            <div>
                            <FontAwesomeIcon
                            icon={faList}
                            title="SubList Available"
                            style={{ color: "#D6A34C", marginLeft: "20px" }}
                            // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShow: false}); this.editFirBaseFalse()}}
                            //onClick={this.ListFalse}
                            size="lg"
                            />
                        </div>
                        ) : (
                            <div
                            // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShowATModal: false})}}>
                            >
                            
                            </div>
                        )} */}
                    </Row>
                    <Row
                    style={{ marginTop: "15px", marginLeft: "100px" }}
                    className="d-flex "
                    >
                    <DeleteGR
                    //   BASE_URL={this.props.BASE_URL}
                    //     deleteIndex={this.findIndexByID(tempID)}
                    //     Array={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                    //     // Path={this.state.firebaseRootPath} //holds complete data for action task: fbPath, title, etc
                    //     // Path={firebase
                    //     //   .firestore()
                    //     //   .collection("users")
                    //     //   .doc(this.props.theCurrentUserID)}
                    //     // refresh={this.grabFireBaseRoutinesGoalsData}
                    //     theCurrentUserId={this.props.theCurrentUserID}
                    //     theCurrentTAID={this.props.theCurrentTAID}
                    />
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
                    </Row>
                    <Row>
                    <EditGR
                    //   BASE_URL={this.props.BASE_URL}
                    //     closeEditModal={() => {
                    //       this.setState({ showEditModal: false });
                    //       this.props.updateFBGR();
                    //     }}
                    
                    //     showModal={this.state.showEditModal}
                    //     indexEditing={this.state.indexEditing}
                    //     i={this.findIndexByID(tempID)} //index to edit
                    //     ATArray={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                    //     // FBPath={firebase
                    //     //   .firestore()
                    //     //   .collection("users")
                    //     //   .doc(this.props.theCurrentUserID)}
                    //     // refresh={this.grabFireBaseRoutinesGoalsData} //function to refresh IS data
                    //     theCurrentUserId={this.props.theCurrentUserID}
                    //     theCurrentTAID={this.props.theCurrentTAID}
                    />
                    </Row>
                </div>
                )}
                <Row>
                <CopyGR
                    //   BASE_URL={this.props.BASE_URL}
                    //   indexEditing={this.state.indexEditing}
                    //     i={this.findIndexByID(tempID)}
                    //   closeCopyModal={() => {
                    //     this.setState({
                    //     showCopyModal: false,
                    //     });
                    //   }}
                    //   showModal={this.state.showCopyModal}
                    //   title={tempTitle}
                    //   gr_id={tempID}
                    //   ATArray={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                    //   // refresh={this.grabFireBaseRoutinesGoalsData}
                    //   theCurrentUserId={this.props.theCurrentUserID}
                    //   theCurrentTAID={this.props.theCurrentTAID}
                    />
                </Row>
            

                <Row>
                {/* {this.props.showRoutine &&
                    (this.state.WentThroughATList[tempID] === false ||
                    this.state.WentThroughATList[tempID] === undefined)} */}

                {/* <Col
                    style={{
                    paddingRight: "0px",
                    paddingLeft: "0px",
                    marginLeft: "10px",
                    }}
                >
                    {this.showRoutineRepeatStatus(i)}
                </Col>

                <Col xs={6} style={{ paddingLeft: "0px", paddingRight: "0px" }}>
                    {this.thisTakesMeGivenVsSelected(i, tempID)}
                </Col> */}
                </Row>
            </div>
        )
    }



    if(isLoading){
        return(
            <div>
                <h1>Loading...</h1>
            </div>
        )
    }
    return(
        <Box width = "350px">
            <Button className={classes.buttonSelection} onClick={() => history.push("/matts")} id="one">
                History
        </Button>
            <Button className={classes.buttonSelection} id="one">
                Events
        </Button>
            <Button
                className={classes.buttonSelection}
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
        <p></p>
        <row>
                {rows}
        </row>
        </Box>
    )

}