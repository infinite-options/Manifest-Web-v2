import React, {useEffect, useState} from 'react';
//import { useLocation } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import DayRoutines from '../Home/DayRoutines';
import {Row, Col} from 'react-bootstrap';
import FirebaseV2 from '../Home/Firebasev2';
  
const MainPage = ({ ...props})=> {
//    const { profile, setProfile } = useContext(AuthContext);
//    console.log(profile);

  
  function GetBaseUrl() {
      useEffect(() => {
        axios.get('/base_url', {}).then((response) => {
          console.log(response);
  
          setStateValue((prevState) => {
            return {
              ...prevState,
              BASE_URL: response['data'],
            };
          });
        });
      }, []);
  }

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
      calendarView: 'Day', // decides which type of calendar to display
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
      currentUserId: '100-000027',
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
  
  function GrabFireBaseRoutinesGoalsData() {
      let url = stateValue.BASE_URL + 'getgoalsandroutines/';
  
      let routine = [];
      let routine_ids = [];
      let goal = [];
      let goal_ids = [];
  
      // console.log('base url ', url);
      // console.log('base url id ', stateValue.currentUserId);
  
      useEffect(() => {
        axios
          .get(url + stateValue.currentUserId)
          .then((response) => {
            if (response.data.result && response.data.result.length !== 0) {
              let x = response.data.result;
              console.log(x);
              x.sort((a, b) => {
                // console.log(a);
                // console.log(b);
                let datetimeA = new Date(a['start_day_and_time']);
                let datetimeB = new Date(b['start_day_and_time']);
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
                gr.datetime_completed = x[i].datetime_completed;
                gr.datetime_started = x[i].datetime_started;
                gr.end_day_and_time = x[i].end_day_and_time;
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
  
                gr.start_day_and_time = x[i].start_day_and_time;
  
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
      }, []);
  }

  var onlyCal =
  !stateValue.showRoutineGoalModal &&
  // !this.state.showGoalModal &&
  !stateValue.showRoutineModal;

    
  return (
    <div className="main">
      <h1>Hello</h1>
        <Row>
            {/* <Box bgcolor="#889AB5" className={classes.dateContainer}></Box> */}
            {/* {this.grabFireBaseRoutinesGoalsData()} */}
            {/* the modal for routine/goal is called Firebasev2 currently */}
            {/* <userContext.Provider value={stateValue}> */}
            {/* {stateValue.currentUserId != "" && ( */}
            {console.log('id', stateValue.currentUserId)}
            <FirebaseV2
              BASE_URL={stateValue.BASE_URL}
              theCurrentUserID={stateValue.currentUserId}
              theCurrentTAID={stateValue.ta_people_id}
              itemToEdit={stateValue.itemToEdit}
              grabFireBaseRoutinesGoalsData={GrabFireBaseRoutinesGoalsData()}
              originalGoalsAndRoutineArr={stateValue.originalGoalsAndRoutineArr}
              // goals={stateValue.itemToEdit.goals}
              routines={stateValue.routines}
              closeRoutineGoalModal={(props) => {
                setStateValue((prevState) => {
                  return {
                    ...prevState,
                    showRoutineGoalModal: false,
                  };
                });
              }}
              showRoutineGoalModal={stateValue.showRoutineGoalModal}
              // closeGoal={() => {
              //   setStateValue((prevState) => {
              //     return {
              //       ...prevState,
              //       showGoalModal: false,
              //     };
              //   });
              // }}
              closeRoutine={() => {
                setStateValue((prevState) => {
                  return {
                    ...prevState,
                    showRoutineModal: false,
                  };
                });
              }}
              showRoutine={stateValue.showRoutineModal}
              showGoal={stateValue.showGoalModal}
              todayDateObject={stateValue.itemToEdit.todayDateObject}
              calendarView={stateValue.calendarView}
              dateContext={stateValue.itemToEdit.dateContext}
              // updateFBGR={updateFBGR}
            />
            {/* )} */}
            {/* </userContext.Provider> */}

            <Col
              style={onlyCal ? { marginLeft: '20%' } : { marginRight: 'auto' }}
              style={
                onlyCal || stateValue.currentUserId === ''
                  ? { marginLeft: '25%' }
                  : { marginRight: '10px' }
              }
            >
              {/*showCalendarView()*/}
              {/* <div>
                  V1.47.{this.state.versionNumber} {this.state.date}
                </div> */}
              {/* <div
                  style={{ marginTop: "50px", textAlign: "center" }}
                  className="fancytext"
                >
                  hi
                </div> */}
            </Col>
          </Row>
    </div>    
  );
}


export default MainPage;