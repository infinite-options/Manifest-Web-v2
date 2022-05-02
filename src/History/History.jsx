import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './history.css';
import { useHistory } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import Moment from 'moment';
import VerticalRoutine from './VerticalRoutine';
import LoginContext from '../LoginContext';
import { Container, Row, Col } from 'react-bootstrap';
import MiniNavigation from '../manifest/miniNavigation';
const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;
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
});
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
  const [currentTZ, setTZ] = useState(loginContext.loginState.curUserTimeZone);
  const [rows, setRows] = useState([]);
  const [historyGot, setHG] = useState([]);
  // Kyle cookie code
  var userID = '';
  var userTime_zone = '';
  var userEmail = '';
  var userPic = '';
  var userN = '';
  if (
    document.cookie
      .split(';')
      .some((item) => item.trim().startsWith('patient_uid='))
  ) {
    userID = document.cookie
      .split('; ')
      .find((row) => row.startsWith('patient_uid='))
      .split('=')[1];
    userTime_zone = document.cookie
      .split('; ')
      .find((row) => row.startsWith('patient_timeZone='))
      .split('=')[1];
    userEmail = document.cookie
      .split('; ')
      .find((row) => row.startsWith('patient_email='))
      .split('=')[1];
    userPic = document.cookie
      .split('; ')
      .find((row) => row.startsWith('patient_pic='))
      .split('=')[1];
    userN = document.cookie
      .split('; ')
      .find((row) => row.startsWith('patient_name='))
      .split('=')[1];
  } else {
    userID = loginContext.loginState.curUser;
    userTime_zone = loginContext.loginState.curUserTimeZone;
    userEmail = loginContext.loginState.curUserEmail;
    userPic = loginContext.loginState.curUserPic;
    userN = loginContext.loginState.curUserName;
  }
  if (userID != currentUser) {
    setHG([]);
    setRows([]);
    setCU(userID);
    setTZ(userTime_zone);
  }
  console.log('currentUser: ' + currentUser);

  const inRange = [];

  const tz = {
    timeZone: userTime_zone,
  };
  console.log('hgot tz', tz, userTime_zone);
  var time = new Date().toLocaleString(tz, tz).replace(/,/g, '');
  var m = Moment(time).format('ddd MMM D YYYY HH:mm:ss [GMT]ZZ ');
  var m = new Date(m);
  console.log('hgot cu ti3 = ', m);
  m.setHours(0, 0, 0, 0);

  // var start = new Date();
  // start.setHours(0, 0, 0, 0);
  // console.log(start);
  const [currentDate, setCurDate] = useState(m);
  const history = useHistory();
  //table things:
  const classes = useStyles();

  function createData(
    name,
    number,
    sun,
    mon,
    tue,
    wed,
    thurs,
    fri,
    sat,
    show,
    under,
    photo,
    startTime,
    endTime,
    is_sublist_available,
    type,
    is_available
  ) {
    //rows structure
    return {
      name,
      number,
      sun,
      mon,
      tue,
      wed,
      thurs,
      fri,
      sat,
      show,
      under,
      photo,
      startTime,
      endTime,
      is_sublist_available,
      type,
      is_available,
    };
  }
  // const [rows, setRows] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [childIn, setChildIn] = useState('');

  useEffect(() => {
    console.log('history1');
    axios
      .get(BASE_URL + 'getHistory/' + currentUser)
      .then((response) => {
        console.log('getHistory response = ', response.data);
        let thisWeek = getThisWeek();
        for (var j = 0; j < thisWeek.length; j++) {
          if (
            response.data.result.filter((e) => e.date_affected === thisWeek[j])
              .length > 0
          ) {
            response.data.result
              .filter((e) => e.date_affected === thisWeek[j])
              .map((x) => {
                historyGot.push(x);
              });
          } else {
            historyGot.push({
              id: '',
              user_id: '',
              date:
                Moment(thisWeek[j]).add('days', 1).format('YYYY-MM-DD') +
                ' 00:07:40',
              date_affected: thisWeek[j],
              details: '',
            });
          }
        }

        // for (var j = 0; j < thisWeek.length; j++) {
        //   for (var i = 0; i < response.data.result.length; i++) {
        //     // console.log(response.data.result[i].date_affected);
        //     console.log(response.data.result[i].date_affected);
        //     if (thisWeek[j] === response.data.result[i].date_affected) {
        //       historyGot.push(response.data.result[i]);
        //     } else {
        //       historyGot.push({
        //         id: '',
        //         user_id: '',
        //         date: '',
        //         date_affected: '',
        //         details: '',
        //       });
        //     }
        //   }
        //   // historyGot.push(response.data.result[i]);
        // }
        // setHG(historyGot);
        console.log('hgot = ', historyGot);
        setCurDate(m);
        console.log(currentDate);
        cleanData(historyGot, currentDate);
        // console.log(response.data.result[1].details);
        // cleanData(historyGot, currentDate);
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(
        BASE_URL +
          'usersOfTA/' +
          document.cookie
            .split('; ')
            .find((row) => row.startsWith('ta_email='))
            .split('=')[1]
      )
      .then((response) => {
        console.log(response);
        if (response.data.result.length > 0) {
          const usersOfTA = response.data.result;
          const curUserID = usersOfTA[0].user_unique_id;
          const curUserTZ = usersOfTA[0].time_zone;
          const curUserEI = usersOfTA[0].user_email_id;
          const curUserN = usersOfTA[0].user_name;
          loginContext.setLoginState({
            ...loginContext.loginState,
            usersOfTA: response.data.result,
            curUser: curUserID,
            curUserTimeZone: curUserTZ,
            curUserEmail: curUserEI,
            curUserName: curUserN,
          });
          console.log(curUserID);
          // setUserID(curUserID);
          // console.log(userID);
          // GrabFireBaseRoutinesGoalsData();
          // return userID;
        } else {
          loginContext.setLoginState({
            ...loginContext.loginState,
            usersOfTA: response.data.result,
            curUser: '',
            curUserTimeZone: '',
            curUserEmail: '',
            curUserName: '',
          });
          console.log('No User Found');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [
    loginContext.loginState.loggedIn,
    loginContext.loginState.reload,
    currentUser,
  ]);

  function formatTime(dateTime) {
    var temp = new Date(dateTime);
    console.log(temp);
    temp = temp.toLocaleTimeString();
    console.log(temp);
    return temp;
  }
  //-------- clean historyGot - just dates we want, just info we want, and structure vertical to horizontal   --------
  function cleanData(historyGot, useDate) {
    //go through at find historyGots that are within 7 days of useDate
    console.log('hgot date:' + useDate);
    // console.log(new Date().toISOString());
    const temp = [];
    console.log('historyGot = ', historyGot);
    for (var i = historyGot.length - 1; i >= 0; i--) {
      console.log('hgot history date', i);
      console.log(
        'hgot history date',
        i,
        historyGot[i],
        historyGot[i].date_affected,
        historyDate
      );
      var historyDate = new Date(historyGot[i].date_affected);

      if (
        historyDate.getTime() >= useDate.getTime() - 691200000 && //filter for within 7 datets
        historyDate.getTime() <= useDate.getTime() - 86400000
      ) {
        // 7: 604800000    2: 172800000
        temp.push(historyGot[i]);
      }
    }
    console.log('hgot temp1 = ', temp);
    //now temp has data we want
    // move temp to inRange with no repeats
    const map = new Map();
    for (const item of temp) {
      console.log('temp1.1: item = ', item);
      if (!map.has(item.date)) {
        console.log('item', item);
        map.set(item.date, true);
        inRange.push({
          date: item.date,
          details: item.details,
        });
      }
    }
    inRange.reverse(); //put latest day at end
    console.log('inRange1 = ', inRange);
    function custom_sort(a, b) {
      return (
        new Date(a.start_day_and_time).getHours() +
        new Date(a.start_day_and_time).getMinutes() / 60 -
        (new Date(b.start_day_and_time).getHours() +
          new Date(b.start_day_and_time).getMinutes() / 60)
      );
    }

    //bigList will hold new data format sidewase
    var bigList = [];
    // for (var d = (inRange.length - 1); d >= 0; d--){
    for (var d = 0; d < inRange.length; d++) {
      if (inRange[d].details.length > 0) {
        const obj = JSON.parse(inRange[d].details);
        // console.log(obj);

        //sort obj by time of day
        obj.sort(custom_sort);
        /* for (var r = 0; r < obj.length; r++) {
        //FOR ROUTINES
        // console.log(obj[r]);
        if (obj[r].routine) {
          // console.log("gotem");
        }
      } */
        for (var r = 0; r < obj.length; r++) {
          //FOR ROUTINES
          // console.log(r);
          if (obj[r].title === 'DP - Test routine 2 (repeats)') {
            console.log('start obj[r] = ', obj[r]);
          }
          if (obj[r].routine) {
            // console.log("gere");
            var isNewR = true;
            for (var s = 0; s < bigList.length; s++) {
              //check through and see if this is a new routine
              if (
                bigList[s].type == 'Routine' &&
                bigList[s].number == obj[r].routine
              ) {
                if (obj[r].title === 'DP - Test routine 2 (repeats)') {
                  console.log(obj[r].days, ', d = ', d, 'start obj[r].days = ');
                }
                bigList[s].days[d] = obj[r].status; //if already there- just update that day status
                isNewR = false;
                break;
              }
            }
            if (isNewR) {
              var currentR = {
                type: 'Routine',
                title: obj[r].title,
                under: '',
                days: [],
                tBox: {},
                show: true,
                photo: obj[r].photo,
                startTime: obj[r].start_day_and_time,
                is_available: obj[r].is_available,
                endTime: obj[r].end_day_and_time,
                is_sublist_available: obj[r].is_sublist_available,
                number: obj[r].routine,
              }; //if new, make object and put in bigList
              currentR.days[d] = obj[r].status;
              bigList.push(currentR);
            }

            if (obj[r].actions != undefined) {
              var actions = obj[r].actions;
              console.log('ACTIONS:' + d);
              // console.log(actions);
              for (var a = 0; a < actions.length; a++) {
                //FOR ACTIONS
                if (actions[a].title) {
                  var isNewA = true;
                  for (var s = 0; s < bigList.length; s++) {
                    if (
                      bigList[s].type == 'Action' &&
                      bigList[s].number == actions[a].action
                    ) {
                      bigList[s].days[d] = actions[a].status;
                      isNewA = false;
                      break;
                    }
                  }
                  if (isNewA) {
                    var currentA = {
                      type: 'Action',
                      title: actions[a].title,
                      under: obj[r].routine,
                      days: [],
                      tBox: {},
                      show: false,
                      photo: actions[a].photo,
                      is_sublist_available: actions[a].is_sublist_available,
                      is_available: actions[a].is_available,
                      number: actions[a].action,
                    };
                    currentA.days[d] = actions[a].status;
                    bigList.push(currentA);
                  }
                  if (actions[a].instructions != undefined) {
                    var insts = actions[a].instructions;
                    for (var i = 0; i < insts.length; i++) {
                      //FOR INSTRUCTIONS
                      if (insts[i].title) {
                        var isNewI = true;
                        for (var s = 0; s < bigList.length; s++) {
                          if (
                            bigList[s].type == 'Instruction' &&
                            bigList[s].number == insts[i].instruction
                          ) {
                            bigList[s].days[d] = insts[i].status;
                            isNewI = false;
                            break;
                          }
                        }
                        if (isNewI) {
                          var currentI = {
                            type: 'Instruction',
                            title: insts[i].title,
                            under: actions[a].action,
                            days: [],
                            tBox: {},
                            show: false,
                            photo: insts[i].photo,
                            is_available: insts[i].is_available,
                            number: insts[i].instruction,
                          };
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
    }

    setRows([]);
    console.log('ROWSdata = ', rows);
    console.log('BIGLIST data before = ', bigList);
    bigList = addCircles(bigList);
    console.log('BIGLIST data after = ', bigList);
    // console.log(bigList);
    // bigList = addNames(bigList, routines);
    // console.log(bigList);
    var tempRows = [];
    for (var i = 0; i < bigList.length; i++) {
      tempRows.push(
        createData(
          bigList[i].title,
          bigList[i].number,
          bigList[i].days[6],
          bigList[i].days[5],
          bigList[i].days[4],
          bigList[i].days[3],
          bigList[i].days[2],
          bigList[i].days[1],
          bigList[i].days[0],
          bigList[i].show,
          bigList[i].under,
          bigList[i].photo,
          bigList[i].startTime,
          bigList[i].endTime,
          bigList[i].is_sublist_available,
          bigList[i].type,
          bigList[i].is_available
        )
      );
    }
    console.log(tempRows);
    setLoading(false);
    setRows(tempRows);
    console.log(rows);
    return true;
  }
  // ------ just replaces days completed or not with appropriate circles to display ---------
  function addCircles(bigList) {
    for (var i = 0; i < bigList.length; i++) {
      for (var d = 0; d < bigList[i].days.length; d++) {
        if (bigList[i].type == 'Routine') {
          if (bigList[i].days[d] == 'not started') {
            bigList[i].days[d] = <div className="nsR"></div>;
          } else if (bigList[i].days[d] == 'completed') {
            bigList[i].days[d] = <div className="cR"></div>;
          } else if (bigList[i].days[d] == 'in_progress') {
            bigList[i].days[d] = (
              <div className="ipR">
                <div className="whiteHalfSide"></div>
              </div>
            );
          }
        } else if (bigList[i].type == 'Action') {
          if (bigList[i].days[d] == 'not started') {
            if (checkAbove(bigList[i].under, d, bigList[i])) {
              bigList[i].days[d] = (
                <div className="ipA">
                  <div className="whiteHalfTop"></div>
                </div>
              );
            } else {
              bigList[i].days[d] = <div className="nsA"></div>;
            }
          } else if (bigList[i].days[d] == 'completed') {
            bigList[i].days[d] = <div className="cA"></div>;
          } else if (bigList[i].days[d] == 'in_progress') {
            bigList[i].days[d] = (
              <div className="ipA">
                <div className="whiteHalfSide"></div>
              </div>
            );
          }
        } else {
          if (bigList[i].days[d] == 'not started') {
            if (checkAbove(bigList[i].under, d, bigList[i])) {
              bigList[i].days[d] = (
                <div className="ipI">
                  <div className="whiteHalfTop"></div>
                </div>
              );
            } else {
              bigList[i].days[d] = <div className="nsI"></div>;
            }
          } else if (bigList[i].days[d] == 'completed') {
            bigList[i].days[d] = <div className="cI"></div>;
          }
        }
      }
    }
    return bigList;
    function checkAbove(above, d, thing) {
      // console.log("checking" + above + " day: " + d + " thing: ");
      // console.log(thing);
      for (const checks of bigList) {
        // if(checks.days[d] == undefined){
        //     return false;
        // }
        if (above == checks.number) {
          // console.log(checks);
          if (checks.days[d] == 'completed' || checks.days[d] == 'complete') {
            return true;
          }
          if (checks.days[d] && checks.days[d].props != undefined) {
            if (
              checks.days[d].props.className == 'cR' ||
              checks.days[d].props.className == 'cA'
            ) {
              return true;
            }
          } else {
            return checkAbove(checks.under, d);
          }
        }
      }
      return false;
    }
  }
  // --------   when routine is clicked on. set children show to true, re-render with setRows ----------
  function clickHandle(number) {
    console.log(rows);
    var newRows = [];
    //take out duplicates of rows (copy into newRows)
    const map = new Map();
    for (const item of rows) {
      if (!map.has(item.number)) {
        map.set(item.number, true);
        newRows.push(item);
      }
    }
    //if clicked on, change show of things underneath
    console.log('click.' + number);
    for (var r = 0; r < newRows.length; r++) {
      if (rows[r].under == number) {
        //console.log("got " + rows[r].name);
        newRows[r].show = !rows[r].show;
        console.log(rows[r].number + ' -> ' + newRows[r].show);
        //also close instructions of routines clicked on. 2 levels deep
        for (var i = 0; i < newRows.length; i++) {
          if (rows[i].under == rows[r].number && rows[i].show) {
            newRows[i].show = !rows[i].show;
            console.log(rows[i].number + ' -> ' + newRows[i].show);
          }
        }
      }
    }
    console.log('click.result: childIn = ', childIn);
    console.log('click.newRows = ', newRows);
    setRows(newRows); //update rows with newRows
    setChildIn('');
  }
  // -------    returns shortened version of rows with only those with show true ----------------------
  function onlyAllowed() {
    var newRows = [];
    for (var r = 0; r < rows.length; r++) {
      if (rows[r].show) {
        console.log('hgot here: ' + rows[r].name);
        newRows.push(rows[r]);
      }
    }
    console.log('ROWS HERE: ', rows);
    console.log('ONLY ALLOWED HERE:');
    console.log(newRows);
    if (newRows.length === 0) return newRows;
    console.log('ROWS HERE: ', rows);
    console.log('ONLY ALLOWED HERE:');
    console.log(newRows);
    newRows.sort((a, b) => {
      if (
        a.startTime != undefined &&
        b.startTime != undefined &&
        a.endTime != undefined &&
        b.endTime != undefined
      ) {
        console.log('a = ', a, '\nb = ', b);
        const [a_start, b_start] = [a.startTime, b.startTime];
        const [a_end, b_end] = [a.endTime, b.endTime];

        const [a_start_time, b_start_time] = getTimes(a.startTime, b.startTime);
        const [a_end_time, b_end_time] = getTimes(a.endTime, b.endTime);
        console.log('start=', a_start, b_start);
        console.log('end=', a_end, b_end);
        if (a_start_time < b_start_time) return -1;
        else if (a_start_time > b_start_time) return 1;
        else {
          if (a_end_time < b_end_time) return -1;
          else if (a_end_time > b_end_time) return 1;
          else {
            if (a_start < b_start) return -1;
            else if (a_start > b_start) return 1;
            else {
              if (a_end < b_end) return -1;
              else if (a_end > b_end) return 1;
            }
          }
        }

        return 0;
      } else {
        return 0;
      }
    });
    console.log('newrows', newRows);
    return newRows;
  }
  function getDayName(num) {
    //console.log('hgot num', num);
    var time = new Date().toLocaleString(tz, tz).replace(/,/g, '');
    var d = Moment(time).format('ddd MMM D YYYY HH:mm:ss [GMT]ZZ ');
    var d = new Date(d);
    //console.log('hgot num', d.getDate());
    //console.log('hgot num', d.getDate() - num);

    d.setDate(d.getDate() - num);
    // var d = new Date();
    // d.setDate(d.getDate() - num);

    // var d = new Date();
    // d.setDate(d.getDate() - num);
    switch (d.getDay()) {
      case 0:
        return 'SUN';
      case 1:
        return 'MON';
      case 2:
        return 'TUE';
      case 3:
        return 'WED';
      case 4:
        return 'THUR';
      case 5:
        return 'FRI';
      case 6:
        return 'SAT';
    }
  }
  function getThisWeek() {
    var today = new Date(new Date() - 86400000);
    var day = Moment().format();
    var x = Moment().date(day);
    // const temp = {
    //   d: today.getDate(),
    //   m: today.getMonth() + 1,
    //   y: today.getFullYear(),
    // };
    const temp = {
      d: Moment().subtract(1, 'days').format('DD'),
      m: Moment().format('MM'),
      y: Moment().format('YYYY'),
    };

    // const numDaysInMonth = new Date(temp.y, temp.m + 1, 0).getDate();
    const numDaysInMonth = Moment().daysInMonth();
    return Array.from({ length: 15 }, (_) => {
      if (temp.d > numDaysInMonth) {
        temp.m += 1;
        temp.d = 1;
      }

      const newDate = Moment().set({
        year: temp.y,
        month: temp.m - 1,
        date: temp.d--,
      });
      // const newDate = new Date(temp.y, temp.m, temp.d--); //.toUTCString()
      let x = '';
      // x =
      //   newDate.getFullYear() +
      //   '-' +
      //   newDate.getMonth() +
      //   '-' +
      //   newDate.getDate();
      x =
        Moment(newDate).format('YYYY') +
        '-' +
        Moment(newDate).format('MM') +
        '-' +
        Moment(newDate).format('DD');
      return x;
      // newDate.getFullYear() +
      //   '-' +
      //   newDate.getMonth() +
      //   '-' +
      //   newDate.getDate();
      //   day: newDate.toLocaleDateString('en-US', { weekday: 'short' }),
      //   num: newDate.getDate(),
      //   date:
      //     newDate.getFullYear() +
      //     '-' +
      //     newDate.getMonth() +
      //     '-' +
      //     newDate.getDate(),

      //   selected: false,
      // };
    });
  }
  console.log(getThisWeek());
  function prevWeek() {
    // TO DO! WEEKS
    // setRows([]);
    console.log('hgot clocked pre');
    setCurDate(new Date(currentDate.getTime() - 604800000));
    cleanData(historyGot, new Date(currentDate.getTime() - 604800000));
    console.log('hgot', new Date(Date.now()).getTime());
    console.log('hgot', currentDate.getDate());
    setLoading(true);
    setLoading(false);
  }
  function nextWeek() {
    console.log('hgot clocked nex');
    cleanData(historyGot, new Date(currentDate.getTime() + 604800000));
    setCurDate(new Date(currentDate.getTime() + 604800000));
    console.log('hgot', Date(Date.now()));
    console.log('hgot', currentDate);
  }

  function sendRoutineToParent(routine) {
    console.log('GOT ROUTINE IN');
    setChildIn(routine);
    console.log(childIn);
    console.log(routine);
    //clickHandle(childIn);
  }
  // const getTimes = (a_day_time, b_day_time) => {
  //   const [a_start_time, b_start_time] = [
  //     a_day_time.substring(10, a_day_time.length),
  //     b_day_time.substring(10, b_day_time.length),
  //   ];
  //   const [a_HMS, b_HMS] = [
  //     a_start_time
  //       .substring(0, a_start_time.length - 3)
  //       .replace(/\s{1,}/, '')
  //       .split(':'),
  //     b_start_time
  //       .substring(0, b_start_time.length - 3)
  //       .replace(/\s{1,}/, '')
  //       .split(':'),
  //   ];
  //   const [a_parity, b_parity] = [
  //     a_start_time
  //       .substring(a_start_time.length - 3, a_start_time.length)
  //       .replace(/\s{1,}/, ''),
  //     b_start_time
  //       .substring(b_start_time.length - 3, b_start_time.length)
  //       .replace(/\s{1,}/, ''),
  //   ];

  //   let [a_time, b_time] = [0, 0];
  //   if (a_parity === 'PM' && a_HMS[0] !== '12') {
  //     const hoursInt = parseInt(a_HMS[0]) + 12;
  //     a_HMS[0] = `${hoursInt}`;
  //   } else if (a_parity === 'AM' && a_HMS[0] === '12') a_HMS[0] = '00';

  //   if (b_parity === 'PM' && b_HMS[0] !== '12') {
  //     const hoursInt = parseInt(b_HMS[0]) + 12;
  //     b_HMS[0] = `${hoursInt}`;
  //   } else if (b_parity === 'AM' && b_HMS[0] === '12') b_HMS[0] = '00';

  //   for (let i = 0; i < a_HMS.length; i++) {
  //     a_time += Math.pow(60, a_HMS.length - i - 1) * parseInt(a_HMS[i]);
  //     b_time += Math.pow(60, b_HMS.length - i - 1) * parseInt(b_HMS[i]);
  //   }

  //   return [a_time, b_time];
  // };
  //-----------------------
  if (isLoading) {
    return (
      <div>
        <br></br>
        <br></br>
        <h1>Loading...</h1>
      </div>
    );
  }
  if (childIn != '') {
    clickHandle(childIn);
  }
  return (
    <Container fluid padding="0px" backgroundColor="#F2F7FC">
      <Row style={{ width: '30%' }}>
        <MiniNavigation />
      </Row>
      <Row fluid padding={0} backgroundColor="#F2F7FC">
        <Col width="10rem" style={{ padding: '0px', overflow: 'hidden' }}>
          <div display="flex" flex-direction="row">
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
                      <Row style={{ marginTop: '10px', flex: '1' }}>
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
                          style={{ textAlign: 'center', marginTop: '0px' }}
                        >
                          <p
                            style={{
                              textTransform: 'none',
                              fontWeight: 'bold',
                              margin: '0px',
                            }}
                          >
                            Week of{' '}
                            {Moment(currentDate.getTime() - 604800000).format(
                              'MMMM D'
                            )}
                            -
                            {Moment(currentDate.getTime() - 86400000).format(
                              'D, YYYY'
                            )}
                          </p>
                          <p
                            style={{ textTransform: 'none', height: '19.5px' }}
                          >
                            {userTime_zone}
                          </p>
                        </Col>
                        <Col style={{ justifyContent: 'right' }}>
                          {new Date(Date.now()).getDate() !=
                          currentDate.getDate() ? (
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
                          ) : (
                            <div></div>
                          )}
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
                      <TableRow key={row.number}>
                        <TableCell align="right" height="98px">
                          {row.sun}
                        </TableCell>
                        <TableCell align="right">{row.mon}</TableCell>
                        <TableCell align="right">{row.tue}</TableCell>
                        <TableCell align="right">{row.wed}</TableCell>
                        <TableCell align="right">{row.thurs}</TableCell>
                        <TableCell align="right">{row.fri}</TableCell>
                        <TableCell align="right">{row.sat}</TableCell>
                        <TableCell
                          align="right"
                          component="th"
                          scope="row"
                          onClick={() => clickHandle(row.number)}
                        ></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </Col>
        <Col
          overflow="hidden"
          marginLeft="0px"
          xs="auto"
          style={{
            paddingLeft: '0px',
            overflow: 'hidden',
            paddingRight: '0px',
            paddingTop: '4px',
          }}
        >
          {/* <br></br> */}
          {/* <br></br> */}
          <VerticalRoutine
            onlyAllowed={onlyAllowed()}
            userID={currentUser}
            sendRoutineToParent={sendRoutineToParent}
            allRows={rows}
          />
          {/* <Container style={{padding:"0px"}}>{vertRou}</Container> */}
        </Col>
      </Row>
    </Container>
  );
}
