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
  } from '@material-ui/core';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faPen, faTrashAlt, faSave, faPlus, faChevronDown, faList } from '@fortawesome/free-solid-svg-icons';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import axios from 'axios';
import moment from 'moment';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;

  // Dummy data for the table rows
  const tableData = [
    {
      id: 1,
      actionTask: 'Task 1',
      startDate: '2023-07-09',
      startTime: '10:00 AM',
      endDate: '2023-07-09',
      endTime: '11:00 AM',
      taskDuration: '00:05:00',
      availableToUser: 'Yes',
      sublistAvailable: 'True'
    },
    {
      id: 2,
      actionTask: 'Task 2',
      startDate: '2023-07-10',
      startTime: '2:00 PM',
      endDate: '2023-07-10',
      endTime: '4:00 PM',
      taskDuration: '00:05:00',
      availableToUser: 'No',
      sublistAvailable: 'False'
    },
    // Add more rows as needed
  ];

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
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');
    const [taskDuration, setTaskDuration] = useState('');
    const [availableToUser, setAvailableToUser] = useState('');
    const [editingIndex, setEditingIndex] = useState(-1);
    const [actionTasks, setActionTasks] = useState(tableData);
    
    useEffect(() => {
        // setActionTasks(getInitialRows());
        console.log("printing routineID ", props.routineID)
        axios
            .get(BASE_URL + 'actionsTasks/' + props.routineID)
            .then((response) => { 
                console.log("actionsTasks ", response.data.result)
                let action_tasks = response.data.result;
                const initialRows = action_tasks.map((item) => {
                    const starthoursMinutes = item.at_datetime_started.split(' ')[1].split(':')
                    const endhoursMinutes = item.at_datetime_completed.split(' ')[1].split(':')
                    const startDate = item.at_datetime_started.split(' ')[0];
                    const st = item.at_datetime_started;
                    const startTime24h = moment(item.at_datetime_started).format("HH:mm");
                    // console.log("printing startTime24hr ", startTime24h, "st ", st);
                    const startTime = starthoursMinutes[0] + ':' + starthoursMinutes[1] + ' ' + item.at_datetime_started.split(' ')[2];
                    
                    const endDate = item.at_datetime_completed.split(' ')[0];
                    const et = item.at_datetime_completed;
                    const endTime24h = moment(item.at_datetime_completed).format("HH:mm");
                    // console.log("printing endTime24h ", endTime24h, "et ", et);
                    const endTime = endhoursMinutes[0] + ':' + endhoursMinutes[1] + ' ' + item.at_datetime_completed.split(' ')[2];
                    return {
                        actionTaskID: item.at_unique_id,
                        actionTask: item.at_title,
                        taskDuration: item.at_expected_completion_time,
                        availableToUser: item.is_available,
                        sublistAvailable: item.is_sublist_available,
                        startDate: startDate,
                        startTime: startTime,
                        startTime24h: startTime24h,
                        endDate: endDate,
                        endTime: endTime,
                        endTime24h: endTime24h,
                    }
                })
                setActionTasks(initialRows)
            })
    }, [props.routineID]);
    
  const handleEditRow = (index) => {
    const rowToEdit = actionTasks[index];
    setEditingIndex(index);
    setActionTask(rowToEdit.actionTask);
    setTaskDuration(rowToEdit.taskDuration);
    setStartDate(rowToEdit.startDate);
    setStartTime(rowToEdit.startTime);
    // setStartTime24h(rowToEdit.startTime24h);
    setEndDate(rowToEdit.endDate);
    setEndTime(rowToEdit.endTime);
    // setEndTime24h(rowToEdit.endTime24h);
    setAvailableToUser(rowToEdit.availableToUser);
  };
    const handleSaveRow = (index) => {
        setShowAddRow(false);
        const updatedRows = [...actionTasks];
        updatedRows[index] = {
            actionTask,
            startDate,
            startTime,
            endDate,
            endTime,
            taskDuration,
            availableToUser,
        };
        console.log("printing after save ", updatedRows)
        setActionTasks(updatedRows);
        setEditingIndex(-1);
        resetForm();
    }

    const handleDeleteRow = (index) => {
        const updatedRows = [...actionTasks];
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
        setActionTask('');
        setTaskDuration('');
        setStartDate('');
        setStartTime('');
        // setStartTime24h(rowToEdit.startTime24h);
        setEndDate('');
        setEndTime('');
        // setEndTime24h(rowToEdit.endTime24h);
        setAvailableToUser('');
      };
  const isRowBeingEdited = (index) => index === editingIndex;

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
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                />
            ) : (
                row.startTime
            )}
            </TableCell>
            <TableCell>
            {isRowBeingEdited(index) ? (
                <TextField
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
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                />
            ) : (
                row.endTime
            )}
            </TableCell>
            <TableCell>
            {isRowBeingEdited(index) ? (
                <TextField
                value={taskDuration}
                onChange={(e) => setTaskDuration(e.target.value)}
                />
            ) : (
                row.taskDuration
            )}
            </TableCell>
            <TableCell>
            {isRowBeingEdited(index) ? (
                <TextField
                value={availableToUser}
                onChange={(e) => setAvailableToUser(e.target.value)}
                />
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
                        row.sublistAvailable === 'False' ?
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
                      : <FontAwesomeIcon icon={faList} onMouseOver={(event) => {
                        event.target.style.color = '#48D6D2';
                      }}
                      onMouseOut={(event) => {
                        event.target.style.color = '#000000';
                      }}
                      style={{ color: '#000000', cursor: 'pointer' }}
                      onClick={(e) => {
                        e.target.style.color = '#000000';
                        handleAccordion(index);
                      }}/>
                    }
                  </TableCell>
                </TableRow>
                {expandIndex === index &&
                <TableRow>
                    <TableCell colSpan={9}>
                        <AccordionDetails>
                            <MyTable></MyTable>
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
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        />
                    </TableCell>
                    <TableCell>
                    <TextField
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        />
                    </TableCell>
                    <TableCell>
                    <TextField
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        />
                    </TableCell>
                    <TableCell>
                    <TextField
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        />
                    </TableCell>
                    
                    <TableCell>
                    <TextField
                        value={taskDuration}
                        onChange={(e) => setTaskDuration(e.target.value)}
                        />
                    </TableCell>
                    <TableCell>
                        <TextField
                        value={availableToUser}
                        onChange={(e) => setAvailableToUser(e.target.value)}>
                        </TextField>
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
