import './App.css';
import Webcam from "react-webcam";
import React, {useRef, useState, useCallback, createRef, useEffect} from 'react';
import { createWorker } from 'tesseract.js';
import preprocessImage from './preprocessImage';
import CameraTextRecogniserSmall from "./CameraTextRecogniserSmall/CameraTextRecogniserSmallComponent";


function App() {


  return (
    <div className="App">
        <CameraTextRecogniserSmall/>
    </div>
  );
}

export default App;
