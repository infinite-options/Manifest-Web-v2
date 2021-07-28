import React, { useContext } from 'react';
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import EditRTSContext from './EditRTSContext';
import DayRoutines from 'Home/DayRoutines';

const convertDateToDayString = (dateObject) => {
  // console.log(dateObject)
  const year = dateObject.getFullYear();
  let month = dateObject.getMonth() + 1;
  if(month > 9) {
    month = '' + month;
  } else {
    month = '0' + month
  }
  let date = dateObject.getDate();
  if(date > 9) {
    date = '' + date;
  } else {
    date = '0' + date
  }
  const dateString =  `${year}-${month}-${date}`;
  // console.log(dateString);
  return dateString;
}

const convertDateToTimeString = (dateObject) => {
  let hour = dateObject.getHours();
  if(hour > 9) {
    hour = '' + hour;
  } else {
    hour = '0' + hour
  }
  let minutes = dateObject.getMinutes();
  if(minutes > 9) {
    minutes = '' + minutes;
  } else {
    minutes = '0' + minutes;
  }
  const timeString = `${hour}:${minutes}`;
  return timeString;
}

const convertTimeLengthToMins = (timeString) => {
  const timeUnits = timeString.split(':');
  const hours = parseInt(timeUnits[0],10);
  const minutes = parseInt(timeUnits[1],10);
  const numMins =  60 * hours + minutes;
  return ('' + numMins);
}

const EditIcon = ({routine, task, step}) => {
  const editingRTSContext = useContext(EditRTSContext);
  
  let rowType = '';
  let rowId = '';
  if (step) {
    rowType = 'step';
    rowId = step.unique_id;
  } else if(task) {
    rowType = 'task';
    rowId = task.at_unique_id;
  } else if (routine) {
    rowType = 'routine';
    rowId = routine.id;
  }

  console.log('editIcon',routine)

  return (
    <div>
      <FontAwesomeIcon
        title="Edit Item"
        onMouseOver={(event) => {
          event.target.style.color = "#48D6D2";
        }}
        onMouseOut={(event) => {
          event.target.style.color = "#ffffff";
        }}
        style={{ color: "#ffffff" }}
        icon={faEdit}
        onClick={(e) => {
          e.stopPropagation();
          console.log(editingRTSContext)
          console.log(editingRTSContext.editingRTS.gr_array)
          const itemToChange = editingRTSContext.editingRTS.gr_array.filter((elt) => elt.id === rowId)[0];
          console.log(itemToChange)
          // Convert start_day_and_time to day and time
          const startDate = new Date(itemToChange.gr_start_day_and_time);
          const startDay = convertDateToDayString(startDate);
          const startTime = convertDateToTimeString(startDate);
          console.log(startTime)
          itemToChange.start_day = startDay;
          itemToChange.start_time = startTime;
          delete itemToChange.gr_start_day_and_time;
          // Convert end_day_and_time to day and time
          const endDate = new Date(itemToChange.gr_end_day_and_time);
          const endDay = convertDateToDayString(endDate);
          itemToChange.end_day = endDay;
          const endTime = convertDateToTimeString(endDate);
          itemToChange.end_time = endTime;
          delete itemToChange.gr_end_day_and_time;
          // Convert expected_completion_time to number of minutes
          const expectedCompletionTime = itemToChange.gr_expected_completion_time ? itemToChange.gr_expected_completion_time : '00:00:00';
          const numMins = convertTimeLengthToMins(expectedCompletionTime)
          itemToChange.numMins = numMins;
          delete itemToChange.gr_expected_completion_time;
          console.log(itemToChange);

          editingRTSContext.setEditingRTS({
            ...editingRTSContext.editingRTS,
            editing: rowId === editingRTSContext.editingRTS.id ? !editingRTSContext.editingRTS.editing : true,
            type: rowType,
            id: rowId,
            newItem: {
              ...editingRTSContext.editingRTS.newItem,
               ...itemToChange,
            }
          })
        }}
        size="small"
      />
    </div>
  )
}

export default EditIcon;