import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import {
  Grid,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  InputAdornment
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrashAlt, faSave, faPlus } from '@fortawesome/free-solid-svg-icons';

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;

const headers = [
  'Title',
  'Start Date',
  'Start Time',
  'End Date',
  'End Time',
  'Repeat',
  'Repeat Ends',
  'Available to User',
];

const initialRows = [
  {
    routineName: 'Routine 1',
    startDate: '2023-07-03',
    startTime: '10:00',
    endDate: '2023-07-03',
    endTime: '11:00',
    repeat: 'Yes',
    repeatEnds: 'Never',
    availableToUser: 'Yes',
  },
  // Add more initial rows as needed
];

export default function QuickEditModal(props) {
  const [showAddRow, setShowAddRow] = useState(false);
  const [rows, setRows] = useState(getInitialRows());
  var userID;
  var taID;
    if (
      document.cookie
        .split(';')
        .some((item) => item.trim().startsWith('patient_uid='))
    ) {
      console.log('in there');
      userID = document.cookie
        .split('; ')
        .find((row) => row.startsWith('patient_uid='))
        .split('=')[1];
      taID = document.cookie
        .split('; ')
        .find((row) => row.startsWith('ta_uid='))
        .split('=')[1];
    }
    console.log("printing userID ", userID, " taID ", taID)
  
  useEffect(() => {
    setRows(getInitialRows());
    console.log("printing GREButtonSelection ", props.GREButtonSelection)
    console.log("printing goalsOrRoutinesList ", props.goalsOrRoutinesList)
  }, [props.goalsOrRoutinesList]);
  // useEffect(() => {
  //   console.log("printing rows ", rows )
  // },[rows])
  
  function getInitialRows() {
    const initialRows = props.goalsOrRoutinesList.map((item) => {
      const starthoursMinutes = item.gr_start_day_and_time.split(' ')[1].split(':')
      const endhoursMinutes = item.gr_end_day_and_time.split(' ')[1].split(':')
      const startDate = item.gr_start_day_and_time.split(' ')[0];
      const st = item.gr_start_day_and_time;
      const startTime24h = moment(item.gr_start_day_and_time).format("HH:mm");
      // console.log("printing startTime24hr ", startTime24h, "st ", st);
      const startTime = starthoursMinutes[0] + ':' + starthoursMinutes[1] + ' ' + item.gr_start_day_and_time.split(' ')[2];
      
      const endDate = item.gr_end_day_and_time.split(' ')[0];
      const et = item.gr_end_day_and_time;
      const endTime24h = moment(item.gr_end_day_and_time).format("HH:mm");
      // console.log("printing endTime24h ", endTime24h, "et ", et);
      const endTime = endhoursMinutes[0] + ':' + endhoursMinutes[1] + ' ' + item.gr_end_day_and_time.split(' ')[2];
      return {
        routineID: item.gr_unique_id,
        routineName: item.gr_title,
        startDate: startDate,
        startTime: startTime,
        startTime24h: startTime24h,
        endDate: endDate,
        endTime: endTime,
        endTime24h: endTime24h,
        repeat: item.repeat === 'True' ? 'Yes' : 'No',
        repeatEnds: item.repeat_type,
        repeatEndsOn: item.repeat_ends_on,
        repeatEndsAfter: item.repeat_occurences,
        availableToUser: item.is_available === 'True' ? 'Yes' : 'No',
      };
    });
    // console.log("printing this ", initialRows )
    return initialRows;
  }
  const [editingIndex, setEditingIndex] = useState(-1);
  const [routineID, setRoutineID] = useState('');
  const [routineName, setRoutineName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [startTime24h, setStartTime24h] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [endTime24h, setEndTime24h] = useState('');
  const [repeat, setRepeat] = useState('No');
  const [repeatEnds, setRepeatEnds] = useState('Never');
  const [repeatEndsOn, setRepeatEndsOn] = useState('');
  const [repeatEndsAfter, setRepeatEndsAfter] = useState('0')
  const [availableToUser, setAvailableToUser] = useState('No');

  const handleEditRow = (index) => {
    const rowToEdit = rows[index];
    setEditingIndex(index);
    setRoutineID(rowToEdit.routineID);
    setRoutineName(rowToEdit.routineName);
    setStartDate(rowToEdit.startDate);
    setStartTime(rowToEdit.startTime);
    setStartTime24h(rowToEdit.startTime24h);
    setEndDate(rowToEdit.endDate);
    setEndTime(rowToEdit.endTime);
    setEndTime24h(rowToEdit.endTime24h);
    setRepeat(rowToEdit.repeat);
    setRepeatEnds(rowToEdit.repeatEnds);
    setRepeatEndsOn(rowToEdit.repeatEndsOn);
    setRepeatEndsAfter(rowToEdit.repeatEndsAfter);
    setAvailableToUser(rowToEdit.availableToUser);
  };
 
  const handleSaveRow = (index) => {
    setShowAddRow(false);
    const updatedRows = [...rows];
    updatedRows[index] = {
      routineID,
      routineName,
      startDate,
      startTime,
      startTime24h,
      endDate,
      endTime,
      endTime24h,
      repeat,
      repeatEnds,
      repeatEndsOn,
      repeatEndsAfter,
      availableToUser,
    };
    console.log("printing after save ", updatedRows)
    setRows(updatedRows);
    setEditingIndex(-1);
    if (updatedRows[index].routineID === '') {
      console.log("printing verdict - ADD ", updatedRows[index].routineName)
      // addNewGR(updatedRows[index], index);
      addNewGR(updatedRows, index);
    }
    else {
      console.log("printing verdict - EDIT ", updatedRows[index].routineName);
      let result = props.goalsOrRoutinesList.find(lst => lst.gr_unique_id === updatedRows[index].routineID);
      console.log("printing verdict - res", result);
      updateGR(updatedRows[index], result);
    }
    resetForm();
  };

  const handleDeleteRow = (index) => {
    const updatedRows = [...rows];
    if (updatedRows[index].routineID !== '') {
      console.log("printing verdict - DELETE API ", updatedRows[index].routineName)
      // delete GR API call
      let body = { goal_routine_id: updatedRows[index].routineID };
      axios.post(BASE_URL + 'deleteGR', body)
      .then((res) => {
        console.log("printing GR deleted ", updatedRows);
        props.getUploadAck(updatedRows);
      })
    }
    updatedRows.splice(index, 1);
    setRows(updatedRows);
    console.log("printing after deletion ", updatedRows)
    resetForm();
  };

  const handleAddRow = () => {
    setShowAddRow(true);
    resetForm();
  };

  const handleCancelAddRow = () => {
    setShowAddRow(false);
    resetForm();
  };

  const resetForm = () => {
    setRoutineID('');
    setRoutineName('');
    setStartDate('');
    setStartTime24h('');
    setStartTime('');
    setEndTime24h('');
    setEndDate('');
    setEndTime('');
    setRepeat('No');
    setRepeatEnds('Never');
    setRepeatEndsOn('');
    setRepeatEndsAfter('0');
    setAvailableToUser('No');
  };

  const isRowBeingEdited = (index) => index === editingIndex;

  const updateGR = (updatedGR, existingGR) => {
    
    console.log("printing updateGR", existingGR)
    let taNotification = existingGR.notifications.find(notification => notification.user_ta_id === taID);
    let ta_notification;
    if (taNotification && taNotification.length !== 0) {
      ta_notification = { "before": { "is_enabled": taNotification.before_is_enable, "is_set": taNotification.before_is_set, "message": taNotification.before_message, "time": taNotification.before_time }, "during": { "is_enabled": taNotification.during_is_enable, "is_set": taNotification.during_is_set, "message": taNotification.during_message, "time": taNotification.during_time }, "after": { "is_enabled": taNotification.after_is_enable, "is_set": taNotification.after_is_set, "message": taNotification.after_message, "time": taNotification.after_time } }
    } else {
      ta_notification = { "before": { "is_enabled": 'False', "is_set": 'False', "message": '', "time": '00:00:00' }, "during": { "is_enabled": 'False', "is_set": 'False', "message": '', "time": '00:00:00' }, "after": { "is_enabled": 'False', "is_set": 'False', "message": '', "time": '00:00:00' } }
    }
    console.log("printing ta_notification", ta_notification)

    let userNotification = existingGR.notifications.find(notification => notification.user_ta_id === userID);
    let user_notification;
    if (userNotification && userNotification.length !== 0) {
      user_notification = { "before": { "is_enabled": userNotification.before_is_enable, "is_set": userNotification.before_is_set, "message": userNotification.before_message, "time": userNotification.before_time }, "during": { "is_enabled": userNotification.during_is_enable, "is_set": userNotification.during_is_set, "message": userNotification.during_message, "time": userNotification.during_time }, "after": { "is_enabled": userNotification.after_is_enable, "is_set": userNotification.after_is_set, "message": userNotification.after_message, "time": userNotification.after_time } }
    } else {
      user_notification = { "before": { "is_enabled": 'False', "is_set": 'False', "message": '', "time": '00:00:00' }, "during": { "is_enabled": 'False', "is_set": 'False', "message": '', "time": '00:00:00' }, "after": { "is_enabled": 'False', "is_set": 'False', "message": '', "time": '00:00:00' } }
    }
    console.log("printing userNotification", userNotification)

    // payload for updateGR API call
    var updateGRObj = {
      audio: '',
      datetime_completed: existingGR.gr_datetime_completed,
      datetime_started: existingGR.gr_datetime_started,
      title: updatedGR.routineName,
      repeat: updatedGR.repeat === 'Yes' ? 'True' : 'False',
      repeat_frequency: existingGR.repeat_frequency,
      repeat_every: existingGR.repeat_every,
      repeat_type: updatedGR.repeatEnds,
      repeat_ends_on: updatedGR.repeatEndsOn,
      repeat_occurences: updatedGR.repeatEndsAfter,
      repeat_week_days: existingGR.repeat_week_days, //no update
      is_available: updatedGR.availableToUser === 'Yes' ? 'True' : 'False',
      is_persistent: existingGR.is_persistent,
      is_complete: existingGR.is_complete,
      is_displayed_today: existingGR.is_displayed_today,
      is_timed: existingGR.is_timed,
      is_sublist_available: existingGR.is_sublist_available,
      photo_url: existingGR.gr_photo,
      ta_notifications: ta_notification,
      user_notifications: user_notification,
      user_id: existingGR.user_id,
      is_in_progress: existingGR.is_in_progress,
      status: existingGR.status,
      start_day_and_time: updatedGR.startDate + ' ' + formatTime12h(updatedGR.startTime),
      end_day_and_time: updatedGR.endDate + ' ' + formatTime12h(updatedGR.endTime),
      expected_completion_time: existingGR.gr_expected_completion_time,
      gr_unique_id: updatedGR.routineID,
      ta_people_id: taID,
  }
  let formData = new FormData();
  Object.entries(updateGRObj).forEach((entry) => {
      console.log('test-entry: ', entry);
      if (typeof entry[1] == 'string') {
          formData.append(entry[0], entry[1]);
      } else if (entry[1] instanceof Object) {
          entry[1] = JSON.stringify(entry[1]);
          formData.append(entry[0], entry[1]);
      } else {
          formData.append(entry[0], entry[1]);
      }
  });
  axios
      .post(BASE_URL + 'updateGR', formData)
      .then((res) => {
          console.log("printing updated");
          props.getUploadAck(updateGRObj);
      })
      .catch((err) => {
          if (err.response) {
              console.log(err.response);
          }
          console.log(err);
      });
  }

  const addNewGR = (updatedRows, index) => {
    let gr = updatedRows[index]
    var addGRobj = {
      audio: '',
      datetime_completed: '',
      datetime_started: '',
      title: gr.routineName,
      repeat: gr.repeat === 'Yes' ? 'True' : 'False',
      repeat_frequency: 'Day',
      repeat_every: '1',
      repeat_type: gr['repeatEnds'],
      repeat_ends_on: gr.repeatEndsOn,
      repeat_occurences: gr.repeatEndsAfter,
      repeat_week_days: { "0": "", "1": "", "2": "", "3": "", "4": "", "5": "", "6": "" },
      is_available: gr['availableToUser'] === 'Yes' ? 'True' : 'False',
      is_persistent: props.GREButtonSelection === 'Goals' ? false : true, 
      is_complete: false,
      is_displayed_today: '',
      is_timed: 'False',
      is_sublist_available: 'False',
      photo_url: undefined,// default
      // notifications: "",
      ta_notifications: { "before": { "is_enabled": 'False', "is_set": 'False', "message": '', "time": '00:00:00' }, "during": { "is_enabled": 'False', "is_set": 'False', "message": '', "time": '00:00:00' }, "after": { "is_enabled": 'False', "is_set": 'False', "message": '', "time": '00:00:00' } },
      user_notifications: { "before": { "is_enabled": 'False', "is_set": 'False', "message": '', "time": '00:00:00' }, "during": { "is_enabled": 'False', "is_set": 'False', "message": '', "time": '00:00:00' }, "after": { "is_enabled": 'False', "is_set": 'False', "message": '', "time": '00:00:00' } },
      user_id: userID,
      is_in_progress: 'False',
      status: 'not started',
      start_day_and_time: gr.startDate + ' ' + formatTime12h(gr.startTime),
      end_day_and_time: gr.endDate + ' ' + formatTime12h(gr.endTime),
      expected_completion_time: '00:00:00',
      gr_unique_id: undefined,
      ta_people_id: taID,
      photo: null
    } 
    let formData = new FormData();
    Object.entries(addGRobj).forEach((entry) => {
        console.log('test-entry: ', entry);
        if (typeof entry[1] == 'string') {
            formData.append(entry[0], entry[1]);
        } else if (entry[1] instanceof Object) {
            entry[1] = JSON.stringify(entry[1]);
            formData.append(entry[0], entry[1]);
        } else {
            formData.append(entry[0], entry[1]);
        }
    });
    addToDB(formData, updatedRows, index)
    // return result;
  }

  const addToDB = async (formData, updatedRows, index) => {
    await axios
      .post(BASE_URL + 'addGR', formData)
      .then((res) => {
        console.log("printing after ADD ", res);
        console.log("printing after ADD n ", updatedRows)
        updatedRows[index].routineID = res.data.result;
        setRows(updatedRows);
        console.log("printing after ADD updatedRows ", updatedRows);
        props.getUploadAck(updatedRows);
        // return res.data.data.result;
      })
      .catch((err) => {
        if (err.response) {
            console.log("printing after ADD ",err.response);
        }
        console.log("printing after ADD ",err);
    });
  }

  const formatTime = (time) => {
    if (!time) return ''; // Return empty string if time is not provided
  
    const [hours, minutes] = time.split(':');
    let parsedHours = parseInt(hours, 10);
    let amPm = 'AM';
  
    if (parsedHours === 0) {
      parsedHours = 12;
    } else if (parsedHours >= 12) {
      amPm = 'PM';
      if (parsedHours > 12) {
        parsedHours -= 12;
      }
    }
  
    return `${parsedHours.toString().padStart(2, '0')}:${minutes} ${amPm}`;
  };

  const formatTime12h = (time) => {
    let timeComponents = time.split(' ');
    let time12h = timeComponents[0] + ':00 ' + timeComponents[1];
    // console.log("printing time12h ", time12h)
    return time12h;
  }
  return (
    <Dialog open={props.quickEditModalVisible} onClose={props.closeQuickEditModal} maxWidth="lg">
      <DialogTitle>Quick Edit</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableCell key={header} style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>{header}</TableCell>
                ))}
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {isRowBeingEdited(index) ? (
                      <TextField
                        value={routineName}
                        onChange={(e) => setRoutineName(e.target.value)}
                      />
                    ) : (
                      row.routineName
                    )}
                  </TableCell>
                  <TableCell>
                    {isRowBeingEdited(index) ? (
                      <TextField
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    ) : (
                      row.startDate
                    )}
                  </TableCell>
                  <TableCell>
                    {isRowBeingEdited(index) ? (
                      <TextField
                        type="time"
                        value={startTime24h}
                        onChange={(e) => {
                          setStartTime(formatTime(e.target.value))
                          setStartTime24h(e.target.value)
                        }}
                      />
                    ) : (
                      row.startTime
                    )}
                  </TableCell>
                  <TableCell>
                    {isRowBeingEdited(index) ? (
                      <TextField
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    ) : (
                      row.endDate
                    )}
                  </TableCell>
                  <TableCell>
                    {isRowBeingEdited(index) ? (
                      <TextField
                        type="time"
                        value={endTime24h}
                        onChange={(e) => {
                          setEndTime(formatTime(e.target.value))
                          setEndTime24h(e.target.value)
                        }}
                      />
                    ) : (
                      row.endTime
                    )}
                  </TableCell>
                  <TableCell>
                    {isRowBeingEdited(index) ? (
                      <Select value={repeat} onChange={(e) => setRepeat(e.target.value)}>
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    ) : (
                      row.repeat
                    )}
                  </TableCell>
                  <TableCell>
                    {isRowBeingEdited(index) ? (
                      <>
                      <Select value={repeatEnds} onChange={(e) => setRepeatEnds(e.target.value)}>
                        <MenuItem value="On">On</MenuItem>
                        <MenuItem value="Occur">After</MenuItem>
                        <MenuItem value="Never">Never</MenuItem>
                      </Select>
                      {repeatEnds === 'On' && <TextField type='date' value={repeatEndsOn} onChange={(e)=>setRepeatEndsOn(e.target.value)}/>}
                      {repeatEnds === 'Occur' && <><br /><TextField style={{ width: 50 }} type='number' value={repeatEndsAfter} onChange={(e)=>setRepeatEndsAfter(e.target.value)}/>Occurrences</>}
                      </>
                    ) : (
                      <>
                      {row.repeatEnds === 'Occur' ? 'After ' : row.repeatEnds+ ' '}
                      {row.repeatEnds === 'On' && row.repeatEndsOn }
                      {row.repeatEnds === 'Occur' && row.repeatEndsAfter + ' Occurrences'}
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    {isRowBeingEdited(index) ? (
                      <Select
                        value={availableToUser}
                        onChange={(e) => setAvailableToUser(e.target.value)}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    ) : (
                      row.availableToUser
                    )}
                  </TableCell>
                  <TableCell>
                    {isRowBeingEdited(index) ? (
                      // <Button onClick={() => handleSaveRow(index)}>Save</Button>
                        <FontAwesomeIcon style={{margin:'4px'}} icon={faSave} size="lg" onClick={() => handleSaveRow(index)}/>
                    ) : (
                    //   <Button onClick={() => handleEditRow(index)}>Edit</Button>
                        <FontAwesomeIcon style={{margin:'4px'}} icon={faPen} onClick={() => handleEditRow(index)}/>
                    )}
                    {/* <Button onClick={() => handleDeleteRow(index)}>Delete</Button> */}
                        <FontAwesomeIcon style={{margin:'4px'}} icon={faTrashAlt} onClick={() => handleDeleteRow(index)}/>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              {showAddRow && (
                <TableRow>
                  <TableCell>
                    <TextField
                      required
                      value={routineName}
                      onChange={(e) => setRoutineName(e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="time"
                      value={startTime24h}
                      onChange={(e) => {
                        setStartTime(formatTime(e.target.value))
                        setStartTime24h(e.target.value)
                      }
                      }
                      required
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="time"
                      value={endTime24h}
                      onChange={(e) => {
                        setEndTime(formatTime(e.target.value))
                        setEndTime24h(e.target.value)
                      }}
                      required
                    />
                  </TableCell>
                  <TableCell>
                    <Select value={repeat} onChange={(e) => setRepeat(e.target.value)}>
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select value={repeatEnds} onChange={(e) => setRepeatEnds(e.target.value)}>
                      <MenuItem value="On">On</MenuItem>
                      <MenuItem value="Occur">After</MenuItem>
                      <MenuItem value="Never">Never</MenuItem>
                    </Select>
                    {repeatEnds === 'On' && <TextField type='date' value={repeatEndsOn} onChange={(e)=>setRepeatEndsOn(e.target.value)}/>}
                    {repeatEnds === 'Occur' && <><br /><TextField style={{ width: 50 }} type='number' value={repeatEndsAfter} onChange={(e)=>setRepeatEndsAfter(e.target.value)}/><br/>Occurrences</>}
                  </TableCell>
                  <TableCell>
                    <Select value={availableToUser} onChange={(e) => setAvailableToUser(e.target.value)}>
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <FontAwesomeIcon style={{margin:'4px'}} icon={faSave} size="lg" onClick={() => handleSaveRow(rows.length)}/>
                    {/* <Button onClick={() => handleSaveRow(rows.length)}>Save</Button> */}
                    <FontAwesomeIcon style={{margin:'4px'}} icon={faTrashAlt} onClick={handleCancelAddRow}/>
                    {/* <Button onClick={handleCancelAddRow}>Cancel</Button> */}
                  </TableCell>
                </TableRow>
              )}
              {!showAddRow && (
                <TableRow>
                  <TableCell colSpan={headers.length + 1}>
                    <Button
                      style={{
                        color: '#fff',
                        backgroundColor: '#000',
                        '&:hover': {
                          backgroundColor: '#111',
                        }
                      }
                      }
                      onClick={handleAddRow}>Add Row</Button>
                  </TableCell>
                </TableRow>
              )}
            </TableFooter>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        {/* <Button
          style={{
            color: '#fff',
            backgroundColor: '#000',
            '&:hover': {
              backgroundColor: '#111',
            }
          }
          }
          onClick={handleSave}>Save</Button> */}
        <Button onClick={props.closeQuickEditModal}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
