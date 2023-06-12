import React, { useState, useEffect } from 'react';
import './otp.css';

function Otpvrifiction() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);

  const handleInputChange = (e, index) => {
    const sanitizedValue = e.target.value.replace(/\D/g, '');
    const updatedOtp = [...otp];
    updatedOtp[index] = sanitizedValue;
    setOtp(updatedOtp);
  };

  const handleSubmit = () => {
    console.log('submit');
  };

  const handleResend = () => {
    setTimer(60);
  };

  const isButtonDisabled = otp.includes('');

  useEffect(() => {
    let countdown;

    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    }

    return () => clearInterval(countdown);
  }, [timer]);

  return (
    <div className="alldiv">
      <div className="allotpdiv">
        {otp.map((value, index) => (
          <input
            key={index}
            className="otp-input"
            type="text"
            maxLength={1}
            value={value}
            onChange={(e) => handleInputChange(e, index)}
          />
        ))}
      </div>
      <div className="timerdiv">
        {timer > 0 ? (
          <span>Resend OTP in {timer} seconds</span>
        ) : (
          <button className="resend-button" onClick={handleResend}>
            Resend OTP
          </button>
        )}
      </div>
      <div className="buttondiv">
        <button
          className={`button-86 ${isButtonDisabled ? 'disabled' : ''}`}
          disabled={isButtonDisabled}
          role="button"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default Otpvrifiction;
