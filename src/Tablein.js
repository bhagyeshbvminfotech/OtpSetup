import React, { useState, useEffect } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import axios from 'axios';

function Tablein() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDayName, setSelectedDayName] = useState('');


  useEffect(() => {
    const fetchWeeklySchedule = async () => {
      try {
        const response = await axios.get('https://tinemaker-92d13-default-rtdb.firebaseio.com/weeklySchedule.json');
        const data = response.data;
        if (data) {
          const weeklySchedules = Object.values(data).map(item => item.weeklySchedule);
          setWeeklySchedule(...weeklySchedules);
        }
      } catch (error) {
        console.error('Failed to fetch weekly schedule:', error);
      }
    };
    fetchWeeklySchedule();
  }, []);

  // console.log(weeklySchedule)


  const handleDateChange = (date) => {
    setSelectedDate(date);
    generateTimeSlots(date);
  };

  const generateTimeSlots = (date) => {
    // console.log(date)
    if (date) {
      const selectedDay = dayjs(date).format('dddd');
      setSelectedDayName(selectedDay);
      const dayData = weeklySchedule.find((day) => day.day === selectedDay);


      if (dayData && dayData.value && dayData.value.length > 0) {
        const { value } = dayData;
        const timeSlots = [];
        value.forEach((timeSlot) => {
          const start = dayjs(timeSlot.startTime);
          const end = dayjs(timeSlot.endTime);
          let current = start;

          while (current.isBefore(end)) {
            const formattedTime = current.format('h:mm A');
            timeSlots.push(formattedTime);
            current = current.add(30, 'minute');
          }
        });
        setTimeSlots(timeSlots);
      } else {
        setTimeSlots(['No data available for the selected day.']);
      }
    }
  };


  return (
    <div className="card">
      <div className="card-header">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Select a date" value={selectedDate} onChange={handleDateChange} />
        </LocalizationProvider>
      </div>
      <div className="card-body">
        <h3 className="selected-day">{selectedDayName}</h3>
        <ul className="time-slots">
          {timeSlots.length > 0 ? (
            timeSlots.map((time, index) => <li key={index}>{time}</li>)
          ) : (
            <li>{timeSlots[0]}</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Tablein;
