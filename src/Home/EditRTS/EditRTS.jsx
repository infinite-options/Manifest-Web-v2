import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import EditRTSContext from './EditRTSContext';
import axios from 'axios';

const EditRTS = () => {
  const editingRTSContext = useContext(EditRTSContext);

  const updateRTS = (e) => {
    e.stopPropagation()
    let object = {...editingRTSContext.editingRTS.newItem}
    object.start_day_and_time = `${object.start_day} ${object.start_time}:00`;
    delete object.start_day;
    delete object.start_time;
    object.end_day_and_time = `${object.end_day} ${object.end_time}:00`;
    delete object.end_day;
    delete object.end_time;
    const numHours = object.numMins / 60;
    let numMins = object.numMins % 60;
    if(numMins < 10)
      numMins = '0' + numMins
    object.expected_completion_time = `${numHours}:${numMins}:00`;
    delete object.numMins;
    object.id = editingRTSContext.editingRTS.id;
    object.user_id = editingRTSContext.editingRTS.user_id;
    object.ta_people_id = '';
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
    .post('https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/updateGR', formData)
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

        backgroundColor: '#F57045',
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
              <div>Routine Name </div>
              <input
                value={editingRTSContext.editingRTS.newItem.title}
                onChange={(e) => {
                  editingRTSContext.setEditingRTS({
                    ...editingRTSContext.editingRTS,
                    newItem: {
                      ...editingRTSContext.editingRTS.newItem,
                      title: e.target.value
                    }
                  })
                }}
              />
            </div>
          </Col>
          <Col md={4}>
            <div>Start Time</div>
            <Container>
            <Row>
              <Col
                sm={6}
              >
                <input
                  style={{
                    width: '100%',
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
                sm={6}
              >
                <input
                  style={{
                    width: '100%',
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
          </Col>
          <Col md={4}>
          <div>End Time</div>
            <Container>
            <Row>
              <Col
                sm={6}
              >
                <input
                  style={{
                    width: '100%',
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
                sm={6}
              >
                <input
                  style={{
                    width: '100%',
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
        </Row>
        <Row>
          <Col md={4}>
            <div>Change Icon</div>
            <Container>
            <Row>
              <Col>
                <div>Add icon to library</div>
                <div>Use icon from library</div>
                <div>User's library</div>
              </Col>
              <Col>
                <img alt='icon' src='ac'/>
              </Col>
            </Row>
            </Container>
          </Col>
          <Col md={8}>
            <div>This Takes Me</div>
            <div>
              <input
                type='number'
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
              <span> Minutes </span>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={8}>
            <div>Repeating Options</div>
            <Container>
            <Row>
              <Col md={6}>
                <div>
                  Repeat Every
                  <input
                    type='number'
                    style={{width: '60px'}}
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
                  Days
                </div>
                <div>
                  Does not repeat 
                  <input
                    name='repeating'
                    type='checkbox'
                    checked={editingRTSContext.editingRTS.newItem.repeat}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
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
                  <Col md={9}>
                    <div>
                      <input
                        name='repeatingEnd'
                        type='radio'
                        value='On'
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
                      On
                      <input
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
                    <div>
                      <input
                        name='repeatingEnd'
                        type='radio'
                        value='occurences'
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
                      After
                      <input
                        type='number'
                        style={{width: '60px'}}
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
                      Occurences
                    </div>
                    <div>
                      <input
                        name='repeatingEnd'
                        type='radio'
                        value='Never'
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
                      Never Ends
                    </div>
                  </Col>
                </Row>
                </Container>
              </Col>
            </Row>
            </Container>
          </Col>
          <Col md={4}>
            <div>Location</div>
            <div>
              <input
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
            </div>
            <span> Available to User </span>
            <input
              type='checkbox'
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
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div> Notification </div>
            <Container>
            <Row>
              <Col md={4}>
                <div>
                  <input
                    type='number'
                    style={{width: '60px'}}
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
                  Mins Before Start Time
                </div>
                <div>
                  User
                  <input
                    type='checkbox'
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
                  <input
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
                <div>
                  TA 
                  <input
                    type='checkbox'
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
                  <input
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
              </Col>
              <Col md={4}>
                <div>
                  <input
                    type='number'
                    style={{width: '60px'}}
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
                  Mins After Start Time
                </div>
                <div>
                  User
                  <input
                    type='checkbox'
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
                  <input
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
                <div>
                  TA
                  <input
                    type='checkbox'
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
                  <input
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
              </Col>
              <Col md={4}>
                <div>
                  <input
                    type='number'
                    style={{width: '60px'}}
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
                  Mins After End Time
                </div>
                <div>
                  User
                  <input
                    type='checkbox'
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
                  <input
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
                <div>
                  TA
                  <input
                    type='checkbox'
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
                  <input
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
              </Col>
            </Row>
            </Container>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div
              style={{
                textAlign: 'center',
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
                onClick={updateRTS}
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

export default EditRTS;
