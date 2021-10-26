import React, { Component } from 'react';

// import axios from 'axios';
import moment from 'moment';
import { Container, Row, Col } from 'react-bootstrap';

export default class DayGoals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goals:[],
      pxPerHour: '30px', //preset size for all columns
      pxPerHourForConversion: 55, // if pxPerHour is change, this should change to reflect it
      zIndex: 1, //thought i needed to increment zIndex for div overlaps but seems to be fine being at 1 for all divs
      eventBoxSize: '200', //width size for event box
    };
  }

  dayView = () => {
    //this essentially creates the time row
    let arr = [];
    for (let i = 0; i < 24; ++i) {
      arr.push(
        <Row key={'dayDayViewGoals' + i}>
          <Col
            style={{
              borderTop: '1px solid mistyrose',
              //borderTop: '2px solid #b1b3b6',
              textAlign: 'right',
              //height: this.state.pxPerHour,
              textAlign: 'center',
              height: '55px',
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

  GoalClicked = () => {
    this.props.dayGoalClick();
  };
  /**
   * getEventItem: given an hour, this will return all events that was started during that hour
   *
   */
  getEventItem = (hour) => {
    //console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
    //updateGRIsDisplayed();
    //console.log("TimeZone", this.props.TimeZone);
    var res = [];
    var tempStart = null;
    var tempEnd = null;
    var arr = this.props.goals;
    var sameTimeEventCount = 0;
    let itemWidth = this.state.eventBoxSize;
    var addmarginLeft = 0;
    var fontSize = 10;
    //console.log("this.props.dateContext", this.props.dateContext);
    //this.updateGRIsDisplayed()
    // console.log("For pragya", arr)
    for (let i = 0; i < arr.length; i++) {
      tempStart = arr[i].start_day_and_time;
      tempEnd = arr[i].end_day_and_time;
      console.log('timezone date', tempStart)
      console.log('timezone date', tempEnd);
      let tempStartTime = new Date(tempStart.replace(/-/g, '/'));
      let tempEndTime = new Date(tempEnd.replace(/-/g, '/'));
      console.log('timezone date', tempStartTime);
      console.log('timezone date', tempEndTime);
      let curDate = this.props.dateContext.get('date');
      let curMonth = this.props.dateContext.get('month');
      let curYear = this.props.dateContext.get('year');

      let CurrentDate = new Date(
        new Date(curYear, curMonth, curDate).toLocaleString('en-US', {
          timeZone: this.props.TimeZone,
        })
      );
      console.log('timezone date', CurrentDate);
      
      CurrentDate.setHours(0, 0, 0, 0);

      let startDate = new Date(
        new Date(arr[i].start_day_and_time.replace(/-/g, '/')).toLocaleString(
          'en-US',
          {
            timeZone: this.props.TimeZone,
          }
        )
      );
      console.log('timezone date', startDate);
      startDate.setHours(0, 0, 0, 0);

      let isDisplayedTodayCalculated = false;

      let repeatOccurences = parseInt(arr[i].repeat_occurences);

      let repeatEvery = parseInt(arr[i].repeat_every);

      let repeatEnds = arr[i].repeat_type;

      let repeatEndsOn = new Date(
        new Date(arr[i].repeat_ends_on).toLocaleString('en-US', {
          timeZone: this.props.TimeZone,
        })
      );
      console.log('timezone date', repeatEndsOn);
      repeatEndsOn.setHours(0, 0, 0, 0);

      let repeatFrequency = arr[i].repeat_frequency;

      let repeatWeekDays = [];
      if (arr[i].repeat_week_days != null) {
        Object.keys(arr[i].repeat_week_days).forEach((k) => {
          if (arr[i].repeat_week_days[k] != '') {
            repeatWeekDays.push(parseInt(k));
          }
        });
      }

      if (!arr[i].repeat) {
        isDisplayedTodayCalculated =
          CurrentDate.getTime() - startDate.getTime() == 0;
      } else {
        if (CurrentDate >= startDate) {
          if (repeatEnds == 'On') {
          } else if (repeatEnds == 'After') {
            if (repeatFrequency == 'Day') {
              repeatEndsOn = new Date(startDate);
              repeatEndsOn.setDate(
                startDate.getDate() + (repeatOccurences - 1) * repeatEvery
              );
            } else if (repeatFrequency == 'Week') {
              let occurence_dates = [];

              const start_day_and_time =
                arr[i].start_day_and_time.split(' ')[0];

              let initFullDate = start_day_and_time;

              let numberOfWeek = 0;

              let index = repeatWeekDays.indexOf(0);

              if (index !== -1) {
                repeatWeekDays.splice(index, 1);
                repeatWeekDays.push(7);
              }

              const d = moment(initFullDate, 'MM/DD/YYYY');
              const today_day = d.isoWeekday();
              const result = repeatWeekDays.filter((day) => day < today_day);
              if (result.length > 0) {
                var new_week = repeatWeekDays.slice(result.length);

                result.forEach((day) => {
                  new_week.push(day);
                });

                repeatWeekDays = new_week;
              }

              for (let i = 0; i < repeatOccurences; i++) {
                let dow = repeatWeekDays[i];
                if (i >= repeatWeekDays.length) {
                  numberOfWeek = Math.floor(i / repeatWeekDays.length);
                  dow = repeatWeekDays[i % repeatWeekDays.length];
                }
                const new_date = moment(initFullDate, 'MM/DD/YYYY');
                const nextDayOfTheWeek = getNextDayOfTheWeek(dow, new_date);
                //console.log("NextDayOfWeek: ", nextDayOfTheWeek.format("L"));
                //console.log("numberOfWeeks: ", numberOfWeek);
                const date = nextDayOfTheWeek
                  .clone()
                  .add(numberOfWeek * repeatEvery, 'weeks')
                  .format('L');
                occurence_dates.push(date);
              }

              //console.log("occurence_dates: ", occurence_dates);

              let today_date_object = new Date(curYear, curMonth, curDate);
              let today = getFormattedDate(today_date_object);

              if (occurence_dates.includes(today)) {
                isDisplayedTodayCalculated = true;
              }
            } else if (repeatFrequency == 'Month') {
              repeatEndsOn = new Date(startDate);
              repeatEndsOn.setMonth(
                startDate.getMonth() + (repeatOccurences - 1) * repeatEvery
              );
            } else if (repeatFrequency == 'YEAR') {
              repeatEndsOn = new Date(startDate);
              repeatEndsOn.setFullYear(
                startDate.getFullYear() + (repeatOccurences - 1) * repeatEvery
              );
            }
          } else if (repeatEnds == 'Never') {
            repeatEndsOn = CurrentDate;
          }

          if (CurrentDate <= repeatEndsOn) {
            if (repeatFrequency == 'Day') {
              isDisplayedTodayCalculated =
                Math.floor(
                  (CurrentDate.getTime() - startDate.getTime()) /
                    (24 * 3600 * 1000)
                ) %
                  repeatEvery ==
                0;
            } else if (repeatFrequency == 'Week') {
              isDisplayedTodayCalculated =
                repeatWeekDays.includes(CurrentDate.getDay()) &&
                Math.floor(
                  (CurrentDate.getTime() - startDate.getTime()) /
                    (7 * 24 * 3600 * 1000)
                ) %
                  repeatEvery ==
                  0;
            } else if (repeatFrequency == 'Month') {
              isDisplayedTodayCalculated =
                CurrentDate.getDate() == startDate.getDate() &&
                ((CurrentDate.getFullYear() - startDate.getFullYear()) * 12 +
                  CurrentDate.getMonth() -
                  startDate.getMonth()) %
                  repeatEvery ==
                  0;
            } else if (repeatFrequency == 'YEAR') {
              isDisplayedTodayCalculated =
                startDate.getDate() == CurrentDate.getDate() &&
                CurrentDate.getMonth() == startDate.getMonth() &&
                (CurrentDate.getFullYear() - startDate.getFullYear()) %
                  repeatEvery ==
                  0;
            }
          }
        }
      }

      //console.log("isDisplayedTodayCalculated", isDisplayedTodayCalculated);
      if (isDisplayedTodayCalculated) {
        //console.log("today is the day");
        tempStartTime.setMonth(curMonth);
        tempEndTime.setMonth(curMonth);
        tempStartTime.setDate(curDate);
        tempEndTime.setDate(curDate);
        tempStartTime.setFullYear(curYear);
        tempEndTime.setFullYear(curYear);
      }

      //***   Firbase boolean varibale to help mobile side know if to display goal */
      let checkCurDate = moment();
      arr[i].is_displayed_today = isDisplayedTodayCalculated;

      /**
       * TODO: add the case where arr[i].start.dateTime doesn't exists
       */
      if (
        tempStartTime.getDate() === curDate &&
        curMonth <= tempEndTime.getMonth() &&
        curMonth >= tempStartTime.getMonth() &&
        curYear <= tempEndTime.getFullYear() &&
        curYear >= tempStartTime.getFullYear()
      ) {
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
            if (isDisplayedTodayCalculated) {
              let newElement = (
                <div key={'event' + i}>
                  <div
                    data-toggle="tooltip"
                    data-placement="right"
                    title={
                      arr[i].title +
                      '\nStart: ' +
                      tempStartTime +
                      '\nEnd: ' +
                      tempEndTime
                    }
                    onMouseOver={(e) => {
                      e.target.style.color = '#FFFFFF';
                      e.target.style.background = 'lightslategray';
                      e.target.style.zIndex = '2';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.zIndex = '1';
                      e.target.style.color = '#FFFFFF';
                      e.target.style.background = color;
                    }}
                    key={i}
                    onClick={this.GoalClicked}
                    style={{
                      zIndex: this.state.zIndex,
                      marginTop: minsToMarginTop + 'px',
                      padding: '5px',
                      paddingBottom: '15px',
                      fontSize: fontSize + 'px',
                      border: '1px lightgray solid ',
                      float: 'left',
                      borderRadius: '5px',
                      background: color,
                      width: itemWidth + 'px',
                      position: 'absolute',
                      height: height + 'px',
                      marginLeft: addmarginLeft + 'px',
                    }}
                  >
                    {arr[i].title}
                  </div>
                </div>
              );
              res.push(newElement);
            }
          } else {
            let minsToMarginTop =
              (tempStartTime.getMinutes() / 60) *
              this.state.pxPerHourForConversion;
            let hourDiff = tempEndTime.getHours() - tempStartTime.getHours();
            let minDiff =
              (tempEndTime.getMinutes() - tempStartTime.getMinutes()) / 60;
            let height =
              (hourDiff + minDiff) * this.state.pxPerHourForConversion;
            let color = '#376DAC';

            sameTimeEventCount++;
            for (let i = 0; i < arr.length; i++) {
              tempStart = arr[i].start_day_and_time;
              tempEnd = arr[i].end_day_and_time;

              let tempStartTime = new Date(tempStart);
              let tempEndTime = new Date(tempEnd);
              if (
                tempStartTime.getHours() < hour &&
                tempEndTime.getHours() > hour
              ) {
                addmarginLeft += 20;
                itemWidth = itemWidth - 20;
              }
            }

            if (sameTimeEventCount > 1) {
              addmarginLeft += 20;
              itemWidth = itemWidth - 20;
            }

            //change font size if not enough space
            if (tempEndTime.getHours() - tempStartTime.getHours() < 2) {
              fontSize = 8;
            }
            // change color if more than one event in same time.
            if (sameTimeEventCount <= 1) {
              color = hour % 2 === 0 ? '#376DAC' : '#739FD2';
            } else if (sameTimeEventCount === 2) {
              color = '#739FD2';
            } else {
              color = 'blue';
            }
            if (isDisplayedTodayCalculated) {
              let newElement = (
                <div
                  key={'dayRoutineItem' + i}
                  data-toggle="tooltip"
                  data-placement="right"
                  title={
                    arr[i].title +
                    '\nStart: ' +
                    tempStartTime +
                    '\nEnd: ' +
                    tempEndTime
                  }
                  onMouseOver={(e) => {
                    e.target.style.color = '#FFFFFF';
                    e.target.style.background = 'lightslategray';
                    e.target.style.zIndex = '2';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.zIndex = '1';
                    e.target.style.color = '#FFFFFF';
                    e.target.style.border = '1px lightgray solid';
                    e.target.style.background = color;
                  }}
                  onClick={this.GoalClicked}
                  style={{
                    zIndex: this.state.zIndex,
                    marginTop: minsToMarginTop + 'px',
                    padding: '5px',
                    paddingBottom: '15px',
                    border: '1px lightgray solid ',
                    borderRadius: '5px',
                    position: 'absolute',
                    height: height + 'px',
                    fontSize: fontSize + 'px',
                    background: color,
                    width: itemWidth + 'px',
                    marginLeft: addmarginLeft + 'px',
                  }}
                >
                  {arr[i].title}
                </div>
              );
              res.push(newElement);
            }
          }
        }
      } else if (
        hour === 0 &&
        tempEndTime.getDate() === curDate &&
        curMonth <= tempEndTime.getMonth() &&
        curMonth >= tempStartTime.getMonth() &&
        curYear <= tempEndTime.getFullYear() &&
        curYear >= tempStartTime.getFullYear()
      ) {
        let minsToMarginTop = 0;
        let hourDiff = tempEndTime.getHours();
        let minDiff = tempEndTime.getMinutes() / 60;
        let height = (hourDiff + minDiff) * this.state.pxPerHourForConversion;
        let color = 'lavender';
        sameTimeEventCount++;
        if (isDisplayedTodayCalculated) {
          let newElement = (
            <div key={'event' + i}>
              <div
                data-toggle="tooltip"
                data-placement="right"
                title={
                  arr[i].title +
                  '\nStart: ' +
                  tempStartTime +
                  '\nEnd: ' +
                  tempEndTime
                }
                onMouseOver={(e) => {
                  e.target.style.color = '#FFFFFF';
                  e.target.style.background = 'lightslategray';
                  e.target.style.zIndex = '2';
                }}
                onMouseOut={(e) => {
                  e.target.style.zIndex = '1';
                  e.target.style.color = '#FFFFFF';
                  e.target.style.background = color;
                }}
                key={i}
                onClick={this.GoalClicked}
                style={{
                  zIndex: this.state.zIndex,
                  marginTop: minsToMarginTop + 'px',
                  padding: '5px',
                  paddingBottom: '15px',
                  fontSize: fontSize + 'px',
                  border: '1px lightgray solid ',
                  float: 'left',
                  borderRadius: '5px',
                  background: color,
                  width: itemWidth + 'px',
                  position: 'absolute',
                  height: height + 'px',
                  marginLeft: addmarginLeft + 'px',
                }}
              >
                {arr[i].title}
              </div>
            </div>
          );
          res.push(newElement);
        }
      } else if (
        hour === 0 &&
        tempStartTime.getDate() < curDate &&
        tempEndTime.getDate() > curDate &&
        curMonth <= tempEndTime.getMonth() &&
        curMonth >= tempStartTime.getMonth() &&
        curYear <= tempEndTime.getFullYear() &&
        curYear >= tempStartTime.getFullYear()
      ) {
        let minsToMarginTop = 0;
        //let hourDiff = 24;
        let height = 24 * this.state.pxPerHourForConversion;
        let color = 'lavender';
        sameTimeEventCount++;
        if (isDisplayedTodayCalculated) {
          let newElement = (
            <div key={'event' + i}>
              <div
                data-toggle="tooltip"
                data-placement="right"
                title={
                  arr[i].title +
                  '\nStart: ' +
                  tempStartTime +
                  '\nEnd: ' +
                  tempEndTime
                }
                onMouseOver={(e) => {
                  e.target.style.color = '#FFFFFF';
                  e.target.style.background = 'lightslategray';
                  e.target.style.zIndex = '2';
                }}
                onMouseOut={(e) => {
                  e.target.style.zIndex = '1';
                  e.target.style.color = '#FFFFFF';
                  e.target.style.background = color;
                }}
                key={i}
                onClick={this.GoalClicked}
                style={{
                  zIndex: this.state.zIndex,
                  marginTop: minsToMarginTop + 'px',
                  padding: '5px',
                  paddingBottom: '15px',
                  fontSize: fontSize + 'px',
                  border: '1px lightgray solid ',
                  float: 'left',
                  borderRadius: '5px',
                  background: color,
                  width: itemWidth + 'px',
                  position: 'absolute',
                  height: height + 'px',
                  marginLeft: addmarginLeft + 'px',
                }}
              >
                {arr[i].title}
              </div>
            </div>
          );
          res.push(newElement);
        }
      }
    }
    return res;
  };

  /**
   * dayViewItems: goes through hours 0 to 24, and calling getEventItem for each hour
   */
  dayViewItems = () => {
    var arr = [];
    for (let i = 0; i < 24; ++i) {
      arr.push(
        <Row key={'dayGoal' + i} style={{ position: 'relative' }}>
          <Col
            style={{
              position: 'relative',
              color: 'white',
              borderBottom: '2px solid #b1b3b6',
              margin: '0px',
              width: '100%',
              height: '55px',
            }}
          >
            {this.getEventItem(i)}
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
          //margin: '10px',
          padding: '10px',
          width: '300px',
          marginRight:'-30px'
        }}
      >
        Today's Goals:
        <Container>
          <Row
            ref={this.hourDisplay}
            noGutters={true}
            className="d-flex justify-content-end"
          >
            <Col>
              <Container style={{ margin: '0', padding: '0' }}>
                {this.dayViewItems()}
              </Container>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

function getFormattedDate(date) {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');

  return month + '/' + day + '/' + year;
}

function getNextDayOfTheWeek(day, date) {
  const dayINeed = day; // for Thursday
  const today = date.isoWeekday();
  // console.log("DayINeed, today", dayINeed, today);

  // if we haven't yet passed the day of the week that I need:
  if (today <= dayINeed) {
    // then just give me this week's instance of that day
    var nextDayOfTheWeek = date.day(dayINeed);
    return nextDayOfTheWeek;
  } else {
    // otherwise, give me *next week's* instance of that same day
    var nextDayOfTheWeek = date.add(1, 'weeks').day(dayINeed);
    // console.log("from getNextday", nextDayOfTheWeek.format("L"));
    return nextDayOfTheWeek;
  }
}
