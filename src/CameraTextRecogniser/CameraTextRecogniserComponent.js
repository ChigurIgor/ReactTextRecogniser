import styles from './styles.module.css'
import React, {useEffect, useRef, useState} from "react";
import {createWorker} from "tesseract.js";
import preprocessImage from "../preprocessImage";
import Webcam from "react-webcam";
const CameraTextRecogniser = () =>{
    const {wrapper, canvas: canvasStyle,canvasCroppedWrapper, canvasCropped:canvasCroppedStyle,cameraWrapper, areaWrapper,area, imageWrapper} = styles;
    const { innerWidth: windWidth, innerHeight: windHeight } = window;
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState();
    const [text, setText] = useState("");
    const [level, setLevel] = useState(0.3);
    const [cameraFacingMode, setCameraFacingMode] = useState({ exact: "environment" })
    const canvasRef = useRef(null);
    const imageRef = useRef(null);
    const canvasCroppedRef  = useRef(null);

    const cameraStyle = {
        height: windWidth,
        width: windWidth
    }

    const worker = createWorker({
        // logger: m => console.log(m)
    });

    const videoConstraints = {
        // facingMode: "user"
        facingMode: cameraFacingMode
    };
    const capture = React.useCallback(
        () => {
            setImgSrc(webcamRef.current.getScreenshot());
        },
        [webcamRef]
    );

    useEffect(()=> recognizeText(imgSrc, level), [imgSrc, level]);

    const recognizeText = (imgSrc, level) => {

        if (imgSrc) {

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            canvas.height = imageRef.current.height;
            canvas.width = imageRef.current.width;
            ctx.drawImage(imageRef.current, 0, 0);
            ctx.putImageData(preprocessImage(canvas, level), 0, 0);
            // const dataUrl = canvas.toDataURL("image/jpeg")
            //
            // var imageObj = canvasRef.current;
            const canvasCropped = canvasCroppedRef.current;
            const ctxCropped = canvasCropped.getContext('2d');
            console.log(canvas.width);
            console.log(canvas.height);

            const sourceX = canvas.width * 0.3;
            const sourceY = canvas.height * 0.3;
            const sourceWidth = canvas.width * 0.4;
            const sourceHeight = canvas.height * 0.4;
            const destWidth = windWidth;
            const destHeight = windWidth;
            const destX = 0;
            const destY = 0;
            ctxCropped.drawImage(canvasRef.current, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
            // ctxCropped.putImageData(preprocessImage(canvasCropped, level),0,0);
            const dataUrl = canvasCropped.toDataURL("image/jpeg")


            if (dataUrl) {
                (async () => {
                    await worker.load();
                    await worker.loadLanguage('eng');
                    await worker.initialize('eng');
                    // const { data: { text } } = await worker.recognize(imgSrc);
                    const {data: {text}} = await worker.recognize(dataUrl);
                    console.log(text);
                    setText(text);
                    await worker.terminate();
                })();
            }
        }
    }
    const switchCameraFacingMode = (facingMode) =>{
        (facingMode === 'user') ? setCameraFacingMode({ exact: 'environment' }) : setCameraFacingMode('user')
    }

    return(
        <div className={wrapper}>
            <div className={cameraWrapper}>
                <div className={areaWrapper}>
                    <div className={area}>

                    </div>
                </div>

                <Webcam
                    videoConstraints={videoConstraints}
                    style={cameraStyle}
                    // style={{height:'200px'}}
                    audio={false}
                    // height={720}
                    ref={webcamRef}
                    // width={1280}
                    screenshotFormat="image/jpeg"
                    imageSmoothing = {true}
                    screenshotQuality = {1}
                />
            </div>


            <button  onClick={() => switchCameraFacingMode(cameraFacingMode)}>
                Switch Camera
            </button>
            <button  onClick={capture}>
                Capture
            </button>
            <div className={imageWrapper}>
                <img style={{height:'40vh'}} alt="captured" src={imgSrc} ref={imageRef}/>
            </div>

            <canvas
                ref={canvasRef}
                className={canvasStyle}
            ></canvas>
            <div className={canvasCroppedWrapper}>
            <canvas
                width={windWidth}
                height={windWidth}
                ref={canvasCroppedRef}
                // style={cameraStyle}
                className={canvasCroppedStyle}
            ></canvas>
            </div>
            <p>{text}</p>
            <input type={"number"} value={level} onChange={(event)=>{setLevel(event.target.value)}}/>

        </div>
    )
}
export default CameraTextRecogniser;