import React, { Component, useContext, useEffect, useState } from 'react';
import axios from 'axios';

import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import AppBar from '@material-ui/core/AppBar';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useHistory, Redirect } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import './Home.css';

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
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faCalendar,
  faImage,
} from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import FirebaseV2 from './Firebasev2';
import DayEvents from './DayEvents';
import DayRoutines from './DayRoutines.jsx';
import WeekRoutines from './WeekRoutines.jsx';
import userContext from './userContext';

import EditRTSContext from './EditRTS/EditRTSContext';
import EditRTS from './EditRTS/EditRTS';

import EditATSContext from './EditATS/EditATSContext';
import EditATS from './EditATS/EditATS';

import EditISContext from './EditIS/EditISContext';
import EditIS from './EditIS/EditIS';
import LoginContext from '../LoginContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Home(props) {
  console.log('In home');
  const loginContext = useContext(LoginContext);
  var selectedUser = loginContext.loginState.curUser;
  console.log(loginContext.loginState.curUser);
  if (
    document.cookie.split(';').some((item) => item.trim().startsWith('ta_uid='))
  ) {
    selectedUser = document.cookie
      .split('; ')
      .find((row) => row.startsWith('ta_uid='))
      .split('=')[1];
  }

  var userID = '';
  var userTime_zone = '';
  if (
    document.cookie
      .split(';')
      .some((item) => item.trim().startsWith('patient_uid='))
  ) {
    console.log('in there');
    userID = document.cookie
      .split('; ')
      .find((row) => row.startsWith('patient_uid='))
      .split('=')[1];
    userTime_zone = document.cookie
      .split('; ')
      .find((row) => row.startsWith('patient_timeZone='))
      .split('=')[1];
    // document.cookie = 'patient_timeZone=test'
  } else {
    console.log('in here', console.log(loginContext.loginState));
    console.log('document cookie', document.cookie);
    userID = loginContext.loginState.curUser;
    //userTime_zone = 'America/Tijuana';
    if (loginContext.loginState.usersOfTA.length === 0) {
      userTime_zone = 'America/Tijuana';
    } else {
      userTime_zone = loginContext.loginState.usersOfTA[0].time_zone;
    }
    /* userTime_zone = document.cookie
      .split('; ')
      .find((row) => row.startsWith('patient_timeZone='))
      .split('=')[1]; */
    //userTime_zone = loginContext.loginState.curUserTimeZone;
    console.log('curUser', userID);
    console.log('curUser', userTime_zone);
    // document.cookie = 'patient_name=test'
  }

  const history = useHistory();
  //console.log('curUser timezone', userTime_zone);
  /* useEffect() is used to render API calls as minimumly 
  as possible based on past experience, if not included 
  causes alarms and excessive rendering */
  function GetBaseUrl() {
    useEffect(() => {
      axios.get('/base_url', {}).then((response) => {
        console.log('getBaseUrl', response);

        setStateValue((prevState) => {
          return {
            ...prevState,
            BASE_URL: response['data'],
          };
        });
      });
    }, []);
  }

  // const [userID, setUserID] = useState(" ");

  // function GetUserID(e){
  useEffect(() => {
    console.log('home line 94');
    console.log(
      document.cookie
        .split('; ')
        .find((row) => row.startsWith('ta_email='))
        .split('=')[1]
    );
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
        if (response.result !== false) {
          const usersOfTA = response.data.result;
          const curUserID = usersOfTA[0].user_unique_id;
          const curUserTZ = usersOfTA[0].time_zone;
          console.log('timezone', curUserTZ);
          loginContext.setLoginState({
            ...loginContext.loginState,
            usersOfTA: response.data.result,
            curUser: curUserID,
            curUserTimeZone: curUserTZ,
          });
          console.log(curUserID);
          console.log('timezone', curUserTZ);
          // setUserID(curUserID);
          // console.log(userID);
          GrabFireBaseRoutinesGoalsData();
          // return userID;
        } else {
          console.log('No User Found');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [loginContext.loginState.reload]);
  // }
  console.log(loginContext.loginState.curUserTimeZone);
  /*----------------------------Use states to define variables----------------------------*/
  const [routineID, setRoutineID] = useState('');
  const [actionID, setActionID] = useState('');
  const [getGoalsEndPoint, setGetGoalsEndPoint] = useState([]);
  const [getActionsEndPoint, setGetActionsEndPoint] = useState({});
  const [getStepsEndPoint, setGetStepsEndPoint] = useState([]);

  const [hightlight, setHightlight] = useState('');
  const [stateValue, setStateValue] = useState({
    itemToEdit: {
      title: '',
      id: '',
      // is_persistent: this.props.isRoutine,
      photo: '',
      photo_url: '',
      type: '',
      is_complete: false,
      is_available: true,
      is_displayed_today: true,
      is_in_progress: false,
      // todayDateObject: this.props.todayDateObject,
      // available_end_time: this.props.singleGR.available_end_time,
      // available_start_time: this.props.singleGR.available_start_time,
      available_end_time: '23:59:59',
      available_start_time: '00:00:00',
      datetime_completed: 'Sun, 23 Feb 2020 00:08:43 GMT',
      datetime_started: 'Sun, 23 Feb 2020 00:08:43 GMT',
      audio: '',
      is_timed: false,
      expected_completion_time: '01:00:00',
      is_sublist_available: true,

      //this is fro the reapeat routine and goals
      start_day_and_time: new Date(),
      end_day_and_time: new Date(),
      repeat: false,
      repeat_every: '1',
      repeat_frequency: 'Day',
      repeat_type: '',
      repeat_ends_on: '',
      repeat_occurences: '1',
      repeat_week_days: {
        0: '',
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
      },
      ta_notifications: {
        before: {
          is_enabled: false,
          is_set: false,
          message: '',
          time: '00:05:00',
        },
        during: {
          is_enabled: false,
          is_set: false,
          message: '',
          time: '00:30:00',
        },
        after: {
          is_enabled: false,
          is_set: false,
          message: '',
          time: '00:05:00',
        },
      },
      user_notifications: {
        before: {
          is_enabled: false,
          is_set: false,
          message: '',
          time: '00:05:00',
        },
        during: {
          is_enabled: false,
          is_set: false,
          message: '',
          time: '00:30:00',
        },
        after: {
          is_enabled: false,
          is_set: false,
          message: '',
          time: '00:05:00',
        },
      },
    },
    createUserParam: false,
    loaded: false,
    loggedIn: false,
    originalEvents: [], //holds the google events data in it's original JSON form
    dayEvents: [], //holds google events data for a single day
    weekEvents: [], //holds google events data for a week
    originalGoalsAndRoutineArr: [], //Hold goals and routines so day and week view can access it
    goals: [],
    routines: [],
    routine_ids: [],
    goal_ids: [],
    showRoutineGoalModal: false,
    showGoalModal: false,
    showRoutineModal: false,
    showAboutModal: false,
    noteToFuture: false,
    showPeopleModal: false,
    dayEventSelected: false, //use to show modal to create new event
    // modelSelected: false, // use to display the routine/goals modal
    newAccountEmail: 'asdf',
    newEventID: '', //save the event ID for possible future use
    newEventRecurringID: '',
    newEventName: '',
    newEventGuests: '',
    newEventLocation: '',
    newEventNotification: 30,
    newEventDescription: '',
    newEventStart0: new Date(), //start and end for a event... it's currently set to today
    newEventEnd0: new Date(), //start and end for a event... it's currently set to today
    isEvent: false, // use to check whether we clicked on a event and populate extra buttons in event form
    //////////New additions for new calendar
    dateContext: moment(
      new Date(
        new Date().toLocaleString('UTC', {
          timeZone: Intl.DateTimeFormat().resolvedOptions().userTime_zone,
        })
      )
    ), //Keep track of day and month
    todayDateObject: moment(
      new Date(
        new Date().toLocaleString('UTC', {
          timeZone: Intl.DateTimeFormat().resolvedOptions().userTime_zone,
        })
      )
    ), //Remember today's date to create the circular effect over todays day
    calendarView: 'Week', // decides which type of calendar to display
    showRepeatModal: false,
    repeatOption: false,
    repeatOptionDropDown: 'Does not repeat',
    repeatDropDown: 'DAY',
    repeatDropDown_temp: 'DAY',
    repeatMonthlyDropDown: 'Monthly on day 13',
    repeatInputValue: '1',
    repeatInputValue_temp: '1',
    repeatOccurrence: '1',
    repeatOccurrence_temp: '1',
    repeatRadio: 'Never',
    repeatRadio_temp: 'Never',
    repeatEndDate: '',
    repeatEndDate_temp: '',
    showNoTitleError: '',
    showDateError: '',
    byDay: {
      0: '',
      1: '',
      2: '',
      3: '',
      4: '',
      5: '',
      6: '',
    },
    byDay_temp: {
      0: '',
      1: '',
      2: '',
      3: '',
      4: '',
      5: '',
      6: '',
    },
    repeatSummary: '',
    recurrenceRule: '',
    eventNotifications: {},
    showDeleteRecurringModal: false,
    deleteRecurringOption: 'This event',
    showEditRecurringModal: false,
    editRecurringOption: '',

    currentUserPicUrl: '',
    currentUserName: '',
    currentUserTimeZone: userTime_zone,
    currentUserId: userID, //'100-000071',
    currentAdvisorCandidateName: '',
    currentAdvisorCandidateId: '',
    // profileName: "",
    userIdAndNames: {},
    userTimeZone: {},
    advisorIdAndNames: [],
    userPicsArray: [],
    enableNameDropDown: false,
    showNewAccountmodal: false,
    showAllowTAmodel: false,

    ta_people_id: '',
    emailIdObject: {},
    theCurrentUserEmail: {},
    newAccountID: '',

    // versionNumber: this.getVersionNumber(),
    // date: this.getVersionDate(),
    // BASE_URL: getBaseUrl(),
    BASE_URL: BASE_URL,
  });
  console.log('startObject = ', stateValue.currentUserTimeZone);
  const initialEditingRTSState = {
    editing: false,
    type: '',
    id: '',
    user_id: userID,
    gr_array: [],
    newItem: {
      audio: '',
      datetime_completed: '',
      datetime_started: '',
      title: '',
      // When making API call, combine start_day and start_time to start_day_and_time
      start_day: '',
      start_time: '',
      // When making API call, combine end_day and end_time to end_day_and_time
      end_day: '',
      end_time: '',
      // When making API call, convert numMins to expected_completion_time
      numMins: '',
      repeat: false,
      repeat_frequency: 'Day',
      repeat_every: '1',
      repeat_type: '',
      repeat_ends_on: '',
      repeat_occurences: '',
      repeat_week_days: {
        0: '',
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
      },
      location: '',
      is_available: true,
      is_persistent: true,
      is_complete: false,
      is_displayed_today: true,
      is_timed: false,
      is_sublist_available: true,
      photo: '',
      photo_url: '',
      ta_notifications: {
        before: {
          is_enabled: true,
          is_set: false,
          message: '',
          time: '',
        },
        during: {
          is_enabled: false,
          is_set: false,
          message: '',
          time: '',
        },
        after: {
          is_enabled: false,
          is_set: false,
          message: '',
          time: '',
        },
      },
      user_notifications: {
        before: {
          is_enabled: false,
          is_set: false,
          message: '',
          time: 0,
        },
        during: {
          is_enabled: false,
          is_set: false,
          message: '',
          time: 0,
        },
        after: {
          is_enabled: false,
          is_set: false,
          message: '',
          time: 0,
        },
      },
    },
  };

  const newRTSState = {
    editing: true,
    type: '',
    id: '',
    user_id: userID,
    gr_array: [],
    newItem: {
      audio: '',
      datetime_completed: '',
      datetime_started: '',
      title: '',
      // When making API call, combine start_day and start_time to start_day_and_time
      start_day: '',
      start_time: '',
      // When making API call, combine end_day and end_time to end_day_and_time
      end_day: '',
      end_time: '',
      // When making API call, convert numMins to expected_completion_time
      numMins: '',
      repeat: false,
      repeat_frequency: 'Day',
      repeat_every: '1',
      repeat_type: '',
      repeat_ends_on: '',
      repeat_occurences: '',
      repeat_week_days: {
        0: '',
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
      },
      location: '',
      is_available: true,
      is_persistent: true,
      is_complete: false,
      is_in_progress: false,
      is_displayed_today: true,
      is_timed: false,
      is_sublist_available: true,
      photo: '',
      photo_url: '',
      ta_notifications: {
        before: {
          is_enabled: false,
          is_set: false,
          message: '',
          time: '',
        },
        during: {
          is_enabled: false,
          is_set: false,
          message: '',
          time: '',
        },
        after: {
          is_enabled: false,
          is_set: false,
          message: '',
          time: '',
        },
      },
      user_notifications: {
        before: {
          is_enabled: false,
          is_set: false,
          message: '',
          time: 0,
        },
        during: {
          is_enabled: false,
          is_set: false,
          message: '',
          time: 0,
        },
        after: {
          is_enabled: false,
          is_set: false,
          message: '',
          time: 0,
        },
      },
    },
  };

  const newEditingATSState = {
    editing: true,
    type: '',
    id: '',
    user_id: props.location.state,
    gr_array: [],
    newItem: {
      audio: '',
      datetime_completed: '',
      datetime_started: '',
      at_title: '',
      // When making API call, combine start_day and start_time to start_day_and_time
      start_day: '',
      start_time: '',
      // When making API call, combine end_day and end_time to end_day_and_time
      end_day: '',
      end_time: '',
      // When making API call, convert numMins to expected_completion_time
      numMins: '',
      location: '',
      is_available: true,
      is_persistent: true,
      is_complete: false,
      is_displayed_today: true,
      is_timed: false,
      is_sublist_available: true,
      photo: '',
    },
  };

  const initialEditingATSState = {
    editing: false,
    type: '',
    id: '',
    user_id: props.location.state,
    gr_array: [],
    newItem: {
      audio: '',
      datetime_completed: '',
      datetime_started: '',
      at_title: '',
      // When making API call, combine start_day and start_time to start_day_and_time
      start_day: '',
      start_time: '',
      // When making API call, combine end_day and end_time to end_day_and_time
      end_day: '',
      end_time: '',
      // When making API call, convert numMins to expected_completion_time
      numMins: '',
      location: '',
      is_available: true,
      is_persistent: true,
      is_complete: false,
      is_displayed_today: true,
      is_timed: false,
      is_sublist_available: true,
      photo: '',
    },
  };
  const initialEditingISState = {
    editing: false,
    type: '',
    id: '',
    user_id: props.location.state,
    gr_array: [],
    newItem: {
      audio: '',
      // When making API call, convert numMins to expected_completion_time
      numMins: '',
      is_available: true,
      is_complete: false,
      is_timed: false,
      photo: '',
    },
  };

  const newEditingISState = {
    editing: true,
    type: '',
    id: '',
    user_id: props.location.state,
    gr_array: [],
    newItem: {
      audio: '',
      // When making API call, convert numMins to expected_completion_time
      numMins: '',
      is_available: true,
      is_complete: false,
      is_timed: false,
      photo: '',
    },
  };
  const [editingRTS, setEditingRTS] = useState(initialEditingRTSState);
  const [editingATS, setEditingATS] = useState(initialEditingATSState);
  const [editingIS, setEditingIS] = useState(initialEditingISState);

  // console.log(calendarView);
  /*----------------------------Custom Hook to make styles----------------------------*/
  const useStyles = makeStyles({
    buttonSelection: {
      width: '14%',
      height: '70px',
      // borderBottomLeftRadius: '25%',
      // borderBottomRightRadius: '25%',
      borderRadius: '0%',
      textTransform: 'capitalize',
      color: '#FFFFFF',
      backgroundColor: '#bbc8d7',
      marginLeft: '.5%',
      marginRight: '.5%',
    },
    buttonContainer: {
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-start',
      textTransform: 'none',
    },

    dateContainer: {
      height: '70px',
      //width: 'relative',
      color: '#FFFFFF',
      // flex: 1,
      // display: 'flex',
    },
  });

  //   const [calendarView] = useState();
  //   const history = useHistory();
  const classes = useStyles();

  //   function routineNavigation() {
  //     history.push("/routine");
  //   }

  var onlyCal =
    !stateValue.showRoutineGoalModal &&
    // !this.state.showGoalModal &&
    !stateValue.showRoutineModal;
  /*----------------------------toggleShowRoutine----------------------------*/
  function toggleShowRoutine(props) {
    setStateValue((prevState) => {
      return {
        ...prevState,
        showRoutineModal: !stateValue.showRoutineModal,
        showGoalModal: false,
        showRoutineGoalModal: false,
      };
    });
    // console.log('Home: Routine Modal', stateValue.showRoutineModal);
    return stateValue.showRoutineModal;
  }

  /*-----------------------------updateEventsArray:-----------------------------*/
  /*updates the array if the month view changes to a different month.*/

  const updateEventsArray = () => {
    if (stateValue.calendarView === 'Month') {
      //The month view has transferred to a different month
      let startObject = stateValue.dateContext.clone();
      let endObject = stateValue.dateContext.clone();
      let startDay = startObject.startOf('month');
      let endDay = endObject.endOf('month');

      let startDate = new Date(startDay.format('MM/DD/YYYY'));
      console.log('startObject', startDate);
      let endDate = new Date(endDay.format('MM/DD/YYYY'));
      startDate.setHours(0, 0, 0);
      endDate.setHours(23, 59, 59);
      // getEventsByInterval(
      //   LocalDateToISOString(startDate, stateValue.currentUserTimeZone),
      //   LocalDateToISOString(endDate, stateValue.currentUserTimeZone)
      // );
    } else if (stateValue.calendarView === 'Day') {
      let startObject = stateValue.dateContext.clone();
      let endObject = stateValue.dateContext.clone();
      // console.log(startObject, endObject);
      let startDay = startObject.startOf('day');
      let endDay = endObject.endOf('day');
      // console.log(startDay, endDay);
      let startDate = new Date(startDay.format('MM/DD/YYYY'));
      let endDate = new Date(endDay.format('MM/DD/YYYY'));
      startDate.setHours(0, 0, 0);
      endDate.setHours(23, 59, 59);
    } else if (this.state.calendarView === 'Week') {
      let startObject = this.state.dateContext.clone();
      let endObject = this.state.dateContext.clone();
      let startDay = startObject.startOf('week');
      let endDay = endObject.endOf('week');
      let startDate = new Date(startDay.format('MM/DD/YYYY'));
      let endDate = new Date(endDay.format('MM/DD/YYYY'));
      startDate.setHours(0, 0, 0);
      endDate.setHours(23, 59, 59);
    }
  };

  const nextDay = () => {
    let newdateContext = Object.assign({}, stateValue.dateContext);
    // console.log(newdateContext);
    newdateContext = moment(newdateContext).add(1, 'day');
    // console.log(newdateContext);

    setStateValue((prevState) => {
      return {
        ...prevState,
        dateContext: newdateContext,
        dayEvents: [],
      };
    });
  };

  const prevDay = () => {
    let dateContext = Object.assign({}, stateValue.dateContext);
    // console.log(dateContext);
    dateContext = moment(dateContext).subtract(1, 'day');
    // console.log(dateContext);

    setStateValue((prevState) => {
      return {
        ...prevState,
        dateContext: dateContext,
        dayEvents: [],
      };
      // updateEventsArray;
    });
    // console.log(stateValuedateContext, stateValue.dayEvents);
  };

  const nextWeek = () => {
    let dateContext = Object.assign({}, stateValue.dateContext);
    dateContext = moment(dateContext).add(1, 'week');
    setStateValue((prevState) => {
      return {
        ...prevState,
        dateContext: dateContext,
        dayEvents: [],
      };
      // updateEventsArray();
    });
    console.log('nextWekk');
  };

  const prevWeek = () => {
    let dateContext = Object.assign({}, stateValue.dateContext);
    dateContext = moment(dateContext).subtract(1, 'week');
    setStateValue((prevState) => {
      return {
        ...prevState,
        dateContext: dateContext,
        dayEvents: [],
      };
      // updateEventsArray();
    });
    console.log('prevWeek');
  };
  const curWeek = () => {
    let dateContext = Object.assign({}, stateValue.dateContext);
    let today = new Date();
    dateContext = moment(dateContext);

    {
      0 <= today.format('D') - dateContext.format('D') &&
      today.format('D') - dateContext.format('D') <= 6 &&
      today.format('M') - dateContext.format('M') === 0
        ? setStateValue((prevState) => {
            return {
              ...prevState,
              dateContext: dateContext,
              dayEvents: [],
            };
            // updateEventsArray();
          })
        : setStateValue((prevState) => {
            return {
              ...prevState,
              dateContext: moment(today),
              dayEvents: [],
            };
            // updateEventsArray();
          });
    }

    console.log('curWeek');
  };

  const getDate = () => {
    stateValue.dateContext.format('dddd');

    getDay();

    getMonth();

    getYear();
  };
  // getYear:
  // returns the year based on year format
  const getYear = () => {
    return stateValue.dateContext.format('Y');
  };

  const getMonth = () => {
    return stateValue.dateContext.format('MMMM');
  };

  const getDay = () => {
    return stateValue.dateContext.format('D');
  };

  function dayViewAbstracted() {
    return (
      <div
        style={{
          borderRadius: '20px',
          background: 'white',
          width: '100%',
          marginLeft: '10px',
          padding: '20px',
          border: '1px black solid',
          boxShadow:
            '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)',
        }}
      >
        <Row>
          {/* {console.log("these are the events that are going to be passed in", this.state.dayEvents)} */}
          {/* {console.log(this.state.dateContext)}
          {console.log(this.state.dayEvents)} */}
          <DayEvents
            dateContext={stateValue.dateContext}
            // eventClickDayView={handleDayEventClick}
            // handleDateClick={handleDateClickOnDayView}
            dayEvents={stateValue.dayEvents}
            // getEventsByInterval={getEventsByIntervalDayVersion}
            timeZone={userTime_zone}
          />

          <DayRoutines
            // handleDateClick={this.handleDateClickOnDayView}
            timeZone={userTime_zone}
            dateContext={stateValue.dateContext}
            routine_ids={stateValue.routine_ids}
            routines={stateValue.routines}
            dayRoutineClick={toggleShowRoutine}
            theCurrentUserId={userID}
            originalGoalsAndRoutineArr={stateValue.originalGoalsAndRoutineArr}
            BASE_URL={stateValue.BASE_URL}
          />
        </Row>
      </div>
    );
  }

  const weekViewAbstracted = () => {
    // let startObject = stateValue.dateContext.clone();
    // let startWeek = startObject.startOf('week');
    return (
      <div
        style={{
          width: '100%',
        }}
      >
        <Row style={{ float: 'right', width: '100%' }}>
          <WeekRoutines
            timeZone={userTime_zone}
            routines={stateValue.routines}
            dateContext={stateValue.dateContext}
            BASE_URL={stateValue.BASE_URL}
            highLight={hightlight}
          />
        </Row>
        {/* </Container> */}
      </div>
    );
  };

  function showCalendarView(props) {
    // if (this.state.calendarView === 'Month') return this.calendarAbstracted();
    if (stateValue.calendarView === 'Day') return dayViewAbstracted();
    else if (stateValue.calendarView === 'Week') return weekViewAbstracted();
  }

  //   props.hidden = props.hidden !== null ? props.hidden : false;

  /*----------------------------getUrlParam----------------------------*/

  const getUrlParam = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  };

  /*----------------------------grabFireBaseRoutinesGoalData----------------------------*/
  /* useEffect() is used to render API calls as minimumly 
  as possible based on past experience, if not included 
  causes alarms and excessive rendering */

  function GrabFireBaseRoutinesGoalsData() {
    let url = BASE_URL + 'getgoalsandroutines/';

    let routine = [];
    let routine_ids = [];
    let goal = [];
    let goal_ids = [];

    // console.log('base url ', url);
    // console.log('base url id ', userID);

    const getTimes = (a_day_time, b_day_time) => {
      const [a_start_time, b_start_time] = [
        a_day_time.substring(10, a_day_time.length),
        b_day_time.substring(10, b_day_time.length),
      ];
      const [a_HMS, b_HMS] = [
        a_start_time
          .substring(0, a_start_time.length - 3)
          .replace(/\s{1,}/, '')
          .split(':'),
        b_start_time
          .substring(0, b_start_time.length - 3)
          .replace(/\s{1,}/, '')
          .split(':'),
      ];
      const [a_parity, b_parity] = [
        a_start_time
          .substring(a_start_time.length - 3, a_start_time.length)
          .replace(/\s{1,}/, ''),
        b_start_time
          .substring(b_start_time.length - 3, b_start_time.length)
          .replace(/\s{1,}/, ''),
      ];

      let [a_time, b_time] = [0, 0];
      if (a_parity === 'PM' && a_HMS[0] !== '12') {
        const hoursInt = parseInt(a_HMS[0]) + 12;
        a_HMS[0] = `${hoursInt}`;
      } else if (a_parity === 'AM' && a_HMS[0] === '12') a_HMS[0] = '00';

      if (b_parity === 'PM' && b_HMS[0] !== '12') {
        const hoursInt = parseInt(b_HMS[0]) + 12;
        b_HMS[0] = `${hoursInt}`;
      } else if (b_parity === 'AM' && b_HMS[0] === '12') b_HMS[0] = '00';

      for (let i = 0; i < a_HMS.length; i++) {
        a_time += Math.pow(60, a_HMS.length - i - 1) * parseInt(a_HMS[i]);
        b_time += Math.pow(60, b_HMS.length - i - 1) * parseInt(b_HMS[i]);
      }

      return [a_time, b_time];
    };

    useEffect(() => {
      if (userID == '') return;
      console.log(
        'here: Change made to editing, re-render triggered. About to get user information, [userID, editingRTS.editing, editingATS.editing, editingIS.editing] = ',
        [userID, editingRTS.editing, editingATS.editing, editingIS.editing]
      );

      axios
        .get(url + userID)
        .then((response) => {
          console.log(
            'here: Obtained user information with res = ',
            response.data.result
          );
          const temp = [];

          for (let i = 0; i < response.data.result.length; i++) {
            temp.push(response.data.result[i]);
          }
          temp.sort((a, b) => {
            console.log('a = ', a, '\nb = ', b);
            const [a_start, b_start] = [
              a.gr_start_day_and_time,
              b.gr_start_day_and_time,
            ];
            console.log('a_start = ', a_start, '\nb_start = ', b_start);
            const [a_end, b_end] = [
              a.gr_end_day_and_time,
              b.gr_end_day_and_time,
            ];

            const [a_start_time, b_start_time] = getTimes(
              a.gr_start_day_and_time,
              b.gr_start_day_and_time
            );
            const [a_end_time, b_end_time] = getTimes(
              a.gr_end_day_and_time,
              b.gr_end_day_and_time
            );

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
          });

          console.log('homeTemp = ', temp);

          setGetGoalsEndPoint(temp);
          if (response.data.result && response.data.result.length !== 0) {
            let x = response.data.result;
            console.log('response', x);
            x.sort((a, b) => {
              // console.log(a);
              // console.log(b);
              let datetimeA = new Date(
                a['gr_start_day_and_time'].replace(/-/g, '/')
              );

              let datetimeB = new Date(
                b['gr_start_day_and_time'].replace(/-/g, '/')
              );

              let timeA =
                new Date(datetimeA).getHours() * 60 +
                new Date(datetimeA).getMinutes();

              let timeB =
                new Date(datetimeB).getHours() * 60 +
                new Date(datetimeB).getMinutes();

              return timeA - timeB;
            });

            let gr_array = [];

            for (let i = 0; i < x.length; ++i) {
              let gr = {};
              gr.audio = '';
              // gr.available_end_time = "23:59:59";
              // gr.available_start_time = "00:00:00";
              gr.datetime_completed = x[i].gr_datetime_completed;
              gr.datetime_started = x[i].gr_datetime_started;
              gr.end_day_and_time = x[i].gr_end_day_and_time;
              gr.expected_completion_time = x[i].expected_completion_time;
              gr.id = x[i].gr_unique_id;

              gr.is_available = x[i].is_available.toLowerCase() === 'true';

              gr.is_complete = x[i].is_complete.toLowerCase() === 'true';
              gr.is_displayed_today =
                x[i].is_displayed_today.toLowerCase() === 'true';
              gr.is_in_progress = x[i].is_in_progress.toLowerCase() === 'true';
              gr.is_persistent = x[i].is_persistent.toLowerCase() === 'true';
              gr.is_sublist_available =
                x[i].is_sublist_available.toLowerCase() === 'true';
              gr.is_timed = x[i].is_timed.toLowerCase() === 'true';

              gr.photo = x[i].photo;
              gr.repeat = x[i].repeat.toLowerCase() === 'true';
              gr.repeat_type = x[i].repeat_type || 'Never';
              gr.repeat_ends_on = x[i].repeat_ends_on;
              gr.repeat_every = x[i].repeat_every;
              gr.repeat_frequency = x[i].repeat_frequency;
              gr.repeat_occurences = x[i].repeat_occurences;

              const repeat_week_days_json = JSON.parse(x[i].repeat_week_days);

              if (repeat_week_days_json) {
                gr.repeat_week_days = {
                  0:
                    repeat_week_days_json.Sunday &&
                    repeat_week_days_json.Sunday.toLowerCase() === 'true'
                      ? 'Sunday'
                      : '',
                  1:
                    repeat_week_days_json.Monday &&
                    repeat_week_days_json.Monday.toLowerCase() === 'true'
                      ? 'Monday'
                      : '',
                  2:
                    repeat_week_days_json.Tuesday &&
                    repeat_week_days_json.Tuesday.toLowerCase() === 'true'
                      ? 'Tuesday'
                      : '',
                  3:
                    repeat_week_days_json.Wednesday &&
                    repeat_week_days_json.Wednesday.toLowerCase() === 'true'
                      ? 'Wednesday'
                      : '',
                  4:
                    repeat_week_days_json.Thursday &&
                    repeat_week_days_json.Thursday.toLowerCase() === 'true'
                      ? 'Thursday'
                      : '',
                  5:
                    repeat_week_days_json.Friday &&
                    repeat_week_days_json.Friday.toLowerCase() === 'true'
                      ? 'Friday'
                      : '',
                  6:
                    repeat_week_days_json.Saturday &&
                    repeat_week_days_json.Saturday.toLowerCase() === 'true'
                      ? 'Saturday'
                      : '',
                };
              } else {
                gr.repeat_week_days = {
                  0: '',
                  1: '',
                  2: '',
                  3: '',
                  4: '',
                  5: '',
                  6: '',
                };
              }

              gr.start_day_and_time = x[i].gr_start_day_and_time;

              // const first_notifications = x[i].notifications[0];
              // const second_notifications = x[i].notifications[1];
              // console.log(first_notifications);
              // console.log(second_notifications);

              for (let k = 0; k < x[i].notifications.length; ++k) {
                const first_notifications = x[i].notifications[k];
                if (first_notifications) {
                  if (first_notifications.user_ta_id.charAt(0) === '1') {
                    gr.user_notifications = {
                      before: {
                        is_enabled:
                          first_notifications.before_is_enable.toLowerCase() ===
                          'true',
                        is_set:
                          first_notifications.before_is_set.toLowerCase() ===
                          'true',
                        message: first_notifications.before_message,
                        time: first_notifications.before_time,
                      },
                      during: {
                        is_enabled:
                          first_notifications.during_is_enable.toLowerCase() ===
                          'true',
                        is_set:
                          first_notifications.during_is_set.toLowerCase() ===
                          'true',
                        message: first_notifications.during_message,
                        time: first_notifications.during_time,
                      },
                      after: {
                        is_enabled:
                          first_notifications.after_is_enable.toLowerCase() ===
                          'true',
                        is_set: first_notifications.after_is_set.toLowerCase(),
                        message: first_notifications.after_message,
                        time: first_notifications.after_time,
                      },
                    };
                  } else if (
                    first_notifications.user_ta_id.charAt(0) === '2' &&
                    first_notifications.user_ta_id === stateValue.ta_people_id
                  ) {
                    gr.ta_notifications = {
                      before: {
                        is_enabled:
                          first_notifications.before_is_enable.toLowerCase() ===
                          'true',
                        is_set:
                          first_notifications.before_is_set.toLowerCase() ===
                          'true',
                        message: first_notifications.before_message,
                        time: first_notifications.before_time,
                      },
                      during: {
                        is_enabled:
                          first_notifications.during_is_enable.toLowerCase() ===
                          'true',
                        is_set: first_notifications.during_is_set.toLowerCase(),
                        message: first_notifications.during_message,
                        time: first_notifications.during_time,
                      },
                      after: {
                        is_enabled:
                          first_notifications.after_is_enable.toLowerCase() ===
                          'true',
                        is_set:
                          first_notifications.after_is_set.toLowerCase() ===
                          'true',
                        message: first_notifications.after_message,
                        time: first_notifications.after_time,
                      },
                    };
                  }
                }
              }

              // if (!gr.ta_notifications) {
              //   gr.ta_notifications = {
              //     before: {
              //       is_enabled: false,
              //       is_set: false,
              //       message: "",
              //       time: gr.user_notifications.before.time,
              //     },
              //     during: {
              //       is_enabled: false,
              //       is_set: false,
              //       message: "",
              //       time: gr.user_notifications.during.time,
              //     },
              //     after: {
              //       is_enabled: false,
              //       is_set: false,
              //       message: "",
              //       time: gr.user_notifications.after.time,
              //     },
              //   };
              // }

              // console.log(gr);
              gr.title = x[i].gr_title;
              // console.log('X', x);
              // console.log(gr.title, gr.is_sublist_available);
              var goalDate = new Date(gr.end_day_and_time.replace(/-/g, '/'));
              console.log(goalDate);
              //For Today Goals and Routines
              let startOfDay = moment(goalDate);
              let endOfDay = moment(goalDate);
              let begOfTheDay = startOfDay.startOf('day');
              let endOfTheDay = endOfDay.endOf('day');
              // console.log(begOfTheDay);
              // console.log(endOfTheDay);
              let todayStartDate = new Date(begOfTheDay.format('MM/DD/YYYY'));
              let todayEndDate = new Date(endOfTheDay.format('MM/DD/YYYY'));
              todayStartDate.setHours(0, 0, 0);
              todayEndDate.setHours(23, 59, 59);
              // console.log(todayStartDate);
              // console.log(todayEndDate);
              // console.log(goalDate);

              //For Week Goals and Routines
              let startWeek = moment(goalDate);
              let endWeek = moment(goalDate);
              let startDay = startWeek.startOf('week');
              let endDay = endWeek.endOf('week');
              // console.log(startDay);
              // console.log(endDay);
              let startDate = new Date(startDay.format('MM/DD/YYYY'));
              let endDate = new Date(endDay.format('MM/DD/YYYY'));
              startDate.setHours(0, 0, 0);
              endDate.setHours(23, 59, 59);
              //console.log(startDate);
              //console.log(endDate);

              //For Months Goals and Routines
              let startMonth = moment(goalDate);
              let endMonth = moment(goalDate);
              let startDayMonth = startMonth.startOf('month');
              let endDayMonth = endMonth.endOf('month');
              // console.log(startDayMonth);
              // console.log(endDayMonth);
              let monthStartDate = new Date(startDayMonth.format('MM/DD/YYYY'));
              let monthEndDate = new Date(endDayMonth.format('MM/DD/YYYY'));
              monthStartDate.setHours(0, 0, 0);
              monthEndDate.setHours(23, 59, 59);
              // console.log(monthStartDate);
              // console.log(monthEndDate);

              if (
                stateValue.calendarView === 'Day' &&
                goalDate.getTime() > todayStartDate.getTime() &&
                goalDate.getTime() < todayEndDate.getTime()
              ) {
                gr_array.push(gr);
              }
              if (
                stateValue.calendarView === 'Week' &&
                goalDate.getTime() > startDate.getTime() &&
                goalDate.getTime() < endDate.getTime()
              ) {
                gr_array.push(gr);
              }
              // if (
              //   this.state.calendarView === "Month" &&
              //   goalDate.getTime() > monthStartDate.getTime() &&
              //   goalDate.getTime() < monthEndDate.getTime()
              // ) {
              //   gr_array.push(gr);
              // }
              // console.log(gr_array);
              if (x[i]['is_persistent'].toLowerCase() === 'true') {
                // routine_ids.push(i);

                // routine_ids.push(x[i]["gr_unique_id"]);
                // routine.push(x[i]);

                if (
                  stateValue.calendarView === 'Day' &&
                  goalDate.getTime() > todayStartDate.getTime() &&
                  goalDate.getTime() < todayEndDate.getTime()
                ) {
                  routine_ids.push(gr['id']);
                  routine.push(gr);
                }
                if (
                  stateValue.calendarView === 'Week' &&
                  goalDate.getTime() > todayStartDate.getTime() &&
                  goalDate.getTime() < todayEndDate.getTime()
                ) {
                  routine_ids.push(gr['id']);
                  routine.push(gr);
                }
                // if (
                //   this.state.calendarView === "Month" &&
                //   goalDate.getTime() > monthStartDate.getTime() &&
                //   goalDate.getTime() < monthEndDate.getTime()
                // ) {
                //   routine_ids.push(gr["id"]);
                //   routine.push(gr);
                // }
              }
              if (x[i]['is_persistent'].toLowerCase() === 'false') {
                // goal_ids.push(i);

                // goal_ids.push(x[i]["gr_unique_id"]);
                // goal.push(x[i]);

                if (
                  stateValue.calendarView === 'Day' &&
                  goalDate.getTime() > todayStartDate.getTime() &&
                  goalDate.getTime() < todayEndDate.getTime()
                ) {
                  goal_ids.push(gr['id']);
                  goal.push(gr);
                }
                if (
                  stateValue.calendarView === 'Week' &&
                  goalDate.getTime() > startDate.getTime() &&
                  goalDate.getTime() < endDate.getTime()
                ) {
                  goal_ids.push(gr['id']);
                  goal.push(gr);
                }
                // if (
                //   this.state.calendarView === "Month" &&
                //   goalDate.getTime() > monthStartDate.getTime() &&
                //   goalDate.getTime() < monthEndDate.getTime()
                // ) {
                //   goal_ids.push(gr["id"]);
                //   goal.push(gr);
                // }
              }
            }

            setStateValue((prevState) => {
              return {
                ...prevState,
                originalGoalsAndRoutineArr: gr_array,
                // goals: goal,
                addNewGRModalShow: false,
                routine_ids: routine_ids,
                // goal_ids: goal_ids,
                routines: routine,
              };
            });
            setEditingRTS({
              ...editingRTS,
              gr_array: gr_array,
            });
            setEditingATS({
              ...editingATS,
              gr_array: gr_array,
            });
          } else {
            setStateValue((prevState) => {
              return {
                ...prevState,
                originalGoalsAndRoutineArr: [],
                // goals: goal,
                addNewGRModalShow: false,
                routine_ids: routine_ids,
                // goal_ids: goal_ids,
                routines: routine,
              };
            });
          }

          // console.log(this.state.goals);
          // console.log(stateValue);
        })
        .catch((error) => {
          console.log('Error in getting goals and routines ' + error);
        });
    }, [userID, editingRTS.editing, editingATS.editing, editingIS.editing]);
  }

  useEffect(() => console.log('here: 4'), [editingRTS.editing.item]);

  const updateFBGR = () => {
    GrabFireBaseRoutinesGoalsData();
    // props.refresh();
    // useEffect(() => {
    // window.location.reload();
    // }, []);
  };

  function ToggleShowAbout() {
    history.push('/about');
  }
  // if (loginContext.loginState.loggedIn == false) {
  //   history.push('/')
  // }

  if (
    document.cookie.split(';').some((item) => item.trim().startsWith('ta_uid='))
  ) {
  } else {
    history.push('/');
  }

  let startWeek = '';
  /*----------------------------return()----------------------------*/
  if (stateValue.dateContext != undefined) {
    let startObject = stateValue.dateContext;
    startWeek = startObject.startOf('week');
  }
  console.log('stateValue', stateValue);
  let curDate = startWeek.clone();
  //let today = new Date();
  const tz = {
    timeZone: userTime_zone,
    // add more here
  };

  let dateNew = new Date().toLocaleString(tz, tz);
  let today = moment(dateNew);
  return (
    // console.log('home routines', stateValue.routines),
    /*----------------------------button
        selection----------------------------*/
    <div>
      {/* <Navigation userID= {stateValue.currentUserId}/> */}
      <div style={{ height: '3px' }}></div>
      <EditRTSContext.Provider
        value={{
          editingRTS: editingRTS,
          setEditingRTS: setEditingRTS,
        }}
        stateValue={stateValue}
        setStateValue={setStateValue}
      >
        <EditATSContext.Provider
          value={{
            editingATS: editingATS,
            setEditingATS: setEditingATS,
          }}
          stateValue={stateValue}
          setStateValue={setStateValue}
        >
          <EditISContext.Provider
            value={{
              editingIS: editingIS,
              setEditingIS: setEditingIS,
            }}
            stateValue={stateValue}
            setStateValue={setStateValue}
          >
            <userContext.Provider
              value={
                (stateValue.itemToEdit,
                stateValue.routines,
                stateValue.originalGoalsAndRoutineArr,
                stateValue.showRoutineModal,
                stateValue.itemToEdit.is_available,
                stateValue.itemToEdit.is_complete,
                stateValue.addNewGRModalShow,
                stateValue.dateContext,
                stateValue.closeRoutine,
                GrabFireBaseRoutinesGoalsData(),
                stateValue.BASE_URL)
              }
            >
              <Box backgroundColor="#bbc8d7">
                <div style={{ width: '30%', float: 'left' }}>
                  <Button
                    className={classes.buttonSelection}
                    id="one"
                    onClick={() => history.push('/history')}
                  >
                    History
                  </Button>
                  <Button
                    className={classes.buttonSelection}
                    id="one"
                    onClick={ToggleShowAbout}
                  >
                    About
                  </Button>
                  <Button className={classes.buttonSelection} id="one">
                    Events
                  </Button>
                  <Button
                    className={classes.buttonSelection}
                    onClick={() => history.push('/main')}
                    id="one"
                  >
                    Goals
                  </Button>
                  <Button
                    className={classes.buttonSelection}
                    onClick={toggleShowRoutine}
                    id="one"
                  >
                    Routines
                  </Button>

                  {stateValue.showRoutineModal ? (
                    <Button
                      className={classes.buttonSelection}
                      style={{
                        width: '19%',
                      }}
                      id="one"
                      onClick={() => {
                        // e.stopPropagation()
                        console.log('Clicked add RTS');
                        //console.log(editingRTS)
                        setEditingRTS(newRTSState);
                        //console.log(editingRTS)
                      }}
                    >
                      Add Routine +
                    </Button>
                  ) : (
                    <div
                      style={{
                        width: '20%',
                      }}
                    ></div>
                  )}

                  <div style={{ flex: '1' }}>
                    {userID != '' && (
                      <FirebaseV2
                        theCurrentUserID={userID}
                        sethighLight={setHightlight}
                        highLight={hightlight}
                        setATS={setEditingATS}
                        newATS={newEditingATSState}
                        rID={routineID}
                        setrID={setRoutineID}
                        newIS={newEditingISState}
                        setIS={setEditingIS}
                        aID={actionID}
                        setaID={setActionID}
                        editRTS={editingRTS.editing}
                        editATS={editingATS.editing}
                        editIS={editingIS.editing}
                        getGoalsEndPoint={getGoalsEndPoint}
                        setGetGoalsEndPoint={setGetGoalsEndPoint}
                        getActionsEndPoint={getActionsEndPoint}
                        setGetActionsEndPoint={setGetActionsEndPoint}
                        getStepsEndPoint={getStepsEndPoint}
                        setGetStepsEndPoint={setGetStepsEndPoint}
                        stateValue={stateValue}
                        setStateValue={setStateValue}
                      />
                    )}
                  </div>
                  {/* <div style={{flex:'2'}}
              >
               {editingIS.editing ? <EditIS/> : editingATS.editing ? <EditATS/> : editingRTS.editing ? <EditRTS /> : showCalendarView()}
           
              </div> */}
                </div>
                <div style={{ width: '70%', float: 'left' }}>
                  {editingRTS.editing ? null : (
                    <Box
                      bgcolor="#889AB5"
                      className={classes.dateContainer}
                      style={{ width: '100%' }}
                      // flex
                    >
                      <Container
                        style={{ marginRight: '-10rem', width: '100%' }}
                      >
                        <Row style={{ margin: '0px', width: '100%' }}>
                          <Col
                            style={{
                              width: '10%',
                              paddingTop: '1rem',
                              marginLeft: '7rem',
                            }}
                          >
                            <div>
                              <FontAwesomeIcon
                                style={{ cursor: 'pointer' }}
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
                            style={{ textAlign: 'center', width: '70%' }}
                            className="bigfancytext"
                          >
                            {0 <= today.format('D') - curDate.format('D') &&
                            today.format('D') - curDate.format('D') <= 6 &&
                            today.format('M') - curDate.format('M') === 0 ? (
                              <p
                                style={{
                                  font: 'normal normal bold 28px SF Pro',
                                  paddingBottom: '0px',
                                }}
                              >
                                This week
                              </p>
                            ) : (
                              <p
                                style={{
                                  font: 'normal normal bold 28px SF Pro',
                                  paddingBottom: '0px',
                                }}
                              >
                                Week of {startWeek.format('D MMMM YYYY')}{' '}
                              </p>
                            )}
                            <p
                              style={{
                                font: 'normal normal bold 20px SF Pro',
                                paddingBottom: '0px',
                              }}
                              className="normalfancytext"
                            >
                              {userTime_zone}
                            </p>
                          </Col>
                          <Col
                            style={{
                              width: '10%',
                              textAlign: 'right',
                              paddingTop: '1rem',
                            }}
                          >
                            <FontAwesomeIcon
                              // style={{ marginLeft: "50%" }}
                              style={{ float: 'right', cursor: 'pointer' }}
                              icon={faChevronRight}
                              size="2x"
                              className="X"
                              onClick={(e) => {
                                nextWeek();
                              }}
                            />
                          </Col>
                          <Col
                            style={{
                              width: '10%',
                              textAlign: 'right',
                              paddingTop: '1rem',
                              marginRight: '1rem',
                            }}
                          >
                            <FontAwesomeIcon
                              // style={{ marginLeft: "50%" }}
                              style={{ float: 'right', cursor: 'pointer' }}
                              icon={faCalendar}
                              size="2x"
                              className="X"
                              onClick={(e) => {
                                curWeek();
                              }}
                            />
                          </Col>
                        </Row>
                      </Container>
                    </Box>
                  )}

                  <div style={{ width: '100%' }}>
                    {editingIS.editing ? (
                      <EditIS
                        routineID={routineID}
                        actionID={actionID}
                        CurrentId={userID}
                        getStepsEndPoint={getStepsEndPoint}
                        setGetStepsEndPoint={setGetStepsEndPoint}
                        getActionsEndPoint={getActionsEndPoint}
                        setGetActionsEndPoint={setGetActionsEndPoint}
                      />
                    ) : editingATS.editing ? (
                      <EditATS
                        routineID={routineID}
                        CurrentId={userID}
                        getActionsEndPoint={getActionsEndPoint}
                        setGetActionsEndPoint={setGetActionsEndPoint}
                        getGoalsEndPoint={getGoalsEndPoint}
                      />
                    ) : editingRTS.editing ? (
                      <EditRTS
                        CurrentId={userID}
                        ta_ID={selectedUser}
                        setGetGoalsEndPoint={setGetGoalsEndPoint}
                      />
                    ) : (
                      showCalendarView()
                    )}
                  </div>
                </div>
              </Box>
              {/* {console.log('Home showRoutineModal', stateValue.showRoutineModal)} */}
              {/* ----------------------------... Navigation--------------------------- */}
              {/* <div>
    //   <userContext.Provider>
    //     value=
    //     {{
    //       stateValue,
    //       setStateValue,
    //     }}
    //   </userContext.Provider>
    // </div> */}
              {/* ---------------------------- Navigation--------------------------- */}
            </userContext.Provider>
          </EditISContext.Provider>
        </EditATSContext.Provider>
      </EditRTSContext.Provider>
    </div>
  );
}
