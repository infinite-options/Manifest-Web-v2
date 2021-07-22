import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import userContext from '../Home/userContext';
// import firebase from "./firebase";
// import { firestore } from "firebase";
import {
  ListGroup,
  Button,
  Row,
  Col,
  Modal,
  InputGroup,
  FormControl,
  Table,
} from 'react-bootstrap';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import AddNewGRItem from './addNewGRItem.jsx';
import AddNewATItem from './addNewATItem.jsx';
// import AddNewISItem from "./addNewISItem.jsx";
// import DeleteISItem from "./DeleteISItem.jsx";
// import ShowHistory from "./ShowHistory.jsx";
// import DeleteAT from "./deleteAT.jsx";
import DeleteGR from './deleteGR.jsx';
import EditGR from './editGR.jsx';
// import EditIS from "./editIS.jsx";
// import EditAT from "./EditAT.jsx";
// import ShowATList from "./ShowATList";
// import ShowISList from "./ShowISList";
// import MustDoAT from "./MustDoAT";
import EditIcon from './EditIcon.jsx';
import CopyIcon from './CopyIcon.jsx';
import CopyGR from './CopyGR.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import {
  faUser,
  faUserAltSlash,
  faTrophy,
  faRunning,
  faBookmark,
  faEdit,
  faList,
  faCopy,
  faAlignCenter,
  faBorderInner,
} from '@fortawesome/free-solid-svg-icons';
import WeekRoutines from './WeekRoutines';

// export default function App() {
//   const events = [{ title: "today's event", date: new Date() }];

//   return (
//     <div className="App">
//       <FullCalendar
//         initialView="timeGridWeek"
//         // defaultView="weekMode"
//         plugins={[timeGridPlugin]}
//         events={events}
//         allDaySlot={false}
//       />
//     </div>
//   );
// }
// import moment from "moment";

/**
 * Notes from Tyler:
 * 2/17/2020
 * TODOs:
 *
 * 1.Times from GR are not passed down to AT and times from AT are not passed
 * to IS
 *
 * 2.Clicking on the Goal and Routine at the top level should closed previous
 * AT and IS Modals.
 *
 *
 *
 */
// const userContext = React.createContext();

