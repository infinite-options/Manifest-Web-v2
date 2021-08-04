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
  faImage,
} from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import FirebaseV2 from './Firebasev2';
import DayEvents from './DayEvents';
import DayRoutines from './DayRoutines.jsx';
import WeekRoutines from './WeekRoutines.jsx';
import userContext from './userContext';

import { Navigation } from "./navigation";
import EditRTSContext from './EditRTS/EditRTSContext';
import EditRTS from './EditRTS/EditRTS';


import EditATSContext from './EditATS/EditATSContext';
import EditATS from './EditATS/EditATS';

import EditISContext from './EditIS/EditISContext';
import EditIS from './EditIS/EditIS';
import LoginContext from '../LoginContext';
import AddNewATItem from './addNewATItem';


/* Navigation Bar component function */

export default function Home(props) {


  // const [userID, setUserID] = useState("");
  const loginContext = useContext(LoginContext);
  const userID = loginContext.loginState.curUser;

  console.log(props.location.state);
  console.log(userID)

  // GetUserID(props.location.state);

  const history = useHistory();

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
      console.log(props.location.state);
      axios.get("https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/usersOfTA/" + props.location.state)
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
            GrabFireBaseRoutinesGoalsData();
            // return userID;
          }
          else{console.log("No User Found");}
      })
      .catch((error) => {
          console.log(error);
      });
    },[])
  // } 


  /*----------------------------Use states to define variables----------------------------*/
  


  const [hightlight, setHightlight] = useState('')
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

      is_displayed_today: false,
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
    routines: [
      // {
      //   title: "Breakfast",
      //   id: "01",
      //   end_day_and_time: "06/21/2021",
      //   is_available: false,
      // },
      // {
      //   title: "Lunch",
      //   id: "02",
      //   end_day_and_time: "06/21/2021",
      //   is_available: false,
      // },
    ],
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
        new Date().toLocaleString('en-US', {
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        })
      )
    ), //Keep track of day and month
    todayDateObject: moment(
      new Date(
        new Date().toLocaleString('en-US', {
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
    currentUserTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
    BASE_URL:
      'https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/',
  });

  const initialEditingRTSState = {
    editing: false,
    type: '',
    id: '',
    user_id:userID,
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
      repeat: '',
      repeat_frequency: 'Day',
      repeat_every: '',
      repeat_type: '',
      repeat_ends_on: '',
      repeat_occurences: '',
      repeat_week_days: {
        "0": "",
        "1": "",
        "2": "",
        "3": "",
        "4": "",
        "5": "",
        "6": ""
      },
      location: '',
      is_available: false,
      is_persistent: true,
      is_complete: true,
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
        }
      },
      user_notifications: {
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
        }
      },
    },
  }

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
      repeat_every: '',
      repeat_type: '',
      repeat_ends_on: '',
      repeat_occurences: '',
      repeat_week_days: {
        "0": "",
        "1": "",
        "2": "",
        "3": "",
        "4": "",
        "5": "",
        "6": ""
      },
      location: '',
      is_available: false,
      is_persistent: true,
      is_complete: false,
      is_in_progress:false,
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
        }
      },
      user_notifications: {
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
        }
      },
    },
  }

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
      is_available: false,
      is_persistent: true,
      is_complete: true,
      is_displayed_today: true,
      is_timed: false,
      is_sublist_available: true,
      photo: '',     
    },
  }

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
      is_available: false,
      is_complete: true,
      is_timed: false,
      photo: '',     
    },
  }
  const [editingRTS, setEditingRTS] = useState(initialEditingRTSState)
  const [editingATS, setEditingATS] = useState(initialEditingATSState)
  const [editingIS, setEditingIS] = useState(initialEditingISState)


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
      marginRight: '.5%'
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
    // setAllValues( prevValues => {
    //     return { ...prevValues,[e.target.name]: e.target.value}
    //  }
    // setStateValue((prevState) => {
    //   return {
    //     timeSlotForAT: timeSlot,
    //   };
    // });

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
      // console.log(startDate, endDate);
      // getEventsByIntervalDayVersion(
      //   LocalDateToISOString(startDate, stateValue.currentUserTimeZone),
      //   LocalDateToISOString(endDate, stateValue.currentUserTimeZone)
      // );

      // this.getEventsByIntervalDayVersion(startDate, endDate);
    } else if (this.state.calendarView === 'Week') {
      let startObject = this.state.dateContext.clone();
      let endObject = this.state.dateContext.clone();
      let startDay = startObject.startOf('week');
      let endDay = endObject.endOf('week');
      let startDate = new Date(startDay.format('MM/DD/YYYY'));
      let endDate = new Date(endDay.format('MM/DD/YYYY'));
      startDate.setHours(0, 0, 0);
      endDate.setHours(23, 59, 59);
      // getEventsByIntervalWeekVersion(
      //   LocalDateToISOString(startDate, stateValue.currentUserTimeZone),
      //   LocalDateToISOString(endDate, stateValue.currentUserTimeZone)
      // );
    }
  };



  /*-----------------------------handleModalClicked:-----------------------------*/
  /* this will toggle show hide of the firebase modal currently */
  // handleModalClicked = arg => {
  //   // bind with an arrow function
  //   this.setState({
  //     modelSelected: !this.state.modelSelected
  //   });
  // };

  // TALogOut = () => {
  //   axios
  //     .get("./TALogOut")
  //     .then((response) => {
  //       this.setState(
  //         {
  //           loggedIn: false,
  //         },
  //         console.log(response)
  //       );
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // };

  // nextMonth = () => {
  //   let dateContext = Object.assign({}, this.state.dateContext);
  //   dateContext = moment(dateContext).add(1, "month");
  //   this.setState(
  //     {
  //       dateContext: dateContext,
  //       originalEvents: [],
  //     },
  //     this.updateEventsArray
  //   );
  // };

  // prevMonth = () => {
  //   let dateContext = Object.assign({}, this.state.dateContext);
  //   dateContext = moment(dateContext).subtract(1, "month");
  //   this.setState(
  //     {
  //       dateContext: dateContext,
  //       originalEvents: [],
  //     },
  //     this.updateEventsArray
  //   );
  // };

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
      // updateEventsArray;
    });
    // this.setState(
    //   {
    //     dateContext: newdateContext,
    //     dayEvents: [],
    //   },
    //   this.updateEventsArray
    // );
    // console.log(stateValue.dateContext, stateValue.dayEvents);
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
        {/* <Container> */}
        {/* <Row style={{ marginTop: '0px' }}> */}
        {/* <Col>
              <div>
                <FontAwesomeIcon
                  style={{ marginLeft: "100px" }}
                  icon={faChevronLeft}
                  size="2x"
                  className="X"
                  onClick={(e) => {
                    prevDay();
                    {
                      console.log("prevDay");
                    }
                  }}
                />
              </div>
            </Col> */}
        {/* <Col
              md="auto"
              style={{ textAlign: "center" }}
              className="bigfancytext"
            > */}
        {/* <p>
                {stateValue.dateContext.format("dddd")} {getDay()} {getMonth()}
                {getYear()}
              </p> */}
        {/* <p
                style={{ marginBottom: "0", height: "19.5px" }}
                className="normalfancytext"
              >
                {stateValue.currentUserTimeZone}
              </p> */}
        {/* </Col> */}
        {/* <Col>
              <FontAwesomeIcon
                // style={{ marginLeft: "50%" }}
                style={{ float: "right", marginRight: "100px" }}
                icon={faChevronRight}
                size="2x"
                className="X"
                onClick={(e) => {
                  // nextDay();
                  {
                    console.log("nextDay");
                  }
                }}
              />
            </Col> */}
        {/* </Row> */}
        {/* </Container> */}
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
            timeZone={stateValue.currentUserTimeZone}
          />
          <DayRoutines
            // handleDateClick={this.handleDateClickOnDayView}
            timeZone={stateValue.currentUserTimeZone}
            dateContext={stateValue.dateContext}
            routine_ids={stateValue.routine_ids}
            routines={stateValue.routines}
            dayRoutineClick={toggleShowRoutine}
            theCurrentUserId={userID}
            originalGoalsAndRoutineArr={stateValue.originalGoalsAndRoutineArr}
            BASE_URL={stateValue.BASE_URL}
          />
          {/* <DayGoals
                TimeZone={this.state.currentUserTimeZone}
                dateContext={this.state.dateContext}
                goal_ids={this.state.goal_ids}
                goals={this.state.goals}
                dayGoalClick={this.toggleShowGoal}
                theCurrentUserId={this.state.currentUserId}
                originalGoalsAndRoutineArr={this.state.originalGoalsAndRoutineArr}
                BASE_URL={this.state.BASE_URL}
              /> */}
        </Row>
        {/* <div>
          <FullCalendar
            initialView="timeGridWeek"
            // defaultView="weekMode"
            plugins={[timeGridPlugin]}
            events={""}
            allDaySlot={false}
            slotDuration={"1:00:00"}
            scrollTime={"06:00:00"}
          />
        </div> */}
      </div>
    );
  }

  const weekViewAbstracted = () => {
    // let startObject = stateValue.dateContext.clone();
    // let startWeek = startObject.startOf('week');
    return (
      <div
        style={
          {
            width: '100%'
            // display: 'auto',
            // borderRadius: '20px',
            // backgroundColor: 'white',
            // width: '100%',
            // marginLeft: '10px',
            // paddingTop: '20px',
            // border: '1px black solid',
            // boxShadow:
            //   '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)',
          }
        }
      >
        {/* <Container style={{ float: 'right' }}>
          <Container>
            <Row style={{ marginTop: '0px' }}>
              <Col>
                <div>
                  <FontAwesomeIcon
                    // style={{ marginLeft: "50%" }}
                    style={{ marginLeft: '100px' }}
                    icon={faChevronLeft}
                    size="2x"
                    className="X"
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
                <p> Week of {startWeek.format('D MMMM YYYY')} </p>
                <p
                  style={{ marginBottom: '0', height: '19.5px' }}
                  className="normalfancytext"
                >
                  {stateValue.currentUserTimeZone}
                </p>
              </Col>
              <Col>
                <FontAwesomeIcon
                  // style={{ marginLeft: "50%" }}
                  style={{ float: 'right', marginRight: '100px' }}
                  icon={faChevronRight}
                  size="2x"
                  className="X"
                  onClick={(e) => {
                    nextWeek();
                  }}
                />
              </Col>
            </Row>
          </Container> */}
        {/* <Row>
            <WeekEvents
              weekEvents={stateValue.weekEvents}
              dateContext={stateValue.dateContext}
              eventClick={handleWeekEventClick}
              onDayClick={handleDateClickOnWeekView}
              timeZone={stateValue.currentUserTimeZone}
            />
          </Row> */}
        {/* <Row>
            <WeekGoals
              timeZone={stateValue.currentUserTimeZone}
              dateContext={stateValue.dateContext}
              goals={stateValue.goals}
              BASE_URL={stateValue.BASE_URL}
            />
          </Row> */}
        <Row style={{ float: 'right', width: '100%' }}>
          <WeekRoutines
            timeZone={stateValue.currentUserTimeZone}
            routines={stateValue.routines}
            dateContext={stateValue.dateContext}
            BASE_URL={stateValue.BASE_URL}
            highLight = {hightlight}
          />
        </Row>
        {/* </Container> */}
      </div>
    );
  };

  function showCalendarView(props) {
    // if (this.state.calendarView === 'Month') return this.calendarAbstracted();
    if (stateValue.calendarView === 'Day') return dayViewAbstracted();
    else if (stateValue.calendarView === 'Week') 
      return weekViewAbstracted();
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
    let url = stateValue.BASE_URL + 'getgoalsandroutines/';

    let routine = [];
    let routine_ids = [];
    let goal = [];
    let goal_ids = [];

    // console.log('base url ', url);
    // console.log('base url id ', userID);

    useEffect(() => {
      console.log("Before gar");
      console.log(userID);
      axios
        .get(url + userID)
        .then((response) => {
          if (response.data.result && response.data.result.length !== 0) {
            let x = response.data.result;
            console.log(x);
            x.sort((a, b) => {
              // console.log(a);
              // console.log(b);
              let datetimeA = new Date(a['gr_start_day_and_time']);
              let datetimeB = new Date(b['gr_start_day_and_time']);
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
              var goalDate = new Date(gr.end_day_and_time);
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
              // console.log(startDate);
              // console.log(endDate);

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
            })
            setEditingATS({
              ...editingATS,
              gr_array: gr_array,
            })
          } else {
            setStateValue((prevState) => {
              return {
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
    }, [userID,  editingRTS.editing]);
  }

  const updateFBGR = () => {
    GrabFireBaseRoutinesGoalsData();
    // props.refresh();
    // useEffect(() => {
    // window.location.reload();
    // }, []);
  };

  function ToggleShowAbout(){
    history.push("/about")
  }
  if (loginContext.loginState.loggedIn == false) {
    history.push('/')
  }

  /*----------------------------return()----------------------------*/
  let startObject = stateValue.dateContext;
  let startWeek = startObject.startOf('week');

  console.log('stateValue')
  console.log(stateValue)

  return (
    // console.log('home routines', stateValue.routines),
    /*----------------------------button
        selection----------------------------*/
    <div>
      {/* <Navigation userID= {stateValue.currentUserId}/> */}
      <div style={{height: '3px'}}></div>
      <EditRTSContext.Provider
        value={{
          editingRTS: editingRTS,
          setEditingRTS: setEditingRTS,
        }}
      >
      <EditATSContext.Provider
        value={{
          editingATS: editingATS,
          setEditingATS: setEditingATS
        }}
      >
         <EditISContext.Provider
        value={{
          editingIS: editingIS,
          setEditingIS: setEditingIS
        }}
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
          <div style={{width: '30%', float: 'left'}}>
            <Button className={classes.buttonSelection} id="one" onClick={()=> history.push("/history") }>
              History
            </Button>
            <Button className={classes.buttonSelection} id="one" onClick={ToggleShowAbout}>
              About
            </Button>
            <Button className={classes.buttonSelection} id="one">
              Events
            </Button>
            <Button className={classes.buttonSelection} onClick={()=> history.push("/main") } id="one">
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
                style={{width: '20%', marginLeft: '2.5%', marginRight: '2.5%'}} 
                id="one"
                onClick={() => {
                  // e.stopPropagation()
                  console.log('Clicked add RTS')
                  //console.log(editingRTS)
                  setEditingRTS(newRTSState)
                  //console.log(editingRTS)
                }}
              >
                Add Routine +
              </Button>
            ) : (
              <div style = {{width: '20%', marginLeft: '2.5%', marginRight: '2.5%'}}>

              </div>
            )}

            <div style={{flex:'1'}}>
                {userID != '' && (
                  <FirebaseV2
                  theCurrentUserID={userID}
                  sethighLight = {setHightlight}
                  highLight = {hightlight}
                  edit = { editingRTS.editing}
                  />
                )}
              </div>
              {/* <div style={{flex:'2'}}
              >
               {editingIS.editing ? <EditIS/> : editingATS.editing ? <EditATS/> : editingRTS.editing ? <EditRTS /> : showCalendarView()}
           
              </div> */}
          </div>
          <div style={{width: '70%', float: 'left'}}>
          {editingRTS.editing
          ?
          (
          null
          )
          :

          (<Box
              bgcolor="#889AB5"
              className={classes.dateContainer}
              style={{width: '100%'}}
              //style={{ width: '100%', marginTop:'1rem' }}
              // flex
            >
              <Container style={{width: '100%'}}>
                <Row style={{ marginTop: '0px', width: '100%' }}>
                  <Col style={{width: '10%'}}>
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
                    style={{ textAlign: 'center', width: '80%' }}
                    className="bigfancytext"
                  >
                    <p> Week of {startWeek.format('D MMMM YYYY')} </p>
                    <p
                      style={{ marginBottom: '0', height: '19.5px' }}
                      className="normalfancytext"
                    >
                      {stateValue.currentUserTimeZone}
                    </p>
                  </Col>
                  <Col style={{width: '10%', textAlign: 'right'}}>
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
              
            </Box>)}

            <div style={{width: '100%'}}
              >
               {editingIS.editing ? <EditIS/> : editingATS.editing ? <EditATS/> : editingRTS.editing ? <EditRTS /> : showCalendarView()}
           
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
