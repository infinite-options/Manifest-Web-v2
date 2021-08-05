import React, {useEffect, useState, useContext} from 'react';
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
import {faList} from "@fortawesome/free-solid-svg-icons";
import VerticalRoutine from './verticalRoutine_v2';
import LoginContext from '../LoginContext';



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


    //----Change these commented lines to get userID from state being passed in/
    //const currentUser = props.location.state; //matts testing 72
    // const currentUser = "100-000072";
    const loginContext = useContext(LoginContext);
    const currentUser = loginContext.loginState.curUser;   
    const [historyGot, setHG] = useState([]);
    const inRange = [];
    const [currentDate, setCurDate] = useState(new Date(Date.now()))

    const history = useHistory();

    //table things:
    const classes = useStyles();
    
    function createData(name, sun, mon, tue, wed, thurs, fri, sat, show, under, photo, startTime, endTime, is_sublist_available, type, is_available){    //rows structure
        return {name, sun, mon, tue, wed, thurs, fri, sat, show, under, photo, startTime, endTime, is_sublist_available, type, is_available}
    }
    const [rows, setRows] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [childIn, setChildIn] = useState("");
    
    
    useEffect(() => {
        axios.get("https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/getHistory/" + currentUser)
        .then((response) =>{
            for(var i=0; i <response.data.result.length; i++){
                // console.log(response.data.result[i]);
                historyGot.push(response.data.result[i]);
            }
            // setHG(historyGot);
            console.log(historyGot);
            cleanData(historyGot, currentDate);
            // console.log(response.data.result[1].details);
           // cleanData(historyGot, currentDate);

        })
        .catch((error) => {
            console.log(error);
        });

        axios.get("https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/usersOfTA/" + document.cookie.split('; ').find(row => row.startsWith('ta_email=')).split('=')[1])
      .then((response) =>{
          console.log(response);
          if (response.result !== false){
            const usersOfTA = response.data.result;
            const curUserID = usersOfTA[0].user_unique_id;
            loginContext.setLoginState({
              ...loginContext.loginState,
              usersOfTA: response.data.result,
              curUser: curUserID
            })
            console.log(curUserID);
            // setUserID(curUserID);
            // console.log(userID);
            // GrabFireBaseRoutinesGoalsData();
            // return userID;
          }
          else{console.log("No User Found");}
      })
      .catch((error) => {
          console.log(error);
      });
    },[])



    function formatTime(dateTime){
        var temp = new Date(dateTime);
        console.log(temp);
        temp = (temp).toLocaleTimeString();
        console.log(temp);
        return temp
    }

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

        function custom_sort(a, b) {
            return (new Date(a.start_day_and_time).getHours() + (new Date(a.start_day_and_time).getMinutes() / 60))
             - (new Date(b.start_day_and_time).getHours() + (new Date(b.start_day_and_time).getMinutes() / 60));
        }

        //bigList will hold new data format sidewase
        var bigList = [];       
        // for (var d = (inRange.length - 1); d >= 0; d--){
        for (var d = 0; d < inRange.length; d++){   
        const obj = JSON.parse(inRange[d].details)
            console.log(obj);

            //sort obj by time of day
            obj.sort(custom_sort);

            for (var r = 0; r < obj.length; r++){           //FOR ROUTINES
                // console.log(r);
                if(obj[r].title){
                    // console.log("gere");
                    var isNewR = true;
                    for (var s=0; s<bigList.length; s++){       //check through and see if this is a new routine
                        if (bigList[s].type == "Routine" && bigList[s].number == obj[r].routine){
                            bigList[s].days[d] = obj[r].status;   //if already there- just update that day status
                            isNewR = false;
                            break;
                        }
                    }
                    if (isNewR){
                        var currentR = {type: "Routine", title: obj[r].title, under: "", days: [], tBox: {}, 
                        show: true, photo: obj[r].photo, startTime: obj[r].start_day_and_time, is_available: obj[r].is_available,
                        endTime: obj[r].end_day_and_time, is_sublist_available: obj[r].is_sublist_available, number: obj[r].routine}; //if new, make object and put in bigList
                        currentR.days[d] = obj[r].status;
                        bigList.push(currentR);
                    }

                    if(obj[r].actions!= undefined){
                        var actions = obj[r].actions;
                        console.log("ACTIONS:" + d);
                        console.log(actions);
                        for (var a=0; a < actions.length; a++){         //FOR ACTIONS
                            if(actions[a].title){
                                var isNewA = true;
                                for (var s=0; s<bigList.length; s++){
                                    if(bigList[s].type == "Action" && bigList[s].number == actions[a].action){
                                        bigList[s].days[d] = actions[a].status;
                                        isNewA = false;
                                        break;
                                    }
                                }
                                if(isNewA){
                                    var currentA = {type: "Action", title: actions[a].title, under: obj[r].title, days:[], tBox: {}, show: false,
                                     photo: actions[a].photo, is_sublist_available: actions[a].is_sublist_available, 
                                     is_available: actions[a].is_available, number: actions[a].action};
                                    currentA.days[d] = actions[a].status;
                                    bigList.push(currentA);
                                }
                                if(actions[a].instructions != undefined){
                                    var insts = actions[a].instructions;
                                    for(var i=0; i < insts.length; i++){        //FOR INSTRUCTIONS
                                        if (insts[i].title){
                                            var isNewI = true;
                                            for(var s=0; s<bigList.length; s++){
                                                if (bigList[s].type == "Instruction" && bigList[s].number == insts[i].instruction){
                                                    bigList[s].days[d] = insts[i].status;
                                                    isNewI = false;
                                                    break;
                                                }
                                            }
                                            if(isNewI){
                                                var currentI = {type: "Instruction", title: insts[i].title, under: actions[a].title, days:[], tBox: {}, 
                                                show: false, photo: insts[i].photo, is_available: insts[i].is_available, number: insts[i].instruction};
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
        
        setRows([]);
        console.log("ROWS" + rows);
        console.log(bigList);
        bigList = addCircles(bigList);
        console.log(bigList);
       // bigList = addNames(bigList, routines);
        console.log(bigList);
        var tempRows = [];
        for (var i=0; i< bigList.length; i++){
            tempRows.push(createData(bigList[i].title, bigList[i].days[6], bigList[i].days[5], bigList[i].days[4], bigList[i].days[3],
                 bigList[i].days[2], bigList[i].days[1], bigList[i].days[0], bigList[i].show, bigList[i].under, bigList[i].photo,
                 bigList[i].startTime, bigList[i].endTime, bigList[i].is_sublist_available, bigList[i].type, bigList[i].is_available));
        }
        console.log(tempRows);
        setLoading(false);
        setRows(tempRows);
        console.log(rows);
        console.log("GERE");
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

    


   

// --------   when routine is clicked on. set children show to true, re-render with setRows ----------
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
        console.log(childIn);
        setRows(newRows);    //update rows with newRows
        setChildIn("");
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
        console.log("ONLY ALLOWED HERE:")
        console.log(newRows);
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
        cleanData(historyGot, new Date(currentDate.getTime() - 604800000));
        setCurDate(new Date(currentDate.getTime() - 604800000));
        // console.log((new Date(Date.now())).getTime());
        // console.log(currentDate.getDate());
        setLoading(true);
        setLoading(false);
        
    }
    function nextWeek(){
        console.log("clocked nex");
        cleanData(historyGot, new Date(currentDate.getTime() + 604800000));
        setCurDate(new Date(currentDate.getTime() + 604800000));
        // console.log(Date(Date.now()));
        // console.log(currentDate);
    }

    


    function sendRoutineToParent(routine){
        console.log("GOT ROUTINE IN");
        setChildIn(routine);
        console.log(childIn);
        console.log(routine);
        //clickHandle(childIn);
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
    if(childIn != ""){
        clickHandle(childIn);
    }
    return (
        <Container fluid padding = "0px">
            {/* <Navigation userID={currentUser} /> */}
            <Row fluid padding = {0}>
                <Col width="10rem"  style={{padding:"0px", overflow: "hidden"}}>
                    <div display= "flex" flex-direction="row">
                        <div>
                            {/* <br></br> */}
                            <Box paddingTop={0.5} backgroundColor="#bbc8d7">
                                <div className={classes.buttonContainer}>
                                    <Box
                                        bgcolor="#889AB5"
                                        className={classes.dateContainer}
                                        style={{ width: '100%' }}
                                    // flex
                                    >
                                        <Container>
                                            <Row style={{ marginTop: '20px' }}>
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
                                                >
                                                    <p style={{textTransform: 'none', margin: '0px'}} > 
                                                    Week of {Moment(currentDate.getTime() - 604800000).format('MMMM D')}-  
                                                     {Moment(currentDate.getTime()).format('D YYYY')}</p>
                                                    <p
                                                        style={{ textTransform: 'none', height: '19.5px' }}
                                                    >
                                                        {Intl.DateTimeFormat().resolvedOptions().timeZone}
                                                    </p>
                                                </Col>
                                                <Col>
                                                    {(new Date(Date.now()).getDate() != currentDate.getDate()) ?  (       
                                                    <FontAwesomeIcon
                                                        // style={{ marginLeft: "50%" }}
                                                        style={{ float: 'right' }}
                                                        icon={faChevronRight}
                                                        size="2x"
                                                        className="X"
                                                        onClick={(e) => {
                                                            nextWeek();
                                                        }}
                                                    />) : (<div></div>)
                                                    }
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
                                                <TableCell align="right" height="98px">{row.sun}</TableCell>
                                                <TableCell align="right">{row.mon}</TableCell>
                                                <TableCell align="right">{row.tue}</TableCell>
                                                <TableCell align="right">{row.wed}</TableCell>
                                                <TableCell align="right">{row.thurs}</TableCell>
                                                <TableCell align="right">{row.fri}</TableCell>
                                                <TableCell align="right">{row.sat}</TableCell>
                                                <TableCell align="right" component="th" scope="row"
                                                onClick = {() => clickHandle(row.name)}
                                                >
                                                    
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                </Col>
                <Col overflow= "hidden" marginLeft = "0px" xs="auto" style={{paddingLeft:"0px", overflow: "hidden", paddingRight: "0px", paddingTop:"4px"}}>
                    {/* <br></br> */}
                    {/* <br></br> */}
                    <VerticalRoutine onlyAllowed = {onlyAllowed()} userID = {currentUser} sendRoutineToParent={sendRoutineToParent}/>
                    {/* <Container style={{padding:"0px"}}>{vertRou}</Container> */}
                </Col>
            </Row>
        </Container>
    );
}


