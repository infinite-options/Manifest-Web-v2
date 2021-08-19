import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const AddRTS = () => {
  const updateRTS = (e) => {
    e.stopPropagation();
    // Get start_day_and_time
    const start_day_and_time_simple_string = `${object.start_day}, ${object.start_time}:00`;
    const start_day_and_time_string = new Date(
      start_day_and_time_simple_string
    ).toString();
    object.start_day_and_time =
      moment(start_day_and_time_simple_string).format('L') +
      ',' +
      moment(start_day_and_time_simple_string).format('LTS');
    delete object.start_day;
    delete object.start_time;
    object.title = object.gr_title;
    delete object.gr_title;
    delete object.gr_completed;
    delete object.gr_datetime_completed;
    delete object.gr_datetime_started;
    object.photo_url = object.gr_photo;
    delete object.gr_photo;
    delete object.gr_unique_id;
    //object.id = Number(object.id);
    delete object.location;
    delete object.notification;
    // Get end_day_and_time
    const end_day_and_time_simple_string = `${object.end_day} ${object.end_time}:00`;
    const end_day_and_time_string = new Date(
      end_day_and_time_simple_string
    ).toString();
    object.end_day_and_time =
      moment(end_day_and_time_simple_string).format('L') +
      ',' +
      moment(end_day_and_time_simple_string).format('LTS');
    delete object.end_day;
    delete object.end_time;
    // Get expected_completion_time
    const numHours = object.numMins / 60;
    let numMins = object.numMins % 60;
    if (numMins < 10) numMins = '0' + numMins;
    object.expected_completion_time = `${numHours}:${numMins}:00`;
    delete object.numMins;
    //object.id = editingRTSContext.editingRTS.id;
    //object.user_id = editingRTSContext.editingRTS.currentUserId;
    object.ta_people_id = '';
    console.log('obj', object);
    let formData = new FormData();
    Object.entries(object).forEach((entry) => {
      // if (typeof entry[1].name == 'string'){
      if (typeof entry[1] == 'string') {
        formData.append(entry[0], entry[1]);
      } else if (entry[1] instanceof Object) {
        entry[1] = JSON.stringify(entry[1]);
        formData.append(entry[0], entry[1]);
      } else {
        formData.append(entry[0], entry[1]);
      }
    });
    for (var pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
    console.log('object.id');
    console.log(object.id);
    if (object.id != '') {
      console.log('updateGR');
      axios
        .post(BASE_URL + 'updateGR', formData)
        .then((_) => {
          const gr_array_index =
            editingRTSContext.editingRTS.gr_array.findIndex(
              (elt) => elt.id === editingRTSContext.editingRTS.id
            );
          const new_gr_array = [...editingRTSContext.editingRTS.gr_array];
          new_gr_array[gr_array_index] = object;
          editingRTSContext.setEditingRTS({
            ...editingRTSContext.editingRTS,
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
      console.log('addGR');
      axios
        .post(BASE_URL + 'addGR', formData)
        .then((_) => {
          console.log(_);
          const gr_array_index =
            editingRTSContext.editingRTS.gr_array.findIndex(
              (elt) => elt.id === editingRTSContext.editingRTS.id
            );
          const new_gr_array = [...editingRTSContext.editingRTS.gr_array];
          new_gr_array[gr_array_index] = object;
          editingRTSContext.setEditingRTS({
            ...editingRTSContext.editingRTS,
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
    // editingRTSContext.setEditingRTS({
    //   ...editingRTSContext.editingRTS,
    //   editing: false
    // })
  };

  return (
    <div
      style={{
        marginTop: '1rem',
        marginLeft: '5rem',
        marginRight: '3rem',

        backgroundColor: '#F57045',
        color: '#ffffff',
      }}
    >
      <Container
        style={{
          paddingLeft: '2rem',
          paddingTop: '1rem',
        }}
      >
        <Row>
          <Col md={4}>
            <div>
              <div>Routine Name </div>
              <input
                style={{
                  borderRadius: '10px',
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
            </div>
          </Col>
          <Col md={4}>
            <div>Start Time</div>
            <Container>
              <Row>
                <Col
                  sm={6}
                  style={{
                    margin: '0',
                    padding: '0',
                  }}
                >
                  <input
                    style={{
                      width: '100%',
                      borderRadius: '10px',
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
                <Col sm={6}>
                  <input
                    style={{
                      width: '100%',
                      borderRadius: '10px',
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
          </Col>
          <Col md={4}>
            <div>End Time</div>
            <Container>
              <Row>
                <Col
                  sm={6}
                  style={{
                    margin: '0',
                    padding: '0',
                  }}
                >
                  <input
                    style={{
                      width: '100%',
                      borderRadius: '10px',
                    }}
                    type="date"
                    value={editingRTSContext.editingRTS.newItem.end_day}
                    onChange={(e) => {
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
                <Col sm={6}>
                  <input
                    style={{
                      width: '100%',
                      borderRadius: '10px',
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
        </Row>
        <Row
          style={{
            padding: '20px 0',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: '#ffffff',
          }}
        >
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
                  <img
                    alt="icon"
                    src={editingRTSContext.editingRTS.newItem.gr_photo}
                  />
                </Col>
              </Row>
            </Container>
          </Col>
          <Col md={8}>
            <div>This Takes Me</div>
            <div>
              <input
                type="number"
                style={{
                  borderRadius: '10px',
                }}
                value={editingRTSContext.editingRTS.newItem.numMins}
                onChange={(e) => {
                  editingRTSContext.setEditingRTS({
                    ...editingRTSContext.editingRTS,
                    newItem: {
                      ...editingRTSContext.editingRTS.newItem,
                      numMins: e.target.value,
                    },
                  });
                }}
              />
              <span> Minutes </span>
            </div>
          </Col>
        </Row>
        <Row
          style={{
            padding: '20px 0',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: '#ffffff',
          }}
        >
          <Col md={8}>
            <div>Repeating Options</div>
            <Container>
              <Row>
                <Col md={6}>
                  <div>
                    Repeat Every
                    <input
                      type="number"
                      style={{
                        width: '60px',
                        margin: '5px 0',
                        borderRadius: '10px',
                      }}
                      value={editingRTSContext.editingRTS.newItem.repeat_every}
                      onChange={(e) => {
                        editingRTSContext.setEditingRTS({
                          ...editingRTSContext.editingRTS,
                          newItem: {
                            ...editingRTSContext.editingRTS.newItem,
                            repeat_every: e.target.value,
                          },
                        });
                      }}
                    />
                    Days
                  </div>
                  <div
                    style={{
                      margin: '10px 0',
                    }}
                  >
                    Does not repeat
                    <input
                      name="repeating"
                      type="checkbox"
                      checked={editingRTSContext.editingRTS.newItem.repeat}
                      onChange={(e) => {
                        editingRTSContext.setEditingRTS({
                          ...editingRTSContext.editingRTS,
                          newItem: {
                            ...editingRTSContext.editingRTS.newItem,
                            repeat: e.target.checked,
                          },
                        });
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
                        <div
                          style={{
                            marginBottom: '10px',
                          }}
                        >
                          <input
                            style={{
                              borderRadius: '10px',
                            }}
                            name="repeatingEnd"
                            type="radio"
                            value="On"
                            checked={
                              editingRTSContext.editingRTS.newItem
                                .repeat_type === 'On'
                            }
                            onChange={(e) => {
                              editingRTSContext.setEditingRTS({
                                ...editingRTSContext.editingRTS,
                                newItem: {
                                  ...editingRTSContext.editingRTS.newItem,
                                  repeat_type: e.target.value,
                                },
                              });
                            }}
                          />
                          On
                          <input
                            style={{
                              borderRadius: '10px',
                            }}
                            type="date"
                            value={
                              editingRTSContext.editingRTS.newItem
                                .repeat_ends_on
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
                            margin: '10px 0',
                          }}
                        >
                          <input
                            style={{
                              borderRadius: '10px',
                            }}
                            name="repeatingEnd"
                            type="radio"
                            value="Occurences"
                            checked={
                              editingRTSContext.editingRTS.newItem
                                .repeat_type === 'Occurences'
                            }
                            onChange={(e) => {
                              editingRTSContext.setEditingRTS({
                                ...editingRTSContext.editingRTS,
                                newItem: {
                                  ...editingRTSContext.editingRTS.newItem,
                                  repeat_type: e.target.value,
                                },
                              });
                            }}
                          />
                          After
                          <input
                            style={{
                              width: '60px',
                              borderRadius: '10px',
                            }}
                            type="number"
                            value={
                              editingRTSContext.editingRTS.newItem
                                .repeat_occurences
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
                          Occurences
                        </div>
                        <div
                          style={{
                            margin: '10px 0',
                          }}
                        >
                          <input
                            style={{
                              borderRadius: '10px',
                            }}
                            name="repeatingEnd"
                            type="radio"
                            value="Never"
                            checked={
                              editingRTSContext.editingRTS.newItem
                                .repeat_type === 'Never'
                            }
                            onChange={(e) => {
                              editingRTSContext.setEditingRTS({
                                ...editingRTSContext.editingRTS,
                                newItem: {
                                  ...editingRTSContext.editingRTS.newItem,
                                  repeat_type: e.target.value,
                                },
                              });
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
                style={{
                  margin: '5px 0',
                  borderRadius: '10px',
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
            </div>
            <span> Available to User </span>
            <input
              type="checkbox"
              checked={editingRTSContext.editingRTS.newItem.is_available}
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
          </Col>
        </Row>
        <Row
          style={{
            padding: '20px 0',
          }}
        >
          <Col md={12}>
            <div> Notification </div>
            <Container>
              <Row
                style={{
                  padding: '10px 0 0 0',
                }}
              >
                <Col md={4}>
                  <div
                    style={{
                      margin: '10px 0',
                    }}
                  >
                    <input
                      type="number"
                      style={{
                        width: '60px',
                        borderRadius: '10px',
                      }}
                      value={
                        editingRTSContext.editingRTS.newItem.ta_notifications
                          .before.time
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
                    }}
                  >
                    User &nbsp;
                    <input
                      type="checkbox"
                      checked={
                        editingRTSContext.editingRTS.newItem.user_notifications
                          .before.is_enabled
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
                    }}
                  >
                    TA &nbsp;&nbsp;&nbsp;&nbsp;
                    <input
                      type="checkbox"
                      checked={
                        editingRTSContext.editingRTS.newItem.ta_notifications
                          .before.is_enabled
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
                      }}
                      value={
                        editingRTSContext.editingRTS.newItem.ta_notifications
                          .before.message
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
                </Col>
                <Col md={4}>
                  <div
                    style={{
                      margin: '10px 0',
                    }}
                  >
                    <input
                      type="number"
                      style={{
                        width: '60px',
                        borderRadius: '10px',
                      }}
                      value={
                        editingRTSContext.editingRTS.newItem.ta_notifications
                          .during.time
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
                    }}
                  >
                    User &nbsp;
                    <input
                      type="checkbox"
                      checked={
                        editingRTSContext.editingRTS.newItem.user_notifications
                          .during.is_enabled
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
                    }}
                  >
                    TA &nbsp;&nbsp;&nbsp;&nbsp;
                    <input
                      type="checkbox"
                      checked={
                        editingRTSContext.editingRTS.newItem.ta_notifications
                          .during.is_enabled
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
                      }}
                      value={
                        editingRTSContext.editingRTS.newItem.ta_notifications
                          .during.message
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
                </Col>
                <Col md={4}>
                  <div
                    style={{
                      margin: '10px 0',
                    }}
                  >
                    <input
                      type="number"
                      style={{
                        width: '60px',
                        borderRadius: '10px',
                      }}
                      value={
                        editingRTSContext.editingRTS.newItem.ta_notifications
                          .after.time
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
                    Mins After End Time
                  </div>
                  <div
                    style={{
                      margin: '10px 0',
                    }}
                  >
                    User &nbsp;
                    <input
                      type="checkbox"
                      checked={
                        editingRTSContext.editingRTS.newItem.user_notifications
                          .after.is_enabled
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
                    }}
                  >
                    TA &nbsp;&nbsp;&nbsp;&nbsp;
                    <input
                      type="checkbox"
                      checked={
                        editingRTSContext.editingRTS.newItem.ta_notifications
                          .after.is_enabled
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
                      }}
                      value={
                        editingRTSContext.editingRTS.newItem.ta_notifications
                          .after.message
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
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
        <Row
          style={{
            padding: '0 0 20px 0',
          }}
        >
          <Col md={12}>
            <div
              style={{
                textAlign: 'center',
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
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EditRTS;
