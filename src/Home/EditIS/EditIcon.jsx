import React, { useContext, useEffect, useState } from 'react';
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';
import EditISContext from './EditISContext';
import { propTypes } from 'react-bootstrap/esm/Image';

const BASE_URL = process.env.REACT_APP_BASE_URL;

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
  const hours = parseInt(timeUnits[0]);
  const minutes = parseInt(timeUnits[1]);
  const numMins =  60 * hours + minutes;
  return '' + numMins;
}

const EditIcon = ({routine, task, step, setRID, getStepsEndPoint}) => {
  const editingISContext = useContext(EditISContext);

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
    rowId = routine.gr_unique_id;
  }

  return (
    <div>
      <FontAwesomeIcon
        title="Edit Item"
        onMouseOver={(event) => {event.target.style.color = '#48D6D2';}}
        onMouseOut={(event) => {event.target.style.color = '#FFFFFF';}}
        style={{ color: "#ffffff", cursor:'pointer' }}
        icon={faEdit}
        onClick={(e) => {
          e.stopPropagation();
          setRID(routine);

          var itemToChange;
          for(var j=0;j<getStepsEndPoint[routine.at_id].length;j++){
            if (routine.is_unique_id === getStepsEndPoint[routine.at_id][j].is_unique_id){
              itemToChange = getStepsEndPoint[routine.at_id][j];
            }
          }
          console.log("TimeStep", itemToChange.is_expected_completion_time)
          const expectedCompletionTime = itemToChange.is_expected_completion_time ? itemToChange.is_expected_completion_time : '00:00:00';
          const numMins = convertTimeLengthToMins(expectedCompletionTime)
          itemToChange.numMins = numMins;
          delete itemToChange.is_expected_completion_time;

          editingISContext.setEditingIS({
            ...editingISContext.editingIS,
            editing: rowId === editingISContext.editingIS.id ? !editingISContext.editingIS.editing : true,
            type: rowType,
            id: step,
            newItem: {
              ...editingISContext.editingIS.newItem,
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
