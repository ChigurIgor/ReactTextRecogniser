import './App.css';
import Webcam from "react-webcam";
import React, {useRef, useState, useCallback, createRef, useEffect} from 'react';
import { createWorker } from 'tesseract.js';

function App() {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState();
  const [text, setText] = useState("");
    const worker = createWorker({
        logger: m => console.log(m)
    });
    const videoConstraints = {
        // facingMode: "user"
        facingMode: { exact: "environment" }

    };
    const capture = React.useCallback(
      () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
      },
      [webcamRef]
  );

useEffect(()=> recognizeText(imgSrc), [imgSrc]);

   const recognizeText = (imgSrc) =>{
       if(imgSrc) {
           (async () => {
               await worker.load();
               await worker.loadLanguage('eng');
               await worker.initialize('eng');
               const { data: { text } } = await worker.recognize(imgSrc);
               console.log(text);
               setText(text);
               await worker.terminate();
           })();
       }
    }


  return (
    <div className="App">
      <Webcam
          videoConstraints={videoConstraints}
          style={{height:'40vh'}}
          audio={false}
          // height={720}
          ref={webcamRef}
          // width={1280}
          screenshotFormat="image/jpeg"
      />
      <button  onClick={capture}>
        Capture
      </button>
      <img style={{height:'20vh'}} alt="captured" src={imgSrc}/>
      <p>{text}</p>
    </div>
  );
}

export default App;
