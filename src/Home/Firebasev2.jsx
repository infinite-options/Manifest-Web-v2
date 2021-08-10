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
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
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
    console.log('firebase props', props)
    const history = useHistory();
    const inRange = [];
    const currentUser = props.theCurrentUserID;
    //var currentUser = ''

    // if (
    //     document.cookie
    //       .split(";")
    //       .some(item => item.trim().startsWith("patient_uid="))
    //   ) {
    //     currentUser = document.cookie.split('; ').find(row => row.startsWith('patient_uid=')).split('=')[1]
    //   } else {
    //     currentUser = props.theCurrentUserID;
    //   }

    const [listOfBlocks, setlistOfBlocks] = useState([]);
    const [historyGot, setHG] = useState([]);
    const [iconColor, setIconColor] = useState()
    //NOTE This gives you routines within 7 days of current date. Change currentDate to change that
    const [currentDate, setCurDate] = useState(new Date(Date.now()))
    const classes = useStyles();
    const [rows, setRows] = useState([]);
    const [called, toggleCalled] = useState(false)

    const [showCopyModal, toggleCopyModal] = useState([false, ''])
    const [showCopyModalPatients, toggleCopyModalPatients] = useState([false, ''])
    const [showCopyModalConfirm, toggleCopyModalConfirm] = useState(false)
    const [allTAData, setTAData] = useState([])
    const [allPatientData, setPatientData] = useState([])
    const [taToCopyTo, setTAToCopyTo] = useState({})
    const [patientToCopyTo, setPatientToCopyTo] = useState({})
    const [GR, setGR] = useState([])
    const [copiedRoutineName, setCRN] = useState('')
    var copiedRoutineID =''
    // var copiedRoutineName = ''
    function createData(name, sun, mon, tue, wed, thurs, fri, sat, show, under, photo, startTime, endTime, is_sublist_available, type, id, is_available){    //rows structure
        return {name, sun, mon, tue, wed, thurs, fri, sat, show, under, photo, startTime, endTime, is_sublist_available, type, id, is_available}
    }

    useEffect(() => {
        setHG([])
        console.log("in useEffect Firebasev2", currentUser)
     //   console.log(currentUser)
        axios.get("https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/getHistory/" + currentUser)
        .then((response) =>{
            for(var i=0; i <response.data.result.length; i++){
            // for(var i=response.data.result.length - 1; i > -1; i--){
                
                historyGot.push(response.data.result[i]);
                
            }
            console.log("historyGot",historyGot);
            cleanData(historyGot, currentDate);
            
        })
        .catch((error) => {
            console.log(error);
        });

        setTAData([])
        setPatientData([])
        axios.get("https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/listAllTAForCopy")
        .then(response => {
            setTAData(response.data.result)
            
            })
        .catch((error) => {
            console.log(error);
        });

        setGR([])
        axios.get("https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/getgoalsandroutines/" + currentUser)
        .then(response => {
            // setGR(response.data.result)
            for(var i = 0; i < response.data.result.length; i++) {
                GR.push(response.data.result[i])
            }
            })
        .catch((error) => {
            console.log(error);
        });
        
        
    },[props.theCurrentUserID, props.edit, called, props.editRTS,props.editATS,props.editIS])

    const copyModal = () => {
        // console.log('in FireBase, showCopyModal', showCopyModal)
        //var taToCopyTo = document.cookie.split('; ').find(row => row.startsWith('ta_uid=')).split('=')[1]
        // var taToCopyTo = '-1'
        // var patients = []
        // var patientToCopyTo = '-1'
        console.log(allTAData)
        if (showCopyModal[0]) {
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
                    {console.log('in modal', allTAData)}
                    <div>Routine: {copiedRoutineName}, {showCopyModal[1]}</div>
                    <div>Select Trusted Advisor to copy to</div>
                    <div>
                        <select
                            onChange={e => {
                                console.log(JSON.parse(e.target.value))
                                setTAToCopyTo(JSON.parse(e.target.value))
                            }}
                        >
                            <option value='-1'>Select</option>

                           {allTAData.map((ta) => (
                               <option value={JSON.stringify({
                                   name: ta.name,
                                   ta_unique_id: ta.ta_unique_id,
                                   users: ta.users
                               })}>
                                   {ta.name}
                               </option>
                           ))}
                        </select>
                    </div>
                    
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
                        toggleCopyModal(false)
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
                        console.log('test',taToCopyTo)
                        if(!taToCopyTo.users){
                            alert('Select a TA')
                        } else {
                        toggleCopyModalPatients([true, ''])
                        toggleCopyModal([false, showCopyModal[1]])
                        }
                        
                        //console.log(taToCopyTo)
                    }}
                    >
                        Yes
                    </button>
                    </div>
                </div>
                </div>
            )
        }
        return null
    }

    const copyModalPatients = () => {
        // console.log('in FireBase, showCopyModal', showCopyModal)
        //var taToCopyTo = document.cookie.split('; ').find(row => row.startsWith('ta_uid=')).split('=')[1]
        // var taToCopyTo = '-1'
        // var patients = []
        // var patientToCopyTo = '-1'
        console.log(taToCopyTo)
        if (showCopyModalPatients[0]) {
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
                    {console.log('in modal', allTAData)}
                    <div>Routine: {copiedRoutineName}, {showCopyModal[1]}</div>
                    <div>Trusted Advisor: {taToCopyTo.name}, {taToCopyTo.ta_unique_id}</div>
                    <div>Select patient to copy to</div>
                    <div>
                        <select
                            onChange={e => {
                                console.log(JSON.parse(e.target.value))
                                setPatientToCopyTo(JSON.parse(e.target.value))
                            }}
                        >
                            <option value='-1'>Select</option>
                           {taToCopyTo.users.map((pa) => (
                               <option value={JSON.stringify({
                                   user_name: pa.user_name,
                                   user_unique_id: pa.user_unique_id,
                                //    users: ta.users
                               })}>
                                   {pa.user_name}
                               </option>
                           ))}
                        </select>
                    </div>
                    
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
                        toggleCopyModalPatients(false)
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
                        if(!patientToCopyTo.user_name) {
                            alert('Select a patient')
                        } else {

                        
                        toggleCopyModalConfirm(true)
                        toggleCopyModalPatients([false, ''])
                        console.log(patientToCopyTo)
                        }
                    }}
                    >
                        Yes
                    </button>
                    </div>
                </div>
                </div>
            )
        }
        return null
    }

    const copyModalConfirm = () => {
        // console.log('in FireBase, showCopyModal', showCopyModal)
        //var taToCopyTo = document.cookie.split('; ').find(row => row.startsWith('ta_uid=')).split('=')[1]
        // var taToCopyTo = '-1'
        // var patients = []
        // var patientToCopyTo = '-1'
        //console.log(allTAData)
        if (showCopyModalConfirm) {
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
                    {console.log('in confirm', taToCopyTo, patientToCopyTo, showCopyModal[1])}
                    {/* <div>{showCopyModal[1]}</div>
                    <div>{taToCopyTo.name}, {taToCopyTo.ta_unique_id}</div>
                    <div>{patientToCopyTo.user_name}, {patientToCopyTo.user_unique_id}</div> */}
                    <div>Routine: {copiedRoutineName}, {showCopyModal[1]}</div>
                    <div>Trusted Advisor: {taToCopyTo.name}, {taToCopyTo.ta_unique_id}</div>
                    <div>Patient: {patientToCopyTo.user_name}, {patientToCopyTo.user_unique_id}</div>
                    
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
                        toggleCopyModalConfirm(false)
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
                        

                        
                        console.log(taToCopyTo)

                        var myObj = {
                            user_id: patientToCopyTo.user_unique_id,
                            gr_id: showCopyModal[1],
                            ta_id: taToCopyTo.ta_unique_id
                        }

                        console.log(myObj)

                        axios
                            .post('https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/copyGR', myObj)
                            .then(response => {
                                console.log(response.data)
                                toggleCopyModalConfirm(false)
                            })
                            .catch(err => {
                                console.log(err)
                                toggleCopyModalConfirm(false)
                            })
                    }}
                    >
                        Yes
                    </button>
                    </div>
                </div>
                </div>
            )
        }
        return null
    }
    
    //This clean data is from History Page - it creates "rows" of routines actions and instructions

     //-------- clean historyGot - just dates we want, just info we want, and structure vertical to horizontal   --------
     function cleanData(historyGot, useDate){
        
        //go through at find historyGots that are within 7 days of useDate
        console.log("date:" + useDate);
        const temp = [];
        // for(var i=0; i <historyGot.length; i++){
        for(var i=historyGot.length - 1; i > -1; i--){
            var historyDate = new Date(historyGot[i].date);
            console.log('cleanData',historyGot[i].id ,historyDate, useDate, useDate.getTime() - 604800000)
            if ((historyDate.getTime() >= useDate.getTime() - 604800000)    //filter for within 7 datets
            && historyDate.getTime() - 20000 <= useDate.getTime()){                 // 7: 604800000    2: 172800000
                temp.push(historyGot[i]);
            }
        }
        console.log('temp',temp)
        //now temp has data we want
    // move temp to inRange with no repeats
        const tempR = temp.reverse()
        console.log('tempR', tempR)

        const map = new Map();
        
        // for (const item of temp){
        //     if(!map.has(item.date)){
        //         map.set(item.date, true);
        //         inRange.push({
        //             date: item.date,
        //             details: item.details
        //         })
        //     }
        // }

        for (const item of tempR){
            if(!map.has(item.date)){
                map.set(item.date, true);
                inRange.push({
                    date: item.date,
                    details: item.details
                })
            }
        }

        inRange.reverse();//put latest day at end

        function custom_sort(a, b) {
            return (new Date(a.start_day_and_time).getHours() + (new Date(a.start_day_and_time).getMinutes() / 60))
             - (new Date(b.start_day_and_time).getHours() + (new Date(b.start_day_and_time).getMinutes() / 60));

        }

        console.log('inRange', inRange)
        //bigList will hold new data format sidewase
        var bigList = [];       
        for (var d = 0; d < inRange.length; d++){
            const obj = JSON.parse(inRange[d].details)
            console.log("obj",obj);
            
            //sort obj by time of day
            obj.sort(custom_sort);
            
            for (var r = 0; r < obj.length; r++){           //FOR ROUTINES
             //   if(obj[r].routine !== undefined){
                if(obj[r].title){
                    // console.log("gere");
                    var isNewR = true;
                    for (var s=0; s<bigList.length; s++){       //check through and see if this is a new routine
                        if (bigList[s].type == "Routine" && bigList[s].id == obj[r].routine){
                            bigList[s].days[d] = obj[r].status;   //if already there- just update that day status
                           // bigList[s].id = obj[r].routine;
                            isNewR = false;
                            break;
                        }
                    }
                    if (isNewR){ //if new, make object and put in bigList
                        var currentR = {type: "Routine", title: obj[r].title, under: "", days: [], tBox: {}, 
                        show: true, photo: obj[r].photo, startTime: obj[r].start_day_and_time, is_available: obj[r].is_available,
                        endTime: obj[r].end_day_and_time, is_sublist_available: obj[r].is_sublist_available, id: obj[r].routine}; 
                        currentR.days[d] = obj[r].status;
                        bigList.push(currentR);
                    }

                    if(obj[r].actions!= undefined){
                        var actions = obj[r].actions;
                        for (var a=0; a < actions.length; a++){         //FOR ACTIONS
                            if(actions[a].title){
                                var isNewA = true;
                                for (var s=0; s<bigList.length; s++){
                                    if(bigList[s].type == "Action" && bigList[s].id == actions[a].action){
                                        bigList[s].days[d] = actions[a].status;
                                        isNewA = false;
                                        break;
                                    }
                                }
                                if(isNewA){
                                    var currentA = {type: "Action", title: actions[a].title, under: obj[r].title, days:[], tBox: {}, show: false,
                                    photo: actions[a].photo, is_sublist_available: actions[a].is_sublist_available,
                                    is_available: actions[a].is_available, id: actions[a].action};
                                    currentA.days[d] = actions[a].status;
                                    bigList.push(currentA);
                                }
                                if(actions[a].instructions != undefined){
                                    var insts = actions[a].instructions;
                                    for(var i=0; i < insts.length; i++){        //FOR INSTRUCTIONS
                                        if (insts[i].title){
                                            var isNewI = true;
                                            for(var s=0; s<bigList.length; s++){
                                                if (bigList[s].type == "Instruction" && bigList[s].id == insts[i].instruction){
                                                    bigList[s].days[d] = insts[i].status;
                                                    isNewI = false;
                                                    break;
                                                }
                                            }
                                            if(isNewI){
                                                var currentI = {type: "Instruction", title: insts[i].title, under: actions[a].title, days:[], tBox: {},
                                                show: false, photo: insts[i].photo, is_available: insts[i].is_available, id: insts[i].instruction};
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
        console.log('biglist',bigList);
        // bigList = addCircles(bigList);
        // console.log(bigList);
       // bigList = addNames(bigList, routines);
        // console.log(bigList);
        for (var i=0; i< bigList.length; i++){
            rows.push(createData(bigList[i].title, bigList[i].days[6], bigList[i].days[5], bigList[i].days[4], bigList[i].days[3],
                 bigList[i].days[2], bigList[i].days[1], bigList[i].days[0], bigList[i].show, bigList[i].under, bigList[i].photo,
                 bigList[i].startTime, bigList[i].endTime, bigList[i].is_sublist_available, bigList[i].type, bigList[i].id, bigList[i].is_available));
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
        console.log(onlyAllowed);
        var tempRows = [];
        console.log("empty", tempRows);
        var routine;
        var action;
        for (var i=0; i <onlyAllowed.length; i++){
            if (onlyAllowed[i].type == "Routine"){
                // console.log("allow", onlyAllowed[i])
                tempRows.push(displayRoutines(onlyAllowed[i]));
                console.log("current Temp" , tempRows);
                routine = onlyAllowed[i];
                // console.log("only", onlyAllowed[i]);
            }
            else if (onlyAllowed[i].type == "Action"){
                tempRows.push(displayActions(onlyAllowed[i], routine));
                action = onlyAllowed[i];
            }
            else {tempRows.push(displayInstructions(onlyAllowed[i], action))}
        }
        console.log('tempRows',tempRows);
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


    //no need to use GR here - "is_avalible" is part of "r" and comes from getHistory
    //this was causing an error of not showing routines on the left side of home when
    //switching pages, because GR was not getting updated before this was called. So GR
    //was empty. now no need for GR and no issue. 
    function getIsAvailableFromGR(r) {
        // console.log('checking availability', r, GR, currentUser)
        // var NTC1 = r.name
        // for (var i=0; i < GR.length; i++) {
        //     var NTC2 = GR[i].gr_title
        //     console.log('match ntcs',NTC1, NTC2, i, GR.length)
        //     if(NTC1 == NTC2) {
        //         console.log('match', GR[i].gr_title, r.name)
                // if (GR[i].is_available == 'True') {
                if (r.is_available == 'True') {
                        // console.log('match true',GR[i].is_available)
                    return (
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
                            />
                        </div>
                    )
                } else {
                    // console.log('match false',GR[i].is_available)
                    return (
                        <div>
                        <FontAwesomeIcon
                            title="Unavailable to the user"
                            style={{ color: "#000000" }}
                            onClick={(e) => {
                            e.stopPropagation();
                            alert("Item Is NOT Availble to the user" + r.is_available);
                            }}
                            icon={faUserAltSlash}
                            size="small"
                        />
                        </div>
                    )
                    
                }
        //     } else {
                
        //         var temp = []
        //         for (var j = 0; j < GR.length; j++) {
        //             temp.push(GR[j].gr_title)
        //         }
        //         console.log('no match found', r.name, temp)
        //     }
        // }
        return ('E')
    }
    

    //Creates actual boxes to display

    
    function displayRoutines(r){
        console.log('displayroutines', r)
        const ret = getIsAvailableFromGR(r)
        if (ret != 'E') {
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

                    {/* <CopyIcon
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
                    </div> */}

                    <FontAwesomeIcon
                    title="Copy Item"
                    onMouseOver={(e) => {
                        
                        e.target.style.color = "#48D6D2";
                    }}
                    onMouseOut={(e) => {
                        

                        e.target.style.color = "#FFFFFF";
                    }}
                    style={{ color: "#FFFFFF" }}
                    onClick={(e) => {
                        // console.log("On click");
                        e.stopPropagation();
                        // console.log("On click1");
                        console.log(r.id, r.name)
                        copiedRoutineID = r.id
                        setCRN(r.name)
                        setTAToCopyTo({})
                        setPatientToCopyTo({})
                        // console.log('test', r.name)
                        toggleCopyModal([!showCopyModal[0], r.id])
                        
                        
                    }}
                    icon={faCopy}
                    size="md"
                    />

                    </div>

                    <div style={{flex:'1', marginLeft:'1rem'}}>
                    
                    <Row >

                        {console.log('firebase 426',r)}
                        {console.log('firebase 427',r.name, r.is_available)}
                        
                        {ret}
                        
                        </Row>
                    </div>

                    <div style={{flex:'1'}} >
                    {/* <DeleteGR
                          BASE_URL={this.props.BASE_URL}
                            // deleteIndex={this.findIndexByID(tempID)}
                            // Array={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                            // // Path={firebase
                            // //   .firestore()
                            // //   .collection("users")
                            // //   .doc(this.props.theCurrentUserID)}
                            // // refresh={this.grabFireBaseRoutinesGoalsData}
                            // theCurrentUserId={this.props.theCurrentUserID}
                            // theCurrentTAID={this.props.theCurrentTAID}
                        /> */}
                        {/* <div style={{ marginLeft: '5px' }}> */}
                            <FontAwesomeIcon
                                title="Delete Item"
                                onMouseOver={(event) => {
                                event.target.style.color = '#48D6D2';
                                }}
                                onMouseOut={(event) => {
                                event.target.style.color = '#FFFFFF';
                                }}
                                style={{ color: '#FFFFFF' }}
                                // style ={{ color:  "#000000" }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log(r)
                                    
                                    let body = {goal_routine_id: r.id}

                                    axios
                                        .post('https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/deleteGR', body)
                                        .then(response => {
                                            console.log('deleting')
                                            console.log(response.data)
                                            toggleCalled(!called)
                                        })
                                }}
                                icon={faTrashAlt}
                                size="md"
                            />
                        </div>
                    {/* </div> */}
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
    }

    function displayActions(a, r){
        return(
            <div
            
                style={{  backgroundColor:'#d1dceb' , marginBottom:'0px'}}
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
                {(a.is_sublist_available === "True") ? (
                            <div>
                            <FontAwesomeIcon
                            icon={faList}
                            title="SubList Available"
                            style={{ color: "#ffffff" }}
                            size="small"
                            onClick = {()=> {
                                // sendRoutineToParent(a.number);
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

                <div style={{ display:"flex" , marginTop:'1rem'}}>
                <div style={{marginRight:'1rem',display:'flex', justifyContent:'space-evenly', flexDirection:'column', alignItems:'left'}}>

                    <div style={{flex:'1', marginLeft:'1rem'}}>

                    <Row >
                        {(a.is_available == "True") ? (
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
                                {(a.is_sublist_available === "True") ? (
                            <div>
                            <FontAwesomeIcon
                            icon={faList}
                            title="SubList Available"
                            style={{ color: "#ffffff" }}
                            size="small"
                            onClick = {()=> {
                                // sendRoutineToParent(a.number);
                                // setLoading(!isLoading);
                                clickHandle(a.name)
                            }}
                            />
                        </div>
                        ) : (
                            <FontAwesomeIcon
                                    icon={faList}
                                    title="SubList Not Available"
                                    style={{ color: "#d1dceb"}}
                                    size="small"
                                    />) 
                                    }
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
            
                style={{ backgroundColor:'#dae5f5' , marginBottom:'0px'}}
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
                            title="SubList Not Available"
                            style={{ color: "#dae5f5"}}
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

    
    

    return(
     
        <row>
                {console.log('FBGR',GR)}
                {copyModal()}
                {copyModalPatients()}
                {copyModalConfirm()}
                {/* {getCurrentUser()} */}
                {listOfBlocks}
        </row>
    )

}