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
    // const msgArr = [];

    const [text, setText] = useState('');
    const [userName, setUserName] = useState('');
    const [msgArr, setMsgArr] = useState([]);

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
                // console.log('packet');

            });

            engine.on("packetCreate", ({ type, data }) => {
                // called for each packet sent
                // console.log('packetCreate');

            });

            engine.on("drain", () => {
                // called when the write buffer is drained
                // console.log('drain');

            });

            engine.on("close", (reason) => {
                // called when the underlying connection is closed
                console.log('close');
            });
            engine.on("data", (data) => {
                console.log(data);
                let croppedData = data.substring(1);
                console.log(croppedData);
                croppedData = JSON.parse(croppedData);
                console.log(croppedData);
                const payload = croppedData[1];
                console.log(payload);
                const {userName:userNameSender, msg} = payload;
                console.log(userNameSender, msg);
                msgArr.push(payload);
                console.log(msgArr)
                setMsgArr([...msgArr])
                // setMsgArr([...msgArr,{userName:userNameSender, msg:msg}])
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
    if(userName && text) {
        socket.emit('data', {userName: userName, msg: text});
        setText('');
    }
}


  return (
    <div className="App">
        <CameraTextRecogniserSmall/>
        <div>
            {msgArr.map((payload,index) => <p key={index}>msg: {payload.userName}  //  {payload.msg}</p>)}
        </div>
        <input
            type={"text"}
            onChange={({target:{value}})=>setUserName(value)}
            placeholder={'UserName'}
            value={userName}
        />
        <input
            type={"text"}
            onChange={({target:{value}})=>setText(value)}
            placeholder={'Type your message here'}
            value={text}/>
        <button onClick={()=>sendMessage()}>Send</button>
    </div>
  );
}

export default App;
