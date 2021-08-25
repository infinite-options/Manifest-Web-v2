import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import EditATSContext from './EditATSContext';
import moment from 'moment';
import axios from 'axios';
import AddIconModal from '../AddIconModal';
import UploadImage from '../UploadImage';

import { propTypes } from 'react-bootstrap/esm/Image';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const convertDateToDayString = (dateObject) => {
  //console.log(dateObject);
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
  //console.log(dateString);
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

const EditATS = (props) => {
  const editingATSContext = useContext(EditATSContext);
  console.log('action Props', props);
  console.log('action Props',  new Date((props.routineID.gr_start_day_and_time).replace(/-/g, '/')));
  const startTime = new Date((props.routineID.gr_start_day_and_time).replace(/-/g, '/'));
  const endTime = new Date((props.routineID.gr_end_day_and_time).replace(/-/g, '/'));
  const startDay = convertDateToDayString(startTime);
  const endDay = convertDateToDayString(endTime);
  console.log('action startTime', startTime);
  console.log('action endTime', endTime);
  console.log('action startDay', startDay);
  console.log('action endDay', endDay);

  const [photo, setPhoto] = useState(
    editingATSContext.editingATS.newItem.at_photo
  );

  useEffect(() => {
    if (editingATSContext.editingATS.newItem.at_unique_id === undefined) {
      editingATSContext.setEditingATS({
        ...editingATSContext.editingATS,
        newItem: {
          ...editingATSContext.editingATS.newItem,
          start_day: startDay,
          end_day: endDay,
          at_available_start_time: convertDateToTimeString(
            new Date(props.routineID.gr_start_day_and_time.replace(/-/g, '/'))
          ),
          at_available_end_time: convertDateToTimeString(
            new Date(props.routineID.gr_end_day_and_time.replace(/-/g, '/'))
          ),
        },
      });
    }
  }, [editingATSContext.editingATS.newItem.start_day,editingATSContext.editingATS.newItem.end_day]);

  console.log(
    'action start_day',
    editingATSContext.editingATS.newItem.start_day
  );
  console.log('action end_day', editingATSContext.editingATS.newItem.end_day);

  const updateATS = (e) => {
    e.stopPropagation();
    let object = { ...editingATSContext.editingATS.newItem };
    props.setUpdateGetHistory(!props.updateGetHistory);
    const start_day_and_time_simple_string = `${object.start_day} ${object.start_time}:00`;
    const start_day_and_time_string = new Date(
      start_day_and_time_simple_string
    ).toString();
    const convertedStartTime = moment(start_day_and_time_string).format('LTS');
    console.log('action', object.start_day);
    object.datetime_started =
      `${object.start_day}` + ' ' + object.at_available_start_time; //start_day_and_time_string;
    delete object.start_day;
    delete object.start_time;
    const end_day_and_time_simple_string = `${object.end_day} ${object.end_time}:00`;
    const end_day_and_time_string = new Date(
      end_day_and_time_simple_string
    ).toString();
    const convertedEndTime = moment(end_day_and_time_string).format('LTS');
    object.datetime_completed =
      `${object.end_day}` + ' ' + object.at_available_end_time;
    object.available_start_time = object.at_available_start_time;
    delete object.at_available_start_time;
    object.available_end_time = object.at_available_end_time;
    delete object.at_available_end_time;
    delete object.at_datetime_completed;
    delete object.at_datetime_started;
    object.expected_completion_time = object.at_expected_completion_time;
    delete object.at_expected_completion_time;
    object.photo = '';
    object.photo_url = photo;
    object.type = '';
    delete object.at_photo;
    delete object.end_day;
    delete object.end_time;
    delete object.at_sequence;
    delete object.at_unique_id;
    delete object.end_day_and_time;
    delete object.goal_routine_id;
    delete object.is_displayed_today;
    delete object.is_persistent;
    delete object.location;
    delete object.start_day_and_time;
    object.title = object.at_title;
    object.gr_id = props.routineID.gr_unique_id;
    delete object.at_title;
    const numHours = object.numMins > 60 ? object.numMins / 60: '00';
    let numMins = object.numMins % 60;
    if (numMins < 10) numMins = '0' + numMins;
    object.expected_completion_time = `${numHours}:${numMins}:00`;
    delete object.numMins;
    object.id = editingATSContext.editingATS.newItem.at_unique_id;
    console.log('obj', object);
    let formData = new FormData();
    Object.entries(object).forEach((entry) => {
      if (typeof entry[1] == 'string') {
        formData.append(entry[0], entry[1]);
      } else if (entry[1] instanceof Object) {
        entry[1] = JSON.stringify(entry[1]);
        formData.append(entry[0], entry[1]);
      } else {
        formData.append(entry[0], entry[1]);
      }
    });
    if (object.id != undefined) {
      console.log('update AT');
      axios
        .post(BASE_URL + 'updateAT', formData)
        .then((response) => {
          console.log(response);
          const gr_array_index =
            editingATSContext.editingATS.gr_array.findIndex(
              (elt) => elt.id === editingATSContext.editingATS.id
            );
          const new_gr_array = [...editingATSContext.editingATS.gr_array];
          new_gr_array[gr_array_index] = object;
          editingATSContext.setEditingATS({
            ...editingATSContext.editingATS,
            gr_array: new_gr_array,
            editing: false,
          });
        })
        .catch((err) => {
          if (err.response) {
            console.log(err.response);
          }
          console.log(err);
        });
    } else {
      console.log('add AT');
      axios
        .post(BASE_URL + 'addAT', formData)
        .then((response) => {
          console.log(response);
          const gr_array_index =
            editingATSContext.editingATS.gr_array.findIndex(
              (elt) => elt.id === editingATSContext.editingATS.id
            );
          const new_gr_array = [...editingATSContext.editingATS.gr_array];
          new_gr_array[gr_array_index] = object;
          editingATSContext.setEditingATS({
            ...editingATSContext.editingATS,
            gr_array: new_gr_array,
            editing: false,
          });
        })
        .catch((err) => {
          if (err.response) {
            console.log(err.response);
          }
          console.log(err);
        });
    }
  };
  return (
    <div
      style={{
        marginTop: '1rem',
        marginLeft: '2rem',
        marginRight: '3rem',
        width: '50%',
        backgroundColor: '#E4C33A',
        color: '#ffffff',
      }}
    >
      <Container
        style={{
          padding: '2rem',
        }}
      >
        <Col style={{ float: 'left', width: '100%' }}>
          <div>
            <div style={{ fontWeight: 'bold' }}>Action Name </div>
            <input
              style={{
                borderRadius: '10px',
                border: '0px',
                fontSize: '12px',
                height: '2rem',
                width: '15rem',
              }}
              placeholder="Name Action here"
              value={editingATSContext.editingATS.newItem.at_title}
              onChange={(e) => {
                editingATSContext.setEditingATS({
                  ...editingATSContext.editingATS,
                  newItem: {
                    ...editingATSContext.editingATS.newItem,
                    at_title: e.target.value,
                  },
                });
              }}
            />
          </div>
          <div style={{ fontWeight: 'bold', marginTop: '10px' }}>
            Change Icon
          </div>
          <div style={{ textAlign: 'left', marginTop: '1rem' }}>
            <Row>
              <Col style={{ fontSize: '14px', textDecoration: 'underline' }}>
                <div style={{ marginLeft: '1rem', marginBottom: '8px' }}>
                  Add icon to library
                </div>
                <AddIconModal photoUrl={photo} setPhotoUrl={setPhoto} />
                <UploadImage
                  photoUrl={photo}
                  setPhotoUrl={setPhoto}
                  currentUserId={props.CurrentId}
                />
              </Col>
              <Col>
                <img alt="icon" src={photo} height="100" width="100" />
              </Col>
            </Row>
          </div>

          <div style={{ fontWeight: 'bold', marginTop: '1rem' }}>
            Start Time
          </div>

          <Row>
            <Col sm={6}>
              <input
                style={{
                  borderRadius: '10px',
                  border: '0px',
                  width: '100%',
                  fontSize: '12px',
                  height: '2rem',
                  //width:'5rem'
                }}
                type="date"
                value={editingATSContext.editingATS.newItem.start_day}
                onChange={(e) => {
                  editingATSContext.setEditingATS({
                    ...editingATSContext.editingATS,
                    newItem: {
                      ...editingATSContext.editingATS.newItem,
                      start_day: e.target.value,
                    },
                  });
                }}
              />
            </Col>
            <Col sm={6}>
              <input
                style={{
                  //width: '6rem',
                  width: '100%',
                  borderRadius: '10px',
                  border: '0px',
                  fontSize: '12px',
                  height: '2rem',
                }}
                type="time"
                value={
                  editingATSContext.editingATS.newItem.at_available_start_time
                }
                onChange={(e) => {
                  editingATSContext.setEditingATS({
                    ...editingATSContext.editingATS,
                    newItem: {
                      ...editingATSContext.editingATS.newItem,
                      at_available_start_time: e.target.value,
                    },
                  });
                }}
              />
            </Col>
          </Row>

          <div style={{ fontWeight: 'bold', marginTop: '1rem' }}>End Time</div>

          <Row>
            <Col sm={6}>
              <input
                style={{
                  //width: '6rem',
                  width: '100%',
                  borderRadius: '10px',
                  border: '0px',
                  fontSize: '12px',
                  height: '2rem',
                }}
                type="date"
                value={editingATSContext.editingATS.newItem.end_day}
                onChange={(e) => {
                  editingATSContext.setEditingATS({
                    ...editingATSContext.editingATS,
                    newItem: {
                      ...editingATSContext.editingATS.newItem,
                      end_day: e.target.value,
                    },
                  });
                }}
              />
            </Col>
            <Col sm={6}>
              <input
                style={{
                  //width: '100%',
                  borderRadius: '10px',
                  border: '0px',
                  width: '100%',
                  fontSize: '12px',
                  height: '2rem',
                }}
                type="time"
                value={
                  editingATSContext.editingATS.newItem.at_available_end_time
                }
                onChange={(e) => {
                  editingATSContext.setEditingATS({
                    ...editingATSContext.editingATS,
                    newItem: {
                      ...editingATSContext.editingATS.newItem,
                      at_available_end_time: e.target.value,
                    },
                  });
                }}
              />
            </Col>
          </Row>

          <div style={{ display: 'flex', marginTop: '1rem' }}>
            <div>
              <div style={{ fontWeight: 'bold' }}>This Takes Me</div>
              <input
                style={{
                  borderRadius: '10px',
                  border: '0px',
                  fontSize: '12px',
                  height: '2rem',
                  width: '11.5rem',
                }}
                type="number"
                value={editingATSContext.editingATS.newItem.numMins}
                onChange={(e) => {
                  editingATSContext.setEditingATS({
                    ...editingATSContext.editingATS,
                    newItem: {
                      ...editingATSContext.editingATS.newItem,
                      numMins: e.target.value,
                    },
                  });
                }}
              />
            </div>
            <div style={{ marginTop: '1.5rem', marginLeft: '1rem' }}>
              {' '}
              Minutes{' '}
            </div>
          </div>

          <div style={{ display: 'flex', marginTop: '1rem' }}>
            <div style={{ fontSize: '12px' }}> Available to User </div>
            {editingATSContext.editingATS.newItem.is_available ==
                  'True' ? (
                    <input
                      type="checkbox"
                      style={{ width: '20px', height: '20px' }}
                      defaultChecked="true"
                      onChange={(e) => {
                        editingATSContext.setEditingATS({
                          ...editingATSContext.editingATS,
                          newItem: {
                            ...editingATSContext.editingATS.newItem,
                            is_available: e.target.checked,
                          },
                        });
                      }}
                    />
                  ) : (
                    <input
                      type="checkbox"
                      style={{ width: '20px', height: '20px' }}
                      onChange={(e) => {
                        editingATSContext.setEditingATS({
                          ...editingATSContext.editingATS,
                          newItem: {
                            ...editingATSContext.editingATS.newItem,
                            is_available: e.target.checked,
                          },
                        });
                      }}
                    />
                  )}
          </div>

          <Row
            style={{
              textAlign: 'center',
              width: '100%',
              paddingBottom: '20px',
              marginTop: '1rem',
            }}
          >
            <div
              style={{
                textAlign: 'center',
                // marginTop:'3rem',
                width: '100%',
              }}
            >
              <button
                style={{
                  width: '100px',
                  padding: '0',
                  margin: '0 20px',
                  backgroundColor: 'inherit',
                  border: '3px white solid',
                  color: '#ffffff',
                  textAlign: 'center',
                }}
                onClick={() => {
                  editingATSContext.setEditingATS({
                    ...editingATSContext.editingATS,
                    editing: false,
                  });
                }}
              >
                Cancel
              </button>
              <button
                style={{
                  width: '100px',
                  padding: '0',
                  margin: '0 20px',
                  backgroundColor: 'inherit',
                  border: '3px white solid',
                  color: '#ffffff',
                  textAlign: 'center',
                }}
                onClick={updateATS}
              >
                Save
              </button>
            </div>
          </Row>
        </Col>
      </Container>
    </div>
  );
};

export default EditATS;
