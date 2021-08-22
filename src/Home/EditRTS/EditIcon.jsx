import React, { useContext, useEffect, useState } from 'react';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import EditRTSContext from './EditRTSContext';
import DayRoutines from 'Home/DayRoutines';
import { Step } from '@material-ui/core';
import moment from 'moment';

const BASE_URL = process.env.REACT_APP_BASE_URL;

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

const EditIcon = ({ routine, task, step }) => {
  console.log('EDIT STEP: ' + step);
  const editingRTSContext = useContext(EditRTSContext);
  const [arrRoutine, setarrRoutine] = useState([]);
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

  useEffect(() => {
    console.log('editicon', arrRoutine);
    console.log('getting new data editicon');
    axios
      .get(
        BASE_URL + 'getgoalsandroutines/' +
          step
      )
      .then((response) => {
        //let temp = []
        // console.log("routineGet", response)
        for (var i = 0; i < response.data.result.length; i++) {
          // console.log(response.data.result[i])
          arrRoutine.push(response.data.result[i]);
          //temp.push(response.data.result[i])
        }
        // setarrRoutine(temp)
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  }, [routineCall]);

  const outerFunction = () => {};

  // console.log("item", step, routine.id)

  return (
    <div>
      <FontAwesomeIcon
        title="Edit Item"
        onMouseOver={(event) => {
          event.target.style.color = '#48D6D2';
        }}
        onMouseOut={(event) => {
          event.target.style.color = '#ffffff';
        }}
        style={{ color: '#ffffff' }}
        icon={faEdit}
        onClick={(e) => {
          e.stopPropagation();
          //  setroutineCall(!routineCall)

          // testing

          axios
            .get(
              BASE_URL + 'getgoalsandroutines/' +
                step
            )
            .then((response) => {
              let temp = [];
              console.log('in click editicon');
              // console.log("routineGet", response)
              for (var i = 0; i < response.data.result.length; i++) {
                // console.log(response.data.result[i])
                arrRoutine.push(response.data.result[i]);
                console.log('in click editicon', response.data.result[i]);

                // temp.push(response.data.result[i])
              }
              //setarrRoutine(temp)

              // testing

              console.log('clicked on editIcon');
              console.log(
                'item',
                arrRoutine[0].gr_start_day_and_time,
                routine.id
              );
              console.log(arrRoutine[0].repeat);
              var itemToChange;
              for (var k = 0; k < arrRoutine.length; k++) {
                if (routine.gr_unique_id === arrRoutine[k].gr_unique_id) {
                  itemToChange = arrRoutine[k];
                  rowId = arrRoutine[k].gr_unique_id;
                  console.log('item', arrRoutine[k]);
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

              console.log('start', startDate);
              const startDay = convertDateToDayString(startDate);
              const startTime = convertDateToTimeString(startDate);
              console.log(startTime);
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
              console.log(
                'itemToChange',
                itemToChange.notifications[0].after_message
              );
              console.log(itemToChange);

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
                      message: itemToChange.notifications[0].before_message,
                      is_enabled:
                        itemToChange.notifications[0].before_is_enable,
                      time: itemToChange.notifications[0].before_time,
                    },
                    during: {
                      ...editingRTSContext.editingRTS.newItem.ta_notifications
                        .after,
                      message: itemToChange.notifications[0].during_message,
                      is_enabled:
                        itemToChange.notifications[0].during_is_enable,
                      time: itemToChange.notifications[0].during_time,
                    },
                    after: {
                      ...editingRTSContext.editingRTS.newItem.ta_notifications
                        .after,
                      message: itemToChange.notifications[0].after_message,
                      is_enabled: itemToChange.notifications[0].after_is_enable,
                      time: itemToChange.notifications[0].after_time,
                    },
                  },

                  user_notifications: {
                    ...editingRTSContext.editingRTS.newItem.user_notifications,
                    before: {
                      ...editingRTSContext.editingRTS.newItem.user_notifications
                        .after,
                      message: itemToChange.notifications[0].before_message,
                      is_enabled:
                        itemToChange.notifications[0].before_is_enable,
                      time: itemToChange.notifications[0].before_time,
                    },
                    during: {
                      ...editingRTSContext.editingRTS.newItem.user_notifications
                        .after,
                      message: itemToChange.notifications[1].during_message,
                      is_enabled:
                        itemToChange.notifications[1].during_is_enable,
                      time: itemToChange.notifications[1].during_time,
                    },
                    after: {
                      ...editingRTSContext.editingRTS.newItem.user_notifications
                        .after,
                      message: itemToChange.notifications[1].after_message,
                      is_enabled: itemToChange.notifications[1].after_is_enable,
                      time: itemToChange.notifications[0].after_time,
                    },
                  },
                  ...itemToChange,
                },
              });

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
          // console.log("item",arrRoutine[0].gr_start_day_and_time, routine.id)
          // console.log(arrRoutine[0].repeat)
          // var itemToChange;
          // for (var k=0; k<arrRoutine.length; k++){
          //   if(routine.id === arrRoutine[k].gr_unique_id){
          //     itemToChange = arrRoutine[k]
          //     rowId =  arrRoutine[k].gr_unique_id
          //     console.log("item",arrRoutine[k])
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
