import React, {useContext, useEffect, useState} from 'react';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
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
import EditIcon from "./EditRTS/EditIcon.jsx";
import EditActionIcon from "./EditATS/EditIcon.jsx"
import EditStepsIcon from "./EditIS/EditIcon.jsx"
import CopyIcon from "../manifest/OldManifest/CopyIcon.jsx";
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

export default function Firebasev2(props)  {
    const history = useHistory();
    const inRange = [];
    const currentUser = props.theCurrentUserID;
    const [listOfBlocks, setlistOfBlocks] = useState([]);
    const [historyGot, setHG] = useState([]);
    const [iconColor, setIconColor] = useState()
    //NOTE This gives you routines within 7 days of current date. Change currentDate to change that
    const [currentDate, setCurDate] = useState(new Date(Date.now()))
    const classes = useStyles();
    const [rows, setRows] = useState([]);
    function createData(name, sun, mon, tue, wed, thurs, fri, sat, show, under, photo, startTime, endTime, is_sublist_available, type, id){    //rows structure
        return {name, sun, mon, tue, wed, thurs, fri, sat, show, under, photo, startTime, endTime, is_sublist_available, type, id}
    }

    useEffect(() => {
        setHG([])
        console.log("in useEffect Firebasev2", currentUser)
     //   console.log(currentUser)
        axios.get("https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/getHistory/" + currentUser)
        .then((response) =>{
            for(var i=0; i <response.data.result.length; i++){
                historyGot.push(response.data.result[i]);
            }
            console.log("historyGot",historyGot);
            cleanData(historyGot, currentDate);
            
        })
        .catch((error) => {
            console.log(error);
        });
    },[props.theCurrentUserID, props.edit, ])

    {/* EXPERIMENTAL */}

    const getCurrentUser = () => {
        axios.get("https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/getHistory/" + currentUser)
        .then((response) =>{
            for(var i=0; i <response.data.result.length; i++){
                historyGot.push(response.data.result[i]);
            }
            console.log("historyGot")
            console.log(historyGot);
            cleanData(historyGot, currentDate);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    {/* EXPERIMENTAL */}

    
    //This clean data is from History Page - it creates "rows" of routines actions and instructions

     //-------- clean historyGot - just dates we want, just info we want, and structure vertical to horizontal   --------
     function cleanData(historyGot, useDate){
        
        //go through at find historyGots that are within 7 days of useDate
        console.log("date:" + useDate);
        const temp = [];
        for(var i=0; i <historyGot.length; i++){
            var historyDate = new Date(historyGot[i].date);
            if ((historyDate.getTime() >= useDate.getTime() - 604800000)    //filter for within 7 datets
            && historyDate.getTime() <= useDate.getTime()){                 // 7: 604800000    2: 172800000
                temp.push(historyGot[i]);
            }
        }
        console.log('temp',temp)
        //now temp has data we want
    // move temp to inRange with no repeats
        const map = new Map();
        for (const item of temp){
            if(!map.has(item.date)){
                map.set(item.date, true);
                inRange.push({
                    date: item.date,
                    details: item.details
                })
            }
        }
        inRange.reverse();//put latest day at end

        console.log('inRange', inRange)
        //bigList will hold new data format sidewase
        var bigList = [];       
        for (var d = 0; d < inRange.length; d++){
            const obj = JSON.parse(inRange[d].details)
            console.log("obj",obj);
            //sort obj by time of day
            obj.sort((a, b) => a.start_day_and_time - b.start_day_and_time);
            for (var r = 0; r < obj.length; r++){           //FOR ROUTINES
             //   if(obj[r].routine !== undefined){
                if(obj[r].title){
                    // console.log("gere");
                    var isNewR = true;
                    for (var s=0; s<bigList.length; s++){       //check through and see if this is a new routine
                        if (bigList[s].type == "Routine" && bigList[s].title == obj[r].title){
                            bigList[s].days[d] = obj[r].status;   //if already there- just update that day status
                           // bigList[s].id = obj[r].routine;
                            isNewR = false;
                            break;
                        }
                    }
                    if (isNewR){
                        var currentR = {type: "Routine", title: obj[r].title, under: "", days: [], tBox: {}, 
                        show: true, photo: obj[r].photo, startTime: obj[r].start_day_and_time, 
                        endTime: obj[r].end_day_and_time, is_sublist_available: obj[r].is_sublist_available,id: obj[r].routine || obj[r].goal}; //if new, make object and put in bigList
                        currentR.days[d] = obj[r].status;
                        bigList.push(currentR);
                    }

                    if(obj[r].actions!= undefined){
                        var actions = obj[r].actions;
                        for (var a=0; a < actions.length; a++){         //FOR ACTIONS
                            if(actions[a].title){
                                var isNewA = true;
                                for (var s=0; s<bigList.length; s++){
                                    if(bigList[s].type == "Action" && bigList[s].title == actions[a].title){
                                        bigList[s].days[d] = actions[a].status;
                                        isNewA = false;
                                        break;
                                    }
                                }
                                if(isNewA){
                                    var currentA = {type: "Action", title: actions[a].title, under: obj[r].title, days:[], tBox: {}, show: false, id: actions[a].action};
                                    currentA.days[d] = actions[a].status;
                                    bigList.push(currentA);
                                }
                                if(actions[a].instructions != undefined){
                                    var insts = actions[a].instructions;
                                    for(var i=0; i < insts.length; i++){        //FOR INSTRUCTIONS
                                        if (insts[i].title){
                                            var isNewI = true;
                                            for(var s=0; s<bigList.length; s++){
                                                if (bigList[s].type == "Instruction" && bigList[s].title == insts[i].title){
                                                    bigList[s].days[d] = insts[i].status;
                                                    isNewI = false;
                                                    break;
                                                }
                                            }
                                            if(isNewI){
                                                var currentI = {type: "Instruction", title: insts[i].title, under: actions[a].title, days:[], tBox: {}, show: false};
                                                currentI.days[d] = insts[i].status;
                                                bigList.push(currentI);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
              //  }
            }
            }
        }
        
        setRows([]);
        console.log("ROWS" + rows);
        console.log(bigList);
        // bigList = addCircles(bigList);
        // console.log(bigList);
       // bigList = addNames(bigList, routines);
        // console.log(bigList);
        for (var i=0; i< bigList.length; i++){
            rows.push(createData(bigList[i].title, bigList[i].days[6], bigList[i].days[5], bigList[i].days[4], bigList[i].days[3],
                 bigList[i].days[2], bigList[i].days[1], bigList[i].days[0], bigList[i].show, bigList[i].under, bigList[i].photo,
                 bigList[i].startTime, bigList[i].endTime, bigList[i].is_sublist_available, bigList[i].type, bigList[i].id));
        }
        // console.log(tempRows);
        // setRows(tempRows);
        console.log('rows',rows);
        // console.log("GERE");
        makeDisplays(onlyAllowed(rows));
        return(true);
    }



      //only return rows with "show"
    function onlyAllowed(rows){
        var newRows = [];
        for (var r=0; r < rows.length; r ++){
            if (rows[r].show){
                //console.log("here: " + rows[r].name);
                newRows.push(rows[r]);
            }
        }
        return(newRows);
    }

    //makes listOfBlocks with list of displays routiens and such
    function makeDisplays(onlyAllowed){     //add displays to tempRows
        var tempRows = [];
        var routine;
        var action;
        for (var i=0; i <onlyAllowed.length; i++){
            if (onlyAllowed[i].type == "Routine"){
                console.log("allow", onlyAllowed[i])
                tempRows.push(displayRoutines(onlyAllowed[i]));
                routine = onlyAllowed[i];
                console.log("only", onlyAllowed[i]);
            }
            else if (onlyAllowed[i].type == "Action"){
                tempRows.push(displayActions(onlyAllowed[i], routine));
                action = onlyAllowed[i];
            }
            else {tempRows.push(displayInstructions(onlyAllowed[i], action))}
        }
        console.log(tempRows);
        setlistOfBlocks(tempRows);
        console.log(listOfBlocks);
    }

    function formatDateTime(str) {
        let newTime = new Date(str).toLocaleTimeString();
        newTime = newTime.substring(0, 5) + " " + newTime.slice(-2);
        return newTime;
      }

    //when clicking the subroutines button
    function clickHandle(name){
        console.log(rows);
        var newRows = [];
        //take out duplicates of rows (copy into newRows)
        const map = new Map();
        for (const item of rows){
            if(!map.has(item.name)){
                map.set(item.name, true);
                newRows.push(item)
            }
        }
        //if clicked on, change show of things underneath
        console.log("click." + name);
        console.log(newRows);
        for (var r =0; r < newRows.length; r++){
            if (rows[r].under == name){
                //console.log("got " + rows[r].name);
                newRows[r].show = !rows[r].show;
                console.log(rows[r].name + " -> " + newRows[r].show);
                //also close instructions of routines clicked on. 2 levels deep
                for (var i=0; i<newRows.length; i++){
                    if(rows[i].under == rows[r].name && rows[i].show){
                        newRows[i].show = !rows[i].show;
                        console.log(rows[i].name + " -> " + newRows[i].show);
                    }
                }
            }

        }
        // console.log(childIn);
        setRows(newRows);    //update rows with newRows
        makeDisplays(onlyAllowed(newRows));
    }

    //Creates actual boxes to display

    function displayRoutines(r){
        return(
            <ListGroup.Item
            
                style={{  backgroundColor:'#BBC7D7' , marginTop: '1px'}}
                onClick={() => {
                    props.sethighLight(r["gr_title"])
                  }}
            >
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                <div flex='1' style={{marginLeft:'1rem', height:'4.5rem', borderRadius:'10px',width:'65%', display:'flex', justifyContent:'space-between', backgroundColor:'#FF6B4A', boxShadow:
                    "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.09)",
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
                        src={r["photo"]}
                        alt="Routines"
                        className="center"
                        height="28px"
                        width="28px"
                        />
                    </Col>
                </div>
                <div style={{marginLeft:'1.5rem'}}>
               
                            <div>
                            {(r.is_sublist_available === "True") ? (
                            <div>
                            <FontAwesomeIcon
                            icon={faList}
                            title="SubList Available"
                            style={{ color: "#ffffff" }}
                            size="small"
                            onClick = {()=> {
                                // sendRoutineToParent(r.name);
                              //  clickHandle(r.name)
                                // setLoading(!isLoading);
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
                </div>

                <div style={{ display:"flex" }}>
                <div style={{marginRight:'1rem',display:'flex', flexDirection:'column', textAlign: 'center'}}>
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
                    <div style={{marginRight:'1rem',display:'flex',  flexDirection:'column'}}>

                   <div>
                  <EditIcon
                    routine={r}
                    task={null}
                    step={currentUser} 
                  //  id={currentUser} 
                  />

                  </div>
                    {/* working on this thing */}
                    <div>
                    {(r.is_sublist_available === "True") ? (
                            <div>
                            <FontAwesomeIcon
                            icon={faList}
                            title="SubList Available"
                            style={{ color: "#ffffff" }}
                            size="small"
                            onClick = {()=> {
                                // sendRoutineToParent(r.name);
                                clickHandle(r.name)
                                // setLoading(!isLoading);
                            }}
                            />
                        </div>
                        ) : (
                            <div
                            // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShowATModal: false})}}>
                            >
                                <FontAwesomeIcon
                                    icon={faList}
                                    //title="SubList Available"
                                    style={{ color: "#ffffff", opacity: '0' }}
                                    size="small"
                                    // onClick = {()=> {
                                    //     // sendRoutineToParent(r.name);
                                    //     clickHandle(r.name)
                                    //     // setLoading(!isLoading);
                                    // }}
                                />
                            </div>
                        )}
                    </div>
                    <div>
                    <PlaylistAddIcon
                    style={{color:"#ffffff"}}
                    onClick = {(e)=> {
                          e.target.style.color = "#000000"
                      
                    }}/>
                    </div>
                    </div>
                </div>
                </div>
            </ListGroup.Item>
        )
    }

    function displayActions(a, r){
        return(
            <div
            
                style={{  backgroundColor:'#BBC7D7' , marginBottom:'0px'}}
            >
                
                <div style={{ display:'flex', justifyContent:'space-evenly' }}>
                <div flex='1' style={{marginLeft:'1rem',marginTop:'0.5rem',borderRadius:'10px',height:'4.5rem',width:'60%', display:'flex', justifyContent:'space-between', backgroundColor:'#F8BE28', boxShadow:
                    "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
                zIndex:'50%'}}>
                <div flex='1' style={{ display:'flex', flexDirection:'column', justifyContent:'flex-start' }} >
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
                        src={a["photo"]}
                        alt="Routines"
                        className="center"
                        height="28px"
                        width="28px"
                        />
                    </Col>
                </div>
                <div style={{marginLeft:'1.5rem'}}>
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

                <div style={{ display:"flex" , marginTop:'1rem'}}>
                <div style={{marginRight:'1rem',display:'flex', justifyContent:'space-evenly', flexDirection:'column', alignItems:'left'}}>

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
                    <EditActionIcon
                    routine={a}
                    task={r.id}
                    step={null}  
                  />

                    </div>

                    <div>
             

                               {/* {(a.is_sublist_available === "True") ? ( */}
                                <div>
                            <FontAwesomeIcon
                            icon={faList}
                            title="SubList Available"
                            style={{ color: "#ffffff" }}
                            size="small"
                            onClick = {()=> {
                                // sendRoutineToParent(a.name);
                                clickHandle(a.name)
                                // setLoading(!isLoading);
                            }}
                            />
                        </div>
                        {/* ) : (
                            <div
                            // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShowATModal: false})}}>
                            >
                            </div>
                        )} */}
                    </div>

                    <div>
                    <PlaylistAddIcon
                    style={{color:"#ffffff"}}
                    onClick = {(e)=> {
                          e.target.style.color = "#000000"
                      
                    }}/>
                    </div>
                    </div>
                </div>
                </div>

            </div>
        )
    }

    function displayInstructions(i, a){
        return(
            <div
            
                style={{ backgroundColor:'#BBC7D7' , marginBottom:'0px'}}
            >
                
                <div style={{ display:'flex', justifyContent:'space-evenly' }}>
                <div flex='1' style={{marginLeft:'1rem', marginTop:'0.5rem', height:'4.5rem', borderRadius:'10px',width:'60%', display:'flex', justifyContent:'space-between', backgroundColor:'#67ABFC', boxShadow:
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
                    <EditStepsIcon
                    routine={i}
                    task={null}
                    step={a.id}  
                  />
                    </div>
                </div>
                </div>

                
            </div>
        )
    }

    console.log("Kyle Test: " + currentUser)
    

    return(
     
        <row>
                {/* {getCurrentUser()} */}
                {listOfBlocks}
        </row>
    )

}