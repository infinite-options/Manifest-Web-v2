import React, { useContext, useState } from 'react';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import EditRTSContext from './EditRTSContext';
import moment from 'moment';
import axios from 'axios';
import AddIconModal from '../AddIconModal';
import UploadImage from '../UploadImage';
import GooglePhotos from '../GooglePhotos';
const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;

const EditRTS = (props) => {
  const editingRTSContext = useContext(EditRTSContext);
  console.log('editrts', props, editingRTSContext.editingRTS);
  const [photo, setPhoto] = useState(
    editingRTSContext.editingRTS.newItem.gr_photo
  );

  const user = props.CurrentId;

  console.log('obj. ', editingRTSContext.editingRTS.newItem.user_id);
  const tz = {
    timeZone: props.stateValue.currentUserTimeZone,
  };
  const [showUploadImage, setShowUploadImage] = useState(false);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [imageURL, setImageURL] = useState('');

  //Wrote Code here!
  //Wrote Code here!
  const [automatic, setAutomatic] = useState(false);
  const [changeState, setState] = useState(0);
  const AUTO_NOTIF_MINUTES = 5;

  function handleAutomatic() {
    setAutomatic(!automatic);
    if (!automatic) {
      console.log('automatic is true');
      // editingRTSContext.editingRTS.newItem.user_notifications.before.is_enabled = 'True';
      // editingRTSContext.editingRTS.newItem.ta_notifications.before.is_enabled = 'True';
      // editingRTSContext.editingRTS.newItem.user_notifications.during.is_enabled = 'True';
      // editingRTSContext.editingRTS.newItem.ta_notifications.during.is_enabled = 'True';
      // editingRTSContext.editingRTS.newItem.user_notifications.after.is_enabled = 'True';
      // editingRTSContext.editingRTS.newItem.ta_notifications.after.is_enabled = 'True';
    } else {
      console.log('automatic is false');
      // editingRTSContext.editingRTS.newItem.user_notifications.before.is_enabled = 'False';
      // editingRTSContext.editingRTS.newItem.ta_notifications.before.is_enabled = 'False';
      // editingRTSContext.editingRTS.newItem.user_notifications.during.is_enabled = 'False';
      // editingRTSContext.editingRTS.newItem.ta_notifications.during.is_enabled = 'False';
      // editingRTSContext.editingRTS.newItem.user_notifications.after.is_enabled = 'False';
      // editingRTSContext.editingRTS.newItem.ta_notifications.after.is_enabled = 'False';
    }
  }
  function handleClear() {
    editingRTSContext.editingRTS.newItem.user_notifications.before.is_enabled =
      'False';
    editingRTSContext.editingRTS.newItem.ta_notifications.before.is_enabled =
      'False';
    editingRTSContext.editingRTS.newItem.user_notifications.during.is_enabled =
      'False';
    editingRTSContext.editingRTS.newItem.ta_notifications.during.is_enabled =
      'False';
    editingRTSContext.editingRTS.newItem.user_notifications.after.is_enabled =
      'False';
    editingRTSContext.editingRTS.newItem.ta_notifications.after.is_enabled =
      'False';
    editingRTSContext.editingRTS.newItem.user_notifications.before.time =
      convertMins(0);
    editingRTSContext.editingRTS.newItem.ta_notifications.before.time =
      convertMins(0);
    editingRTSContext.editingRTS.newItem.user_notifications.during.time =
      convertMins(0);
    editingRTSContext.editingRTS.newItem.ta_notifications.during.time =
      convertMins(0);
    editingRTSContext.editingRTS.newItem.user_notifications.after.time =
      convertMins(0);
    editingRTSContext.editingRTS.newItem.ta_notifications.after.time =
      convertMins(0);
    editingRTSContext.editingRTS.newItem.user_notifications.before.message = '';
    editingRTSContext.editingRTS.newItem.ta_notifications.before.message = '';
    editingRTSContext.editingRTS.newItem.user_notifications.during.message = '';
    editingRTSContext.editingRTS.newItem.ta_notifications.during.message = '';
    editingRTSContext.editingRTS.newItem.user_notifications.after.message = '';
    editingRTSContext.editingRTS.newItem.ta_notifications.after.message = '';
    setState(changeState + 1);
  }
  //Wrote Code here!
  //Wrote Code here!

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

  const convertMins = (mins) => {
    if (mins === '') return '00:00:00';
    console.log('before: mins = ', mins, ', mins / 60 = ', mins / 60);
    mins = parseInt(mins);
    console.log('after: mins = ', mins, ', mins / 60 = ', mins / 60);
    let hours = Math.floor(mins / 60);
    hours = hours < 10 ? '0' + hours : hours;
    let minutes = mins % 60;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    console.log('mins = ', mins, ', mins / 60 = ', mins / 60);
    return hours + ':' + minutes + ':00';
  };

  console.log('today timezone', editingRTSContext.editingRTS.newItem);

  const updateRTS = (e) => {
    console.log(' today timezone here: entering updateRTS function');
    console.log('today timezone timezone', tz);
    editingRTSContext.setEditingRTS({
      ...editingRTSContext.editingRTS,
      editing: true,
    });
    // editingRTSContext.editingRTS.editing = !editingRTSContext.editingRTS.editing;
    e.stopPropagation();
    let object = { ...editingRTSContext.editingRTS.newItem };
    console.log('end time', object);
    const [ta_before, ta_during, ta_after] = [
      convertMins(object.ta_notifications.before.time),
      convertMins(object.ta_notifications.during.time),
      convertMins(object.ta_notifications.after.time),
    ];
    object.ta_notifications.before.time = convertMins(
      object.ta_notifications.before.time
    );
    object.ta_notifications.during.time = convertMins(
      object.ta_notifications.during.time
    );
    object.ta_notifications.after.time = convertMins(
      object.ta_notifications.after.time
    );
    console.log('end time', object);
    object.user_notifications.before.time = convertMins(
      object.user_notifications.before.time
    );
    object.user_notifications.during.time = convertMins(
      object.user_notifications.during.time
    );
    object.user_notifications.after.time = convertMins(
      object.user_notifications.after.time
    );
    console.log('end time', object);
    console.log('log-1: ta = ', {
      before: object.ta_notifications.before.time,
      during: object.ta_notifications.during.time,
      after: object.ta_notifications.after.time,
    });
    console.log('log-2: user = ', {
      before: object.user_notifications.before.time,
      during: object.user_notifications.during.time,
      after: object.user_notifications.after.time,
    });
    object.end_day = object.start_day;
    console.log('end day', object.end_day);
    console.log('end time', object.end_time);
    // Get start_day_and_time
    console.log('end time', object);
    const start_day_and_time_simple_string = `${object.start_day} ${object.start_time}:00`;
    console.log('today timezone converted', start_day_and_time_simple_string);
    const end_day_and_time_simple_string = `${object.end_day} ${object.end_time}:00`;
    console.log('today timezone converted', end_day_and_time_simple_string);
    if (end_day_and_time_simple_string < start_day_and_time_simple_string) {
      alert(
        'Routine must not end before it starts. Update the date and/or time of the routine.'
      );
      return;
    }
    console.log('obj.start = ', start_day_and_time_simple_string);
    //const start_day_and_time_string = new Date(start_day_and_time_simple_string).toString();
    const convertedStartTime = moment(start_day_and_time_simple_string).format(
      'LTS'
    );

    object.start_day_and_time =
      `${object.start_day}` + ' ' + convertedStartTime; //start_day_and_time_string;
    object.is_displayed_today =
      object.start_day.substring(8, 10) > new Date().getDate()
        ? false
        : true || object.start_day.substring(5, 6) > new Date().getMonth()
        ? false
        : true;
    console.log(object.start_day.substring(5, 6));
    // Wrote code here!
    // Wrote code here!
    // Wrote code here!
    if (automatic) {
      console.log('True');
      editingRTSContext.editingRTS.newItem.user_notifications.before.is_enabled =
        'True';
      editingRTSContext.editingRTS.newItem.ta_notifications.before.is_enabled =
        'True';
      editingRTSContext.editingRTS.newItem.user_notifications.during.is_enabled =
        'True';
      editingRTSContext.editingRTS.newItem.ta_notifications.during.is_enabled =
        'True';
      editingRTSContext.editingRTS.newItem.user_notifications.after.is_enabled =
        'True';
      editingRTSContext.editingRTS.newItem.ta_notifications.after.is_enabled =
        'True';

      editingRTSContext.editingRTS.newItem.user_notifications.before.time =
        convertMins(AUTO_NOTIF_MINUTES);
      editingRTSContext.editingRTS.newItem.user_notifications.during.time =
        convertMins(AUTO_NOTIF_MINUTES);
      editingRTSContext.editingRTS.newItem.user_notifications.after.time =
        convertMins(AUTO_NOTIF_MINUTES);
      editingRTSContext.editingRTS.newItem.ta_notifications.before.time =
        convertMins(AUTO_NOTIF_MINUTES);
      editingRTSContext.editingRTS.newItem.ta_notifications.during.time =
        convertMins(AUTO_NOTIF_MINUTES);
      editingRTSContext.editingRTS.newItem.ta_notifications.after.time =
        convertMins(AUTO_NOTIF_MINUTES);
    }
    // Wrote code here!
    // Wrote code here!
    // Wrote code here!
    console.log(new Date().getDate());
    delete object.start_day;
    delete object.start_time;
    object.title = object.gr_title;
    delete object.gr_title;
    delete object.gr_completed;
    delete object.gr_datetime_completed;
    delete object.gr_datetime_started;
    object.photo_url = photo;
    delete object.gr_photo;
    delete object.gr_unique_id;
    //object.id = Number(object.id);
    delete object.location;
    delete object.notification;
    // object.is_available = 'True';
    // Get end_day_and_time

    //const end_day_and_time_string = new Date(end_day_and_time_simple_string).toString();
    const convertedEndTime = moment(end_day_and_time_simple_string).format(
      'LTS'
    );
    console.log('end time', object);
    console.log('convertedEndTime', convertedEndTime);
    object.end_day_and_time = `${object.end_day}` + ' ' + convertedEndTime;

    delete object.end_day;
    delete object.end_time;
    // Get expected_completion_time
    const numHours =
      object.numMins >= 60 ? Math.floor(object.numMins / 60) : '00';
    let numMins = object.numMins % 60;
    if (numMins < 10) numMins = '0' + numMins;
    console.log(numHours);
    object.expected_completion_time = `${numHours}:${numMins}:00`;
    delete object.numMins;
    object.gr_unique_id = editingRTSContext.editingRTS.id;
    object.user_id = props.CurrentId; // editingRTSContext.editingRTS.currentUserId;
    object.ta_people_id = props.ta_ID;
    object.photo = image;
    delete object.photo;
    // if (image != null) {
    //   console.log('trying to upload',image)
    //   object.photo = image
    //   object.photo_url = null
    // }

    console.log('obj ****************', object);
    if (object.repeat == "True" && object.repeat_type == "") {
      console.log('obj has no repeat type')
      alert(
        'Recurring routine must have Ends On information.'
      );
      return;
    }
    if (object.repeat_type == "Occur" && object.repeat_occurences == "")
      {
        console.log('obj has no repeat occurrences')
        alert(
          'Please mention the number of Ocurrences after which the Routine should end.'
        );
        return;
      }
    if (object.repeat_type == "On" && object.repeat_ends_on == "")
      {
        console.log('obj has no repeat_ends_on date')
        alert(
          'Please mention the date this Routine should end on.'
        );
        return;
      }
    let formData = new FormData();
    Object.entries(object).forEach((entry) => {
      console.log('test-entry: ', entry);
      // if (typeof entry[1].name == 'string'){
      if (typeof entry[1] == 'string') {
        formData.append(entry[0], entry[1]);
      } else if (entry[1] instanceof Object) {
        entry[1] = JSON.stringify(entry[1]);
        formData.append(entry[0], entry[1]);
      } else {
        formData.append(entry[0], entry[1]);
      }
    });
    console.log('photo: ', image);
    formData.append('photo', image);

    console.log('===================formData: for RTS=======================');
    for (var pair of formData.entries()) {
      console.log('formData: ', pair);
    }
    console.log('object.id');
    console.log(object.gr_unique_id);
    let getGoalOrRoutineUrl = '';
    if (object.is_persistent == 'True') {
      getGoalOrRoutineUrl = 'getroutines/';
    } else {
      getGoalOrRoutineUrl = 'getgoals/';
    }
    console.log('url', getGoalOrRoutineUrl, object.is_persistent);
    console.log(object.gr_unique_id);
    if (object.gr_unique_id != '' && object.gr_unique_id != undefined) {
      console.log('updateGR');
      console.log('here: About to post changes to db');
      async function updateDB() {
        await axios
          .post(BASE_URL + 'updateGR', formData)
          .then((_) => {
            console.log('editrts 1', _);
            const gr_array_index =
              editingRTSContext.editingRTS.gr_array.findIndex(
                (elt) =>
                  elt.gr_unique_id === editingRTSContext.editingRTS.gr_unique_id
              );
            const new_gr_array = [...editingRTSContext.editingRTS.gr_array];
            new_gr_array[gr_array_index] = object;
            console.log('here: Changes made to db');
            editingRTSContext.setEditingRTS({
              ...editingRTSContext.editingRTS,
              gr_array: new_gr_array,
              editing: false,
            });
          })
          .catch((err) => {
            if (err.response) {
              console.log(err.response);
            }
            console.log(err);
          });
          
        await axios
          .get(BASE_URL + getGoalOrRoutineUrl + props.CurrentId)
          .then((response) => {
            const temp = [];
            let routine = [];
            let routine_ids = [];
            let goal = [];
            let goal_ids = [];

            for (var i = 0; i < response.data.result.length; i++) {
              temp.push(response.data.result[i]);
            }
            temp.sort((a, b) => {
              const [a_start, b_start] = [
                new Date(a.gr_start_day_and_time),
                new Date(b.gr_start_day_and_time),
              ];
              const [a_end, b_end] = [
                new Date(a.gr_end_day_and_time),
                new Date(b.gr_end_day_and_time),
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
            // console.log("99ab  - ", temp);
            props.setGetGoalsEndPoint(temp);

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
                      first_notifications.user_ta_id === props.stateValue.ta_people_id
                    ) {
                      console.log(
                        'props.stateValue.ta_people_id',
                        props.stateValue.ta_people_id,
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
                      first_notifications.user_ta_id === props.stateValue.ta_people_id
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
                  props.stateValue.calendarView === 'Day' &&
                  goalDate.getTime() > todayStartDate.getTime() &&
                  goalDate.getTime() < todayEndDate.getTime()
                ) {
                  gr_array.push(gr);
                }
                if (
                  props.stateValue.calendarView === 'Week' &&
                  goalDate.getTime() > startDate.getTime() &&
                  goalDate.getTime() < endDate.getTime()
                ) {
                  gr_array.push(gr);
                }
                if (x[i]['is_persistent'].toLowerCase() === 'true') {
                  if (
                    props.stateValue.calendarView === 'Day' &&
                    goalDate.getTime() > todayStartDate.getTime() &&
                    goalDate.getTime() < todayEndDate.getTime()
                  ) {
                    routine_ids.push(gr['gr_unique_id']);
                    routine.push(gr);
                  }
                  if (
                    props.stateValue.calendarView === 'Week' &&
                    goalDate.getTime() > todayStartDate.getTime() &&
                    goalDate.getTime() < todayEndDate.getTime()
                  ) {
                    routine_ids.push(gr['gr_unique_id']);
                    routine.push(gr);
                  }
                }
                if (x[i]['is_persistent'].toLowerCase() === 'false') {
  
                  if (
                    props.stateValue.calendarView === 'Day' &&
                    goalDate.getTime() > todayStartDate.getTime() &&
                    goalDate.getTime() < todayEndDate.getTime()
                  ) {
                    goal_ids.push(gr['gr_unique_id']);
                    goal.push(gr);
                  }
                  if (
                    props.stateValue.calendarView === 'Week' &&
                    goalDate.getTime() > startDate.getTime() &&
                    goalDate.getTime() < endDate.getTime()
                  ) {
                    goal_ids.push(gr['gr_unique_id']);
                    goal.push(gr);
                  }
                }
              }
              console.log("abc routine ",routine)
              props.setStateValue((prevState) => {
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
              // editingRTSContext.setEditingRTS({
              //   ...editingRTSContext.editingRTS,
              //   gr_array: gr_array,
              // });
              
              // setEditingATS({
              //   ...editingATS,
              //   gr_array: gr_array,
              // });
            } else {
              // console.log("99abcf ",routine)
              props.setStateValue((prevState) => {
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
          })
          .catch((error) => {
            console.log(error);
          });
      }

      updateDB();
    } else {
      console.log('addGR');
      let getGoalOrRoutineUrl = '';
      if (object.is_persistent) {
        getGoalOrRoutineUrl = 'getroutines/';
      } else {
        getGoalOrRoutineUrl = 'getgoals/';
      }
      console.log('url', getGoalOrRoutineUrl, typeof object.is_persistent);
      const addToDB = async () => {
        await axios
          .post(BASE_URL + 'addGR', formData)
          .then((_) => {
            console.log(_);
            const gr_array_index =
              editingRTSContext.editingRTS.gr_array.findIndex(
                (elt) =>
                  elt.gr_unique_id === editingRTSContext.editingRTS.gr_unique_id
              );
            const new_gr_array = [...editingRTSContext.editingRTS.gr_array];
            new_gr_array[gr_array_index] = object;
            editingRTSContext.setEditingRTS({
              ...editingRTSContext.editingRTS,
              gr_array: new_gr_array,
              editing: false,
            });
          })
          .catch((err) => {
            if (err.response) {
              console.log(err.response);
            }
          });

        await axios
          .get(BASE_URL + getGoalOrRoutineUrl + props.CurrentId)
          .then((response) => {
            const temp = [];

            for (var i = 0; i < response.data.result.length; i++) {
              temp.push(response.data.result[i]);
            }
            temp.sort((a, b) => {
              const [a_start, b_start] = [
                new Date(a.gr_start_day_and_time),
                new Date(b.gr_start_day_and_time),
              ];
              const [a_end, b_end] = [
                new Date(a.gr_end_day_and_time),
                new Date(b.gr_end_day_and_time),
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
            props.setGetGoalsEndPoint(temp);
          })
          .catch((error) => {
            console.log(error);
          });
      };

      addToDB();
    }
  };

  const uploadImageModal = () => {
    return (
      <Modal
        show={showUploadImage}
        onHide={() => {
          setShowUploadImage(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload Image</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div>Upload Image</div>
          <input
            type="file"
            onChange={(e) => {
              console.log('here: selecting image');
              if (e.target.files[0]) {
                const image1 = e.target.files[0];
                // console.log(image1.name);
                console.log('image1 = ', image1);
                setImage(image1);
              }
            }}
          />
          <Button
            variant="dark"
            onClick={() => {
              console.log('here: uploading image');
              if (image === null) {
                alert('Please select an image to upload');
                return;
              }
              const salt = Math.floor(Math.random() * 9999999999);
              let image_name = image.name;
              image_name = image_name + salt.toString();
              setImageName(image_name);
              setImageURL(URL.createObjectURL(image));
              console.log('xxx URL: ', URL.createObjectURL(image));
              editingRTSContext.setEditingRTS({
                ...editingRTSContext.editingRTS,
                newItem: {
                  ...editingRTSContext.editingRTS.newItem,
                  photo: image,
                  photo_url: '',
                },
              });
              console.log(
                'xxx RTS photo',
                editingRTSContext.editingRTS.newItem.photo
              );
            }}
          >
            Upload
          </Button>
          <img
            src={imageURL || 'http://via.placeholder.com/400x300'}
            alt="Uploaded images"
            height="300"
            width="400"
          />
          {console.log(
            'xxx RTS photo',
            editingRTSContext.editingRTS.newItem.photo
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowUploadImage(false);
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              console.log('here: Confirming changes');
              setPhoto(imageURL);
              setShowUploadImage(false);
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <div
      style={{
        marginTop: '1rem',
        marginLeft: '2rem',
        //marginRight: '3rem',
        width: '90%',
        //backgroundColor: '#F57045',
        backgroundColor: (() => {
          if (
            editingRTSContext.editingRTS.newItem.is_persistent === true ||
            editingRTSContext.editingRTS.newItem.is_persistent === 'true' ||
            editingRTSContext.editingRTS.newItem.is_persistent === 'True'
          ) {
            return '#FFB84D';
          } else if (
            editingRTSContext.editingRTS.newItem.is_persistent === false ||
            editingRTSContext.editingRTS.newItem.is_persistent === 'false' ||
            editingRTSContext.editingRTS.newItem.is_persistent === 'False'
          ) {
            return '#00BC00';
          } else {
            return '#FFB84D';
          }
        })(),
        color: '#000000',
      }}
    >
      {uploadImageModal()}
      <Container
        style={{
          paddingLeft: '1rem',
          paddingTop: '1rem',

          width: '100%',
        }}
      >
        <Col style={{ float: 'left', width: '30%' }}>
          <div style={{ fontWeight: 'bold', fontSize: '20px' }}>
            {editingRTSContext.editingRTS.is_persistent === 'True' ||
            editingRTSContext.editingRTS.is_persistent === true
              ? 'Routine'
              : 'Goal'}{' '}
            &nbsp;Name
          </div>
          <input
            style={{
              borderRadius: '10px',
              border: 'none',
              width: '100%',
              marginTop: '20px',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
            value={editingRTSContext.editingRTS.newItem.gr_title}
            onChange={(e) => {
              editingRTSContext.setEditingRTS({
                ...editingRTSContext.editingRTS,
                newItem: {
                  ...editingRTSContext.editingRTS.newItem,
                  gr_title: e.target.value,
                },
              });
            }}
          />

          <div
            style={{
              fontWeight: 'bold',
              fontSize: '20px',
              marginTop: '20px',
              marginBottom: '20px',
            }}
          >
            Change Icon
          </div>

          <Row>
            <Col
              xs={8}
              style={{
                width: '100%',
                float: 'left',
                fontSize: '14px',
                textAlign: 'left',
                textDecoration: 'underline',
              }}
            >
              <div
                onClick={() => {
                  setShowUploadImage(!showUploadImage);
                }}
                style={{
                  marginLeft: '12px',
                  cursor: 'pointer',
                }}
              >
                Upload from Computer
              </div>
              <AddIconModal
                photoUrl={photo}
                setPhotoUrl={setPhoto}
                //  BASE_URL={props.BASE_URL}
                //  parentFunction={setPhotoURLFunction}
              />
              {/* <div>Use icon from library</div> */}
              {/* <div>User's library</div> */}
              <UploadImage
                //  BASE_URL={props.BASE_URL}
                //  parentFunction={setPhotoURLFunction}
                photoUrl={photo}
                setPhotoUrl={setPhoto}
                currentUserId={user}
              />
              <GooglePhotos photoUrl={photo} setPhotoUrl={setPhoto} />
            </Col>
            <Col style={{ float: 'right' }} xs={4}>
              <img alt="icon" src={photo} style={{ width: '100%' }} />
            </Col>
          </Row>

          <div style={{ fontWeight: 'bold', fontSize: '20px' }}>Start Time</div>
          <Container>
            <Row>
              <Col
                //sm={6}
                style={{
                  margin: '0',
                  padding: '0',
                  width: '50%',
                }}
              >
                <input
                  style={{
                    width: '100%',
                    borderRadius: '10px',
                    border: 'none',
                    height: '26px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  type="date"
                  value={editingRTSContext.editingRTS.newItem.start_day}
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        start_day: e.target.value,
                      },
                    });
                  }}
                />
              </Col>
              <Col
                //sm={6}
                style={{
                  margin: '0',
                  paddingRight: '0',
                  width: '50%',
                }}
              >
                <input
                  style={{
                    width: '100%',
                    borderRadius: '10px',
                    border: 'none',
                    height: '26px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  type="time"
                  value={editingRTSContext.editingRTS.newItem.start_time}
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        start_time: e.target.value,
                      },
                    });
                  }}
                />
                {console.log(
                  'today timezone',
                  editingRTSContext.editingRTS.newItem.start_time
                )}
              </Col>
            </Row>
          </Container>
          <div
            style={{ fontWeight: 'bold', fontSize: '20px', marginTop: '10px' }}
          >
            This Takes Me
          </div>
          <div>
            <input
              type="number"
              style={{
                borderRadius: '10px',
                border: 'none',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
              value={editingRTSContext.editingRTS.newItem.numMins}
              onChange={(e) => {
                if (e.target.value < 0) return;
                editingRTSContext.setEditingRTS({
                  ...editingRTSContext.editingRTS,
                  newItem: {
                    ...editingRTSContext.editingRTS.newItem,
                    numMins: e.target.value,
                  },
                });
              }}
            />
            <span style={{ fontSize: '20px' }}> Minutes </span>
          </div>
          <div
            style={{ fontWeight: 'bold', fontSize: '20px', marginTop: '10px' }}
          >
            End Time
          </div>
          <Container>
            <Row>
              <Col
                //sm={7}
                style={{
                  margin: '0',
                  padding: '0',
                  width: '50%',
                }}
              >
                <input
                  style={{
                    width: '100%',
                    borderRadius: '10px',
                    border: 'none',
                    height: '26px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  type="date"
                  value={editingRTSContext.editingRTS.newItem.start_day}
                  onChange={(e) => {
                    // const year = parseInt(e.target.value.substring(0, 4));
                    // if (
                    //   e.target.value <
                    //     editingRTSContext.editingRTS.newItem.start_day &&
                    //   year > 1000
                    // )
                    //   return;
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        end_day: editingRTSContext.editingRTS.newItem.start_day,
                      },
                    });
                  }}
                />
              </Col>
              <Col
                //sm={5}
                style={{
                  margin: '0',
                  paddingRight: '0',
                  width: '50%',
                }}
              >
                <input
                  style={{
                    width: '100%',
                    borderRadius: '10px',
                    border: 'none',
                    height: '26px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  type="time"
                  value={editingRTSContext.editingRTS.newItem.end_time}
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        end_time: e.target.value,
                      },
                    });
                  }}
                />
              </Col>
            </Row>
          </Container>
        </Col>
        <div
          style={{
            float: 'left',
            backgroundColor: '#000000',
            width: '2px',
            height: '500px',
            marginLeft: '2.4%',
            marginRight: '2.4%',
          }}
        />
        <Col style={{ float: 'left', width: '30%' }}>
          <Row style={{ fontWeight: 'bold', fontSize: '20px' }}>
            Repeating Options
          </Row>

          <Row
            style={{
              padding: '10px 0 0 0',
            }}
          >
            <Col style={{ margin: '10px 0' }}>
              <Row style={{ marginBottom: '20px', verticalAlign: 'middle' }}>
                <div style={{ width: '20%', float: 'left' }}></div>
                <div style={{ width: '80%', float: 'left' }}>
                  <div
                    style={{ width: '100%' }}
                    onClick={() => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          repeat: !editingRTSContext.editingRTS.newItem.repeat,
                          repeat_type: '',
                        },
                      });
                    }}
                  >
                    <input
                      type="radio"
                      style={{
                        width: '10%',
                        height: '20px',
                        borderRadius: '10px',
                        float: 'left',
                      }}
                      checked={
                        editingRTSContext.editingRTS.newItem.repeat ===
                          'False' ||
                        editingRTSContext.editingRTS.newItem.repeat === false
                      }
                    />
                    <div
                      style={{
                        marginLeft: '2%',
                        minWidth: '82%',
                        float: 'left',
                      }}
                    >
                      Does not repeat
                    </div>
                  </div>
                </div>

                {/* Does not repeat */}
                {console.log(
                  'repeat value =',
                  editingRTSContext.editingRTS.newItem.repeat
                )}
                {/* {editingRTSContext.editingRTS.newItem.repeat == 'False' ? (
                    <input
                    name='repeating'
                    id='repeating'
                    type='checkbox'
                    //type='radio'
                    defaultChecked  = 'true'
                    //checked={editingRTSContext.editingRTS.newItem.repeat=== 'False'}
                    style={{width: '20px', height: '20px', marginLeft: '10px', borderRadius: '50%'}}
                    onChange={(e) => {
                      console.log('in false')
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          repeat: !e.target.checked
                        }
                      })
                    }}
                  />
                  ) : (
                    <input
                    name='repeating'
                    id='repeating'
                    type='checkbox'
                    //type='radio'
                    // checked={editingRTSContext.editingRTS.newItem.repeat}
                    style={{width: '20px', height: '20px', marginLeft: '10px', borderRadius: '50%'}}
                    onChange={(e) => {
                      console.log('in true')
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          repeat: !e.target.checked
                        }
                      })
                    }}
                  />
                  )} */}

                {/* <input
                    name='repeating'
                    type='checkbox'
                    defaultChecked={editingRTSContext.editingRTS.newItem.repeat}
                    style={{width: '20px', height: '20px', marginLeft: '10px'}}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          repeat: e.target.checked
                        }
                      })
                    }}
                  /> */}
              </Row>
              <Row style={{ verticalAlign: 'middle' }}>
                <div
                  style={{
                    float: 'left',
                    marginRight: '8px',
                    display: 'inline-block',
                  }}
                >
                  Repeat Every
                </div>
                <div
                  style={{
                    float: 'left',
                    marginRight: '8px',
                    display: 'inline-block',
                  }}
                >
                  <input
                    type="number"
                    style={{
                      width: '60px',
                      margin: '0px 0',
                      borderRadius: '10px',
                      border: 'none',
                      float: 'left',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                    value={
                      editingRTSContext.editingRTS.newItem.repeat === 'False' ||
                      editingRTSContext.editingRTS.newItem.repeat === false
                        ? 1
                        : editingRTSContext.editingRTS.newItem.repeat_every
                    }
                    onChange={(e) => {
                      if (
                        (e.target.value !== '' && e.target.value < 1) ||
                        editingRTSContext.editingRTS.newItem.repeat ===
                          'False' ||
                        editingRTSContext.editingRTS.newItem.repeat === false
                      )
                        return;
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          repeat_every: e.target.value,
                        },
                      });
                    }}
                  />
                </div>

                <div
                  style={{
                    float: 'left',
                    marginRight: '8px',
                    display: 'inline-block',
                  }}
                >
                  Days
                </div>
              </Row>

              <Row style={{ marginTop: '20px', verticalAlign: 'middle' }}>
                <div style={{ float: 'left', width: '20%' }}> Ends </div>
                <div style={{ float: 'left', width: '80%' }}>
                  <div
                    style={{
                      verticalAlign: 'middle',
                      width: '100%',
                      height: '30%',
                      marginBottom: '3%',
                    }}
                  >
                    <input
                      name="repeatingEnd"
                      type="radio"
                      style={{
                        width: '10%',
                        height: '20px',
                        borderRadius: '10px',
                        float: 'left',
                      }}
                      value="On"
                      checked={
                        editingRTSContext.editingRTS.newItem.repeat_type ===
                        'On'
                      }
                      onChange={(e) => {
                        editingRTSContext.setEditingRTS({
                          ...editingRTSContext.editingRTS,
                          newItem: {
                            ...editingRTSContext.editingRTS.newItem,
                            repeat_type: e.target.value,
                            repeat: 'True',
                          },
                        });
                      }}
                    />

                    <div
                      style={{
                        float: 'left',
                        marginLeft: '2%',
                        marginRight: '2%',
                        width: '16%',
                      }}
                    >
                      On
                    </div>

                    <input
                      style={{
                        borderRadius: '10px',
                        border: 'none',
                        width: '70%',
                        float: 'left',
                        height: '26px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                      type="date"
                      value={
                        editingRTSContext.editingRTS.newItem.repeat_ends_on
                      }
                      onChange={(e) => {
                        editingRTSContext.setEditingRTS({
                          ...editingRTSContext.editingRTS,
                          newItem: {
                            ...editingRTSContext.editingRTS.newItem,
                            repeat_ends_on: e.target.value,
                          },
                        });
                      }}
                    />
                  </div>

                  <div
                    style={{
                      verticalAlign: 'middle',
                      width: '100%',
                      height: '30%',
                      marginBottom: '3%',
                    }}
                  >
                    <input
                      style={{
                        borderRadius: '10px',
                        border: 'none',
                        marginRight: '2%',
                        float: 'left',
                        width: '10%',
                        height: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                      name="repeatingEnd"
                      type="radio"
                      value="Occur"
                      checked={
                        editingRTSContext.editingRTS.newItem.repeat_type ===
                        'Occur'
                      }
                      onChange={(e) => {
                        editingRTSContext.setEditingRTS({
                          ...editingRTSContext.editingRTS,
                          newItem: {
                            ...editingRTSContext.editingRTS.newItem,
                            repeat_type: e.target.value,
                            repeat: 'True',
                          },
                        });
                      }}
                    />
                    {console.log(
                      'newItem: ',
                      editingRTSContext.editingRTS.newItem
                    )}
                    <div style={{ float: 'left', width: '20%' }}>After</div>
                    <input
                      style={{
                        width: '20%',
                        borderRadius: '10px',
                        border: 'none',
                        marginLeft: '2%',
                        float: 'left',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                      type="number"
                      value={
                        editingRTSContext.editingRTS.newItem.repeat ==='False' ||
                        editingRTSContext.editingRTS.newItem.repeat === false 
                        // || editingRTSContext.editingRTS.newItem.repeat === 'Occur'
                          ? 1
                          : editingRTSContext.editingRTS.newItem
                              .repeat_occurences
                      }
                      onChange={(e) => {
                        if (
                          (e.target.value !== '' && e.target.value < 1) ||
                          editingRTSContext.editingRTS.newItem.repeat ===
                            'False' ||
                          editingRTSContext.editingRTS.newItem.repeat === false
                        )
                        return;

                        editingRTSContext.setEditingRTS({
                          ...editingRTSContext.editingRTS,
                          newItem: {
                            ...editingRTSContext.editingRTS.newItem,
                            repeat_occurences: e.target.value,
                          },
                        });
                      }}
                    />
                    <div
                      style={{ marginLeft: '2%', width: '44%', float: 'left' }}
                    >
                      Occurences
                    </div>
                  </div>
                  <div
                    style={{
                      verticalAlign: 'middle',
                      width: '100%',
                      height: '30%',
                      marginBottom: '3%',
                    }}
                  >
                    <input
                      style={{
                        borderRadius: '10px',
                        width: '10%',
                        height: '20px',
                        marginRight: '2%',
                        float: 'left',
                      }}
                      name="repeatingEnd"
                      type="radio"
                      value="Never"
                      checked={
                        editingRTSContext.editingRTS.newItem.repeat_type ===
                        'Never'
                      }
                      onChange={(e) => {
                        editingRTSContext.setEditingRTS({
                          ...editingRTSContext.editingRTS,
                          newItem: {
                            ...editingRTSContext.editingRTS.newItem,
                            repeat_type: e.target.value,
                            repeat: 'True',
                          },
                        });
                      }}
                    />
                    <div style={{ float: 'left', width: '88%' }}>
                      Never Ends
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '40px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '20px' }}>
                    Location
                  </div>
                  <input
                    style={{
                      margin: '5px 0',
                      borderRadius: '10px',
                      border: 'none',
                      width: '100%',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                    value={editingRTSContext.editingRTS.newItem.location}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          location: e.target.value,
                        },
                      });
                    }}
                  />
                  <span> Available to User </span>
                  {console.log(
                    'is_avail? ',
                    editingRTSContext.editingRTS.newItem.is_available
                  )}
                  {(editingRTSContext.editingRTS.newItem.is_available ===
                    'True' ||
                    editingRTSContext.editingRTS.newItem.is_available ===
                      true) &&
                  (editingRTSContext.editingRTS.newItem.is_displayed_today ===
                    'True' ||
                    editingRTSContext.editingRTS.newItem.is_displayed_today ===
                      true) ? (
                    <input
                      type="checkbox"
                      style={{ width: '20px', height: '20px' }}
                      defaultChecked="true"
                      onChange={(e) => {
                        editingRTSContext.setEditingRTS({
                          ...editingRTSContext.editingRTS,
                          newItem: {
                            ...editingRTSContext.editingRTS.newItem,
                            is_available: e.target.checked,
                          },
                        });
                      }}
                    />
                  ) : (
                    <input
                      type="checkbox"
                      style={{ width: '20px', height: '20px' }}
                      onChange={(e) => {
                        editingRTSContext.setEditingRTS({
                          ...editingRTSContext.editingRTS,
                          newItem: {
                            ...editingRTSContext.editingRTS.newItem,
                            is_available: e.target.checked,
                          },
                        });
                      }}
                    />
                  )}
                </div>
              </Row>
            </Col>
          </Row>
        </Col>
        <div
          style={{
            float: 'left',
            backgroundColor: '#000000',
            width: '2px',
            height: '500px',
            marginLeft: '2.4%',
            marginRight: '2.4%',
          }}
        />
        <Col style={{ float: 'left', width: '29%' }}>
          <Row style={{ fontWeight: 'bold', fontSize: '20px' }}>
            Notification
          </Row>

          <Row
            style={{
              padding: '10px 0 0 0',
            }}
          >
            <Row>
              <div
                style={{
                  margin: '10px 0',
                  marginLeft: '20px',
                }}
              >
                <input
                  type="number"
                  style={{
                    width: '60px',
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  value={
                    editingRTSContext.editingRTS.newItem.ta_notifications.before
                      .time
                  }
                  onChange={(e) => {
                    if (e.target.value < 0) return;
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        ta_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .ta_notifications,
                          before: {
                            ...editingRTSContext.editingRTS.newItem
                              .ta_notifications.before,
                            time: e.target.value,
                          },
                        },
                        user_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .user_notifications,
                          before: {
                            ...editingRTSContext.editingRTS.newItem
                              .user_notifications.before,
                            time: e.target.value,
                          },
                        },
                      },
                    });
                  }}
                />
                &nbsp; Mins Before Start Time
              </div>
              <div
                style={{
                  margin: '10px 0',
                  marginLeft: '20px',
                }}
              >
                User &nbsp;
                <input
                  type="checkbox"
                  style={{ width: '20px', height: '20px' }}
                  checked={
                    editingRTSContext.editingRTS.newItem.user_notifications
                      .before.is_enabled !== 'False' &&
                    editingRTSContext.editingRTS.newItem.user_notifications
                      .before.is_enabled !== false
                  }
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        user_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .user_notifications,
                          before: {
                            ...editingRTSContext.editingRTS.newItem
                              .user_notifications.before,
                            is_enabled: e.target.checked,
                            is_set: e.target.checked,
                          },
                        },
                      },
                    });
                  }}
                />
                &nbsp;
                <input
                  style={{
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  value={
                    editingRTSContext.editingRTS.newItem.user_notifications
                      .before.message
                  }
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        user_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .user_notifications,
                          before: {
                            ...editingRTSContext.editingRTS.newItem
                              .user_notifications.before,
                            message: e.target.value,
                          },
                        },
                      },
                    });
                  }}
                />
              </div>
              <div
                style={{
                  margin: '10px 0',
                  marginLeft: '20px',
                }}
              >
                TA &nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  type="checkbox"
                  style={{ width: '20px', height: '20px' }}
                  checked={
                    editingRTSContext.editingRTS.newItem.ta_notifications.before
                      .is_enabled !== 'False' &&
                    editingRTSContext.editingRTS.newItem.ta_notifications.before
                      .is_enabled !== false
                  }
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        ta_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .ta_notifications,
                          before: {
                            ...editingRTSContext.editingRTS.newItem
                              .ta_notifications.before,
                            is_enabled: e.target.checked,
                            is_set: e.target.checked,
                          },
                        },
                      },
                    });
                  }}
                />
                &nbsp;
                <input
                  style={{
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  value={
                    editingRTSContext.editingRTS.newItem.ta_notifications.before
                      .message
                  }
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        ta_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .ta_notifications,
                          before: {
                            ...editingRTSContext.editingRTS.newItem
                              .ta_notifications.before,
                            message: e.target.value,
                          },
                        },
                      },
                    });
                  }}
                />
              </div>
            </Row>
            <Row>
              <div
                style={{
                  margin: '10px 0',
                  marginLeft: '20px',
                }}
              >
                <input
                  type="number"
                  style={{
                    width: '60px',
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  value={
                    editingRTSContext.editingRTS.newItem.ta_notifications.during
                      .time
                  }
                  onChange={(e) => {
                    if (e.target.value < 0) return;
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        ta_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .ta_notifications,
                          during: {
                            ...editingRTSContext.editingRTS.newItem
                              .ta_notifications.during,
                            time: e.target.value,
                          },
                        },
                        user_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .user_notifications,
                          during: {
                            ...editingRTSContext.editingRTS.newItem
                              .user_notifications.during,
                            time: e.target.value,
                          },
                        },
                      },
                    });
                  }}
                />
                &nbsp; Mins After Start Time
              </div>
              <div
                style={{
                  margin: '10px 0',
                  marginLeft: '20px',
                }}
              >
                User &nbsp;
                <input
                  type="checkbox"
                  style={{ width: '20px', height: '20px' }}
                  checked={
                    editingRTSContext.editingRTS.newItem.user_notifications
                      .during.is_enabled !== 'False' &&
                    editingRTSContext.editingRTS.newItem.user_notifications
                      .during.is_enabled !== false
                  }
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        user_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .user_notifications,
                          during: {
                            ...editingRTSContext.editingRTS.newItem
                              .user_notifications.during,
                            is_enabled: e.target.checked,
                            is_set: e.target.checked,
                          },
                        },
                      },
                    });
                  }}
                />
                &nbsp;
                <input
                  style={{
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  value={
                    editingRTSContext.editingRTS.newItem.user_notifications
                      .during.message
                  }
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        user_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .user_notifications,
                          during: {
                            ...editingRTSContext.editingRTS.newItem
                              .user_notifications.during,
                            message: e.target.value,
                          },
                        },
                      },
                    });
                  }}
                />
              </div>
              <div
                style={{
                  margin: '10px 0',
                  marginLeft: '20px',
                }}
              >
                TA &nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  type="checkbox"
                  style={{ width: '20px', height: '20px' }}
                  checked={
                    editingRTSContext.editingRTS.newItem.ta_notifications.during
                      .is_enabled !== 'False' &&
                    editingRTSContext.editingRTS.newItem.ta_notifications.during
                      .is_enabled !== false
                  }
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        ta_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .ta_notifications,
                          during: {
                            ...editingRTSContext.editingRTS.newItem
                              .ta_notifications.during,
                            is_enabled: e.target.checked,
                            is_set: e.target.checked,
                          },
                        },
                      },
                    });
                  }}
                />
                &nbsp;
                <input
                  style={{
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  value={
                    editingRTSContext.editingRTS.newItem.ta_notifications.during
                      .message
                  }
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        ta_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .ta_notifications,
                          during: {
                            ...editingRTSContext.editingRTS.newItem
                              .ta_notifications.during,
                            message: e.target.value,
                          },
                        },
                      },
                    });
                  }}
                />
              </div>
            </Row>
            <Row>
              <div
                style={{
                  margin: '10px 0',
                  marginLeft: '20px',
                }}
              >
                <input
                  type="number"
                  style={{
                    width: '60px',
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  value={
                    editingRTSContext.editingRTS.newItem.ta_notifications.after
                      .time
                  }
                  onChange={(e) => {
                    if (e.target.value < 0) return;
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        ta_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .ta_notifications,
                          after: {
                            ...editingRTSContext.editingRTS.newItem
                              .ta_notifications.after,
                            time: e.target.value,
                          },
                        },
                        user_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .user_notifications,
                          after: {
                            ...editingRTSContext.editingRTS.newItem
                              .user_notifications.after,
                            time: e.target.value,
                          },
                        },
                      },
                    });
                  }}
                />
                &nbsp; Mins After End Time
              </div>
              <div
                style={{
                  margin: '10px 0',
                  marginLeft: '20px',
                  verticalAlign: 'middle',
                }}
              >
                User &nbsp;
                <input
                  type="checkbox"
                  style={{ width: '20px', height: '20px' }}
                  checked={
                    editingRTSContext.editingRTS.newItem.user_notifications
                      .after.is_enabled !== 'False' &&
                    editingRTSContext.editingRTS.newItem.user_notifications
                      .after.is_enabled !== false
                  }
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        user_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .user_notifications,
                          after: {
                            ...editingRTSContext.editingRTS.newItem
                              .user_notifications.after,
                            is_enabled: e.target.checked,
                            is_set: e.target.checked,
                          },
                        },
                      },
                    });
                  }}
                />
                &nbsp;
                <input
                  style={{
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  value={
                    editingRTSContext.editingRTS.newItem.user_notifications
                      .after.message
                  }
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        user_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .user_notifications,
                          after: {
                            ...editingRTSContext.editingRTS.newItem
                              .user_notifications.after,
                            message: e.target.value,
                          },
                        },
                      },
                    });
                  }}
                />
              </div>
              <div
                style={{
                  margin: '10px 0',
                  marginLeft: '20px',
                }}
              >
                TA &nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  type="checkbox"
                  style={{ width: '20px', height: '20px' }}
                  checked={
                    editingRTSContext.editingRTS.newItem.ta_notifications.after
                      .is_enabled !== 'False' &&
                    editingRTSContext.editingRTS.newItem.ta_notifications.after
                      .is_enabled !== false
                  }
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        ta_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .ta_notifications,
                          after: {
                            ...editingRTSContext.editingRTS.newItem
                              .ta_notifications.after,
                            is_enabled: e.target.checked,
                            is_set: e.target.checked,
                          },
                        },
                      },
                    });
                  }}
                />
                &nbsp;
                <input
                  style={{
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  value={
                    editingRTSContext.editingRTS.newItem.ta_notifications.after
                      .message
                  }
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        ta_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .ta_notifications,
                          after: {
                            ...editingRTSContext.editingRTS.newItem
                              .ta_notifications.after,
                            message: e.target.value,
                          },
                        },
                      },
                    });
                  }}
                />
              </div>
            </Row>
          </Row>
        </Col>
        {/*
         *
         * WROTE CODE HERE
         *
         */}
        <input
          type="checkbox"
          checked={automatic}
          style={{
            height: '20px',
            width: '20px',
          }}
          //Causes infinite rerenders
          // onClick={
          //   setAutomatic(!automatic)
          // }
          onClick={handleAutomatic}
        ></input>
        &nbsp;&nbsp; Enable automatic notifications (all notifications set for 5
        mins)
        <button
          type="submit"
          style={{
            border: 'none',
            borderRadius: '10px',
            position: 'relative',
            margin: '10px',
            left: '50px',
          }}
          onClick={handleClear}
        >
          Clear all entries
        </button>
        {/*
         *
         * WROTE CODE HERE
         *
         */}
      </Container>
      <div
        style={{
          textAlign: 'center',
          marginTop: '20px',
          paddingBottom: '20px',
        }}
      >
        <button
          style={{
            width: '127px',
            height: '37px',
            margin: '0 20px',
            background: '#FFFFFF 0% 0% no-repeat padding-box',
            borderRadius: '10px',
            color: '#000000',
            font: 'normal normal 16px Quicksand-Bold',
            border: '2px solid #FFFFFF',
            textAlign: 'center',
          }}
          onClick={updateRTS}
        >
          Save
        </button>
        <button
          style={{
            width: '127px',
            height: '37px',
            margin: '0 20px',
            background: '#FFFFFF 0% 0% no-repeat padding-box',
            borderRadius: '10px',
            color: '#000000',
            font: 'normal normal 16px Quicksand-Bold',
            border: '2px solid #FFFFFF',
            textAlign: 'center',
          }}
          onClick={() => {
            editingRTSContext.setEditingRTS({
              ...editingRTSContext.editingRTS,
              editing: false,
            });
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditRTS;
