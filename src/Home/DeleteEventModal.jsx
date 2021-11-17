import React, { useEffect, useState } from 'react';
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
import {
  deleteTheCalenderEvent,
} from './GoogleApiService';

export default function DeleteEventModal(props) {
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
       // await axios
        //   .get('/getRecurringEventInstances', {
        //     params: {
        //       recurringEventId: newEventRecurringID,
        //     },
        //   })
        //   .then((res) => {
            
        //     if (res.data[0].id === this.state.newEvent.id) {
        //       axios
        //         .post('/deleteEvent', {
        //           userId: this.state.currentUserId,
        //           eventId: newEventRecurringID,
        //         })
        //         .then((response) => {
        //           console.log('response: ', response);
        //           this.setState({
        //             dayEventSelected: false,
        //             showDeleteRecurringModal: false,
        //           });
        //           this.updateEventsArray();
        //         })
        //         .catch(function (error) {
        //           console.log(error);
        //         });
        //     } else {
        //       let newEvent = {
        //         reminders: this.state.newEvent.reminders,
        //         creator: this.state.newEvent.creator,
        //         created: this.state.newEvent.created,
        //         organizer: this.state.newEvent.organizer,
        //         sequence: this.state.newEvent.sequence,
        //         status: this.state.newEvent.status,
        //       };
        //       let newRecurrenceRule = this.state.recurrenceRule;
        //       let newUntilSubString = `${moment(
        //         this.state.newEventStart0
        //       ).format('YYYYMMDD')}`;

        //       let countSubString = '';
        //       let countIndex = this.state.recurrenceRule.indexOf('COUNT');
        //       if (countIndex !== -1) {
        //         countSubString =
        //           this.state.recurrenceRule.substring(countIndex);
        //       }
        //       if (countSubString.includes(';')) {
        //         let endCountIndex = countSubString.indexOf(';');
        //         countSubString = countSubString.substring(6, endCountIndex);
        //       } else if (countSubString) {
        //         countSubString = countSubString.substring(6);
        //       }

        //       let intervalSubString = '';
        //       let intervalIndex = recurrenceRule.indexOf('INTERVAL');
        //       if (intervalIndex !== -1) {
        //         intervalSubString = recurrenceRule.substring(intervalIndex);
        //       }
        //       if (intervalSubString.includes(';')) {
        //         let endIntervalIndex = intervalSubString.indexOf(';');
        //         intervalSubString = intervalSubString.substring(
        //           9,
        //           endIntervalIndex
        //         );
        //       } else if (intervalSubString) {
        //         intervalSubString = intervalSubString.substring(9);
        //       }

        //       if (newRecurrenceRule.includes('UNTIL')) {
        //         let untilSubString = '';
        //         let untilIndex = this.state.recurrenceRule.indexOf('UNTIL');
        //         if (untilIndex !== -1) {
        //           untilSubString =
        //             this.state.recurrenceRule.substring(untilIndex);
        //         }
        //         if (untilSubString.includes(';')) {
        //           let endUntilIndex = untilSubString.indexOf(';');
        //           untilSubString = untilSubString.substring(6, endUntilIndex);
        //         } else if (untilSubString) {
        //           untilSubString = untilSubString = untilSubString.substring(6);
        //         }

        //         console.log(
        //           untilSubString,
        //           newUntilSubString,
        //           'untilSubString'
        //         );

        //         newRecurrenceRule = newRecurrenceRule.replace(
        //           untilSubString,
        //           newUntilSubString
        //         );
        //       } else if (newRecurrenceRule.includes('COUNT')) {
        //         let start = moment(res.data[0].start.dateTime);
        //         let end = moment(this.state.newEventStart0);

        //         let arr = res.data.filter((e, i) => {
        //           return moment(e.start.dateTime).isBefore(end);
        //         });

        //         // let diff =
        //         //   moment.duration(end.diff(start)).asDays() /
        //         //   parseInt(intervalSubString);
        //         // console.log(diff, intervalSubString, "diff");
        //         newRecurrenceRule = newRecurrenceRule.replace(
        //           countSubString,
        //           arr.length
        //         );
        //       } else {
        //         newRecurrenceRule = newRecurrenceRule.concat(
        //           `;UNTIL=${newUntilSubString}`
        //         );
        //       }
        //       newEvent.start = res.data[0].start;
        //       newEvent.end = res.data[0].end;
        //       newEvent.recurrence = [newRecurrenceRule];
        //       newEvent.summary = res.data[0].summary;

        //       axios
        //         .put('/updateEvent', {
        //           extra: newEvent,
        //           eventId: newEventRecurringID,
        //           username: this.state.currentUserName,
        //           id: this.state.currentUserId,
        //           // start: updatedEvent.start,
        //           // end: updatedEvent.end,
        //         })
        //         .then((response) => {
        //           this.setState({
        //             dayEventSelected: false,
        //             newEventName: '',
        //             newEventStart0: new Date(),
        //             newEventEnd0: new Date(),
        //           });

        //           this.updateEventsArray();
        //         })

        //         .catch(function (error) {
        //           console.log(error);
        //         });
        //     }
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //   });
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