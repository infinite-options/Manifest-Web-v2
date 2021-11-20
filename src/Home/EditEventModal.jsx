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
import trash from '../manifest/LoginAssets/Trash.png';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.css';
import {deleteTheCalenderEvent, instancesTheCalenderEvent, publishTheCalenderEvent, updateTheCalenderEvent} from './GoogleApiService';
import LoginContext from '../LoginContext';
import moment from 'moment';

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;

export default function EditEventModal(props) {
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
   
    const [fields, setFields] = useState([{ email: userEmail }]);
    
    const [showEditModal, setShowEditModal] = useState(props.stateValue.showEditModal);
    const [showEditRecurringModal, setShowEditRecurringModal] = useState(
      props.stateValue.showEditRecurringModal
    );
    const [editRecurringOption, setEditRecurringOption] = useState(
      props.stateValue.editRecurringOption
    );
    const [summary, setSummary] = useState(props.event.summary);
    const [startTime, setStartTime] = useState(
      moment(props.event.start.dateTime).toDate()
    );
    const [endTime, setEndTime] = useState(moment(props.event.end.dateTime).toDate());
    console.log(startTime);
    console.log(endTime);
    const [location, setLocation] = useState(
      props.event.location === undefined ? '' : props.event.location
    );
    const [description, setDescription] = useState(props.event.description === undefined ? '' : props.event.description);
    const [repeatOptionDropDown, setRepeatOptionDropDown] = useState(
      props.event.recurringEventId === undefined ? 'Does not repeat' : 'Custom'
    );
    const [repeatOption, setRepeatOption] = useState(
      props.event.recurringEventId === undefined ? false : true
    );
    const [showRepeatModal, setShowRepeatModal] = useState(false);
    const [repeatDropDown, setRepeatDropDown] = useState('DAY');
    const [repeatDropDown_temp, setRepeatDropDown_temp] = useState('DAY');
    const [repeatMonthlyDropDown, setRepeatMonthlyDropDown] =
      useState('Monthly on day 13');
    const [repeatInputValue, setRepeatInputValue] = useState('1');
    const [repeatInputValue_temp, setRepeatInputValue_temp] = useState('1');
    const [repeatOccurrence, setRepeatOccurrence] = useState('1');
    const [repeatOccurrence_temp, setRepeatOccurrence_temp] = useState('1');
    const [repeatRadio, setRepeatRadio] = useState('Never');
    const [repeatRadio_temp, setRepeatRadio_temp] = useState('Never');
    const [repeatEndDate, setRepeatEndDate] = useState('');
    const [repeatEndDate_temp, setRepeatEndDate_temp] = useState('');

    const [byDay, setByDay] = useState({
      0: '',
      1: '',
      2: '',
      3: '',
      4: '',
      5: '',
      6: '',
    });
    const [byDay_temp, setByDay_temp] = useState({
      0: '',
      1: '',
      2: '',
      3: '',
      4: '',
      5: '',
      6: '',
    });
    const [recurrence, setRecurrence] = useState('');
    const [recurrenceRule, setRecurrenceRule] = useState('');
    const [recEvent, setRecEvent] =useState({})
    useEffect(() => {
    if(props.event.recurringEventId !== undefined){
        var requestRecurringEvent = window.gapi.client.calendar.events.get({
          calendarId: 'primary',
          eventId: props.event.recurringEventId,
        });
        requestRecurringEvent.execute(function (resp) {
          console.log(resp)
          setRecEvent(resp)
          let recurrence = resp.recurrence;
          setRecurrence(recurrence);
          setRecurrenceRule(recurrence)
          return recurrence;
        });
        
    }
  },[props.event])
    
    const [reminderMethod, setReminderMethod] = useState('');
    const [reminderMinutes, setReminderMinutes] = useState('');
      const openEditRecurringModal = (r) => {
        console.log('openeditmodal called', r);

        console.log('opendeletemodal rec', r, showEditRecurringModal);
        setShowEditRecurringModal(!showEditRecurringModal)
        //console.log(instancesTheCalenderEvent(r.recurringEventId))
        
      };

    const closeEditModal = () => {
      props.setStateValue((prevState) => {
        return {
          ...prevState,
          showEditModal: !showEditModal,
        };
      });
    };
    const closeEditRecurringModal = () => {
      setShowEditRecurringModal(!showEditRecurringModal)
    };
    function handleChange(i, event) {
        const emails = [...fields];
        emails[i].email = event.target.value;
        setFields(emails);
    }

    function handleAdd() {
        const emails = [...fields];
        emails.push({ email: userEmail });
        setFields(emails);
    }

    function handleRemove(i) {
        const emails = [...fields];
        emails.splice(i, 1);
        setFields(emails);
    }
    const startTimePicker = () => {
      return (
        <DatePicker
          wrapperClassName="datePicker"
          className="form-control"
          type="text"
          selected={startTime}
          onChange={(date) => {
            setStartTime(date);
          }}
          showTimeSelect
          timeIntervals={15}
          timeCaption="time"
          dateFormat="MMMM d, yyyy h:mm aa"
        />
      );
    };

    const endTimePicker = () => {
      return (
        <DatePicker
          wrapperClassName="datePicker"
          className="form-control"
          type="text"
          selected={endTime}
          onChange={(date) => {
            setEndTime(date);
          }}
          showTimeSelect
          timeIntervals={15}
          timeCaption="time"
          dateFormat="MMMM d, yyyy h:mm aa"
        />
      );
    };

    const openRepeatModal = () => {
      setShowRepeatModal((prevState) => {
        return { showRepeatModal: !prevState.showRepeatModal };
      });
    };

    const closeRepeatModal = () => {
      setShowRepeatModal(false);
      setRepeatInputValue_temp((prevState) => {
        return {
          ...prevState,
          repeatInputValue_temp: prevState.repeatInputValue,
        };
      });
      setRepeatOccurrence_temp((prevState) => {
        return {
          ...prevState,
          repeatOccurrence_temp: prevState.repeatOccurrence,
        };
      });
      setRepeatDropDown_temp((prevState) => {
        return {
          ...prevState,
          repeatDropDown_temp: prevState.repeatDropDown,
        };
      });
      setRepeatRadio_temp((prevState) => {
        return {
          ...prevState,
          repeatRadio_temp: prevState.repeatRadio,
        };
      });
      setRepeatEndDate_temp((prevState) => {
        return {
          ...prevState,
          repeatEndDate_temp: prevState.repeatEndDate,
        };
      });
      setByDay_temp((prevState) => {
        return {
          ...prevState,
          byDay_temp: prevState.byDay,
        };
      });

      if (!repeatOption && repeatOptionDropDown === 'Custom...') {
        setRepeatOptionDropDown('Does not repeat');
      }
    };

    const handleRepeatDropDown = (eventKey, week_days) => {
      if (eventKey === 'WEEK') {
        const newByDay = {
          ...byDay_temp,
          [startTime.getDay()]: week_days[startTime.getDay()],
        };
        setRepeatDropDown_temp(eventKey);
        setByDay_temp(newByDay);
      }
      setRepeatDropDown_temp(eventKey);
    };

    const handleRepeatMonthlyDropDown = (eventKey) => {
      setRepeatMonthlyDropDown(eventKey);
    };

    const handleRepeatEndDate = (date) => {
      setRepeatEndDate_temp(date);
    };

    const handleRepeatInputValue = (eventKey) => {
      setRepeatInputValue_temp(eventKey);
    };

    const handleRepeatOccurrence = (eventKey) => {
      setRepeatOccurrence_temp(eventKey);
    };
    const handleReminderMinutes = (eventKey) => {
      setReminderMinutes(eventKey);
    };

    const saveRepeatChanges = () => {
      setShowRepeatModal(false);
      setRepeatOption(true);
      setRepeatInputValue((prevState) => {
        return {
          ...prevState,
          repeatInputValue: prevState.repeatInputValue_temp,
        };
      });
      setRepeatOccurrence((prevState) => {
        return {
          ...prevState,
          repeatOccurrence: prevState.repeatOccurrence_temp,
        };
      });
      setRepeatDropDown((prevState) => {
        return {
          ...prevState,
          repeatDropDown: prevState.repeatDropDown_temp,
        };
      });
      setRepeatRadio((prevState) => {
        return {
          ...prevState,
          repeatRadio: prevState.repeatRadio_temp,
        };
      });
      setRepeatEndDate((prevState) => {
        return {
          ...prevState,
          repeatEndDate: prevState.repeatEndDate_temp,
        };
      });
      setByDay((prevState) => {
        return {
          ...prevState,
          byDay: prevState.byDay_temp,
        };
      });

      // If repeatDropDown_temp is DAY
      console.log(repeatDropDown_temp);
      console.log(repeatInputValue_temp);
      if (repeatDropDown_temp === 'Day') {
        if (repeatInputValue_temp === '1') {
          if (repeatRadio_temp === 'Never') {
            setRepeatOptionDropDown('Daily');
            setRecurrenceRule('RRULE:FREQ=DAILY;INTERVAL=1');
          } else if (repeatRadio_temp === 'On') {
            setRepeatOptionDropDown(
              `Daily, until ${moment(repeatEndDate_temp).format('LL')}`
            );
            setRecurrenceRule(
              `RRULE:FREQ=DAILY;INTERVAL=1;UNTIL=${moment(
                repeatEndDate_temp
              ).format('YYYYMMDD')}`
            );
          } else {
            if (repeatOccurrence_temp === '1') {
              setRepeatOptionDropDown(`Once`);
              setRecurrenceRule(`RRULE:FREQ=DAILY;INTERVAL=1;COUNT=1')}`);
            } else {
              setRepeatOptionDropDown(`Daily, ${repeatOccurrence_temp} times`);
              setRecurrenceRule(
                `RRULE:FREQ=DAILY;INTERVAL=1;COUNT=${repeatOccurrence_temp}`
              );
            }
          }
        } else {
          if (repeatRadio_temp === 'Never') {
            setRepeatOptionDropDown(`Every ${repeatInputValue_temp} days`);
            setRecurrenceRule(
              `RRULE:FREQ=DAILY;INTERVAL=${repeatInputValue_temp}`
            );
          } else if (repeatRadio_temp === 'On') {
            setRepeatOptionDropDown(
              `Every ${repeatInputValue_temp} days, until ${moment(
                repeatEndDate_temp
              ).format('LL')}`
            );
            setRecurrenceRule(
              `RRULE:FREQ=DAILY;INTERVAL=${repeatInputValue_temp};UNTIL=${moment(
                repeatEndDate_temp
              ).format('YYYYMMDD')}`
            );
          } else {
            if (repeatOccurrence_temp === '1') {
              setRepeatOptionDropDown(`Once`);
              setRecurrenceRule(`RRULE:FREQ=DAILY;COUNT=1`);
            } else {
              setRepeatOptionDropDown(
                `Every ${repeatInputValue_temp} days, ${repeatOccurrence_temp} times`
              );
              setRecurrenceRule(
                `RRULE:FREQ=DAILY;INTERVAL=${repeatInputValue_temp};COUNT=${repeatOccurrence_temp}`
              );
            }
          }
        }
      }

      // If repeatDropDown_temp is WEEK
      else if (repeatDropDown_temp === 'WEEK') {
        let selectedDays = [];
        for (let [key, value] of Object.entries(byDay_temp)) {
          value !== '' && selectedDays.push(value);
        }
        let selectedDaysRecurrence = [];
        for (let [key, value] of Object.entries(byDay_temp)) {
          value !== '' &&
            selectedDaysRecurrence.push(value.substring(0, 2).toUpperCase());
        }
        console.log(selectedDays, 'selectedDays week');
        if (repeatInputValue_temp === '1') {
          if (repeatRadio_temp === 'Never') {
            if (selectedDays.length === 7) {
              setRepeatOptionDropDown('Weekly on all days');
              setRecurrenceRule('RRULE:FREQ=WEEKLY;INTERVAL=1');
            } else {
              setRepeatOptionDropDown(`Weekly on ${selectedDays.join(', ')}`);
              setRecurrenceRule(
                `RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=${selectedDaysRecurrence.join(
                  ','
                )}`
              );
            }
          } else if (repeatRadio_temp === 'On') {
            if (selectedDays.length === 7) {
              setRepeatOptionDropDown(
                `Weekly on all days, until ${moment(repeatEndDate_temp).format(
                  'LL'
                )}`
              );
              setRecurrenceRule(
                `RRULE:FREQ=WEEKLY;INTERVAL=1;UNTIL=${moment(
                  repeatEndDate_temp
                ).format('YYYYMMDD')}`
              );
            } else {
              setRepeatOptionDropDown(
                `Weekly on ${selectedDays.join(', ')}, until ${moment(
                  repeatEndDate_temp
                ).format('LL')}`
              );
              setRecurrenceRule(
                `RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=${selectedDaysRecurrence.join(
                  ','
                )};UNTIL=${moment(repeatEndDate_temp).format('YYYYMMDD')}`
              );
            }
          } else {
            if (repeatOccurrence_temp === '1') {
              setRepeatOptionDropDown(`Once`);
              setRecurrenceRule(`RRULE:FREQ=WEEKLY;INTERVAL=1;COUNT=1`);
            } else {
              if (selectedDays.length === 7) {
                setRepeatOptionDropDown(
                  `Weekly on all days, , ${repeatOccurrence_temp} times`
                );
                setRecurrenceRule(
                  `RRULE:FREQ=WEEKLY;INTERVAL=1;COUNT=${repeatOccurrence_temp}`
                );
              } else {
                setRepeatOptionDropDown(
                  `Weekly on ${selectedDays.join(
                    ', '
                  )}, ${repeatOccurrence_temp} times`
                );
                setRecurrenceRule(
                  `RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=${selectedDaysRecurrence.join(
                    ','
                  )};COUNT=${repeatOccurrence_temp}`
                );
              }
            }
          }
        } else {
          if (repeatRadio_temp === 'Never') {
            if (selectedDays.length === 7) {
              setRepeatOptionDropDown(
                `Every ${repeatInputValue_temp} weeks on all days`
              );
              setRecurrenceRule(
                `RRULE:FREQ=WEEKLY;INTERVAL=${repeatInputValue_temp}`
              );
            } else {
              setRepeatOptionDropDown(
                `Every ${repeatInputValue_temp} weeks on ${selectedDays.join(
                  ', '
                )}`
              );
              setRecurrenceRule(
                `RRULE:FREQ=WEEKLY;INTERVAL=${repeatInputValue_temp};BYDAY=${selectedDaysRecurrence.join(
                  ','
                )};`
              );
            }
          } else if (repeatRadio_temp === 'On') {
            if (selectedDays.length === 7) {
              setRepeatOptionDropDown(
                `Every ${repeatInputValue_temp} weeks on all days, until ${moment(
                  repeatEndDate_temp
                ).format('LL')}`
              );
              setRecurrenceRule(
                `RRULE:FREQ=WEEKLY;INTERVAL=${repeatInputValue_temp};UNTIL=${moment(
                  repeatEndDate_temp
                ).format('YYYYMMDD')}`
              );
            } else {
              setRepeatOptionDropDown(
                `Every ${repeatInputValue_temp} weeks on ${selectedDays.join(
                  ', '
                )}, until ${moment(repeatEndDate_temp).format('LL')}`
              );
              setRecurrenceRule(
                `RRULE:FREQ=WEEKLY;INTERVAL=${repeatInputValue_temp};BYDAY=${selectedDaysRecurrence.join(
                  ','
                )};UNTIL=${moment(repeatEndDate_temp).format('YYYYMMDD')}`
              );
            }
          } else {
            if (repeatOccurrence_temp === '1') {
              setRepeatOptionDropDown('Once');
              setRecurrenceRule(
                `RRULE:FREQ=WEEKLY;INTERVAL=${repeatInputValue_temp};COUNT=1`
              );
            } else {
              if (selectedDays.length === 7) {
                setRepeatOptionDropDown(
                  `Every ${repeatInputValue_temp} weeks on all days, ${repeatOccurrence_temp} times`
                );
                setRecurrenceRule(
                  `RRULE:FREQ=WEEKLY;INTERVAL=${repeatInputValue_temp};COUNT=${repeatOccurrence_temp}`
                );
              } else {
                setRepeatOptionDropDown(
                  `Every ${repeatInputValue_temp} weeks on ${selectedDays.join(
                    ', '
                  )}, ${repeatOccurrence_temp} times`
                );
                setRecurrenceRule(
                  `RRULE:FREQ=WEEKLY;INTERVAL=${repeatInputValue_temp};BYDAY=${selectedDaysRecurrence.join(
                    ','
                  )};COUNT=${repeatOccurrence_temp}`
                );
              }
            }
          }
        }
      }

      // If repeatDropDown_temp is MONTH
      else if (repeatDropDown_temp === 'Month') {
        if (repeatInputValue_temp === '1') {
          if (repeatRadio_temp === 'Never') {
            setRepeatOptionDropDown('Monthly');
          } else if (repeatRadio_temp === 'On') {
            setRepeatOptionDropDown(
              `Monthly, until ${moment(repeatEndDate_temp).format('LL')}`
            );
          } else {
            if (repeatOccurrence_temp === '1') {
              setRepeatOptionDropDown(`Once`);
            } else {
              setRepeatOptionDropDown(
                `Monthly, ${repeatOccurrence_temp} times`
              );
            }
          }
        } else {
          if (repeatRadio_temp === 'Never') {
            setRepeatOptionDropDown(`Every ${repeatInputValue_temp} months`);
          } else if (repeatRadio_temp === 'On') {
            setRepeatOptionDropDown(
              `Every ${repeatInputValue_temp} months, until ${moment(
                repeatEndDate_temp
              ).format('LL')}`
            );
          } else {
            if (repeatOccurrence_temp === '1') {
              setRepeatOptionDropDown(`Once`);
            } else {
              setRepeatOptionDropDown(
                `Every ${repeatInputValue_temp} months, ${repeatOccurrence_temp} times`
              );
            }
          }
        }
      }

      // If repeatDropDown_temp is YEAR
      else if (repeatDropDown_temp === 'Year') {
        if (repeatInputValue_temp === '1') {
          if (repeatRadio_temp === 'Never') {
            setRepeatOptionDropDown('Annually');
          } else if (repeatRadio_temp === 'On') {
            setRepeatOptionDropDown(
              `Annually, until ${moment(repeatEndDate_temp).format('LL')}`
            );
          } else {
            if (repeatOccurrence_temp === '1') {
              setRepeatOptionDropDown(`Once`);
            } else {
              setRepeatOptionDropDown(
                `Annually, ${repeatOccurrence_temp} times`
              );
            }
          }
        } else {
          if (repeatRadio_temp === 'Never') {
            setRepeatOptionDropDown(`Every ${repeatInputValue_temp} years`);
          } else if (repeatRadio_temp === 'On') {
            setRepeatOptionDropDown(
              `Every ${repeatInputValue_temp} years, until ${moment(
                repeatEndDate_temp
              ).format('LL')}`
            );
          } else {
            if (repeatOccurrence_temp === '1') {
              setRepeatOptionDropDown(`Once`);
            } else {
              setRepeatOptionDropDown(
                `Every ${repeatInputValue_temp} years, ${repeatOccurrence_temp} times`
              );
            }
          }
        }
      }
      console.log(showRepeatModal);
    };

    const repeatModal = () => {

      const week_days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];

      // Custom styles
      const modalStyle = {
        position: 'absolute',
        zIndex: '5',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, 0%)',
        width: '400px',
        color: '#67ABFC',
      };

      const inputStyle = {
        padding: '8px 5px 8px 15px',
        marginLeft: '8px',
        background: '#F8F9FA',
        border: 'none',
        width: '70px',
        borderRadius: '4px',
        marginRight: '8px',
        color: '#67ABFC',
      };

      const selectStyle = {
        display: 'inline-block',
        color: '#67ABFC',
      };

      const weekStyle = {
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        marginTop: '10px',
        color: '#67ABFC',
      };
      const dotSelected = {
        backgroundColor: '#67ABFC',
        color: '#ffffff',
      };

      // const radioInputStyle = { display: "flex", alignItems: "center" };

      // onClick event handler for the circles
      const selectedDot = (e, index) => {
        let curClass = e.target.classList;
        if (curClass.contains('selected')) {
          curClass.remove('selected');
          const newByDay = { ...byDay_temp, [index]: '' };
          setByDay_temp(newByDay);
        } else {
          curClass.add('selected');
          const newByDay = {
            ...byDay_temp,
            [index]: week_days[index],
          };
          setByDay_temp(newByDay);
        }
      };

      let selectedDays = [];
      for (let [key, value] of Object.entries(byDay_temp)) {
        if (value !== '') selectedDays.push(key);
      }
      // If selected repeat every week, the following shows.
      const weekSelected = (
        <>
          Repeat On
          <div style={weekStyle}>
            {week_days.map((day, i) => {
              if (selectedDays.includes(i.toString())) {
                return (
                  <span
                    key={i}
                    className="dot selected"
                    style={{
                      cursor: 'pointer',
                      padding: '1rem',
                      backgroundColor: '#67ABFC',
                      color: '#ffffff',
                    }}
                    onClick={(e) => selectedDot(e, i)}
                  >
                    {day.charAt(0)}
                  </span>
                );
              } else {
                return (
                  <span
                    key={i}
                    className="dot"
                    style={{
                      cursor: 'pointer',
                      padding: '1rem',
                      backgroundColor: '#ffffff',
                      color: '#67ABFC',
                    }}
                    onClick={(e) => selectedDot(e, i)}
                  >
                    {day.charAt(0)}
                  </span>
                );
              }
            })}
          </div>
        </>
      );

      // If selected repeat every month, the following shows.
      // const monthSelected = (
      //   <DropdownButton
      //     title={repeatMonthlyDropDown}
      //     variant="light"
      //     style={{ marginTop: "20px" }}
      //   >
      //     <Dropdown.Item
      //       eventKey="Monthly on day 13"
      //       onSelect={eventKey => this.handleRepeatMonthlyDropDown(eventKey)}
      //     >
      //       Monthly on day 13
      //     </Dropdown.Item>
      //     <Dropdown.Item
      //       eventKey="Monthly on the second Friday"
      //       onSelect={eventKey => this.handleRepeatMonthlyDropDown(eventKey)}
      //     >
      //       Monthly on the second Friday
      //     </Dropdown.Item>
      //   </DropdownButton>
      // );

      return (
        <Modal.Dialog style={modalStyle}>
          <Modal.Header closeButton onHide={closeRepeatModal}>
            <Modal.Title>
              <h5 className="normalfancytext">Repeating Options</h5>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Group
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: '5px',
                  color: '#67ABFC',
                }}
              >
                Repeat every
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={repeatInputValue_temp}
                  style={inputStyle}
                  onChange={(e) => handleRepeatInputValue(e.target.value)}
                />
                <DropdownButton
                  title={repeatDropDown_temp}
                  style={selectStyle}
                  variant="light"
                >
                  <Dropdown.Item
                    eventKey="Day"
                    style={{ color: '#67ABFC' }}
                    onSelect={(eventKey) => handleRepeatDropDown(eventKey)}
                  >
                    day
                  </Dropdown.Item>
                  <Dropdown.Item
                    eventKey="WEEK"
                    style={{ color: '#67ABFC' }}
                    onSelect={(eventKey) =>
                      handleRepeatDropDown(eventKey, week_days)
                    }
                  >
                    week
                  </Dropdown.Item>
                  <Dropdown.Item
                    eventKey="MONTH"
                    style={{ color: '#67ABFC' }}
                    onSelect={(eventKey) => handleRepeatDropDown(eventKey)}
                  >
                    month
                  </Dropdown.Item>
                  <Dropdown.Item
                    eventKey="YEAR"
                    style={{ color: '#67ABFC' }}
                    onSelect={(eventKey) => handleRepeatDropDown(eventKey)}
                  >
                    year
                  </Dropdown.Item>
                </DropdownButton>
              </Form.Group>
              <Form.Group style={{ marginLeft: '5px' }}>
                {repeatDropDown_temp === 'WEEK' && weekSelected}
              </Form.Group>
              {/* {repeatDropDown === "MONTH" && monthSelected} */}
              <Form.Group
                style={{
                  height: '140px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  marginTop: '20px',
                  marginLeft: '5px',
                }}
                className="repeat-form"
                onChange={(e) => {
                  if (e.target.type === 'radio') {
                    setRepeatRadio_temp(e.target.value);
                  }
                }}
              >
                Ends
                <Form.Check type="radio">
                  <Form.Check.Label style={{ marginLeft: '5px' }}>
                    <Form.Check.Input
                      type="radio"
                      value="Never"
                      name="radios"
                      defaultChecked={repeatRadio_temp === 'Never' && true}
                    />
                    Never
                  </Form.Check.Label>
                </Form.Check>
                <Form.Check type="radio">
                  <Form.Check.Label style={{ marginLeft: '5px' }}>
                    <Form.Check.Input
                      type="radio"
                      name="radios"
                      value="On"
                      style={{ marginTop: '10px' }}
                      defaultChecked={repeatRadio_temp === 'On' && true}
                    />
                    Until
                    <DatePicker
                      className="date-picker-btn btn btn-light"
                      selected={repeatEndDate_temp}
                      onChange={(date) => handleRepeatEndDate(date)}
                    ></DatePicker>
                  </Form.Check.Label>
                </Form.Check>
                <Form.Check type="radio">
                  <Form.Check.Label style={{ marginLeft: '5px' }}>
                    <Form.Check.Input
                      type="radio"
                      name="radios"
                      value="After"
                      style={{ marginTop: '12px' }}
                      defaultChecked={repeatRadio_temp === 'After' && true}
                    />
                    After
                    <span style={{ marginLeft: '60px' }}>
                      <input
                        type="number"
                        min="1"
                        max="10000"
                        value={repeatOccurrence_temp}
                        onChange={(e) => handleRepeatOccurrence(e.target.value)}
                        style={inputStyle}
                        className="input-exception"
                      />
                      occurrence(s)
                    </span>
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
                    onClick={closeRepeatModal}
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
                    onClick={saveRepeatChanges}
                  >
                    Save changes
                  </button>
                </Col>
              </Row>
            </Container>
          </Modal.Footer>
        </Modal.Dialog>
      );
    };
    const editRecurringModal = () => {
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
        <Modal.Dialog style={modalStyle}>
          <Modal.Header closeButton onHide={closeEditRecurringModal}>
            <Modal.Title>
              <h5 className="normalfancytext">Edit Recurring Event</h5>
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
                    setEditRecurringOption(e.target.value);
                    // props.setStateValue({
                    //   editRecurringOption: e.target.value,
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
                        editRecurringOption === 'This event' && true
                      }
                    />
                    This event
                    {console.log(editRecurringOption)}
                  </Form.Check.Label>
                </Form.Check>
                <Form.Check type="radio">
                  <Form.Check.Label style={{ marginLeft: '5px' }}>
                    <Form.Check.Input
                      type="radio"
                      value="This and following events"
                      name="radios"
                      defaultChecked={
                        editRecurringOption === 'This and following events' &&
                        true
                      }
                    />
                    This and following events
                    {console.log(editRecurringOption)}
                  </Form.Check.Label>
                </Form.Check>
                <Form.Check type="radio">
                  <Form.Check.Label style={{ marginLeft: '5px' }}>
                    <Form.Check.Input
                      type="radio"
                      value="All events"
                      name="radios"
                      defaultChecked={
                        editRecurringOption === 'All events' && true
                      }
                    />
                    All events
                    {console.log(editRecurringOption)}
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
                    onClick={closeEditRecurringModal}
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
                      UpdateRecurring(props.event);
                    }}
                  >
                    Save changes
                  </button>
                </Col>
              </Row>
            </Container>
          </Modal.Footer>
        </Modal.Dialog>
      );
    };
    const submit = (e) => {
      e.preventDefault();
      //console.log(repeatOptionDropDown);
      //console.log(recurrenceRule);
    //   editingEventContext.setEditingEvent({
    //     ...editingEventContext.editingEvent,
    //     editing: true,
    //   });
      if (props.event.recurringEventId === undefined) {
        var event = {
          id: props.event.id,
          summary,
          description,
          location,
          creator: {
            email: 'calendar@manifestmy.space',
            self: true,
          },
          organizer: {
            email: 'calendar@manifestmy.space',
            self: true,
          },
          start: {
            dateTime: moment(startTime),
            timeZone: userTime_zone,
          },
          end: {
            dateTime: moment(endTime),
            timeZone: userTime_zone,
          },
          recurrence: repeatOption ? [recurrenceRule] : false,
          attendees: fields,
          reminders: {
            useDefault: false,
            overrides: [{ method: reminderMethod, minutes: reminderMinutes }],
          },
        };
        updateTheCalenderEvent(event);
        props.setStateValue((prevState) => {
          return {
            ...prevState,
            showEditModal: !showEditModal,
          };
        });
      } else {
        var event = {
          id: props.event.id,
          summary,
          description,
          location,
          creator: {
            email: 'calendar@manifestmy.space',
            self: true,
          },
          organizer: {
            email: 'calendar@manifestmy.space',
            self: true,
          },
          start: {
            dateTime: moment(startTime),
            timeZone: userTime_zone,
          },
          end: {
            dateTime: moment(endTime),
            timeZone: userTime_zone,
          },
          recurrence: repeatOption ? [recurrenceRule] : false,
          attendees: fields,
          reminders: {
            useDefault: false,
            overrides: [{ method: reminderMethod, minutes: reminderMinutes }],
          },
        };
        openEditRecurringModal(event);
        // props.setStateValue((prevState) => {
        //   return {
        //     ...prevState,
        //     showEditRecurringModal: true,
        //   };
        // });
        
      }
    };
   
    function UpdateRecurring(event) {
      //e.preventDefault();
      //console.log('editrecuuring', event);
      if (editRecurringOption === 'This event') {
        //console.log('edit this event', event);
        //deleteTheCalenderEvent(event.id);
        var event = {
          id: props.event.id,
          summary,
          description,
          location,
          creator: {
            email: 'calendar@manifestmy.space',
            self: true,
          },
          organizer: {
            email: 'calendar@manifestmy.space',
            self: true,
          },
          start: {
            dateTime: moment(startTime),
            timeZone: userTime_zone,
          },
          end: {
            dateTime: moment(endTime),
            timeZone: userTime_zone,
          },
          recurrence: repeatOption ? recurrenceRule : false,
          attendees: fields,
          reminders: {
            useDefault: false,
            overrides: [{ method: reminderMethod, minutes: reminderMinutes }],
          },
        };
        console.log(event)
        updateSubmit(event);
        // updateTheCalenderEvent(event);
        // setShowEditRecurringModal(!showEditRecurringModal);
        // props.setStateValue((prevState) => {
        //   return {
        //     ...prevState,
        //     showEditModal: !showEditModal,
        //   };
        // });
      } else if (editRecurringOption === 'This and following events') {
        
        if (moment(event.start.dateTime) < moment()) {
          console.log('in if')
          let url = BASE_URL + 'googleRecurringInstances/';
          let id = userID;
          let eventId = props.event.recurringEventId;
          //let eventId = '';
          var firstEventCount = -1;
          var secondEventCount = -1;
          var clickedEventIndex = 0;
          var parentEvent = {};
          var isNeverEnds = false;
          console.log(event);
          axios
            .post(url + id.toString() + ',' + eventId.toString())
            .then((res) => {
              console.log('/googleRecurringInstances: ', res.data);
              parentEvent = res.data[0];

              //event.summary = parentEvent.summary;
              //event.id = parentEvent.recurringEventId;
              console.log(parentEvent);
              console.log(parentEvent.start.dateTime, parentEvent.end.dateTime);
              clickedEventIndex = '';
              for (let i = 0; i < res.data.length; i++) {
                if (res.data[i].id === props.event.id) {
                  clickedEventIndex = i;
                  break;
                }
              }
              let newISOStartTime = new Date(
                parentEvent.start.dateTime
              ).toISOString();

              console.log(newISOStartTime);

              let newISOEndTime = new Date(
                parentEvent.end.dateTime
              ).toISOString();
              console.log(newISOEndTime);
              var event = {
                id: eventId,
                summary: parentEvent.summary,
                description,
                location,
                creator: {
                  email: 'calendar@manifestmy.space',
                  self: true,
                },
                organizer: {
                  email: 'calendar@manifestmy.space',
                  self: true,
                },
                start: {
                  dateTime: newISOStartTime,
                  timeZone: userTime_zone,
                },
                end: {
                  dateTime: newISOEndTime,
                  timeZone: userTime_zone,
                },
                recurrence: repeatOption ? recurrenceRule : false,
                attendees: fields,
                reminders: {
                  useDefault: false,
                  overrides: [
                    { method: reminderMethod, minutes: reminderMinutes },
                  ],
                },
              };
              console.log(event, parentEvent);
              let firstEventCount = clickedEventIndex;
              let secondEventCount = res.data.length - clickedEventIndex;
              //the instance clicked on
              console.log('firstEventCount: ', firstEventCount);
              //the total occurences - instance clicked on
              console.log('secondEventCount: ', secondEventCount);

              console.log(event, parentEvent);
              setRecEvent(event);
            });
          console.log(recEvent, event);
          let newEvent = {
            attendees: event.attendees,
            reminders: event.reminders,
            creator: event.creator,
            created: event.created,
            organizer: event.organizer,
            sequence: event.sequence,
            status: event.status,
          };

          //generate new recurrence rule
          let newRecurrenceRule = recurrenceRule;
          console.log('newRecurrenceRule', newRecurrenceRule);

          let currentDateString = `${moment(event.start.dateTime).format(
            'YYYYMMDD'
          )}`;
          console.log('currentDateString', currentDateString);

          //find countSubString if the recurrece rule is COUNT
          let countSubString = '';
          let countIndex = recurrenceRule.indexOf('COUNT');
          console.log('countIndex 1:', countIndex);
          if (countIndex !== -1) {
            countSubString = recurrenceRule.substring(countIndex);
            console.log("countSubString 1:", countSubString);
          }
          if (countSubString.includes(';')) {
            let endCountIndex = countSubString.indexOf(';');
            countSubString = countSubString.substring(6, endCountIndex);
            console.log("countSubString 2:", countSubString);
          } else if (countSubString) {
            countSubString = countSubString.substring(6);
            console.log("countSubString 3", countSubString);
          }

          // //find untilSubString if the recurrece rule is UNTIL
          if (newRecurrenceRule.includes('UNTIL')) {
            let untilSubString = '';
            let untilIndex = newRecurrenceRule.indexOf('UNTIL');
            console.log('untilIndex 3', untilIndex);
            if (untilIndex !== -1) {
              untilSubString = newRecurrenceRule.substring(untilIndex);
              console.log('untilSubString if -1', untilSubString);
            }
            if (untilSubString.includes(';')) {
              let endUntilIndex = untilSubString.indexOf(';');
              console.log('endUntilIndex if;', endUntilIndex);
              untilSubString = untilSubString.substring(6, endUntilIndex);
              console.log('untilSubString if;', untilSubString);
            } else if (untilSubString) {
              untilSubString = untilSubString.substring(6);
              console.log('untilSubString else if', untilSubString);
            }
            console.log(
              'UNTIL, newRecurrenceRule: ',
              newRecurrenceRule,
              untilSubString,
              recEvent.recurrence
            );
            // replace by the new calculated currentDateString
            if(moment(currentDateString) < moment()){
              recEvent.recurrence = newRecurrenceRule.replace(
                untilSubString,
                `${moment().format('YYYYMMDD')}`
              );
            }
            else{recEvent.recurrence = newRecurrenceRule.replace(
              untilSubString,
              currentDateString
            );}
            
            console.log('recEvent.recurrence: ', recEvent.recurrence);
            console.log('currentDateString: ', currentDateString);
            console.log('newRecurrenceRule: ', newRecurrenceRule);
          } else if (newRecurrenceRule.includes('COUNT')) {
            if(moment(startTime) < moment()){
              recEvent.recurrence = newRecurrenceRule.replace(
                `COUNT=${countSubString}`,
                `UNTIL=${moment(startTime).format('YYYYMMDD')}`
              );
            }
            else{
              recEvent.recurrence = newRecurrenceRule.replace(
                `COUNT=${countSubString}`,
                `UNTIL=${moment().format('YYYYMMDD')}`
              );
            }
            
            // newRecurrenceRule = newRecurrenceRule.replace(
            //   `COUNT=${countSubString}`,
            //   `COUNT=${secondEventCount}`
            // );
            console.log(countSubString, firstEventCount);
            console.log('event.recurrence changed', recEvent.recurrence);
            console.log('newRecurrenceRule changed', newRecurrenceRule);
          } else {
            
            newRecurrenceRule = newRecurrenceRule.concat(
              `;UNTIL=${currentDateString}`
            );

            console.log('entered the useless else statement');
            console.log('newRecurrenceRule: ', newRecurrenceRule);
            isNeverEnds = true;
          }

          newEvent.summary = event.summary;
          newEvent.start = {
            dateTime: moment(startTime).format(),
            timeZone: userTime_zone,
          };
          newEvent.end = {
            dateTime: moment(endTime).format(),
            timeZone: userTime_zone,
          };
          console.log(moment(startTime).format('LT'), moment().format('LT'));
          console.log(moment(startTime), moment());
          newEvent.description = event.description;
          console.log('Before isNeverEnds calls: event:  ', recEvent);
          console.log('Before isNeverEnds calls: newEvent:  ', newEvent);
          if (isNeverEnds) {
            console.log('in never ends');
            newEvent.recurrence = recurrence[0];
            recEvent.recurrence = newRecurrenceRule;
            console.log(
              'in never ends',
              newEvent.recurrence,
              recEvent.recurrence
            );
          } else {
            console.log('in never ends else');
            recEvent.recurrence = [recEvent.recurrence];
            // recEvent.recurrence = [
            //   'RRULE:FREQ=DAILY;INTERVAL=1;UNTIL=20211117T065959Z',
            // ];
            newEvent.recurrence = [newRecurrenceRule];
            console.log(
              'in never ends else',
              newEvent.recurrence,
              recEvent.recurrence 
            );
          }
          console.log('Before axios calls: event:  ', recEvent);
          console.log('Before axios calls: newEvent:  ', newEvent);

          if (secondEventCount !== 0) {
            console.log('Before createEvent/newEvent: ', newEvent);
            //insert
            publishTheCalenderEvent(newEvent)
          }

          if (firstEventCount === 0) {
            console.log('Before deleteEvent/eventId: ', eventId);
            //delete
            //deleteTheCalenderEvent(eventId)
          } else {
            console.log('Before updateEvent: ');
            console.log('event: ', recEvent);
            console.log('eventId: ', eventId);
            //update
            updateTheCalenderEvent(recEvent);
          }
          setShowEditRecurringModal(!showEditRecurringModal);
          props.setStateValue((prevState) => {
            return {
              ...prevState,
              showEditModal: !showEditModal,
            };
          });
        } else {
          console.log('In else')
          let url = BASE_URL + 'googleRecurringInstances/';
          let id = userID;
          let eventId = props.event.recurringEventId;
          //let eventId = '';
          var firstEventCount = -1;
          var secondEventCount = -1;
          var clickedEventIndex = 0;
          var parentEvent = {};
          var isNeverEnds = false;
          console.log(event);
          axios
            .post(url + id.toString() + ',' + eventId.toString())
            .then((res) => {
              console.log('/googleRecurringInstances: ', res.data);
              parentEvent = res.data[0];

              
              console.log(parentEvent);
              console.log(parentEvent.start.dateTime, parentEvent.end.dateTime);
              clickedEventIndex = '';
              for (let i = 0; i < res.data.length; i++) {
                if (res.data[i].id === props.event.id) {
                  clickedEventIndex = i;
                  break;
                }
              }
              let newISOStartTime = new Date(
                parentEvent.start.dateTime
              ).toISOString();

              console.log(newISOStartTime);

              let newISOEndTime = new Date(
                parentEvent.end.dateTime
              ).toISOString();
              console.log(newISOEndTime);
              var event = {
                id: eventId,
                summary: parentEvent.summary,
                description,
                location,
                creator: {
                  email: 'calendar@manifestmy.space',
                  self: true,
                },
                organizer: {
                  email: 'calendar@manifestmy.space',
                  self: true,
                },
                start: {
                  dateTime: newISOStartTime,
                  timeZone: userTime_zone,
                },
                end: {
                  dateTime: newISOEndTime,
                  timeZone: userTime_zone,
                },
                recurrence: repeatOption ? recurrenceRule : false,
                attendees: fields,
                reminders: {
                  useDefault: false,
                  overrides: [
                    { method: reminderMethod, minutes: reminderMinutes },
                  ],
                },
              };
              console.log(event, parentEvent);
              let firstEventCount = clickedEventIndex;
              let secondEventCount = res.data.length - clickedEventIndex;
              console.log('firstEventCount: ', firstEventCount);
              console.log('secondEventCount: ', secondEventCount);

              console.log(event, parentEvent);
              setRecEvent(event);
            });
          console.log(recEvent, event);
          let newEvent = {
            attendees: event.attendees,
            reminders: event.reminders,
            creator: event.creator,
            created: event.created,
            organizer: event.organizer,
            sequence: event.sequence,
            status: event.status,
          };

          //generate new recurrence rule
          let newRecurrenceRule = recurrenceRule;
          console.log('newRecurrenceRule', newRecurrenceRule);

          let currentDateString = `${moment(event.start.dateTime).format(
            'YYYYMMDD'
          )}`;
          console.log('currentDateString', currentDateString);

          //find countSubString if the recurrece rule is COUNT
          let countSubString = '';
          let countIndex = recurrenceRule.indexOf('COUNT');
          console.log('countIndex 1:', countIndex);
          if (countIndex !== -1) {
            countSubString = recurrenceRule.substring(countIndex);
            console.log("countSubString 1:", countSubString);
          }
          if (countSubString.includes(';')) {
            let endCountIndex = countSubString.indexOf(';');
            countSubString = countSubString.substring(6, endCountIndex);
            console.log("countSubString 2:", countSubString);
          } else if (countSubString) {
            countSubString = countSubString.substring(6);
            console.log("countSubString 3", countSubString);
          }

          // //find untilSubString if the recurrece rule is UNTIL
          if (newRecurrenceRule.includes('UNTIL')) {
            let untilSubString = '';
            let untilIndex = newRecurrenceRule.indexOf('UNTIL');
            console.log('untilIndex 3', untilIndex);
            if (untilIndex !== -1) {
              untilSubString = newRecurrenceRule.substring(untilIndex);
              console.log('untilSubString if -1', untilSubString);
            }
            if (untilSubString.includes(';')) {
              let endUntilIndex = untilSubString.indexOf(';');
              console.log('endUntilIndex if;', endUntilIndex);
              untilSubString = untilSubString.substring(6, endUntilIndex);
              console.log('untilSubString if;', untilSubString);
            } else if (untilSubString) {
              untilSubString = untilSubString.substring(6);
              console.log('untilSubString else if', untilSubString);
            }
            console.log(
              'UNTIL, newRecurrenceRule: ',
              newRecurrenceRule,
              untilSubString,
              recEvent.recurrence
            );
            // replace by the new calculated currentDateString
            if (moment(currentDateString) < moment()) {
              recEvent.recurrence = newRecurrenceRule.replace(
                untilSubString,
                `${moment().format('YYYYMMDD')}`
              );
            } else {
              recEvent.recurrence = newRecurrenceRule.replace(
                untilSubString,
                currentDateString
              );
            }
            // recEvent.recurrence = newRecurrenceRule.replace(
            //   untilSubString,
            //   currentDateString
            // );
            console.log('recEvent.recurrence: ', recEvent.recurrence);
            console.log('currentDateString: ', currentDateString);
            console.log('newRecurrenceRule: ', newRecurrenceRule);
          } else if (newRecurrenceRule.includes('COUNT')) {
            // recEvent.recurrence = newRecurrenceRule.replace(
            //   `COUNT=${countSubString}`,
            //   `COUNT=${firstEventCount}`
            // );
            if (moment(startTime) < moment()) {
              recEvent.recurrence = newRecurrenceRule.replace(
                `COUNT=${countSubString}`,
                `UNTIL=${moment().format('YYYYMMDD')}`
              );
            } else {
              recEvent.recurrence = newRecurrenceRule.replace(
                `COUNT=${countSubString}`,
                `UNTIL=${moment(startTime).format('YYYYMMDD')}`
              );
            }
            
            // newRecurrenceRule = newRecurrenceRule.replace(
            //   `COUNT=${countSubString}`,
            //   `COUNT=${secondEventCount}`
            // );
           console.log(countSubString, firstEventCount);
           console.log('event.recurrence changed', recEvent.recurrence);
           console.log('newRecurrenceRule changed', newRecurrenceRule);
          } else {
            
            newRecurrenceRule = newRecurrenceRule.concat(
              `;UNTIL=${currentDateString}`
            );

            console.log('entered the useless else statement');
            console.log('newRecurrenceRule: ', newRecurrenceRule);
            isNeverEnds = true;
          }

          newEvent.summary = event.summary;
          newEvent.start = {
            dateTime: moment(startTime).add(1, 'days').format(),
            timeZone: userTime_zone,
          };
          newEvent.end = {
            dateTime: moment(endTime).add(1, 'days').format(),
            timeZone: userTime_zone,
          };
          console.log(moment(startTime).format('LT'), moment().format('LT'));
          console.log(moment(startTime), moment());
          newEvent.description = event.description;
          console.log('Before isNeverEnds calls: event:  ', recEvent);
          console.log('Before isNeverEnds calls: newEvent:  ', newEvent);
          if (isNeverEnds) {
            console.log('in never ends');
            newEvent.recurrence = recurrence[0];
            recEvent.recurrence = newRecurrenceRule;
            console.log(
              'in never ends',
              newEvent.recurrence,
              recEvent.recurrence
            );
          } else {
            console.log('in never ends else');
            //recEvent.recurrence = event.recurrence;
            recEvent.recurrence = [recEvent.recurrence];
            newEvent.recurrence = [newRecurrenceRule];
            //newEvent.recurrence = ["RRULE:FREQ=DAILY;COUNT=4;INTERVAL=1"]
            console.log(
              'in never ends else',
              newEvent.recurrence,
              recEvent.recurrence
            );
          }
          console.log('Before axios calls: event:  ', recEvent);
          console.log('Before axios calls: newEvent:  ', newEvent);

          if (secondEventCount !== 0) {
            console.log('Before createEvent/newEvent: ', newEvent);
            publishTheCalenderEvent(newEvent)
          }

          if (firstEventCount === 0) {
            console.log('Before deleteEvent/eventId: ', eventId);
            deleteTheCalenderEvent(eventId)
          } else {
            console.log('Before updateEvent: ');
            console.log('event: ', recEvent);
            console.log('eventId: ', eventId);
            updateTheCalenderEvent(recEvent);
          }
          
          setShowEditRecurringModal(!showEditRecurringModal);
          props.setStateValue((prevState) => {
            return {
              ...prevState,
              showEditModal: !showEditModal,
            };
          });
        }
        
        
      } else if (editRecurringOption === 'All events') {

        let eventId= event.recurringEventId
        let url = BASE_URL + 'googleRecurringInstances/';
        let id = userID;
        //let eventId = '';
        var firstEventCount = -1;
        var secondEventCount = -1;
        var clickedEventIndex = 0;
        var parentEvent = {};
        var isNeverEnds = false;
         axios
            .post(url + id.toString() + ',' + eventId.toString())
            .then((res) => {
              console.log("/getRecurringEventInstances: ", res.data);
              parentEvent = res.data[0];
              console.log(parentEvent, event)
              // setting new start & end time in ISO time String
              let startHour = new Date(event.start['dateTime']).getHours();
              let startMin = new Date(event.start['dateTime']).getMinutes();
              let endHour = new Date(event.end["dateTime"]).getHours();
              let endMin = new Date(event.end["dateTime"]).getMinutes();
              let newStartTime = new Date(parentEvent.start["dateTime"]).setHours(
                startHour
              );
              newStartTime = new Date(newStartTime).setMinutes(startMin);
              let newEndTime = new Date(parentEvent.end["dateTime"]).setHours(
                endHour
              );
              newEndTime = new Date(newEndTime).setMinutes(endMin);
              const newISOStartTime = new Date(newStartTime).toISOString();
              const newISOEndTime = new Date(newEndTime).toISOString();
              // assign new start and end time to event
              event.start = {
                dateTime: newISOStartTime,
                timeZone: parentEvent.start["timeZone"],
              };
              event.end = {
                dateTime: newISOEndTime,
                timeZone: parentEvent.end["timeZone"],
              };
              event.recurrence = recurrenceRule
              console.log(event);
              });
              

              //  var event = {
              //    id: eventId,
              //    summary,
              //    description,
              //    location,
              //    creator: {
              //      email: 'calendar@manifestmy.space',
              //      self: true,
              //    },
              //    organizer: {
              //      email: 'calendar@manifestmy.space',
              //      self: true,
              //    },
              //    start: {
              //      dateTime: moment(startTime),
              //      timeZone: userTime_zone,
              //    },
              //    end: {
              //      dateTime: moment(endTime),
              //      timeZone: userTime_zone,
              //    },
              //    recurrence: repeatOption ? recurrenceRule : false,
              //    attendees: fields,
              //    reminders: {
              //      useDefault: false,
              //      overrides: [{ method: reminderMethod, minutes: reminderMinutes }],
              //    },
              //  };
              
              updateSubmit(event)
              //  updateTheCalenderEvent(event);
              //  setShowEditRecurringModal(!showEditRecurringModal);
              //  props.setStateValue((prevState) => {
              //    return {
              //      ...prevState,
              //      showEditModal: !showEditModal,
              //    };
              //  });
              
            }
    }
     const updateSubmit = (event) => {
       updateTheCalenderEvent(event);
       setShowEditRecurringModal(!showEditRecurringModal);
       props.setStateValue((prevState) => {
         return {
           ...prevState,
           showEditModal: !showEditModal,
         };
       });
     };
  return (
    <div>
      {!props.signedin ? (
        <div className="google-login"></div>
      ) : (
        <div
          style={{
            marginTop: '1rem',
            marginLeft: '2rem',
            //marginRight: '3rem',
            width: '90%',
            backgroundColor: '#67ABFC',
            color: '#ffffff',
          }}
        >
          <Container
            style={{
              paddingLeft: '1rem',
              paddingTop: '1rem',

              width: '100%',
            }}
          >
            <Col style={{ float: 'left', width: '30%' }}>
              <div style={{ fontWeight: 'bold', fontSize: '20px' }}>
                Event Name
              </div>
              <input
                style={{
                  borderRadius: '10px',
                  border: 'none',
                  width: '80%',
                  height: '2rem',
                  marginTop: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />

              <div style={{ marginTop: '40px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '20px' }}>
                  Description
                </div>
                <input
                  style={{
                    margin: '5px 0',
                    borderRadius: '10px',
                    border: 'none',
                    width: '80%',
                    height: '4rem',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={{ fontWeight: 'bold', fontSize: '20px' }}>
                Start Time
              </div>
              <Container>
                <Row>
                  <Col
                    //sm={6}
                    style={{
                      margin: '0',
                      padding: '0',
                      // width: '30%',
                    }}
                  >
                    {startTimePicker()}
                  </Col>
                </Row>
              </Container>

              <div
                style={{
                  fontWeight: 'bold',
                  fontSize: '20px',
                  marginTop: '10px',
                }}
              >
                End Time
              </div>
              <Container>
                <Row>
                  <Col
                    //sm={7}
                    style={{
                      margin: '0',
                      padding: '0',
                      // width: '30%',
                    }}
                  >
                    {endTimePicker()}
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
                marginLeft: '1%',
                marginRight: '1%',
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
                  <Row
                    style={{ marginBottom: '20px', verticalAlign: 'middle' }}
                  >
                    <DropdownButton
                      className="repeatOptionDropDown"
                      //onClick={this.openRepeatModal}
                      title={
                        repeatOptionDropDown === 'Does not repeat'
                          ? 'Does not repeat'
                          : 'Custom...'
                      }
                      variant="light"
                    >
                      <Dropdown.Item
                        eventKey="Does not repeat"
                        onSelect={(eventKey) =>
                          // this.setState({
                          //   repeatOptionDropDown: eventKey,
                          //   repeatOption: false,
                          // })
                          {
                            setRepeatOptionDropDown(eventKey);
                            setRecurrenceRule();
                            setRepeatOption(false);
                          }
                        }
                      >
                        Does not repeat
                      </Dropdown.Item>
                      <Dropdown.Item
                        eventKey="Custom..."
                        onSelect={(eventKey) => {
                          openRepeatModal();
                          // this.setState({ repeatOptionDropDown: eventKey });
                        }}
                      >
                        Custom...
                      </Dropdown.Item>
                    </DropdownButton>
                    <div>{showRepeatModal && repeatModal()}</div>
                  </Row>
                  <Row>{repeatOptionDropDown}</Row>
                  <Row>{recurrenceRule}</Row>
                </Col>
              </Row>
              <Row style={{ fontWeight: 'bold', fontSize: '20px' }}>
                Notifications
              </Row>
              <Row>
                <Col>
                  <Form.Group
                    style={{
                      height: '140px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      marginTop: '20px',
                      marginLeft: '5px',
                    }}
                    className="repeat-form"
                    onChange={(e) => {
                      if (e.target.type === 'radio') {
                        setReminderMethod(e.target.value);
                      }
                    }}
                  >
                    Ends
                    <Form.Check type="radio">
                      <Form.Check.Label style={{ marginLeft: '5px' }}>
                        <Form.Check.Input
                          type="radio"
                          name="radios"
                          value="email"
                          style={{ marginTop: '10px' }}
                          defaultChecked={reminderMethod === 'email' && true}
                        />
                        Email
                        <span style={{ marginLeft: '60px' }}>
                          <input
                            type="number"
                            min="1"
                            max="10000"
                            value={reminderMinutes}
                            onChange={(e) =>
                              handleReminderMinutes(e.target.value)
                            }
                            className="input-exception"
                          />
                        </span>
                      </Form.Check.Label>
                    </Form.Check>
                    <Form.Check type="radio">
                      <Form.Check.Label style={{ marginLeft: '5px' }}>
                        <Form.Check.Input
                          type="radio"
                          name="radios"
                          value="popup"
                          style={{ marginTop: '12px' }}
                          defaultChecked={reminderMethod === 'popup' && true}
                        />
                        PopUp
                        <span style={{ marginLeft: '50px' }}>
                          <input
                            type="number"
                            min="1"
                            max="10000"
                            value={reminderMinutes}
                            onChange={(e) =>
                              handleReminderMinutes(e.target.value)
                            }
                            className="input-exception"
                          />
                        </span>
                      </Form.Check.Label>
                    </Form.Check>
                  </Form.Group>
                </Col>
              </Row>
            </Col>
            <div
              style={{
                float: 'left',
                backgroundColor: 'white',
                width: '2px',
                height: '500px',
                marginLeft: '1%',
                marginRight: '1%',
              }}
            />

            <Col style={{ float: 'left', width: '30%' }}>
              <Row style={{ fontWeight: 'bold', fontSize: '20px' }}>
                Location
              </Row>

              <Row
                style={{
                  padding: '10px 0 0 0',
                }}
              >
                <Col style={{ margin: '10px 0' }}>
                  <Row
                    style={{ marginBottom: '20px', verticalAlign: 'middle' }}
                  >
                    <input
                      style={{
                        margin: '5px 0',
                        borderRadius: '10px',
                        border: 'none',
                        width: '100%',
                        height: '2rem',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </Row>
                </Col>
              </Row>
              <Row style={{ fontWeight: 'bold', fontSize: '20px' }}>
                Attendees
              </Row>
              <Row
                style={{
                  padding: '10px 0 0 0',
                }}
              >
                <Col style={{ margin: '10px 0' }}>
                  <Row
                    style={{ marginBottom: '20px', verticalAlign: 'middle' }}
                  >
                    {fields.map((field, idx) => {
                      return (
                        <Row>
                          <Col>
                            <input
                              style={{
                                margin: '5px 0',
                                borderRadius: '10px',
                                border: 'none',
                                width: '100%',
                                height: '2rem',
                                fontSize: '12px',
                                fontWeight: 'bold',
                              }}
                              type="text"
                              placeholder={userEmail}
                              onChange={(e) => handleChange(idx, e)}
                            />
                          </Col>
                          <Col xs={1}>
                            <div
                              style={{
                                width: '21px',
                                height: '21px',
                                margin: '5px 0',
                                backgroundImage: `url(${trash})`,
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                cursor: 'pointer',
                              }}
                              onClick={() => handleRemove(idx)}
                            ></div>
                          </Col>
                        </Row>
                      );
                    })}
                    <div className="eventItem">
                      <div
                        style={{
                          width: '100%',
                          padding: '0',
                          margin: '20px 40px',
                          backgroundColor: 'inherit',
                          border: '2px white solid',
                          borderRadius: '30px',
                          color: '#ffffff',
                          textAlign: 'center',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleAdd()}
                      >
                        + Add Person
                      </div>
                    </div>
                  </Row>
                </Col>
              </Row>
            </Col>
            {showEditRecurringModal && editRecurringModal(recEvent)}
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
                closeEditModal();
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
              onClick={(e) => submit(e)}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
