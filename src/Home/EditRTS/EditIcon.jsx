import React, { useContext, useEffect, useState } from 'react';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import EditRTSContext from './EditRTSContext';
import DayRoutines from 'Home/DayRoutines';
import { Step } from '@material-ui/core';
import moment from 'moment';

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;

const convertDateToDayString = (dateObject) => {
  // console.log(dateObject)
  const year = dateObject.getFullYear();
  let month = dateObject.getMonth() + 1;
  if (month > 9) {
    month = '' + month;
  } else {
    month = '0' + month;
  }
  let date = dateObject.getDate();
  if (date > 9) {
    date = '' + date;
  } else {
    date = '0' + date;
  }
  const dateString = `${year}-${month}-${date}`;
  // console.log(dateString);
  return dateString;
};

const convertDateToTimeString = (dateObject) => {
  let hour = dateObject.getHours();
  if (hour > 9) {
    hour = '' + hour;
  } else {
    hour = '0' + hour;
  }
  let minutes = dateObject.getMinutes();
  if (minutes > 9) {
    minutes = '' + minutes;
  } else {
    minutes = '0' + minutes;
  }
  const timeString = `${hour}:${minutes}`;
  return timeString;
};

const convertTimeLengthToMins = (timeString) => {
  const timeUnits = timeString.split(':');
  const hours = parseInt(timeUnits[0]);
  const minutes = parseInt(timeUnits[1]);
  const numMins = 60 * hours + minutes;
  return '' + numMins;
};

