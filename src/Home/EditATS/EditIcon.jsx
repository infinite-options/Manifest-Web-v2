import React, { useContext, useEffect, useState } from 'react';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

import EditATSContext from './EditATSContext';
import { containerSizesSelector } from '@material-ui/data-grid';

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
  console.log('made it');
  const editingATSContext = useContext(EditATSContext);
  const [arrAction, setarrAction] = useState([]);
  let rowType = '';
  let rowId = '';
  if (step) {
    rowType = 'step';
    rowId = step.unique_id;
  } else if (task) {
    // rowType = 'task';
    // rowId = task.at_unique_id;
  } else if (routine) {
    rowType = 'routine';
    rowId = routine.id;
  }

  console.log('task', task.toString());

  useEffect(() => {
    console.log('tasktoString = ', task.toString());
    axios
      .get(BASE_URL + 'actionsTasks/' + task.toString())
      .then((response) => {
        console.log('actionAT', response);
        const temp = [];
        for (var i = 0; i < response.data.result.length; i++) {
          temp.push(response.data.result[i]);
        }
        setarrAction(temp);
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  }, []);

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
          axios
          .get(BASE_URL + 'actionsTasks/' + task.toString())
          .then((response) => {
            console.log('actionAT', response);
            const temp = [];
            for (var i = 0; i < response.data.result.length; i++) {
              temp.push(response.data.result[i]);
            }
            setarrAction(temp);
            console.log('temp = ', temp);
            e.stopPropagation();
            console.log(routine.id);
            var itemToChange;
            for (var j = 0; j < temp.length; j++) {
              if (routine.at_unique_id === temp[j].at_unique_id) {
                itemToChange = temp[j];
              }
            }
            console.log('itemToChange = ', itemToChange);
            // Convert start_day_and_time to day and time
  
            console.log('itemToChange.at_datetime_started = ', itemToChange.at_datetime_started)
            const startDate = new Date(
              itemToChange.at_datetime_started.replace(/-/g, '/')
            );
            const startDay = convertDateToDayString(startDate);
            itemToChange.start_day = startDay;
            console.log('chan', startDay);
            const startTime = convertDateToTimeString(startDate);
            itemToChange.start_time = startTime;
            console.log('chan', startTime);
  
            delete itemToChange.at_datetime_started;
            // Convert end_day_and_time to day and time
            const endDate = new Date(
              itemToChange.at_datetime_completed.replace(/-/g, '/')
            );
            const endDay = convertDateToDayString(endDate);
            itemToChange.end_day = endDay;
            console.log('chan', endDay);
            const endTime = convertDateToTimeString(endDate);
            console.log('chan', endTime);
            itemToChange.end_time = endTime;
            console.log('chan', itemToChange.end_time);
            delete itemToChange.at_datetime_completed;
            // Convert expected_completion_time to number of minutes
            const expectedCompletionTime =
              itemToChange.at_expected_completion_time
                ? itemToChange.at_expected_completion_time
                : '00:00:00';
            const numMin = convertTimeLengthToMins(expectedCompletionTime);
            itemToChange.numMins = numMin;
            delete itemToChange.expected_completion_time;
            console.log(itemToChange);
  
            editingATSContext.setEditingATS({
              ...editingATSContext.editingATS,
              editing:
                rowId === editingATSContext.editingATS.id
                  ? !editingATSContext.editingATS.editing
                  : true,
              type: rowType,
              id: rowId,
              routineId: task,
              newItem: {
                ...editingATSContext.editingATS.newItem,
                ...itemToChange,
              },
            });
          })
          .catch((err) => {
            if (err.response) {
              console.log(err.response);
            }
            console.log(err);
          });
        }}
        size="large"
      />
    </div>
  );
};

export default EditIcon;
