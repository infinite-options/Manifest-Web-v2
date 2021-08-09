import React, { useContext, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import EditRTSContext from './EditRTSContext';
import moment from 'moment';
import axios from 'axios';
import AddIconModal from '../AddIconModal';
import UploadImage from '../UploadImage';

const EditRTS = (props) => {


  const editingRTSContext = useContext(EditRTSContext);

  const [photo, setPhoto] = useState(editingRTSContext.editingRTS.newItem.gr_photo)


  console.log("Repeat",editingRTSContext.editingRTS.newItem.repeat)
  const updateRTS = (e) => {
    editingRTSContext.editingRTS.editing = !editingRTSContext.editingRTS.editing
    e.stopPropagation()
    let object = {...editingRTSContext.editingRTS.newItem};
    console.log("time")
    // Get start_day_and_time
    const start_day_and_time_simple_string = `${object.start_day} ${object.start_time}:00`;
    const start_day_and_time_string = new Date(start_day_and_time_simple_string).toString();
    const convertedStartTime =  moment(start_day_and_time_string).format('LTS')
    object.start_day_and_time = `${object.start_day}` + ' ' + convertedStartTime; //start_day_and_time_string;
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
    object.is_available = "True"
    // Get end_day_and_time
    const end_day_and_time_simple_string = `${object.end_day} ${object.end_time}:00`;
    const end_day_and_time_string = new Date(end_day_and_time_simple_string).toString();
    const convertedEndTime =  moment(end_day_and_time_string).format('LTS')
    object.end_day_and_time = `${object.end_day}`+' '+convertedEndTime;
    delete object.end_day;
    delete object.end_time;
    // Get expected_completion_time
    const numHours = object.numMins / 60;
    let numMins = object.numMins % 60;
    if(numMins < 10)
      numMins = '0' + numMins
    object.expected_completion_time = `${numHours}:${numMins}:00`;
    delete object.numMins;
    object.id = editingRTSContext.editingRTS.id;
    object.user_id = props. CurrentId // editingRTSContext.editingRTS.currentUserId;
    object.ta_people_id = '';
    console.log("obj",object);
    let formData = new FormData();
    Object.entries(object).forEach(entry => {
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
  for(var pair of formData.entries()) {
    console.log(pair[0]+ ', '+ pair[1]);
  }
  console.log('object.id') 
  console.log(object.id)
  if (object.id != '') {
    console.log('updateGR')
    axios
    .post('https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/updateGR', formData)
    .then((_) => {
      console.log('editrts', _)
      const gr_array_index = editingRTSContext.editingRTS.gr_array.findIndex((elt) => elt.id === editingRTSContext.editingRTS.id)
      const new_gr_array = [...editingRTSContext.editingRTS.gr_array];
      new_gr_array[gr_array_index] = object;
      editingRTSContext.setEditingRTS({
        ...editingRTSContext.editingRTS,
        gr_array: new_gr_array,
        editing: false
      })
    })
    .catch((err) => {
      if(err.response) {
        console.log(err.response);
      }
      console.log(err)
    })
  } else {
    console.log('addGR')
    axios
    .post('https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/addGR', formData)
    .then((_) => {
      console.log(_)
      const gr_array_index = editingRTSContext.editingRTS.gr_array.findIndex((elt) => elt.id === editingRTSContext.editingRTS.id)
      const new_gr_array = [...editingRTSContext.editingRTS.gr_array];
      new_gr_array[gr_array_index] = object;
      editingRTSContext.setEditingRTS({
        ...editingRTSContext.editingRTS,
        gr_array: new_gr_array,
        editing: false
      })
    })
    .catch((err) => {
      if(err.response) {
        console.log(err.response);
      }
      console.log(err)
    })
  }
  // editingRTSContext.setEditingRTS({
  //   ...editingRTSContext.editingRTS,
  //   editing: false
  // })
  }
  return (
    <div
      style={{
        marginTop: '1rem',
        marginLeft: '2rem',
        //marginRight: '3rem',
        width: '90%',
        backgroundColor: '#F57045',
        color: '#ffffff'
      }}
    >
      <Container
        style={{
          paddingLeft: '1rem',
          paddingTop: '1rem',
          
          width: '100%'
        }}
      >
        <Col style={{ float: 'left', width: '30%'}}>
        <div style={{fontWeight: 'bold', fontSize: '20px'}}>Routine Name </div>
          <input
            style={{
              borderRadius: '10px',
              border: 'none',
              width: '100%',
              marginTop: '20px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
            value={editingRTSContext.editingRTS.newItem.gr_title}
            onChange={(e) => {
              editingRTSContext.setEditingRTS({
                ...editingRTSContext.editingRTS,
                newItem: {
                  ...editingRTSContext.editingRTS.newItem,
                  gr_title: e.target.value
                }
              })
            }}
          />

        <div style={{fontWeight: 'bold', fontSize: '20px', marginTop: '20px', marginBottom: '20px'}}>Change Icon</div>
          
          <Row>
            <Col style={{width: '100%', float: 'left', fontSize: '14px',textAlign:'center', textDecoration: 'underline'}}>
              <div >Add icon to library</div>
              <AddIconModal
              photoUrl = {photo}
              setPhotoUrl = {setPhoto}
            //  BASE_URL={props.BASE_URL}
            //  parentFunction={setPhotoURLFunction}
            />
              {/* <div>Use icon from library</div> */}
              {/* <div>User's library</div> */}
              <UploadImage
            //  BASE_URL={props.BASE_URL}
            //  parentFunction={setPhotoURLFunction}
            photoUrl = {photo}
            setPhotoUrl = {setPhoto}
              currentUserId={ editingRTSContext.editingRTS.currentUserId}
            />
            </Col>
            <Col style={{ float: 'right'}}>
          
              <img alt='icon' src={photo} style={{width: "100%"}}/>
            </Col>
          </Row>
          
          <div style={{fontWeight: 'bold', fontSize: '20px'}}>Start Time</div>
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
                    fontWeight: 'bold'
                  }}
                  type='date'
                  value={editingRTSContext.editingRTS.newItem.start_day}
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        start_day: e.target.value
                      }
                    })
                  }}
                />
              </Col>
              <Col
                sm={5}
              >
                <input
                  style={{
                    width: '100%',
                    borderRadius: '10px',
                    border: 'none',
                    height: '26px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                  type='time'
                  value={editingRTSContext.editingRTS.newItem.start_time}
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        start_time: e.target.value
                      }
                    })
                  }}
                />
              </Col>
            </Row>
            </Container>
            <div style={{fontWeight: 'bold', fontSize: '20px', marginTop: '10px'}}>This Takes Me</div>
            <div>
              <input
                type='number'
                style={{
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
                value={editingRTSContext.editingRTS.newItem.numMins}
                onChange={(e) => {
                  editingRTSContext.setEditingRTS({
                    ...editingRTSContext.editingRTS,
                    newItem: {
                      ...editingRTSContext.editingRTS.newItem,
                      numMins: e.target.value
                    }
                  })
                }}
              />
              <span style={{fontSize: '20px'}}> Minutes </span>
            </div>
            <div style={{fontWeight: 'bold', fontSize: '20px', marginTop: '10px'}}>End Time</div>
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
                    fontWeight: 'bold'
                  }}
                  type='date'
                  value={editingRTSContext.editingRTS.newItem.end_day}
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        end_day: e.target.value
                      }
                    })
                  }}
                />
              </Col>
              <Col
                sm={5}
              >
                <input
                  style={{
                    width: '100%',
                    borderRadius: '10px',
                    border: 'none',
                    height: '26px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                  type='time'
                  value={editingRTSContext.editingRTS.newItem.end_time}
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        end_time: e.target.value
                      }
                    })
                  }}
                />
              </Col>
            </Row>
            </Container>
           
        </Col>

        <div style={{float: 'left', backgroundColor: 'white', width: '2px', height: '500px', marginLeft:"2.4%", marginRight:"2.4%"}}/>
        
        <Col style={{ float: 'left', width: '30%'}}>
          <Row style={{fontWeight: 'bold', fontSize: '20px'}}>Repeating Options</Row>

            <Row
              style={{
                padding: '10px 0 0 0',
              }}
            >
              <Col style={{ margin: '10px 0',}}>
                <Row style={{verticalAlign: 'middle'}}>
                <div style={{float: 'left', marginRight: '8px', display: 'inline-block'}}>
                  Repeat Every
                </div>
                <div style={{float: 'left', marginRight: '8px', display: 'inline-block'}}>
                <input
                    type='number'
                    style={{
                      width: '60px',
                      margin: '0px 0',
                      borderRadius: '10px',
                      border: 'none',
                      float: 'left',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                    value={editingRTSContext.editingRTS.newItem.repeat_every}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          repeat_every: e.target.value
                        }
                      })
                    }}
                  />
                  
                </div>
                
                <div style={{float: 'left', marginRight: '8px', display: 'inline-block'}}>Days</div>
                </Row>
                
                <Row style={{marginTop: '10px', width: '100%', verticalAlign: 'middle'}}>
                  Does not repeat
                  {console.log('repeat value =', editingRTSContext.editingRTS.newItem.repeat)}
                  {editingRTSContext.editingRTS.newItem.repeat == 'True' ? (
                    <input
                    name='repeating'
                    type='checkbox'
                    defaultChecked  = 'true'
                    style={{width: '20px', height: '20px', marginLeft: '10px'}}
                    onChange={(e) => {
                      console.log('in false')
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          repeat: e.target.checked
                        }
                      })
                    }}
                  />
                  ) : (
                    <input
                    name='repeating'
                    type='checkbox'
                    // checked={editingRTSContext.editingRTS.newItem.repeat}
                    style={{width: '20px', height: '20px', marginLeft: '10px'}}
                    onChange={(e) => {
                      console.log('in true')
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          repeat: e.target.checked
                        }
                      })
                    }}
                  />
                  )} 
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
                <Row style={{marginTop: '40px', verticalAlign: 'middle'}}>
                    <div style={{float: 'left', width: '20%'}}> Ends </div>
                    <div style={{float: 'left', width: '80%', }}>
                    
                    <div style={{verticalAlign: 'middle', width: '100%', height: '30%', marginBottom: '3%'}}>
                      
                      
                      <input

                        name='repeatingEnd'
                        type='radio'
                        style={{width: '10%', height: '20px',
                        borderRadius: '10px',
                        float: 'left'}}
                        value='On'
                        checked={editingRTSContext.editingRTS.newItem.repeat_type === 'On'}
                        onChange={(e) => {
                          editingRTSContext.setEditingRTS({
                            ...editingRTSContext.editingRTS,
                            newItem: {
                              ...editingRTSContext.editingRTS.newItem,
                              repeat_type: e.target.value,
                            }
                          })
                        }}
                      />
                      
                      <div style={{float: 'left', marginLeft:'2%', marginRight: '2%', width: '16%'}}>
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
                          fontWeight: 'bold'
                        }}
                        type='date'
                        value={editingRTSContext.editingRTS.newItem.repeat_ends_on}
                        onChange={(e) => {
                          editingRTSContext.setEditingRTS({
                            ...editingRTSContext.editingRTS,
                            newItem: {
                              ...editingRTSContext.editingRTS.newItem,
                              repeat_ends_on: e.target.value
                            }
                          })
                        }}
                      />
                      </div>
                      
                      <div style={{verticalAlign: 'middle', width: '100%', height: '30%', marginBottom: '3%'}}>
                        <input
                          style={{
                            borderRadius: '10px',
                            border: 'none',
                            marginRight: '2%',
                            float: 'left',
                            width: '10%', height: '20px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}
                          name='repeatingEnd'
                          type='radio'

                          value='Occurences'
                          checked={editingRTSContext.editingRTS.newItem.repeat_type === 'Occurences'}
                          onChange={(e) => {
                            editingRTSContext.setEditingRTS({
                              ...editingRTSContext.editingRTS,
                              newItem: {
                                ...editingRTSContext.editingRTS.newItem,
                                repeat_type: e.target.value
                              }
                            })
                          }}
                        />
                        <div style={{float: 'left', width: '20%'}}>After</div>
                        <input
                          style={{
                            width: '20%',
                            borderRadius: '10px',
                            border: 'none',
                            marginLeft:'2%', 
                            float: 'left',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}
                          type='number'
                          value={editingRTSContext.editingRTS.newItem.repeat_occurences}
                          onChange={(e) => {
                            editingRTSContext.setEditingRTS({
                              ...editingRTSContext.editingRTS,
                              newItem: {
                                ...editingRTSContext.editingRTS.newItem,
                                repeat_occurences: e.target.value
                              }
                            })
                          }}
                        />
                        <div style={{marginLeft: '2%', width:'44%', float: 'left'}}>Occurences</div>
                      
                      </div>
                      <div style={{verticalAlign: 'middle', width: '100%', height: '30%', marginBottom: '3%'}}>
                        <input
                          style={{
                            borderRadius: '10px',
                            
                          }}
                          name='repeatingEnd'
                          type='radio'
                          style={{width: '10%', height: '20px', marginRight: '2%', float: 'left'}}
                          value='Never'
                          checked={editingRTSContext.editingRTS.newItem.repeat_type === 'Never'}
                          onChange={(e) => {
                            editingRTSContext.setEditingRTS({
                              ...editingRTSContext.editingRTS,
                              newItem: {
                                ...editingRTSContext.editingRTS.newItem,
                                repeat_type: e.target.value
                              }
                            })
                          }}
                        />
                        <div style={{float: 'left', width: '88%'}}>
                          Never Ends
                        </div>
                      
                      </div>
                      
                    </div>
                    <div style={{marginTop: '40px'}}>
                    <div style={{fontWeight: 'bold', fontSize: '20px'}}>Location</div>
                    <input
                      style={{
                        margin: '5px 0',
                        borderRadius: '10px',
                        border: 'none',
                        width: '100%',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                      value={editingRTSContext.editingRTS.newItem.location}
                      onChange={(e) => {
                        editingRTSContext.setEditingRTS({
                          ...editingRTSContext.editingRTS,
                          newItem: {
                            ...editingRTSContext.editingRTS.newItem,
                            location: e.target.value
                          }
                        })
                      }}
                    />
                    <span> Available to User </span>
                    {/* <input
                      type='checkbox'
                      style={{width: '20px', height: '20px'}}
                      checked={editingRTSContext.editingRTS.newItem.is_available}
                      onChange={(e) => {
                        editingRTSContext.setEditingRTS({
                          ...editingRTSContext.editingRTS,
                          newItem: {
                            ...editingRTSContext.editingRTS.newItem,
                            is_available: e.target.checked
                          }
                        })
                      }}
                    /> */}
                    {editingRTSContext.editingRTS.newItem.is_available == 'True' ? (
                      <input
                        type='checkbox'
                        style={{width:'20px', height: '20px'}}
                        defaultChecked = 'true'
                        onChange={(e) => {
                          editingRTSContext.setEditingRTS({
                            ...editingRTSContext.editingRTS,
                            newItem: {
                              ...editingRTSContext.editingRTS.newItem,
                              is_available: e.target.checked
                            }
                          })
                        }}
                      />
                    ) : (
                      <input
                        type='checkbox'
                        style={{width:'20px', height: '20px'}}
                        
                        onChange={(e) => {
                          editingRTSContext.setEditingRTS({
                            ...editingRTSContext.editingRTS,
                            newItem: {
                              ...editingRTSContext.editingRTS.newItem,
                              is_available: e.target.checked
                            }
                          })
                        }}
                      />
                    )}
                    </div>
            
            
                  </Row>
                  
              </Col>
             
              
            </Row>
            
        </Col>

        <div style={{float: 'left', backgroundColor: 'white', width: '2px', height: '500px', marginLeft:"2.4%", marginRight:"2.4%"}}/>

        <Col style={{ float: 'left', width: '29%'}}>
          <Row style={{fontWeight: 'bold', fontSize: '20px'}}>Notification</Row>
            
            <Row
              style={{
                padding: '10px 0 0 0',
              }}
            >
              <Row >
                <div
                  style={{
                    margin: '10px 0',
                    marginLeft: '20px'
                  }}
                >
                  <input
                    type='number'
                    style={{
                      width: '60px',
                      borderRadius: '10px',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                    value={editingRTSContext.editingRTS.newItem.ta_notifications.before.time}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          ta_notifications: {
                            ...editingRTSContext.editingRTS.newItem.ta_notifications,
                            before: {
                              ...editingRTSContext.editingRTS.newItem.ta_notifications.before,
                              time: e.target.value
                            }
                          },
                          user_notifications: {
                            ...editingRTSContext.editingRTS.newItem.user_notifications,
                            before: {
                              ...editingRTSContext.editingRTS.newItem.user_notifications.before,
                              time: e.target.value
                            }
                          },
                        }
                      })
                    }}
                  />
                  &nbsp;
                  Mins Before Start Time
                </div>
                <div
                  style={{
                    margin: '10px 0',
                    marginLeft: '20px'
                  }}
                >
                  User
                  &nbsp;
                  <input
                    type='checkbox'
                    style={{width: '20px', height: '20px'}}
                    checked={editingRTSContext.editingRTS.newItem.user_notifications.before.is_enabled}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          user_notifications: {
                            ...editingRTSContext.editingRTS.newItem.user_notifications,
                            before: {
                              ...editingRTSContext.editingRTS.newItem.user_notifications.before,
                              is_enabled: e.target.checked,
                              is_set: e.target.checked
                            }
                          }
                        }
                      })
                    }}
                  />
                  &nbsp;
                  <input
                    style={{
                      borderRadius: '10px',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                    value={editingRTSContext.editingRTS.newItem.user_notifications.before.message}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          user_notifications: {
                            ...editingRTSContext.editingRTS.newItem.user_notifications,
                            before: {
                              ...editingRTSContext.editingRTS.newItem.user_notifications.before,
                              message: e.target.value
                            }
                          }
                        }
                      })
                    }}
                  />
                  </div>
                <div
                  style={{
                    margin: '10px 0',
                    marginLeft: '20px'
                  }}
                >
                  TA
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <input
                    type='checkbox'
                    style={{width: '20px', height: '20px'}}
                    checked={editingRTSContext.editingRTS.newItem.ta_notifications.before.is_enabled}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          ta_notifications: {
                            ...editingRTSContext.editingRTS.newItem.ta_notifications,
                            before: {
                              ...editingRTSContext.editingRTS.newItem.ta_notifications.before,
                              is_enabled: e.target.checked,
                              is_set: e.target.checked
                            }
                          }
                        }
                      })
                    }}
                  />
                  &nbsp;
                  <input
                    style={{
                      borderRadius: '10px',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                    value={editingRTSContext.editingRTS.newItem.ta_notifications.before.message}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          ta_notifications: {
                            ...editingRTSContext.editingRTS.newItem.ta_notifications,
                            before: {
                              ...editingRTSContext.editingRTS.newItem.ta_notifications.before,
                              message: e.target.value
                            }
                          }
                        }
                      })
                    }}
                  />
                </div>
              </Row>
              <Row >
                <div
                  style={{
                    margin: '10px 0',
                    marginLeft: '20px'
                  }}
                >
                  <input
                    type='number'
                    style={{
                      width: '60px',
                      borderRadius: '10px',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                    value={editingRTSContext.editingRTS.newItem.ta_notifications.during.time}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          ta_notifications: {
                            ...editingRTSContext.editingRTS.newItem.ta_notifications,
                            during: {
                              ...editingRTSContext.editingRTS.newItem.ta_notifications.during,
                              time: e.target.value
                            }
                          },
                          user_notifications: {
                            ...editingRTSContext.editingRTS.newItem.user_notifications,
                            during: {
                              ...editingRTSContext.editingRTS.newItem.user_notifications.during,
                              time: e.target.value
                            }
                          },
                        }
                      })
                    }}
                  />
                  &nbsp;
                  Mins After Start Time
                </div>
                <div
                  style={{
                    margin: '10px 0',
                    marginLeft: '20px'
                  }}
                >
                  User
                  &nbsp;
                  <input
                    type='checkbox'
                    style={{width: '20px', height: '20px'}}
                    checked={editingRTSContext.editingRTS.newItem.user_notifications.during.is_enabled}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          user_notifications: {
                            ...editingRTSContext.editingRTS.newItem.user_notifications,
                            during: {
                              ...editingRTSContext.editingRTS.newItem.user_notifications.during,
                              is_enabled: e.target.checked,
                              is_set: e.target.checked
                            }
                          }
                        }
                      })
                    }}
                  />
                  &nbsp;
                  <input
                    style={{
                      borderRadius: '10px',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                    value={editingRTSContext.editingRTS.newItem.user_notifications.during.message}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          user_notifications: {
                            ...editingRTSContext.editingRTS.newItem.user_notifications,
                            during: {
                              ...editingRTSContext.editingRTS.newItem.user_notifications.during,
                              message: e.target.value
                            }
                          }
                        }
                      })
                    }}
                  />
                </div>
                <div
                  style={{
                    margin: '10px 0',
                    marginLeft: '20px'
                  }}
                >
                  TA
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <input
                    type='checkbox'
                    style={{width: '20px', height: '20px'}}
                    checked={editingRTSContext.editingRTS.newItem.ta_notifications.during.is_enabled}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          ta_notifications: {
                            ...editingRTSContext.editingRTS.newItem.ta_notifications,
                            during: {
                              ...editingRTSContext.editingRTS.newItem.ta_notifications.during,
                              is_enabled: e.target.checked,
                              is_set: e.target.checked
                            }
                          }
                        }
                      })
                    }}
                  />
                  &nbsp;
                  <input
                    style={{
                      borderRadius: '10px',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                    value={editingRTSContext.editingRTS.newItem.ta_notifications.during.message}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          ta_notifications: {
                            ...editingRTSContext.editingRTS.newItem.ta_notifications,
                            during: {
                              ...editingRTSContext.editingRTS.newItem.ta_notifications.during,
                              message: e.target.value
                            }
                          }
                        }
                      })
                    }}
                  />
                </div>
              </Row>
              <Row >
                <div
                  style={{
                    margin: '10px 0',
                    marginLeft: '20px'
                  }}
                >
                  <input
                    type='number'
                    style={{
                      width: '60px',
                      borderRadius: '10px',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                    value={editingRTSContext.editingRTS.newItem.ta_notifications.after.time}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          ta_notifications: {
                            ...editingRTSContext.editingRTS.newItem.ta_notifications,
                            after: {
                              ...editingRTSContext.editingRTS.newItem.ta_notifications.after,
                              time: e.target.value
                            }
                          },
                          user_notifications: {
                            ...editingRTSContext.editingRTS.newItem.user_notifications,
                            after: {
                              ...editingRTSContext.editingRTS.newItem.user_notifications.after,
                              time: e.target.value
                            }
                          },
                        }
                      })
                    }}
                  />
                  &nbsp;
                  Mins After End Time
                </div>
                <div
                  style={{
                    margin: '10px 0',
                    marginLeft: '20px',
                    verticalAlign: 'middle'
                  }}
                >
                  User
                  &nbsp;
                  <input
                    type='checkbox'
                    style={{width: '20px', height: '20px'}}
                    checked={editingRTSContext.editingRTS.newItem.user_notifications.after.is_enabled}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          user_notifications: {
                            ...editingRTSContext.editingRTS.newItem.user_notifications,
                            after: {
                              ...editingRTSContext.editingRTS.newItem.user_notifications.after,
                              is_enabled: e.target.checked,
                              is_set: e.target.checked
                            }
                          }
                        }
                      })
                    }}
                  />
                  &nbsp;
                  <input
                    style={{
                      borderRadius: '10px',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                    value={editingRTSContext.editingRTS.newItem.user_notifications.after.message}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          user_notifications: {
                            ...editingRTSContext.editingRTS.newItem.user_notifications,
                            after: {
                              ...editingRTSContext.editingRTS.newItem.user_notifications.after,
                              message: e.target.value
                            }
                          }
                        }
                      })
                    }}
                  />
                </div>
                <div
                  style={{
                    margin: '10px 0',
                    marginLeft: '20px'
                  }}
                >
                  TA
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <input
                    type='checkbox'
                    style={{width: '20px', height: '20px'}}
                    checked={editingRTSContext.editingRTS.newItem.ta_notifications.after.is_enabled}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          ta_notifications: {
                            ...editingRTSContext.editingRTS.newItem.ta_notifications,
                            after: {
                              ...editingRTSContext.editingRTS.newItem.ta_notifications.after,
                              is_enabled: e.target.checked,
                              is_set: e.target.checked
                            }
                          }
                        }
                      })
                    }}
                  />
                  &nbsp;
                  <input
                    style={{
                      borderRadius: '10px',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                    value={editingRTSContext.editingRTS.newItem.ta_notifications.after.message}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          ta_notifications: {
                            ...editingRTSContext.editingRTS.newItem.ta_notifications,
                            after: {
                              ...editingRTSContext.editingRTS.newItem.ta_notifications.after,
                              message: e.target.value
                            }
                          }
                        }
                      })
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
                paddingBottom: '20px'
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
                onClick={()=>{
                  editingRTSContext.setEditingRTS({
                    ...editingRTSContext.editingRTS,
                    editing: false
                  })
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
  )
}

export default EditRTS;