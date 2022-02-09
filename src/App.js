import './App.css';
import Webcam from "react-webcam";
import React, {useRef, useState, useCallback, createRef, useEffect} from 'react';
import { createWorker } from 'tesseract.js';
import preprocessImage from './preprocessImage';
import CameraTextRecogniser from "./CameraTextRecogniser/CameraTextRecogniserComponent";


function App() {


  return (
    <div className="App">
        <CameraTextRecogniser/>
    </div>
  );
}

export default App;
