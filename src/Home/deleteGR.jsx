import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;

const deleteGR = (props) => {
  const submitRequest = () => {
    // console.log("request to delete GR")
    // console.log('delete index ' + this.props.deleteIndex)
    // console.log(this.props.Item)
    // console.log(this.props.Array)
    if (props.deleteIndex < 0) {
      console.log('invalid index exiting delete');
      return;
    }
    TempdeleteArrPortion();
  };

  /* useEffect() is used to render API calls as minimumly 
  as possible based on past experience, if not included 
  causes alarms and excessive rendering */
  function TempdeleteArrPortion() {
    let url = BASE_URL + 'deleteGR';

    let items = [props.Array];
    let i = props.deleteIndex;

    let body = {
      goal_routine_id: items[i].id,
    };
    useEffect(() => {
      axios
        .post(url, body)
        .then(() => {
          console.log('Deleted Goal/Routine to Database');
          if (props != null) {
            props.refresh();
          }
        })
        .catch((err) => {
          console.log('Error deleting Goal/Routine', err);
        });
    }, []);
  }

  const confirmation = () => {
    const r = window.confirm('Confirm Delete');
    if (r === true) {
      console.log('Delete Confirm');
      submitRequest();
      return;
    }
    console.log('Delete Not Confirm');
  };

  return (
    <div style={{ marginLeft: '5px' }}>
      <FontAwesomeIcon
        title="Delete Item"
        onMouseOver={(event) => {
          event.target.style.color = '#48D6D2';
        }}
        onMouseOut={(event) => {
          event.target.style.color = '#000000';
        }}
        style={{ marginRight: '15px', color: '#000000' }}
        // style ={{ color:  "#000000" }}
        onClick={(e) => {
          e.stopPropagation();
          confirmation();
        }}
        icon={faTrashAlt}
        size="lg"
      />
    </div>
  );
};
export default deleteGR;
