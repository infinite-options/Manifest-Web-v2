import React, { useContext, useState } from 'react';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import EditRTSContext from './EditRTSContext';
import moment from 'moment';
import axios from 'axios';
import AddIconModal from '../AddIconModal';
import UploadImage from '../UploadImage';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const EditRTS = (props) => {
  const editingRTSContext = useContext(EditRTSContext);

  const [photo, setPhoto] = useState(
    editingRTSContext.editingRTS.newItem.gr_photo
  );
  const [showUploadImage, toggleUploadImage] = useState(false);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [imageURL, setImageURL] = useState('');

  const getTimes = (a_day_time, b_day_time) => {
    const [a_start_time, b_start_time] = [a_day_time.substring(10, a_day_time.length), b_day_time.substring(10, b_day_time.length)];
    const [a_HMS, b_HMS] = [a_start_time.substring(0, a_start_time.length - 3).replace(/\s{1,}/, '').split(':'),
      b_start_time.substring(0, b_start_time.length - 3).replace(/\s{1,}/, '').split(':')];
    const [a_parity, b_parity] = [a_start_time.substring(a_start_time.length - 3, a_start_time.length).replace(/\s{1,}/, ''),
      b_start_time.substring(b_start_time.length - 3, b_start_time.length).replace(/\s{1,}/, '')];
    
    let [a_time, b_time] = [0, 0];
    if (a_parity === 'PM' && a_HMS[0] !== '12')
    {
      const hoursInt = parseInt(a_HMS[0]) + 12;
      a_HMS[0] = `${hoursInt}`;
    }
    else if (a_parity === 'AM' && a_HMS[0] === '12')
      a_HMS[0] = '00';

    if (b_parity === 'PM' && b_HMS[0] !== '12')
    {
      const hoursInt = parseInt(b_HMS[0]) + 12;
      b_HMS[0] = `${hoursInt}`;
    }
    else if (b_parity === 'AM' && b_HMS[0] === '12')
      b_HMS[0] = '00';

    for (let i = 0; i < a_HMS.length; i++)
    {
      a_time += Math.pow(60, (a_HMS.length - i - 1)) * parseInt(a_HMS[i]);
      b_time += Math.pow(60, (b_HMS.length - i - 1)) * parseInt(b_HMS[i]);
    }
    
    return [a_time, b_time];
  };

  console.log('Repeat', editingRTSContext.editingRTS.newItem.repeat);
  const updateRTS = (e) => {
    console.log('here: entering updateRTS function');
    editingRTSContext.setEditingRTS(
      {
        ...editingRTSContext.editingRTS,
        editing: true,
      }
    );
    // editingRTSContext.editingRTS.editing = !editingRTSContext.editingRTS.editing;
    e.stopPropagation()
    let object = {...editingRTSContext.editingRTS.newItem};
    console.log("updaterts object", object);
    console.log('propsrts: ', props);
    // Get start_day_and_time
    const start_day_and_time_simple_string = `${object.start_day} ${object.start_time}:00`;
    //const start_day_and_time_string = new Date(start_day_and_time_simple_string).toString();
    const convertedStartTime = moment(start_day_and_time_simple_string).format(
      'LTS'
    );
    object.start_day_and_time =
      `${object.start_day}` + ' ' + convertedStartTime; //start_day_and_time_string;
    delete object.start_day;
    delete object.start_time;
    object.title = object.gr_title;
    delete object.gr_title;
    delete object.gr_completed;
    delete object.gr_datetime_completed;
    delete object.gr_datetime_started;
    object.photo_url = photo;
    delete object.gr_photo;
    delete object.gr_unique_id;
    //object.id = Number(object.id);
    delete object.location;
    delete object.notification;
   // object.is_available = 'True';
    // Get end_day_and_time
    const end_day_and_time_simple_string = `${object.end_day} ${object.end_time}:00`;

    console.log('end day', object.end_day);
    console.log('end time', object.end_time);
    //const end_day_and_time_string = new Date(end_day_and_time_simple_string).toString();
    const convertedEndTime = moment(end_day_and_time_simple_string).format(
      'LTS'
    );
    console.log('convertedEndTime', convertedEndTime);
    object.end_day_and_time = `${object.end_day}` + ' ' + convertedEndTime;
    delete object.end_day;
    delete object.end_time;
    // Get expected_completion_time
    const numHours = object.numMins > 60 ? object.numMins / 60: '00';
    let numMins = object.numMins % 60;
    if(numMins < 10)
      numMins = '0' + numMins
      object.expected_completion_time = `${numHours}:${numMins}:00`;
    delete object.numMins;
    object.id = editingRTSContext.editingRTS.id;
    object.user_id = props.CurrentId; // editingRTSContext.editingRTS.currentUserId;
    object.ta_people_id = props.ta_ID;
    object.photo = image;
    delete object.photo
    // if (image != null) {
    //   console.log('trying to upload',image)
    //   object.photo = image
    //   object.photo_url = null
    // }
    
    console.log("obj",object);
    let formData = new FormData();
    Object.entries(object).forEach((entry) => {
      // if (typeof entry[1].name == 'string'){
      if (typeof entry[1] == 'string'){
          formData.append(entry[0], entry[1]);
      }
      else if (entry[1] instanceof Object) {
          entry[1] = JSON.stringify(entry[1])
          formData.append(entry[0], entry[1]);
      }
      
      else{
          formData.append(entry[0], entry[1]);
      }
    });
    console.log('photo: ', image);
    formData.append('photo', image);

    console.log('===================formData: for RTS=======================');
    for(var pair of formData.entries()) {
      console.log('formData: ', pair);
    }
    console.log('object.id') 
    console.log(object.id)
    if (object.id != '') {
      console.log('updateGR');
      console.log('here: About to post changes to db');
      async function updateDB() {
        await axios
        .post(BASE_URL + 'updateGR', formData)
        .then((_) => {
          console.log('editrts', _)
          const gr_array_index = editingRTSContext.editingRTS.gr_array.findIndex((elt) => elt.id === editingRTSContext.editingRTS.id)
          const new_gr_array = [...editingRTSContext.editingRTS.gr_array];
          new_gr_array[gr_array_index] = object;
          console.log('here: Changes made to db');
          editingRTSContext.setEditingRTS({
            ...editingRTSContext.editingRTS,
            gr_array: new_gr_array,
            editing: false
          });
        })
        .catch((err) => {
          if(err.response) {
            console.log(err.response);
          }
          console.log(err)
        });

        await axios
        .get(BASE_URL + "getgoalsandroutines/" + props.CurrentId)
        .then((response) =>{
            const temp = [];
            for(var i=0; i <response.data.result.length; i++){
                temp.push(response.data.result[i]);
            }
            temp.sort((a, b) => {
              const [a_start, b_start] = [new Date(a.gr_start_day_and_time), new Date(b.gr_start_day_and_time)];
              const [a_end, b_end] = [new Date(a.gr_end_day_and_time), new Date(b.gr_end_day_and_time)];
  
              const [a_start_time, b_start_time] = getTimes(a.gr_start_day_and_time, b.gr_start_day_and_time);
              const [a_end_time, b_end_time] = getTimes(a.gr_end_day_and_time, b.gr_end_day_and_time);
  
              if (a_start_time < b_start_time)
                return -1;
              else if (a_start_time > b_start_time)
                return 1;
              else {
                if (a_end_time < b_end_time)
                  return -1;
                else if (a_end_time > b_end_time)
                  return 1;
                else {
                  if (a_start < b_start)
                    return -1;
                  else if (a_start > b_start)
                    return 1;
                  else {
                    if (a_end < b_end)
                      return -1;
                    else if (a_end > b_end)
                      return 1;
                  }
                }
              }
  
              return 0;
            });
            props.setGetGoalsEndPoint(temp);
        })
        .catch((error) => {
            console.log(error);
        });
      }

      updateDB();
    } else {
      console.log('addGR')
      const addToDB = async () => {
        await axios
        .post(BASE_URL + 'addGR', formData)
        .then((_) => {
          console.log(_)
          const gr_array_index = editingRTSContext.editingRTS.gr_array.findIndex((elt) => elt.id === editingRTSContext.editingRTS.id)
          const new_gr_array = [...editingRTSContext.editingRTS.gr_array];
          new_gr_array[gr_array_index] = object;
          editingRTSContext.setEditingRTS({
            ...editingRTSContext.editingRTS,
            gr_array: new_gr_array,
            editing: false
          });
        })
        .catch((err) => {
          if(err.response) {
            console.log(err.response);
          }
        });

        await axios
        .get(BASE_URL + "getgoalsandroutines/" + props.CurrentId)
        .then((response) =>{
            const temp = [];
            for(var i=0; i <response.data.result.length; i++){
                temp.push(response.data.result[i]);
            }
            temp.sort((a, b) => {
              const [a_start, b_start] = [new Date(a.gr_start_day_and_time), new Date(b.gr_start_day_and_time)];
              const [a_end, b_end] = [new Date(a.gr_end_day_and_time), new Date(b.gr_end_day_and_time)];
  
              const [a_start_time, b_start_time] = getTimes(a.gr_start_day_and_time, b.gr_start_day_and_time);
              const [a_end_time, b_end_time] = getTimes(a.gr_end_day_and_time, b.gr_end_day_and_time);
  
              if (a_start_time < b_start_time)
                return -1;
              else if (a_start_time > b_start_time)
                return 1;
              else {
                if (a_end_time < b_end_time)
                  return -1;
                else if (a_end_time > b_end_time)
                  return 1;
                else {
                  if (a_start < b_start)
                    return -1;
                  else if (a_start > b_start)
                    return 1;
                  else {
                    if (a_end < b_end)
                      return -1;
                    else if (a_end > b_end)
                      return 1;
                  }
                }
              }
  
              return 0;
            });
            props.setGetGoalsEndPoint(temp);
        })
        .catch((error) => {
            console.log(error);
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
          toggleUploadImage(false);
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
              setImageURL(URL.createObjectURL(image))
              console.log('URL: ', URL.createObjectURL(image));
              editingRTSContext.setEditingRTS({
                ...editingRTSContext.editingRTS,
                newItem: {
                  ...editingRTSContext.editingRTS.newItem,
                  photo: image,
                  photo_url: ''
                }
              });
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
              toggleUploadImage(false);
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              console.log('here: Confirming changes');
              setPhoto(imageURL);
              toggleUploadImage(false);
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
        //marginRight: '3rem',
        width: '90%',
        backgroundColor: '#F57045',
        color: '#ffffff',
      }}
    >
      {uploadImageModal()}
      <Container
        style={{
          paddingLeft: '1rem',
          paddingTop: '1rem',

          width: '100%',
        }}
      >
        <Col style={{ float: 'left', width: '30%' }}>
          <div style={{ fontWeight: 'bold', fontSize: '20px' }}>
            Routine Name{' '}
          </div>
          <input
            style={{
              borderRadius: '10px',
              border: 'none',
              width: '100%',
              marginTop: '20px',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
            value={editingRTSContext.editingRTS.newItem.gr_title}
            onChange={(e) => {
              editingRTSContext.setEditingRTS({
                ...editingRTSContext.editingRTS,
                newItem: {
                  ...editingRTSContext.editingRTS.newItem,
                  gr_title: e.target.value,
                },
              });
            }}
          />

          <div
            style={{
              fontWeight: 'bold',
              fontSize: '20px',
              marginTop: '20px',
              marginBottom: '20px',
            }}
          >
            Change Icon
          </div>

          <Row>
            <Col
              style={{
                width: '100%',
                float: 'left',
                fontSize: '14px',
                textAlign: 'center',
                textDecoration: 'underline',
              }}
            >
              <div
                onClick={() => {
                  toggleUploadImage(!showUploadImage);
                }}
              >
                Add icon to library
              </div>
              <AddIconModal
                photoUrl={photo}
                setPhotoUrl={setPhoto}
                //  BASE_URL={props.BASE_URL}
                //  parentFunction={setPhotoURLFunction}
              />
              {/* <div>Use icon from library</div> */}
              {/* <div>User's library</div> */}
              <UploadImage
                //  BASE_URL={props.BASE_URL}
                //  parentFunction={setPhotoURLFunction}
                photoUrl={photo}
                setPhotoUrl={setPhoto}
                currentUserId={editingRTSContext.editingRTS.currentUserId}
              />
            </Col>
            <Col style={{ float: 'right' }}>
              <img alt="icon" src={photo} style={{ width: '100%' }} />
            </Col>
          </Row>

          <div style={{ fontWeight: 'bold', fontSize: '20px' }}>Start Time</div>
          <Container>
            <Row>
              <Col
                sm={7}
                style={{
                  margin: '0',
                  padding: '0',
                }}
              >
                <input
                  style={{
                    width: '100%',
                    borderRadius: '10px',
                    border: 'none',
                    height: '26px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  type="date"
                  value={editingRTSContext.editingRTS.newItem.start_day}
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        start_day: e.target.value,
                      },
                    });
                  }}
                />
              </Col>
              <Col sm={5}>
                <input
                  style={{
                    width: '100%',
                    borderRadius: '10px',
                    border: 'none',
                    height: '26px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  type="time"
                  value={editingRTSContext.editingRTS.newItem.start_time}
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        start_time: e.target.value,
                      },
                    });
                  }}
                />
              </Col>
            </Row>
          </Container>
          <div
            style={{ fontWeight: 'bold', fontSize: '20px', marginTop: '10px' }}
          >
            This Takes Me
          </div>
          <div>
            <input
              type="number"
              style={{
                borderRadius: '10px',
                border: 'none',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
              value={editingRTSContext.editingRTS.newItem.numMins}
              onChange={(e) => {
                if (e.target.value < 0)
                  return;
                editingRTSContext.setEditingRTS({
                  ...editingRTSContext.editingRTS,
                  newItem: {
                    ...editingRTSContext.editingRTS.newItem,
                    numMins: e.target.value,
                  },
                });
              }}
            />
            <span style={{ fontSize: '20px' }}> Minutes </span>
          </div>
          <div
            style={{ fontWeight: 'bold', fontSize: '20px', marginTop: '10px' }}
          >
            End Time
          </div>
          <Container>
            <Row>
              <Col
                sm={7}
                style={{
                  margin: '0',
                  padding: '0',
                }}
              >
                <input
                  style={{
                    width: '100%',
                    borderRadius: '10px',
                    border: 'none',
                    height: '26px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  type="date"
                  value={editingRTSContext.editingRTS.newItem.end_day}
                  onChange={(e) => {
                    if (e.target.value < editingRTSContext.editingRTS.newItem.start_day)
                      return;
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        end_day: e.target.value,
                      },
                    });
                  }}
                />
              </Col>
              <Col sm={5}>
                <input
                  style={{
                    width: '100%',
                    borderRadius: '10px',
                    border: 'none',
                    height: '26px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  type="time"
                  value={editingRTSContext.editingRTS.newItem.end_time}
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        end_time: e.target.value,
                      },
                    });
                  }}
                />
              </Col>
            </Row>
          </Container>
        </Col>

        <div
          style={{
            float: 'left',
            backgroundColor: 'white',
            width: '2px',
            height: '500px',
            marginLeft: '2.4%',
            marginRight: '2.4%',
          }}
        />

        <Col style={{ float: 'left', width: '30%' }}>
          <Row style={{ fontWeight: 'bold', fontSize: '20px' }}>
            Repeating Options
          </Row>

          <Row
            style={{
              padding: '10px 0 0 0',
            }}
          >
            <Col style={{ margin: '10px 0' }}>
              <Row style={{ marginBottom: '20px', verticalAlign: 'middle' }}>
                <div style={{ width: '20%', float: 'left' }}></div>
                <div style={{ width: '80%', float: 'left' }}>
                  <div
                    style={{ width: '100%' }}
                    onClick={() => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          repeat: !editingRTSContext.editingRTS.newItem.repeat,
                          repeat_type: '',
                        },
                      });
                    }}
                  >
                    <input
                      type="radio"
                      style={{
                        width: '10%',
                        height: '20px',
                        borderRadius: '10px',
                        float: 'left',
                      }}
                      checked={
                        editingRTSContext.editingRTS.newItem.repeat ===
                          'False' ||
                        editingRTSContext.editingRTS.newItem.repeat === false
                      }
                    />
                    <div
                      style={{
                        marginLeft: '2%',
                        minWidth: '82%',
                        float: 'left',
                      }}
                    >
                      Does not repeat
                    </div>
                  </div>
                </div>

                {/* Does not repeat */}
                {console.log(
                  'repeat value =',
                  editingRTSContext.editingRTS.newItem.repeat
                )}
                {/* {editingRTSContext.editingRTS.newItem.repeat == 'False' ? (
                    <input
                    name='repeating'
                    id='repeating'
                    type='checkbox'
                    //type='radio'
                    defaultChecked  = 'true'
                    //checked={editingRTSContext.editingRTS.newItem.repeat=== 'False'}
                    style={{width: '20px', height: '20px', marginLeft: '10px', borderRadius: '50%'}}
                    onChange={(e) => {
                      console.log('in false')
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          repeat: !e.target.checked
                        }
                      })
                    }}
                  />
                  ) : (
                    <input
                    name='repeating'
                    id='repeating'
                    type='checkbox'
                    //type='radio'
                    // checked={editingRTSContext.editingRTS.newItem.repeat}
                    style={{width: '20px', height: '20px', marginLeft: '10px', borderRadius: '50%'}}
                    onChange={(e) => {
                      console.log('in true')
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          repeat: !e.target.checked
                        }
                      })
                    }}
                  />
                  )} */}

                {/* <input
                    name='repeating'
                    type='checkbox'
                    defaultChecked={editingRTSContext.editingRTS.newItem.repeat}
                    style={{width: '20px', height: '20px', marginLeft: '10px'}}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          repeat: e.target.checked
                        }
                      })
                    }}
                  /> */}
              </Row>
              <Row style={{ verticalAlign: 'middle' }}>
                <div
                  style={{
                    float: 'left',
                    marginRight: '8px',
                    display: 'inline-block',
                  }}
                >
                  Repeat Every
                </div>
                <div
                  style={{
                    float: 'left',
                    marginRight: '8px',
                    display: 'inline-block',
                  }}
                >
                  <input
                    type="number"
                    style={{
                      width: '60px',
                      margin: '0px 0',
                      borderRadius: '10px',
                      border: 'none',
                      float: 'left',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                    value={(editingRTSContext.editingRTS.newItem.repeat === 'False' ||
                      editingRTSContext.editingRTS.newItem.repeat === false) ?
                      1 : editingRTSContext.editingRTS.newItem.repeat_every
                    }
                    onChange={(e) => {
                      if ((e.target.value !== '' && e.target.value < 1) ||
                        editingRTSContext.editingRTS.newItem.repeat === 'False' ||
                        editingRTSContext.editingRTS.newItem.repeat === false
                      )
                        return;
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          repeat_every: e.target.value,
                        },
                      });
                    }}
                  />
                </div>

                <div
                  style={{
                    float: 'left',
                    marginRight: '8px',
                    display: 'inline-block',
                  }}
                >
                  Days
                </div>
              </Row>

              <Row style={{ marginTop: '20px', verticalAlign: 'middle' }}>
                <div style={{ float: 'left', width: '20%' }}> Ends </div>
                <div style={{ float: 'left', width: '80%' }}>
                  <div
                    style={{
                      verticalAlign: 'middle',
                      width: '100%',
                      height: '30%',
                      marginBottom: '3%',
                    }}
                  >
                    <input
                      name="repeatingEnd"
                      type="radio"
                      style={{
                        width: '10%',
                        height: '20px',
                        borderRadius: '10px',
                        float: 'left',
                      }}
                      value="On"
                      checked={
                        editingRTSContext.editingRTS.newItem.repeat_type ===
                        'On'
                      }
                      onChange={(e) => {
                        editingRTSContext.setEditingRTS({
                          ...editingRTSContext.editingRTS,
                          newItem: {
                            ...editingRTSContext.editingRTS.newItem,
                            repeat_type: e.target.value,
                            repeat: 'True',
                          },
                        });
                      }}
                    />

                    <div
                      style={{
                        float: 'left',
                        marginLeft: '2%',
                        marginRight: '2%',
                        width: '16%',
                      }}
                    >
                      On
                    </div>

                    <input
                      style={{
                        borderRadius: '10px',
                        border: 'none',
                        width: '70%',
                        float: 'left',
                        height: '26px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                      type="date"
                      value={
                        editingRTSContext.editingRTS.newItem.repeat_ends_on
                      }
                      onChange={(e) => {
                        editingRTSContext.setEditingRTS({
                          ...editingRTSContext.editingRTS,
                          newItem: {
                            ...editingRTSContext.editingRTS.newItem,
                            repeat_ends_on: e.target.value,
                          },
                        });
                      }}
                    />
                  </div>

                  <div
                    style={{
                      verticalAlign: 'middle',
                      width: '100%',
                      height: '30%',
                      marginBottom: '3%',
                    }}
                  >
                    <input
                      style={{
                        borderRadius: '10px',
                        border: 'none',
                        marginRight: '2%',
                        float: 'left',
                        width: '10%',
                        height: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                      name="repeatingEnd"
                      type="radio"
                      value="Occur"
                      checked={
                        editingRTSContext.editingRTS.newItem.repeat_type ===
                        'Occur'
                      }
                      onChange={(e) => {
                        editingRTSContext.setEditingRTS({
                          ...editingRTSContext.editingRTS,
                          newItem: {
                            ...editingRTSContext.editingRTS.newItem,
                            repeat_type: e.target.value,
                            repeat: 'True',
                          },
                        });
                      }}
                    />
                    <div style={{ float: 'left', width: '20%' }}>After</div>
                    <input
                      style={{
                        width: '20%',
                        borderRadius: '10px',
                        border: 'none',
                        marginLeft: '2%',
                        float: 'left',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                      type="number"
                      value={
                        editingRTSContext.editingRTS.newItem.repeat_occurences
                      }
                      onChange={(e) => {
                        editingRTSContext.setEditingRTS({
                          ...editingRTSContext.editingRTS,
                          newItem: {
                            ...editingRTSContext.editingRTS.newItem,
                            repeat_occurences: e.target.value,
                          },
                        });
                      }}
                    />
                    <div
                      style={{ marginLeft: '2%', width: '44%', float: 'left' }}
                    >
                      Occurences
                    </div>
                  </div>
                  <div
                    style={{
                      verticalAlign: 'middle',
                      width: '100%',
                      height: '30%',
                      marginBottom: '3%',
                    }}
                  >
                    <input
                      style={{
                        borderRadius: '10px',
                      }}
                      name="repeatingEnd"
                      type="radio"
                      style={{
                        width: '10%',
                        height: '20px',
                        marginRight: '2%',
                        float: 'left',
                      }}
                      value="Never"
                      checked={
                        editingRTSContext.editingRTS.newItem.repeat_type ===
                        'Never'
                      }
                      onChange={(e) => {
                        editingRTSContext.setEditingRTS({
                          ...editingRTSContext.editingRTS,
                          newItem: {
                            ...editingRTSContext.editingRTS.newItem,
                            repeat_type: e.target.value,
                            repeat: 'True',
                          },
                        });
                      }}
                    />
                    <div style={{ float: 'left', width: '88%' }}>
                      Never Ends
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '40px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '20px' }}>
                    Location
                  </div>
                  <input
                    style={{
                      margin: '5px 0',
                      borderRadius: '10px',
                      border: 'none',
                      width: '100%',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                    value={editingRTSContext.editingRTS.newItem.location}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          location: e.target.value,
                        },
                      });
                    }}
                  />
                  <span> Available to User </span>
                  {console.log('is_avail? ', editingRTSContext.editingRTS.newItem.is_available)}
                  {editingRTSContext.editingRTS.newItem.is_available ===
                  'True' || editingRTSContext.editingRTS.newItem.is_available === true ? (
                    <input
                      type="checkbox"
                      style={{ width: '20px', height: '20px' }}
                      defaultChecked="true"
                      onChange={(e) => {
                        editingRTSContext.setEditingRTS({
                          ...editingRTSContext.editingRTS,
                          newItem: {
                            ...editingRTSContext.editingRTS.newItem,
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
                        editingRTSContext.setEditingRTS({
                          ...editingRTSContext.editingRTS,
                          newItem: {
                            ...editingRTSContext.editingRTS.newItem,
                            is_available: e.target.checked,
                          },
                        });
                      }}
                    />
                  )}
                </div>
              </Row>
            </Col>
          </Row>
        </Col>

        <div
          style={{
            float: 'left',
            backgroundColor: 'white',
            width: '2px',
            height: '500px',
            marginLeft: '2.4%',
            marginRight: '2.4%',
          }}
        />

        <Col style={{ float: 'left', width: '29%' }}>
          <Row style={{ fontWeight: 'bold', fontSize: '20px' }}>
            Notification
          </Row>

          <Row
            style={{
              padding: '10px 0 0 0',
            }}
          >
            <Row>
              <div
                style={{
                  margin: '10px 0',
                  marginLeft: '20px',
                }}
              >
                <input
                  type="number"
                  style={{
                    width: '60px',
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  value={
                    editingRTSContext.editingRTS.newItem.ta_notifications.before
                      .time
                  }
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        ta_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .ta_notifications,
                          before: {
                            ...editingRTSContext.editingRTS.newItem
                              .ta_notifications.before,
                            time: e.target.value,
                          },
                        },
                        user_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .user_notifications,
                          before: {
                            ...editingRTSContext.editingRTS.newItem
                              .user_notifications.before,
                            time: e.target.value,
                          },
                        },
                      },
                    });
                  }}
                />
                &nbsp; Mins Before Start Time
              </div>
              <div
                style={{
                  margin: '10px 0',
                  marginLeft: '20px',
                }}
              >
                User &nbsp;
                <input
                  type="checkbox"
                  style={{ width: '20px', height: '20px' }}
                  checked={
                    editingRTSContext.editingRTS.newItem.user_notifications
                      .before.is_enabled !== 'False' && editingRTSContext.editingRTS.newItem.user_notifications
                      .before.is_enabled !== false
                  }
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        user_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .user_notifications,
                          before: {
                            ...editingRTSContext.editingRTS.newItem
                              .user_notifications.before,
                            is_enabled: e.target.checked,
                            is_set: e.target.checked,
                          },
                        },
                      },
                    });
                  }}
                />
                &nbsp;
                <input
                  style={{
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  value={
                    editingRTSContext.editingRTS.newItem.user_notifications
                      .before.message
                  }
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        user_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .user_notifications,
                          before: {
                            ...editingRTSContext.editingRTS.newItem
                              .user_notifications.before,
                            message: e.target.value,
                          },
                        },
                      },
                    });
                  }}
                />
              </div>
              <div
                style={{
                  margin: '10px 0',
                  marginLeft: '20px',
                }}
              >
                TA &nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  type="checkbox"
                  style={{ width: '20px', height: '20px' }}
                  checked={
                    editingRTSContext.editingRTS.newItem.ta_notifications.before
                      .is_enabled !== 'False' && editingRTSContext.editingRTS.newItem.ta_notifications.before
                      .is_enabled !== false
                  }
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        ta_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .ta_notifications,
                          before: {
                            ...editingRTSContext.editingRTS.newItem
                              .ta_notifications.before,
                            is_enabled: e.target.checked,
                            is_set: e.target.checked,
                          },
                        },
                      },
                    });
                  }}
                />
                &nbsp;
                <input
                  style={{
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  value={
                    editingRTSContext.editingRTS.newItem.ta_notifications.before
                      .message
                  }
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        ta_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .ta_notifications,
                          before: {
                            ...editingRTSContext.editingRTS.newItem
                              .ta_notifications.before,
                            message: e.target.value,
                          },
                        },
                      },
                    });
                  }}
                />
              </div>
            </Row>
            <Row>
              <div
                style={{
                  margin: '10px 0',
                  marginLeft: '20px',
                }}
              >
                <input
                  type="number"
                  style={{
                    width: '60px',
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  value={
                    editingRTSContext.editingRTS.newItem.ta_notifications.during
                      .time
                  }
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        ta_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .ta_notifications,
                          during: {
                            ...editingRTSContext.editingRTS.newItem
                              .ta_notifications.during,
                            time: e.target.value,
                          },
                        },
                        user_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .user_notifications,
                          during: {
                            ...editingRTSContext.editingRTS.newItem
                              .user_notifications.during,
                            time: e.target.value,
                          },
                        },
                      },
                    });
                  }}
                />
                &nbsp; Mins After Start Time
              </div>
              <div
                style={{
                  margin: '10px 0',
                  marginLeft: '20px',
                }}
              >
                User &nbsp;
                <input
                  type="checkbox"
                  style={{ width: '20px', height: '20px' }}
                  checked={
                    editingRTSContext.editingRTS.newItem.user_notifications
                      .during.is_enabled !== 'False' && editingRTSContext.editingRTS.newItem.user_notifications
                      .during.is_enabled !== false
                  }
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        user_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .user_notifications,
                          during: {
                            ...editingRTSContext.editingRTS.newItem
                              .user_notifications.during,
                            is_enabled: e.target.checked,
                            is_set: e.target.checked,
                          },
                        },
                      },
                    });
                  }}
                />
                &nbsp;
                <input
                  style={{
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  value={
                    editingRTSContext.editingRTS.newItem.user_notifications
                      .during.message
                  }
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        user_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .user_notifications,
                          during: {
                            ...editingRTSContext.editingRTS.newItem
                              .user_notifications.during,
                            message: e.target.value,
                          },
                        },
                      },
                    });
                  }}
                />
              </div>
              <div
                style={{
                  margin: '10px 0',
                  marginLeft: '20px',
                }}
              >
                TA &nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  type="checkbox"
                  style={{ width: '20px', height: '20px' }}
                  checked={
                    editingRTSContext.editingRTS.newItem.ta_notifications.during
                      .is_enabled !== 'False' && editingRTSContext.editingRTS.newItem.ta_notifications.during
                      .is_enabled !== false
                  }
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        ta_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .ta_notifications,
                          during: {
                            ...editingRTSContext.editingRTS.newItem
                              .ta_notifications.during,
                            is_enabled: e.target.checked,
                            is_set: e.target.checked,
                          },
                        },
                      },
                    });
                  }}
                />
                &nbsp;
                <input
                  style={{
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  value={
                    editingRTSContext.editingRTS.newItem.ta_notifications.during
                      .message
                  }
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        ta_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .ta_notifications,
                          during: {
                            ...editingRTSContext.editingRTS.newItem
                              .ta_notifications.during,
                            message: e.target.value,
                          },
                        },
                      },
                    });
                  }}
                />
              </div>
            </Row>
            <Row>
              <div
                style={{
                  margin: '10px 0',
                  marginLeft: '20px',
                }}
              >
                <input
                  type="number"
                  style={{
                    width: '60px',
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  value={
                    editingRTSContext.editingRTS.newItem.ta_notifications.after
                      .time
                  }
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        ta_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .ta_notifications,
                          after: {
                            ...editingRTSContext.editingRTS.newItem
                              .ta_notifications.after,
                            time: e.target.value,
                          },
                        },
                        user_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .user_notifications,
                          after: {
                            ...editingRTSContext.editingRTS.newItem
                              .user_notifications.after,
                            time: e.target.value,
                          },
                        },
                      },
                    });
                  }}
                />
                &nbsp; Mins After End Time
              </div>
              <div
                style={{
                  margin: '10px 0',
                  marginLeft: '20px',
                  verticalAlign: 'middle',
                }}
              >
                User &nbsp;
                <input
                  type="checkbox"
                  style={{ width: '20px', height: '20px' }}
                  checked={
                    editingRTSContext.editingRTS.newItem.user_notifications
                      .after.is_enabled !== 'False' && editingRTSContext.editingRTS.newItem.user_notifications
                      .after.is_enabled !== false 
                  }
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        user_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .user_notifications,
                          after: {
                            ...editingRTSContext.editingRTS.newItem
                              .user_notifications.after,
                            is_enabled: e.target.checked,
                            is_set: e.target.checked,
                          },
                        },
                      },
                    });
                  }}
                />
                &nbsp;
                <input
                  style={{
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  value={
                    editingRTSContext.editingRTS.newItem.user_notifications
                      .after.message
                  }
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        user_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .user_notifications,
                          after: {
                            ...editingRTSContext.editingRTS.newItem
                              .user_notifications.after,
                            message: e.target.value,
                          },
                        },
                      },
                    });
                  }}
                />
              </div>
              <div
                style={{
                  margin: '10px 0',
                  marginLeft: '20px',
                }}
              >
                TA &nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  type="checkbox"
                  style={{ width: '20px', height: '20px' }}
                  checked={
                    editingRTSContext.editingRTS.newItem.ta_notifications.after
                      .is_enabled !== 'False' && editingRTSContext.editingRTS.newItem.ta_notifications.after
                      .is_enabled !== false
                  }
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        ta_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .ta_notifications,
                          after: {
                            ...editingRTSContext.editingRTS.newItem
                              .ta_notifications.after,
                            is_enabled: e.target.checked,
                            is_set: e.target.checked,
                          },
                        },
                      },
                    });
                  }}
                />
                &nbsp;
                <input
                  style={{
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  value={
                    editingRTSContext.editingRTS.newItem.ta_notifications.after.message
                  }
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        ta_notifications: {
                          ...editingRTSContext.editingRTS.newItem
                            .ta_notifications,
                          after: {
                            ...editingRTSContext.editingRTS.newItem
                              .ta_notifications.after,
                            message: e.target.value,
                          },
                        },
                      },
                    });
                  }}
                />
              </div>
            </Row>
          </Row>
        </Col>
      </Container>
      <div
        style={{
          textAlign: 'center',
          marginTop: '20px',
          paddingBottom: '20px',
        }}
      >
        <button
          style={{
            width: '150px',
            padding: '0',
            margin: '0 20px',
            backgroundColor: 'inherit',
            border: '3px white solid',
            borderRadius: '30px',
            color: '#ffffff',
            textAlign: 'center',
          }}
          onClick={() => {
            editingRTSContext.setEditingRTS({
              ...editingRTSContext.editingRTS,
              editing: false,
            });
          }}
        >
          Cancel
        </button>
        <button
          style={{
            width: '150px',
            padding: '0',
            margin: '0 20px',
            backgroundColor: 'inherit',
            border: '3px white solid',
            borderRadius: '30px',
            color: '#ffffff',
            textAlign: 'center',
          }}
          onClick={updateRTS}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditRTS;
