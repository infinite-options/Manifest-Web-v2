import React, { useContext, useEffect, useState } from 'react';
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';

import EditATSContext from './EditATSContext';
import { containerSizesSelector } from '@material-ui/data-grid';
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
  const editingATSContext = useContext(EditATSContext);
  const [arrAction, setarrAction] = useState([])

  
  let rowType = '';
  let rowId = '';
  if (step) {
    rowType = 'step';
    rowId = step.unique_id;
  } else if(task) {
    // rowType = 'task';
    // rowId = task.at_unique_id;
  } else if (routine) {
    rowType = 'routine';
    rowId = routine.id;
  }

  console.log('task', task)
  console.log('In EditActionIcon', routine, task)

  useEffect(() => {
    

    axios.get('https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/actionsTasks/' + task.toString())
    .then((response) => {
      console.log("actionAT",response )
      for(var i=0; i <response.data.result.length; i++){
        arrAction.push(response.data.result[i])
      }
    })
    .catch((err) => {
      if(err.response) {
        console.log(err.response);
      }
      console.log(err)
    })
  },[]);

 
  
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
          console.log(routine[0])
          var itemToChange;
          for(var j=0;j<arrAction.length;j++){
          if (routine.id === arrAction[j].at_unique_id){
            itemToChange = arrAction[j];
          }
          }
          console.log("item",itemToChange)
          // Convert start_day_and_time to day and time
          const startDate = new Date(itemToChange.at_datetime_started);
          console.log('editATS startdate',startDate, itemToChange.at_datetime_started)
          const startDay = convertDateToDayString(startDate);
          const startTime = convertDateToTimeString(startDate);
          itemToChange.start_day = startDay;
          itemToChange.start_time = startTime;
          delete itemToChange.start_day_and_time;
          // Convert end_day_and_time to day and time
          const endDate = new Date(itemToChange.at_datetime_completed);
          const endDay = convertDateToDayString(endDate);
          itemToChange.end_day = endDay;
          const endTime = convertDateToTimeString(endDate);
          itemToChange.end_time = endTime;
          delete itemToChange.end_day_and_time;
          // Convert expected_completion_time to number of minutes
          const expectedCompletionTime = itemToChange.at_expected_completion_time ? itemToChange.at_expected_completion_time : '00:00:00';
          const numMin = convertTimeLengthToMins(expectedCompletionTime)
          itemToChange.numMins = numMin;
          delete itemToChange.expected_completion_time;
          console.log(itemToChange);

          editingATSContext.setEditingATS({
            ...editingATSContext.editingATS,
            editing: rowId === editingATSContext.editingATS.id ? !editingATSContext.editingATS.editing : true,
            type: rowType,
            id: rowId,
            routineId: task,
            newItem: {
              ...editingATSContext.editingATS.newItem,
               ...itemToChange,
            }
          })
        }}
        size="large"
      />
    </div>
  )
}

export default EditIcon;
