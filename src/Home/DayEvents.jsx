import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export default class DayEvents extends Component {
  constructor(props) {
    super(props);
    // console.log(this.props.dateContext);
    this.state = {
      //dayEvents: [], //holds google events data for a single day
      // todayDateObject: moment("03/07/2020"), //this is the date of interset for events to be displaye
      pxPerHour: '30px', //preset size for all columns
      pxPerHourForConversion: 55, // if pxPerHour is change, this should change to reflect it
      zIndex: 1, //thought i needed to increment zIndex for div overlaps but seems to be fine being at 1 for all divs
      eventBoxSize: '200', //width size for event box
      marginFromLeft: 0,
    };
  }

  timeDisplay = () => {
    //this essentially creates the time row
    let arr = [];
    for (let i = 0; i < 24; ++i) {
      arr.push(
        <Row key={'dayEvent' + i}>
          <Col
            style={{
              //borderTop: '1px solid lavender',
              // borderRight: '2px solid #b1b3b6',
              textAlign: 'center',
              // height: this.state.pxPerHour,
              height: '55px',
              // fluid: true,
              margin: 0,
            }}
          >
            {i == 0
              ? '12am'
              : i == 12
              ? i + 'pm'
              : i > 11
              ? i - 12 + 'pm'
              : i + 'am'}
          </Col>
        </Row>
      );
    }
    return arr;
  };

  onEventClick = (e, i) => {
    var arr = this.props.dayEvents;
    console.log(arr);
    e.stopPropagation();
    this.props.eventClickDayView(arr[i]);
  };

  sortEvents = () => {
    var arr = this.props.dayEvents;
    console.log('day events goals', arr);
    var dic = {};
    let id = 0;
    let nextnexttempStart;
    let nexttempStart;

    for (let i = 0; i < arr.length; i++) {
      let tempStart = arr[i].start.dateTime;

      if (arr[i + 1] != null) {
        nexttempStart = arr[i + 1].start.dateTime;
      }
      let nexttempStartTime = new Date(
        new Date(nexttempStart).toLocaleString('en-US', {
          timeZone: this.props.timeZone,
        })
      );

      if (arr[i - 1] != null) {
        nextnexttempStart = arr[i - 1].start.dateTime;
      }
      let tempEnd = arr[i].end.dateTime;
      let tempStartTime = new Date(
        new Date(tempStart).toLocaleString('en-US', {
          timeZone: this.props.timeZone,
        })
      );

      let nextnexttempStartTime = new Date(
        new Date(nextnexttempStart).toLocaleString('en-US', {
          timeZone: this.props.timeZone,
        })
      );

      console.log(arr[i].summary);
      let key = tempStartTime.getHours() + '_' + 0;

      if (tempStartTime.getHours() === nexttempStartTime.getHours()) {
        id++;
        key = tempStartTime.getHours() + '_' + id;
      }
      if (
        tempStartTime.getHours() != nexttempStartTime.getHours() &&
        tempStartTime.getHours() === nextnexttempStartTime.getHours()
      ) {
        id++;
        key = tempStartTime.getHours() + '_' + id;
      }
      // else if (nexttempStartTime.getHours() === tempStartTime.getHours() && nexttempStartTime.getHours() != nextnexttempStartTime.getHours()){
      //   id++;
      //   key = tempStartTime.getHours()+"_"+id;
      // }

      if (dic[key] == null) {
        dic[key] = [];
      }

      dic[key].push(arr[i]);
      console.log(dic);
    }

    return dic;
  };

  /*
   * TODO: events spanning multiple days
   * getEventItem: given an hour, this will return all events that was started during that hour
   *
   */
  getEventItemFromDic = (hour, dic) => {
    var res = [];
    var tempStart = null;
    var tempEnd = null;
    console.log('Day Events', dic);
    let arr = [];
    console.log('Day Events', arr);
    var sameTimeEventCount = 0;
    var addmarginLeft = 0;
    let itemWidth = this.state.eventBoxSize;
    var fontSize = 10;

    for (var i = 0; i < 24; i++) {
      for (var j = 0; j < i; j++) {
        if (dic[i + '_' + j] != null) {
          arr.push(dic[i + '_' + j]);
        }
      }
      if (arr == null) {
        return;
      }
    }
    console.log(arr);
    for (let i = 0; i < arr.length; i++) {
      if (!arr[i][0].start) break;
      for (var j = 0; j < arr[i].length; j++) {
        if (arr[i].length > 1) {
        }
        tempStart = arr[i][j].start.dateTime;
        console.log(tempStart);
        tempEnd = arr[i][j].end.dateTime;

        let tempStartTime = new Date(
          new Date(tempStart).toLocaleString('en-US', {
            timeZone: this.props.timeZone,
          })
        );
        let tempEndTime = new Date(
          new Date(tempEnd).toLocaleString('en-US', {
            timeZone: this.props.timeZone,
          })
        );
        let curDate = this.props.dateContext.get('date');
        // console.log("this is the events for date",tempStartTime.getDate());
        // console.log("this is the events for hour",tempStartTime.getHours());
        if (tempStartTime.getDate() === curDate) {
          if (tempStartTime.getHours() === hour) {
            if (tempStartTime.getDate() !== tempEndTime.getDate()) {
              let minsToMarginTop =
                (tempStartTime.getMinutes() / 60) *
                this.state.pxPerHourForConversion;
              let hourDiff = 24 - tempStartTime.getHours();
              let minDiff = 0;
              let color = 'lavender';
              let height =
                (hourDiff + minDiff) * this.state.pxPerHourForConversion;
              sameTimeEventCount++;
              let newElement = (
                <div key={'event' + i}>
                  <div
                    data-toggle="tooltip"
                    data-placement="right"
                    title={
                      arr[i][j].summary +
                      '\nStart: ' +
                      tempStartTime +
                      '\nEnd: ' +
                      tempEndTime
                    }
                    onMouseOver={(e) => {
                      e.target.style.color = '#FFFFFF';
                      e.target.style.background = '#D6B7FF';
                      e.target.style.zIndex = '2';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.zIndex = '1';
                      e.target.style.color = '#000000';
                      e.target.style.background = color;
                    }}
                    key={i}
                    // value = {i}
                    onClick={(e) => this.onEventClick(e, i)}
                    style={{
                      zIndex: this.state.zIndex,
                      marginTop: minsToMarginTop + 'px',
                      padding: '5px',
                      paddingBottom: '15px',
                      fontSize: fontSize + 'px',
                      border: '1px lightgray solid ',
                      float: 'left',
                      //  verticalAlign: " ",
                      // verticalAlign: 'text-top',
                      // textAlign:"left",
                      borderRadius: '5px',
                      background: color,
                      // width: this.state.eventBoxSize - (addmarginLeft/16),
                      width: itemWidth + 'px',
                      position: 'absolute',
                      height: height + 'px',
                      marginLeft: addmarginLeft + 'px',
                    }}
                  >
                    {/* {console.log("LOOOOOK "+ arr[i].summary + "   " + this.state.eventBoxSize/(sameHourItems-1) )} */}
                    {arr[i][j].summary}
                  </div>
                </div>
              );
              res.push(newElement);
            } else {
              // addmarginLeft = 0;
              // itemWidth = this.state.eventBoxSize;
              let minsToMarginTop =
                (tempStartTime.getMinutes() / 60) *
                this.state.pxPerHourForConversion;
              let hourDiff = tempEndTime.getHours() - tempStartTime.getHours();
              let minDiff =
                (tempEndTime.getMinutes() - tempStartTime.getMinutes()) / 60;
              let color = 'PaleTurquoise';
              let height =
                (hourDiff + minDiff) * this.state.pxPerHourForConversion;
              sameTimeEventCount++;
              //check if there is already an event there overlapping from another hour
              // for (let i = 0; i < arr.length; i++) {
              //   tempStart = arr[i].start.dateTime;
              //   tempEnd = arr[i].end.dateTime;
              //   let tempStartTime = new Date(new Date(tempStart).toLocaleString('en-US', {
              //  		timeZone: this.props.timeZone
              //  	}));
              //   let tempEndTime = new Date(new Date(tempEnd).toLocaleString('en-US', {
              //  		timeZone: this.props.timeZone
              //  	}));
              //   if (
              //     tempStartTime.getHours() < hour &&
              //     tempEndTime.getHours() > hour
              //   ) {
              //     addmarginLeft += 20;
              //     itemWidth = itemWidth - 20;
              //   }
              // }

              if (sameTimeEventCount > 1) {
                // console.log("add 20 in day");
                addmarginLeft += 20;
                // addmarginLeft += this.state.eventBoxSize/(sameHourItems-1) ;
                // itemWidth = itemWidth/(sameHourItems-1);
                itemWidth = itemWidth - 20;
              }
              //chnage font size if not enough space
              if (tempEndTime.getHours() - tempStartTime.getHours() < 2) {
                fontSize = 8;
              }

              // change color if more than one event in same time.
              if (sameTimeEventCount <= 1) {
                color = hour % 2 == 0 ? 'PaleTurquoise' : 'skyblue';
              } else if (sameTimeEventCount == 2) {
                color = 'skyblue';
              } else {
                color = 'blue';
              }

              let newElement = (
                <div key={'event' + i}>
                  <div
                    data-toggle="tooltip"
                    data-placement="right"
                    title={
                      arr[i][j].summary +
                      '\nStart: ' +
                      tempStartTime +
                      '\nEnd: ' +
                      tempEndTime
                    }
                    onMouseOver={(e) => {
                      e.target.style.color = '#FFFFFF';
                      e.target.style.background = '#D6B7FF';
                      e.target.style.zIndex = '2';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.zIndex = '1';
                      e.target.style.color = '#000000';
                      e.target.style.background = color;
                    }}
                    key={i}
                    // value = {i}
                    onClick={(e) => this.onEventClick(e, i)}
                    style={{
                      zIndex: this.state.zIndex,
                      marginTop: minsToMarginTop + 'px',
                      padding: '5px',
                      paddingBottom: '15px',
                      fontSize: fontSize + 'px',
                      border: '1px lightgray solid ',
                      float: 'left',
                      //  verticalAlign: " ",
                      // verticalAlign: 'text-top',
                      // textAlign:"left",
                      borderRadius: '5px',
                      background: color,
                      // width: this.state.eventBoxSize - (addmarginLeft/16),
                      width: itemWidth + 'px',
                      position: 'absolute',
                      height: height + 'px',
                      marginLeft: addmarginLeft + 'px',
                    }}
                  >
                    {/* {console.log("LOOOOOK "+ arr[i].summary + "   " + this.state.eventBoxSize/(sameHourItems-1) )} */}
                    {arr[i][j].summary}
                  </div>
                </div>
              );
              res.push(newElement);
            }
          }
        } else if (hour === 0 && tempEndTime.getDate() === curDate) {
          let minsToMarginTop = 0;
          let hourDiff = tempEndTime.getHours();
          let minDiff = tempEndTime.getMinutes() / 60;
          let height = (hourDiff + minDiff) * this.state.pxPerHourForConversion;
          let color = 'lavender';
          sameTimeEventCount++;
          let newElement = (
            <div key={'event' + i}>
              <div
                data-toggle="tooltip"
                data-placement="right"
                title={
                  arr[i][j].summary +
                  '\nStart: ' +
                  tempStartTime +
                  '\nEnd: ' +
                  tempEndTime
                }
                onMouseOver={(e) => {
                  e.target.style.color = '#FFFFFF';
                  e.target.style.background = '#D6B7FF';
                  e.target.style.zIndex = '2';
                }}
                onMouseOut={(e) => {
                  e.target.style.zIndex = '1';
                  e.target.style.color = '#000000';
                  e.target.style.background = color;
                }}
                key={i}
                // value = {i}
                onClick={(e) => this.onEventClick(e, i)}
                style={{
                  zIndex: this.state.zIndex,
                  marginTop: minsToMarginTop + 'px',
                  padding: '5px',
                  paddingBottom: '15px',
                  fontSize: fontSize + 'px',
                  border: '1px lightgray solid ',
                  float: 'left',
                  //  verticalAlign: " ",
                  // verticalAlign: 'text-top',
                  // textAlign:"left",
                  borderRadius: '5px',
                  background: color,
                  // width: this.state.eventBoxSize - (addmarginLeft/16),
                  width: itemWidth + 'px',
                  position: 'absolute',
                  height: height + 'px',
                  marginLeft: addmarginLeft + 'px',
                }}
              >
                {/* {console.log("LOOOOOK "+ arr[i].summary + "   " + this.state.eventBoxSize/(sameHourItems-1) )} */}
                {arr[i][j].summary}
              </div>
            </div>
          );
          res.push(newElement);
        } else if (
          hour === 0 &&
          tempStartTime.getDate() < curDate &&
          tempEndTime.getDate() > curDate
        ) {
          let minsToMarginTop = 0;
          let hourDiff = 24;
          let height = hourDiff * this.state.pxPerHourForConversion;
          let color = 'lavender';
          sameTimeEventCount++;
          let newElement = (
            <div key={'event' + i}>
              <div
                data-toggle="tooltip"
                data-placement="right"
                title={
                  arr[i][j].summary +
                  '\nStart: ' +
                  tempStartTime +
                  '\nEnd: ' +
                  tempEndTime
                }
                onMouseOver={(e) => {
                  e.target.style.color = '#FFFFFF';
                  e.target.style.background = '#D6B7FF';
                  e.target.style.zIndex = '2';
                }}
                onMouseOut={(e) => {
                  e.target.style.zIndex = '1';
                  e.target.style.color = '#000000';
                  e.target.style.background = color;
                }}
                key={i}
                // value = {i}
                onClick={(e) => this.onEventClick(e, i)}
                style={{
                  zIndex: this.state.zIndex,
                  marginTop: minsToMarginTop + 'px',
                  padding: '5px',
                  paddingBottom: '15px',
                  fontSize: fontSize + 'px',
                  border: '1px lightgray solid ',
                  float: 'left',
                  //  verticalAlign: " ",
                  // verticalAlign: 'text-top',
                  // textAlign:"left",
                  borderRadius: '5px',
                  background: color,
                  // width: this.state.eventBoxSize - (addmarginLeft/16),
                  width: itemWidth + 'px',
                  position: 'absolute',
                  height: height + 'px',
                  marginLeft: addmarginLeft + 'px',
                }}
              >
                {/* {console.log("LOOOOOK "+ arr[i].summary + "   " + this.state.eventBoxSize/(sameHourItems-1) )} */}
                {arr[i][j].summary}
              </div>
            </div>
          );
          res.push(newElement);
        }
      }
    }
    return res;
  };

  onDayClick = (e, i) => {
    console.log('this is the hour:' + i);
    this.props.handleDateClick(
      this.props.dateContext.format('M') +
        '/' +
        this.props.dateContext.format('D') +
        '/' +
        this.props.dateContext.format('Y'),
      i
    );
  };

  /**
   * dayViewItems: goes through hours 0 to 24, and calling getEventItem for each hour
   */
  dayViewItems = () => {
    let dic = this.sortEvents();
    var arr = [];
    for (let i = 0; i < 24; ++i) {
      arr.push(
        <Row key={'dayEvent' + i} style={{ position: 'relative' }}>
          <Col
            style={{
              position: 'relative',
              //borderTop: '1px solid lavender',
              borderBottom: '2px solid #b1b3b6',
              width: '250px', //lyman change width to adjust
              //background: 'aliceblue',
              //height: this.state.pxPerHour,
              marginLeft: '0',
              height: '55px',
            }}
            onClick={(e) => this.onDayClick(e, i)}
          >
            {this.getEventItemFromDic(i, dic)}
          </Col>
        </Row>
      );
    }
    return arr;
  };

  render() {
    return (
      <div
        style={{
          padding: '10px',
          width: '350px',
          marginLeft: '-35px',
          backgroundColor: '#F2F7FC',
        }}
      >
        <div style={{ paddingLeft: '90px' }}>Today's Events:</div>

        <Container>
          <Row
            ref={this.hourDisplay}
            noGutters={true}
            className="d-flex justify-content-end"
            style={{ marginLeft: '-10px' }}
          >
            <Col>
              {/* this is Just for the time */}
              <Container style={{ padding: '0' }}>
                {this.timeDisplay()}
              </Container>
            </Col>
            <Col>
              {/* this is for the actual event slots */}
              <Container style={{ margin: '0px', padding: '0' }}>
                {this.dayViewItems()}
              </Container>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
