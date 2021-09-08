import React, {useEffect, useState, useContext} from 'react';
//import { useLocation } from 'react-router-dom';
import axios from 'axios';
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

const BASE_URL = process.env.REACT_APP_BASE_URL;

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

    console.log('here test');
    //----Change these commented lines to get userID from state being passed in/
    //const currentUser = props.location.state; //matts testing 72
    // const currentUser = "100-000072";
    const loginContext = useContext(LoginContext);
    const [currentUser, setCU] = useState(loginContext.loginState.curUser); 

    const [rows, setRows] = useState([]);
    const [historyGot, setHG] = useState([]);


    // Kyle cookie code
    var userID = ''
    if (
        document.cookie
        .split(";")
        .some(item => item.trim().startsWith("patient_uid="))
    ) {
        userID = document.cookie.split('; ').find(row => row.startsWith('patient_uid=')).split('=')[1]
    } else {
        userID = loginContext.loginState.curUser;
    }  
    if (userID != currentUser){
        setHG([]);
        setRows([]);
        setCU(userID);
        }
    console.log("currentUser: " + currentUser);
    
    const inRange = [];
    var start = new Date();
    start.setHours(0,0,0,0);
    console.log(start);
    const [currentDate, setCurDate] = useState(start);
    const history = useHistory();

    //table things:
    const classes = useStyles();
    
    function createData(name, number, sun, mon, tue, wed, thurs, fri, sat, show, under, photo, startTime, endTime, is_sublist_available, type, is_available){    //rows structure
        return {name, number, sun, mon, tue, wed, thurs, fri, sat, show, under, photo, startTime, endTime, is_sublist_available, type, is_available}
    }
    // const [rows, setRows] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [childIn, setChildIn] = useState("");
    
    
    useEffect(() => {
        console.log('history1');
        axios.get(BASE_URL + "getHistory/" + currentUser)
        .then((response) =>{
            console.log('getHistory response = ', response.data);
            for(var i=0; i <response.data.result.length; i++){
                // console.log(response.data.result[i]);
                historyGot.push(response.data.result[i]);
            }
            // setHG(historyGot);
            console.log('hgot = ', historyGot);
            console.log(currentDate);
            cleanData(historyGot, currentDate);
            // console.log(response.data.result[1].details);
           // cleanData(historyGot, currentDate);

        })
        .catch((error) => {
            console.log(error);
        });

        axios.get(BASE_URL + "usersOfTA/" + document.cookie.split('; ').find(row => row.startsWith('ta_email=')).split('=')[1])
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
    },[currentUser])



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
        // console.log(new Date().toISOString());
        const temp = [];
        console.log('historyGot = ', historyGot)
        for(var i=0; i <historyGot.length; i++){
            var historyDate = new Date(historyGot[i].date_affected);
            if ((historyDate.getTime() >= useDate.getTime() - 691200000)    //filter for within 7 datets
            && historyDate.getTime() <= useDate.getTime() - 86400000   ){                 // 7: 604800000    2: 172800000
                temp.push(historyGot[i]);
            }
        }
        console.log('temp1 = ', temp);
        //now temp has data we want
        // move temp to inRange with no repeats
        const map = new Map();
        let j = 0;
        for (const item of temp){
            if(!map.has(item.date.substring(0, 10))){
                map.set(item.date.substring(0, 10), true);
                let prevDate = j === 0 ? null : new Date(inRange[j - 1].date.substring(0, 10));
                const currDate = item.date.substring(0, 10);
                while (prevDate !== null && Moment(prevDate.getTime() + 86400000).format('MM/DD/YYYY') !== currDate) {
                    console.log('separation: prevDate = ', Moment(prevDate.getTime() + 86400000).format('MM/DD/YYYY'), ', currDate = ', currDate);
                    inRange.push({
                        date: Moment(prevDate.getTime()).format('MM/DD/YYYY') + ' 00:00:00',
                        details: '[]',
                    });
                    map.set(Moment(prevDate.getTime()).format('MM/DD/YYYY'), true);
                    prevDate = new Date(prevDate.getTime() + 86400000);
                    j++;
                }
                inRange.push({
                    date: item.date,
                    details: item.details
                })
                j++;
            }
        }
        inRange.reverse();//put latest day at end
        console.log('inRange1 = ', inRange, ', map = ', map);

        function custom_sort(a, b) {
            return (new Date(a.start_day_and_time).getHours() + (new Date(a.start_day_and_time).getMinutes() / 60))
             - (new Date(b.start_day_and_time).getHours() + (new Date(b.start_day_and_time).getMinutes() / 60));
        }

        //bigList will hold new data format sidewase
        var bigList = [];
        for (var d = 0; d < inRange.length; d++){   
            const obj = JSON.parse(inRange[d].details)

            //sort obj by time of day
            obj.sort(custom_sort);
            for (var r = 0; r < obj.length; r++){           //FOR ROUTINES
                if(obj[r].routine){
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
                        // console.log(actions);
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
                                    var currentA = {type: "Action", title: actions[a].title, under: obj[r].routine, days:[], tBox: {}, show: false,
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
                                                var currentI = {type: "Instruction", title: insts[i].title, under: actions[a].action, days:[], tBox: {}, 
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
        console.log("ROWSdata = ", rows);
        console.log('BIGLIST data before = ', bigList);
        bigList = addCircles(bigList);
        console.log('BIGLIST data after = ', bigList);

        const dateIndexMapping = {};
        const origin = useDate.getTime();
        for (let k = 6; k >= 0; k--)
        {
            const currDay = Moment(origin - 86400000 * (7 - k)).format('dddd');
            dateIndexMapping[currDay] = 6 - k;
        }

        var tempRows = [];
        for (var i=0; i< bigList.length; i++){
            tempRows.push(createData(bigList[i].title, bigList[i].number,
                bigList[i].days[dateIndexMapping['Sunday']], bigList[i].days[dateIndexMapping['Monday']],
                bigList[i].days[dateIndexMapping['Tuesday']], bigList[i].days[dateIndexMapping['Wednesday']],
                bigList[i].days[dateIndexMapping['Thursday']], bigList[i].days[dateIndexMapping['Friday']],
                bigList[i].days[dateIndexMapping['Saturday']], bigList[i].show, bigList[i].under, bigList[i].photo,
                 bigList[i].startTime, bigList[i].endTime, bigList[i].is_sublist_available, bigList[i].type, bigList[i].is_available));
        }
        console.log(tempRows);
        setLoading(false);
        setRows(tempRows);
        console.log(rows);
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
                        if(checkAbove(bigList[i].under, d, bigList[i])){
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
                        if(checkAbove(bigList[i].under, d, bigList[i])){
                            bigList[i].days[d] = (<div className = "ipI">
                                                    <div className = "whiteHalfTop" ></div>
                                                </div>);
                        }
                        else {
                            bigList[i].days[d] = <div className = "nsI"></div>;
                        }
                    }
                    else if(bigList[i].days[d] == "complete"){
                        bigList[i].days[d] = <div className = "cI"></div>;
                    }
                }
            }
        }
        return(bigList);

        function checkAbove(above, d, thing){
            // console.log("checking" + above + " day: " + d + " thing: ");
            // console.log(thing);
            for (const checks of bigList){
                // if(checks.days[d] == undefined){
                //     return false;
                // }
                if(above == checks.number){
                    // console.log(checks);
                    if (checks.days[d] == "completed" || checks.days[d] == "complete") {
                        return true;
                    }
                    if(checks.days[d] && checks.days[d].props != undefined) {
                        if (checks.days[d].props.className == "cR" || checks.days[d].props.className == "cA"){
                            return true;
                        }
                    }
                    else{
                        return checkAbove(checks.under, d)
                    }
                }
            }
            return false;
        }
    }   

    // --------   when routine is clicked on. set children show to true, re-render with setRows ----------
    function clickHandle(number){
        console.log(rows);
        var newRows = [];
        //take out duplicates of rows (copy into newRows)
        const map = new Map();
        for (const item of rows){
            if(!map.has(item.number)){
                map.set(item.number, true);
                newRows.push(item)
            }
        }
        //if clicked on, change show of things underneath
        console.log("click." + number);
        for (var r =0; r < newRows.length; r++){
            if (rows[r].under == number){
                //console.log("got " + rows[r].name);
                newRows[r].show = !rows[r].show;
                console.log(rows[r].number + " -> " + newRows[r].show);
                //also close instructions of routines clicked on. 2 levels deep
                for (var i=0; i<newRows.length; i++){
                    if(rows[i].under == rows[r].number && rows[i].show){
                        newRows[i].show = !rows[i].show;
                        console.log(rows[i].number + " -> " + newRows[i].show);
                    }
                }
            }
            
        }
        console.log('click.result: childIn = ', childIn);
        console.log('click.newRows = ', newRows);
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
        console.log("ROWS HERE: ", rows);
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
        setCurDate(new Date(currentDate.getTime() - 604800000));
        cleanData(historyGot, new Date(currentDate.getTime() - 604800000));
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
                                        <Container fluid>
                                            <Row style={{ marginTop: '10px' , flex:'1'}}>
                                                <Col>
                                                    <div>
                                                        <FontAwesomeIcon
                                                            style={{ marginTop: '10px' }}
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
                                                    style={{ textAlign: 'center' , marginTop:'0px'}}
                                                >
                                                    <p style={{textTransform: 'none', fontWeight: 'bold', margin: '0px'}} > 
                                                    Week of {Moment(currentDate.getTime() - 604800000).format('MMMM D')}-  
                                                     {Moment(currentDate.getTime() - 86400000).format('D, YYYY')}</p>
                                                    <p
                                                        style={{ textTransform: 'none', height: '19.5px' }}
                                                    >
                                                        {Intl.DateTimeFormat().resolvedOptions().timeZone}
                                                    </p>
                                                </Col>
                                                <Col style={{justifyContent: 'right'}}>
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
                                        {onlyAllowed().map((row) => {
                                            const origin = currentDate.getTime() - 604800000;
                                            const msInDay = 86400000;
                                            const weekDays = [];
                                            for (let i = 0; i < 7; i++)
                                            {
                                                const dayOfWeek = Moment(origin + i * msInDay).format('dddd');
                                                weekDays[i] = dayOfWeek === 'Thursday' ?
                                                    'thurs' : dayOfWeek.toLowerCase().substring(0, 3);
                                            }

                                            return(
                                                <TableRow key={row.number}>
                                                    {weekDays.map(weekDay => <TableCell align="right" height="98px">{row[weekDay]}</TableCell>)}
                                                    <TableCell align="right" component="th" scope="row" onClick = {() => clickHandle(row.number)} />
                                                </TableRow>
                                            )
                                            // return(
                                            //     <TableRow key={row.number}>
                                            //         <TableCell align="right" height="98px">{row.sun}</TableCell>
                                            //         <TableCell align="right">{row.mon}</TableCell>
                                            //         <TableCell align="right">{row.tue}</TableCell>
                                            //         <TableCell align="right">{row.wed}</TableCell>
                                            //         <TableCell align="right">{row.thurs}</TableCell>
                                            //         <TableCell align="right">{row.fri}</TableCell>
                                            //         <TableCell align="right">{row.sat}</TableCell>
                                            //         <TableCell align="right" component="th" scope="row"
                                            //         onClick = {() => clickHandle(row.number)}
                                            //         >
                                                        
                                            //         </TableCell>
                                            //     </TableRow>
                                            // )
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                </Col>
                <Col overflow= "hidden" marginLeft = "0px" xs="auto" style={{paddingLeft:"0px", overflow: "hidden", paddingRight: "0px", paddingTop:"4px"}}>
                    {/* <br></br> */}
                    {/* <br></br> */}
                    <VerticalRoutine onlyAllowed = {onlyAllowed()} userID = {currentUser} sendRoutineToParent={sendRoutineToParent} allRows = {rows}/>
                    {/* <Container style={{padding:"0px"}}>{vertRou}</Container> */}
                </Col>
            </Row>
        </Container>
    );
}


