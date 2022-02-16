import './App.css';
import Webcam from "react-webcam";
import React, {useRef, useState, useCallback, createRef, useEffect} from 'react';
import { createWorker } from 'tesseract.js';
import preprocessImage from './preprocessImage';
import CameraTextRecogniserSmall from "./CameraTextRecogniserSmall/CameraTextRecogniserSmallComponent";
import {dataTest} from './dataTest';
import {dataTestOnlyChanges} from "./dataTestOnlyChanges";
import { io } from "socket.io-client";
const BASE_URL = "https://telegram-bot-lvtech9000.herokuapp.com"
let socket;

function App() {
    const [text, setText] = useState('');
    useEffect( () =>{     socket = io('https://telegram-bot-lvtech9000.herokuapp.com',
        {transports: ['polling']}
    );
        socket.on('news', (data) => {
            console.log(data);
            socket.emit('greating', {response: 'data received'})
        })
        socket.on("connect", () => {
            const engine = socket.io.engine;
            console.log(engine.transport.name); // in most cases, prints "polling"

            engine.once("upgrade", () => {
                // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
                console.log(engine.transport.name); // in most cases, prints "websocket"
            });

            engine.on("packet", ({ type, data }) => {
                // called for each packet received
            });

            engine.on("packetCreate", ({ type, data }) => {
                // called for each packet sent
            });

            engine.on("drain", () => {
                // called when the write buffer is drained
            });

            engine.on("close", (reason) => {
                // called when the underlying connection is closed
            });
            engine.on("data", (data) => {
                console.log(data);
            });
        });
    },[]);




    // ----------------------- AllData Ituran ------------------

    // console.log(dataTest);
    // const arrRows = Object.values(dataTest.rows_data);
    // console.log(arrRows);
    //
    // const aim = 'XWWWJN';
    // const obj = arrRows.find(o => o.Plate === aim);
    // console.log(obj);
    // console.log(obj.Lat);
    // console.log(obj.Lon);
    // console.log(obj.Statuses);

    // ------------------------ Only Changes Ituran  ------------------------------

    // // console.log(dataTestOnlyChanges);
    // const {ResultType, platformIdField_changes, DataTimeStamp} = dataTestOnlyChanges;
    // // console.log(ResultType);
    // // console.log(DataTimeStamp);
    // // console.log(platformIdField_changes)
    // const changesArr = Object.keys(platformIdField_changes).map((key) =>{
    //     const stringArr = key.split('-')
    //     const id = stringArr[0];
    //     const changesName = stringArr[1];
    //     return  Object.assign({ id: id, changesName: changesName,  changes: platformIdField_changes[key] })});
    // console.log(changesArr);
    // // const arr2 = changesArr.map(obj => console.log(Object.entries(obj)));
    // // console.log(arr2);






const sendMessage = () =>{
        socket.emit('data', {msg: text});
        setText('');

    }


  return (
    <div className="App">
        <CameraTextRecogniserSmall/>
        <input type={"text"} onChange={(event)=>setText(event.target.value)} value={text}/>
        <button onClick={()=>sendMessage()}>Send</button>
    </div>
  );
}

export default App;
