import styles from './styles.module.css'
import React, {useEffect, useRef, useState} from "react";
import {createWorker} from "tesseract.js";
import preprocessImage from "../preprocessImage";
import Webcam from "react-webcam";
const CameraTextRecogniser = () =>{
    const {wrapper, canvas: canvasStyle,canvasCropped:canvasCroppedStyle,cameraWrapper, areaWrapper,area, imageWrapper} = styles;
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
        canvas.height = windWidth;
        canvas.width = windWidth;
        ctx.drawImage(imageRef.current, 0, 0);
        ctx.putImageData(preprocessImage(canvas, level),0,0);
        const dataUrl = canvas.toDataURL("image/jpeg")

        var imageObj = canvasRef.current;
        const canvas2 = canvasCroppedRef.current;
        var context2 = canvas2.getContext('2d');

        var sourceX = canvas.width*0.25;
        var sourceY = canvas.height*0.15;
        var sourceWidth = canvas.width*0.5 ;
        var sourceHeight = canvas.height ;
        var destWidth = sourceWidth;
        var destHeight = 300;
        var destX = 0;
        var destY = 0;
        context2.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
        // context2.putImageData(preprocessImage(canvas2, level),0,0);
        const dataUrl2 = canvas2.toDataURL("image/jpeg")


        if(imgSrc) {
            (async () => {
                await worker.load();
                await worker.loadLanguage('eng');
                await worker.initialize('eng');
                // const { data: { text } } = await worker.recognize(imgSrc);
                const { data: { text } } = await worker.recognize(dataUrl2);
                console.log(text);
                setText(text);
                await worker.terminate();
            })();
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

            <h3>Canvas</h3>
            <canvas
                ref={canvasRef}
                // style={cameraStyle}
                className={canvasStyle}
            ></canvas>
            <canvas
                ref={canvasCroppedRef }
                // style={cameraStyle}
                // className={canvasCroppedStyle}
            ></canvas>
            <p>{text}</p>
            <input type={"number"} value={level} onChange={(event)=>{setLevel(event.target.value)}}/>

        </div>
    )
}
export default CameraTextRecogniser;