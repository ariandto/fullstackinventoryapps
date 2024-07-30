import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import axios from "axios";
import './index.css';

 
axios.defaults.withCredentials = true;
 
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
