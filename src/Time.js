import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Select from 'react-select';
import dayjs from 'dayjs';
import 'dayjs/locale/en'; // Import the desired locale for dayjs
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment-timezone';
import Tablein from './Tablein';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
// import { Schedule } from '@mui/icons-material';


const timezones = moment.tz.names().map(tz => ({ value: tz, label: tz }));

const TimezoneInput = ({ handleTimezoneChange, selectedTimezone }) => {
  return (
    <div>
      <label>Select Timezone:</label>
      <Select
        className='timezone'
        value={selectedTimezone}
        onChange={handleTimezoneChange}
        options={timezones}
      />
    </div>
  );
};

function Time() {
  const [selectedTimezone, setSelectedTimezone] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleTimezoneChange = (selectedOption) => {
    setSelectedTimezone(selectedOption);
  };

  const [weeklySchedule, setWeeklySchedule] = useState([
    { day: 'Sunday', value: [] },
    { day: 'Monday', value: [] },
    { day: 'Tuesday', value: [] },
    { day: 'Wednesday', value: [] },
    { day: 'Thursday', value: [] },
    { day: 'Friday', value: [] },
    { day: 'Saturday', value: [] }
  ]);
  console.log(weeklySchedule)
  const handleTimeClick = (index) => {
    setWeeklySchedule((prevSchedule) => {
      const updatedSchedule = [...prevSchedule];
      const daySchedule = updatedSchedule[index];
      daySchedule.value.push({
        startTime: '',
        endTime: ''
      });
      return updatedSchedule;
    });
  };

  const handleClick = (event, day) => {
    setAnchorEl(event.currentTarget);
    setSelectedDay(day);
  };

  const handleClose = (itemName, index) => {
    setAnchorEl(null);

    const selectedDayObject = weeklySchedule.find(
      (daySchedule) => daySchedule.day === selectedDay
    );

    const copyData = selectedDayObject.value;

    const updatedSchedule = weeklySchedule.map((daySchedule) => {
      if (daySchedule.day === itemName.day) {
        return {
          ...daySchedule,
          value: [...copyData], // Create a new array with the copied values
        };
      }
      return daySchedule;
    });

    setWeeklySchedule(updatedSchedule);
  };

  const handleTimeChange = (dayIndex, slotIndex, field, newValue) => {
    setWeeklySchedule((prevSchedule) => {
      const updatedSchedule = [...prevSchedule];
      updatedSchedule[dayIndex].value[slotIndex][field] = newValue;
      return updatedSchedule;
    });
  };


  // const handleTimeChange = (dayIndex, slotIndex, field, newValue) => {
  //   setWeeklySchedule((prevSchedule) => {
  //     const updatedSchedule = [...prevSchedule];
  //     const formattedTime = newValue ? newValue.format('HH:mm') : null;
  //     updatedSchedule[dayIndex].value[slotIndex][field] = formattedTime;
  //     console.log(updatedSchedule)
  //     return updatedSchedule;
  //   });
  // };


  const handleDeleteTime = (dayIndex, slotIndex) => {
    setWeeklySchedule((prevSchedule) => {
      const updatedSchedule = [...prevSchedule];
      updatedSchedule[dayIndex].value.splice(slotIndex, 1);
      return updatedSchedule;
    });
  };

  const navigate = useNavigate();
  const handelcreate = () => {
    const dataToSave = {
      name: '',
      weeklySchedule: weeklySchedule,
    };

    axios.post("https://tinemaker-92d13-default-rtdb.firebaseio.com/weeklySchedule.json", dataToSave)
      .then(responce => {
        navigate("/tablein")
      })
      .catch(error => {
        console.log(error)
      });
  };


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='allllllllll'>
        <div>
          <TextField id="outlined-basic" className='namefild' label="name" variant="outlined" />
        </div>
        <div className='timezoneclass'>
          <TimezoneInput
            className="timezone"
            selectedTimezone={selectedTimezone}
            handleTimezoneChange={handleTimezoneChange}
          />
        </div>
        <div className='carddiv'>
          {weeklySchedule.map((daySchedule, dayIndex) => (
            <div className="card" key={dayIndex} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className='allday'>
              <h4>{daySchedule.day}</h4>
              <div>
                {daySchedule.value.length === 0 ? (
                  <div className='alllabel'>Unavailable</div>
                ) : (
                  daySchedule.value.map((timeSlot, slotIndex) => (
                    <div key={slotIndex} className="all">
                      <div className='timed'>
                        <TimePicker
                          className='starttime'
                          label="start time"
                          value={timeSlot.startTime || null}
                          onChange={(newValue) => handleTimeChange(dayIndex, slotIndex, 'startTime', newValue)}
                        />
                        <TimePicker
                          className='endtime'
                          label="end time"
                          value={timeSlot.endTime || null}
                          onChange={(newValue) => handleTimeChange(dayIndex, slotIndex, 'endTime', newValue)}
                        />
                      </div>
                      <DeleteIcon onClick={() => handleDeleteTime(dayIndex, slotIndex)} />
                    </div>
                  ))
                )}
              </div>
              <AddCircleOutlineIcon className='icon' onClick={() => handleTimeClick(dayIndex)} />
              <ContentCopyIcon
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={(event) => handleClick(event, daySchedule.day)}
              />
            </div>
          ))}
        </div>
        {/* <div>
          <button className='btncreate' onClick={handelcreate}>create</button>
        </div> */}
        <button class="btn" onClick={handelcreate}>
          <div class="wrapper">
            <p class="text">Submit
            </p>

            <div class="flower flower1">
              <div class="petal one"></div>
              <div class="petal two"></div>
              <div class="petal three"></div>
              <div class="petal four"></div>
            </div>
            <div class="flower flower2">
              <div class="petal one"></div>
              <div class="petal two"></div>
              <div class="petal three"></div>
              <div class="petal four"></div>
            </div>
            <div class="flower flower3">
              <div class="petal one"></div>
              <div class="petal two"></div>
              <div class="petal three"></div>
              <div class="petal four"></div>
            </div>
            <div class="flower flower4">
              <div class="petal one"></div>
              <div class="petal two"></div>
              <div class="petal three"></div>
              <div class="petal four"></div>
            </div>
            <div class="flower flower5">
              <div class="petal one"></div>
              <div class="petal two"></div>
              <div class="petal three"></div>
              <div class="petal four"></div>
            </div>
            <div class="flower flower6">
              <div class="petal one"></div>
              <div class="petal two"></div>
              <div class="petal three"></div>
              <div class="petal four"></div>
            </div>
          </div>
        </button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {weeklySchedule
            .filter((itemName) => itemName.day !== selectedDay) // Filter out the selected day
            .map((itemName, index) => (
              <MenuItem key={itemName.id} onClick={() => handleClose(itemName, index)}>
                {itemName.day}
              </MenuItem>
            ))
          }
        </Menu>
      </div>
    </LocalizationProvider>
  );
}

export default Time;
