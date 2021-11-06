import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './history.css';

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function MainPage() {
  //    const { profile, setProfile } = useContext(AuthContext);
  //    console.log(profile);

  const currentUser = '100-000072'; //matts testing 72
  const [historyGot] = useState([]);
  const inRange = [];
  const currentDate = new Date(Date.now());

  //table things:
  const classes = useStyles();

  function createData(
    name,
    sun,
    mon,
    tue,
    wed,
    thurs,
    fri,
    sat,
    show,
    under,
    tBox
  ) {
    //rows structure
    return { name, sun, mon, tue, wed, thurs, fri, sat, show, under, tBox };
  }
  const [rows, setRows] = useState([]);
  const [isLoading, setLoading] = useState(true);

  //api call and store response in historyGot

  // useEffect(() => {
  //     const fetchData = async ()=> {
  //         const result = await axios(
  //
  //         );
  //         console.log(result);
  //         for(var i=0; i <result.data.result.length; i++){
  //             //console.log(result.data.result[i]);
  //             historyGot.push(result.data.result[i]);
  //         }
  //     };
  //     fetchData();
  //     console.log(historyGot);
  //     cleanData(historyGot);
  // }, []);

  useEffect(() => {
    axios
      .get(BASE_URL + 'getHistory/' + currentUser)
      .then((response) => {
        for (var i = 0; i < response.data.result.length; i++) {
          // console.log(response.data.result[i]);
          historyGot.push(response.data.result[i]);
        }
        console.log(historyGot);
        // console.log(response.data.result[1].details);
        cleanData(historyGot);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //-------- clean historyGot - just dates we want, just info we want, and structure vertical to horizontal   --------
  function cleanData(historyGot) {
    //go through at find historyGots that are within 7 days of currentDate
    const temp = [];
    for (var i = 0; i < historyGot.length; i++) {
      var historyDate = new Date(historyGot[i].date);
      if (
        historyDate.getTime() >= currentDate.getTime() - 604800000 && //filter for within 7 datets
        historyDate.getTime() <= currentDate.getTime()
      ) {
        // 7: 604800000    2: 172800000
        temp.push(historyGot[i]);
      }
    }
    //now temp has data we want
    // move temp to inRange with no repeats
    const map = new Map();
    for (const item of temp) {
      if (!map.has(item.date)) {
        map.set(item.date, true);
        inRange.push({
          date: item.date,
          details: item.details,
        });
      }
    }
    inRange.reverse(); //put latest day at end

    //bigList will hold new data format sidewase
    var bigList = [];
    for (var d = 0; d < inRange.length; d++) {
      const obj = JSON.parse(inRange[d].details);
      // console.log(obj);
      for (var r = 0; r < obj.length; r++) {
        //FOR ROUTINES
        // console.log(r);
        if (obj[r].title) {
          // console.log("gere");
          var isNewR = true;
          for (var s = 0; s < bigList.length; s++) {
            //check through and see if this is a new routine
            if (
              bigList[s].type == 'Routine' &&
              bigList[s].title == obj[r].title
            ) {
              bigList[s].days[d] = obj[r].status; //if already there- just update that day statys
              isNewR = false;
              break;
            }
          }
          if (isNewR) {
            var currentR = {
              type: 'Routine',
              title: obj[r].title,
              under: '',
              days: [],
              tBox: {},
              show: true,
            }; //if new, make object and put in bigList
            currentR.days[d] = obj[r].status;
            bigList.push(currentR);
          }

          if (obj[r].actions != undefined) {
            var actions = obj[r].actions;
            for (var a = 0; a < actions.length; a++) {
              //FOR ACTIONS
              if (actions[a].title) {
                var isNewA = true;
                for (var s = 0; s < bigList.length; s++) {
                  if (
                    bigList[s].type == 'Action' &&
                    bigList[s].title == actions[a].title
                  ) {
                    bigList[s].days[d] = actions[a].status;
                    isNewA = false;
                    break;
                  }
                }
                if (isNewA) {
                  var currentA = {
                    type: 'Action',
                    title: actions[a].title,
                    under: obj[r].title,
                    days: [],
                    tBox: {},
                    show: false,
                  };
                  currentA.days[d] = actions[a].status;
                  bigList.push(currentA);
                }
                if (actions[a].instructions != undefined) {
                  var insts = actions[a].instructions;
                  for (var i = 0; i < insts.length; i++) {
                    //FOR INSTRUCTIONS
                    if (insts[i].title) {
                      var isNewI = true;
                      for (var s = 0; s < bigList.length; s++) {
                        if (
                          bigList[s].type == 'Instruction' &&
                          bigList[s].title == insts[i].title
                        ) {
                          bigList[s].days[d] = insts[i].status;
                          isNewI = false;
                          break;
                        }
                      }
                      if (isNewI) {
                        var currentI = {
                          type: 'Instruction',
                          title: insts[i].title,
                          under: actions[a].title,
                          days: [],
                          tBox: {},
                          show: false,
                        };
                        currentI.days[d] = insts[i].status;
                        bigList.push(currentI);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    //Now bigList has data in new object style.
    //of that we transfer what we want to display to rows
    bigList = addCircles(bigList);
    bigList = addNames(bigList);
    for (var i = 0; i < bigList.length; i++) {
      rows.push(
        createData(
          bigList[i].title,
          bigList[i].days[6],
          bigList[i].days[5],
          bigList[i].days[4],
          bigList[i].days[3],
          bigList[i].days[2],
          bigList[i].days[1],
          bigList[i].days[0],
          bigList[i].show,
          bigList[i].under,
          bigList[i].tBox
        )
      );
    }
    //console.log(rows);
    setRows(rows);
    setLoading(false);
    console.log(rows);
    return rows;
  }

  // ------ just replaces days completed or not with appropriate circles to display ---------
  function addCircles(bigList) {
    for (var i = 0; i < bigList.length; i++) {
      for (var d = 0; d < bigList[i].days.length; d++) {
        if (bigList[i].type == 'Routine') {
          if (bigList[i].days[d] == 'not started') {
            bigList[i].days[d] = <div className="nsR"></div>;
          } else if (bigList[i].days[d] == 'completed') {
            bigList[i].days[d] = <div className="cR"></div>;
          } else if (bigList[i].days[d] == 'in_progress') {
            bigList[i].days[d] = (
              <div className="cR">
                <div className="whiteHalf"></div>
              </div>
            );
          }
        } else if (bigList[i].type == 'Action') {
          if (bigList[i].days[d] == 'not started') {
            bigList[i].days[d] = <div className="nsA"></div>;
          } else if (bigList[i].days[d] == 'completed') {
            bigList[i].days[d] = <div className="cA"></div>;
          } else if (bigList[i].days[d] == 'in_progress') {
            bigList[i].days[d] = (
              <div className="cA">
                <div className="whiteHalf"></div>
              </div>
            );
          }
        } else {
          if (bigList[i].days[d] == 'not started') {
            bigList[i].days[d] = <div className="nsI"></div>;
          } else if (bigList[i].days[d] == 'completed') {
            bigList[i].days[d] = <div className="cI"></div>;
          }
        }
      }
    }
    return bigList;
  }

  function addNames(bigList) {
    for (var i = 0; i < bigList.length; i++) {
      for (var d = 0; d < bigList[i].days.length; d++) {
        if (bigList[i].type == 'Routine') {
          bigList[i].tBox = (
            <div className="routineName">{bigList[i].title}</div>
          );
        } else if (bigList[i].type == 'Action') {
          bigList[i].tBox = (
            <div className="actionName">{bigList[i].title}</div>
          );
        } else {
          bigList[i].tBox = (
            <div className="instructionName">{bigList[i].title}</div>
          );
        }
      }
    }
    return bigList;
  }

  // --------   when routine is clicked on. set children show to true, re-render with setRows ----------
  function clickHandle(name) {
    var newRows = [];
    //take out duplicates of rows (copy into newRows)
    const map = new Map();
    for (const item of rows) {
      if (!map.has(item.name)) {
        map.set(item.name, true);
        newRows.push(item);
      }
    }
    //if clicked on, change show of things underneath
    console.log('click.' + name);
    for (var r = 0; r < newRows.length; r++) {
      if (rows[r].under == name) {
        //console.log("got " + rows[r].name);
        newRows[r].show = !rows[r].show;
        console.log(rows[r].name + ' -> ' + newRows[r].show);
        //also close instructions of routines clicked on. 2 levels deep
        for (var i = 0; i < newRows.length; i++) {
          if (rows[i].under == rows[r].name && rows[i].show) {
            newRows[i].show = !rows[i].show;
            console.log(rows[i].name + ' -> ' + newRows[i].show);
          }
        }
      }
    }
    setRows(newRows); //update rows with newRows
  }

  // -------    returns shortened version of rows with only those with show true ----------------------
  function onlyAllowed() {
    var newRows = [];
    for (var r = 0; r < rows.length; r++) {
      if (rows[r].show) {
        //console.log("here: " + rows[r].name);
        newRows.push(rows[r]);
      }
    }
    return newRows;
  }

  function getDayName(num) {
    var d = new Date();
    d.setDate(d.getDate() - num);
    switch (d.getDay()) {
      case 0:
        return 'SUN';
      case 1:
        return 'MON';
      case 2:
        return 'TUE';
      case 3:
        return 'WED';
      case 4:
        return 'THUR';
      case 5:
        return 'FRI';
      case 6:
        return 'SAT';
    }
  }

  //-----------------------

  if (isLoading) {
    return (
      <div>
        <br></br>
        <h1>Loading...</h1>;
      </div>
    );
  }
  return (
    <div>
      <div>
        <br></br>
        <br></br>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">{getDayName(7)}</TableCell>
                <TableCell align="left">{getDayName(6)}</TableCell>
                <TableCell align="left">{getDayName(5)}</TableCell>
                <TableCell align="left">{getDayName(4)}</TableCell>
                <TableCell align="left">{getDayName(3)}</TableCell>
                <TableCell align="left">{getDayName(2)}</TableCell>
                <TableCell align="left">{getDayName(1)}</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {onlyAllowed().map((row) => (
                <TableRow key={row.name}>
                  <TableCell align="right">{row.sun}</TableCell>
                  <TableCell align="right">{row.mon}</TableCell>
                  <TableCell align="right">{row.tue}</TableCell>
                  <TableCell align="right">{row.wed}</TableCell>
                  <TableCell align="right">{row.thurs}</TableCell>
                  <TableCell align="right">{row.fri}</TableCell>
                  <TableCell align="right">{row.sat}</TableCell>
                  <TableCell
                    align="right"
                    component="th"
                    scope="row"
                    onClick={() => clickHandle(row.name)}
                  >
                    {row.tBox}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
