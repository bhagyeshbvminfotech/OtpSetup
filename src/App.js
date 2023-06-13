
import React, { Component } from 'react';
// import { BrowserRouter, Route, Switch, Routes } from 'react-router-dom';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';
import Tablein from './Tablein';
import Time from './Time';
import Otpvrifiction from './Otpvrifiction';


function App() {
  return (
    <>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Time />} />
            <Route path="/tablein" element={<Tablein />} />
            <Route path="/otpvrifiction" element={<Otpvrifiction />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
