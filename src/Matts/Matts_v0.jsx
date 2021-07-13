import React, {useEffect, useState} from 'react';
//import { useLocation } from 'react-router-dom';
import axios from 'axios';
import DayRoutines from '../Home/DayRoutines';
import VerticalRoutine from './verticalRoutine';

  
export function MainPage() {
    return(VerticalRoutine("100-000072"));
}


export default MainPage;