import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import './Home.css';
import { Container, Row, Col } from 'react-bootstrap';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faCalendar,
  faCalendarDay,
  faCalendarWeek,
  faDownload,
  faUpload,

} from '@fortawesome/free-solid-svg-icons';
import { FaFileDownload, FaCloudUploadAlt } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';
import HomeLHS from './GoalsRoutinesLHS';
import EventLHS from './EventLHS';
import DayEvents from './DayEvents';
import DayRoutines from './DayRoutines.jsx';
import DayGoals from './DayGoals.jsx';
import WeekRoutines from './WeekRoutines.jsx';
import userContext from './userContext';

import DeleteEventModal from './DeleteEventModal';
import EditEventModal from './EditEventModal';
import WeekEvents from './WeekEvents.jsx';

import EditRTSContext from './EditRTS/EditRTSContext';
import EditRTS from './EditRTS/EditRTS';

import EditEventContext from './EditEventContext';
import GoogleEventComponent from './GoogleEventComponent';

import EditATSContext from './EditATS/EditATSContext';
import EditATS from './EditATS/EditATS';

import EditISContext from './EditIS/EditISContext';
import EditIS from './EditIS/EditIS';
import LoginContext from '../LoginContext';
import MiniNavigation from '../manifest/miniNavigation';
import UploadCSV from './Upload';
import Download from './Download';
import QuickEditModal from './QuickEditModal';

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

