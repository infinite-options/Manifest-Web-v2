import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import EditATSContext from './EditATSContext';
import moment from 'moment';
import axios from 'axios';
import AddIconModal from '../AddIconModal';
import UploadImage from '../UploadImage';
import GooglePhotos from '../GooglePhotos';

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;
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

  const [photo, setPhoto] = useState(
    editingATSContext.editingATS.newItem.at_photo
  );
  console.log('obj. ', props);

  const [showUploadImage, setShowUploadImage] = useState(false);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [imageURL, setImageURL] = useState('');

  console.log('action Props', props);
  console.log('editATS gre = ', props.getGoalsEndPoint);
  const routine = props.routineID.gr_unique_id
    ? props.routineID
    : props.getGoalsEndPoint.filter(
        (goal) => goal.gr_unique_id === props.routineID.goal_routine_id
      )[0];
  console.log('test-routine = ', routine);

  // console.log('action Props',  new Date((props.routineID.gr_start_day_and_time).replace(/-/g, '/')));
  // const startTime = new Date(props.routineID.gr_start_day_and_time);
  // const endTime = new Date(props.routineID.gr_end_day_and_time);
  const startTime = new Date(routine.gr_start_day_and_time.replace(/-/g, '/'));
  const endTime = new Date(routine.gr_end_day_and_time.replace(/-/g, '/'));

  const startDay = convertDateToDayString(startTime);
  const endDay = convertDateToDayString(endTime);
  console.log('action startTime', startTime);
  console.log('action endTime', endTime);
  console.log('action startDay', startDay);
  console.log('action endDay', endDay);

  const getTimes = (a_day_time, b_day_time) => {
    const [a_start_time, b_start_time] = [
      a_day_time.substring(10, a_day_time.length),
      b_day_time.substring(10, b_day_time.length),
    ];
    const [a_HMS, b_HMS] = [
      a_start_time
        .substring(0, a_start_time.length - 3)
        .replace(/\s{1,}/, '')
        .split(':'),
      b_start_time
        .substring(0, b_start_time.length - 3)
        .replace(/\s{1,}/, '')
        .split(':'),
    ];
    const [a_parity, b_parity] = [
      a_start_time
        .substring(a_start_time.length - 3, a_start_time.length)
        .replace(/\s{1,}/, ''),
      b_start_time
        .substring(b_start_time.length - 3, b_start_time.length)
        .replace(/\s{1,}/, ''),
    ];

    let [a_time, b_time] = [0, 0];
    if (a_parity === 'PM' && a_HMS[0] !== '12') {
      console.log(
        'loggy-1: a_HMS[0] = ',
        a_HMS[0],
        ', a_HMS[0] === "12" ? ',
        a_HMS[0] === '12'
      );
      const hoursInt = parseInt(a_HMS[0]) + 12;
      a_HMS[0] = `${hoursInt}`;
    } else if (a_parity === 'AM' && a_HMS[0] === '12') a_HMS[0] = '00';

    if (b_parity === 'PM' && b_HMS[0] !== '12') {
      const hoursInt = parseInt(b_HMS[0]) + 12;
      b_HMS[0] = `${hoursInt}`;
    } else if (b_parity === 'AM' && b_HMS[0] === '12') b_HMS[0] = '00';

    for (let i = 0; i < a_HMS.length; i++) {
      a_time += Math.pow(60, a_HMS.length - i - 1) * parseInt(a_HMS[i]);
      b_time += Math.pow(60, b_HMS.length - i - 1) * parseInt(b_HMS[i]);
    }

    return [a_time, b_time];
  };

  useEffect(() => {
    if (editingATSContext.editingATS.newItem.at_unique_id === undefined) {
      editingATSContext.setEditingATS({
        ...editingATSContext.editingATS,
        newItem: {
          ...editingATSContext.editingATS.newItem,
          start_day: startDay,
          end_day: endDay,
          at_available_start_time: convertDateToTimeString(
            new Date(routine.gr_start_day_and_time.replace(/-/g, '/'))
          ),
          at_available_end_time: convertDateToTimeString(
            new Date(routine.gr_end_day_and_time.replace(/-/g, '/'))
          ),
        },
      });
    }
  }, [
    editingATSContext.editingATS.newItem.start_day,
    editingATSContext.editingATS.newItem.end_day,
  ]);

  console.log(
    'action start_day',
    editingATSContext.editingATS.newItem.start_day
  );
  console.log('action end_day', editingATSContext.editingATS.newItem.end_day);

  const updateATS = (e) => {
    e.stopPropagation();
    editingATSContext.setEditingATS({
      ...editingATSContext.editingATS,
      editing: true,
    });
    let object = { ...editingATSContext.editingATS.newItem };

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
    //
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
    object.gr_id = routine.gr_unique_id;
    delete object.at_title;
    const numHours = object.numMins >= 60 ? object.numMins / 60 : '00';
    let numMins = object.numMins % 60;
    if (numMins < 10) numMins = '0' + numMins;
    object.expected_completion_time = `${numHours}:${numMins}:00`;
    delete object.numMins;
    object.id = editingATSContext.editingATS.newItem.at_unique_id;
    object.user_id = props.CurrentId;
    console.log('obj', object);
    object.photo = image;
    delete object.photo;
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

    formData.append('photo', image);
    if (object.id != undefined) {
      console.log('update AT');

      const updateDB = async () => {
        await axios
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

        console.log(
          'getting actionsTasks with full URL: ',
          BASE_URL + 'actionsTasks/' + props.routineID.goal_routine_id
        );
        await axios
          .get(BASE_URL + 'actionsTasks/' + props.routineID.goal_routine_id)
          .then((response) => {
            console.log('actionsTasks-response: ', response);
            const temp = [];
            for (var i = 0; i < response.data.result.length; i++) {
              temp.push(response.data.result[i]);
            }
            temp.sort((a, b) => {
              const [a_start, b_start] = [
                new Date(a.at_datetime_started),
                new Date(b.at_datetime_started),
              ];
              const [a_end, b_end] = [
                new Date(a.at_datetime_completed),
                new Date(b.at_datetime_completed),
              ];

              const [a_start_time, b_start_time] = getTimes(
                a.at_datetime_started,
                b.at_datetime_started
              );
              const [a_end_time, b_end_time] = getTimes(
                a.at_datetime_completed,
                b.at_datetime_completed
              );

              if (a_start_time < b_start_time) return -1;
              else if (a_start_time > b_start_time) return 1;
              else {
                if (a_end_time < b_end_time) return -1;
                else if (a_end_time > b_end_time) return 1;
                else {
                  if (a_start < b_start) return -1;
                  else if (a_start > b_start) return 1;
                  else {
                    if (a_end < b_end) return -1;
                    else if (a_end > b_end) return 1;
                  }
                }
              }

              return 0;
            });

            const tempObj = {};
            for (const key in props.getActionsEndPoint) {
              tempObj[key] = props.getActionsEndPoint[key];
            }
            tempObj[props.routineID.goal_routine_id] = temp;
            console.log(
              'here 0: props.gaep = ',
              props.getActionsEndPoint,
              '\ntempObj = ',
              tempObj
            );

            props.setGetActionsEndPoint(tempObj);
          })
          .catch((error) => {
            console.log('actionsTasks error = ', error);
          });
      };

      updateDB();
    } else {
      const addToDB = async () => {
        await axios
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

        await axios
          .get(BASE_URL + 'actionsTasks/' + props.routineID.gr_unique_id)
          .then((response) => {
            console.log('actionsTasks-response: ', response);
            const temp = [];
            for (var i = 0; i < response.data.result.length; i++) {
              temp.push(response.data.result[i]);
            }
            temp.sort((a, b) => {
              const [a_start, b_start] = [
                new Date(a.at_datetime_started),
                new Date(b.at_datetime_started),
              ];
              const [a_end, b_end] = [
                new Date(a.at_datetime_completed),
                new Date(b.at_datetime_completed),
              ];

              const [a_start_time, b_start_time] = getTimes(
                a.at_datetime_started,
                b.at_datetime_started
              );
              const [a_end_time, b_end_time] = getTimes(
                a.at_datetime_completed,
                b.at_datetime_completed
              );

              if (a_start_time < b_start_time) return -1;
              else if (a_start_time > b_start_time) return 1;
              else {
                if (a_end_time < b_end_time) return -1;
                else if (a_end_time > b_end_time) return 1;
                else {
                  if (a_start < b_start) return -1;
                  else if (a_start > b_start) return 1;
                  else {
                    if (a_end < b_end) return -1;
                    else if (a_end > b_end) return 1;
                  }
                }
              }

              return 0;
            });
            const tempObj = {};
            for (const key in props.getActionsEndPoint) {
              tempObj[key] = props.getActionsEndPoint[key];
            }
            tempObj[props.routineID.gr_unique_id] = temp;
            console.log(
              'here 0: props.gaep = ',
              props.getActionsEndPoint,
              '\ntempObj = ',
              tempObj
            );

            props.setGetActionsEndPoint(tempObj);
          })
          .catch((error) => {
            console.log('actionsTasks error = ', error);
          });
      };
      addToDB();
    }
  };

  const uploadImageModal = () => {
    return (
      <Modal
        show={showUploadImage}
        onHide={() => {
          setShowUploadImage(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload Image</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div>Upload Image</div>
          <input
            type="file"
            onChange={(e) => {
              console.log('here: selecting image');
              if (e.target.files[0]) {
                const image1 = e.target.files[0];
                // console.log(image1.name);
                console.log('image1 = ', image1);
                setImage(image1);
              }
            }}
          />
          <Button
            variant="dark"
            onClick={() => {
              console.log('here: uploading image');
              if (image === null) {
                alert('Please select an image to upload');
                return;
              }
              const salt = Math.floor(Math.random() * 9999999999);
              let image_name = image.name;
              image_name = image_name + salt.toString();
              setImageName(image_name);
              setImageURL(URL.createObjectURL(image));
              console.log('URL: ', URL.createObjectURL(image));
              editingATSContext.setEditingATS({
                ...editingATSContext.editingATS,
                newItem: {
                  ...editingATSContext.editingATS.newItem,
                  photo: image,
                  photo_url: '',
                },
              });
              console.log(
                'xxx ATS photo',
                editingATSContext.editingATS.newItem.photo
              );
            }}
          >
            Upload
          </Button>
          <img
            src={imageURL || 'http://via.placeholder.com/400x300'}
            alt="Uploaded images"
            height="300"
            width="400"
          />
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowUploadImage(false);
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              console.log('here: Confirming changes');
              setPhoto(imageURL);
              setShowUploadImage(false);
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
  return (
    <div
      style={{
        marginTop: '1rem',
        marginLeft: '2rem',
        marginRight: '3rem',
        width: '50%',
        backgroundColor: '#4D94FF',
        color: '#000000',
      }}
    >
      {uploadImageModal()}
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
                <div
                  onClick={() => setShowUploadImage(!showUploadImage)}
                  style={{
                    marginLeft: '12px',
                    marginBottom: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Upload from Computer
                </div>
                <AddIconModal photoUrl={photo} setPhotoUrl={setPhoto} />
                <UploadImage
                  photoUrl={photo}
                  setPhotoUrl={setPhoto}
                  currentUserId={props.CurrentId}
                />
                <GooglePhotos photoUrl={photo} setPhotoUrl={setPhoto} />
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
                  if (
                    e.target.value <
                    editingATSContext.editingATS.newItem.start_day
                  )
                    return;
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
                  if (e.target.value < 0) return;
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
            {console.log(
              'editingATSContext.editingATS.newItem.is_available = ',
              editingATSContext.editingATS.newItem.is_available
            )}
            {(editingATSContext.editingATS.newItem.is_available === 'True' ||
              editingATSContext.editingATS.newItem.is_available === true) &&
            (editingATSContext.editingATS.newItem.is_displayed_today ===
              'True' ||
              editingATSContext.editingATS.newItem.is_displayed_today ===
                true) ? (
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
                  width: '127px',
                  height: '37px',
                  padding: '0',
                  margin: '0 20px',
                  background: '#09B4FF 0% 0% no-repeat padding-box',
                  boxShadow: '0px 3px 6px #00000029',
                  borderRadius: '5px',
                  textAlign: 'center',
                  border: '1px solid #09B4FF',
                  color: '#FFFFFF',
                  font: 'normal normal 600 16px Quicksand-Book',
                }}
                onClick={updateATS}
              >
                Save
              </button>
              <button
                style={{
                  width: '127px',
                  height: '37px',
                  padding: '0',
                  margin: '0 20px',
                  background: ' #FFFFFF 0% 0% no-repeat padding-box',
                  boxShadow: '0px 3px 6px #00000029',
                  border: '1px solid #A7A7A7',
                  borderRadius: '5px',
                  textAlign: 'center',
                  color: '#7D7D7D',
                  font: 'normal normal 600 16px Quicksand-Book',
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
            </div>
          </Row>
        </Col>
      </Container>
    </div>
  );
};

export default EditATS;
