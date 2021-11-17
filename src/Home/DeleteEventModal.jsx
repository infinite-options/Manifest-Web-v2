import React, { useEffect, useState,useContext } from 'react';
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
import {
  deleteTheCalenderEvent, publishTheCalenderEvent, updateTheCalenderEvent
} from './GoogleApiService';
import moment from 'moment';

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;

export default function DeleteEventModal(props) {
  const loginContext = useContext(LoginContext);
  var userID = '';
  var userTime_zone = '';
  var userEmail = '';
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
  } else {
    userID = loginContext.loginState.curUser;
    userTime_zone = loginContext.loginState.curUserTimeZone;
    userEmail = loginContext.loginState.curUserEmail;
  }
    const [recurrence, setRecurrence] = useState('');
    const [recurrenceRule, setRecurrenceRule] = useState('');
    const [recEvent, setRecEvent] = useState({});
    useEffect(() => {
      if (props.event.recurringEventId !== undefined) {
        var requestRecurringEvent = window.gapi.client.calendar.events.get({
          calendarId: 'primary',
          eventId: props.event.recurringEventId,
        });
        requestRecurringEvent.execute(function (resp) {
          console.log(resp);
          setRecEvent(resp);
          let recurrence = resp.recurrence;
          setRecurrence(recurrence);
          setRecurrenceRule(recurrence);
          return recurrence;
        });
      }
    }, [props.event]);

    const [showDeleteRecurringModal, setShowDeleteRecurringModal] =
      useState(props.stateValue.showDeleteRecurringModal);
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
          deleteSubmit(event.id)
        
      } else if (deleteRecurringOption === 'This and following events') {
       let url = BASE_URL + 'googleRecurringInstances/';
       let id = userID;
       let eventId = props.event.recurringEventId;
       
       axios
         .post(url + id.toString() + ',' + eventId.toString())
         .then((res) => {
           console.log('/googleRecurringInstances: ', res.data);
           console.log('before delete submit', res.data[0]);
           if (res.data[0].id === event.id) {
             console.log('before delete submit',event)
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
             console.log(event, recEvent)
             let newRecurrenceRule = recurrenceRule;
             let newUntilSubString = `${moment(
               event.start.dateTime
             ).format('YYYYMMDD')}`;

             let countSubString = '';
             let countIndex = recurrenceRule.indexOf('COUNT');
             if (countIndex !== -1) {
               countSubString = recurrenceRule.substring(countIndex);
             }
             if (countSubString.includes(';')) {
               let endCountIndex = countSubString.indexOf(';');
               countSubString = countSubString.substring(6, endCountIndex);
             } else if (countSubString) {
               countSubString = countSubString.substring(6);
             }

             let intervalSubString = '';
             let intervalIndex = recurrence.indexOf('INTERVAL');
             if (intervalIndex !== -1) {
               intervalSubString = recurrence.substring(intervalIndex);
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

             if (newRecurrenceRule.includes('UNTIL')) {
               let untilSubString = '';
               let untilIndex = recurrenceRule.indexOf('UNTIL');
               if (untilIndex !== -1) {
                 untilSubString =
                   recurrenceRule.substring(untilIndex);
               }
               if (untilSubString.includes(';')) {
                 let endUntilIndex = untilSubString.indexOf(';');
                 untilSubString = untilSubString.substring(6, endUntilIndex);
               } else if (untilSubString) {
                 untilSubString = untilSubString = untilSubString.substring(6);
               }

               console.log(untilSubString, newUntilSubString, 'untilSubString');

               newRecurrenceRule = newRecurrenceRule.replace(
                 untilSubString,
                 newUntilSubString
               );
             } else if (newRecurrenceRule.includes('COUNT')) {
               let start = moment(res.data[0].start.dateTime);
               let end = moment(event.end.dateTime);

               let arr = res.data.filter((e, i) => {
                 return moment(e.start.dateTime).isBefore(end);
               });
               console.log(start,end)
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
            //  newEvent.start = res.data[0].start;
            //  newEvent.end = res.data[0].end;
            //  newEvent.recurrence = [
            //    'RRULE:FREQ=DAILY;UNTIL=20211117T065959Z;INTERVAL=1',
            //  ];
            //  newEvent.summary = res.data[0].summary;
            //  newEvent.id = res.data[0].recurringEventId;
            newEvent.start = {
                        "dateTime": "2011-11-15T09:00:00.000-07:00",
                        "timeZone": "America/Los_Angeles"
                                };
            newEvent.end = {
                      "dateTime": "2011-11-15T09:30:00.000-07:00",
                      "timeZone": "America/Los_Angeles"
                    };
            newEvent.recurrence = [
              'RRULE:FREQ=DAILY;UNTIL=20211117T092959Z;INTERVAL=1',
            ];
            newEvent.summary = 'Test Event';
            newEvent.id = res.data[0].recurringEventId;
             console.log(newEvent)
             updateTheCalenderEvent(newEvent)
             
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
       deleteTheCalenderEvent(id);
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
      color: '#67ABFC',
      border: '1px solid #67ABFC',
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
                      border: '1px #67ABFC solid',
                      borderRadius: '30px',
                      color: '#67ABFC',
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
                      border: '1px #67ABFC solid',
                      borderRadius: '30px',
                      color: '#67ABFC',
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