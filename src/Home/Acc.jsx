import React, { useState, useEffect } from 'react';
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
    InputAdornment,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
  } from '@material-ui/core';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faPen, faTrashAlt, faSave, faPlus, faChevronDown, faList } from '@fortawesome/free-solid-svg-icons';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import axios from 'axios';
import moment from 'moment';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import QuickEditIS from './QuickEditIS';

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;

  // Dummy data for the table rows
  // const tableData = [
  //   {
  //     id: 1,
  //     actionTaskID: '1',
  //     actionTask: 'Task 1',
  //     startDate: '2023-07-09',
  //     startTime: '10:00 AM',
  //     endDate: '2023-07-09',
  //     endTime: '11:00 AM',
  //     taskDuration: '00:05:00',
  //     availableToUser: 'Yes',
  //     sublistAvailable: 'True'
  //   },
  //   {
  //     id: 2,
  //     actionTaskID: '2',
  //     actionTask: 'Task 2',
  //     startDate: '2023-07-10',
  //     startTime: '2:00 PM',
  //     endDate: '2023-07-10',
  //     endTime: '4:00 PM',
  //     taskDuration: '00:05:00',
  //     availableToUser: 'No',
  //     sublistAvailable: 'False'
  //   },
  //   // Add more rows as needed
  // ];

  const headers = [
    'Action Task',
    'Start Date',
    'Start Time',
    'End Date',
    'End Time',
    'Task Duration',
    'Available To User',
  ];
