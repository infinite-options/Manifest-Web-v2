import React, { useEffect, useState, useContext } from 'react';
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Modal,
  Dropdown,
  DropdownButton,
} from 'react-bootstrap';
import axios from 'axios';
import LoginContext from '../LoginContext';
import moment from 'moment';

const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;

export default function DeleteEventModal(props) {
  const loginContext = useContext(LoginContext);
  var userID = '';
  var userTime_zone = '';
  var userEmail = '';
  var userPic = '';
  var userN = '';
  if (
    document.cookie
      .split(';')
      .some((item) => item.trim().startsWith('patient_uid='))
  ) {
    userID = document.cookie
      .split('; ')
      .find((row) => row.startsWith('patient_uid='))
      .split('=')[1];
    userTime_zone = document.cookie
      .split('; ')
      .find((row) => row.startsWith('patient_timeZone='))
      .split('=')[1];
    userEmail = document.cookie
      .split('; ')
      .find((row) => row.startsWith('patient_email='))
      .split('=')[1];
    userPic = document.cookie
      .split('; ')
      .find((row) => row.startsWith('patient_pic='))
      .split('=')[1];
    userN = document.cookie
      .split('; ')
      .find((row) => row.startsWith('patient_name='))
      .split('=')[1];
  } else {
    userID = loginContext.loginState.curUser;
    userTime_zone = loginContext.loginState.curUserTimeZone;
    userEmail = loginContext.loginState.curUserEmail;
    userPic = loginContext.loginState.curUserPic;
    userN = loginContext.loginState.curUserName;
  }
  const [recurrence, setRecurrence] = useState('');
  const [recurrenceRule, setRecurrenceRule] = useState('');
  const [recEvent, setRecEvent] = useState({});
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
    if (a_parity === 'pm' && a_HMS[0] !== '12') {
      const hoursInt = parseInt(a_HMS[0]) + 12;
      a_HMS[0] = `${hoursInt}`;
    } else if (a_parity === 'am' && a_HMS[0] === '12') a_HMS[0] = '00';

    if (b_parity === 'pm' && b_HMS[0] !== '12') {
      const hoursInt = parseInt(b_HMS[0]) + 12;
      b_HMS[0] = `${hoursInt}`;
    } else if (b_parity === 'am' && b_HMS[0] === '12') b_HMS[0] = '00';

    for (let i = 0; i < a_HMS.length; i++) {
      a_time += Math.pow(60, a_HMS.length - i - 1) * parseInt(a_HMS[i]);
      b_time += Math.pow(60, b_HMS.length - i - 1) * parseInt(b_HMS[i]);
    }

    return [a_time, b_time];
  };
  useEffect(() => {
    if (props.event.recurringEventId !== undefined) {
      // var requestRecurringEvent = window.gapi.client.calendar.events.get({
      //   calendarId: 'primary',
      //   eventId: props.event.recurringEventId,
      // });
      // var requestRecurringEvent;
      const headers = {
        Accept: 'application/json',
        Authorization: 'Bearer ' + props.userAccessToken,
      };
      let url = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${props.event.recurringEventId}/instances?key=${API_KEY}`;
      axios
        .get(url, {
          headers: headers,
        })
        .then((response) => {
          console.log('rec events', response.data.items);
          setRecEvent(response.data.items);
          if (response.data.items.recurrence != undefined) {
            let recurrence = response.data.items.recurrence;
            setRecurrence(recurrence);
            setRecurrenceRule(recurrence);
            return recurrence;
          }
        });
      // requestRecurringEvent.execute(function (resp) {
      //   console.log(resp);
      //   setRecEvent(resp);
      //   let recurrence = resp.recurrence;
      //   setRecurrence(recurrence);
      //   setRecurrenceRule(recurrence);
      //   return recurrence;
      // });
    }
  }, [props.event]);
  console.log(recurrenceRule);

  const [showDeleteRecurringModal, setShowDeleteRecurringModal] = useState(
    props.stateValue.showDeleteRecurringModal
  );
  const [deleteRecurringOption, setDeleteRecurringOption] = useState(
    props.stateValue.deleteRecurringOption
  );
  const closeDeleteRecurringModal = () => {
    props.setStateValue((prevState) => {
      return {
        ...prevState,
        showDeleteRecurringModal: !showDeleteRecurringModal,
      };
    });
  };

  const deleteRecurring = (event) => {
    //e.preventDefault();
    console.log('delete', event);
    if (deleteRecurringOption === 'This event') {
      console.log('delete this event', event);
      //deleteTheCalenderEvent(event.id);
      deleteSubmit(event.id);
    } else if (deleteRecurringOption === 'This and following events') {
      // let url = BASE_URL + 'googleRecurringInstances/';
      let id = userID;
      let eventId = props.event.recurringEventId;
      const headers = {
        Accept: 'application/json',
        Authorization: 'Bearer ' + props.userAccessToken,
      };
      let url = `https://content.googleapis.com/calendar/v3/calendars/primary/events/${eventId}/instances?key=${API_KEY}`;

      axios
        .get(url, {
          headers: headers,
        })
        .then((res) => {
          console.log('/googleRecurringInstances: ', res.data.items);
          console.log('before delete submit', res.data.items[0]);
          if (res.data.items[0].id === event.id) {
            console.log('before delete submit', event);
            deleteSubmit(eventId);
          } else {
            let newEvent = {
              reminders: event.reminders,
              creator: event.creator,
              created: event.created,
              organizer: event.organizer,
              sequence: event.sequence,
              status: event.status,
            };
            console.log(event, recEvent);
            let newRecurrenceRule = recurrenceRule[0];
            let newUntilSubString = `${moment(event.start.dateTime).format(
              'YYYYMMDD'
            )}`;
            console.log(newRecurrenceRule, newUntilSubString);
            let countSubString = '';
            let countIndex = recurrenceRule[0].indexOf('COUNT');
            if (countIndex !== -1) {
              countSubString = recurrenceRule[0].substring(countIndex);
            }
            if (countSubString.includes(';')) {
              let endCountIndex = countSubString.indexOf(';');
              countSubString = countSubString.substring(6, endCountIndex);
              console.log(countSubString);
            } else if (countSubString) {
              countSubString = countSubString.substring(6);
              console.log(countSubString);
            }

            let intervalSubString = '';
            let intervalIndex = recurrenceRule[0].indexOf('INTERVAL');
            console.log(intervalIndex);
            if (intervalIndex !== -1) {
              intervalSubString = recurrenceRule[0].substring(intervalIndex);
              console.log(intervalIndex);
            }
            if (intervalSubString.includes(';')) {
              let endIntervalIndex = intervalSubString.indexOf(';');
              intervalSubString = intervalSubString.substring(
                9,
                endIntervalIndex
              );
            } else if (intervalSubString) {
              intervalSubString = intervalSubString.substring(9);
            }
            console.log(newRecurrenceRule[0].includes(';UNTIL') ? true : false);
            if (newRecurrenceRule.includes('UNTIL')) {
              console.log('Includes UNTIL');
              let untilSubString = '';
              let untilIndex = recurrenceRule[0].indexOf('UNTIL');
              console.log('Includes UNTIL', untilIndex);
              if (untilIndex !== -1) {
                untilSubString = recurrenceRule[0].substring(untilIndex);
                console.log('Includes UNTIL', untilSubString);
              }
              if (untilSubString.includes(';')) {
                let endUntilIndex = untilSubString.indexOf(';');
                console.log('Includes UNTIL', endUntilIndex);
                untilSubString = untilSubString.substring(6, endUntilIndex);
                console.log('Includes UNTIL', untilSubString);
              } else if (untilSubString) {
                untilSubString = untilSubString.substring(6);
                console.log('Includes UNTIL', untilSubString);
              }

              console.log('substring', untilSubString, newUntilSubString);

              newRecurrenceRule = newRecurrenceRule.replace(
                untilSubString,
                newUntilSubString
              );
              console.log(newRecurrenceRule);
            } else if (newRecurrenceRule.includes('COUNT')) {
              let start = moment(res.data[0].start.dateTime);
              let end = moment(event.end.dateTime);

              let arr = res.data.filter((e, i) => {
                return moment(e.start.dateTime).isBefore(end);
              });
              console.log(start, end);
              // let diff =
              //   moment.duration(end.diff(start)).asDays() /
              //   parseInt(intervalSubString);
              // console.log(diff, intervalSubString, "diff");
              newRecurrenceRule = newRecurrenceRule.replace(
                countSubString,
                arr.length
              );
            } else {
              newRecurrenceRule = newRecurrenceRule.concat(
                `;UNTIL=${newUntilSubString}`
              );
            }
            newEvent.start = res.data[0].start;
            newEvent.end = res.data[0].end;
            newEvent.recurrence = [newRecurrenceRule];
            newEvent.summary = res.data[0].summary;
            newEvent.id = res.data[0].recurringEventId;
            newEvent.attendees = res.data[0].attendees;
            // newEvent.start = {
            //             "dateTime": "2011-11-15T09:00:00.000-07:00",
            //             "timeZone": "America/Los_Angeles"
            //                     };
            // newEvent.end = {
            //           "dateTime": "2011-11-15T09:30:00.000-07:00",
            //           "timeZone": "America/Los_Angeles"
            //         };
            // newEvent.recurrence = [
            //   'RRULE:FREQ=DAILY;UNTIL=20211117T092959Z;INTERVAL=1',
            // ];
            // newEvent.summary = 'Test Event';

            console.log(newEvent);
            // updateTheCalenderEvent(newEvent);
            const headers = {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: 'Bearer ' + props.taAccessToken,
            };
            axios
              .put(
                `https://www.googleapis.com/calendar/v3/calendars/primary/events/${newEvent.id}?key=${API_KEY}`,
                newEvent,
                {
                  headers: headers,
                }
              )
              .then((response) => {
                console.log(response);
              })
              .catch((error) => {
                console.log('error', error);
              });
            props.setStateValue((prevState) => {
              return {
                ...prevState,
                showDeleteRecurringModal: !showDeleteRecurringModal,
              };
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (deleteRecurringOption === 'All events') {
      // deleteTheCalenderEvent(event.recurringEventId);
      deleteSubmit(event.recurringEventId);
    }
  };

  const deleteSubmit = (id) => {
    // deleteTheCalenderEvent(id);
    // const headers = {
    //   'Content-Type': 'application/json',
    //   Accept: 'application/json',
    //   Authorization: 'Bearer ' + props.taAccessToken,
    // };
    // axios
    //   .delete(
    //     `https://www.googleapis.com/calendar/v3/calendars/primary/events/${id}?key=${API_KEY}`,
    //     {
    //       headers: headers,
    //     }
    //   )
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((error) => {
    //     console.log('error', error);
    //   });
    const deleteEvent = async () => {
      const headersTa = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + props.taAccessToken,
      };
      await axios
        .delete(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events/${id}?key=${API_KEY}`,
          {
            headers: headersTa,
          }
        )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log('error', error);
        });
      alert('Deleted');

      let start =
        props.stateValue.dateContext.format('YYYY-MM-DD') + 'T00:00:00-07:00';
      let endofWeek = moment(props.stateValue.dateContext).add(6, 'days');
      let end = endofWeek.format('YYYY-MM-DD') + 'T23:59:59-07:00';
      const headersUser = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + props.userAccessToken,
      };
      const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?orderBy=startTime&singleEvents=true&timeMax=${end}&timeMin=${start}&key=${API_KEY}`;
      await axios
        .get(url, {
          headers: headersUser,
        })
        .then((response) => {
          console.log('day events ', response.data.items);
          const temp = [];

          for (let i = 0; i < response.data.items.length; i++) {
            temp.push(response.data.items[i]);
          }
          temp.sort((a, b) => {
            // console.log('a = ', a, '\nb = ', b);
            const [a_start, b_start] = [
              a['start']['dateTime'],
              b['start']['dateTime'],
            ];
            console.log('a_start = ', a_start, '\nb_start = ', b_start);
            const [a_end, b_end] = [a['end']['dateTime'], b['end']['dateTime']];

            const [a_start_time, b_start_time] = getTimes(
              a['start']['dateTime'],
              b['start']['dateTime']
            );
            const [a_end_time, b_end_time] = getTimes(
              a['end']['dateTime'],
              b['end']['dateTime']
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

          console.log('homeTemp = ', temp);

          props.setEvents(temp);
        })
        .catch((error) => console.log(error));
    };
    deleteEvent();
    props.setStateValue((prevState) => {
      return {
        ...prevState,
        showDeleteRecurringModal: !showDeleteRecurringModal,
      };
    });
  };

  const modalStyle = {
    position: 'absolute',
    zIndex: '5',
    left: '50%',
    top: '50%',
    transform: 'translate(0%, -50%)',
    width: '400px',
    color: '#D6B7FF',
    border: '1px solid #D6B7FF',
  };
  return (
    <div>
      {console.log('deleteeventmodal', props)}
      <Modal.Dialog style={modalStyle}>
        <Modal.Header closeButton onHide={closeDeleteRecurringModal}>
          <Modal.Title>
            <h5 className="normalfancytext">Delete Recurring Event</h5>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body
          style={{
            // padding: "85px 0",
            height: '250px',
            margin: 'auto',
          }}
        >
          <Form
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Form.Group
              style={{
                height: '60%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
              }}
              className="delete-repeat-form"
              onChange={(e) => {
                if (e.target.type === 'radio') {
                  setDeleteRecurringOption(e.target.value);
                  // props.setStateValue({
                  //   deleteRecurringOption: e.target.value,
                  // });
                }
              }}
            >
              <Form.Check type="radio">
                <Form.Check.Label style={{ marginLeft: '5px' }}>
                  <Form.Check.Input
                    type="radio"
                    value="This event"
                    name="radios"
                    defaultChecked={
                      deleteRecurringOption === 'This event' && true
                    }
                  />
                  This event
                  {console.log(deleteRecurringOption)}
                </Form.Check.Label>
              </Form.Check>
              <Form.Check type="radio">
                <Form.Check.Label style={{ marginLeft: '5px' }}>
                  <Form.Check.Input
                    type="radio"
                    value="This and following events"
                    name="radios"
                    defaultChecked={
                      deleteRecurringOption === 'This and following events' &&
                      true
                    }
                  />
                  This and following events
                  {console.log(deleteRecurringOption)}
                </Form.Check.Label>
              </Form.Check>
              <Form.Check type="radio">
                <Form.Check.Label style={{ marginLeft: '5px' }}>
                  <Form.Check.Input
                    type="radio"
                    value="All events"
                    name="radios"
                    defaultChecked={
                      deleteRecurringOption === 'All events' && true
                    }
                  />
                  All events
                  {console.log(deleteRecurringOption)}
                </Form.Check.Label>
              </Form.Check>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Container>
            <Row>
              <Col>
                <button
                  style={{
                    width: '110px',
                    padding: '0',
                    margin: '0 20px',
                    backgroundColor: 'inherit',
                    border: '1px #D6B7FF solid',
                    borderRadius: '30px',
                    color: '#D6B7FF',
                    textAlign: 'center',
                  }}
                  onClick={closeDeleteRecurringModal}
                >
                  Cancel
                </button>
              </Col>
              <Col>
                <button
                  style={{
                    width: '110px',
                    padding: '0',
                    margin: '0 20px',
                    backgroundColor: 'inherit',
                    border: '1px #D6B7FF solid',
                    borderRadius: '30px',
                    color: '#D6B7FF',
                    textAlign: 'center',
                  }}
                  onClick={(e) => {
                    deleteRecurring(props.event);
                  }}
                >
                  Save changes
                </button>
              </Col>
            </Row>
          </Container>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  );
}
