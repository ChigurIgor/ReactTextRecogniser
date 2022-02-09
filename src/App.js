import './App.css';
import Webcam from "react-webcam";
import React, {useRef, useState, useCallback, createRef, useEffect} from 'react';
import { createWorker } from 'tesseract.js';
import preprocessImage from './preprocessImage';


function App() {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState();
  const [text, setText] = useState("");
  const [level, setLevel] = useState(0.3);
  const [cameraFacingMode, setCameraFacingMode] = useState({ exact: "environment" })
    const canvasRef = useRef(null);
    const imageRef = useRef(null);
    const worker = createWorker({
        logger: m => console.log(m)
    });
    const videoConstraints = {
        // facingMode: "user"
        facingMode: cameraFacingMode
    };
    const capture = React.useCallback(
      () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
      },
      [webcamRef]
  );

useEffect(()=> recognizeText(imgSrc, level), [imgSrc, level]);

   const recognizeText = (imgSrc, level) =>{
       const canvas = canvasRef.current;
       const ctx = canvas.getContext('2d');
       canvas.height = 720;
       canvas.width = 1080;

       ctx.drawImage(imageRef.current, 0, 0);
       ctx.putImageData(preprocessImage(canvas, level),0,0);
       const dataUrl = canvas.toDataURL("image/jpeg")

       if(imgSrc) {
           (async () => {
               await worker.load();
               await worker.loadLanguage('eng');
               await worker.initialize('eng');
               // const { data: { text } } = await worker.recognize(imgSrc);
               const { data: { text } } = await worker.recognize(dataUrl);
               console.log(text);
               setText(text);
               await worker.terminate();
           })();
       }
    }
    const switchCameraFacingMode = (facingMode) =>{
        (facingMode === 'user') ? setCameraFacingMode({ exact: 'environment' }) : setCameraFacingMode('user')
    }

  return (
    <div className="App">
      <Webcam
          videoConstraints={videoConstraints}
          style={{height:'40vh'}}
          audio={false}
          height={720}
          ref={webcamRef}
          width={1280}
          screenshotFormat="image/jpeg"
          imageSmoothing = {true}
          screenshotQuality = {1}
      />
        <button  onClick={() => switchCameraFacingMode(cameraFacingMode)}>
            Switch Camera
        </button>
      <button  onClick={capture}>
        Capture
      </button>
      <img style={{height:'40vh'}} alt="captured" src={imgSrc} ref={imageRef}/>
        <h3>Canvas</h3>
        <canvas ref={canvasRef} style={{height:'40vh'}}></canvas>
      <p>{text}</p>
        <input type={"number"} value={level} onChange={(event)=>{setLevel(event.target.value)}}/>
    </div>
  );
}

export default App;
