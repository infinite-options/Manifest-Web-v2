import React, { useContext, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import EditATSContext from './EditATSContext';
import moment from 'moment';
import axios from 'axios';
import AddIconModal from '../AddIconModal';
import UploadImage from '../UploadImage';
import { propTypes } from 'react-bootstrap/esm/Image';

const EditATS = (props) => {
  const editingATSContext = useContext(EditATSContext);

  console.log("action", props.routineID)

  const [photo, setPhoto] = useState(editingATSContext.editingATS.newItem.at_photo)


  const updateATS = (e) => {
    e.stopPropagation()
    let object = {...editingATSContext.editingATS.newItem}
    const start_day_and_time_simple_string = `${object.start_day} ${object.start_time}:00`;
    const start_day_and_time_string = new Date(start_day_and_time_simple_string).toString();
    const convertedStartTime =  moment(start_day_and_time_string).format('LTS')
    object.datetime_started = `${object.start_day}` + ' ' + convertedStartTime; //start_day_and_time_string;
    delete object.start_day;
    delete object.start_time;
    const end_day_and_time_simple_string = `${object.end_day} ${object.end_time}:00`;
    const end_day_and_time_string = new Date(end_day_and_time_simple_string).toString();
    const convertedEndTime =  moment(end_day_and_time_string).format('LTS')
    object.datetime_completed = `${object.end_day}`+' '+convertedEndTime;
    object.available_start_time = object.at_available_start_time;
    delete object.at_available_start_time;
    object.available_end_time = object.at_available_end_time;
    delete object.at_available_end_time;
    delete object.at_datetime_completed;
    delete object.at_datetime_started;
    object.expected_completion_time = object.at_expected_completion_time;
    delete object.at_expected_completion_time;
    object.photo = "";
    object.photo_url = photo;
    object.type = ""
    delete object.at_photo;
    delete object.end_day;
    delete object.end_time;
    delete object.at_sequence
    delete object.at_unique_id
    delete object.end_day_and_time
    delete object.goal_routine_id
    delete object.is_displayed_today
    delete object.is_persistent
    delete object.location
    delete object.start_day_and_time
    object.title = object.at_title
    object.gr_id = props.routineID
    delete object.at_title
    const numHours = object.numMins / 60;
    let numMins = object.numMins % 60;
    if(numMins < 10)
      numMins = '0' + numMins
    object.expected_completion_time = `${numHours}:${numMins}:00`;
    delete object.numMins;
    object.id = editingATSContext.editingATS.newItem.at_unique_id;
    console.log("obj",object);
    let formData = new FormData();
    Object.entries(object).forEach(entry => {
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
  if (object.id != undefined) {
    console.log("update AT")
    axios
    .post('https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/updateAT', formData)
    .then((response) => {
      console.log(response);
      const gr_array_index = editingATSContext.editingATS.gr_array.findIndex((elt) => elt.id === editingATSContext.editingATS.id)
      const new_gr_array = [...editingATSContext.editingATS.gr_array];
      new_gr_array[gr_array_index] = object;
      editingATSContext.setEditingATS({
        ...editingATSContext.editingATS,
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
  }else{
    console.log("add AT")
    axios
    .post('https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/addAT', formData)
    .then((response) => {
      console.log(response);
      const gr_array_index = editingATSContext.editingATS.gr_array.findIndex((elt) => elt.id === editingATSContext.editingATS.id)
      const new_gr_array = [...editingATSContext.editingATS.gr_array];
      new_gr_array[gr_array_index] = object;
      editingATSContext.setEditingATS({
        ...editingATSContext.editingATS,
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
  }
  return (
    <div
      style={{
        marginTop: '1rem',
        marginLeft: '2rem',
        marginRight: '3rem',
        width: '90%',
        backgroundColor: '#E4C33A',
        color: '#ffffff'
      }}
    >
      <Container
        style={{
          padding: '2rem',
        }}
      >
        <Col style={{float: 'left', width: '47%'}}>
          <div>
            <div style={{fontWeight:'bold'}}>Action Name </div>
            <input 
              style={{borderRadius:'10px', border:'0px', fontSize:'12px', height:'2rem', width:'15rem'}}
              placeholder="Name Action here"
              value={editingATSContext.editingATS.newItem.at_title}
              onChange={(e) => {
                editingATSContext.setEditingATS({
                  ...editingATSContext.editingATS,
                  newItem: {
                    ...editingATSContext.editingATS.newItem,
                    at_title: e.target.value
                  }
                })
              }}
            />
          </div>
          <div style={{fontWeight:'bold', marginTop: '10px'}} >Change Icon</div>
            <Container>
              <Row>
                <Col style={{fontSize:'10px', textDecoration:'underline'}}>
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
              currentUserId={props.CurrentId}
            />
                </Col>
                <Col>
                  <img alt='icon' src={photo}/>
                </Col>
              </Row>
            </Container>

            <div style={{fontWeight:'bold'}}>Start Time</div>
            
            <Row>
              <Col
                sm={6}
              >
                <input
                  style={{
                    borderRadius:'10px',
                    border:'0px',
                    width: '100%',
                    fontSize:'12px', 
                    height:'2rem',
                    //width:'5rem'
                  }}
                  type='date'
                  value={editingATSContext.editingATS.newItem.start_day}
                  onChange={(e) => {
                    editingATSContext.setEditingATS({
                      ...editingATSContext.editingATS,
                      newItem: {
                        ...editingATSContext.editingATS.newItem,
                        start_day: e.target.value
                      }
                    })
                  }}
                />
              </Col>
              <Col
                sm={6}
              >
                <input
                  style={{
                    //width: '6rem',
                    width: '100%',
                    borderRadius:'10px',
                    border:'0px',
                    fontSize:'12px', 
                    height:'2rem',
                  }}
                  type='time'
                  value={editingATSContext.editingATS.newItem.at_available_start_time}
                  onChange={(e) => {
                    editingATSContext.setEditingATS({
                      ...editingATSContext.editingATS,
                      newItem: {
                        ...editingATSContext.editingATS.newItem,
                        at_available_start_time: e.target.value
                      }
                    })
                  }}
                />
              </Col>
            </Row>
            
            
            

            <div style={{ display:'flex'}}>
            <div>
            <div  style={{fontWeight:'bold'}}>This Takes Me</div>
              <input
                style={{borderRadius:'10px', border:'0px', fontSize:'12px', height:'2rem', width:'11.5rem'}}
                type='number'
                value={editingATSContext.editingATS.newItem.numMins}
                onChange={(e) => {
                  editingATSContext.setEditingATS({
                    ...editingATSContext.editingATS,
                    newItem: {
                      ...editingATSContext.editingATS.newItem,
                      numMins: e.target.value
                    }
                  })
                }}
              />
            </div>
            <div style={{marginTop:'1.5rem', marginLeft:'1rem'}}> Minutes </div>
            </div>

            <div style={{fontWeight:'bold', }}>End Time</div>
            
            <Row>
              <Col
                sm={6}
              >
                <input
                  style={{
                    //width: '6rem',
                    width: '100%',
                    borderRadius:'10px',
                    border:'0px',
                    fontSize:'12px', 
                    height:'2rem',
                  }}
                  type='date'
                  value={editingATSContext.editingATS.newItem.end_day}
                  onChange={(e) => {
                    editingATSContext.setEditingATS({
                      ...editingATSContext.editingATS,
                      newItem: {
                        ...editingATSContext.editingATS.newItem,
                        end_day: e.target.value
                      }
                    })
                  }}
                />
              </Col>
              <Col
                sm={6}
              >
                <input
                  style={{
                    //width: '100%',
                    borderRadius:'10px',
                    border:'0px',
                    width: '100%',
                    fontSize:'12px', 
                    height:'2rem',
                  }}
                  type='time'
                  value={editingATSContext.editingATS.newItem.at_available_end_time}
                  onChange={(e) => {
                    editingATSContext.setEditingATS({
                      ...editingATSContext.editingATS,
                      newItem: {
                        ...editingATSContext.editingATS.newItem,
                        at_available_end_time: e.target.value
                      }
                    })
                  }}
                />
              </Col>
            </Row>
            

            
        </Col>

        <div style={{backgroundColor: 'white', width: '2px', height: '350px', float: 'left', marginLeft:'4%', marginRight:'4%'}}/>
        
        <Col style={{float: 'left', width: '40%'}}>
          
        <Row style={{fontWeight:'bold'}}>Repeating Options</Row>
            
            
              <Row >
                <div style={{fontSize:'14px', width: '100%'}}>
                  Repeat Every
                  <input
                    type='number'
                    style={{width: '4rem', marginLeft:'1rem', marginRight:'0.5rem', borderRadius:'10px',
                    border:'0px', height: '2rem'}}
                    value={editingATSContext.editingATS.newItem.repeat_every}
                    onChange={(e) => {
                      editingATSContext.setEditingATS({
                        ...editingATSContext.editingATS,
                        newItem: {
                          ...editingATSContext.editingATS.newItem,
                          repeat_every: e.target.value
                        }
                      })
                    }}
                  />
                  Days
                </div>
                <div style={{fontSize:'14px'}}>
                  Does not repeat 
                  <input
                   style={{ marginLeft:'1rem', marginTop:'1rem'}}
                    name='repeating'
                    type='checkbox'
                    checked={editingATSContext.editingATS.newItem.repeat}
                    onChange={(e) => {
                      editingATSContext.setEditingATS({
                        ...editingATSContext.editingATS,
                        newItem: {
                          ...editingATSContext.editingATS.newItem,
                          repeat: e.target.checked
                        }
                      })
                    }}
                  />
                </div>
              </Row>
              <Row style={{marginTop: '20px'}}>
                
                
                  
                    <div style={{float: 'left', width: '30%'}}> Ends </div>
                  
                    <div style={{float: 'left', width: '70%'}}>
                    <div style={{ fontSize:'16px', height: '31%', marginBottom: '2%'}}>
                      <input
                        name='repeatingEnd'
                        type='radio'
                        value='On'
                        style={{width: '16px', height: '16px', marginRight: '4px'}}
                        onChange={(e) => {
                          editingATSContext.setEditingATS({
                            ...editingATSContext.editingATS,
                            newItem: {
                              ...editingATSContext.editingATS.newItem,
                              repeat_type: e.target.value
                            }
                          })
                        }}
                      />
                      On
                      <input
                        type='date'
                        style={{borderRadius:'8px', border:'0px', fontSize:'12px', height:'1.5rem'}}
                        value={editingATSContext.editingATS.newItem.repeat_ends_on}
                        onChange={(e) => {
                          editingATSContext.setEditingATS({
                            ...editingATSContext.editingATS,
                            newItem: {
                              ...editingATSContext.editingATS.newItem,
                              repeat_ends_on: e.target.value
                            }
                          })
                        }}
                      />
                    </div>
                    <div style={{ fontSize:'16px', height: '31%', marginBottom: '2%'}}>
                      <input
                        name='repeatingEnd'
                        type='radio'
                        value='occurences'
                        style={{width: '16px', height: '16px', marginRight: '4px'}}
                        onChange={(e) => {
                          editingATSContext.setEditingATS({
                            ...editingATSContext.editingATS,
                            newItem: {
                              ...editingATSContext.editingATS.newItem,
                              repeat_type: e.target.value
                            }
                          })
                        }}
                      />
                      After
                      <input
                        type='number'
                        style={{borderRadius:'8px', border:'0px', fontSize:'12px', height:'1.5rem', width:'60px'}}
                        value={editingATSContext.editingATS.newItem.repeat_occurences}
                        onChange={(e) => {
                          editingATSContext.setEditingATS({
                            ...editingATSContext.editingATS,
                            newItem: {
                              ...editingATSContext.editingATS.newItem,
                              repeat_occurences: e.target.value
                            }
                          })
                        }}
                      />
                      Occurences
                    </div>
                    <div  style={{ fontSize:'16px', height: '31%', marginBottom: '2%'}}>
                      <input
                        name='repeatingEnd'
                        type='radio'
                        value='Never'
                        style={{width: '16px', height: '16px', marginRight: '4px'}}
                        onChange={(e) => {
                          editingATSContext.setEditingATS({
                            ...editingATSContext.editingATS,
                            newItem: {
                              ...editingATSContext.editingATS.newItem,
                              repeat_type: e.target.value
                            }
                          })
                        }}
                      />
                      Never Ends / TBD
                    </div>
                    </div>
                    
                  
                
                
              </Row>
            </Col>
            
          
            <div style= {{ fontWeight:'bold'}}>Location</div>
            <div>
              <input
                style={{borderRadius:'8px', border:'0px', fontSize:'12px', height:'1.5rem', }}
                value={editingATSContext.editingATS.newItem.location}
                onChange={(e) => {
                  editingATSContext.setEditingATS({
                    ...editingATSContext.editingATS,
                    newItem: {
                      ...editingATSContext.editingATS.newItem,
                      location: e.target.value
                    }
                  })
                }}
              />
            </div>
            <div style={{display:'flex', marginTop:'1rem'}}>
            <div style={{fontSize:'12px'}}> Available to User </div>
            <input
              style={{ marginLeft:'1rem'}}
              type='checkbox'
              checked={editingATSContext.editingATS.newItem.is_available}
              onChange={(e) => {
                editingATSContext.setEditingATS({
                  ...editingATSContext.editingATS,
                  newItem: {
                    ...editingATSContext.editingATS.newItem,
                    is_available: e.target.checked
                  }
                })
              }}
            />
            </div>
        
        
      </Container>
      <Row style={{textAlign: 'center', width: '100%', paddingBottom: '20px'}}>
            <div
              style={{
                textAlign: 'center',
                // marginTop:'3rem',
                width: '100%'
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
                onClick={()=>{
                  editingATSContext.setEditingATS({
                    ...editingATSContext.editingATS,
                    editing: false
                  })
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
    </div>
  )

  return (
    <div
      style={{
        marginTop: '1rem',
        marginLeft: '2rem',
        marginRight: '3rem',
        width: '100%',
        backgroundColor: '#E4C33A',
        color: '#ffffff'
      }}
    >
      <Container
        style={{
          padding: '2rem', border: 'solid'
        }}
      >
        <Row>
          <Col md={4}>
            <div>
              <div style={{fontWeight:'bold'}}>Action Name </div>
              <input 
                style={{borderRadius:'10px', border:'0px', fontSize:'12px', height:'2rem', width:'15rem'}}
                placeholder="Name Action here"
                value={editingATSContext.editingATS.newItem.at_title}
                onChange={(e) => {
                  editingATSContext.setEditingATS({
                    ...editingATSContext.editingATS,
                    newItem: {
                      ...editingATSContext.editingATS.newItem,
                      at_title: e.target.value
                    }
                  })
                }}
              />
            </div>
          </Col>
          <Col md={4}>
            <div style={{fontWeight:'bold', marginLeft:'1rem'}}>Start Time</div>
            <Container>
            <Row>
              <Col
                sm={6}
              >
                <input
                  style={{
                    borderRadius:'10px',
                    border:'0px',
                    width: '100%',
                    fontSize:'12px', 
                    height:'2rem',
                    width:'5rem'
                  }}
                  type='date'
                  value={editingATSContext.editingATS.newItem.start_day}
                  onChange={(e) => {
                    editingATSContext.setEditingATS({
                      ...editingATSContext.editingATS,
                      newItem: {
                        ...editingATSContext.editingATS.newItem,
                        start_day: e.target.value
                      }
                    })
                  }}
                />
              </Col>
              <Col
                sm={6}
              >
                <input
                  style={{
                    width: '6rem',
                    borderRadius:'10px',
                    border:'0px',
                    fontSize:'12px', 
                    height:'2rem',
                  }}
                  type='time'
                  value={editingATSContext.editingATS.newItem.at_available_start_time}
                  onChange={(e) => {
                    editingATSContext.setEditingATS({
                      ...editingATSContext.editingATS,
                      newItem: {
                        ...editingATSContext.editingATS.newItem,
                        at_available_start_time: e.target.value
                      }
                    })
                  }}
                />
              </Col>
            </Row>
            </Container>
          </Col>
          <Col md={4}>
          <div style={{fontWeight:'bold', marginLeft:'1rem'}}>End Time</div>
            <Container>
            <Row>
              <Col
                sm={6}
              >
                <input
                  style={{
                    width: '6rem',
                    borderRadius:'10px',
                    border:'0px',
                    fontSize:'12px', 
                    height:'2rem',
                  }}
                  type='date'
                  value={editingATSContext.editingATS.newItem.end_day}
                  onChange={(e) => {
                    editingATSContext.setEditingATS({
                      ...editingATSContext.editingATS,
                      newItem: {
                        ...editingATSContext.editingATS.newItem,
                        end_day: e.target.value
                      }
                    })
                  }}
                />
              </Col>
              <Col
                sm={6}
              >
                <input
                  style={{
                    width: '100%',
                    borderRadius:'10px',
                    border:'0px',
                    width: '100%',
                    fontSize:'12px', 
                    height:'2rem',
                  }}
                  type='time'
                  value={editingATSContext.editingATS.newItem.at_available_end_time}
                  onChange={(e) => {
                    editingATSContext.setEditingATS({
                      ...editingATSContext.editingATS,
                      newItem: {
                        ...editingATSContext.editingATS.newItem,
                        at_available_end_time: e.target.value
                      }
                    })
                  }}
                />
              </Col>
            </Row>
            </Container>
          </Col>
        </Row>
        <Row style={{marginTop:'3rem'}}>
          <Col md={5}>
            <div style={{fontWeight:'bold'}} >Change Icon</div>
            <Container>
            <Row>
              <Col style={{fontSize:'10px', textDecoration:'underline'}}>
                <div>Add icon to library</div>
                <div>Use icon from library</div>
                <div>User's library</div>
              </Col>
              <Col>
                <img alt='icon' src={editingATSContext.editingATS.newItem.at_photo}/>
              </Col>
            </Row>
            </Container>
          </Col>
          <Col md={2}>
            <div style={{ display:'flex'}}>
            <div>
            <div  style={{fontWeight:'bold', display:'flex'}}>This Takes Me</div>
              <input
                style={{borderRadius:'10px', border:'0px', fontSize:'12px', height:'2rem', width:'10rem'}}
                type='number'
                value={editingATSContext.editingATS.newItem.numMins}
                onChange={(e) => {
                  editingATSContext.setEditingATS({
                    ...editingATSContext.editingATS,
                    newItem: {
                      ...editingATSContext.editingATS.newItem,
                      numMins: e.target.value
                    }
                  })
                }}
              />
            </div>

            <div style={{marginTop:'1.5rem', marginLeft:'1rem'}}> Minutes </div>

            </div>
          </Col>
        </Row>
        <Row style={{marginTop:'3rem'}}>
          <Col md={8}>
            <div style={{fontWeight:'bold'}}>Repeating Options</div>
            <Container>
            <Row>
              <Col md={6}>
                <div style={{fontSize:'14px'}}>
                  Repeat Every
                  <input
                    type='number'
                    style={{width: '4rem', marginLeft:'1rem', marginRight:'0.5rem'}}
                    value={editingATSContext.editingATS.newItem.repeat_every}
                    onChange={(e) => {
                      editingATSContext.setEditingATS({
                        ...editingATSContext.editingATS,
                        newItem: {
                          ...editingATSContext.editingATS.newItem,
                          repeat_every: e.target.value
                        }
                      })
                    }}
                  />
                  Days
                </div>
                <div style={{fontSize:'14px'}}>
                  Does not repeat 
                  <input
                   style={{ marginLeft:'1rem', marginTop:'3rem'}}
                    name='repeating'
                    type='checkbox'
                    checked={editingATSContext.editingATS.newItem.repeat}
                    onChange={(e) => {
                      editingATSContext.setEditingATS({
                        ...editingATSContext.editingATS,
                        newItem: {
                          ...editingATSContext.editingATS.newItem,
                          repeat: e.target.checked
                        }
                      })
                    }}
                  />
                </div>
              </Col>
              <Col md={6}>
                <Container>
                <Row>
                  <Col md={3}>
                    <div> Ends </div>
                  </Col>
                  <Col md={7}>
                    <div style={{ fontSize:'12px'}}>
                      <input
                        name='repeatingEnd'
                        type='radio'
                        value='On'
                        onChange={(e) => {
                          editingATSContext.setEditingATS({
                            ...editingATSContext.editingATS,
                            newItem: {
                              ...editingATSContext.editingATS.newItem,
                              repeat_type: e.target.value
                            }
                          })
                        }}
                      />
                      On
                      <input
                        type='date'
                        style={{borderRadius:'8px', border:'0px', fontSize:'12px', height:'1.5rem'}}
                        value={editingATSContext.editingATS.newItem.repeat_ends_on}
                        onChange={(e) => {
                          editingATSContext.setEditingATS({
                            ...editingATSContext.editingATS,
                            newItem: {
                              ...editingATSContext.editingATS.newItem,
                              repeat_ends_on: e.target.value
                            }
                          })
                        }}
                      />
                      </div>
                    <div>
                      <input
                        name='repeatingEnd'
                        type='radio'
                        value='occurences'
                        onChange={(e) => {
                          editingATSContext.setEditingATS({
                            ...editingATSContext.editingATS,
                            newItem: {
                              ...editingATSContext.editingATS.newItem,
                              repeat_type: e.target.value
                            }
                          })
                        }}
                      />
                      After
                      <input
                        type='number'
                        style={{borderRadius:'8px', border:'0px', fontSize:'12px', height:'1.5rem', width:'60px'}}
                        value={editingATSContext.editingATS.newItem.repeat_occurences}
                        onChange={(e) => {
                          editingATSContext.setEditingATS({
                            ...editingATSContext.editingATS,
                            newItem: {
                              ...editingATSContext.editingATS.newItem,
                              repeat_occurences: e.target.value
                            }
                          })
                        }}
                      />
                      Occurences
                    </div>
                    <div>
                      <input
                        name='repeatingEnd'
                        type='radio'
                        value='Never'
                        onChange={(e) => {
                          editingATSContext.setEditingATS({
                            ...editingATSContext.editingATS,
                            newItem: {
                              ...editingATSContext.editingATS.newItem,
                              repeat_type: e.target.value
                            }
                          })
                        }}
                      />
                      Never Ends / TBD
                    </div>
                  </Col>
                </Row>
                </Container>
              </Col>
            </Row>
            </Container>
          </Col>
          <Col md={4}>
            <div style= {{ fontWeight:'bold'}}>Location</div>
            <div>
              <input
                style={{borderRadius:'8px', border:'0px', fontSize:'12px', height:'1.5rem', }}
                value={editingATSContext.editingATS.newItem.location}
                onChange={(e) => {
                  editingATSContext.setEditingATS({
                    ...editingATSContext.editingATS,
                    newItem: {
                      ...editingATSContext.editingATS.newItem,
                      location: e.target.value
                    }
                  })
                }}
              />
            </div>
            <div style={{display:'flex', marginTop:'1rem'}}>
            <div style={{fontSize:'12px'}}> Available to User </div>
            <input
              style={{ marginLeft:'1rem'}}
              type='checkbox'
              checked={editingATSContext.editingATS.newItem.is_available}
              onChange={(e) => {
                editingATSContext.setEditingATS({
                  ...editingATSContext.editingATS,
                  newItem: {
                    ...editingATSContext.editingATS.newItem,
                    is_available: e.target.checked
                  }
                })
              }}
            />
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div
              style={{
                textAlign: 'center',
                marginTop:'10px'
              }}
            >
              <button
                style={{
                  width: '100px',
                  padding: '0',
                  //margin: '0 20px',
                  backgroundColor: 'inherit',
                  border: '3px white solid',
                  color: '#ffffff',
                  textAlign: 'center',
                }}

                onClick={()=>{
                  editingATSContext.setEditingATS({
                    ...editingATSContext.editingATS,
                    editing: false
                  })
                }}
          
              >
                Cancel
              </button>
              <button
                style={{
                  width: '100px',
                  padding: '0',
                  //margin: '0 20px',
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
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default EditATS;