const EditIcon = ({ routine, task, step, getGoalsEndPoint, ta_id }) => {
  console.log('EDIT STEP: ' + step);
  const editingRTSContext = useContext(EditRTSContext);
  const [routineCall, setroutineCall] = useState(false);
  // var arrRoutine = []

  let rowType = '';
  let rowId = '';
  if (step) {
    rowType = 'step';
    rowId = step.unique_id;
  } else if (task) {
    rowType = 'task';
    rowId = task.at_unique_id;
  } else if (routine) {
    rowType = 'routine';
    // rowId = routine.id;
  }

  // console.log("item", step, routine.id)

  return (
    <div>
      <FontAwesomeIcon
        title="Edit Item"
        onMouseOver={(event) => {
          event.target.style.color = '#48D6D2';
        }}
        onMouseOut={(event) => {
          event.target.style.color = '#FFFFFF';
        }}
        style={{ color: '#ffffff', cursor: 'pointer' }}
        icon={faEdit}
        onClick={(e) => {
          e.stopPropagation();
          //  setroutineCall(!routineCall)

          // testing
          console.log('logpog-4');
          console.log('clicked editRoutine: step = ', step);

          axios
            .get(BASE_URL + 'getroutines/' + step)
            .then((response) => {
              console.log('logpog-5');
              let temp = [];
              console.log(
                'in click editicon: editingRTS = ',
                editingRTSContext.editingRTS
              );
              // console.log("routineGet", response)
              for (var i = 0; i < response.data.result.length; i++) {
                // console.log(response.data.result[i])
                getGoalsEndPoint.push(response.data.result[i]);
                console.log('in click editicon', response.data.result[i]);

                // temp.push(response.data.result[i])
              }
              //setgetGoalsEndPoint(temp)

              // testing

              console.log('clicked on editIcon');
              console.log(
                'item',
                getGoalsEndPoint[0].gr_start_day_and_time,
                routine.gr_unique_id
              );
              console.log(routine);
              let itemToChange;
              for (var k = 0; k < getGoalsEndPoint.length; k++) {
                if (routine.gr_unique_id === getGoalsEndPoint[k].gr_unique_id) {
                  itemToChange = getGoalsEndPoint[k];
                  rowId = getGoalsEndPoint[k].gr_unique_id;
                  console.log('item', getGoalsEndPoint[k]);
                }
              }
              //   const itemToChange = editingRTSContext.editingRTS.gr_array.filter((elt) => elt.id === rowId)[0];
              // console.log("item",itemToChange.gr_start_day_and_time)
              //Convert start_day_and_time to day and time
              var startDate;
              if (itemToChange.gr_start_day_and_time != undefined) {
                startDate = new Date(
                  itemToChange.gr_start_day_and_time.replace(/-/g, '/')
                );
              }
              console.log('logpog-5.1', itemToChange);

              console.log('start', startDate);
              const startDay = convertDateToDayString(startDate);
              const startTime = convertDateToTimeString(startDate);
              console.log(startTime);
              let filtered_notifications = [];
              for (let k = 0; k < itemToChange.notifications.length; ++k) {
                const first_notifications = itemToChange.notifications[k];
                if (first_notifications) {
                  if (first_notifications.user_ta_id.charAt(0) === '1') {
                    filtered_notifications.push(first_notifications);
                  } else if (
                    first_notifications.user_ta_id.charAt(0) === '2' &&
                    first_notifications.user_ta_id === ta_id
                  ) {
                    filtered_notifications.push(first_notifications);
                  }
                }
              }
              itemToChange.notifications = filtered_notifications;
              itemToChange.start_day = startDay;
              itemToChange.start_time = startTime;
              delete itemToChange.gr_start_day_and_time;
              // Convert end_day_and_time to day and time
              const endDate = new Date(
                itemToChange.gr_end_day_and_time.replace(/-/g, '/')
              );
              const endDay = convertDateToDayString(endDate);
              itemToChange.end_day = endDay;
              const endTime = convertDateToTimeString(endDate);
              itemToChange.end_time = endTime;
              delete itemToChange.gr_end_day_and_time;
              // Convert expected_completion_time to number of minutes
              const expectedCompletionTime =
                itemToChange.gr_expected_completion_time
                  ? itemToChange.gr_expected_completion_time
                  : '00:00:00';
              const numMins = convertTimeLengthToMins(expectedCompletionTime);
              itemToChange.numMins = numMins;
              delete itemToChange.gr_expected_completion_time;
              console.log('itemtochange', itemToChange);
              let [ta_times, user_times] = [{}, {}];
              let [ta_message, user_message] = [{}, {}];
              let [ta_is_enabled, user_is_enabled] = [{}, {}];
              for (let x = 0; x < itemToChange.notifications.length; x++) {
                if (
                  itemToChange.notifications[x].user_ta_id.charAt(0) === '1'
                ) {
                  user_is_enabled['before'] =
                    itemToChange.notifications[x].before_is_enable;
                  user_message['before'] =
                    itemToChange.notifications[x].before_message;

                  user_times['before'] =
                    itemToChange.notifications[x].before_time.split(':');
                  if (
                    user_times['before'].length !== 0 &&
                    user_times['before'][0] !== ''
                  )
                    user_times['before'] =
                      parseInt(user_times['before'][0]) * 60 +
                      parseInt(user_times['before'][1]);

                  user_is_enabled['during'] =
                    itemToChange.notifications[x].during_is_enable;
                  user_message['during'] =
                    itemToChange.notifications[x].during_message;
                  user_times['during'] =
                    itemToChange.notifications[x].during_time.split(':');
                  if (
                    user_times['during'].length !== 0 &&
                    user_times['during'][0] !== ''
                  )
                    user_times['during'] =
                      parseInt(user_times['during'][0]) * 60 +
                      parseInt(user_times['during'][1]);
                  user_is_enabled['after'] =
                    itemToChange.notifications[x].after_is_enable;
                  user_message['after'] =
                    itemToChange.notifications[x].after_message;
                  user_times['after'] =
                    itemToChange.notifications[x].after_time.split(':');
                  if (
                    user_times['after'].length !== 0 &&
                    user_times['after'][0] !== ''
                  )
                    user_times['after'] =
                      parseInt(user_times['after'][0]) * 60 +
                      parseInt(user_times['after'][1]);
                }
              }
              for (let x = 0; x < itemToChange.notifications.length; x++) {
                if (
                  itemToChange.notifications[x].user_ta_id.charAt(0) === '2'
                ) {
                  ta_is_enabled['before'] =
                    itemToChange.notifications[x].before_is_enable;
                  ta_message['before'] =
                    itemToChange.notifications[x].before_message;
                  ta_times['before'] =
                    itemToChange.notifications[x].before_time.split(':');
                  if (
                    ta_times['before'].length !== 0 &&
                    ta_times['before'][0] !== ''
                  )
                    ta_times['before'] =
                      parseInt(ta_times['before'][0]) * 60 +
                      parseInt(ta_times['before'][1]);
                  ta_is_enabled['during'] =
                    itemToChange.notifications[x].during_is_enable;
                  ta_message['during'] =
                    itemToChange.notifications[x].during_message;
                  ta_times['during'] =
                    itemToChange.notifications[x].during_time.split(':');
                  if (
                    ta_times['during'].length !== 0 &&
                    ta_times['during'][0] !== ''
                  )
                    ta_times['during'] =
                      parseInt(ta_times['during'][0]) * 60 +
                      parseInt(ta_times['during'][1]);
                  ta_is_enabled['after'] =
                    itemToChange.notifications[x].after_is_enable;
                  ta_message['after'] =
                    itemToChange.notifications[x].after_message;
                  ta_times['after'] =
                    itemToChange.notifications[x].after_time.split(':');
                  if (
                    ta_times['after'].length !== 0 &&
                    ta_times['after'][0] !== ''
                  )
                    ta_times['after'] =
                      parseInt(ta_times['after'][0]) * 60 +
                      parseInt(ta_times['after'][1]);
                } else {
                  ta_is_enabled['before'] = '';
                  ta_message['before'] = '';
                  ta_times['before'] = 0;
                  ta_is_enabled['during'] = '';
                  ta_message['during'] = '';
                  ta_times['during'] = 0;
                  ta_is_enabled['after'] = '';
                  ta_message['after'] = '';
                  ta_times['after'] = 0;
                }
              }

              console.log('itemtochange', itemToChange);
              console.log('itemtochange', user_times, ta_times);
              editingRTSContext.setEditingRTS({
                ...editingRTSContext.editingRTS,
                editing:
                  rowId === editingRTSContext.editingRTS.id
                    ? !editingRTSContext.editingRTS.editing
                    : true,
                type: rowType,
                id: rowId,
                currentUserId: step,

                notArr: itemToChange.notifications,

                newItem: {
                  ...editingRTSContext.editingRTS.newItem,
                  ta_notifications: {
                    ...editingRTSContext.editingRTS.newItem.ta_notifications,
                    before: {
                      ...editingRTSContext.editingRTS.newItem.ta_notifications
                        .after,
                      message: ta_message['before'],
                      is_enabled: ta_is_enabled['before'],
                      time: ta_times['before'],
                    },
                    during: {
                      ...editingRTSContext.editingRTS.newItem.ta_notifications
                        .after,
                      message: ta_message['during'],
                      is_enabled: ta_is_enabled['during'],
                      time: ta_times['during'],
                    },
                    after: {
                      ...editingRTSContext.editingRTS.newItem.ta_notifications
                        .after,
                      message: ta_message['after'],
                      is_enabled: ta_is_enabled['after'],
                      time: ta_times['after'],
                    },
                  },

                  user_notifications: {
                    ...editingRTSContext.editingRTS.newItem.user_notifications,
                    before: {
                      ...editingRTSContext.editingRTS.newItem.user_notifications
                        .after,
                      message: user_message['before'],
                      is_enabled: user_is_enabled['before'],
                      time: user_times['before'],
                    },
                    during: {
                      ...editingRTSContext.editingRTS.newItem.user_notifications
                        .after,
                      message: user_message['during'],
                      is_enabled: user_is_enabled['during'],
                      time: user_times['during'],
                    },
                    after: {
                      ...editingRTSContext.editingRTS.newItem.user_notifications
                        .after,
                      message: user_message['after'],
                      is_enabled: user_is_enabled['after'],
                      time: user_times['after'],
                    },
                  },
                  ...itemToChange,
                },
              });

              console.log('logpog-8');

              // testing
            })
            .catch((err) => {
              if (err.response) {
                console.log(err.response);
              }
              console.log(err);
            });

          // testing

          // console.log('clicked on editIcon')
          // console.log("item",getGoalsEndPoint[0].gr_start_day_and_time, routine.id)
          // console.log(getGoalsEndPoint[0].repeat)
          // var itemToChange;
          // for (var k=0; k<getGoalsEndPoint.length; k++){
          //   if(routine.id === getGoalsEndPoint[k].gr_unique_id){
          //     itemToChange = getGoalsEndPoint[k]
          //     rowId =  getGoalsEndPoint[k].gr_unique_id
          //     console.log("item",getGoalsEndPoint[k])
          //   }
          // }
          // //   const itemToChange = editingRTSContext.editingRTS.gr_array.filter((elt) => elt.id === rowId)[0];
          // // console.log("item",itemToChange.gr_start_day_and_time)
          // //Convert start_day_and_time to day and time
          // var startDate;
          // if(itemToChange.gr_start_day_and_time!=undefined){
          //  startDate = new Date(itemToChange.gr_start_day_and_time);
          // }
          // console.log("start", startDate)
          // const startDay = convertDateToDayString(startDate);
          // const startTime = convertDateToTimeString(startDate);
          // console.log(startTime)
          // itemToChange.start_day = startDay;
          // itemToChange.start_time = startTime;
          // delete itemToChange.gr_start_day_and_time;
          // // Convert end_day_and_time to day and time
          // const endDate = new Date(itemToChange.gr_end_day_and_time);
          // const endDay = convertDateToDayString(endDate);
          // itemToChange.end_day = endDay;
          // const endTime = convertDateToTimeString(endDate);
          // itemToChange.end_time = endTime;
          // delete itemToChange.gr_end_day_and_time;
          // // Convert expected_completion_time to number of minutes
          // const expectedCompletionTime = itemToChange.gr_expected_completion_time ? itemToChange.gr_expected_completion_time : '00:00:00';
          // const numMins = convertTimeLengthToMins(expectedCompletionTime)
          // itemToChange.numMins = numMins;
          // delete itemToChange.gr_expected_completion_time;
          // console.log('itemToChange')
          // console.log(itemToChange);

          // editingRTSContext.setEditingRTS({
          //   ...editingRTSContext.editingRTS,
          //   editing: rowId === editingRTSContext.editingRTS.id ? !editingRTSContext.editingRTS.editing : true,
          //   type: rowType,
          //   id: rowId,
          //   currentUserId: step,
          //   newItem: {
          //     ...editingRTSContext.editingRTS.newItem,
          //      ...itemToChange,
          //   }
          // })
        }}
        size="small"
      />
    </div>
  );
};

export default EditIcon;
