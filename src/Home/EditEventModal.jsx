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

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.css';
import {updateTheCalenderEvent} from './GoogleApiService';
import LoginContext from '../LoginContext';
import EditEventContext from './EditEventContext';
import moment from 'moment';

export default function EditEventModal(props) {
    const loginContext = useContext(LoginContext);
    const editingEventContext = useContext(EditEventContext);
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
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const [location, setLocation] = useState(
      props.event.location === undefined ? '' : props.event.location
    );
    const [description, setDescription] = useState(props.event.description === undefined ? '' : props.event.description);
    const [repeatOptionDropDown, setRepeatOptionDropDown] = useState(
      props.event.RRULE === undefined ? '' : props.event.RRULE
    );
    const [repeatOption, setRepeatOption] = useState(false);
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
    const [recurrenceRule, setRecurrenceRule] = useState('');
    const [reminderMethod, setReminderMethod] = useState('');
    const [reminderMinutes, setReminderMinutes] = useState('');
      const openEditRecurringModal = (r) => {
        console.log('openeditmodal called', r);

        console.log('opendeletemodal rec', r, showEditRecurringModal);
        setShowEditRecurringModal(!showEditRecurringModal)
        props.setStateValue((prevState) => {
          return {
            ...prevState,
            originalEvents: r,
          };
        });
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
      props.setStateValue((prevState) => {
        return {
          ...prevState,
          showEditRecurringModal: !showEditRecurringModal,
        };
      });
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
                  }
                }}
              >
                {
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
                    </Form.Check.Label>
                  </Form.Check>
                }
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
                  </Form.Check.Label>
                </Form.Check>
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={closeEditRecurringModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={updateRecurring(props.event)}>
              OK
            </Button>
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
        openEditRecurringModal(props.event);
        // props.setStateValue((prevState) => {
        //   return {
        //     ...prevState,
        //     showEditRecurringModal: true,
        //   };
        // });
        
      }
    };
   
    const updateRecurring =(event) =>{
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
          recurrence: repeatOption ? [recurrenceRule] : false,
          attendees: fields,
          reminders: {
            useDefault: false,
            overrides: [{ method: reminderMethod, minutes: reminderMinutes }],
          },
        };
        //updateSubmit(event);
        updateTheCalenderEvent(event);
        setShowEditRecurringModal(!showEditRecurringModal);
        props.setStateValue((prevState) => {
          return {
            ...prevState,
            showEditRecurringModal: !showEditRecurringModal,
          };
        });
      } else if (editRecurringOption === 'This and following events') {
        
      } else if (editRecurringOption === 'All events') {
        // deleteTheCalenderEvent(event.recurringEventId);
        var event = {
          id: props.event.recurringEventId,
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
        //updateSubmit(event);
        updateTheCalenderEvent(event);
        setShowEditRecurringModal(!showEditRecurringModal);
        props.setStateValue((prevState) => {
          return {
            ...prevState,
            showEditRecurringModal: !showEditRecurringModal,
          };
        });
        
      }
    }
     const updateSubmit = (event) => {
       updateTheCalenderEvent(event);
       setShowEditRecurringModal(!showEditRecurringModal);
       props.setStateValue((prevState) => {
         return {
           ...prevState,
           showEditRecurringModal: !showEditRecurringModal,
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
            {showEditRecurringModal && editRecurringModal()}
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