import React, { Component } from 'react'
import moment from 'moment';
import {
     Container, Row, Col
} from 'react-bootstrap';

export default class WeekEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pxPerHour: '30px', //preset size for all columns
      pxPerHourForConversion: 55, // if pxPerHour is change, this should change to reflect it
      zIndex: 1, //thought i needed to increment zIndex for div overlaps but seems to be fine being at 1 for all divs
      eventBoxSize: 80, //width size for event box
      marginFromLeft: 0,
      startDateTimeEventDic: {},
    };
    this.hourDisplay = React.createRef();
  }

  componentDidMount() {
    // Set top most time to be current hour
    // Browser scrolls to the bottom if hour >= 18 (tested with Chrome and Firefox)
    let curHour = new Date(
      new Date().toLocaleString('en-US', {
        timeZone: this.props.timeZone,
      })
    ).getHours();
    this.hourDisplay.current.scrollTop =
      this.state.pxPerHourForConversion * curHour;
  }

  timeDisplay = () => {
    //this essentially creates the time row
    let arr = [];
    for (let i = 0; i < 24; ++i) {
      arr.push(
        <Row key={'dayEvent' + i} style={{ marginLeft: '3rem' }}>
          <Col
            style={{
              // borderTop: '1px solid lavender',
              // borderRight: '2px solid #b1b3b6',
              textAlign: 'center',
              // height: this.state.pxPerHour,
              height: '55px',
              // fluid: true,
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

  dateDisplay = () => {
    let arr = [];
    let startObject = this.props.dateContext.clone();
    let startDay = startObject.startOf('week');
    let curDate = startDay.clone();
    const tz = {
      timeZone: this.props.timeZone,
      // add more here
    };

    let today = new Date().toLocaleString(tz, tz);
    //let today = new Date();
    let dateNew = moment(today);
    for (let i = 0; i < 7; i++) {
      arr.push(
        <Col key={'day' + i}>
          <Col
            style={{
              textAlign: 'center',
              height: this.state.pxPerHour,
              color:
                (curDate.format('D') === dateNew.format('D')) &
                (curDate.format('M') === dateNew.format('M'))
                  ? 'RebeccaPurple'
                  : '',
            }}
          >
            {curDate.format('MMM' + ' ' + 'D')}
          </Col>
        </Col>
      );
      curDate.add(1, 'day');
    }
    return arr;
  };

  onEventClick = (e, i) => {
    var arr = this.props.weekEvents;
    e.stopPropagation();
    this.props.eventClick(arr[i]);
  };

  onWeekClick = (event, day, hour) => {
    let startObject = this.props.dateContext.clone();
    let startDay = startObject.startOf('week');
    let curDate = startDay.clone();
    curDate.add(24 * day + hour, 'hour');
    this.props.onDayClick(curDate);
  };

  weekViewItems = () => {
    // this creates the events adjusting their div size to reflecting the time it's slotted for
    let dic = this.sortEvents();
    var res = [];
    for (let i = 0; i < 7; ++i) {
      var arr = [];
      for (let j = 0; j < 24; ++j) {
        arr.push(
          <Container key={'weekEvent' + i + j}>
            <Row style={{ position: 'relative' }}>
              <Col
                style={{
                  position: 'relative',
                  // borderTop: '1px solid lavender',
                  // background: 'aliceblue',
                  height: '50px',
                  color: 'white',
                  borderBottom: '2px solid #b1b3b6',
                  margin: '0px',
                  width: '100%',
                }}
                onClick={(e) => this.onWeekClick(e, i, j)}
              >
                {this.getEventItemFromDic(i, j, dic)}
              </Col>
            </Row>
          </Container>
        );
      }
      res.push(
        <Col key={'dayEvent' + i} style={{ borderLeft: '2px solid #b1b3b6' }}>
          {arr}
        </Col>
      );
    }
    return res;
  };

  sortEvents = () => {
    var arr = this.props.weekEvents;
    var dic = {};
    for (let i = 0; i < arr.length; i++) {
      let tempStart = arr[i].start.dateTime;
      let tempEnd = arr[i].end.dateTime;
      let tempStartTime = new Date(
        new Date(tempStart).toLocaleString('en-US', {
          timeZone: this.props.timeZone,
        })
      );
      let key = tempStartTime.getDay() + '_' + tempStartTime.getHours();
      if (dic[key] == null) {
        dic[key] = [];
      }
      dic[key].push(arr[i]);
    }
    return dic;
  };
   getEventItemFromDic = (day, hour, dic) => {
    let startObject = this.props.dateContext.clone();
    let startDay = startObject.startOf('week');
    let curDate = startDay.clone();
    curDate.add(day, 'days');
    var res = [];
    let arr = [];
    var tempStart = null;
    var tempEnd = null;
    // var arr = dic[day+"_"+hour];
    var sameTimeEventCount = 0;
    var addmarginLeft = 0;
    let itemWidth = this.state.eventBoxSize;
    var fontSize = 10;
    for (var j = 0; j < 31; j++) {
      for (var i = 0; i < 24; i++) {
        if (dic[j + '_' + i] != null) {
          arr.push(dic[j + '_' + i]);
        }
        if (arr == null) {
          return;
        }
      }
    }
    //console.log(arr);
    if (arr == null) {
      return;
    }
    for (let i = 0; i < arr.length; i++) {
      var arr_i = arr[i][0];
      tempStart = arr_i.start.dateTime;
      tempEnd = arr_i.end.dateTime;
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
      let startDate = moment(tempStartTime);
      let endDate = moment(tempEndTime);
      if (
        curDate.isSameOrAfter(startDate, 'day') &&
        curDate.isSameOrBefore(endDate, 'day')
      ) {
        if (startDate.date() === curDate.date()) {
          if (startDate.hour() === hour) {
            if (startDate.date() === endDate.date()) {
              // addmarginLeft = 0;
              // itemWidth = this.state.eventBoxSize;
              let minsToMarginTop =
                (tempStartTime.getMinutes() / 60) *
                this.state.pxPerHourForConversion;
              let hourDiff = tempEndTime.getHours() - tempStartTime.getHours();
              let minDiff = tempEndTime.getMinutes() / 60;
              let color = 'PaleTurquoise';
              let height =
                (hourDiff + minDiff) * this.state.pxPerHourForConversion;
              sameTimeEventCount++;

              //check if there is already an event there overlapping from another hour
              for (let i = 0; i < arr.length; i++) {
                tempStart = arr[i][0].start.dateTime;
                tempEnd = arr[i][0].end.dateTime;
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
                if (
                  tempStartTime.getHours() < hour &&
                  tempEndTime.getHours() > hour
                ) {
                  addmarginLeft += 20;
                  itemWidth = itemWidth - 20;
                }
              }

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
                color = hour % 2 === 0 ? 'PaleTurquoise' : 'skyblue';
              } else if (sameTimeEventCount === 2) {
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
                      arr_i.summary +
                      '\nStart: ' +
                      tempStartTime +
                      '\nEnd: ' +
                      tempEndTime
                    }
                    onMouseOver={(e) => {
                      e.target.style.color = '#FFFFFF';
                      e.target.style.background = 'RebeccaPurple';
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
                    {arr_i.summary}
                  </div>
                </div>
              );
              res.push(newElement);
            } else if (startDate.date() !== endDate.date()) {
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
                      arr_i.summary +
                      '\nStart: ' +
                      tempStartTime +
                      '\nEnd: ' +
                      tempEndTime
                    }
                    onMouseOver={(e) => {
                      e.target.style.color = '#FFFFFF';
                      e.target.style.background = 'RebeccaPurple';
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
                    {arr_i.summary}
                  </div>
                </div>
              );
              res.push(newElement);
            }
          }
        } else if (hour === 0) {
          if (endDate.date() === curDate.date()) {
            let minsToMarginTop = 0;
            let hourDiff = tempEndTime.getHours();
            let minDiff = tempEndTime.getMinutes() / 60;
            let height =
              (hourDiff + minDiff) * this.state.pxPerHourForConversion;
            let color = 'lavender';
            sameTimeEventCount++;
            let newElement = (
              <div key={'event' + i}>
                <div
                  data-toggle="tooltip"
                  data-placement="right"
                  title={
                    arr_i.summary +
                    '\nStart: ' +
                    tempStartTime +
                    '\nEnd: ' +
                    tempEndTime
                  }
                  onMouseOver={(e) => {
                    e.target.style.color = '#FFFFFF';
                    e.target.style.background = 'RebeccaPurple';
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
                  {arr_i.summary}
                </div>
              </div>
            );
            res.push(newElement);
          } else {
            let minsToMarginTop = 0;
            let height = 24 * this.state.pxPerHourForConversion;
            let color = 'lavender';
            sameTimeEventCount++;
            let newElement = (
              <div key={'event' + i}>
                <div
                  data-toggle="tooltip"
                  data-placement="right"
                  title={
                    arr_i.summary +
                    '\nStart: ' +
                    tempStartTime +
                    '\nEnd: ' +
                    tempEndTime
                  }
                  onMouseOver={(e) => {
                    e.target.style.color = '#FFFFFF';
                    e.target.style.background = 'RebeccaPurple';
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
                  {arr_i.summary}
                </div>
              </div>
            );
            res.push(newElement);
          }
        }
      }
    }
    return res;
  };
  weekdaysDisplay = () => {
    let arr = [];
    let startObject = this.props.dateContext.clone();
    let startDay = startObject.startOf('week');
    let curDate = startDay.clone();
    const tz = {
      timeZone: this.props.timeZone,
      // add more here
    };
    let today = new Date().toLocaleString(tz, tz);

    let dateNew = moment(today);

    for (let i = 0; i < 7; i++) {
      arr.push(
        <Col key={'day' + i}>
          <Col
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              color:
                (curDate.format('D') === dateNew.format('D')) &
                (curDate.format('dddd') === dateNew.format('dddd')) &
                (curDate.format('M') === dateNew.format('M'))
                  ? 'RebeccaPurple'
                  : '',
              padding: '0',
            }}
          >
            {curDate.format('dddd')}
          </Col>
        </Col>
      );
      curDate.add(1, 'day');
    }
    return arr;
  };
  render() {
    let weekdays = moment.weekdays().map((day) => {
      return (
        <Col key={'event' + day} className="fancytext">
          {day}
        </Col>
      );
    });
    return (
      <Container style={{ margin: '0rem' }}>
        <Row style={{ marginLeft: '3rem' }}>
          <Row
            style={{
              overflowX: 'hidden',
              overflowY: 'visible',
              width: '100%',
            }}
          >
            {this.weekdaysDisplay()}
          </Row>

          <Row style={{ width: '100%', fontWeight: 'bold' }}>
            {this.dateDisplay()}
          </Row>
        </Row>
        <Row
          ref={this.hourDisplay}
          noGutters={true}
          // style={{ overflowY: 'scroll', maxHeight: '1350px' }}
          className="d-flex justify-content-end"
          style={{ marginLeft: '-4rem', marginRight: '0rem' }}
        >
          <Col>
            <Container
              style={{ marginRight: '-3px', padding: '0', width: '6px' }}
            >
              {this.timeDisplay()}
            </Container>
          </Col>
          {this.weekViewItems()}
        </Row>
      </Container>
    );
  }
}
