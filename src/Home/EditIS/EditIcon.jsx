import React, { useContext } from 'react';
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import EditISContext from './EditISContext';

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
          e.stopPropagation();
          console.log(routine[0])

          const itemToChange = routine;
         

          editingISContext.setEditingIS({
            ...editingISContext.editingIS,
            editing: rowId === editingISContext.editingIS.id ? !editingISContext.editingIS.editing : true,
            type: rowType,
            id: rowId,
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
