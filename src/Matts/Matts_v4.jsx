import React, {useEffect, useState} from 'react';
//import { useLocation } from 'react-router-dom';
import axios from 'axios';
import DayRoutines from '../Home/DayRoutines';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './history.css'
import { useHistory, Redirect } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import {
    faChevronLeft,
    faChevronRight,
  } from '@fortawesome/free-solid-svg-icons';
import Moment from 'moment';
import { Navigation } from '../Home/navigation';
import Firebasev2 from "../manifest/OldManifest/Firebasev2";
import {
    faList,
  } from "@fortawesome/free-solid-svg-icons";



import {
    Form,
    Container,
    Row,
    Col,
    Modal,
    Dropdown,
    DropdownButton,
    Spinner,
  } from 'react-bootstrap';
import { wait } from '@testing-library/dom';


const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
    buttonSelection: {
        width: '8%',
        height: '70px',
        borderBottomLeftRadius: '25%',
        borderBottomRightRadius: '25%',
        color: '#FFFFFF',
        backgroundColor: '#bbc8d7',
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

export default function MainPage(props) {
//    const { profile, setProfile } = useContext(AuthContext);
//    console.log(props.location.state);
//    console.log(props.location.routines);
//    console.log(props.routines);

    const currentUser = props.location.state; //matts testing 72
    console.log(props.location.state);
    const [historyGot] = useState([]);
    const inRange = [];
    const [currentDate, setCurDate] = useState(new Date(Date.now()))

    const history = useHistory();

    //table things:
    const classes = useStyles();
    
    function createData(name, sun, mon, tue, wed, thurs, fri, sat, show, under, tBox){    //rows structure
        return {name, sun, mon, tue, wed, thurs, fri, sat, show, under, tBox}
    }
    const [rows, setRows] = useState([]);
    const [isLoading, setLoading] = useState(true);

    //things for firebasev2
    const BASE_URL = props.location.BASE_URL;
    const theCurrentUserID= props.location.state;
    const theCurrentTAID= props.location.ta_people_id;
    const toggleShowRoutine= props.location.toggleShowRoutine;
    const grabFireBaseRoutinesGoalsData= props.location.grabFireBaseRoutinesGoalsData;
    const originalGoalsAndRoutineArr= props.location.originalGoalsAndRoutineArr;
    const goals= props.location.goals;
    const routines= props.location.routines;
    const showRoutineGoalModal= false;
    const closeGoal= true;
    const closeRoutine= true;
    const showRoutine= props.location.showRoutineModal;
    const showGoal= props.location.showGoalModal;
    const todayDateObject= props.location.todayDateObject;
    const calendarView= props.location.calendarView;
    const dateContext= props.location.dateContext;
    const updateFBGR= props.location.updateFBGR;

    //api call and store response in historyGot
 
    useEffect(() => {
        axios.get("https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/getHistory/" + currentUser)
        .then((response) =>{
            console.log("Got Axios");
            for(var i=0; i <response.data.result.length; i++){
               // console.log(response.data.result[i]);
                historyGot.push(response.data.result[i]);
            }
            console.log(historyGot);
            // console.log(response.data.result[1].details);
            cleanData(historyGot, currentDate, routines);
        })
        .catch((error) => {
            console.log(error);
        });
    },[])



     //-------- clean historyGot - just dates we want, just info we want, and structure vertical to horizontal   --------
    function cleanData(historyGot, useDate, routines){
        
        //go through at find historyGots that are within 7 days of useDate
        console.log(routines);
        console.log("date:" + useDate);
        const temp = [];
        for(var i=0; i <historyGot.length; i++){
            var historyDate = new Date(historyGot[i].date);
            if ((historyDate.getTime() >= useDate.getTime() - 604800000)    //filter for within 7 datets
            && historyDate.getTime() <= useDate.getTime()){                 // 7: 604800000    2: 172800000
                temp.push(historyGot[i]);
            }
        }
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


        //bigList will hold new data format sidewase
        var bigList = [];       
        for (var d = 0; d < inRange.length; d++){
            const obj = JSON.parse(inRange[d].details)
            // console.log(obj);
            for (var r = 0; r < obj.length; r++){           //FOR ROUTINES
                // console.log(r);
                if(obj[r].title){
                    // console.log("gere");
                    var isNewR = true;
                    for (var s=0; s<bigList.length; s++){       //check through and see if this is a new routine
                        if (bigList[s].type == "Routine" && bigList[s].title == obj[r].title){
                            bigList[s].days[d] = obj[r].status;   //if already there- just update that day statys
                            isNewR = false;
                            break;
                        }
                    }
                    if (isNewR){
                        var currentR = {type: "Routine", title: obj[r].title, under: "", days: [], tBox: {}, show: true}; //if new, make object and put in bigList
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
                                    var currentA = {type: "Action", title: actions[a].title, under: obj[r].title, days:[], tBox: {}, show: false};
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
                    

                }
            }
        }
        
        //Now bigList has data in new object style. 
        //of that we transfer what we want to display to rows
        setRows([]);
        console.log("ROWS" + rows);
        console.log(bigList);
        bigList = addCircles(bigList);
        console.log(bigList);
        bigList = addNames(bigList, routines);
        console.log(bigList);
        var tempRows = [];
        for (var i=0; i< bigList.length; i++){
            tempRows.push(createData(bigList[i].title, bigList[i].days[6], bigList[i].days[5], bigList[i].days[4], bigList[i].days[3],
                 bigList[i].days[2], bigList[i].days[1], bigList[i].days[0], bigList[i].show, bigList[i].under, bigList[i].tBox));
        }
        console.log(tempRows);
        setLoading(false);
        setRows(tempRows);
        console.log(rows);
        console.log("GERE");
        console.log(getUrlParam("userID", window.location.href));
        return(true);
    }


// ------ just replaces days completed or not with appropriate circles to display ---------
    function addCircles(bigList){
        for (var i=0; i< bigList.length; i++){
            for(var d=0; d<bigList[i].days.length; d++){
                if (bigList[i].type == "Routine"){
                    if(bigList[i].days[d] == "not started"){
                        bigList[i].days[d] = <div className = "nsR" ></div>;
                    }
                    else if(bigList[i].days[d] == "completed"){
                        bigList[i].days[d] = <div className = "cR"></div>;
                    }
                    else if(bigList[i].days[d] == "in_progress"){
                        bigList[i].days[d] = (<div className = "ipR">
                                                <div className = "whiteHalfSide"></div>
                                                </div>);
                    }                    
                }
                else if(bigList[i].type == "Action"){
                    if(bigList[i].days[d] == "not started"){
                        if(checkAbove(bigList[i].under, d)){
                            bigList[i].days[d] = (<div className = "ipA">
                                                    <div className = "whiteHalfTop"></div>
                                                 </div>);
                        }
                        else{bigList[i].days[d] = <div className = "nsA"></div>;}
                    }
                    else if(bigList[i].days[d] == "complete"){
                        bigList[i].days[d] = <div className = "cA"></div>;
                    }
                    else if(bigList[i].days[d] == "in_progress"){
                        bigList[i].days[d] = (<div className = "ipA">
                                                <div className = "whiteHalfSide"></div>
                                                </div>);
                    }
                }
                else{
                    if(bigList[i].days[d] == "not started"){
                        if(checkAbove(bigList[i].under, d)){
                            bigList[i].days[d] = (<div className = "ipI">
                                                    <div className = "whiteHalfTop" ></div>
                                                </div>);
                        }
                        else{bigList[i].days[d] = <div className = "nsI"></div>;}
                    }
                    else if(bigList[i].days[d] == "complete"){
                        bigList[i].days[d] = <div className = "cI"></div>;
                    }
                }
            }
        }
        return(bigList);

        function checkAbove(above, d){
            for (const checks of bigList){
                if(above == checks.title){
                    if (checks.days[d] == "completed" || checks.days[d] == "complete"){
                        return true;}
                    if(checks.days[d].props != undefined){
                        if (checks.days[d].props.className == "cR" || checks.days[d].props.className == "cA"){
                            return true;
                        }
                    }
                    else{return checkAbove(checks.under, d)}
                }
            }
            return false;
        }
    }

    function addNames(bigList, routines){
        // let tempTitle = routines[i].title;
        console.log("HERE!!");
        for (var i=0; i< bigList.length; i++){
            var x =0;
            for (x=0; x < routines.length; x++){
                if(bigList[i].title == routines[x].title){break;}
            }
            console.log(x);
            for(var d=0; d<bigList[i].days.length; d++){
                if(bigList[i].type == "Routine"){
                    bigList[i].tBox = routineBoxes(x, routines);
                }
                else if(bigList[i].type == "Action"){
                    bigList[i].tBox = actionBoxes(bigList[i].title);
                    // bigList[i].tBox = <div className = "actionName">{bigList[i].title}</div>
                }
                else{
                    bigList[i].tBox = insBoxes(bigList[i].title);
                    // bigList[i].tBox = <div className = "instructionName">{bigList[i].title}</div>
                }

            }
        }
        return (bigList);
    }


    //---------just returns the css for the routines -----------
    function routineBoxes(x, routines) {
    // <div className = "routineName">{bigList[i].title}</div>
    return(
    <div style={{ height: '5rem', width: '300px', backgroundColor: '#BBC7D7', marginBottom: '2px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div flex='1' style={{
                marginTop: '1rem', marginLeft: '1rem', height: '4.5rem', borderRadius: '10px', width: '85%', display: 'flex', justifyContent: 'space-between', backgroundColor: '#FF6B4A', boxShadow:
                    "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
                zIndex: '50%'
            }}>
                <div flex='1' style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }} >
                    <div style={{ marginLeft: '1rem' }}>
                        {routines[x]["start_day_and_time"] && routines[x]["end_day_and_time"] ? (
                            <div
                                style={{
                                    fontSize: "8px",
                                    color: '#ffffff'
                                }}
                            >
                                { formatDateTime(routines[x]["start_day_and_time"])}
                          -
                                { formatDateTime(routines[x]["end_day_and_time"])}
                            </div>
                        ) : (
                            <Col> </Col>
                        )}

                    </div>

                    <div style={{ color: '#ffffff', size: '24px', textDecoration: 'underline', fontWeight: 'bold', marginLeft: "10px" }}>
                        {routines[x].title}
                    </div>

                    {/* ({date}) */}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                    <div>

                        <Col xs={7} style={{ paddingRight: "1rem", marginTop: '0.5rem' }}>
                            <img
                                src={routines[x]["photo"]}
                                alt="Routines"
                                className="center"
                                height="28px"
                                width="28px"
                            />
                        </Col>
                    </div>
                    <div style={{ paddingRight: "1.3rem", marginLeft: '1.5rem' }}>
                        {routines[x]["is_sublist_available"] ? (
                            <div>
                                <FontAwesomeIcon
                                    icon={faList}
                                    title="SubList Available"
                                    style={{ color: "#ffffff" }}
                                    // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShow: false}); this.editFirBaseFalse()}}
                                    //onClick={this.ListFalse}
                                    size="small"
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
    </div>);
}

function actionBoxes(title) {
    // <div className = "routineName">{bigList[i].title}</div>
    return(
    // <div style={{ height: '5rem', width: '300px', backgroundColor: '#BBC7D7', marginBottom: '2px' }}>
    //     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div flex='1' style={{
                marginTop: '1rem', marginLeft: '1rem', height: '4.5rem', borderRadius: '10px', width: '13rem', display: 'flex', justifyContent: 'space-between', backgroundColor: '#F8BE28', boxShadow:
                    "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
                zIndex: '50%'
            }}>
                <div flex='1' style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }} >
                    <div style={{ color: '#ffffff', size: '24px', textDecoration: 'underline', fontWeight: 'bold', marginLeft: "10px" }}>
                        {title}
                    </div>
                </div>
                {/* <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                    {/* <div style={{ paddingRight: "1.3rem", marginLeft: '1.5rem' }}>
                        {routines[x]["is_sublist_available"] ? (
                            <div>
                                <FontAwesomeIcon
                                    icon={faList}
                                    title="SubList Available"
                                    style={{ color: "#ffffff" }}
                                    // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShow: false}); this.editFirBaseFalse()}}
                                    //onClick={this.ListFalse}
                                    size="small"
                                />
                            </div>
                        ) : (
                            <div
                            // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShowATModal: false})}}>
                            >
                            </div>
                        )}
                    </div> */}
                </div> 


            // </div>
        // </div>
    // </div>
    );
}

