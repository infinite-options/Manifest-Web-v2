import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import EditRTSContext from './EditRTSContext';

const EditRTS = () => {
  const editingRTSContext = useContext(EditRTSContext);

  const updateRTS = (e) => {
    e.stopPropagation()
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
                value={editingRTSContext.editingRTS.newItem.name}
                onChange={(e) => {
                  editingRTSContext.setEditingRTS({
                    ...editingRTSContext.editingRTS,
                    newItem: {
                      ...editingRTSContext.editingRTS.newItem,
                      name: e.target.value
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
                  value={editingRTSContext.editingRTS.newItem.startDate}
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        startDate: e.target.value
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
                  value={editingRTSContext.editingRTS.newItem.startTime}
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        startTime: e.target.value
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
                  value={editingRTSContext.editingRTS.newItem.endDate}
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        endDate: e.target.value
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
                  value={editingRTSContext.editingRTS.newItem.endTime}
                  onChange={(e) => {
                    editingRTSContext.setEditingRTS({
                      ...editingRTSContext.editingRTS,
                      newItem: {
                        ...editingRTSContext.editingRTS.newItem,
                        endTime: e.target.value
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
                    value={editingRTSContext.editingRTS.newItem.repeatDays}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          repeatDays: e.target.value
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
                    checked={editingRTSContext.editingRTS.newItem.repeating}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          repeating: e.target.checked
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
                        value='date'
                        onChange={(e) => {
                          editingRTSContext.setEditingRTS({
                            ...editingRTSContext.editingRTS,
                            newItem: {
                              ...editingRTSContext.editingRTS.newItem,
                              repeatEndOption: e.target.value
                            }
                          })
                        }}
                      />
                      On
                      <input
                        type='date'
                        value={editingRTSContext.editingRTS.newItem.repeatEndOn}
                        onChange={(e) => {
                          editingRTSContext.setEditingRTS({
                            ...editingRTSContext.editingRTS,
                            newItem: {
                              ...editingRTSContext.editingRTS.newItem,
                              repeatEndOn: e.target.value
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
                              repeatEndOption: e.target.value
                            }
                          })
                        }}
                      />
                      After
                      <input
                        type='number'
                        style={{width: '60px'}}
                        value={editingRTSContext.editingRTS.newItem.repeatEndOccurences}
                        onChange={(e) => {
                          editingRTSContext.setEditingRTS({
                            ...editingRTSContext.editingRTS,
                            newItem: {
                              ...editingRTSContext.editingRTS.newItem,
                              repeatEndOccurences: e.target.value
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
                        value='never'
                        onChange={(e) => {
                          editingRTSContext.setEditingRTS({
                            ...editingRTSContext.editingRTS,
                            newItem: {
                              ...editingRTSContext.editingRTS.newItem,
                              repeatEndOption: e.target.value
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
              checked={editingRTSContext.editingRTS.newItem.availableToUser}
              onChange={(e) => {
                editingRTSContext.setEditingRTS({
                  ...editingRTSContext.editingRTS,
                  newItem: {
                    ...editingRTSContext.editingRTS.newItem,
                    availableToUser: e.target.checked
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
                    value={editingRTSContext.editingRTS.newItem.beforeStartTime.mins}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          beforeStartTime: {
                            ...editingRTSContext.editingRTS.newItem.beforeStartTime,
                            mins: e.target.value
                          }
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
                    checked={editingRTSContext.editingRTS.newItem.beforeStartTime.user}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          beforeStartTime: {
                            ...editingRTSContext.editingRTS.newItem.beforeStartTime,
                            user: e.target.checked
                          }
                        }
                      })
                    }}
                  />
                  <input
                    value={editingRTSContext.editingRTS.newItem.beforeStartTime.userMessage}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          beforeStartTime: {
                            ...editingRTSContext.editingRTS.newItem.beforeStartTime,
                            userMessage: e.target.value
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
                    checked={editingRTSContext.editingRTS.newItem.beforeStartTime.ta}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          beforeStartTime: {
                            ...editingRTSContext.editingRTS.newItem.beforeStartTime,
                            ta: e.target.checked
                          }
                        }
                      })
                    }}
                  />
                  <input
                    value={editingRTSContext.editingRTS.newItem.beforeStartTime.taMessage}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          beforeStartTime: {
                            ...editingRTSContext.editingRTS.newItem.beforeStartTime,
                            taMessage: e.target.value
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
                    value={editingRTSContext.editingRTS.newItem.afterStartTime.mins}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          afterStartTime: {
                            ...editingRTSContext.editingRTS.newItem.afterStartTime,
                            mins: e.target.value
                          }
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
                    checked={editingRTSContext.editingRTS.newItem.afterStartTime.user}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          afterStartTime: {
                            ...editingRTSContext.editingRTS.newItem.afterStartTime,
                            user: e.target.checked
                          }
                        }
                      })
                    }}
                  />
                  <input
                    value={editingRTSContext.editingRTS.newItem.afterStartTime.userMessage}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          afterStartTime: {
                            ...editingRTSContext.editingRTS.newItem.afterStartTime,
                            userMessage: e.target.value
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
                    checked={editingRTSContext.editingRTS.newItem.afterStartTime.ta}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          afterStartTime: {
                            ...editingRTSContext.editingRTS.newItem.afterStartTime,
                            ta: e.target.checked
                          }
                        }
                      })
                    }}
                  />
                  <input
                    value={editingRTSContext.editingRTS.newItem.afterStartTime.taMessage}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          afterStartTime: {
                            ...editingRTSContext.editingRTS.newItem.afterStartTime,
                            taMessage: e.target.value
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
                    value={editingRTSContext.editingRTS.newItem.afterEndTime.mins}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          afterEndTime: {
                            ...editingRTSContext.editingRTS.newItem.afterEndTime,
                            mins: e.target.value
                          }
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
                    checked={editingRTSContext.editingRTS.newItem.afterEndTime.user}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          afterEndTime: {
                            ...editingRTSContext.editingRTS.newItem.afterEndTime,
                            user: e.target.checked
                          }
                        }
                      })
                    }}
                  />
                  <input
                    value={editingRTSContext.editingRTS.newItem.afterEndTime.userMessage}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          afterEndTime: {
                            ...editingRTSContext.editingRTS.newItem.afterEndTime,
                            userMessage: e.target.value
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
                    checked={editingRTSContext.editingRTS.newItem.afterEndTime.ta}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          afterEndTime: {
                            ...editingRTSContext.editingRTS.newItem.afterEndTime,
                            ta: e.target.checked
                          }
                        }
                      })
                    }}
                  />
                  <input
                    value={editingRTSContext.editingRTS.newItem.afterEndTime.taMessage}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          afterEndTime: {
                            ...editingRTSContext.editingRTS.newItem.afterEndTime,
                            taMessage: e.target.value
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
