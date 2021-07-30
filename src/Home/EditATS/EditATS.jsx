import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import EditATSContext from './EditATSContext';
import axios from 'axios';

const EditATS = () => {
  const editingATSContext = useContext(EditATSContext);

  console.log("action", editingATSContext.editingATS.routineId)



  const updateATS = (e) => {
    e.stopPropagation()
    let object = {...editingATSContext.editingATS.newItem}
    object.start_day_and_time = `${object.start_day} ${object.start_time}:00`;
    delete object.start_day;
    delete object.start_time;
    object.end_day_and_time = `${object.end_day} ${object.end_time}:00`;
    object.available_start_time = object.at_available_start_time;
    delete object.at_available_start_time;
    object.available_end_time = object.at_available_end_time;
    delete object.at_available_end_time;
    object.datetime_completed = object.at_datetime_completed;
    delete object.at_datetime_completed;
    object.datetime_started = object.at_datetime_started;
    delete object.at_datetime_started;
    object.expected_completion_time = object.at_expected_completion_time;
    delete object.at_expected_completion_time;
    object.photo = object.at_photo;
    object.photo_url = ""
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
    delete object.at_title
    const numHours = object.numMins / 60;
    let numMins = object.numMins % 60;
    if(numMins < 10)
      numMins = '0' + numMins
    object.expected_completion_time = `${numHours}:${numMins}:00`;
    delete object.numMins;
    object.id = editingATSContext.editingATS.newItem.at_unique_id;
    console.log(object);
    let formData = new FormData();
    Object.entries(object).forEach(entry => {
      if (typeof entry[1].name == 'string'){
      
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
   
    axios
    .post('https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/updateAT', formData)
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      if(err.response) {
        console.log(err.response);
      }
      console.log(err)
    })
  }

  return (
    <div
      style={{
        marginTop: '1rem',
        marginLeft: '5rem',
        marginRight: '3rem',

        backgroundColor: '#E4C33A',
        color: '#ffffff'
      }}
    >
      <Container
        style={{
          padding: '2rem',
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
                marginTop:'3rem'
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
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default EditATS;