function insBoxes(title) {
    // <div className = "routineName">{bigList[i].title}</div>
    return(
    // <div style={{ height: '5rem', width: '300px', backgroundColor: '#BBC7D7', marginBottom: '2px' }}>
    //     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div flex='1' style={{
                marginTop: '1rem', marginLeft: '1rem', height: '4.5rem', borderRadius: '10px', width: '13rem', display: 'flex', justifyContent: 'space-between', backgroundColor: '#67ABFC', boxShadow:
                    "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
                zIndex: '50%'
            }}>
                <div flex='1' style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }} >
                    <div style={{ color: '#ffffff', size: '24px', textDecoration: 'underline', fontWeight: 'bold', marginLeft: "10px" }}>
                        {title}
                    </div>
                </div>
                {/* <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                    {/* <div style={{ paddingRight: "1.3rem", marginLeft: '1.5rem' }}>
                        {routines[x]["is_sublist_available"] ? (
                            <div>
                                <FontAwesomeIcon
                                    icon={faList}
                                    title="SubList Available"
                                    style={{ color: "#ffffff" }}
                                    // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShow: false}); this.editFirBaseFalse()}}
                                    //onClick={this.ListFalse}
                                    size="small"
                                />
                            </div>
                        ) : (
                            <div
                            // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShowATModal: false})}}>
                            >
                            </div>
                        )}
                    </div> */}
                </div> 


            // </div>
        // </div>
    // </div>
    );
}