const MyTable = (props) => {
    const [showAddRow, setShowAddRow] = useState(false);
    const [expandIndex, setExpandIndex] = useState(-1);
    const [actionTask, setActionTask] = useState('');
    const [actionTaskID, setActionTaskID] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [startTime24h, setStartTime24h] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');
    const [endTime24h, setEndTime24h] = useState('');
    const [taskDuration, setTaskDuration] = useState('00:00:00');
    const [durationInMinutes, setDurationInMinutes] = useState('0');
    const [availableToUser, setAvailableToUser] = useState('No');
    const [editingIndex, setEditingIndex] = useState(-1);
    const [actionTasks, setActionTasks] = useState([]);
    const [originalATlist, setOriginalATlist] = useState([]);
    
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
      axios
        .get(BASE_URL + 'actionsTasks/' + props.routineID)
        .then((response) => {
          console.log("actionsTasks ", response.data.result)
          let action_tasks = response.data.result;
          setOriginalATlist(action_tasks);
          const initialRows = action_tasks.map((item) => {
            // const starthoursMinutes = item.at_datetime_started.split(' ')[1].split(':')
            // const endhoursMinutes = item.at_datetime_completed.split(' ')[1].split(':')
                
            const startDate = item.at_datetime_started.split(' ')[0];
                
            const startTime24h = item.at_datetime_started.split(' ')[1];
            const startTime = moment(startTime24h, "HH:mm").format("hh:mm A")
            console.log("startTime24h ", startTime24h, "startTime12h ", startTime);
                
            // const st = item.at_datetime_started;
            // const startTime24h = moment(item.at_datetime_started).format("HH:mm");
            // console.log("printing startTime24hr ", startTime24h, "st ", st);
            // const startTime = starthoursMinutes[0] + ':' + starthoursMinutes[1] + ' ' + item.at_datetime_started.split(' ')[2];
                
            const endDate = item.at_datetime_completed.split(' ')[0];
                
            const endTime24h = item.at_datetime_completed.split(' ')[1];
            const endTime = moment(endTime24h, "HH:mm").format("hh:mm A")
            console.log("endTime24h ", endTime24h, "endTime12h ", endTime);
                
            // const et = item.at_datetime_completed;
            // const endTime24h = moment(item.at_datetime_completed).format("HH:mm");
            // console.log("printing endTime24h ", endTime24h, "et ", et);
            // const endTime = endhoursMinutes[0] + ':' + endhoursMinutes[1] + ' ' + item.at_datetime_completed.split(' ')[2];
    
            const durationInMinutes = moment.duration(item.at_expected_completion_time).asMinutes();
            return {
              actionTaskID: item.at_unique_id,
              actionTask: item.at_title,
              taskDuration: item.at_expected_completion_time,
              durationInMinutes: durationInMinutes,
              availableToUser: item.is_available === 'True' ? 'Yes' : 'No',
              sublistAvailable: item.is_sublist_available,
              startDate: startDate,
              startTime: startTime,
              startTime24h: startTime24h,
              endDate: endDate,
              endTime: endTime,
              endTime24h: endTime24h,
            }
          })
          console.log("printing AT initialRows ", initialRows)
          setActionTasks(initialRows)
          console.log("printing routineID ", props.routineID)
        })
    }, [props.routineID]);
    
  const handleEditRow = (index) => {
    const rowToEdit = actionTasks[index];
    setEditingIndex(index);
    setActionTask(rowToEdit.actionTask);
    setActionTaskID(rowToEdit.actionTaskID)
    setDurationInMinutes(rowToEdit.durationInMinutes);
    setTaskDuration(rowToEdit.taskDuration);
    setStartDate(rowToEdit.startDate);
    setStartTime(rowToEdit.startTime);
    setStartTime24h(rowToEdit.startTime24h);
    setEndDate(rowToEdit.endDate);
    setEndTime(rowToEdit.endTime);
    setEndTime24h(rowToEdit.endTime24h);
    setAvailableToUser(rowToEdit.availableToUser);
  };
    const handleSaveRow = (index) => {
        setShowAddRow(false);
        const updatedRows = [...actionTasks];
        updatedRows[index] = {
            actionTaskID,
            actionTask,
            startDate,
            startTime,
            startTime24h,
            endDate,
            endTime,
            endTime24h,
            taskDuration,
            durationInMinutes,
            availableToUser,
        };
        console.log("printing after save ", updatedRows)
        setActionTasks(updatedRows);
        setEditingIndex(-1);
        if (updatedRows[index].actionTaskID === '') {
          console.log("printing actionTask verdict - ADD ", updatedRows[index].actionTask)
          // addNewGR(updatedRows[index], index);
          addAT(updatedRows, index);
        }
        else {
          console.log("printing actionTask verdict - EDIT ", updatedRows[index].actionTask);
          let result = originalATlist.find(lst => lst.at_unique_id === updatedRows[index].actionTaskID);
          console.log("printing verdict - res", result);
          updateAT(updatedRows[index], result);
        }
        resetForm();
    }
  
    const handleDeleteRow = (index) => {
      const updatedRows = [...actionTasks];
      if (updatedRows[index].actionTaskID !== '') {
        console.log("printing verdict actionTasks- DELETE API ", updatedRows[index].actionTask)
        // delete AT API call
        let body = { at_id: updatedRows[index].actionTaskID };
        axios.post(BASE_URL + 'deleteAT', body)
        .then((res) => {
          console.log("printing AT deleted ", updatedRows);
          props.getUploadAck(updatedRows);
        })
      }
      updatedRows.splice(index, 1);
      setActionTasks(updatedRows);
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
    
    const handleAccordion = (index) => {
        expandIndex===index ? setExpandIndex(-1) : setExpandIndex(index);
      }
    const resetForm = () => {
        setActionTaskID('');
        setActionTask('');
        setTaskDuration('');
        setDurationInMinutes('0');
        setStartDate('');
        setStartTime('');
        setStartTime24h('');
        setEndDate('');
        setEndTime('');
        setEndTime24h('');
        setAvailableToUser('No');
      };
  const isRowBeingEdited = (index) => index === editingIndex;

  const addAT = (updatedRows, index) => {
    let at = updatedRows[index];
    var addATobj = {
      audio:'',
      datetime_completed: at.endDate + " " + at.endTime24h,
      datetime_started: at.startDate + " " + at.startTime24h,
      is_available: at.availableToUser === 'Yes' ? true : false,
      is_complete: false,
      is_timed: at.durationInMinutes > 0 ? true : false,
      is_sublist_available: false,
      photo_url: undefined,
      available_start_time: at.startTime24h,
      available_end_time: at.endTime24h,
      expected_completion_time: at.taskDuration,
      type: '',
      title: at.actionTask,
      gr_id: props.routineID,
      id: undefined,
      user_id: userID,
      photo: null
    }
    let formData = new FormData();
    Object.entries(addATobj).forEach((entry) => {
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
      .post(BASE_URL + 'addAT', formData)
      .then((res) => {
        console.log("printing after ADD ", res);
        console.log("printing after ADD resullt", res.data.result);
        console.log("printing after ADD n ", updatedRows)
        updatedRows[index].actionTaskID = res.data.result;
        setActionTasks(updatedRows);
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
  const updateAT = (at, originalAT) => {
    var updateATobj = {
      audio: '',
      datetime_completed: at.endDate + " " + at.endTime24h,
      datetime_started: at.startDate + " " + at.startTime24h,
      is_available: at.availableToUser === 'Yes' ? 'True' : 'False',
      is_complete: originalAT.is_complete,
      is_timed: at.durationInMinutes > 0 ? 'True' : 'False',
      is_sublist_available: originalAT.is_sublist_available,
      photo_url: undefined,
      is_in_progress: originalAT.is_in_progress,
      is_must_do: originalAT.is_must_do,
      available_start_time: at.startTime24h,
      available_end_time: at.endTime24h,
      expected_completion_time: at.taskDuration,
      type: originalAT.type,
      title: at.actionTask,
      gr_id: props.routineID,
      id: originalAT.at_unique_id,
      user_id: userID,
      photo: originalAT.at_photo
    }
    let formData = new FormData();
    Object.entries(updateATobj).forEach((entry) => {
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
      .post(BASE_URL + 'updateAT', formData)
      .then((res) => {
          console.log("printing updated");
          props.getUploadAck(updateATobj);
      })
      .catch((err) => {
          if (err.response) {
              console.log(err.response);
          }
          console.log(err);
      });
  }
  return (
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
        {actionTasks.map((row, index) => (
            <>
          <TableRow key={index}>
            <TableCell>
            {isRowBeingEdited(index) ? (
                <TextField
                value={actionTask}
                onChange={(e) => setActionTask(e.target.value)}
                />
            ) : (
                row.actionTask
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
                      setStartTime24h(e.target.value)
                      setStartTime(moment(e.target.value, "HH:mm").format("hh:mm A"))
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
                      setEndTime24h(e.target.value)
                      setEndTime(moment(e.target.value, "HH:mm").format("hh:mm A"))
                    }
                    }
                />
            ) : (
                row.endTime
            )}
            </TableCell>
            <TableCell>
            {isRowBeingEdited(index) ? (
                <>
                <TextField
                style={{width:"50%"}}
                type="number"
                value={durationInMinutes}
                  onChange={(e) => {
                    setDurationInMinutes(e.target.value)
                    let duration = e.target.value;
                    const numHours = duration >= 60 ? duration / 60 : '00';
                    let numMins = duration % 60;
                    if (numMins < 10) numMins = '0' + numMins;
                    let formattedDuration = `${numHours}:${numMins}:00`;
                    setTaskDuration(formattedDuration)
                  }
                  }
                /> 
                minutes
                </>
            ) : (
                row.taskDuration
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
                    <FontAwesomeIcon style={{ margin: '4px' }} icon={faPen} onClick={() => handleEditRow(index)} />
                )}
                {/* <Button onClick={() => handleDeleteRow(index)}>Delete</Button> */}
                <FontAwesomeIcon style={{ margin: '4px' }} icon={faTrashAlt} onClick={() => handleDeleteRow(index)} />
                {
                        row.sublistAvailable === 'True' ?
                        <FontAwesomeIcon icon={faList} onMouseOver={(event) => {
                          event.target.style.color = '#48D6D2';
                        }}
                        onMouseOut={(event) => {
                          event.target.style.color = '#000000';
                        }}
                        style={{ color: '#000000', cursor: 'pointer' }}
                        onClick={(e) => {
                          e.target.style.color = '#000000';
                          handleAccordion(index);
                        }} />
                      :
                      <PlaylistAddIcon
                        onMouseOver={(event) => {
                          event.target.style.color = '#48D6D2';
                        }}
                        onMouseOut={(event) => {
                          event.target.style.color = '#000000';
                        }}
                        style={{ color: '#000000', cursor: 'pointer' }}
                        onClick={(e) => {
                          e.target.style.color = '#000000';
                          handleAccordion(index);
                        }}
                      />
                    }
                  </TableCell>
                </TableRow>
                {expandIndex === index &&
                <TableRow>
                    <TableCell colSpan={9}>
                        <AccordionDetails>
                            <QuickEditIS actionTaskID={row.actionTaskID} getUploadAck={props.getUploadAck}></QuickEditIS>
                        </AccordionDetails>
                    </TableCell>
                </TableRow>
                }
              </>
        ))}
      </TableBody>
      <TableFooter>
              {showAddRow && (
                <TableRow>
                    <TableCell>
                    <TextField
                        value={actionTask}
                        onChange={(e) => setActionTask(e.target.value)}
                        />
                    </TableCell>
                    <TableCell>
                    <TextField
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        />
                    </TableCell>
                    <TableCell>
                    <TextField
                      type="time"
                      value={startTime24h}
                          onChange={(e) => {
                            setStartTime24h(e.target.value)
                            setStartTime(moment(e.target.value, "HH:mm").format("hh:mm A"))
                          }}
                      />
                    </TableCell>
                    <TableCell>
                    <TextField
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                    <TextField
                      type="time"
                      value={endTime24h}
                          onChange={(e) => {
                            setEndTime24h(e.target.value)
                            setEndTime(moment(e.target.value, "HH:mm").format("hh:mm A"))
                          }
                          }
                      />
                    </TableCell>
                    
                    <TableCell>
                    <>
                      <TextField
                      style={{width:"50%"}}
                      type="number"
                      value={durationInMinutes}
                        onChange={(e) => {
                          setDurationInMinutes(e.target.value)
                          let duration = e.target.value;
                          const numHours = duration >= 60 ? duration / 60 : '00';
                          let numMins = duration % 60;
                          if (numMins < 10) numMins = '0' + numMins;
                          let formattedDuration = `${numHours}:${numMins}:00`;
                          setTaskDuration(formattedDuration)
                        }}
                      /> 
                      minutes
                    </>
                    </TableCell>
                    <TableCell>
                        <Select
                          value={availableToUser}
                          onChange={(e) => setAvailableToUser(e.target.value)}
                        >
                          <MenuItem value="Yes">Yes</MenuItem>
                          <MenuItem value="No">No</MenuItem>
                        </Select>
                    </TableCell>
                    
                  <TableCell>
                    <FontAwesomeIcon style={{margin:'4px'}} icon={faSave} size="lg" onClick={() => handleSaveRow(actionTasks.length)}/>
                    <FontAwesomeIcon style={{margin:'4px'}} icon={faTrashAlt} onClick={handleCancelAddRow}/>
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
  );
};

export default MyTable;