export default function Home(props) {
  let CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID_LIFE;
  let CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET_LIFE;
  
  let CLIENT_ID_SPACE = process.env.REACT_APP_GOOGLE_CLIENT_ID_SPACE;
  let CLIENT_SECRET_SPACE = process.env.REACT_APP_GOOGLE_CLIENT_SECRET_SPACE;
  console.log('In home');
  const loginContext = useContext(LoginContext);
  var selectedUser = loginContext.loginState.curUser;
  var currentTaPicture = loginContext.loginState.ta.picture;
  console.log(loginContext.loginState.curUser);
  if (
    document.cookie.split(';').some((item) => item.trim().startsWith('ta_uid='))
  ) {
    selectedUser = document.cookie
      .split('; ')
      .find((row) => row.startsWith('ta_uid='))
      .split('=')[1];
  }
  if (
    document.cookie
      .split(';')
      .some((item) => item.trim().startsWith('ta_pic='))
  ) {
    currentTaPicture = document.cookie
      .split('; ')
      .find((row) => row.startsWith('ta_pic='))
      .split('=')[1];
  }

  var userID = '';
  var userTime_zone = '';
  var userEmail = '';
  var userPic = '';
  var userN = '';
  var taID = '';
  var taEmail = '';
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
    taID = document.cookie
      .split('; ')
      .find((row) => row.startsWith('ta_uid='))
      .split('=')[1];
    taEmail = document.cookie
      .split('; ')
      .find((row) => row.startsWith('ta_email='))
      .split('=')[1];
  } else {
    console.log('in here', console.log(loginContext.loginState));
    console.log('document cookie', document.cookie);
    userID = loginContext.loginState.curUser;
    userEmail = loginContext.loginState.curUserEmail;
    userPic = loginContext.loginState.curUserPic;
    userN = loginContext.loginState.curUserName;

    if (loginContext.loginState.usersOfTA.length === 0) {
      userTime_zone = 'America/Tijuana';
    } else {
      userTime_zone = loginContext.loginState.usersOfTA[0].time_zone;
    }

    if (
      document.cookie
        .split(';')
        .some((item) => item.trim().startsWith('ta_uid='))
    ) {
      taID = document.cookie
        .split('; ')
        .find((row) => row.startsWith('ta_uid='))
        .split('=')[1];
      taEmail = document.cookie
        .split('; ')
        .find((row) => row.startsWith('ta_email='))
        .split('=')[1];
    }

    console.log('curUser', userID);
    console.log('curUser', userTime_zone);
    console.log('curUser', userEmail);
  }

  const history = useHistory();
  let pageURL = window.location.href.split('/');
  //console.log('curUser timezone', userTime_zone);
  /* useEffect() is used to render API calls as minimumly
  as possible based on past experience, if not included 
  causes alarms and excessive rendering */

  const getUserOfTA = () => {
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
        console.log('list of users home', response.data.result);
        if (response.data.result.length > 0) {
          const usersOfTA = response.data.result;
          var curUserID = usersOfTA[0].user_unique_id;
          var curUserTZ = usersOfTA[0].time_zone;
          var curUserEI = usersOfTA[0].user_email_id;
          var curUserP = usersOfTA[0].user_picture;
          var curUserN = usersOfTA[0].user_name;

          var uID, uTime_zone, uEmail, uPic, uName;
          if ((
            document.cookie
              .split(';')
              .some((item) => item.trim().startsWith('patient_name='))
          )
            && (document.cookie
            .split('; ')
            .find((row) => row.startsWith('patient_name='))
              .split('=')[1] !== 'Loading')
          )
            {
            uID = document.cookie
              .split('; ')
              .find((row) => row.startsWith('patient_uid='))
              .split('=')[1];
            uTime_zone = document.cookie
              .split('; ')
              .find((row) => row.startsWith('patient_timeZone='))
              .split('=')[1];
            uEmail = document.cookie
              .split('; ')
              .find((row) => row.startsWith('patient_email='))
              .split('=')[1];
            uPic = document.cookie
              .split('; ')
              .find((row) => row.startsWith('patient_pic='))
              .split('=')[1];
            uName = document.cookie
              .split('; ')
              .find((row) => row.startsWith('patient_name='))
              .split('=')[1];
    
            curUserID = uID;
            curUserTZ = uTime_zone;
            curUserEI = uEmail;
            curUserP = uPic;
            curUserN = uName;
          }
          else {
            document.cookie = 'patient_name=' + curUserN;
            document.cookie = 'patient_timeZone=' + curUserTZ;
            document.cookie = 'patient_uid=' + curUserID;
            document.cookie = 'patient_email=' + curUserEI;
            document.cookie = 'patient_pic=' + curUserP;
          }
          loginContext.setLoginState({
            ...loginContext.loginState,
            usersOfTA: usersOfTA,
            curUser: curUserID,
            curUserTimeZone: curUserTZ,
            curUserEmail: curUserEI,
            curUserPic: curUserP,
            curUserName: curUserN,
            ta: {
              ...loginContext.loginState.ta,
              picture: currentTaPicture
            }
          });
          console.log('timezone', curUserTZ);
          document.cookie = 'usersOfTA=' + JSON.stringify(usersOfTA); 
          console.log("usersOfTA from document cookies home ", usersOfTA)
        } else {
          console.log('No User Found');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getUserOfTA();
  }, [loginContext.loginState.reload]);
  // useEffect(() => {
  //   getUserOfTA();
  // }, []);
  console.log('list of users home', loginContext.loginState.reload);

  /*----------------------------Use states to define variables----------------------------*/
  const [signedin, setSignedIn] = useState(false);
  const [email, setEmail] = useState(taEmail);
  const [idToken, setIdToken] = useState('');
  const [taAccessToken, setTaAccessToken] = useState('');
  const [userAccessToken, setUserAccessToken] = useState('');
  const [routineID, setRoutineID] = useState('');
  const [actionID, setActionID] = useState('');
  const [getGoalsEndPoint, setGetGoalsEndPoint] = useState([]);
  const [getRoutinesEndPoint, setGetRoutinesEndPoint] = useState([]);
  const [getActionsEndPoint, setGetActionsEndPoint] = useState({});
  const [getStepsEndPoint, setGetStepsEndPoint] = useState([]);
  const [events, setEvents] = useState([]);
  const [hightlight, setHightlight] = useState('');
  const [GREButtonSelection, setGREButtonSelection] = useState('Routines');
  const [isLoading, setLoading] = useState(true);
  const [goalsOrRoutinesList, setGoalsOrRoutinesList] = useState([]);
  const [getData, setGetData] = useState("");
  // const [showUploadButton, setShowUploadButton] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [openDownloadModal, setOpenDownloadModal] = useState(false);
  const [quickEditModalVisible, setQuickEditModalVisible] = useState(false);

  const getUploadAck = (ack) => {
    setGetData(ack);
  }

  const closeQuickEditModal = () => {
    setQuickEditModalVisible(false);
  };
  
  useEffect(() => {
  //   setLoading(true)
  let getGoalOrRoutineUrl = BASE_URL + 'getroutines/';
    if (GREButtonSelection == "Goals") {
      getGoalOrRoutineUrl = BASE_URL + 'getgoals/';
    }
    axios
      .get(getGoalOrRoutineUrl + userID)
      .then((response) => {
        setLoading(false);
        console.log(
          'here: Obtained user information with res = ',
          response.data.result
        );
        console.log("txt??? getData : ", getData);
        console.log("txt??? after getData", response.data.result);

        setGoalsOrRoutinesList(response.data.result);
        GrabFireBaseRoutinesData(response);

        console.log("abc getGoalsEndPoint", getGoalsEndPoint)
        console.log("abc statavelue", stateValue.routines)
      })
  }, [getData])
  
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
    originalEvents: '', //holds the google events data in it's original JSON form
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
    showEventModal: false,
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
    showEditModal: false,
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

    ta_people_id: taID,
    emailIdObject: {},
    theCurrentUserEmail: userEmail,
    newAccountID: '',

    // versionNumber: this.getVersionNumber(),
    // date: this.getVersionDate(),
    // BASE_URL: getBaseUrl(),
    BASE_URL: BASE_URL,
  });
  const initialEditingRTSState = {
    editing: false,
    type: '',
    gr_unique_id: '',
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
      notifications: '',
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
    gr_unique_id: '',
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
      is_complete: false,
      is_in_progress: false,
      is_displayed_today: true,
      is_timed: false,
      is_sublist_available: true,
      photo: '',
      photo_url: '',
    //   notifications: '',
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
    
  const newRTSStateRoutines = {
    ...newRTSState,
    newItem : {...newRTSState.newItem, is_persistent:true, notifications:''}
  }
    
  const newRTSStateGoals = {
    ...newRTSState,
    newItem : {...newRTSState.newItem, is_persistent:false},
  }
  const initialEditingEventState = {
    editing: false,
    user_id: userID,
    theCurrentUserEmail: userEmail,
    newItem: {
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
    },
  };
  const newEditingEventState = {
    editing: true,
    user_id: userID,
    theCurrentUserEmail: userEmail,
    newItem: {
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
    },
  };
  const newEditingATSState = {
    editing: true,
    type: '',
    id: '',
    user_id: userID,
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
      photo_url: '',
    },
  };
    
  const newEditingATSStateRoutines = {
    ...newEditingATSState,
    is_persistent: true
  }
  const newEditingATSStateGoals = {
    ...newEditingATSState,
    is_persistent: false
  }
  

  const initialEditingATSState = {
    editing: false,
    type: '',
    id: '',
    user_id: userID,
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
      photo_url: '',
    },
  };
  const initialEditingISState = {
    editing: false,
    type: '',
    id: '',
    user_id: userID,
    gr_array: [],
    newItem: {
      audio: '',
      // When making API call, convert numMins to expected_completion_time
      numMins: '',
      is_available: true,
      is_complete: false,
      is_timed: false,
      photo: '',
      photo_url: '',
    },
  };

  const newEditingISState = {
    editing: true,
    type: '',
    id: '',
    user_id: userID,
    gr_array: [],
    newItem: {
      audio: '',
      // When making API call, convert numMins to expected_completion_time
      numMins: '',
      is_available: true,
      is_complete: false,
      is_timed: false,
      photo: '',
      photo_url: '',
    },
  };
  const [editingRTS, setEditingRTS] = useState(initialEditingRTSState);
  const [editingATS, setEditingATS] = useState(initialEditingATSState);
  const [editingIS, setEditingIS] = useState(initialEditingISState);
  const [editingEvent, setEditingEvent] = useState(initialEditingEventState);
  // console.log(calendarView);
  /*----------------------------Custom Hook to make styles----------------------------*/
  const useStyles = makeStyles({
    buttonSelection: {
      width: '21%',
      height: '51px',
      borderRadius: '0%',
      color: '#000000',
      marginLeft: '.5%',
      marginRight: '.5%',
      textTransform: 'capitalize',
      font: 'normal normal 600 14px Quicksand-Book',
      background: '#FFFFFF 0% 0% no-repeat padding-box',
      border: '1px solid #000000',
      borderRadius: '5px 5px 0px 0px',
    },
    buttonSelected: {
      width: '21%',
      height: '51px',
      borderRadius: '0%',
      color: '#000000',
      marginLeft: '.5%',
      marginRight: '.5%',
      textTransform: 'capitalize',
      font: 'normal normal 600 14px Quicksand-Book',
      background: '#EBEBEB 0% 0% no-repeat padding-box',
      boxShadow: 'inset 0px 3px 6px #00000029',
      borderRadius: '5px 5px 0px 0px',
    },
    addButton: {
      width: '33%',
      height: '51px',
      borderRadius: '0%',
      color: '#FFFFFF',
      marginLeft: '.5%',
      marginRight: '.5%',
      textTransform: 'capitalize',
      font: 'normal normal 600 14px Quicksand-Book',
      background: '#000000 0% 0% no-repeat padding-box',
      border: '1px solid #000000',
      borderRadius: '5px 5px 0px 0px',
    },
    addActiveButton: {
      width: '33%',
      height: '51px',
      borderRadius: '0%',
      color: '#FFFFFF',
      marginLeft: '.5%',
      marginRight: '.5%',
      textTransform: 'capitalize',
      font: 'normal normal 600 14px Quicksand-Book',
      background: '#888888 0% 0% no-repeat padding-box',
      border: '1px solid #000000',
      borderRadius: '5px 5px 0px 0px',
    },
    buttonContainer: {
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-start',
      textTransform: 'none',
    },

    dateContainer: {
      height: '61px',
      color: '#000000',
      width: '100%',
      backgroundColor: '#F2F7FC',
    },
  });

  const classes = useStyles();
  useEffect(() => {
    getAccessToken();
  }, [editingEvent.editing]);

  const getAccessToken = () => {
    let url = BASE_URL + 'taToken/';
    let ta_id = '200-000002';
    axios
      .get(url + ta_id)
      .then((response) => {
        console.log("Checking UserAccessToken in axios get response=", response)
        console.log('in events', response);
        let url =
          'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
        // loginContext.setLoginState({
        //   ...loginContext.loginState,
        //   ta: {
        //     id: '200-000002',
        //     email: response['data']['ta_email_id'],
        //   },
        // });
        setEmail(response['data']['ta_email_id']);
        setSignedIn(true);
        var old_at = response['data']['ta_google_auth_token'];
        console.log('in events', old_at);
        var refreshToken = response['data']['ta_google_refresh_token'];

        let checkExp_url = url + old_at;
        console.log('in events', checkExp_url);
        fetch(
          `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${old_at}`,
          {
            method: 'GET',
          }
        )
          .then((response) => {
            console.log('in events', response);
            console.log("Checking UserAccessToken fetch expiry url=", response)
            if (response['status'] === 400) {
              console.log('in events if');
              console.log("Checking UserAccessToken status is 400");
              let authorization_url =
                'https://accounts.google.com/o/oauth2/token';
              
              var details = {
                refresh_token: refreshToken,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'refresh_token',
              };

              var formBody = [];
              for (var property in details) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(details[property]);
                formBody.push(encodedKey + '=' + encodedValue);
              }
              formBody = formBody.join('&');

              fetch(authorization_url, {
                method: 'POST',
                headers: {
                  'Content-Type':
                    'application/x-www-form-urlencoded;charset=UTF-8',
                },
                body: formBody,
              })
                .then((response) => {
                  console.log("Checking UserAccessToken authorization url fetch1", response);
                  return response.json();
                })
                .then((responseData) => {
                  console.log("Checking UserAccessToken authorization url fetch2", responseData);
                  console.log(responseData);
                  return responseData;
                })
                .then((data) => {
                  console.log("Checking UserAccessToken authorization url fetch3", data);
                  let at = data['access_token'];
                  var id_token = data['id_token'];
                  setTaAccessToken(at);
                  setIdToken(id_token);
                  console.log('in events UpdateAccessToken Home', data);
                  let url = BASE_URL + 'UpdateAccessToken/';
                  axios
                    .post(url + ta_id, {
                      ta_google_auth_token: at,
                    })
                    .then((response) => {})
                    .catch((err) => {
                      console.log(err);
                    });
                  return taAccessToken;
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              console.log("Checking UserAccessToken access token is = ", old_at)
              setTaAccessToken(old_at);
            }
          })
          .catch((err) => {
            console.log("Checking UserAccessToken catch error1 ", err)
            console.log(err);
          });
        console.log('in events', refreshToken);
      })
      .catch((error) => {
        console.log("Checking UserAccessToken catch error2 ", error)
        console.log('Error in events' + error);
      });
  };

  /*----------------------------toggleShowRoutine----------------------------*/
  function toggleShowRoutine(props) {
    setStateValue((prevState) => {
      return {
        ...prevState,
        showRoutineModal: !stateValue.showRoutineModal,
        showEventModal: false,
        showGoalModal: false,
        showRoutineGoalModal: false,
      };
    });

    return stateValue.showRoutineModal;
  }

//   function toggleShowGoal() {
//     history.push('/goalhome');
//   }

function toggleShowGoal(props) {
    setStateValue((prevState) => {
      return {
        ...prevState,
        showRoutineModal: false,
        showEventModal: false,
        showGoalModal: !stateValue.showGoalModal,
        showRoutineGoalModal: false,
      };
    });

    return stateValue.showGoalModal;
  }
  
//   function toggleShowEvents() {
//     history.push('/events');
//   }
function toggleShowEvents(props) {
    setStateValue((prevState) => {
      return {
        ...prevState,
        showEventModal: !stateValue.showEventModal,
        showRoutineModal: false,
        showGoalModal: false,
        showRoutineGoalModal: false,
      };
    });

    return stateValue.showEventModal;
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

  const handleWeekEventClick = (A) => {
    var guestList = '';
    if (A.attendees) {
      guestList = A.attendees.reduce((guestList, nextGuest) => {
        return guestList + ' ' + nextGuest.email;
      }, '');
      console.log('Guest List:', A.attendees, guestList);
    }
    setStateValue({
      newEventID: A.id,
      newEventStart0: A.start.dateTime
        ? new Date(A.start.dateTime)
        : new Date(A.start.date),
      newEventEnd0: A.end.dateTime
        ? new Date(A.end.dateTime)
        : new Date(A.end.date),
      newEventName: A.summary,
      newEventGuests: guestList,
      newEventLocation: A.location ? A.location : '',
      newEventNotification: A.reminders.overrides
        ? A.reminders.overrides[0].minutes
        : '',
      newEventDescription: A.description ? A.description : '',
      dayEventSelected: true,
      isEvent: true,
      showNoTitleError: '',
      showDateError: '',
      showRepeatModal: false,
      showAboutModal: false,
      noteToFuture: false,
      showPeopleModal: false,
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
      showDeleteRecurringModal: false,
      deleteRecurringOption: 'This event',
      showEditModal: false,
      showEditRecurringModal: false,
      editRecurringOption: '',
    });
  };
    
  const nextDay = () => {
    let dateContext = Object.assign({}, stateValue.todayDateObject);
    console.log(dateContext);
    dateContext = moment(dateContext).add(1, 'days');
    console.log('todayDateObject', dateContext);
    console.log('todayDateObject', dateContext.toString());
    //console.log(end.toString());
    setStateValue((prevState) => {
      return {
        ...prevState,
        todayDateObject: dateContext,
        dayEvents: [],
      };
      //updateEventsArray();
    });
    console.log(stateValue.dateContext, stateValue.dayEvents);
  };

  const prevDay = () => {
    let dateContext = Object.assign({}, stateValue.todayDateObject);

    dateContext = moment(dateContext).subtract(1, 'days');
    console.log('todayDateObject', dateContext);
    console.log('todayDateObject', dateContext.toString());
    setStateValue((prevState) => {
      return {
        ...prevState,
        todayDateObject: dateContext,
        dayEvents: [],
      };
      //updateEventsArray();
    });
    console.log(stateValue.dateContext, stateValue.dayEvents);
  };

  const curDay = () => {
    let dateContext = Object.assign({}, stateValue.todayDateObject);
    let today = new Date();
    dateContext = moment(dateContext);
    console.log('today timezone curDay', dateContext);

    {
      0 <= today.getDate().toString() - dateContext.format('D') &&
      today.getDate().toString() - dateContext.format('D') <= 6 &&
      (today.getMonth() + 1).toString() - dateContext.format('M') === 0
        ? setStateValue((prevState) => {
            return {
              ...prevState,
              todayDateObject: moment(today),
              dayEvents: [],
            };
            //updateEventsArray();
          })
        : setStateValue((prevState) => {
            return {
              ...prevState,
              todayDateObject: moment(today),
              dayEvents: [],
            };
            //updateEventsArray();
          });
    }

    console.log('today timezone curDay');
  };

  const nextWeek = () => {
    let dateContext = Object.assign({}, stateValue.dateContext);
    console.log('today timezone nextWeek', dateContext);
    dateContext = moment(dateContext).add(1, 'week');
    console.log('today timezone nextWeek', dateContext);
    setStateValue((prevState) => {
      return {
        ...prevState,
        dateContext: dateContext,
        dayEvents: [],
      };
      // updateEventsArray();
    });
    console.log('today timezone nextWeek');
  };

  const prevWeek = () => {
    let dateContext = Object.assign({}, stateValue.dateContext);
    dateContext = moment(dateContext).subtract(1, 'week');
    console.log('today timezone prevWeek', dateContext);
    setStateValue((prevState) => {
      return {
        ...prevState,
        dateContext: dateContext,
        dayEvents: [],
      };
      // updateEventsArray();
    });
    console.log('today timezone prevWeek');
  };
  const curWeek = () => {
    let dateContext = Object.assign({}, stateValue.dateContext);
    let today = new Date();
    dateContext = moment(dateContext);
    console.log('today timezone curWeek', dateContext);

    {
      0 <= today.getDate().toString() - dateContext.format('D') &&
      today.getDate().toString() - dateContext.format('D') <= 6 &&
      (today.getMonth() + 1).toString() - dateContext.format('M') === 0
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

    console.log('today timezone curWeek');
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
      <Container
        style={{
          background: '#F2F7FC',
          width: '100%',
          margin: '0rem',
        }}
      >
        <Row
          noGutters={true}
          // style={{ overflowY: 'scroll', maxHeight: '1350px' }}
          className="d-flex justify-content-end"
          style={{ marginLeft: '-5rem', marginRight: '0rem' }}
        >
          <DayEvents
            dateContext={stateValue.todayDateObject}
            // eventClickDayView={handleDayEventClick}
            // handleDateClick={handleDateClickOnDayView}
            dayEvents={events}
            theCurrentUserId={userID}
            // getEventsByInterval={getEventsByIntervalDayVersion}
            timeZone={userTime_zone}
          />

          <DayRoutines
            // handleDateClick={this.handleDateClickOnDayView}
            timeZone={userTime_zone}
            dateContext={stateValue.todayDateObject}
            routine_ids={stateValue.routine_ids}
            routines={stateValue.routines}
            dayRoutineClick={toggleShowRoutine}
            theCurrentUserId={userID}
            originalGoalsAndRoutineArr={stateValue.originalGoalsAndRoutineArr}
            BASE_URL={stateValue.BASE_URL}
          />
          <DayGoals
            TimeZone={userTime_zone}
            dateContext={stateValue.todayDateObject}
            goal_ids={stateValue.goal_ids}
            goals={stateValue.goals}
            dayGoalClick={toggleShowGoal}
            theCurrentUserId={userID}
            originalGoalsAndRoutineArr={stateValue.originalGoalsAndRoutineArr}
            BASE_URL={stateValue.BASE_URL}
          />
        </Row>
      </Container>
    );
  }

  const weekViewAbstracted = () => {
    return (
      <div
        style={{
          width: '100%',
          padding: '0rem',
        }}
      >
        <Row style={{ float: 'right', width: '100%', padding: '0rem' }}>
          {/* <WeekRoutines
            timeZone={userTime_zone}
            routines={stateValue.routines}
            dateContext={stateValue.dateContext}
            BASE_URL={stateValue.BASE_URL}
            highLight={hightlight}
          /> */}
          {GREButtonSelection== 'Routines' && <WeekRoutines
            theCurrentUserID={userID}
            timeZone={userTime_zone}
            getGoalsEndPoint={getRoutinesEndPoint}
            setGetGoalsEndPoint={setGetRoutinesEndPoint}
            // getGoalsEndPoint={getGoalsEndPoint}
            // setGetGoalsEndPoint={setGetGoalsEndPoint}
            routines={stateValue.routines}
            dateContext={stateValue.dateContext}
            BASE_URL={stateValue.BASE_URL}
            highLight={hightlight}
          />}
          {GREButtonSelection== 'Goals' && <WeekRoutines
            theCurrentUserID={userID}
            timeZone={userTime_zone}
            getGoalsEndPoint={getRoutinesEndPoint}
            setGetGoalsEndPoint={setGetRoutinesEndPoint}
            // getGoalsEndPoint={getGoalsEndPoint}
            // setGetGoalsEndPoint={setGetGoalsEndPoint}
            routines={stateValue.goals}
            dateContext={stateValue.dateContext}
            BASE_URL={stateValue.BASE_URL}
            highLight={hightlight}
                />}
          {GREButtonSelection== 'Events' && <WeekEvents
            weekEvents={events}
            dateContext={stateValue.dateContext}
            eventClick={handleWeekEventClick}
            //onDayClick={handleDateClickOnWeekView}
            timeZone={userTime_zone}
          />}
        </Row>
      </div>
    );
  };

  function showCalendarView(props) {
    // if (this.state.calendarView === 'Month') return this.calendarAbstracted();
    if (stateValue.calendarView === 'Day') return dayViewAbstracted();
    else if (stateValue.calendarView === 'Week') return weekViewAbstracted();
  }

  /*----------------------------grabFireBaseRoutinesGoalData----------------------------*/
  /* useEffect() is used to render API calls as minimumly 
  as possible based on past experience, if not included 
  causes alarms and excessive rendering */
  
  function GrabFireBaseRoutinesGoalsData() {
    let url2 = BASE_URL + 'getgoalsandroutines/';
    let routine = [];
    let routine_ids = [];
    let goal = [];
    let goal_ids = [];

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
  }
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
      }
    
    useEffect(() => {
      if (userID == '') return;
      if (GREButtonSelection != "Events") return;
      console.log(
        'here: Change made to editing, re-render triggered. About to get user information, [userID, editingRTS.editing, editingATS.editing, editingIS.editing] = ',
        [userID, editingEvent.editing]
      );
        
      let url = BASE_URL + 'usersToken/';
      let user_id = userID;
      let start = stateValue.dateContext.format('YYYY-MM-DD') + 'T00:00:00-07:00';
      let endofWeek = moment(stateValue.dateContext).add(6, 'days');
      let end = endofWeek.format('YYYY-MM-DD') + 'T23:59:59-07:00';

      axios
        .get(url + user_id)
        .then((response) => {
          console.log('in events', response);

          var old_at = response['data']['google_auth_token'];
          var refreshToken = response['data']['google_refresh_token'];
          console.log('in events', old_at);
          const headers = {
            Accept: 'application/json',
            Authorization: 'Bearer ' + old_at,
          };
          const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?orderBy=startTime&singleEvents=true&timeMax=${end}&timeMin=${start}&key=${API_KEY}`;
          axios
            .get(url, {
              headers: headers,
            })
            .then((response) => {
              console.log('day events ', response.data.items);
              const temp = [];

              for (let i = 0; i < response.data.items.length; i++) {
                temp.push(response.data.items[i]);
              }
              temp.sort((a, b) => {
                // console.log('a = ', a, '\nb = ', b);
                const [a_start, b_start] = [
                  a['start']['dateTime'],
                  b['start']['dateTime'],
                ];
                console.log('a_start = ', a_start, '\nb_start = ', b_start);
                const [a_end, b_end] = [
                  a['end']['dateTime'],
                  b['end']['dateTime'],
                ];

                const [a_start_time, b_start_time] = getTimes(
                  a['start']['dateTime'],
                  b['start']['dateTime']
                );
                const [a_end_time, b_end_time] = getTimes(
                  a['end']['dateTime'],
                  b['end']['dateTime']
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

              setEvents(temp);
            })
            .catch((error) => console.log(error));
          fetch(
            `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${old_at}`,
            {
              method: 'GET',
            }
          )
            .then((response) => {
              console.log('in events', response);
              if (response['status'] === 400) {
                console.log('in events if');
                let authorization_url =
                  'https://accounts.google.com/o/oauth2/token';
                
                var details = {
                  refresh_token: refreshToken,
                  client_id: CLIENT_ID,
                  client_secret: CLIENT_SECRET,
                  grant_type: 'refresh_token',
                };

                var formBody = [];
                for (var property in details) {
                  var encodedKey = encodeURIComponent(property);
                  var encodedValue = encodeURIComponent(details[property]);
                  formBody.push(encodedKey + '=' + encodedValue);
                }
                formBody = formBody.join('&');

                fetch(authorization_url, {
                  method: 'POST',
                  headers: {
                    'Content-Type':
                      'application/x-www-form-urlencoded;charset=UTF-8',
                  },
                  body: formBody,
                })
                  .then((response) => {
                    return response.json();
                  })
                  .then((responseData) => {
                    console.log(responseData);
                    return responseData;
                  })
                  .then((data) => {
                    console.log(data);
                    let at = data['access_token'];
                    setUserAccessToken(at);
                    const headers = {
                      Accept: 'application/json',
                      Authorization: 'Bearer ' + at,
                    };
                    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?orderBy=startTime&singleEvents=true&timeMax=${end}&timeMin=${start}&key=${API_KEY}`;
                    axios
                      .get(url, {
                        headers: headers,
                      })
                      .then((response) => {
                        console.log('day events ', response.data.items);
                        const temp = [];

                        for (let i = 0; i < response.data.items.length; i++) {
                          temp.push(response.data.items[i]);
                        }
                        temp.sort((a, b) => {
                          // console.log('a = ', a, '\nb = ', b);
                          const [a_start, b_start] = [
                            a['start']['dateTime'],
                            b['start']['dateTime'],
                          ];
                          console.log(
                            'a_start = ',
                            a_start,
                            '\nb_start = ',
                            b_start
                          );
                          const [a_end, b_end] = [
                            a['end']['dateTime'],
                            b['end']['dateTime'],
                          ];

                          const [a_start_time, b_start_time] = getTimes(
                            a['start']['dateTime'],
                            b['start']['dateTime']
                          );
                          const [a_end_time, b_end_time] = getTimes(
                            a['end']['dateTime'],
                            b['end']['dateTime']
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

                        setEvents(temp);
                      })
                      .catch((error) => console.log(error));

                    console.log('in events', at);
                    let updateURL = BASE_URL + 'UpdateUserAccessToken/';
                    axios
                      .post(updateURL + user_id, {
                        google_auth_token: at,
                      })
                      .then((response) => {})
                      .catch((err) => {
                        console.log(err);
                      });
                    return;
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              } else {
                setUserAccessToken(old_at);
              }
            })
            .catch((err) => {
              console.log(err);
            });
          console.log('in events', refreshToken);
        })
        .catch((error) => {
          console.log('Error in events' + error);
        });
    }, [GREButtonSelection, userID, stateValue.dateContext, editingEvent.editing]);

  

  useEffect(() => {
    if (userID == '') return;
    if (GREButtonSelection == "Events") return;
    console.log(
      'here: Change made to editing, re-render triggered. About to get user information, [userID, editingRTS.editing, editingATS.editing, editingIS.editing] = ',
      [userID, editingRTS.editing, editingATS.editing, editingIS.editing]
    );
    let getGoalOrRoutineUrl = BASE_URL + 'getroutines/';
    if (GREButtonSelection == "Goals") {
      getGoalOrRoutineUrl = BASE_URL + 'getgoals/';
    }
    axios
      .get(getGoalOrRoutineUrl + userID)
      .then((response) => {
        setLoading(false);
        console.log(
          'here: Obtained user information with res = ',
          response.data.result
        );
        console.log("txt ??", getData);
        setGoalsOrRoutinesList(response.data.result);
        GrabFireBaseRoutinesData(response);
      })
  }, [GREButtonSelection, userID]);
  
  function GrabFireBaseRoutinesData(response) {
    console.log("txt ?? in grabfirebase");
    console.log("txt??? in grabfirebase", response);
    let routine = [];
    let routine_ids = [];
    let goal = [];
    let goal_ids = [];
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
           const temp = [];

          for (let i = 0; i < response.data.result.length; i++) {
            temp.push(response.data.result[i]);
          }
          temp.sort((a, b) => {
            const [a_start, b_start] = [
              a.gr_start_day_and_time,
              b.gr_start_day_and_time,
            ];
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

          setGetRoutinesEndPoint(temp);
          setGetGoalsEndPoint(temp);
          if (response.data.result && response.data.result.length !== 0) {
            let x = response.data.result;
            console.log('response', x);
            x.sort((a, b) => {
              let datetimeA = new Date(
                a['gr_start_day_and_time'].replace(/-/g, '/')
              );
              console.log('datetimeA', datetimeA);
              let datetimeB = new Date(
                b['gr_start_day_and_time'].replace(/-/g, '/')
              );
              console.log('datetimeB', datetimeB);
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
              gr.datetime_completed = x[i].gr_datetime_completed;
              gr.datetime_started = x[i].gr_datetime_started;
              gr.end_day_and_time = x[i].gr_end_day_and_time;
              gr.expected_completion_time = x[i].expected_completion_time;
              gr.gr_unique_id = x[i].gr_unique_id;

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
                    console.log(
                      'stateValue.ta_people_id',

                      first_notifications
                    );
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
                    console.log(
                      'stateValue.ta_people_id',
                      stateValue.ta_people_id,
                      first_notifications
                    );
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

              let filtered_notifications = [];
              for (let k = 0; k < x[i].notifications.length; ++k) {
                const first_notifications = x[i].notifications[k];
                if (first_notifications) {
                  if (first_notifications.user_ta_id.charAt(0) === '1') {
                    filtered_notifications.push(first_notifications);
                  } else if (
                    first_notifications.user_ta_id.charAt(0) === '2' &&
                    first_notifications.user_ta_id === stateValue.ta_people_id
                  ) {
                    filtered_notifications.push(first_notifications);
                  }
                }
              }
              gr.notifications = filtered_notifications;

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
              if (x[i]['is_persistent'].toLowerCase() === 'true') {
                if (
                  stateValue.calendarView === 'Day' &&
                  goalDate.getTime() > todayStartDate.getTime() &&
                  goalDate.getTime() < todayEndDate.getTime()
                ) {
                  routine_ids.push(gr['gr_unique_id']);
                  routine.push(gr);
                }
                if (
                  stateValue.calendarView === 'Week' &&
                  goalDate.getTime() > todayStartDate.getTime() &&
                  goalDate.getTime() < todayEndDate.getTime()
                ) {
                  routine_ids.push(gr['gr_unique_id']);
                  routine.push(gr);
                }
              }
              if (x[i]['is_persistent'].toLowerCase() === 'false') {

                if (
                  stateValue.calendarView === 'Day' &&
                  goalDate.getTime() > todayStartDate.getTime() &&
                  goalDate.getTime() < todayEndDate.getTime()
                ) {
                  goal_ids.push(gr['gr_unique_id']);
                  goal.push(gr);
                }
                if (
                  stateValue.calendarView === 'Week' &&
                  goalDate.getTime() > startDate.getTime() &&
                  goalDate.getTime() < endDate.getTime()
                ) {
                  goal_ids.push(gr['gr_unique_id']);
                  goal.push(gr);
                }
              }
            }
            console.log("abc routine ",routine)
            setStateValue((prevState) => {
              return {
                ...prevState,
                originalGoalsAndRoutineArr: gr_array,
                goals: goal,
                addNewGRModalShow: false,
                routine_ids: routine_ids,
                goal_ids: goal_ids,
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
            // console.log("99abcf ",routine)
            setStateValue((prevState) => {
              return {
                ...prevState,
                originalGoalsAndRoutineArr: [],
                goals: goal,
                addNewGRModalShow: false,
                routine_ids: routine_ids,
                goal_ids: goal_ids,
                routines: routine,
              };
            });
          }
  }
  useEffect(() => console.log('here: 4'), [editingRTS.editing]);

  function ToggleShowAbout() {
    history.push('/about');
  }

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
      {/* <div style={{ height: '3px' }}></div> */}
        <QuickEditModal quickEditModalVisible={quickEditModalVisible} closeQuickEditModal={closeQuickEditModal} goalsOrRoutinesList={goalsOrRoutinesList} GREButtonSelection={GREButtonSelection} getUploadAck={getUploadAck}></QuickEditModal>
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
          >
            <EditEventContext.Provider
              value={{
                editingEvent: editingEvent,
                setEditingEvent: setEditingEvent,
              }}
              stateValue={stateValue}
              setStateValue={setStateValue}
            >
              <userContext.Provider
                value={
                  (stateValue.itemToEdit,
                  stateValue.goals,
                  stateValue.originalGoalsAndRoutineArr,
                  stateValue.showRoutineModal,
                  stateValue.itemToEdit.is_available,
                  stateValue.itemToEdit.is_displayed_today,
                  stateValue.itemToEdit.is_complete,
                  stateValue.addNewGRModalShow,
                  stateValue.dateContext,
                  stateValue.closeRoutine,
                //   GrabFireBaseRoutinesGoalsData(),
                //   GrabFireBaseRoutinesData(),
                //   GetUserAcessToken(),
                  // GoogleEvents(),
                  stateValue.BASE_URL)
                }
              >
                <Box
                  style={{
                    backgroundColor: '#F2F7FC',
                    height: 'auto',
                    minHeight: '100%',
                  }}
                >
                  <div
                    style={{
                      width: '30%',
                      float: 'left',
                      backgroundColor: '#EBEBEB',
                      height: 'auto',
                      minHeight: '1440px',
                    }}
                  >
                    <MiniNavigation activeButtonSelection={"calendar"} />
                    <Row>
                    <Col xs={11}>
                    <Button
                      className={
                        GREButtonSelection === 'Events'
                          ? classes.buttonSelected
                          : classes.buttonSelection
                      }
                      style={{maxWidth: '90px'}}
                      onClick={() => {
                        toggleShowEvents();
                        getAccessToken();
                        setSignedIn(true);
                        setGREButtonSelection("Events")
                      }}
                      id="Events"
                    >
                      Events
                    </Button>
                    <Button
                      className={
                        GREButtonSelection === 'Goals'
                          ? classes.buttonSelected
                          : classes.buttonSelection
                      }
                      style={{maxWidth: '90px'}}
                      onClick={()=>{
                        toggleShowGoal()
                        setGREButtonSelection("Goals")
                      }}
                      id="Goals"
                    >
                      Goals
                    </Button>
                    <Button
                      className={
                        GREButtonSelection === 'Routines'
                          ? classes.buttonSelected
                          : classes.buttonSelection
                      }
                      style={{maxWidth: '90px'}}
                      onClick={()=>{
                        toggleShowRoutine()
                        setGREButtonSelection("Routines")
                      }}
                      id="Routines"
                    >
                      Routines
                    </Button>
                    <Button
                      className={
                        editingRTS.editing === true
                          ? classes.addActiveButton
                          : classes.addButton
                      }
                      id="one"
                      onClick={() => {
                        console.log('Clicked add RTS');
                        var RTSstate = {};
                        if(GREButtonSelection=='Routines'){
                            RTSstate = newRTSStateRoutines;
                            console.log("SET EDITING RTS STATE ***", RTSstate);
                        }
                        else if(GREButtonSelection=='Goals'){
                            RTSstate = newRTSStateGoals;
                            console.log("SET EDITING RTS STATE ***", RTSstate);
                        }
                        else if(GREButtonSelection=='Events'){
                            getAccessToken();
                            console.log('after get access token');
                            setEditingEvent(newEditingEventState);
                            console.log('after setEditingEvent');
                            setSignedIn(true);
                        }
                        setEditingRTS(RTSstate);
                        console.log("new RTS state", RTSstate );
                      }}
                    >
                      Add {`${GREButtonSelection}`} +
                    </Button>
                    <Button
                    className={classes.buttonSelected}
                    onClick={()=>{
                      console.log("printing ", goalsOrRoutinesList)
                      setQuickEditModalVisible(true)
                    }}>
                      Quick Edit
                    </Button>
                      </Col>
                      <Col style={{
                            marginLeft: '-0.5rem',
                            marginTop: '0.3rem',
                            marginBottom: '0.5rem',
                          }}
                      >
                        <Row>
                          <FaFileDownload
                            size={20}
                            style={{
                              cursor: 'pointer',
                            }}
                            icon={FaFileDownload}
                            onClick={()=>setOpenDownloadModal(true)}
                            ></FaFileDownload>                          
                    <Modal
                      show={openDownloadModal}
                      onHide={()=>setOpenDownloadModal(false)}
                    >
                      <Modal.Header>Download Goals and Routines</Modal.Header>
                      <Modal.Body>
                        <Download list={goalsOrRoutinesList} />
                      </Modal.Body>
                    </Modal>
                    </Row>
                    <Row></Row>
                        <Row
                          style={{
                          }}
                        >
                    {console.log("txt UploadCSV", goalsOrRoutinesList)}
                    
                    <FaCloudUploadAlt
                    size={20}
                    style={{
                      cursor: 'pointer',
                    }}
                    onClick={()=>setOpenUploadModal(true)}
                    ></FaCloudUploadAlt>
                    
                    <Modal
                      show={openUploadModal}
                      onHide={() => {
                        setOpenUploadModal(false);
                      }
                      }
                    >
                      <Modal.Header>Upload Goals or Routines</Modal.Header>
                      <Modal.Body>
                        <UploadCSV list={goalsOrRoutinesList} getUploadAck={getUploadAck}></UploadCSV>
                      </Modal.Body>
                      </Modal>
                      
                    </Row>
                    </Col>
                    </Row>
                      
                    <div style={{ flex: '1' }}>
                    {isLoading ?
                      (
                        <div>
                          <br></br>
                          <br></br>
                          <h1>Loading...</h1>
                        </div>
                      ): ""
                    }
                      {userID != '' && GREButtonSelection=='Routines' && (
                        <HomeLHS
                          theCurrentUserID={userID}
                          sethighLight={setHightlight}
                          highLight={hightlight}
                          setATS={setEditingATS}
                          newATS={newEditingATSStateRoutines}
                          rID={routineID}
                          setrID={setRoutineID}
                          newIS={newEditingISState}
                          setIS={setEditingIS}
                          aID={actionID}
                          setaID={setActionID}
                          editRTS={editingRTS.editing}
                          editATS={editingATS.editing}
                          editIS={editingIS.editing}
                          // getGoalsEndPoint={getRoutinesEndPoint}
                          // setGetGoalsEndPoint={setGetRoutinesEndPoint}
                          getGoalsEndPoint={getGoalsEndPoint}
                          setGetGoalsEndPoint={setGetGoalsEndPoint}
                          getActionsEndPoint={getActionsEndPoint}
                          setGetActionsEndPoint={setGetActionsEndPoint}
                          getStepsEndPoint={getStepsEndPoint}
                          setGetStepsEndPoint={setGetStepsEndPoint}
                          stateValue={stateValue}
                          setStateValue={setStateValue}
                          goalOrRoutineFlag = {GREButtonSelection}
                        />
                      )}
                     
                      {userID != '' && GREButtonSelection=='Goals' && (
                        <HomeLHS
                          theCurrentUserID={userID}
                          sethighLight={setHightlight}
                          highLight={hightlight}
                          setATS={setEditingATS}
                          newATS={newEditingATSStateGoals}
                          rID={routineID}
                          setrID={setRoutineID}
                          newIS={newEditingISState}
                          setIS={setEditingIS}
                          aID={actionID}
                          setaID={setActionID}
                          editRTS={editingRTS.editing}
                          editATS={editingATS.editing}
                          editIS={editingIS.editing}
                          // getGoalsEndPoint={getRoutinesEndPoint}
                          // setGetGoalsEndPoint={setGetRoutinesEndPoint}
                          getGoalsEndPoint={getGoalsEndPoint}
                          setGetGoalsEndPoint={setGetGoalsEndPoint}
                          getActionsEndPoint={getActionsEndPoint}
                          setGetActionsEndPoint={setGetActionsEndPoint}
                          getStepsEndPoint={getStepsEndPoint}
                          setGetStepsEndPoint={setGetStepsEndPoint}
                          stateValue={stateValue}
                          setStateValue={setStateValue}
                          goalOrRoutineFlag = {GREButtonSelection}
                        />
                      )}
                      
                      {userID != '' && GREButtonSelection=='Events' && (
                        <EventLHS
                          theCurrentUserID={userID}
                          sethighLight={setHightlight}
                          highLight={hightlight}
                          events={events}
                          setEvents={setEvents}
                          timeZone={userTime_zone}
                          editEvent={editingEvent.editing}
                          showDeleteRecurringModal={
                            stateValue.showDeleteRecurringModal
                          }
                          showEditModal={stateValue.showEditModal}
                          showEditRecurringModal={
                            stateValue.showEditRecurringModal
                          }
                          stateValue={stateValue}
                          setStateValue={setStateValue}
                          userAccessToken={userAccessToken}
                          taAccessToken={taAccessToken}
                        />
                      )}
                    </div>
                  </div>
                  <div style={{ width: '70%', float: 'left' }}>
                    {editingRTS.editing ? null : (
                      <Box className={classes.dateContainer}>
                        <Container
                          style={{
                            paddingLeft: '5rem',
                            width: '100%',
                          }}
                        >
                          {stateValue.calendarView === 'Week' ? (
                            <Row
                              style={{
                                margin: '0px',
                                width: '100%',
                                paddingBottom: '0.2rem',
                                borderBottom: '1px solid #707070',
                              }}
                            >
                              <Col
                                md="auto"
                                style={{
                                  font: 'normal normal bold 28px Quicksand-Bold',
                                  letterSpacing: '0px',
                                  color: '#000000',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                {startWeek.format('MMMM YYYY')}
                              </Col>

                              <Col
                                xs={1}
                                style={{
                                  padding: 0,
                                  display: 'flex',

                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <div>
                                  <FontAwesomeIcon
                                    style={{
                                      cursor: 'pointer',
                                      color: '#707070',
                                      marginRight: '1rem',
                                    }}
                                    icon={faChevronLeft}
                                    size="2x"
                                    onClick={(e) => {
                                      prevWeek();
                                    }}
                                  />

                                  <FontAwesomeIcon
                                    // style={{ marginLeft: "50%" }}
                                    style={{
                                      float: 'right',
                                      cursor: 'pointer',
                                      color: '#707070',
                                    }}
                                    icon={faChevronRight}
                                    size="2x"
                                    className="X"
                                    onClick={(e) => {
                                      nextWeek();
                                    }}
                                  />
                                </div>
                              </Col>
                              <Col
                                xs={1}
                                style={{
                                  padding: 0,
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                
                                <img
                                  src="/WeeklyCal.png"
                                  style={{
                                    cursor: 'pointer',
                                    width: '36px',
                                    objectFit: 'contain',
                                    verticalAlign: 'middle',
                                  }}
                                  onClick={(e) => {
                                    stateValue.calendarView === 'Week'
                                      ? setStateValue((prevState) => {
                                          return {
                                            ...prevState,
                                            calendarView: 'Day',
                                          };
                                        })
                                      : setStateValue((prevState) => {
                                          return {
                                            ...prevState,
                                            calendarView: 'Week',
                                          };
                                        });
                                  }}
                                />
                              </Col>
                              <Col
                                xs={1}
                                style={{
                                  padding: 0,
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <img
                                  src="/Today.png"
                                  style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                  onClick={(e) => {
                                    curWeek();
                                  }}
                                />
                              </Col>

                              <Col
                                style={{
                                  float: 'right',
                                  font: 'normal normal bold 18px Quicksand-Bold',
                                  letterSpacing: '0px',
                                  color: '#000000',
                                  marginRight: '1rem',
                                  display: 'flex',
                                  justifyContent: 'end',
                                  alignItems: 'center',
                                  padding: 0,
                                }}
                              >
                                {userTime_zone}
                              </Col>
                            </Row>
                          ) : (
                            <Row
                              style={{
                                margin: '0px',
                                width: '100%',
                                paddingBottom: '0.2rem',
                                borderBottom: '1px solid #707070',
                              }}
                            >
                              <Col
                                md="auto"
                                style={{
                                  textAlign: 'left',
                                  font: 'normal normal bold 28px Quicksand-Bold',
                                  letterSpacing: '0px',
                                  color: '#000000',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                {today.format('MMMM YYYY')}
                              </Col>

                              <Col
                                xs={1}
                                style={{
                                  padding: 0,
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <div>
                                  <FontAwesomeIcon
                                    style={{
                                      cursor: 'pointer',
                                      color: '#707070',
                                      marginRight: '1rem',
                                    }}
                                    icon={faChevronLeft}
                                    size="2x"
                                    onClick={(e) => {
                                      prevDay();
                                    }}
                                  />

                                  <FontAwesomeIcon
                                    // style={{ marginLeft: "50%" }}
                                    style={{
                                      float: 'right',
                                      cursor: 'pointer',
                                      color: '#707070',
                                    }}
                                    icon={faChevronRight}
                                    size="2x"
                                    className="X"
                                    onClick={(e) => {
                                      nextDay();
                                    }}
                                  />
                                </div>
                              </Col>
                              <Col
                                xs={1}
                                style={{
                                  padding: 0,
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <img
                                  src="/DailyCal.png"
                                  style={{
                                    cursor: 'pointer',
                                    width: '36px',
                                    objectFit: 'contain',
                                    verticalAlign: 'middle',
                                  }}
                                  onClick={(e) => {
                                    stateValue.calendarView === 'Week'
                                      ? setStateValue((prevState) => {
                                          return {
                                            ...prevState,
                                            calendarView: 'Day',
                                          };
                                        })
                                      : setStateValue((prevState) => {
                                          return {
                                            ...prevState,
                                            calendarView: 'Week',
                                          };
                                        });
                                  }}
                                />
                              </Col>

                              <Col
                                xs={1}
                                style={{
                                  padding: 0,
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <img
                                  src="/Today.png"
                                  style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                  onClick={(e) => {
                                    curDay();
                                  }}
                                />
                              </Col>
                              <Col
                                style={{
                                  float: 'right',
                                  font: 'normal normal bold 18px Quicksand-Bold',
                                  letterSpacing: '0px',
                                  color: '#000000',
                                  marginRight: '1rem',
                                  display: 'flex',
                                  justifyContent: 'end',
                                  alignItems: 'center',
                                  padding: 0,
                                }}
                              >
                                {userTime_zone}
                              </Col>
                            </Row>
                          )}
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
                          stateValue={stateValue}
                          setStateValue={setStateValue}
                        />
                      ) : editingATS.editing ? (
                        <EditATS
                          routineID={routineID}
                          CurrentId={userID}
                          getActionsEndPoint={getActionsEndPoint}
                          setGetActionsEndPoint={setGetActionsEndPoint}
                          getGoalsEndPoint={getGoalsEndPoint}
                          stateValue={stateValue}
                          setStateValue={setStateValue}
                        />
                      ) : editingRTS.editing ? (
                        <EditRTS
                          CurrentId={userID}
                          ta_ID={selectedUser}
                          setGetGoalsEndPoint={setGetGoalsEndPoint}
                          stateValue={stateValue}
                          setStateValue={setStateValue}
                        />
                      ) : editingEvent.editing ? (
                        <GoogleEventComponent
                          signedin={signedin}
                          setSignedIn={setSignedIn}
                          organizerEmail={email}
                          currentEmail={userEmail}
                          stateValue={stateValue}
                          setStateValue={setStateValue}
                          userAccessToken={userAccessToken}
                          taAccessToken={taAccessToken}
                          events={events}
                          setEvents={setEvents}
                        />
                      ) : stateValue.showDeleteRecurringModal ? (
                        <DeleteEventModal
                          event={stateValue.originalEvents}
                          stateValue={stateValue}
                          setStateValue={setStateValue}
                          userAccessToken={userAccessToken}
                          taAccessToken={taAccessToken}
                          events={events}
                          setEvents={setEvents}
                        />
                      ) : stateValue.showEditModal ? (
                        <EditEventModal
                          signedin={signedin}
                          setSignedIn={setSignedIn}
                          organizerEmail={email}
                          event={stateValue.originalEvents}
                          stateValue={stateValue}
                          setStateValue={setStateValue}
                          userAccessToken={userAccessToken}
                          taAccessToken={taAccessToken}
                          events={events}
                          setEvents={setEvents}
                        />
                      ) : (
                        showCalendarView()
                      )}
                    </div>
                  </div>
                </Box>
                {/* ----------------------------... Navigation--------------------------- */}

                {/* ---------------------------- Navigation--------------------------- */}
              </userContext.Provider>
            </EditEventContext.Provider>
          </EditISContext.Provider>
        </EditATSContext.Provider>
      </EditRTSContext.Provider>
    </div>
  );
}
