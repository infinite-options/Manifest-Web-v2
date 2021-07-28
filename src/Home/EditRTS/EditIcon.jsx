import React, { useContext, useEffect, useState } from 'react';
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';
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

const EditIcon = ({routine, task, step, id}) => {
  const editingRTSContext = useContext(EditRTSContext);
  const [arrRoutine, setarrRoutine] = useState([])

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

  useEffect(() => {

    axios
  .get("https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/getgoalsandroutines/" + id)
    .then((response) => {
      console.log("routineGet", response)
      for(var i=0; i <response.data.result.length; i++){
        arrRoutine.push(response.data.result[i])
      }
    })
    .catch((err) => {
      if(err.response) {
        console.log(err.response);
      }
      console.log(err)
    })
  },[]);
 
  console.log("item", arrRoutine)

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
          console.log("item",arrRoutine[0].gr_unique_id, routine.id)
          var itemToChange;
          for (var k=0; k<arrRoutine.length; k++){
            if( arrRoutine[k].gr_unique_id){
              itemToChange = arrRoutine[k] 
              console.log("item",arrRoutine[k])
            }
          }
       //   const itemToChange = editingRTSContext.editingRTS.gr_array.filter((elt) => elt.id === rowId)[0];
           console.log("item",itemToChange.gr_start_day_and_time)
          //Convert start_day_and_time to day and time
          var startDate;
          if(itemToChange.gr_start_day_and_time!=undefined){
           startDate = new Date(itemToChange.gr_start_day_and_time);
          }
          console.log("start", startDate)
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