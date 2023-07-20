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

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;

  const headers = [
    'Instruction Step',
    'Instruction / Step Sequence',
    'Task Duration',
    'Available To User',
  ];
const QuickEditIS = (props) => {
    const [showAddRow, setShowAddRow] = useState(false);
    const [expandIndex, setExpandIndex] = useState(-1);
    const [instructionStep, setInstructionStep] = useState('');
    const [instructionStepID, setInstructionStepID] = useState('');
    const [sequence, setSequence] = useState('0');
    const [stepDuration, setStepDuration] = useState('00:00:00');
    const [durationInMinutes, setDurationInMinutes] = useState('0');
    const [availableToUser, setAvailableToUser] = useState('No');
    const [editingIndex, setEditingIndex] = useState(-1);
    const [instructionSteps, setInstructionSteps] = useState([]);
    const [originalISlist, setOriginalISlist] = useState([]);
    
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
        .get(BASE_URL + 'instructionsSteps/' + props.actionTaskID)
        .then((response) => {
          console.log("instructionsSteps ", response.data.result)
          let instructions_steps = response.data.result;
          setOriginalISlist(instructions_steps);
          const initialRows = instructions_steps.map((item) => {
            const durationInMinutes = moment.duration(item.is_expected_completion_time).asMinutes();
            return {
              instructionStepID: item.is_unique_id,
              instructionStep: item.is_title,
              sequence: item.is_sequence,
              stepDuration: item.is_expected_completion_time,
              durationInMinutes: durationInMinutes,
              availableToUser: item.is_available === 'True' ? 'Yes' : 'No',
            }
          })
          console.log("printing IS initialRows ", initialRows)
          setInstructionSteps(initialRows)
          console.log("printing actionTaskID ", props.actionTaskID)
        })
    }, [props.actionTaskID]);
    
  const handleEditRow = (index) => {
    const rowToEdit = instructionSteps[index];
    setEditingIndex(index);
    setInstructionStep(rowToEdit.instructionStep);
    setInstructionStepID(rowToEdit.instructionStepID)
    setSequence(rowToEdit.sequence)
    setDurationInMinutes(rowToEdit.durationInMinutes);
    setStepDuration(rowToEdit.stepDuration);
    setAvailableToUser(rowToEdit.availableToUser);
  };
    const handleSaveRow = (index) => {
        setShowAddRow(false);
        const updatedRows = [...instructionSteps];
        updatedRows[index] = {
            instructionStepID,
            instructionStep,
            sequence,
            stepDuration,
            durationInMinutes,
            availableToUser,
        };
        console.log("printing after save ", updatedRows)
        setInstructionSteps(updatedRows);
        setEditingIndex(-1);
        if (updatedRows[index].instructionStepID === '') {
          console.log("printing instructionStep verdict - ADD ", updatedRows[index].instructionStep)
          // addNewGR(updatedRows[index], index);
          addAT(updatedRows, index);
        }
        else {
          console.log("printing instructionStep verdict - EDIT ", updatedRows[index].instructionStep);
          let result = originalISlist.find(lst => lst.is_unique_id === updatedRows[index].instructionStepID);
          console.log("printing verdict - res", result);
          updateAT(updatedRows[index], result);
        }
        resetForm();
    }
  
    const handleDeleteRow = (index) => {
      const updatedRows = [...instructionSteps];
      if (updatedRows[index].instructionStepID !== '') {
        console.log("printing verdict instruction step- DELETE API ", updatedRows[index].instructionStep)
        // delete AT API call
        let body = { is_id: updatedRows[index].instructionStepID };
        axios.post(BASE_URL + 'deleteIS', body)
        .then((res) => {
          console.log("printing IS deleted ", updatedRows);
          props.getUploadAck(updatedRows);
        })
      }
      updatedRows.splice(index, 1);
      setInstructionSteps(updatedRows);
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
    
    // const handleAccordion = (index) => {
    //     expandIndex===index ? setExpandIndex(-1) : setExpandIndex(index);
    //   }
    const resetForm = () => {
        setInstructionStepID('');
        setInstructionStep('');
        setSequence('0');
        setStepDuration('');
        setDurationInMinutes('0');
        setAvailableToUser('No');
      };
  const isRowBeingEdited = (index) => index === editingIndex;

  const addAT = (updatedRows, index) => {
    let is = updatedRows[index];
    var addISobj = {
      audio: '',
      is_available: is.availableToUser === 'Yes' ? true : false,
      is_complete: false,
      is_timed: false,
      photo_url: undefined,
      is_sequence: is.sequence,
      title: is.instructionStep,
      expected_completion_time: is.stepDuration,
      is_id: undefined,
      at_id: props.actionTaskID,
      user_id: userID,
      is_in_progress: 'False',
      icon_type: '',
      photo: null

    }
    let formData = new FormData();
    Object.entries(addISobj).forEach((entry) => {
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
      .post(BASE_URL + 'addIS', formData)
      .then((res) => {
        console.log("printing after ADD ", res);
        console.log("printing after ADD resullt", res.data.result);
        console.log("printing after ADD n ", updatedRows)
        updatedRows[index].instructionStepID = res.data.result;
        setInstructionSteps(updatedRows);
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
  const updateAT = (is, originalIS) => {
    var updateISobj = {
      audio: '',
      is_available: is.availableToUser === 'Yes' ? 'True' : 'False',
      is_complete: 'False',
      is_timed: originalIS.is_timed,
      photo_url: originalIS.photo_url,
      is_sequence: is.sequence,
      at_id: originalIS.at_id,
      is_in_progress: originalIS.is_in_progress,
      title: is.instructionStep,
      expected_completion_time: is.stepDuration,
      is_id: is.instructionStepID,
      user_id: userID,
      icon_type: '',
      photo: originalIS.is_photo
    }
    let formData = new FormData();
    Object.entries(updateISobj).forEach((entry) => {
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
      .post(BASE_URL + 'updateIS', formData)
      .then((res) => {
          console.log("printing updated");
          props.getUploadAck(updateISobj);
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
        {instructionSteps.map((row, index) => (
            <>
          <TableRow key={index}>
            <TableCell>
            {isRowBeingEdited(index) ? (
                <TextField
                value={instructionStep}
                onChange={(e) => setInstructionStep(e.target.value)}
                />
            ) : (
                row.instructionStep
            )}
            </TableCell>
            
            <TableCell>
            {isRowBeingEdited(index) ? (
                <TextField
                type="number"
                value={sequence}
                onChange={(e) => setSequence(e.target.value)}
                />
            ) : (
                row.sequence
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
                    setStepDuration(formattedDuration)
                  }
                  }
                /> 
                minutes
                </>
            ) : (
                row.stepDuration
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
                    <FontAwesomeIcon style={{margin:'4px'}} icon={faSave} size="lg" onClick={() => handleSaveRow(index)}/>
                ) : (
                    <FontAwesomeIcon style={{ margin: '4px' }} icon={faPen} onClick={() => handleEditRow(index)} />
                )}
                <FontAwesomeIcon style={{ margin: '4px' }} icon={faTrashAlt} onClick={() => handleDeleteRow(index)} />
              </TableCell>
              </TableRow>
                {/* {
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
                 */}
              </>
        ))}
      </TableBody>
      <TableFooter>
              {showAddRow && (
                <TableRow>
                    <TableCell>
                    <TextField
                        value={instructionStep}
                        onChange={(e) => setInstructionStep(e.target.value)}
                        />
                    </TableCell>
                    <TableCell>
                    <TextField
                        type="number"
                        value={sequence}
                        onChange={(e) => setSequence(e.target.value)}
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
                          setStepDuration(formattedDuration)
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
                    <FontAwesomeIcon style={{margin:'4px'}} icon={faSave} size="lg" onClick={() => handleSaveRow(instructionSteps.length)}/>
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

export default QuickEditIS;