// --------   when routine is clicked on. set children show to true, re-render with setRows ----------
    function clickHandle(name){
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
        setRows(newRows);    //update rows with newRows
    }


// -------    returns shortened version of rows with only those with show true ----------------------
    function onlyAllowed(){
        var newRows = [];
        for (var r=0; r < rows.length; r ++){
            if (rows[r].show){
                //console.log("here: " + rows[r].name);
                newRows.push(rows[r]);
            }
        }
        return(newRows);
    }

    function getDayName(num){
        var d = new Date();
        d.setDate(d.getDate() - num);
        switch(d.getDay()){
            case 0: return("SUN");
            case 1: return("MON");
            case 2: return("TUE");
            case 3: return("WED");
            case 4: return("THUR");
            case 5: return("FRI");
            case 6: return("SAT");
        }
    }

    function prevWeek(){
        // TO DO! WEEKS
        // setRows([]);
        console.log("clocked pre");
        // setCurDate(new Date(currentDate.getTime() - 604800000));
    }
    function nextWeek(){
        console.log("clocked nex");
    }

    function getUrlParam(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
      };

    function formatDateTime(str) {
        let newTime = new Date(str).toLocaleTimeString();
        newTime = newTime.substring(0, 5) + " " + newTime.slice(-2);
        return newTime;
      }

    //-----------------------

    if(isLoading){
        return (
            <div>
                <br></br>
                <br></br>
                <h1>Loading...</h1>
            </div>
        )
    }
    return (
        <div>
            <Navigation userID={currentUser} />
            <div display= "flex" flex-direction="row">
                <div>
                    <br></br>
                    <Box paddingTop={3} backgroundColor="#bbc8d7">
                        <div className={classes.buttonContainer}>
                            <Box
                                bgcolor="#889AB5"
                                className={classes.dateContainer}
                                style={{ width: '100%' }}
                            // flex
                            >
                                <Container>
                                    <Row style={{ marginTop: '15px' }}>
                                        <Col>
                                            <div>
                                                <FontAwesomeIcon
                                                    // style={{ marginLeft: "50%" }}

                                                    icon={faChevronLeft}
                                                    size="2x"
                                                    onClick={(e) => {
                                                        prevWeek();
                                                    }}
                                                />
                                            </div>
                                        </Col>
                                        <Col
                                            md="auto"
                                            style={{ textAlign: 'center' }}
                                            className="bigfancytext"
                                        >
                                            <p> Week of {Moment(currentDate).format('D MMMM YYYY')} </p>
                                            <p
                                                style={{ marginBottom: '0', height: '19.5px' }}
                                                className="normalfancytext"
                                            >
                                                {Intl.DateTimeFormat().resolvedOptions().timeZone}
                                            </p>
                                        </Col>
                                        <Col>
                                            <FontAwesomeIcon
                                                // style={{ marginLeft: "50%" }}
                                                style={{ float: 'right' }}
                                                icon={faChevronRight}
                                                size="2x"
                                                className="X"
                                                onClick={(e) => {
                                                    nextWeek();
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                </Container>

                            </Box>
                            
                        </div>
                    </Box>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">{getDayName(7)}</TableCell>
                                    <TableCell align="left">{getDayName(6)}</TableCell>
                                    <TableCell align="left">{getDayName(5)}</TableCell>
                                    <TableCell align="left">{getDayName(4)}</TableCell>
                                    <TableCell align="left">{getDayName(3)}</TableCell>
                                    <TableCell align="left">{getDayName(2)}</TableCell>
                                    <TableCell align="left">{getDayName(1)}</TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {onlyAllowed().map((row) => (
                                    <TableRow key={row.name} >
                                        <TableCell align="right">{row.sun}</TableCell>
                                        <TableCell align="right">{row.mon}</TableCell>
                                        <TableCell align="right">{row.tue}</TableCell>
                                        <TableCell align="right">{row.wed}</TableCell>
                                        <TableCell align="right">{row.thurs}</TableCell>
                                        <TableCell align="right">{row.fri}</TableCell>
                                        <TableCell align="right">{row.sat}</TableCell>
                                        <TableCell align="right" component="th" scope="row" onClick={() => clickHandle(row.name)}>
                                            {row.tBox}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
    );
}


