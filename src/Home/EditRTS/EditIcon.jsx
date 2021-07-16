import React, { useContext } from 'react';
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import EditRTSContext from './EditRTSContext';

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
          editingRTSContext.setEditingRTS({
            ...editingRTSContext.editingRTS,
            editing: rowId === editingRTSContext.editingRTS.id ? !editingRTSContext.editingRTS.editing : true,
            type: rowType,
            id: rowId
          })
        }}
        size="small"
      />
    </div>
  )
}

export default EditIcon;
