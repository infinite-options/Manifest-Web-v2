import React, { Component } from 'react';
import moment, { weekdays } from 'moment';
import { Container, Row, Col } from 'react-bootstrap';
import './Home.css';
import { BorderColor } from '@material-ui/icons';
import zIndex from '@material-ui/core/styles/zIndex';
import greenTick from '../manifest/LoginAssets/GreenTick.svg';
import yelloTick from '../manifest/LoginAssets/YellowTick.svg';
import { columnsTotalWidthSelector } from '@material-ui/data-grid';

export default class WeekRoutines extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pxPerHour: '30px', //preset size for all columns
      pxPerHourForConversion: 50, // if pxPerHour is change, this should change to reflect it
      zIndex: 1, //thought i needed to increment zIndex for div overlaps but seems to be fine being at 1 for all divs
      eventBoxSize: 80, //width size for event box
      marginFromLeft: 0,
      clickButton: true,
    };
    this.hourDisplay = React.createRef();
    this.weekViewItems = this.weekViewItems.bind(this);
  }

  checkClick = () => {
    if (this.state.clickButton) {
      BorderColor = 'blue';
    }
  };
  componentDidMount() {
    // Set top most time to be current hour
    // Browser scrolls to the bottom if hour >= 18
    let curHour = new Date().getHours();
    this.hourDisplay.current.scrollTop =
      this.state.pxPerHourForConversion * curHour;
  }

  sortRoutines = () => {
    var arr = this.props.routines;
    var dic = {};
    const tz = {
      timeZone: this.props.timeZone,
      // add more here
    };
    let startObject = this.props.dateContext.clone();
    let endObject = this.props.dateContext.clone();
    let startDay = startObject.startOf('week');
    let endDay = endObject.endOf('week');
    console.log('endof temp timezone', endDay)
    let startDate = new Date(startDay.format('YYYY-MM-DD'));
    let endDate = endDay.toDate();
    //let endDate = new Date(endDay.format('YYYY-MM-DD'));
    console.log('endof temp timezone', endDate);
    //console.log('endof temp timezone', endDay.toDate());
    startDate.setHours(0, 0, 0);
    endDate.setHours(23, 59, 59);
    console.log(
      'startDay = ',
      startDay,
      ', startDate = ',
      startDate,
      '\nEndDay = ',
      endDay,
      ', endDate = ',
      endDate
    );
    for (let i = 0; i < arr.length; i++) {
      let tempStart = arr[i].start_day_and_time;
      let tempEnd = arr[i].end_day_and_time;
      console.log('temp timezone start',tempStart)
      let tempStartTime = new Date(
        moment(tempStart.replace(/-/g, '/')).format(
          'ddd MMM D YYYY HH:mm:ss [GMT]ZZ'
        )
      );
      // let tempStartTime = new Date(
      //   new Date(tempStart.replace(/-/g, '/')).toLocaleString({
      //     timeZone: this.props.timeZone,
      //   })
      // );
      console.log('temp timeZone', arr[i].title, tempStartTime);
      let repeatOccurences = parseInt(arr[i]['repeat_occurences']);
      let repeatEvery = parseInt(arr[i]['repeat_every']);
      let repeatEnds = arr[i]['repeat_type'];
      //console.log('temp timeZone', repeatEnds);
      let repeatEndsOn = new Date(
        new Date(arr[i]['repeat_ends_on'].replace(/-/g, '/')).toLocaleString({
          timeZone: this.props.timeZone,
        }));
      //console.log('temp timeZone', repeatEndsOn);
      repeatEndsOn.setHours(0, 0, 0, 0);
      let repeatFrequency = arr[i]['repeat_frequency'];
      let repeatWeekDays = [];
      if (arr[i]['repeat_week_days'] != null) {
        Object.keys(arr[i]['repeat_week_days']).forEach((k) => {
          if (arr[i]['repeat_week_days'][k] != '') {
            repeatWeekDays.push(parseInt(k));
          }
        });
      }
      console.log(
        'temp Timezone',
        arr[i].title,
        arr[i].repeat,
        repeatOccurences,
        repeatEvery,
        repeatEnds,
        repeatEndsOn,
        repeatFrequency,
        repeatWeekDays
      );
      console.log('temp timezone', !arr[i].repeat)
      if (!arr[i].repeat) {
        console.log('startDate temp timezone', arr[i].title, startDate, endDate);
        if (tempStartTime >= startDate && tempStartTime <= endDate) {
          console.log('repeat temp timezone', arr[i].title);
          console.log('temp timezone',tempStartTime);
          console.log('temp timezone', tempStartTime.getDay());
          console.log('temp timezone', tempStartTime.getHours());
          let key = tempStartTime.getDay() + '_' + tempStartTime.getHours();
          console.log('repeat temp timzone', key);
          if (dic[key] == null) {
            dic[key] = [];
          }
          dic[key].push(arr[i]);
          console.log('repeat temp timezone', dic[key])
        }
      } else {
        for (let j = 0; j < 7; j++) {
          let CurrentDate = new Date(startDate);
          //console.log('repeat', CurrentDate)
          let isDisplayedTodayCalculated = false;

          CurrentDate.setDate(CurrentDate.getDate() + j);
          // console.log(CurrentDate, startDate, arr[i].title, repeatEnds)
          if (CurrentDate >= startDate) {
            if (repeatEnds == 'On') {
              // repeatEndsOn.setDate(arr[i]["repeat_ends_on"])
            } else if (repeatEnds == 'Occur') {
              if (repeatFrequency == 'Day') {
                repeatEndsOn = new Date(startDate);
                repeatEndsOn.setDate(
                  tempStartTime.getDate() + (repeatOccurences - 1) * repeatEvery
                );
                // console.log(repeatEndsOn, arr[i].title)
              } else if (repeatFrequency == 'Week') {
                repeatEndsOn = new Date(startDate);
                repeatEndsOn.setDate(
                  startDate.getDate() + (repeatOccurences - 1) * 7 * repeatEvery
                );
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
              console.log('repeat endson', arr[i].title,repeatEndsOn, CurrentDate)
            }

            // console.log(CurrentDate, repeatEndsOn, arr[i].title);
            if (CurrentDate <= repeatEndsOn) {
              if (repeatFrequency == 'Day') {
                console.log( CurrentDate, startDate, tempStartTime, arr[i].title)
                isDisplayedTodayCalculated =
                  Math.floor(repeatEndsOn.getTime() - CurrentDate.getTime()) %
                    repeatEvery ==
                  0;
                // console.log(isDisplayedTodayCalculated, CurrentDate, repeatEndsOn, arr[i].title )
              } else if (repeatFrequency == 'Week') {
                // isDisplayedTodayCalculated = repeatWeekDays.includes(CurrentDate.getDay()) && Math.floor((CurrentDate.getTime() - startDate.getTime())/(7*24*3600*1000)) % repeatEvery == 0;
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
          if (isDisplayedTodayCalculated) {
            console.log('repeat title',arr[i].title);
            let key = j + '_' + tempStartTime.getHours();
            if (dic[key] == null) {
              dic[key] = [];
            }
            dic[key].push(arr[i]);
          }
        }
      }
    }
    console.log('repeat dict',dic);
    return dic;
  };

  getRoutineItemFromDic = (day, hour, dic) => {
    let startObject = this.props.dateContext.clone();
    
    let startDay = startObject.startOf('week');
    let curDate2 = startDay.clone();
    curDate2.add(day, 'days');
    const tz = {
      timeZone: this.props.timeZone,
      // add more here
    };

    let dateNew = new Date().toLocaleString(tz, tz);
    let today = moment(dateNew);
    //let today = new Date();
    var res = [];
    var tempStart = null;
    var tempEnd = null;
    var arr = dic[day + '_' + hour];
    console.log('startObject = ', arr);
    var sameTimeEventCount = 0;
    var addmarginLeft = 0;
    let itemWidth = this.state.eventBoxSize;
    var fontSize = 10;
    if (arr == null) {
      return;
    }
    for (let i = 0; i < arr.length; i++) {
      tempStart = arr[i].start_day_and_time;
      tempEnd = arr[i].end_day_and_time;
      /**
       * TODO: add the case where arr[i].start.dateTime doesn't exists
       */
      let tempStartTime = new Date(tempStart.replace(/-/g, '/'));
      let tempEndTime = new Date(tempEnd.replace(/-/g, '/'));
      let curMonth = curDate2.get('month');
      let curYear = curDate2.get('year');

      /**
       * Dealing with repeating Routines
       */

      let CurrentDate = new Date(
        new Date(curYear, curMonth, curDate2.date()).toLocaleString('UTC', {
          timeZone: this.props.TimeZone,
        })
      );
      console.log('repeat startDate2', CurrentDate);  
      CurrentDate.setHours(0, 0, 0, 0);

      let startDate2 = new Date(
        new Date(arr[i].start_day_and_time.replace(/-/g, '/')).toLocaleString(
          
          {
            timeZone: this.props.TimeZone,
          }
        )
      );
      //console.log('repeat startDate2', startDate2)
      startDate2.setHours(0, 0, 0, 0);

      let isDisplayedTodayCalculated = false;

      let repeatOccurences = parseInt(arr[i].repeat_occurences);

      let repeatEvery = parseInt(arr[i].repeat_every);

      let repeatEnds = arr[i].repeat_type;

      let repeatEndsOn = new Date(
        new Date(arr[i].repeat_ends_on.replace(/-/g, '/')).toLocaleString(
          'UTC',
          {
            timeZone: this.props.TimeZone,
          }
        )
      );
      console.log('repeat ends on',  arr[i].title, repeatEndsOn)   
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
          CurrentDate.getTime() - startDate2.getTime() == 0;
          console.log('repeat',isDisplayedTodayCalculated =
          CurrentDate.getTime() - startDate2.getTime() == 0)
      } else {
        if (CurrentDate >= startDate2) {
          if (repeatEnds == 'On') {
          } else if (repeatEnds == 'Occur') {
            if (repeatFrequency == 'Day') {
              repeatEndsOn = new Date(startDate2);
              repeatEndsOn.setDate(
                startDate2.getDate() + (repeatOccurences - 1) * repeatEvery
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

              const d = moment(initFullDate, 'YYYY-MM-DD');
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
                console.log(dow);
                if (i >= repeatWeekDays.length) {
                  numberOfWeek = Math.floor(i / repeatWeekDays.length);
                  dow = repeatWeekDays[i % repeatWeekDays.length];
                }
                const new_date = moment(initFullDate, 'YYYY-MM-DD');
                const nextDayOfTheWeek = getNextDayOfTheWeek(dow, new_date);
                //console.log("NextDayOfWeek: ", nextDayOfTheWeek.format("L"));
                //console.log("numberOfWeeks: ", numberOfWeek);
                const date = nextDayOfTheWeek
                  .clone()
                  .add(numberOfWeek * repeatEvery, 'weeks')
                  .format('L');
                occurence_dates.push(date);
                console.log(occurence_dates);
              }

              //console.log("occurence_dates: ", occurence_dates);

              let today_date_object = new Date(
                curYear,
                curMonth,
                curDate2.date()
              );
              let today = getFormattedDate(today_date_object);
              console.log(today, occurence_dates);

              if (occurence_dates.includes(today)) {
                console.log(today);
                isDisplayedTodayCalculated = true;
              }
            } else if (repeatFrequency == 'Month') {
              repeatEndsOn = new Date(startDate2);
              repeatEndsOn.setMonth(
                startDate2.getMonth() + (repeatOccurences - 1) * repeatEvery
              );
            } else if (repeatFrequency == 'YEAR') {
              repeatEndsOn = new Date(startDate2);
              repeatEndsOn.setFullYear(
                startDate2.getFullYear() + (repeatOccurences - 1) * repeatEvery
              );
            }
          } else if (repeatEnds == 'Never') {
            repeatEndsOn = CurrentDate;
          }

          if (CurrentDate <= repeatEndsOn) {
            if (repeatFrequency == 'Day') {
              isDisplayedTodayCalculated =
                Math.floor(
                  (CurrentDate.getTime() - startDate2.getTime()) /
                    (24 * 3600 * 1000)
                ) %
                  repeatEvery ==
                0;
            } else if (repeatFrequency == 'Week') {
              isDisplayedTodayCalculated =
                repeatWeekDays.includes(CurrentDate.getDay()) &&
                Math.floor(
                  (CurrentDate.getTime() - startDate2.getTime()) /
                    (7 * 24 * 3600 * 1000)
                ) %
                  repeatEvery ==
                  0;
            } else if (repeatFrequency == 'Month') {
              isDisplayedTodayCalculated =
                CurrentDate.getDate() == startDate2.getDate() &&
                ((CurrentDate.getFullYear() - startDate2.getFullYear()) * 12 +
                  CurrentDate.getMonth() -
                  startDate2.getMonth()) %
                  repeatEvery ==
                  0;
            } else if (repeatFrequency == 'YEAR') {
              isDisplayedTodayCalculated =
                startDate2.getDate() == CurrentDate.getDate() &&
                CurrentDate.getMonth() == startDate2.getMonth() &&
                (CurrentDate.getFullYear() - startDate2.getFullYear()) %
                  repeatEvery ==
                  0;
            }
          }
        }
      }

      arr[i].is_displayed_today =
        arr[i].is_displayed_today || isDisplayedTodayCalculated;

      // console.log(arr);
      //console.log("isDisplayedTodayCalculated", isDisplayedTodayCalculated);
      console.log('arr = ', arr);
      if (isDisplayedTodayCalculated) {
        //console.log("today is the day");
        tempStartTime.setMonth(curMonth);
        tempEndTime.setMonth(curMonth);
        tempStartTime.setDate(curDate2.date());
        tempEndTime.setDate(curDate2.date());
        tempStartTime.setFullYear(curYear);
        tempEndTime.setFullYear(curYear);
      }

      let startDate = moment(tempStartTime);
      console.log('repeat',tempStartTime);
      let endDate = moment(tempEndTime);
      console.log('repeat', tempStartTime);
      if (
        moment(curDate2).isSameOrAfter(startDate, 'day') &&
        moment(curDate2).isSameOrBefore(endDate, 'day')
      ) {
        if (
          startDate.date() === curDate2.date() &&
          curMonth <= endDate.month() &&
          curMonth >= startDate.month() &&
          curYear <= endDate.year() &&
          curYear >= startDate.year()
        ) {
          if (startDate.hour() === hour) {
            if (startDate.date() === endDate.date()) {
              let minsToMarginTop =
                (tempStartTime.getMinutes() / 60) *
                this.state.pxPerHourForConversion;
              let hourDiff = tempEndTime.getHours() - tempStartTime.getHours();
              let minDiff =
                tempEndTime.getMinutes() / 60 - tempStartTime.getMinutes() / 60;
              let color = 'PaleTurquoise';
              let height =
                (hourDiff + minDiff) * this.state.pxPerHourForConversion;
              sameTimeEventCount++;
              //check if there is already an event there overlapping from another hour
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
              //chnage font size if not enough space
              if (tempEndTime.getHours() - tempStartTime.getHours() < 2) {
                fontSize = 8;
              }

              // change color if more than one event in same time.
              if (sameTimeEventCount <= 1) {
                color = hour % 2 === 0 ? 'PaleTurquoise' : 'lightslategray';
              } else if (sameTimeEventCount === 2) {
                color = 'lightslategray';
              } else {
                color = 'blue';
              }

              if (isDisplayedTodayCalculated) {
                // console.log(
                //   isDisplayedTodayCalculated,
                //   arr[i].title,
                //   tempStartTime,
                //   tempEndTime
                // );
                const [comp_year, comp_month, comp_day] = [
                  parseInt(arr[i].datetime_completed.substring(0, 4)),
                  parseInt(arr[i].datetime_completed.substring(5, 7)),
                  parseInt(arr[i].datetime_completed.substring(8, 10)),
                ];
                const [todayYear, todayMonth, todayDay] = [
                  parseInt(today.format('Y')),
                  parseInt(today.format('M')),
                  parseInt(today.format('D')),
                ];
                console.log('today year', todayYear, todayMonth, todayDay);

                // const [started_year, started_month, started_day] = [parseInt(arr[i].datetime_started.substring(0, 4)),
                //   parseInt(arr[i].datetime_started.substring(5, 7)), parseInt(arr[i].datetime_started.substring(8, 10))];
                const [curr_year, curr_month, curr_day] = [
                  parseInt(curDate2.format('Y')),
                  parseInt(curDate2.format('M')),
                  parseInt(curDate2.format('D')),
                ];
                console.log('today year', curr_year, curr_month, curr_day);
                const start_time = arr[i].start_day_and_time
                  .substring(11)
                  .split(/[:\s+]/);
                // Need to strip trailing zeros because the data in the database
                // is inconsistent about this
                if (start_time[0][0] == '0') start_time[0] = start_time[0][1];
                const end_time = arr[i].end_day_and_time
                  .substring(11)
                  .split(/[:\s+]/);
                // Need to strip trailing zeros because the data in the database
                // is inconsistent about this
                if (end_time[0][0] == '0') end_time[0] = end_time[0][1];
                let newElement = (
                  <div key={'event' + i}>
                    <div
                      className="clickButton"
                      data-toggle="tooltip"
                      data-placement="right"
                      title={
                        arr[i].title +
                        '\nStart: ' +
                        tempStartTime +
                        '\nEnd: ' +
                        tempEndTime
                      }
                      key={i}
                      style={{
                        zIndex: this.state.zIndex,
                        marginTop: minsToMarginTop + 'px',
                        padding: '3px',
                        fontSize: fontSize + 'px',
                        // border: '1px lightgray solid ',
                        border:
                          this.props.highLight === arr[i].title
                            ? '2px solid #FF6B4A '
                            : '',
                        float: 'left',
                        borderRadius: '10px',
                        background:
                          JSON.stringify(start_time) ===
                          JSON.stringify(end_time)
                            ? '#9b4aff'
                            : (curDate2.format('D') === today.format('D')) &
                              (curDate2.format('M') === today.format('M'))
                            ? '#FF6B4A'
                            : arr[i].is_complete
                            ? '#BBC7D7'
                            : 'lightslategray',
                        width: itemWidth + 'px',
                        position: 'absolute',
                        height: height + 'px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      {/* insert border change here: */}
                      <div>
                        {arr[i].title}
                        {console.log('repeat', arr[i].title)}
                      </div>
                      <div
                        style={{
                          width: '21px',
                          height: '13px',
                          backgroundImage:
                            curr_year === todayYear &&
                            curr_month === todayMonth &&
                            curr_day === todayDay
                              ? arr[i].is_in_progress === true
                                ? `url(${yelloTick})`
                                : arr[i].is_complete === true
                                ? `url(${greenTick})`
                                : ''
                              : '',
                          backgroundRepeat: 'no-repeat',
                        }}
                      ></div>
                    </div>
                  </div>
                );
                // console.log(newElement);
                res.push(newElement);
              }
            } else if (startDate.date() !== endDate.date()) {
              let minsToMarginTop =
                (tempStartTime.getMinutes() / 60) *
                this.state.pxPerHourForConversion;
              let hourDiff = 24 - tempStartTime.getHours();
              let minDiff = 0;
              let color = 'lightslategray';
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
                        e.target.style.color = 'white';
                        e.target.style.background = 'skyblue';
                        e.target.style.zIndex = '2';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.zIndex = '1';
                        e.target.style.color = '#000000';
                        e.target.style.background = color;
                      }}
                      key={i}
                      style={{
                        zIndex: this.state.zIndex,
                        marginTop: minsToMarginTop + 'px',
                        padding: '5px',
                        fontSize: fontSize + 'px',
                        border: '10px solid red ',
                        float: 'left',
                        borderRadius: '15px',
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
        } else if (hour === 0) {
          if (
            endDate.date() === curDate2.date() &&
            curMonth <= endDate.month() &&
            curMonth >= startDate.month() &&
            curYear <= endDate.year() &&
            curYear >= startDate.year()
          ) {
            let minsToMarginTop = 0;
            let hourDiff = tempEndTime.getHours();
            let minDiff = tempEndTime.getMinutes() / 60;
            let height =
              (hourDiff + minDiff) * this.state.pxPerHourForConversion;
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
                      e.target.style.color = 'white';
                      e.target.style.background = 'skyblue';
                      e.target.style.zIndex = '2';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.zIndex = '1';
                      e.target.style.color = '#000000';
                      e.target.style.background = color;
                    }}
                    key={i}
                    style={{
                      zIndex: this.state.zIndex,
                      marginTop: minsToMarginTop + 'px',
                      padding: '5px',
                      fontSize: fontSize + 'px',
                      // border: '1px lightgray solid ',
                      float: 'left',
                      borderRadius: '15px',
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
            startDate.date() < curDate2.date() &&
            endDate.date() > curDate2.date() &&
            curMonth <= endDate.month() &&
            curMonth >= startDate.month() &&
            curYear <= endDate.year() &&
            curYear >= startDate.year()
          ) {
            let minsToMarginTop = 0;
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
                      e.target.style.color = 'white';
                      e.target.style.background = 'skyblue';
                      e.target.style.zIndex = '2';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.zIndex = '1';
                      e.target.style.color = '#000000';
                      e.target.style.background = color;
                    }}
                    key={i}
                    style={{
                      zIndex: this.state.zIndex,
                      marginTop: minsToMarginTop + 'px',
                      padding: '5px',
                      fontSize: fontSize + 'px',
                      // border: '1px lightgray solid ',
                      float: 'left',
                      borderRadius: '15px',
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
      }
    }
    console.log('res_wr = ', res);
    return res;
  };

  timeDisplay = () => {
    //this essentially creates the time row
    let arr = [];
    for (let i = 0; i < 24; ++i) {
      // if (i < 12) {
      arr.push(
        <Row key={'weekEvent' + i} style={{ marginLeft: '3rem' }}>
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
      // } else {
      //   arr.push(
      //     <Row key={'weekEvent' + i}>
      //       <Col
      //         style={{
      //           // borderTop: '1px solid lavender',
      //           // borderRight: '2px solid #b1b3b6',
      //           textAlign: 'right',
      //           // height: this.state.pxPerHour,
      //           height: '55px',
      //           // fluid: true,
      //         }}
      //       >
      //         {i - 12} PM
      //       </Col>
      //     </Row>
      //   );
      // }
      // if (i === 0 || i === 12) {
      //   arr[0] = 12;
      //   arr[12] = 12;
      //   console.log('we found it', arr[0]);
      // }
    }
    // console.log('12 @', arr.valueOf());
    return arr;
  };

  weekViewItems = () => {
    // this creates the events adjusting their div size to reflecting the time it's slotted for
    var res = [];
    var arr = this.props.routines;
    let dic = this.sortRoutines();
    for (let i = 0; i < arr.length; i++) {
      arr[i].is_displayed_today = false;
    }
    for (let i = 0; i < 7; ++i) {
      var arr = [];
      for (let j = 0; j < 24; ++j) {
        arr.push(
          <Container key={'weekRoutine' + i + j}>
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
              >
                {this.getRoutineItemFromDic(i, j, dic)}
              </Col>
            </Row>
          </Container>
        );
      }
      res.push(
        <Col key={'dayRoutine' + i} style={{ borderLeft: '2px solid #b1b3b6' }}>
          {arr}
        </Col>
      );
    }
    return res;
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
                  ? '#FF6B4A'
                  : '',
              /* color:
                (curDate.format('D') === today.getDate().toString()) &
                (curDate.format('M') === (today.getMonth() + 1).toString())
                  ? '#FF6B4A'
                  : '', */
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
                  ? '#FF6B4A'
                  : '',
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
    let today = '';
    switch (new Date().getDay()) {
      case 0:
        today = 'Sunday';
        break;
      case 1:
        today = 'Monday';
        break;
      case 2:
        today = 'Tuesday';
        break;
      case 3:
        today = 'Wednesday';
        break;
      case 4:
        today = 'Thursday';
        break;
      case 5:
        today = 'Friday';
        break;
      case 6:
        today = 'Saturday';
    }
    var dayIndex = 0;
    /* let weekdays = moment.weekdays().map((day) => {
      
      console.log(day);
      console.log(today)
      return (
        <>
          <Col
            key={'routine' + day}
            // className="fancytext"
            style={{
              color: day === today.toString() ? '#FF6B4A' : '',
              textAlign: 'center',
              fontWeight: 'bold',
              //  paddingBottom: '2%',
            }}
          >
            {day}
          </Col>
        </>
      );
    }); */

    return (
      <Container style={{ margin: '0rem' }}>
        <Row style={{ marginLeft: '3rem', marginRight: '-1rem' }}>
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
          style={{ marginLeft: '-5rem', marginRight: '0rem' }}
        >
          <Col>
            <Container style={{ margin: '0', padding: '0', width: '6px' }}>
              {this.timeDisplay()}
            </Container>
          </Col>

          {this.weekViewItems()}
        </Row>
      </Container>
    );
  }
}
function getMonthDay(date) {
  let month = (1 + date.getMonth()).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');
  return month + ' ' + day;
}

function getFormattedDate(date) {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');

  return year + '-' + month + '-' + day;
}

function getNextDayOfTheWeek(day, date) {
  const dayINeed = day; // for Thursday
  const today = date.isoWeekday();
  //console.log("DayINeed, today", dayINeed, today);

  // if we haven't yet passed the day of the week that I need:
  if (today <= dayINeed) {
    // then just give me this week's instance of that day
    var nextDayOfTheWeek = date.day(dayINeed);
    return nextDayOfTheWeek;
  } else {
    // otherwise, give me *next week's* instance of that same day
    var nextDayOfTheWeek = date.add(1, 'weeks').day(dayINeed);
    //console.log("from getNextday", nextDayOfTheWeek.format("L"));
    return nextDayOfTheWeek;
  }
}
function getMonthNumber(str) {
  switch (str) {
    case 'Jan':
      return '01';
    case 'Feb':
      return '02';
    case 'Mar':
      return '03';
    case 'April':
      return '04';
    case 'May':
      return '05';
    case 'Jun':
      return '06';
    case 'Jul':
      return '07';
    case 'Aug':
      return '08';
    case 'Sep':
      return '09';
    case 'Oct':
      return '10';
    case 'Nov':
      return '11';
    case 'Dec':
      return '12';
    default:
      console.log("can't change the month");
      return '';
  }
}