const FirebaseV2 = (props) => {
  const user = useContext(userContext);
  const routiness = props.routines;
  // console.log('props', props);
  // console.log('routiness', routiness);
  // console.log("asdfa", props.routines.length);

  const [stateValue, setStateValue] = useState({
    // firebaseRootPath: firebase
    //   .firestore()
    //   .collection("users")
    //   .doc(this.props.theCurrentUserID),
    is_sublist_available: true,
    showEditModal: false,
    showCopyModal: false,
    indexEditing: '',
    //This single GR item is passed to AddNewATItem to help processed the new item
    singleGR: {
      //everytime a goal/routine is clicked, we open a modal and the modal info will be provided by this object
      show: false, // Show the modal
      type: 'None',
      title: 'GR Name',
      photo: '',
      available_end_time: new Date(), //TODO get these used
      available_start_time: new Date(), //TODO get these used
      id: null,
      arr: [],
      fbPath: null,
    },

    grName: '',
    dataObj: {},
    isComplete: false,
    isInProgress: false,
    singleAT: {
      //for each action/task we click on, we open a new modal to show the steps/instructions affiliate
      //with the task
      show: false, // Show the model
      type: 'None', // Action or Task
      title: 'AT Name', //Title of action task ,
      available_end_time: new Date(), //TODO get these used
      available_start_time: new Date(), //TODO get these used
      photo: '',
      id: null, //id of Action Task
      arr: [], //array of instruction/steps formatted to display as a list
      fbPath: null, //Firebase direction to the arr
    },
    singleATitemArr: [], //temp fix for my bad memory of forgetting to add this in singleGR
    singleISitemArr: [], //temp fix for my bad memory of forgetting to add this in singleAT
    modalWidth: '390px',

    //Use to decided whether to show the respective modals
    addNewGRModalShow: false,
    historyViewShow: false,
    historyViewShowObject: null,
    historyItems: [],
    addNewATModalShow: false,
    addNewISModalShow: false,

    //used to determine thumbnail picture size
    thumbnailWidth: '150px',
    thumbnailHeight: '100px',
    thumbnailWidthV2: '200px',
    thumbnailHeightV2: '50px',

    //isRoutine is to check whether we clicked on add routine or add goal
    isRoutine: true,
    availabilityColorCode: '#D6A34C',

    //For setting default time for the AT Item
    timeSlotForAT: [],
    timeSlotForIS: [],

    routine_completed: false,

    AT_expected_completion_time: {},
    WentThroughATList: {},
  });

  // /**
  //  * refreshATItem:
  //  * Given a array, it will replace the current array of singleGR which holds the layout
  //  * list of all action task under it and singleATitemArr which just holds the raw data.
  //  *
  //  */
  const refreshATItem = (arr) => {
    // console.log("AT items after delete", arr);
    setStateValue((prevState) => {
      return {
        ...prevState,
        singleATitemArr: arr,
      };
    });

    let resArr = createListofAT(arr);
    let singleGR = stateValue.singleGR;
    // console.log("singleGR", singleGR.title, singleGR.arr);
    singleGR.arr = resArr;
    // console.log("After delete singleGR", singleGR.arr);
    setStateValue((prevState) => {
      return {
        ...prevState,
        singleGR: singleGR,
      };
    });
  };

  // /**
  //  *
  //  * refreshISItem - given A array item,
  //  * this method will take those items,
  //  * put it in the list form to present
  //  * as a list of instructions and the
  //  * it will also update the array of
  //  * the normal list of instructions with
  //  * the one passed in.
  //  */
  // refreshISItem = (arr) => {
  //   console.log("IS items after delete", arr);
  //   this.setState({
  //     singleISitemArr: arr,
  //   });
  //   console.log("All IS", arr);
  //   let resArr = this.createListofIS(arr);
  //   let singleAt = this.state.singleAT;
  //   console.log("Before delete singleAt", singleAt.title, singleAt.arr);
  //   singleAt.arr = resArr;
  //   console.log("After delete singleAt", singleAt.arr);
  //   this.setState({ singleAT: singleAt });
  // };

  // componentDidMount() {
  //   //Grab the
  //   // this.grabFireBaseRoutinesGoalsData();
  //   // console.log("going into compoent did mount");
  // }

  /**
   * grabFireBaseRoutinesGoalsData:
   * this function grabs the goals&routines array from the path located in this function
   * which will then populate the goals, routines,originalGoalsAndRoutineArr array
   * separately. The arrays will be used for display and data manipulation later.
   *
   */
  const grabFireBaseRoutinesGoalsData = () => {
    return props.grabFireBaseRoutinesGoalsData;
  };

  const formatDateTime = (str) => {
    let newTime = new Date(str).toLocaleTimeString();
    newTime = newTime.substring(0, 5) + ' ' + newTime.slice(-2);
    return newTime;
    /*
    const formattedStr = str;
    const time = moment(formattedStr);
    return time.format("YYYY MMM DD HH:mm");
    */
  };

  // //This function essentially grabs all action/tasks
  // //for the routine or goal passed in and pops open the
  // //modal for the action/task

  const GetATList = async (id, title, persist, tempGR) => {
    let url = props.BASE_URL + 'actionsTasks/';
    let triggerValue = true;
    triggerValue = !triggerValue;
    useEffect(() => {
      axios
        .get(url + id)
        .then((response) => {
          if (response.data.result && response.data.result.length > 0) {
            let x = response.data.result;

            for (let i = 0; i < x.length; ++i) {
              x[i].audio = x[i].audio || '';
              x[i].available_end_time = x[i].available_end_time || '';
              x[i].available_start_time = x[i].available_start_time || '';
              x[i].id = x[i].at_unique_id;

              x[i].is_available = x[i].is_available.toLowerCase() === 'true';
              x[i].is_complete = x[i].is_complete.toLowerCase() === 'true';
              x[i].is_in_progress =
                x[i].is_in_progress.toLowerCase() === 'true';
              x[i].is_must_do = x[i].is_must_do.toLowerCase() === 'true';
              x[i].is_sublist_available =
                x[i].is_sublist_available.toLowerCase() === 'true';
              x[i].is_timed = x[i].is_timed.toLowerCase() === 'true';
              x[i].title = x[i].at_title;
            }

            let singleGR = {
              //initialise without list to pass fbPath to child
              show: true,
              type: persist ? 'Routine' : 'Goal',
              title: title,
              id: id,
              arr: [], //array of current action/task in this singular Routine
              // fbPath: docRef,
            };

            setStateValue((prevState) => {
              return {
                ...prevState,
                singleGR: singleGR,
                singleATitemArr: x,
              };
            });
            // this.setState({
            //   singleGR: singleGR,
            //   singleATitemArr: x,
            // });
            let resArr = createListofAT(x);
            //assemble singleGR template here:

            singleGR = {
              show: true,
              type: persist ? 'Routine' : 'Goal',
              title: title,
              id: id,
              arr: resArr, //array of current action/task in this singular Routine
              // fbPath: docRef,
            };

            setStateValue((prevState) => {
              return {
                ...prevState,
                singleGR: singleGR,
              };
            });
            // this.setState({
            //   singleGR: singleGR,
            // });
            // console.log(this.state.singleATitemArr);
          } else {
            // console.log('there are  no action/tasks');
            // console.log(response.data);

            let singleGR = {
              //Variable to hold information about the parent Goal/ Routine
              show: true,
              type: persist ? 'Routine' : 'Goal',
              title: title,
              id: id,
              is_complete: tempGR.is_complete,
              is_in_progress: tempGR.is_in_progress,
              arr: [],
              // fbPath: docRef,
            };

            setStateValue((prevState) => {
              return {
                ...prevState,
                singleGR: singleGR,
                singleATitemArr: [],
              };
            });
            // this.setState({
            //   singleGR: singleGR,
            //   singleATitemArr: [],
            // });
          }
        })
        .catch((error) => {
          console.log('Error Occurred in Retrieving Action/Tasks' + error);
        });
    }, [triggerValue]);
  };

  // const getATList = async (id, title, persist, tempGR) => {
  //   let url = props.BASE_URL + 'actionsTasks/';

  //   axios
  //     .get(url + id)
  //     .then((response) => {
  //       if (response.data.result && response.data.result.length > 0) {
  //         let x = response.data.result;

  //         for (let i = 0; i < x.length; ++i) {
  //           x[i].audio = x[i].audio || '';
  //           x[i].available_end_time = x[i].available_end_time || '';
  //           x[i].available_start_time = x[i].available_start_time || '';
  //           x[i].id = x[i].at_unique_id;

  //           x[i].is_available = x[i].is_available.toLowerCase() === 'true';
  //           x[i].is_complete = x[i].is_complete.toLowerCase() === 'true';
  //           x[i].is_in_progress = x[i].is_in_progress.toLowerCase() === 'true';
  //           x[i].is_must_do = x[i].is_must_do.toLowerCase() === 'true';
  //           x[i].is_sublist_available =
  //             x[i].is_sublist_available.toLowerCase() === 'true';
  //           x[i].is_timed = x[i].is_timed.toLowerCase() === 'true';
  //           x[i].title = x[i].at_title;
  //         }

  //         let singleGR = {
  //           //initialise without list to pass fbPath to child
  //           show: true,
  //           type: persist ? 'Routine' : 'Goal',
  //           title: title,
  //           id: id,
  //           arr: [], //array of current action/task in this singular Routine
  //           // fbPath: docRef,
  //         };

  //         setStateValue((prevState) => {
  //           return {
  //             ...prevState,
  //             singleGR: singleGR,
  //             singleATitemArr: x,
  //           };
  //         });
  //         // this.setState({
  //         //   singleGR: singleGR,
  //         //   singleATitemArr: x,
  //         // });
  //         let resArr = createListofAT(x);
  //         //assemble singleGR template here:

  //         singleGR = {
  //           show: true,
  //           type: persist ? 'Routine' : 'Goal',
  //           title: title,
  //           id: id,
  //           arr: resArr, //array of current action/task in this singular Routine
  //           // fbPath: docRef,
  //         };

  //         setStateValue((prevState) => {
  //           return {
  //             ...prevState,
  //             singleGR: singleGR,
  //           };
  //         });
  //         // this.setState({
  //         //   singleGR: singleGR,
  //         // });
  //         // console.log(this.state.singleATitemArr);
  //       } else {
  //         console.log('there are  no action/tasks');
  //         console.log(response.data);

  //         let singleGR = {
  //           //Variable to hold information about the parent Goal/ Routine
  //           show: true,
  //           type: persist ? 'Routine' : 'Goal',
  //           title: title,
  //           id: id,
  //           is_complete: tempGR.is_complete,
  //           is_in_progress: tempGR.is_in_progress,
  //           arr: [],
  //           // fbPath: docRef,
  //         };

  //         setStateValue((prevState) => {
  //           return {
  //             ...prevState,
  //             singleGR: singleGR,
  //             singleATitemArr: [],
  //           };
  //         });
  //         // this.setState({
  //         //   singleGR: singleGR,
  //         //   singleATitemArr: [],
  //         // });
  //       }
  //     })
  //     .catch((error) => {
  //       console.log('Error Occurred in Retrieving Action/Tasks' + error);
  //     });
  // };

  // //Creates a array of all actions/task for get getATList function
  // //getATList stands for get all action/task
  const createListofAT = (A) => {
    let res = [];
    for (let i = 0; i < A.length; i++) {
      if (!A[i]['id'] || !A[i]['title']) {
        return [];
      }
      let tempID = A[i]['id'];
      let tempPhoto = A[i]['photo'];
      let tempTitle = A[i]['title'];
      let tempAvailable = A[i]['is_available'];
      let is_sublist_available = A[i]['is_sublist_available'];
      // console.log("in createlist")
      // console.log(this.state.timeSlotForAT)
      // console.log(this.state.singleATitemArr)

      res.push(
        <div key={'AT' + i}>
          <ListGroup.Item
            action
            onClick={() => {
              // Disable IS layer
              ATonClickEvent(tempTitle, tempID);
            }}
            variant="light"
            style={{ marginBottom: '3px' }}
          >
            <Row
              style={{ margin: '0', marginBottom: '10px' }}
              className="d-flex flex-row-center"
            >
              <Col>
                <div className="fancytext">{tempTitle}</div>
              </Col>
            </Row>

            {tempPhoto ? (
              <Row>
                <Col
                  xs={7}
                  // sm="auto"
                  // md="auto"
                  // lg="auto"
                  style={{ paddingRight: '0px' }}
                >
                  <img
                    src={tempPhoto}
                    alt="Action/Task"
                    className="center"
                    height="80px"
                    width="auto"
                  />
                </Col>
                <Col style={{ paddingLeft: '0px' }}>
                  <Row style={{ marginTop: '10px' }}>
                    {tempAvailable ? (
                      <div style={{ marginLeft: '5px' }}>
                        <FontAwesomeIcon
                          title="Available to User"
                          // style={{ color: stateValue.availabilityColorCode }}
                          onClick={(e) => {
                            e.stopPropagation();
                            alert('Item Is Availble to User');
                          }}
                          icon={faUser}
                          size="lg"
                        />{' '}
                      </div>
                    ) : (
                      <div>
                        <FontAwesomeIcon
                          title="Unavailable to User"
                          style={{ color: '#000000' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            alert('Item Is NOT Availble to User');
                          }}
                          icon={faUserAltSlash}
                          size="lg"
                        />
                      </div>
                    )}
                    {/* <ShowISList
                      BASE_URL={props.BASE_URL}
                      Index={i}
                      Array={stateValue.singleATitemArr}
                      Path={stateValue.singleGR.fbPath}
                    />

                    <MustDoAT
                      BASE_URL={props.BASE_URL}
                      Index={i}
                      Array={stateValue.singleATitemArr}
                      SingleAT={stateValue.singleATitemArr[i]}
                      Path={stateValue.singleGR.fbPath}
                    /> */}

                    {is_sublist_available ? (
                      <div>
                        <FontAwesomeIcon
                          icon={faList}
                          title="SubList Available"
                          style={{ color: '#D6A34C', marginLeft: '20px' }}
                          size="lg"
                        />
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </Row>

                  <Row style={{ marginTop: '15px', marginBottom: '10px' }}>
                    {/* <DeleteAT
                      BASE_URL={props.BASE_URL}
                      deleteIndex={i}
                      type={"actions&tasks"}
                      Array={stateValue.singleATitemArr} //Holds the raw data for all the is in the single action
                      Item={stateValue.singleGR} //holds complete data for action task: fbPath, title, etc
                      refresh={refreshATItem}
                      refreshGR={grabFireBaseRoutinesGoalsData}
                      updateNewWentThroughATDelete={handleWentThroughATListObj}
                    />
                    <EditAT
                      BASE_URL={props.BASE_URL}
                      marginLeftV="-170px"
                      i={i} //index to edit
                      timeSlot={stateValue.timeSlotForAT}
                      ATArray={stateValue.singleATitemArr} //Holds the raw data for all the is in the single action
                      FBPath={stateValue.singleGR.fbPath} //holds the path to the array data
                      refresh={refreshATItem} //function to refresh AT data
                      updateWentThroughATListObj={
                        this.handleWentThroughATListObj
                      }
                      currentUserId={this.props.theCurrentUserID}
                    /> */}
                  </Row>
                </Col>
              </Row>
            ) : (
              <div>
                <Row style={{ marginLeft: '100px' }} className="d-flex ">
                  {tempAvailable ? (
                    <div style={{ marginLeft: '5px' }}>
                      <FontAwesomeIcon
                        title="Available to the user"
                        style={{ color: stateValue.availabilityColorCode }}
                        onClick={(e) => {
                          e.stopPropagation();
                          alert('Item Is Availble to the user');
                        }}
                        icon={faUser}
                        size="lg"
                      />{' '}
                    </div>
                  ) : (
                    <div>
                      <FontAwesomeIcon
                        title="Unavailable to the user"
                        style={{ color: '#000000' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          alert('Item Is NOT Availble to the user');
                        }}
                        icon={faUserAltSlash}
                        size="lg"
                      />
                    </div>
                  )}
                  {/* <ShowISList
                    BASE_URL={props.BASE_URL}
                    Index={i}
                    Array={stateValue.singleATitemArr}
                    Path={stateValue.singleGR.fbPath}
                  />
                  <MustDoAT
                    BASE_URL={props.BASE_URL}
                    Index={i}
                    Array={stateValue.singleATitemArr}
                    SingleAT={stateValue.singleATitemArr[i]}
                    Path={stateValue.singleGR.fbPath}
                  /> */}

                  {is_sublist_available ? (
                    <div>
                      <FontAwesomeIcon
                        icon={faList}
                        title="SubList Available"
                        style={{ color: '#D6A34C', marginLeft: '20px' }}
                        size="lg"
                      />
                    </div>
                  ) : (
                    <div></div>
                  )}
                </Row>
                <Row
                  style={{ marginTop: '15px', marginLeft: '100px' }}
                  className="d-flex "
                >
                  {/* <DeleteAT
                    BASE_URL={props.BASE_URL}
                    deleteIndex={i}
                    type={"actions&tasks"}
                    refreshGR={grabFireBaseRoutinesGoalsData}
                    Array={stateValuesingleATitemArr} //Holds the raw data for all the is in the single action
                    Item={stateValuesingleGR} //holds complete data for action task: fbPath, title, etc
                    refresh={refreshATItem}
                    updateNewWentThroughATDelete={handleWentThroughATListObj}
                  />
                  <EditAT
                    BASE_URL={props.BASE_URL}
                    marginLeftV="-130px"
                    i={i} //index to edit
                    ATArray={stateValue.singleATitemArr} //Holds the raw data for all the is in the single action
                    FBPath={stateValue.singleGR.fbPath} //holds the path to the array data
                    refresh={refreshATItem} //function to refresh AT data
                    updateWentThroughATListObj={handleWentThroughATListObj}
                    currentUserId={props.theCurrentUserID}
                  /> */}
                </Row>
              </div>
            )}
          </ListGroup.Item>
        </div>
      );
    }
    return res;
  };

  const handleWentThroughATListObj = (id) => {
    let WentThroughOjt = stateValue.WentThroughATList;
    WentThroughOjt[id] = false;
    setStateValue((prevState) => {
      return {
        ...prevState,
        WentThroughATList: WentThroughOjt,
      };
    });
  };
  /**
   * takes the list of steps/instructions and returns
   * it in the form of a ListGroup for presentation
   */
  // createListofIS = (A) => {
  //   let res = [];
  //   for (let i = 0; i < A.length; i++) {
  //     let tempPhoto = A[i]["photo"];
  //     console.log("In create list", tempPhoto);
  //     let tempTitle = A[i]["title"];
  //     let tempAvailable = A[i]["is_available"];
  //     let sequence = A[i]["is_sequence"];

  //     res.push(
  //       <div key={"IS" + i} style={{ width: "100%" }}>
  //         <ListGroup.Item
  //           action
  //           onClick={() => {
  //             this.ISonClickEvent(tempTitle);
  //           }}
  //           variant="light"
  //           style={{ width: "100%", marginBottom: "3px" }}
  //         >
  //           <Row
  //             style={{ margin: "0", marginBottom: "10px" }}
  //             className="d-flex flex-row-center"
  //           >
  //             <Col>
  //               <div className="fancytext">{tempTitle}</div>
  //             </Col>
  //           </Row>
  //           {tempPhoto ? (
  //             <Row>
  //               <Col xs={7} style={{ paddingRight: "0px" }}>
  //                 <img
  //                   src={tempPhoto}
  //                   alt="Action/Task"
  //                   className="center"
  //                   height="80px"
  //                   width="auto"
  //                 />
  //               </Col>
  //               <Col style={{ paddingLeft: "0px" }}>
  //                 <Row style={{ marginTop: "10px" }}>
  //                   {tempAvailable ? (
  //                     <div style={{ marginLeft: "5px" }}>
  //                       <FontAwesomeIcon
  //                         title="Available to the user"
  //                         style={{ color: this.state.availabilityColorCode }}
  //                         onClick={(e) => {
  //                           e.stopPropagation();
  //                           alert("Item Is Availble to the user");
  //                         }}
  //                         icon={faUser}
  //                         size="lg"
  //                       />{" "}
  //                     </div>
  //                   ) : (
  //                     <div>
  //                       <FontAwesomeIcon
  //                         title="Unavailable to the user"
  //                         style={{ color: "#000000" }}
  //                         onClick={(e) => {
  //                           e.stopPropagation();
  //                           alert("Item Is NOT Availble to the user");
  //                         }}
  //                         icon={faUserAltSlash}
  //                         size="lg"
  //                       />
  //                     </div>
  //                   )}
  //                   <div style={{ marginLeft: "20px" }} className="fancytext">
  //                     {sequence}
  //                   </div>
  //                 </Row>
  //                 <Row style={{ marginTop: "15px", marginBottom: "10px" }}>
  //                   <DeleteISItem
  //                     BASE_URL={this.props.BASE_URL}
  //                     deleteIndex={i}
  //                     Array={this.state.singleATitemArr}
  //                     ISArray={this.state.singleISitemArr} //Holds the raw data for all the is in the single action
  //                     ISItem={this.state.singleAT} //holds complete data for action task: fbPath, title, etc
  //                     refresh={this.refreshISItem}
  //                     refreshAT={this.refreshATItem}
  //                     updateNewWentThroughISDelete={
  //                       this.handleWentThroughATListObj
  //                     }
  //                   />

  //                   <EditIS
  //                     BASE_URL={this.props.BASE_URL}
  //                     marginLeftV="-170px"
  //                     timeSlot={this.state.timeSlotForAT}
  //                     i={i} //index to edit
  //                     ISArray={this.state.singleISitemArr} //Holds the raw data for all the is in the single action
  //                     FBPath={this.state.singleAT.fbPath} //holds the fbPath to arr to be updated
  //                     refresh={this.refreshISItem} //function to refresh IS data
  //                     updateWentThroughATListObjIS={
  //                       this.handleWentThroughATListObj
  //                     }
  //                   />
  //                 </Row>
  //               </Col>
  //             </Row>
  //           ) : (
  //             <div>
  //               <Row style={{ marginLeft: "100px" }} className="d-flex ">
  //                 {tempAvailable ? (
  //                   <div style={{ marginLeft: "5px" }}>
  //                     <FontAwesomeIcon
  //                       title="Available to the user"
  //                       style={{ color: this.state.availabilityColorCode }}
  //                       onClick={(e) => {
  //                         e.stopPropagation();
  //                         alert("Item Is Availble to the user");
  //                       }}
  //                       icon={faUser}
  //                       size="lg"
  //                     />{" "}
  //                   </div>
  //                 ) : (
  //                   <div>
  //                     <FontAwesomeIcon
  //                       title="Unavailable to the user"
  //                       style={{ color: "#000000" }}
  //                       onClick={(e) => {
  //                         e.stopPropagation();
  //                         alert("Item Is NOT Availble to the user");
  //                       }}
  //                       icon={faUserAltSlash}
  //                       size="lg"
  //                     />
  //                   </div>
  //                 )}
  //                 <div style={{ marginLeft: "20px" }} className="fancytext">
  //                   {sequence}
  //                 </div>

  //                 {/* <ShowATList /> */}
  //               </Row>
  //               <Row
  //                 style={{ marginTop: "15px", marginLeft: "100px" }}
  //                 className="d-flex "
  //               >
  //                 <DeleteISItem
  //                   BASE_URL={this.props.BASE_URL}
  //                   deleteIndex={i}
  //                   Array={this.state.singleATitemArr}
  //                   ISArray={this.state.singleISitemArr} //Holds the raw data for all the is in the single action
  //                   ISItem={this.state.singleAT} //holds complete data for action task: fbPath, title, etc
  //                   refresh={this.refreshISItem}
  //                   refreshAT={this.refreshATItem}
  //                   updateNewWentThroughISDelete={
  //                     this.handleWentThroughATListObj
  //                   }
  //                 />

  //                 <EditIS
  //                   BASE_URL={this.props.BASE_URL}
  //                   marginLeftV="-130px"
  //                   i={i} //index to edit
  //                   ISArray={this.state.singleISitemArr} //Holds the raw data for all the is in the single action
  //                   FBPath={this.state.singleAT.fbPath} //holds the fbPath to arr to be updated
  //                   refresh={this.refreshISItem} //function to refresh IS data
  //                   updateWentThroughATListObjIS={
  //                     this.handleWentThroughATListObj
  //                   }
  //                 />
  //               </Row>
  //             </div>
  //           )}
  //         </ListGroup.Item>
  //       </div>
  //     );
  //   }
  //   return res;
  // };

  const ISonClickEvent = (title) => {
    console.log('Inside IS Click ' + title);
  };

  /**
   * Retrieve parent goal's start time and end time and use them for it's ATItem
   */
  const setTimeSlot = async (id, tempGR) => {
    // console.log("in setTimeSlot")
    // console.log(tempGR)

    let start_day_and_time = new Date(tempGR.start_day_and_time).toString();
    let end_day_and_time = new Date(tempGR.end_day_and_time).toString();

    let timeSlot = [
      start_day_and_time.split(' ')[4],
      end_day_and_time.split(' ')[4],
    ];

    setStateValue((prevState) => {
      return {
        ...prevState,
        timeSlotForAT: timeSlot,
      };
    });
    // this.setState({ timeSlotForAT: timeSlot });
  };

  /**
   * In this function we are passed in the id title and persist property of the incoming routine/goal
   * and we need to make return a viewable list of all the actions/tasks for this routine/goal
   * which is done in getATList function
   */
  const GRonClickEvent = async (title, id, persist, tempGR) => {
    // console.log(title, id, persist)
    await setTimeSlot(id, tempGR);
    GetATList(id, title, persist, tempGR);
    // console.log("GRonClickEvent", id, title, persist);
  };

  /**
   * we are passed in the action/task id and title
   * and we will need to grab all steps/Instructions related to this action/task,
   *
   */
  const ATonClickEvent = (title, id) => {
    getISList(id, title);
  };

  const getISList = async (id, title) => {
    let url = props.BASE_URL + 'instructionsSteps/';

    axios
      .get(url + id)
      .then((response) => {
        if (response.data.result && response.data.result.length > 0) {
          let x = response.data.result;

          for (let i = 0; i < x.length; ++i) {
            x[i].id = x[i].unique_id;
            x[i].is_available = x[i].is_available.toLowerCase() === 'true';
            x[i].is_complete = x[i].is_complete.toLowerCase() === 'true';
            x[i].is_in_progress = x[i].is_in_progress.toLowerCase() === 'true';
            x[i].is_timed = x[i].is_timed.toLowerCase() === 'true';
            x[i].title = x[i].title;
            x[i].is_sequence = x[i].is_sequence;
          }

          let singleAT = {
            //initialise without list to pass fbPath to child
            show: true,
            title: title,
            id: id,
            arr: [], //array of current action/task in this singular Routine
            // fbPath: docRef,
          };

          setStateValue((prevState) => {
            return {
              ...prevState,
              singleAT: singleAT,
              singleISitemArr: x,
            };
          });

          // this.setState({
          //   singleAT: singleAT,
          //   singleISitemArr: x,
          // });
          // let resArr = createListofIS(x);
          //assemble singleGR template here:

          singleAT = {
            show: true,
            title: title,
            id: id,
            // arr: resArr, //array of current action/task in this singular Routine
            // fbPath: docRef,
          };

          setStateValue((prevState) => {
            return {
              ...prevState,
              singleAT: singleAT,
            };
          });
          // this.setState({
          //   singleAT: singleAT,
          // });
          // console.log(this.state.singleATitemArr);
        } else {
          console.log('there are  no instructions/steps');
          console.log(response.data);

          let singleAT = {
            //Variable to hold information about the parent Goal/ Routine
            show: true,
            title: title,
            id: id,

            arr: [],
            // fbPath: docRef,
          };
          setStateValue((prevState) => {
            return {
              ...prevState,
              singleAT: singleAT,
              singleISitemArr: [],
            };
          });
          // this.setState({
          //   singleAT: singleAT,
          //   singleISitemArr: [],
          // });
        }
      })
      .catch((error) => {
        console.log('Error Occurred in Retrieving Instructions/Steps' + error);
      });
  };

  /**
   * findIndexByID:
   * given a id, it will loop through the original goals and routine array to
   * return the index with the corresonding id
   */
  const findIndexByID = (id) => {
    let originalGoalsAndRoutineArr = props.originalGoalsAndRoutineArr;
    for (let i = 0; i < originalGoalsAndRoutineArr.length; i++) {
      if (id === originalGoalsAndRoutineArr[i].id) {
        return i;
      }
    }
    return -1;
  };

  // check_routineCompleted = (theCurrentUserID, rountineID) => {
  //   let result = firebase
  //     .firestore()
  //     .collection("users")
  //     .doc(theCurrentUserID)
  //     .collection("goals&routines")
  //     .doc(rountineID)
  //     .get()
  //     .then((docs) => {
  //       return docs.data()["completed"];
  //     })
  //     .catch((error) => {
  //       console.log("cannot access file.");
  //       return false;
  //     });
  // };

  const redirectToCal = (propsy) => {
    <div>
      {console.log('redirectToCal', propsy)}
      <WeekRoutines propsy={propsy} />
    </div>;
  };

  const getRoutines = () => {
    let displayRoutines = [];
    console.log('length', props.routines.length);
    if (props.routines.length !== 0) {
      //Check to make sure routines exists

      for (let i = 0; i < props.routines.length; i++) {
        let tempTitle = props.routines[i]['title'];
        let tempID = props.routines[i]['id'];
        let tempPersist = props.routines[i]['is_persistent'];
        let tempGR = props.routines[i];
        let date = moment(props.routines[i]['end_day_and_time']).format(
          'MM/DD/YYYY'
        );

        displayRoutines.push(
          <div key={'test0' + i}>
            <ListGroup horizontal>
              {/* -----------------------------------Profile Picture----------------------------------- */}
              {props.routines[i]['is_available'] ? (
                <div style={{ marginLeft: '5px' }}>
                  <FontAwesomeIcon
                    title="Available to the user"
                    style={{
                      color: stateValue.availabilityColorCode,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('Item Is Availble to the user');
                    }}
                    icon={faUser}
                    size="lg"
                  />
                </div>
              ) : (
                <div>
                  <FontAwesomeIcon
                    title="Unavailable to the user"
                    style={{ color: '#000000' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('Item Is NOT Availble to the user');
                    }}
                    icon={faUserAltSlash}
                    size="lg"
                  />
                </div>
              )}
              {props.routines[i]['is_sublist_available'] ? (
                <div>
                  <FontAwesomeIcon
                    icon={faList}
                    title="SubList Available"
                    style={{ color: '#D6A34C', marginLeft: '20px' }}
                    // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShow: false}); this.editFirBaseFalse()}}
                    //onClick={this.ListFalse}
                    size="lg"
                  />
                </div>
              ) : (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setStateValue((prevState) => {
                      return {
                        ...prevState,
                        iconShowATModal: false,
                      };
                    });
                    // this.setState({ iconShowATModal: false });
                  }}
                ></div>
              )}
              {/* -----------------------------------Delete Icon----------------------------------- */}

              <DeleteGR
                BASE_URL={props.BASE_URL}
                deleteIndex={findIndexByID(tempID)}
                Array={props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                // Path={firebase
                //   .firestore()
                //   .collection("users")
                //   .doc(this.props.theCurrentUserID)}
                refresh={grabFireBaseRoutinesGoalsData}
                theCurrentUserId={props.theCurrentUserID}
                theCurrentTAID={props.theCurrentTAID}
              />
              {/* -----------------------------------Copy Icon----------------------------------- */}
              <CopyIcon
                openCopyModal={() => {
                  setStateValue((prevState) => {
                    return {
                      ...prevState,
                      showCopyModal: true,
                      indexEditing: findIndexByID(tempID),
                    };
                  });
                  // this.setState({
                  //   showCopyModal: true,
                  //   indexEditing: this.findIndexByID(tempID),
                  // });
                }}
                indexEditing={stateValue.indexEditing}
                i={findIndexByID(tempID)} //index to edit
                showModal={stateValue.showCopyModal}
              />
            </ListGroup>
            {/* -----------------------------------List Group----------------------------------- */}
            {/* <Col xs={{ order: 'first' }}> */}
            <ListGroup.Item
              action
              onClick={() => {
                {
                  console.log('clicked on individual Routine', tempTitle);
                  // <WeekRoutines
                  //   propsy={tempTitle}
                  //   tempID={tempID}
                  //   tempPerist={tempPersist}
                  //   tempGR={tempGR}
                  // />;
                  // {
                  //   redirectToCal(tempTitle);
                  // }
                }
                // GRonClickEvent(tempTitle, tempID, tempPersist, tempGR);
              }}
              variant="light"
              style={{ marginBottom: '3px', borderRadius: '25px' }}
              className="root"
            >
              <Row>
                {props.routines[i]['start_day_and_time'] &&
                props.routines[i]['end_day_and_time'] ? (
                  <Col
                    style={{
                      marginTop: '3px',
                      fontSize: '15px',
                      paddingRight: '0px',
                      paddingLeft: '0px',
                      marginLeft: '10px',
                    }}
                  >
                    {formatDateTime(props.routines[i]['start_day_and_time'])}
                    {' - ' +
                      formatDateTime(props.routines[i]['end_day_and_time'])}
                  </Col>
                ) : (
                  <Col> </Col>
                )}
                {/* {props.routines[i]['end_day_and_time'] ? (
                  <Col
                    xs={6}
                    style={{
                      fontSize: '12px',
                      paddingLeft: '0px',
                      paddingRight: '0px',
                    }}
                  >
                    {' - ' +
                      formatDateTime(props.routines[i]['end_day_and_time'])}
                  </Col>
                ) : (
                  <Col> </Col>
                )} */}
              </Row>

              <Row
                style={{ margin: '0', marginBottom: '10px' }}
                className="d-flex flex-row-center"
              >
                <Col
                  style={{
                    fontSize: '28px',
                    textDecorationLine: 'underline',
                  }}
                >
                  <div className="fancytext">
                    {props.routines[i]['title']}
                    <Col></Col>
                    {/* ({date}) */}
                  </div>
                </Col>
              </Row>
              {props.routines[i]['photo'] ? (
                <div>
                  {/* // <Row> */}
                  {/* <CopyIcon
                      openCopyModal={() => {
                        setStateValue((prevState) => {
                          return {
                            ...prevState,
                            showCopyModal: true,
                            indexEditing: findIndexByID(tempID),
                          };
                        });
                        // this.setState({
                        //   showCopyModal: true,
                        //   indexEditing: this.findIndexByID(tempID),
                        // });
                      }}
                      indexEditing={stateValue.indexEditing}
                      i={findIndexByID(tempID)} //index to edit
                      showModal={stateValue.showCopyModal}
                    /> */}
                  {/* <Col xs={7} style={{ paddingRight: '0px' }}>
                      <img
                        src={props.routines[i]['photo']}
                        alt="Routines"
                        className="center"
                        height="80px"
                        width="auto"
                      />
                    </Col> */}
                  {/* <Col style={{ paddingLeft: '0px' }}> */}
                  {/* <Row style={{ marginTop: '10px' }}> */}
                  {/* {props.routines[i]['is_available'] ? (
                          <div style={{ marginLeft: '5px' }}>
                            <FontAwesomeIcon
                              title="Available to the user"
                              style={{
                                color: stateValue.availabilityColorCode,
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                alert('Item Is Availble to the user');
                              }}
                              icon={faUser}
                              size="lg"
                            />
                          </div>
                        ) : (
                          <div>
                            <FontAwesomeIcon
                              title="Unavailable to the user"
                              style={{ color: '#000000' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                alert('Item Is NOT Availble to the user');
                              }}
                              icon={faUserAltSlash}
                              size="lg"
                            />
                          </div>
                        )}
                        {props.routines[i]['is_sublist_available'] ? (
                          <div>
                            <FontAwesomeIcon
                              icon={faList}
                              title="SubList Available"
                              style={{ color: '#D6A34C', marginLeft: '20px' }}
                              // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShow: false}); this.editFirBaseFalse()}}
                              //onClick={this.ListFalse}
                              size="lg"
                            />
                          </div>
                        ) : (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setStateValue((prevState) => {
                                return {
                                  ...prevState,
                                  iconShowATModal: false,
                                };
                              });
                              // this.setState({ iconShowATModal: false });
                            }}
                          ></div>
                        )} */}
                  {/* </Row> */}
                  {/* <Row style={{ marginTop: '15px', marginBottom: '10px' }}> */}
                  {/* <DeleteGR
                          BASE_URL={props.BASE_URL}
                          deleteIndex={findIndexByID(tempID)}
                          Array={props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                          // Path={firebase
                          //   .firestore()
                          //   .collection("users")
                          //   .doc(this.props.theCurrentUserID)}
                          refresh={grabFireBaseRoutinesGoalsData()}
                          theCurrentUserId={props.theCurrentUserID}
                          theCurrentTAID={props.theCurrentTAID}
                        /> */}
                  {/* <EditIcon
                          openEditModal={() => {
                            setStateValue((prevState) => {
                              return {
                                showEditModal: true,
                                indexEditing: findIndexByID(tempID),
                              };
                            });
                          }}
                          showModal={stateValue.showEditModal}
                          indexEditing={stateValue.indexEditing}
                          i={this.findIndexByID(tempID)} //index to edit
                          ATArray={props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                          // FBPath={firebase
                          //   .firestore()
                          //   .collection("users")
                          //   .doc(this.props.theCurrentUserID)}
                          refresh={grabFireBaseRoutinesGoalsData()}
                        /> */}
                  {/* <Col>
                          <CopyIcon
                            openCopyModal={() => {
                              setStateValue((prevState) => {
                                return {
                                  ...prevState,
                                  showCopyModal: true,
                                  indexEditing: findIndexByID(tempID),
                                };
                              });
                              // this.setState({
                              //   showCopyModal: true,
                              //   indexEditing: this.findIndexByID(tempID),
                              // });
                            }}
                            indexEditing={stateValue.indexEditing}
                            i={findIndexByID(tempID)} //index to edit
                            showModal={stateValue.showCopyModal}
                          />
                        </Col> */}
                  {/* </Row> */}
                  {/* </Col> */}
                  {/* // </Row> */}
                  {/* <Row> */}
                  {/* <EditGR
                      BASE_URL={this.props.BASE_URL}
                      closeEditModal={() => {
                        this.setState({ showEditModal: false });
                        this.props.updateFBGR();
                      }}
                      showModal={this.state.showEditModal}
                      indexEditing={this.state.indexEditing}
                      i={this.findIndexByID(tempID)} //index to edit
                      ATArray={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                      // FBPath={firebase
                      //   .firestore()
                      //   .collection("users")
                      //   .doc(this.props.theCurrentUserID)}
                      refresh={this.grabFireBaseRoutinesGoalsData} //function to refresh IS data
                      theCurrentUserId={this.props.theCurrentUserID}
                      theCurrentTAID={this.props.theCurrentTAID}

                      // chnagePhoto = {this.changePhotoIcon()}
                    /> */}
                  {/* </Row> */}
                </div>
              ) : (
                <div>
                  <Row>
                    {props.routines[i]['is_available'] ? (
                      <div style={{ marginLeft: '5px' }}>
                        <FontAwesomeIcon
                          title="Available to the user"
                          style={{ color: props.availabilityColorCode }}
                          onClick={(e) => {
                            e.stopPropagation();
                            alert('Item Is Availble to the user');
                          }}
                          icon={faUser}
                          size="lg"
                        />{' '}
                      </div>
                    ) : (
                      <div>
                        <FontAwesomeIcon
                          title="Unavailable to the user"
                          style={{ color: '#000000' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            alert('Item Is NOT Availble to the user');
                          }}
                          icon={faUserAltSlash}
                          size="lg"
                        />
                      </div>
                    )}
                    {props.routines[i]['is_sublist_available'] ? (
                      <div>
                        <FontAwesomeIcon
                          icon={faList}
                          title="SubList Available"
                          style={{ color: '#D6A34C', marginLeft: '20px' }}
                          // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShow: false}); this.editFirBaseFalse()}}
                          //onClick={this.ListFalse}
                          size="lg"
                        />
                      </div>
                    ) : (
                      <div
                      // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShowATModal: false})}}>
                      ></div>
                    )}
                  </Row>
                  {/* <Row
                    style={{ marginTop: '15px', marginLeft: '100px' }}
                    className="d-flex "
                  > */}
                  {/* <DeleteGR
                      BASE_URL={props.BASE_URL}
                      deleteIndex={findIndexByID(tempID)}
                      Array={props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                      // Path={this.state.firebaseRootPath} //holds complete data for action task: fbPath, title, etc
                      // Path={firebase
                      //   .firestore()
                      //   .collection("users")
                      //   .doc(this.props.theCurrentUserID)}
                      refresh={grabFireBaseRoutinesGoalsData}
                      theCurrentUserId={props.theCurrentUserID}
                      theCurrentTAID={props.theCurrentTAID}
                    /> */}
                  {/* <EditIcon
                      openEditModal={() => {
                        this.setState({
                          showEditModal: true,
                          indexEditing: this.findIndexByID(tempID),
                        });
                      }}
                      showModal={this.state.showEditModal}
                      indexEditing={this.state.indexEditing}
                      i={this.findIndexByID(tempID)} //index to edit
                      ATArray={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                      // FBPath={firebase
                      //   .firestore()
                      //   .collection("users")
                      //   .doc(this.props.theCurrentUserID)}
                      refresh={this.grabFireBaseRoutinesGoalsData}
                    /> */}
                  {/* </Row> */}
                  {/* <Row> */}
                  {/* <EditGR
                      BASE_URL={this.props.BASE_URL}
                      closeEditModal={() => {
                        this.setState({ showEditModal: false });
                        this.props.updateFBGR();
                      }}
                      showModal={this.state.showEditModal}
                      indexEditing={this.state.indexEditing}
                      i={this.findIndexByID(tempID)} //index to edit
                      ATArray={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                      // FBPath={firebase
                      //   .firestore()
                      //   .collection("users")
                      //   .doc(this.props.theCurrentUserID)}
                      refresh={this.grabFireBaseRoutinesGoalsData} //function to refresh IS data
                      theCurrentUserId={this.props.theCurrentUserID}
                      theCurrentTAID={this.props.theCurrentTAID}
                    /> */}
                  {/* </Row> */}
                </div>
              )}
              <Row>
                <CopyGR
                  BASE_URL={props.BASE_URL}
                  indexEditing={stateValue.indexEditing}
                  i={findIndexByID(tempID)}
                  closeCopyModal={() => {
                    setStateValue((prevState) => {
                      return {
                        ...prevState,
                        showCopyModal: false,
                      };
                    });
                  }}
                  showModal={stateValue.showCopyModal}
                  title={tempTitle}
                  gr_id={tempID}
                  ATArray={props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                  refresh={grabFireBaseRoutinesGoalsData}
                  theCurrentUserId={props.theCurrentUserID}
                  theCurrentTAID={props.theCurrentTAID}
                />
              </Row>
              {/* <Row>
                {props.routines[i]['start_day_and_time'] ? (
                  <Col
                    style={{
                      marginTop: '3px',
                      fontSize: '12px',
                      paddingRight: '0px',
                      paddingLeft: '0px',
                      marginLeft: '10px',
                    }}
                  >
                    {'Start Time: ' +
                      formatDateTime(props.routines[i]['start_day_and_time'])}
                  </Col>
                ) : (
                  <Col> </Col>
                )}
                {props.routines[i]['end_day_and_time'] ? (
                  <Col
                    xs={6}
                    style={{
                      fontSize: '12px',
                      paddingLeft: '0px',
                      paddingRight: '0px',
                    }}
                  >
                    {'End Time: ' +
                      formatDateTime(props.routines[i]['end_day_and_time'])}
                  </Col>
                ) : (
                  <Col> </Col>
                )}
              </Row> */}
              {/* <Row>
                {props.showRoutine &&
                  (stateValue.WentThroughATList[tempID] === false ||
                    stateValue.WentThroughATList[tempID] === undefined)}

                <Col
                  style={{
                    paddingRight: '0px',
                    paddingLeft: '0px',
                    marginLeft: '10px',
                  }}
                >
                  {showRoutineRepeatStatus(i)}
                </Col>

                <Col xs={6} style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                  {thisTakesMeGivenVsSelected(i, tempID)}
                </Col>
              </Row> */}
            </ListGroup.Item>
            {/* </Col> */}
          </div>
        );
      }
    }
    return displayRoutines;
  };
  // console.log('thingy', stateValue.AT_expected_completion_time);

  const thisTakesMeGivenVsSelected = (i, id) => {
    if (stateValue.AT_expected_completion_time[id] === '0') {
      return (
        <div style={{ fontSize: '12px' }}>
          Takes
          {convertToMinutes(props.routines[i]['expected_completion_time'])}
        </div>
      );
    } else {
      return (
        <div style={{ fontSize: '12px' }}>
          Takes
          {convertToMinutes(props.routines[i]['expected_completion_time'])} min
          vs {stateValue.AT_expected_completion_time[id]} (calc)
        </div>
      );
    }
  };

  const convertToMinutes = (time) => {
    let myStr = time.split(':');
    let hours = myStr[0];
    let hrToMin = hours * 60;
    let minutes = myStr[1] * 1 + hrToMin;
    return minutes;
  };

  const showRoutineRepeatStatus = (i) => {
    console.log('All routines', props.routines);
    let selectedDays = [];
    for (let [key, value] of Object.entries(
      props.routines[i]['repeat_week_days']
    )) {
      value !== '' && selectedDays.push(value);
    }
    console.log('Routine Selected Days', selectedDays);
    // const date = moment(this.props.routines[i]["repeat_ends_on"]).format("MMMM DD,YYYY")
    if (!props.routines[i]['repeat']) {
      return <div style={{ fontSize: '12px' }}> One time only </div>;
    } else {
      switch (props.routines[i]['repeat_frequency']) {
        case 'Day':
          console.log(props.routines[i]['repeat_frequency']);
          console.log(props.routines[i]['repeat_every']);
          if (props.routines[i]['repeat_every'] === '1') {
            return <div style={{ fontSize: '12px' }}> Repeat daily </div>;
          } else if (props.routines[i]['repeat_type'] === 'On') {
            return (
              <div style={{ fontSize: '12px' }}>
                {' '}
                Repeat every {props.routines[i]['repeat_every']} days, until{' '}
                {moment(props.routines[i]['repeat_ends_on']).format(
                  'MMMM DD,YYYY'
                )}{' '}
              </div>
            );
          } else if (props.routines[i]['repeat_type'] === 'After') {
            return (
              <div style={{ fontSize: '12px' }}>
                {' '}
                Repeat every {props.routines[i]['repeat_every']} days,{' '}
                {props.routines[i]['repeat_occurences']} times
              </div>
            );
          } else {
            return (
              <div style={{ fontSize: '12px' }}>
                {' '}
                Repeat every {props.routines[i]['repeat_every']} days{' '}
              </div>
            );
          }
        case 'Week':
          if (props.routines[i]['repeat_every'] === '1') {
            return <div style={{ fontSize: '12px' }}> Repeat weekly </div>;
          } else if (props.routines[i]['repeat_type'] === 'On') {
            return (
              <div style={{ fontSize: '12px' }}>
                {' '}
                Repeat every {props.routines[i]['repeat_every']} weeks on{' '}
                {selectedDays.join(', ')}, until{' '}
                {moment(props.routines[i]['repeat_ends_on']).format(
                  'MMMM DD,YYYY'
                )}{' '}
              </div>
            );
          } else if (props.routines[i]['repeat_type'] === 'After') {
            return (
              <div style={{ fontSize: '12px' }}>
                {' '}
                Repeat every {props.routines[i]['repeat_every']} weeks on{' '}
                {selectedDays.join(', ')},{' '}
                {props.routines[i]['repeat_occurences']} times
              </div>
            );
          } else {
            return (
              <div style={{ fontSize: '12px' }}>
                {' '}
                Repeat every {props.routines[i]['repeat_every']} weeks on{' '}
                {selectedDays.join(', ')}
              </div>
            );
          }
        case 'Month':
          if (props.routines[i]['repeat_every'] === '1') {
            return <div style={{ fontSize: '12px' }}> Repeat monthly </div>;
          } else {
            return (
              <div style={{ fontSize: '12px' }}>
                {' '}
                Repeat every {props.routines[i]['repeat_every']} months{' '}
              </div>
            );
          }
        case 'YEAR':
          if (props.routines[i]['repeat_every'] === '1') {
            return <div> Repeat annually </div>;
          } else {
            return (
              <div>
                {' '}
                Repeat every {props.routines[i]['repeat_every']} years{' '}
              </div>
            );
          }
        default:
          return <div> Show Routine Repeat Options Error</div>;
      }
    }
  };

  const onClickCopy = (goalTitle, goalID) => {
    let res = [];
    // console.log('In copy', goalTitle);
    res.push(
      <div>
        <Row
          style={{ margin: '0', marginBottom: '10px' }}
          className="d-flex flex-row-center"
        >
          <Col>
            <div className="fancytext">{goalTitle}</div>
          </Col>
        </Row>
      </div>
    );

    return res;
  };

  const getGoals = () => {
    // let temp = [];

    // if (this.props.goals.length != null) {
    //   for (let i = 0; i < this.props.goals.length; i++) {
    //     temp[i] = false;
    //   }

    // }
    // console.log(temp, this.state.showCopyModal)

    // let showCopyModal = [];

    // if (this.props.goals.length != null) {
    //   for (let i = 0; i < this.props.goals.length; i++) {
    //     showCopyModal[i] = false;
    //   }
    // }

    let displayGoals = [];
    if (props.goals.length != null) {
      //Check to make sure routines exists
      for (let i = 0; i < props.goals.length; i++) {
        let tempTitle = props.goals[i]['title'];
        let tempID = props.goals[i]['id'];
        let tempPersist = props.goals[i]['is_persistent'];
        let tempGR = props.goals[i];
        let date = moment(props.goals[i]['end_day_and_time']).format(
          'MM/DD/YYYY'
        );
        displayGoals.push(
          <div key={'test1' + i}>
            <ListGroup.Item
              action
              onClick={() => {
                GRonClickEvent(tempTitle, tempID, tempPersist, tempGR);
              }}
              variant="light"
              style={{ marginBottom: '3px' }}
            >
              <Row
                style={{ margin: '0', marginBottom: '10px' }}
                className="d-flex flex-row-center"
              >
                <Col>
                  <div className="fancytext">
                    {tempTitle}
                    <Col></Col>({date})
                  </div>
                </Col>
              </Row>
              {props.goals[i]['photo'] ? (
                <div>
                  <Row>
                    <Col xs={7} style={{ paddingLeft: '0px' }}>
                      <CopyIcon
                        openCopyModal={() => {
                          setStateValue((prevState) => {
                            return {
                              ...prevState,
                              showCopyModal: true,
                              indexEditing: findIndexByID(tempID),
                            };
                          });
                        }}
                        indexEditing={stateValue.indexEditing}
                        i={findIndexByID(tempID)} //index to edit
                        showModal={stateValue.showCopyModal}
                      />
                    </Col>
                    <Col xs={7} style={{ paddingLeft: '0px' }}>
                      <img
                        src={props.goals[i]['photo']}
                        alt="Instructions/Steps"
                        className="center"
                        height="80px"
                        width="auto"
                      />
                    </Col>
                    <Col style={{ paddingLeft: '0px' }}>
                      <Row style={{ marginTop: '10px' }}>
                        {props.goals[i]['is_available'] ? (
                          <div style={{ marginLeft: '5px' }}>
                            <FontAwesomeIcon
                              title="Available to the user"
                              style={{
                                color: stateValue.availabilityColorCode,
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                alert('Item Is Availble to the user');
                              }}
                              icon={faUser}
                              size="lg"
                            />{' '}
                          </div>
                        ) : (
                          <div>
                            <FontAwesomeIcon
                              title="Unavailable to the user"
                              style={{ color: '#000000' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                alert('Item Is NOT Availble to the user');
                              }}
                              icon={faUserAltSlash}
                              size="lg"
                            />
                          </div>
                        )}
                        {props.goals[i]['is_sublist_available'] ? (
                          <div>
                            <FontAwesomeIcon
                              icon={faList}
                              title="SubList Available"
                              style={{ color: '#D6A34C', marginLeft: '20px' }}
                              // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShow: false}); this.editFirBaseFalse()}}
                              //onClick={this.ListFalse}
                              size="lg"
                            />
                          </div>
                        ) : (
                          <div
                          // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShowATModal: false})}}>
                          ></div>
                        )}
                      </Row>
                      <Row style={{ marginTop: '15px', marginBottom: '10px' }}>
                        <DeleteGR
                          BASE_URL={props.BASE_URL}
                          deleteIndex={findIndexByID(tempID)}
                          Array={props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                          // Path={this.state.firebaseRootPath} //holds complete data for action task: fbPath, title, etc
                          // Path={firebase
                          //   .firestore()
                          //   .collection("users")
                          //   .doc(this.props.theCurrentUserID)}
                          refresh={grabFireBaseRoutinesGoalsData}
                          theCurrentUserId={props.theCurrentUserID}
                          theCurrentTAID={props.theCurrentTAID}
                        />
                        <EditIcon
                          openEditModal={() => {
                            setStateValue((prevState) => {
                              return {
                                ...prevState,
                                showEditModal: true,
                                indexEditing: findIndexByID(tempID),
                              };
                            });
                          }}
                          showModal={stateValue.showEditModal}
                          indexEditing={stateValue.indexEditing}
                          i={findIndexByID(tempID)} //index to edit
                          ATArray={props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                          // FBPath={firebase
                          //   .firestore()
                          //   .collection("users")
                          //   .doc(this.props.theCurrentUserID)}
                          refresh={grabFireBaseRoutinesGoalsData}
                        />
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <EditGR
                      BASE_URL={props.BASE_URL}
                      closeEditModal={() => {
                        setStateValue((prevState) => {
                          return {
                            ...prevState,
                            showEditModal: false,
                          };
                        });
                        props.updateFBGR();
                      }}
                      showModal={stateValue.showEditModal}
                      indexEditing={stateValue.indexEditing}
                      i={findIndexByID(tempID)} //index to edit
                      ATArray={props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                      // FBPath={firebase
                      //   .firestore()
                      //   .collection("users")
                      //   .doc(this.props.theCurrentUserID)}
                      refresh={grabFireBaseRoutinesGoalsData} //function to refresh IS data
                      theCurrentUserId={props.theCurrentUserID}
                      theCurrentTAID={props.theCurrentTAID}
                    />
                  </Row>
                </div>
              ) : (
                <div>
                  <Row style={{ marginLeft: '100px' }} className="d-flex ">
                    {props.goals[i]['is_available'] ? (
                      <div style={{ marginLeft: '5px' }}>
                        <FontAwesomeIcon
                          title="Available to the user"
                          style={{ color: stateValue.availabilityColorCode }}
                          onClick={(e) => {
                            e.stopPropagation();
                            alert('Item Is Availble to the user');
                          }}
                          icon={faUser}
                          size="lg"
                        />{' '}
                      </div>
                    ) : (
                      <div>
                        <FontAwesomeIcon
                          title="Unavailable to the user"
                          style={{ color: '#000000' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            alert('Item Is NOT Availble to the user');
                          }}
                          icon={faUserAltSlash}
                          size="lg"
                        />
                      </div>
                    )}
                    {props.goals[i]['is_sublist_available'] ? (
                      <div>
                        <FontAwesomeIcon
                          icon={faList}
                          title="SubList Available"
                          style={{ color: '#D6A34C', marginLeft: '20px' }}
                          // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShow: false}); this.editFirBaseFalse()}}
                          //onClick={this.ListFalse}
                          size="lg"
                        />
                      </div>
                    ) : (
                      <div
                      // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShowATModal: false})}}>
                      ></div>
                    )}
                  </Row>
                  <Row
                    style={{ marginTop: '15px', marginLeft: '100px' }}
                    className="d-flex "
                  >
                    <DeleteGR
                      BASE_URL={props.BASE_URL}
                      deleteIndex={findIndexByID(tempID)}
                      Array={props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                      // Path={this.state.firebaseRootPath} //holds complete data for action task: fbPath, title, etc
                      // Path={firebase
                      //   .firestore()
                      //   .collection("users")
                      //   .doc(this.props.theCurrentUserID)}
                      refresh={grabFireBaseRoutinesGoalsData}
                      theCurrentUserId={props.theCurrentUserID}
                      theCurrentTAID={props.theCurrentTAID}
                    />
                    <EditIcon
                      openEditModal={() => {
                        this.setState({
                          showEditModal: true,
                          indexEditing: findIndexByID(tempID),
                        });
                      }}
                      showModal={stateValue.showEditModal}
                      indexEditing={stateValue.indexEditing}
                      i={findIndexByID(tempID)} //index to edit
                      ATArray={props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                      // FBPath={firebase
                      //   .firestore()
                      //   .collection("users")
                      //   .doc(this.props.theCurrentUserID)}
                      refresh={grabFireBaseRoutinesGoalsData}
                    />
                  </Row>
                  <Row>
                    <EditGR
                      BASE_URL={props.BASE_URL}
                      closeEditModal={() => {
                        setStateValue((prevState) => {
                          return {
                            ...prevState,
                            showEditModal: false,
                          };
                        });
                        props.updateFBGR();
                      }}
                      showModal={stateValue.showEditModal}
                      indexEditing={stateValue.indexEditing}
                      i={findIndexByID(tempID)} //index to edit
                      ATArray={props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                      // FBPath={firebase
                      //   .firestore()
                      //   .collection("users")
                      //   .doc(this.props.theCurrentUserID)}
                      refresh={grabFireBaseRoutinesGoalsData} //function to refresh IS data
                      theCurrentUserId={props.theCurrentUserID}
                      theCurrentTAID={props.theCurrentTAID}
                    />
                  </Row>
                </div>
              )}
              <Row>
                <CopyGR
                  BASE_URL={props.BASE_URL}
                  indexEditing={stateValue.indexEditing}
                  i={findIndexByID(tempID)}
                  closeCopyModal={() => {
                    setStateValue((prevState) => {
                      return {
                        ...prevState,
                        showCopyModal: false,
                      };
                    });
                  }}
                  showModal={stateValue.showCopyModal}
                  title={tempTitle}
                  gr_id={tempID}
                  theCurrentUserId={props.theCurrentUserID}
                  theCurrentTAID={props.theCurrentTAID}
                  ATArray={props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                  refresh={grabFireBaseRoutinesGoalsData}
                />
              </Row>

              <Row>
                {props.goals[i]['start_day_and_time'] ? (
                  <Col
                    style={{
                      marginTop: '3px',
                      fontSize: '12px',
                      paddingRight: '0px',
                      paddingLeft: '0px',
                      marginLeft: '10px',
                    }}
                  >
                    {'Start Time: ' +
                      formatDateTime(props.goals[i]['start_day_and_time'])}
                  </Col>
                ) : (
                  <Col> </Col>
                )}
                {props.goals[i]['end_day_and_time'] ? (
                  <Col
                    xs={6}
                    style={{
                      fontSize: '12px',
                      paddingLeft: '0px',
                      paddingRight: '0px',
                    }}
                  >
                    {'End Time: ' +
                      formatDateTime(props.goals[i]['end_day_and_time'])}
                  </Col>
                ) : (
                  <Col> </Col>
                )}
              </Row>

              <Row>
                {props.showGoal &&
                  (stateValue.WentThroughATList[tempID] === false ||
                    stateValue.WentThroughATList[tempID] === undefined)}

                <Col
                  style={{
                    paddingRight: '0px',
                    paddingLeft: '0px',
                    marginLeft: '10px',
                  }}
                >
                  {showGoalRepeatStatus(i)}
                </Col>

                <Col xs={6} style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                  {thisTakesMeGivenVsSelectedGoals(i, tempID)}
                </Col>
              </Row>
            </ListGroup.Item>
          </div>
        );
      }
    }
    return displayGoals;
  };

  const thisTakesMeGivenVsSelectedGoals = (i, id) => {
    if (stateValue.AT_expected_completion_time[id] === '0') {
      return (
        <div style={{ fontSize: '12px' }}>
          {' '}
          Takes{' '}
          {
            convertToMinutes()
            // this.props.goals[i]["expected_completion_time"]
          }{' '}
          min{' '}
        </div>
      );
    } else {
      return (
        <div style={{ fontSize: '12px' }}>
          {' '}
          Takes{' '}
          {
            convertToMinutes()
            // this.props.goals[i]["expected_completion_time"]
          }{' '}
          min vs {stateValue.AT_expected_completion_time[id]} (calc)
        </div>
      );
    }
  };

  const showGoalRepeatStatus = (i) => {
    if (!props.goals[i]['repeat']) {
      return <div> One time goal </div>;
    } else {
      switch (props.goals[i]['repeat_frequency']) {
        case 'Day':
          if (props.goals[i]['repeat_every'] === '1') {
            return <div> Repeat daily </div>;
          } else {
            return (
              <div> Repeat every {props.goals[i]['repeat_every']} days </div>
            );
          }
        case 'Week':
          if (props.goals[i]['repeat_every'] === '1') {
            return <div> Repeat weekly </div>;
          } else {
            return (
              <div> Repeat every {props.goals[i]['repeat_every']} weeks </div>
            );
          }
        case 'Month':
          if (props.goals[i]['repeat_every'] === '1') {
            return <div> Repeat monthly </div>;
          } else {
            return (
              <div> Repeat every {props.goals[i]['repeat_every']} months </div>
            );
          }
        case 'YEAR':
          if (props.goals[i]['repeat_every'] === '1') {
            return <div> Repeat annually </div>;
          } else {
            return (
              <div> Repeat every {props.goals[i]['repeat_every']} years </div>
            );
          }
        default:
          return <div> Show Goal Repeat Options Error</div>;
      }
    }
  };

  // getGoalsStatus = () => {
  //   let displayGoals = [];

  //   if (this.props.goals.length != null) {
  //     //Check to make sure routines exists
  //     for (let i = 0; i < this.props.goals.length; i++) {
  //       let tempTitle = this.props.goals[i]["title"];
  //       // let tempID = this.state.goals[i]["id"];
  //       let isComplete = this.props.goals[i]["is_complete"];

  //       if (
  //         !this.props.goals[i]["is_available"] ||
  //         !this.props.goals[i]["is_displayed_today"]
  //       ) {
  //         continue; //skip if not available
  //       }

  //       let isInProgress = this.props.goals[i]["is_in_progress"];
  //       displayGoals.push(
  //         <div key={"goalStatus" + i}>
  //           <ListGroup.Item
  //             action
  //             variant="light"
  //             style={{ width: "100%", marginBottom: "3px" }}
  //             onClick={(e) => {
  //               e.stopPropagation();
  //               // this.getHistoryData(this.props.goals[i]);
  //               this.setState({
  //                 historyViewShow: true,
  //                 historyViewShowObject: this.props.goals[i],
  //                 isRoutine: false,
  //               });
  //             }}
  //           >
  //             <Row style={{ margin: "0" }} className="d-flex flex-row-center">
  //               <Col style={{ textAlign: "center", width: "100%" }}>
  //                 <div className="fancytext">{tempTitle}</div>
  //               </Col>
  //               <div
  //                 className="fancytext"
  //                 style={{ position: "absolute", right: "15px", top: "21px" }}
  //                 onClick={(e) => {
  //                   e.stopPropagation();
  //                   this.resetRoutinesGoals(this.props.goals[i]);
  //                   this.grabFireBaseRoutinesGoalsData();
  //                 }}
  //               >
  //                 Reset
  //               </div>
  //             </Row>
  //             <Row
  //               style={{
  //                 margin: "0",
  //                 display: "flex",
  //                 justifyContent: "center",
  //                 alignItems: "center",
  //               }}
  //             >
  //               {isComplete ? (
  //                 <div>
  //                   <FontAwesomeIcon
  //                     title="Completed Item"
  //                     style={{ color: this.state.availabilityColorCode }}
  //                     onClick={(e) => {
  //                       e.stopPropagation();
  //                       // alert("Item Is Completed");
  //                       // this.getHistoryData(this.props.goals[i]);
  //                       this.setState({
  //                         historyViewShow: true,
  //                         historyViewShowObject: this.props.goals[i],
  //                         isRoutine: false,
  //                       });
  //                     }}
  //                     icon={faTrophy}
  //                     size="lg"
  //                   />{" "}
  //                 </div>
  //               ) : (
  //                 <div>
  //                   <FontAwesomeIcon
  //                     title="Not Completed Item"
  //                     style={{
  //                       color: isInProgress
  //                         ? this.state.availabilityColorCode
  //                         : "black",
  //                     }}
  //                     onClick={(e) => {
  //                       e.stopPropagation();
  //                       // alert("Item Is Not Completed");
  //                       // this.getHistoryData(this.props.goals[i]);
  //                       this.setState({
  //                         historyViewShow: true,
  //                         historyViewShowObject: this.props.goals[i],
  //                         isRoutine: false,
  //                       });
  //                     }}
  //                     icon={faRunning}
  //                     size="lg"
  //                   />
  //                 </div>
  //               )}
  //             </Row>
  //           </ListGroup.Item>
  //         </div>
  //       );
  //     }
  //   }
  //   //Can pass ['datetime_completed'] in datetime constructor? Eventually want Feb 3  7:30am
  //   return displayGoals;
  // };

  const resetRoutinesGoals = (gr_object) => {
    // console.log(gr_object.id);
    let gr_id = gr_object.id;
    // console.log(gr_id);

    let url = props.BASE_URL + 'resetGR';
    axios.post(url + `/${gr_id}`).then(() => {
      // console.log('reset goal/routine');
    });
    // let db = firebase.firestore();
    // db.collection("users")
    //   .doc(this.props.theCurrentUserID)
    //   .get()
    //   .then((doc) => {
    //     let arrs = doc.data()["goals&routines"];
    //     arrs.forEach((gr) => {
    //       if (gr.id == gr_object.id) {
    //         gr_object["is_in_progress"] = false;
    //         gr_object["is_complete"] = false;
    //         gr["is_in_progress"] = false;
    //         gr["is_complete"] = false;
    //         Object.keys(gr["ta_notifications"]).forEach((k) => {
    //           gr["ta_notifications"][k].is_set = false;
    //         });
    //         Object.keys(gr["user_notifications"]).forEach((k) => {
    //           gr["user_notifications"][k].is_set = false;
    //         });
    //       }
    //     });
    //     db.collection("users")
    //       .doc(this.props.theCurrentUserID)
    //       .update({ "goals&routines": arrs });

    //     db.collection("users")
    //       .doc(doc.id)
    //       .collection("goals&routines")
    //       .get()
    //       .then((snapshot) => {
    //         if (!snapshot.empty) {
    //           snapshot.forEach((gr_doc) => {
    //             let gr = gr_doc.data();
    //             gr["actions&tasks"].forEach((at) => {
    //               at.is_complete = false;
    //               at.is_in_progress = false;
    //               db.collection("users")
    //                 .doc(doc.id)
    //                 .collection("goals&routines")
    //                 .doc(gr_doc.id)
    //                 .collection("actions&tasks")
    //                 .get()
    //                 .then((is_snapshot) => {
    //                   if (!is_snapshot.empty) {
    //                     is_snapshot.forEach((is_doc) => {
    //                       let is = is_doc.data();
    //                       is["instructions&steps"].forEach((x) => {
    //                         x.is_complete = false;
    //                         x.is_in_progress = false;
    //                       });
    //                       db.collection("users")
    //                         .doc(doc.id)
    //                         .collection("goals&routines")
    //                         .doc(gr_doc.id)
    //                         .collection("actions&tasks")
    //                         .doc(is_doc.id)
    //                         .update(is);
    //                     });
    //                   }
    //                 });
    //             });
    //             db.collection("users")
    //               .doc(doc.id)
    //               .collection("goals&routines")
    //               .doc(gr_doc.id)
    //               .update(gr);
    //           });
    //         }
    //       });
    //     this.setState({});
    //     alert("Item is reset");
    //   });
  };

  const getRoutinesStatus = () => {
    let displayRoutines = [];
    if (props.routines.length != null) {
      //Check to make sure routines exists
      for (let i = 0; i < props.routines.length; i++) {
        let tempTitle = props.routines[i]['title'];
        let tempID = props.routines[i]['id'];
        let isComplete = props.routines[i]['is_complete'];
        let isInProgress = props.routines[i]['is_in_progress'];

        // console.log(' status title', tempTitle);
        // let isInProgress = this.props.
        if (
          !props.routines[i]['is_available'] ||
          !props.routines[i]['is_displayed_today']
        ) {
          continue; //skip if not available
        }

        displayRoutines.push(
          <div key={'goalStatus' + i}>
            <ListGroup.Item
              action
              variant="light"
              style={{ marginBottom: '3px' }}
              onClick={(e) => {
                e.stopPropagation();
                // this.getHistoryData(this.props.routines[i]);

                setStateValue((prevState) => {
                  return {
                    ...prevState,
                    historyViewShow: true,
                    historyViewShowObject: props.routines[i],
                    isRoutine: true,
                  };
                });

                // this.setState({
                //   historyViewShow: true,
                //   historyViewShowObject: this.props.routines[i],
                //   isRoutine: true,
                // });
              }}
            >
              <Row style={{ margin: '0' }} className="d-flex flex-row-center">
                <Col style={{ textAlign: 'center', width: '100%' }}>
                  <div className="fancytext"> {tempTitle}</div>
                </Col>
                <div
                  className="fancytext"
                  style={{ position: 'absolute', right: '15px', top: '21px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    resetRoutinesGoals(props.routines[i]);
                    grabFireBaseRoutinesGoalsData();
                  }}
                >
                  Reset
                </div>
              </Row>
              <Row
                style={{
                  margin: '0',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {props.isComplete ? (
                  <div>
                    <FontAwesomeIcon
                      title="Completed Item"
                      style={{ color: this.state.availabilityColorCode }}
                      onClick={(e) => {
                        e.stopPropagation();
                        // alert("Item Is Completed");
                        // this.getHistoryData(this.props.routines[i]);

                        setStateValue((prevState) => {
                          return {
                            ...prevState,
                            historyViewShow: true,
                            historyViewShowObject: props.routines[i],
                            isRoutine: true,
                          };
                        });

                        // this.setState({
                        //   historyViewShow: true,
                        //   historyViewShowObject: this.props.routines[i],
                        //   isRoutine: true,
                        // });
                      }}
                      icon={faTrophy}
                      size="lg"
                    />{' '}
                  </div>
                ) : (
                  <div>
                    <FontAwesomeIcon
                      title="Not Completed Item"
                      style={{
                        color: isInProgress
                          ? stateValue.availabilityColorCode
                          : 'black',
                      }}
                      onClick={(e) => {
                        console.log(this);
                        e.stopPropagation();
                        // alert("Item Is Not Completed???");
                        // this.getHistoryData(this.props.routines[i]);
                        setStateValue((prevState) => {
                          return {
                            ...prevState,
                            historyViewShow: true,
                            historyViewShowObject: props.routines[i],
                            isRoutine: true,
                          };
                        });

                        // this.setState({
                        //   historyViewShow: true,
                        //   historyViewShowObject: this.props.routines[i],
                        //   isRoutine: true,
                        // });
                      }}
                      icon={faRunning}
                      size="lg"
                    />
                  </div>
                )}
              </Row>
            </ListGroup.Item>
          </div>
        );
      }
    }
    //Can pass ['datetime_completed'] in datetime constructor? Eventually want Feb 3  7:30am
    return displayRoutines;
  };
  /*
  abstractedGoalsList:
  shows entire list of goals and routines
  */
  // const abstractedGoalsList = (displayGoals) => {
  //   return (
  //     <Modal.Dialog
  //       style={{
  //         borderRadius: '15px',
  //         marginTop: '0',
  //         width: this.state.modalWidth,
  //         marginLeft: '10px',
  //         boxShadow:
  //           '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)',
  //       }}
  //     >
  //       <Modal.Header onHide={this.props.closeGoal} closeButton>
  //         <Modal.Title>
  //           <Row>
  //             <Col style={{ marginRight: '140px' }}>
  //               <h5 className="normalfancytext">Goals</h5>
  //             </Col>
  //             <Col>
  //               <button
  //                 type="button"
  //                 className="btn btn-info btn-md"
  //                 onClick={() => {
  //                   setStateValue((prevState) => {
  //                     return {
  //                       ...prevState,
  //                       addNewGRModalShow: true,
  //                       isRoutine: false,
  //                     };
  //                   });
  //                   // this.setState({
  //                   //   addNewGRModalShow: true,
  //                   //   isRoutine: false,
  //                   // });
  //                 }}
  //               >
  //                 Add Goal
  //               </button>
  //             </Col>
  //           </Row>
  //         </Modal.Title>
  //       </Modal.Header>
  //       <Modal.Body>
  //         {/**
  //          * To allow for the Modals to pop up in front of one another
  //          * I have inserted the IS and AT lists inside the RT Goal Modal */}
  //         <div
  //           style={{
  //             borderRadius: '15px',
  //             boxShadow:
  //               '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)',
  //             position: 'absolute',
  //             zIndex: '5',
  //           }}
  //         >
  //           {this.state.addNewGRModalShow ? this.AddNewGRModalAbstracted() : ''}
  //         </div>

  //         <div
  //           style={{
  //             borderRadius: '15px',
  //             boxShadow:
  //               '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)',
  //           }}
  //         >
  //           {this.state.singleGR.show ? (
  //             this.abstractedActionsAndTaskList()
  //           ) : (
  //             <div></div>
  //           )}
  //         </div>
  //         <ListGroup>
  //           <div style={{ height: '1400px', overflow: 'scroll' }}>
  //             {displayGoals}
  //           </div>
  //         </ListGroup>
  //       </Modal.Body>
  //     </Modal.Dialog>
  //   );
  // };
  /*
    abstractedRoutineList:
    shows entire list of routines
    */
  const abstractedRoutineList = (displayRoutines) => {
    return (
      <Modal.Dialog
        style={{
          borderRadius: '15px',
          marginTop: '0',
          width: stateValue.modalWidth,
          marginLeft: '0px',
          // boxShadow:
          //   '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)',
        }}
      >
        {console.log('entering abstractedRoutineList')}
        <Modal.Header onHide={props.closeRoutine} closeButton>
          <Row>
            <Col style={{ marginRight: '85px' }}>
              <h5 className="normalfancytext">Routines</h5>
            </Col>
            <Col>
              <button
                type="button"
                className="btn btn-info btn-md"
                onClick={() => {
                  addRoutineOnClick();
                }}
              >
                Add Routine
              </button>
            </Col>
          </Row>
        </Modal.Header>
        <Modal.Body>
          {/**
           * To allow for the Modals to pop up in front of one another
           * I have inserted the IS and AT lists inside the RT Goal Modal */}
          <div
            style={{
              borderRadius: '15px',
              boxShadow:
                '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)',
            }}
          >
            {console.log('modal body entering')}
            {stateValue.addNewGRModalShow ? AddNewGRModalAbstracted() : ''}
          </div>
          <div
            style={{
              borderRadius: '15px',
              boxShadow:
                '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)',
            }}
          >
            {stateValue.singleGR.show ? (
              abstractedActionsAndTaskList()
            ) : (
              <div></div>
            )}
          </div>
          <ListGroup>
            <div>{displayRoutines}</div>
          </ListGroup>
        </Modal.Body>
      </Modal.Dialog>
    );
  };

  const addRoutineOnClick = () => {
    let newStart, newEnd;
    console.log('addRoutineOnClick entered');
    if (props.calendarView === 'Month') {
      console.log('if entered');
      newStart = new Date();
      newStart.setHours(0, 0, 0, 0);
      newEnd = new Date();
      newEnd.setHours(23, 59, 59, 59);
    } else if (props.calendarView === 'Day') {
      console.log('else if entered');
      newStart = new Date(props.dateContext.toDate());
      newStart.setHours(0, 0, 0, 0);
      newEnd = new Date(props.dateContext.toDate());
      newEnd.setHours(23, 59, 59, 59);
    } else {
      console.log('nothing entered');
    }

    console.log(newStart, newEnd, 'newstart');

    setStateValue((prevState) => {
      return {
        ...prevState,
        singleGR: {
          id: '',
          available_start_time: newStart,
          available_end_time: newEnd,
          type: 'None',
          title: 'GR Name',
          photo: '',
          arr: [],
          fbPath: null,
        },
        addNewGRModalShow: true,
        isRoutine: true,
      };
    });
  };

  /**
   * AddNewGRModalAbstracted:
   * returns a modal showing us a slot to add a new Goal/Routine
   */
  const AddNewGRModalAbstracted = () => {
    return (
      <AddNewGRItem
        closeModal={() => {
          setStateValue((prevState) => {
            return {
              ...prevState,
              addNewGRModalShow: false,
            };
          });
        }}
        ATArray={props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
        refresh={grabFireBaseRoutinesGoalsData}
        isRoutine={stateValue.isRoutine}
        width={stateValue.modalWidth}
        todayDateObject={props.todayDateObject}
        theCurrentUserId={props.theCurrentUserID}
        theCurrentTAID={props.theCurrentTAID}
        singleGR={stateValue.singleGR}
        BASE_URL={props.BASE_URL}
      />
    );
  };

  // historyModel = (object) => {
  //   return (
  //     <ShowHistory
  //       closeModal={() => {
  //         this.setState({ historyItems: [], historyViewShow: false });
  //       }}
  //       historyItems={this.state.historyItems}
  //       displayTitle={object.title}
  //     />
  //   );
  // };

  // getHistoryData = (object) => {
  //   let historyItems = [];
  //   let userId = this.props.theCurrentUserID;
  //   let logs = [];
  //   let logstatus = [];
  //   let grId = { id: {} };
  //   let grStatus = { id: {} };
  //   const url = this.props.BASE_URL + `getHistory/${userId}`;

  //   axios.get(url).then((res) => {
  //     const data = res.data.result;
  //     this.setState({ dataObj: res.data.result });
  //     data.map((info) => {
  //       // const dataDate = moment(info.date).format("MM/DD/YYYY");
  //       // const grDate = moment(object.end_day_and_time).format("MM/DD/YYYY");
  //       var keyId = Object.keys(info.details);

  //       keyId.forEach((id) => {
  //         if (id === object.id) {
  //           logs.push(info);
  //         }
  //       });

  //       grId.id = info.details[object.id];
  //       grId[object.id] = grId["id"];
  //       delete grId["id"];
  //     });

  //     axios
  //       .get(this.props.BASE_URL + `currentStatus/${userId}`)
  //       .then((response) => {
  //         const data = response.data.result;
  //         // const dataDate = moment(info.date).format("MM/DD/YYYY");
  //         // const grDate = moment(object.end_day_and_time).format("MM/DD/YYYY");
  //         var keyId = Object.keys(data);
  //         keyId.forEach((id) => {
  //           if (id === object.id) {
  //             logstatus.push(data);
  //           }
  //         });
  //         grStatus.id = data[object.id];
  //         grStatus[object.id] = grStatus["id"];
  //         delete grStatus["id"];

  //         // const db = firebase.firestore();
  //         // db.collection("history")
  //         //   .doc(this.props.theCurrentUserID)
  //         //   .collection("goals&routines")
  //         //   .get()
  //         //   .then(async (snapshot) => {
  //         //     console.log(snapshot);
  //         //     // let logs = [];
  //         //     snapshot.forEach((log) => {
  //         //       log.data().log.forEach((gr) => {
  //         //         if (gr.id == object.id) {
  //         //           gr.date = log.data().date;
  //         //           logs.push(gr);

  //         //         }
  //         //       });
  //         //     });
  //         // push data for current date
  //         let date = new Date();
  //         let date_string =
  //           date.getFullYear() +
  //           "_" +
  //           (date.getMonth() > 8
  //             ? date.getMonth() + 1
  //             : "0" + (date.getMonth() + 1)) +
  //           "_" +
  //           (date.getDate() > 9 ? date.getDate() : "0" + date.getDate());
  //         date_string = "Today";
  //         let currentDateHistory = {
  //           date: date_string,

  //           details: grStatus,
  //         };

  //         logs.push(currentDateHistory);
  //         let list = [];
  //         let headers = [
  //           <th key={"history_header_title:"} style={{ width: "400px" }}></th>,
  //         ];
  //         for (let i = Math.max(logs.length - 7, 0); i < logs.length; i++) {
  //           headers.push(
  //             <th
  //               key={"history_header:" + logs[i].date}
  //               style={{ width: "80px", textAlign: "center" }}
  //             >
  //               {logs[i].date === "Today"
  //                 ? logs[i].date
  //                 : moment(logs[i].date).format("MM/DD/YY")}
  //             </th>
  //           );
  //         }

  //         let rows_objects = {};
  //         for (let i = Math.max(logs.length - 7, 0); i < logs.length; i++) {
  //           let atId = "";
  //           var atIds = Object.keys(logstatus[0][object.id]);

  //           let gr = logs[i];
  //           console.log(gr.details[object.id]);
  //           let grs = logstatus[0];
  //           let date = logs[i].date;
  //           if (
  //             rows_objects["gr:" + gr.details[object.id].title] == undefined
  //           ) {
  //             rows_objects["gr:" + gr.details[object.id].title] = {};
  //           }

  //           rows_objects["gr:" + gr.details[object.id].title][date] = {
  //             is_in_progress: gr.details[object.id].is_in_progress,
  //             is_complete: gr.details[object.id].is_complete,
  //             title: gr.details[object.id].title,
  //           };

  //           atIds.map((id) => {
  //             if (parseInt(id)) {
  //               atId = id;
  //             }
  //             if (grs[object.id][atId] != undefined) {
  //               if (
  //                 rows_objects[
  //                   "gr:" +
  //                     gr.details[object.id].title +
  //                     "," +
  //                     "at:" +
  //                     grs[object.id][atId].title
  //                 ] == undefined
  //               ) {
  //                 rows_objects[
  //                   "gr:" +
  //                     gr.details[object.id].title +
  //                     "," +
  //                     "at:" +
  //                     grs[object.id][atId].title
  //                 ] = {};
  //               }
  //               rows_objects[
  //                 "gr:" +
  //                   gr.details[object.id].title +
  //                   "," +
  //                   "at:" +
  //                   grs[object.id][atId].title
  //               ][date] = {
  //                 is_in_progress: gr.details[object.id].is_in_progress,
  //                 is_complete: gr.details[object.id].is_complete,
  //                 title: grs[object.id][atId].title,
  //               };
  //               // if (at["instructions&steps"] != undefined) {
  //               //   at["instructions&steps"].forEach((is) => {
  //               //     if (
  //               //       rows_objects[
  //               //         "gr:" +
  //               //           gr.title +
  //               //           "," +
  //               //           "at:" +
  //               //           at.title +
  //               //           "," +
  //               //           "is:" +
  //               //           is.title
  //               //       ] == undefined
  //               //     ) {
  //               //       rows_objects[
  //               //         "gr:" +
  //               //           gr.title +
  //               //           "," +
  //               //           "at:" +
  //               //           at.title +
  //               //           "," +
  //               //           "is:" +
  //               //           is.title
  //               //       ] = {};
  //               //     }
  //               //     rows_objects[
  //               //       "gr:" +
  //               //         gr.title +
  //               //         "," +
  //               //         "at:" +
  //               //         at.title +
  //               //         "," +
  //               //         "is:" +
  //               //         is.title
  //               //     ][date] = is;
  //               //   });
  //               // }
  //             }
  //           });
  //         }

  //         console.log(rows_objects);
  //         Object.keys(rows_objects).forEach((key, index) => {
  //           console.log(key);
  //           let row = [];
  //           let cells = [];
  //           let title_left = "";
  //           let fontSize = "22px";
  //           let paddingLeft = "10px";
  //           if (key.includes("is:")) {
  //             fontSize = "14x";
  //             paddingLeft = "50px";
  //           } else if (key.includes("at:")) {
  //             fontSize = "18px";
  //             paddingLeft = "30px";
  //           }
  //           for (let i = Math.max(logs.length - 7, 0); i < logs.length; i++) {
  //             console.log(rows_objects[key]);
  //             if (rows_objects[key][logs[i].date] == undefined) {
  //               cells.push(
  //                 <td
  //                   style={{ width: "80px", textAlign: "center" }}
  //                   key={"history:" + key + logs[i].date}
  //                 ></td>
  //               );
  //             } else {
  //               let title = rows_objects[key][logs[i].date]["title"];
  //               console.log(title);
  //               let isComplete = rows_objects[key][logs[i].date]["is_complete"];
  //               console.log(isComplete);
  //               let isInProgress =
  //                 rows_objects[key][logs[i].date]["is_in_progress"];

  //               title_left = title;
  //               cells.push(
  //                 <td
  //                   style={{ width: "80px", textAlign: "center" }}
  //                   key={"history:" + key + logs[i].date}
  //                 >
  //                   <FontAwesomeIcon
  //                     style={{
  //                       color:
  //                         isComplete === "True" || isInProgress === "True"
  //                           ? this.state.availabilityColorCode
  //                           : "black",
  //                     }}
  //                     icon={isComplete === "True" ? faTrophy : faRunning}
  //                     size="lg"
  //                   />
  //                 </td>
  //               );
  //             }
  //           }
  //           row.push(
  //             <tr key={"history_title_row:" + key}>
  //               <td
  //                 style={{ paddingLeft: paddingLeft, fontSize: fontSize }}
  //                 key={"history_title_left:" + key}
  //               >
  //                 {title_left}
  //               </td>
  //               {cells}
  //             </tr>
  //           );
  //           list.push(row);
  //         });

  //         console.log(headers);
  //         historyItems.push(
  //           <Table
  //             key={"goalStatus" + object.id}
  //             style={{ tableLayout: "fixed", width: "fit-content" }}
  //             striped
  //             bordered
  //             hover
  //           >
  //             <thead>
  //               <tr>{headers}</tr>
  //             </thead>
  //             <tbody key="history-body">{list}</tbody>
  //           </Table>
  //         );
  //         this.setState({ historyItems: historyItems });

  //         console.log(historyItems);
  //         // });
  //       });
  //   });
  // };

  // getHistoryData = (object) => {
  //   let historyItems = [];
  //   let ids = [];
  //   let weekDate = [];
  //   let grRepeat =[];
  //   const url = "https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/getHistory/100-000045";
  //   axios.get(url).then((res)=>{
  //     console.log(res.data.result)
  //     const data = res.data.result;

  //     data.map((info)=>{
  //       const dataDate = moment(info.date).format("MM/DD/YYYY");
  //       const grDate = moment(object.end_day_and_time).format("MM/DD/YYYY");

  //       if(dataDate === grDate){
  //         var keyId = Object.keys(info.details);
  //         keyId.forEach((id)=>{
  //           ids.push(id);
  //           this.setState({dateOfGR: object.end_day_and_time})
  //         })
  //         ids.forEach((grId)=>{
  //           console.log(info.details);
  //           if(grId === object.id){
  //             console.log(object.end_day_and_time);
  //             this.setState({
  //               grName: object.title,
  //               isCompleted: info.details[grId].is_complete,
  //               isProgress: info.details[grId].is_in_progress,
  //               repeatStatus: object.repeat,
  //               repeatEnds: object.repeat_ends,
  //               repeatEndsOn: object.repeat_ends_on,
  //               repeatEvery: object.repeat_every,
  //               repeatFrequency: object.repeat_frequency,
  //               repeatOccurrences: object.repeat_occurrences
  //             })
  //             console.log(this.state.grName);
  //             console.log(this.state.dateOfGR)
  //           }

  //         })
  //       }
  //     })

  //   });

  //   console.log(object);

  //   const db = firebase.firestore();
  //   db.collection("history")
  //     .doc(this.props.theCurrentUserID)
  //     .collection("goals&routines")
  //     .get()
  //     .then(async (snapshot) => {
  //       console.log(snapshot);
  //       let logs = [];
  //       snapshot.forEach((log) => {
  //         log.data().log.forEach((gr) => {
  //           if (gr.id == object.id) {
  //             gr.date = log.data().date;
  //             logs.push(gr);

  //           }
  //         });
  //       });

  //       console.log(logs);
  //       // push data for current date
  //       let date = new Date();

  //       let date_string =
  //       (date.getFullYear() +
  //       "_" +
  //       (date.getMonth() > 8
  //         ? date.getMonth() + 1
  //         : "0" + (date.getMonth() + 1)) +
  //       "_" +
  //       (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()))

  //       date_string = "_Today";

  //       let currentDateHistory = {
  //         date: date_string,
  //         title: object.title,
  //         is_in_progress: object.is_in_progress,
  //         is_complete: object.is_complete,
  //         repeat: this.state.repeatStatus,
  //         repeat_ends: this.state.repeatEnds,
  //         repeat_ends_on: this.state.repeatEndsOn,
  //         repeat_every: this.state.repeatEvery,
  //         repeat_frequency: this.state.repeatFrequency,
  //         repeat_occurences: this.state.repeatOccurences
  //       };

  //       // await db
  //       //   .collection("users")
  //       //   .doc(this.props.theCurrentUserID)
  //       //   .collection("goals&routines")
  //       //   .doc(object.id)
  //       //   .get()
  //       //   .then((ats) => {
  //       //     console.log(ats.data()["actions&tasks"]);
  //       //     currentDateHistory["actions&tasks"] =
  //       //       ats.data()["actions&tasks"] != undefined
  //       //         ? ats.data()["actions&tasks"]
  //       //         : [];
  //       //   });

  //       // for (let i = 0; i < currentDateHistory["actions&tasks"].length; i++) {
  //       //   let at = currentDateHistory["actions&tasks"][i];
  //       //   console.log(currentDateHistory);
  //       //   await db
  //       //     .collection("users")
  //       //     .doc(this.props.theCurrentUserID)
  //       //     .collection("goals&routines")
  //       //     .doc(object.id)
  //       //     .collection("actions&tasks")
  //       //     .doc(at.id)
  //       //     .get()
  //       //     .then((singleAT) => {
  //       //       if (singleAT.data()["instructions&steps"] != undefined) {
  //       //         currentDateHistory["actions&tasks"][i][
  //       //           "instructions&steps"
  //       //         ] = singleAT.data()["instructions&steps"];
  //       //       }
  //       //     });
  //       // }

  //       logs.push(currentDateHistory);

  //       if(currentDateHistory.repeat === true){
  //         if(currentDateHistory.repeat_ends === "Never"){
  //             for(var i = 0; i<=7; i++){
  //               grRepeat.push(currentDateHistory);
  //               let nextDay = new Date(currentDateHistory.date);
  //               let newDate = moment(nextDay.setDate(nextDay.getDate() + 1)).format("MM/DD/YYYY");
  //               weekDate.push(newDate);
  //               currentDateHistory.date = newDate.toString();
  //             }
  //         }
  //       }

  //       let list = [];
  //       console.log(currentDateHistory, logs);
  //       console.log(grRepeat);
  //       let headers = [
  //         <th key={"history_header_title:"} style={{ width: "400px" }}></th>,
  //       ];
  //       if(currentDateHistory.repeat === true){
  //         for (let i = Math.max(grRepeat.length - 7, 0); i < grRepeat.length; i++) {
  //           headers.push(
  //             <th
  //               key={"history_header:" + weekDate[i]}
  //               style={{ width: "80px", textAlign: "center" }}
  //             >
  //               {weekDate[i].toString()}
  //             </th>
  //           );
  //         }
  //       }
  //       else{
  //       for (let i = Math.max(logs.length - 7, 0); i < logs.length; i++) {
  //         headers.push(
  //           <th
  //             key={"history_header:" + logs[i].date}
  //             style={{ width: "80px", textAlign: "center" }}
  //           >
  //             {logs[i].date.toString()}
  //           </th>
  //         );
  //       }
  //     }

  //       let rows_objects = {};
  //       for (let i = Math.max(logs.length - 7, 0); i < logs.length; i++) {
  //         let gr = logs[i];
  //         let date = logs[i].date;
  //         if (rows_objects["gr:" + gr.title] == undefined) {
  //           rows_objects["gr:" + gr.title] = {};
  //         }
  //         rows_objects["gr:" + gr.title][date] = {
  //           is_in_progress: gr.is_in_progress,
  //           is_complete: gr.is_complete,
  //           title: gr.title,
  //         };
  //         if (gr["actions&tasks"] != undefined) {
  //           gr["actions&tasks"].forEach((at) => {
  //             if (
  //               rows_objects["gr:" + gr.title + "," + "at:" + at.title] ==
  //               undefined
  //             ) {
  //               rows_objects["gr:" + gr.title + "," + "at:" + at.title] = {};
  //             }
  //             rows_objects["gr:" + gr.title + "," + "at:" + at.title][date] = {
  //               is_in_progress: at.is_in_progress,
  //               is_complete: at.is_complete,
  //               title: at.title,
  //             };
  //             if (at["instructions&steps"] != undefined) {
  //               at["instructions&steps"].forEach((is) => {
  //                 if (
  //                   rows_objects[
  //                     "gr:" +
  //                       gr.title +
  //                       "," +
  //                       "at:" +
  //                       at.title +
  //                       "," +
  //                       "is:" +
  //                       is.title
  //                   ] == undefined
  //                 ) {
  //                   rows_objects[
  //                     "gr:" +
  //                       gr.title +
  //                       "," +
  //                       "at:" +
  //                       at.title +
  //                       "," +
  //                       "is:" +
  //                       is.title
  //                   ] = {};
  //                 }
  //                 rows_objects[
  //                   "gr:" +
  //                     gr.title +
  //                     "," +
  //                     "at:" +
  //                     at.title +
  //                     "," +
  //                     "is:" +
  //                     is.title
  //                 ][date] = is;
  //               });
  //             }
  //           });
  //         }
  //       }

  //       Object.keys(rows_objects).forEach((key, index) => {
  //         let row = [];
  //         let cells = [];
  //         let title_left = "";
  //         let fontSize = "22px";
  //         let paddingLeft = "10px";
  //         if (key.includes("is:")) {
  //           fontSize = "14x";
  //           paddingLeft = "50px";
  //         } else if (key.includes("at:")) {
  //           fontSize = "18px";
  //           paddingLeft = "30px";
  //         }
  //         for (let i = Math.max(logs.length - 7, 0); i < logs.length; i++) {
  //           if (rows_objects[key][logs[i].date] == undefined) {
  //             cells.push(
  //               <td
  //                 style={{ width: "80px", textAlign: "center" }}
  //                 key={"history:" + key + logs[i].date}
  //               ></td>
  //             );
  //           } else {
  //             let title = rows_objects[key][logs[i].date]["title"];
  //             let isComplete = rows_objects[key][logs[i].date]["is_complete"];
  //             let isInProgress = currentDateHistory.is_in_progress;
  //             title_left = title;
  //             cells.push(
  //               <td
  //                 style={{ width: "80px", textAlign: "center" }}
  //                 key={"history:" + key + logs[i].date}
  //               >
  //                 <FontAwesomeIcon
  //                 onClick = {()=>{

  //                 }}
  //                   style={{
  //                     color:
  //                       isComplete || isInProgress === false
  //                         ? this.state.availabilityColorCode
  //                         : "black",
  //                   }}
  //                   icon={isComplete ? faTrophy : faRunning}
  //                   size="lg"
  //                 />
  //               </td>
  //             );
  //           }
  //         }
  //         row.push(
  //           <tr key={"history_title_row:" + key}>
  //             <td
  //               style={{ paddingLeft: paddingLeft, fontSize: fontSize }}
  //               key={"history_title_left:" + key}
  //             >
  //               {title_left}
  //             </td>
  //             {cells}
  //           </tr>
  //         );
  //         list.push(row);
  //       });

  //       historyItems.push(
  //         <Table
  //           key={"goalStatus" + object.id}
  //           style={{ tableLayout: "fixed", width: "fit-content" }}
  //           striped
  //           bordered
  //           hover
  //         >
  //           <thead>
  //             <tr>{headers}</tr>
  //           </thead>
  //           <tbody key="history-body">{list}</tbody>
  //         </Table>
  //       );
  //       this.setState({ historyItems: historyItems });

  //       console.log(historyItems);
  //     });
  // };

  /*
    abstractedInstructionsAndStepsList:
    currently only shows the single Action/Task Title with no steps
    */

  /**
   * abstractedInstructionsAndStepsList:
   * Shows a single Task / Action as Title with
   * the list of instructions/steps underneath of it
   *
   */
  // abstractedInstructionsAndStepsList = () => {
  //   return (
  //     <Modal.Dialog
  //       style={{
  //         marginTop: "0",
  //         marginLeft: "0",
  //         width: this.state.modalWidth,
  //       }}
  //     >
  //       <Modal.Header
  //         closeButton
  //         onHide={() => {
  //           this.setState({ singleAT: { show: false } });
  //         }}
  //       >
  //         <div
  //           className="d-flex justify-content-between"
  //           style={{ width: "350px" }}
  //         >
  //           <div>
  //             <h5 className="normalfancytext">{this.state.singleAT.title}</h5>{" "}
  //           </div>
  //           <div>
  //             <button
  //               type="button"
  //               className="btn btn-info btn-md"
  //               onClick={() => {
  //                 this.setState({ addNewISModalShow: true });
  //               }}
  //             >
  //               Add Step
  //             </button>
  //           </div>
  //         </div>
  //       </Modal.Header>
  //       <Modal.Body>
  //         <div
  //           style={{
  //             borderRadius: "15px",
  //             boxShadow:
  //               "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
  //           }}
  //         >
  //           {this.state.addNewISModalShow ? (
  //             <AddNewISItem
  //               BASE_URL={this.props.BASE_URL}
  //               Array={this.state.singleATitemArr}
  //               ISArray={this.state.singleISitemArr} //Holds the raw data for all the is in the single action
  //               ISItem={this.state.singleAT} //holds complete data for action task: fbPath, title, etc
  //               refresh={this.refreshISItem}
  //               refreshAT={this.refreshATItem}
  //               timeSlot={this.state.timeSlotForIS} //timeSlot[0]== start_time, timeSlot[1] == end_time
  //               hideNewISModal={
  //                 //function to hide the modal
  //                 () => {
  //                   this.setState({ addNewISModalShow: false });
  //                 }
  //               }
  //               width={this.state.modalWidth}
  //               updateNewWentThroughATListObjIS={
  //                 this.handleWentThroughATListObj
  //               }
  //             />
  //           ) : (
  //             <div></div>
  //           )}
  //         </div>
  //         <ListGroup>
  //           <div style={{ height: "500px", overflow: "scroll" }}>
  //             {this.state.singleAT.arr}
  //           </div>
  //         </ListGroup>
  //       </Modal.Body>
  //     </Modal.Dialog>
  //   );
  // };

  /**
   * abstractedActionsAndTaskList -
   * returns modal with with a single Routine/ Goal as title
   * and beneath it is the list of action/ task associated with the
   * goal/ routine
   */
  const abstractedActionsAndTaskList = (props) => {
    // console.log("in abstractedactions");
    return (
      <Modal.Dialog
        style={{
          marginTop: '0',
          marginLeft: '0',
          width: stateValue.modalWidth,
        }}
      >
        <Modal.Header
          closeButton
          onHide={() => {
            setStateValue((prevState) => {
              return {
                ...prevState,
                singleGR: { show: false },
              };
            });
          }}
        >
          <div
            className="d-flex justify-content-between"
            style={{ width: '350px' }}
          >
            <div>
              <h5 className="normalfancytext">{stateValue.singleGR.title}</h5>{' '}
            </div>
            <div>
              <button
                type="button"
                className="btn btn-info btn-md"
                onClick={() => {
                  setStateValue((prevState) => {
                    return {
                      ...prevState,
                      addNewATModalShow: true,
                    };
                  });
                }}
              >
                Add Action/Task
              </button>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              borderRadius: '15px',
              boxShadow:
                '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)',
            }}
          >
            {stateValue.addNewATModalShow ? (
              <AddNewATItem
                BASE_URL={props.BASE_URL}
                timeSlot={stateValue.timeSlotForAT} //timeSlot[0]== start_time, timeSlot[1] == end_time
                refresh={refreshATItem} //refreshes the list of AT
                ATArray={stateValue.singleATitemArr}
                refreshGR={grabFireBaseRoutinesGoalsData}
                ATItem={stateValue.singleGR} //The parent item
                hideNewATModal={() => {
                  setStateValue((prevState) => {
                    return {
                      ...prevState,
                      addNewATModalShow: false,
                    };
                  });
                }}
                width={stateValue.modalWidth}
                updateNewWentThroughATListObj={handleWentThroughATListObj}
                currentUserId={props.theCurrentUserID}
              />
            ) : (
              <div></div>
            )}
          </div>
          {/**
           * Here Below, the IS list will pop up inside the AT list
           */}
          {/* <div
            style={{
              borderRadius: "15px",
              boxShadow:
                "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
            }}
          >
            {this.state.singleAT.show ? (
              this.abstractedInstructionsAndStepsList()
            ) : (
              <div></div>
            )}
          </div> */}
          <ListGroup>
            <div style={{ height: '500px', overflow: 'scroll' }}>
              {stateValue.singleGR.arr}
            </div>
          </ListGroup>
        </Modal.Body>
      </Modal.Dialog>
    );
  };

  // addNewTaskInputBox = () => {
  //   return (
  //     <InputGroup size="lg" style={{ marginTop: "20px" }} className="mb-3">
  //       <FormControl
  //         onChange={() => {
  //           console.log("addNewGoalInputBox");
  //         }}
  //         placeholder=""
  //       />
  //       <InputGroup.Append>
  //         <Button variant="outline-secondary">Add</Button>
  //       </InputGroup.Append>
  //     </InputGroup>
  //   );
  // };

  /*
    abstractedRoutineGoalStatusList:
    shows entire list of goals and routines
    */
  const abstractedRoutineGoalStatusList = (displayRoutines, displayGoals) => {
    return (
      <Modal.Dialog
        style={{
          borderRadius: '15px',
          marginTop: '0',
          width: stateValue.modalWidth,
          marginLeft: '0',
          boxShadow:
            '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)',
        }}
      >
        <Modal.Header onHide={props.closeRoutineGoalModal} closeButton>
          <Modal.Title>
            <h5 className="normalfancytext">Current Status</h5>{' '}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h2 className="normalfancytext">Routines:</h2>

          {/**
           * To allow for the Modals to pop up in front of one another
           * I have inserted the IS and AT lists inside the RT Goal Modal */}

          <ListGroup style={{ height: '350px', overflow: 'scroll' }}>
            {displayRoutines}
            {/* <button type="button" class="btn btn-info btn-lg" onClick={() => { this.setState({ addNewGRModalShow: true, isRoutine: true }) }} >Add Routine</button> */}
          </ListGroup>
          {/* Button To add new Routine */}
          <h2 className="normalfancytext" style={{ marginTop: '50px' }}>
            Goals:
          </h2>
          <ListGroup style={{ height: '250px', overflow: 'scroll' }}>
            {displayGoals}
            {/* Button to add new Goal */}
            {/* <button type="button" class="btn btn-info btn-lg" onClick={() => { this.setState({ addNewGRModalShow: true, isRoutine: false }) }}>Add Goal</button> */}
          </ListGroup>

          {/* <div
                style={{
                  borderRadius: "15px",
                  boxShadow:
                    "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
                  position: "absolute",
                  zIndex: "5",
                  top: "20px",
                  left: "20px",
                }}
              >
                {this.state.historyViewShow
                  ? this.historyModel(this.state.historyViewShowObject)
                  : ""}
              </div> */}
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal.Dialog>
    );
  };

  // addNewGoalInputBox = () => {
  //   return (
  //     <InputGroup
  //       size="lg"
  //       style={{ marginTop: "20px", width: this.state.modalWidth }}
  //       className="mb-3"
  //     >
  //       <FormControl
  //         onChange={() => {
  //           console.log("addNewGoalInputBox");
  //         }}
  //         placeholder="place holder!!"
  //       />
  //       <InputGroup.Append>
  //         <Button variant="outline-secondary">Add</Button>
  //       </InputGroup.Append>
  //     </InputGroup>
  //   );
  // };

  // var displayGoals = this.getGoals();
  // var displayCompletedGoals = this.getGoalsStatus();
  // var displayCompletedRoutines = this.getRoutinesStatus();
  const displayRoutines = getRoutines();

  return (
    <div style={{ marginTop: '0px', marginLeft: '0px' }}>
      <userContext.Provider value={(stateValue.showCopyModal, setStateValue)}>
        {props.showRoutineGoalModal ? (
          <Col
            style={{
              width: stateValue.modalWidth,
              marginTop: '0px',
              marginRight: '0px',
              marginLeft: '0px',
            }}
            sm="auto"
            md="auto"
            lg="auto"
          >
            <div
              style={
                {
                  // borderRadius: '15px',
                  // boxShadow:
                  //   '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)',
                }
              }
            >
              {' '}
              {
                abstractedRoutineGoalStatusList()
                // displayCompletedRoutines,
                // displayCompletedGoals
              }
            </div>
          </Col>
        ) : (
          <div
            
          ></div>
        )}
        {props.showRoutine ? (
          <Col
            style={{
              width: stateValue.modalWidth,
              marginTop: '0px',
              marginRight: '0px',
              marginLeft: '0px',
            }}
            sm="auto"
            md="auto"
            lg="auto"
          >
            {abstractedRoutineList(displayRoutines)}
          </Col>
        ) : (
          <Col
            style={{
              // width: stateValue.modalWidth,
              marginTop: '0px',
              marginRight: '0px',
              marginLeft: '0px',
              float: 'left'
            }}
            sm="auto"
            md="auto"
            lg="auto"
          >
            
            {/* {abstractedRoutineList(displayRoutines)} */}
          </Col>
        )}

        {/* {this.props.showGoal ? (
          <Col
            style={{
              width: this.state.modalWidth,
              marginTop: "0",
              marginRight: "15px",
            }}
            sm="auto"
            md="auto"
            lg="auto"
          >
            <div style={{ borderRadius: "15px" }}>
              {this.abstractedGoalsList(displayGoals)}
            </div>
          </Col>
        ) : (
          <div> </div>
        )} */}
      </userContext.Provider>
      <i class="far fa-border-inner"></i>
    </div>
  );
};

export default FirebaseV2;
