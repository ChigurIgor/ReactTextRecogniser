import styles from './styles.module.css'
import React, {useEffect, useRef, useState} from "react";
import {createWorker} from "tesseract.js";
import preprocessImage from "../preprocessImage";
import Webcam from "react-webcam";
const version = 8;
const CameraTextRecogniserSmall = () =>{
    const {wrapper, canvas: canvasStyle,canvasCroppedWrapper, canvasCropped:canvasCroppedStyle,cameraWrapper, areaWrapper,area, imageWrapper} = styles;
    const { innerWidth: windWidth, innerHeight: windHeight } = window;
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState();
    const [text, setText] = useState("");
    const [cameraFacingMode, setCameraFacingMode] = useState({ exact: "environment" })
    const canvasRef = useRef(null);
    const imageRef = useRef(null);
    const canvasCroppedRef  = useRef(null);

    const [status, setStatus] = useState('');
    const [progress, setProgress] = useState(0);
    // const [worker, setWorker ] = useState(createWorker({
    //     logger: m => {
    //         console.log(m);
    //         setStatus(m.status);
    //         setProgress(m.progress);
    //     }
    // }));

    // useEffect(() => {initializeWorker(worker); return async () =>{await worker.terminate();}}, [worker]);

    // const initializeWorker = async (worker) =>{
    //     await worker.load();
    //     await worker.loadLanguage('eng');
    //     await worker.initialize('eng');
    //     setWorker(worker);
    // }

    const checkText = (text) =>{
        if(text.includes('No')) {
            console.log(text);
            let arrayOfStrings = text.split("No");
            let qrText = '' + arrayOfStrings[1];
            qrText = qrText.replace(/-/g, '');
            qrText = qrText.replace(/No/g, '');
            qrText = qrText.replace(/\./g, '');
            console.log(qrText);
            setText(qrText);
        }

    }
    const cameraStyle = {
        height: windWidth,
        width: windWidth
    }


    const videoConstraints = {
        // facingMode: "user"
        facingMode: cameraFacingMode
    };
    const capture = React.useCallback(
        () => {
            setText('');
            setImgSrc(webcamRef.current.getScreenshot());
        },
        [webcamRef]
    );

    useEffect(()=> recognizeText(imgSrc), [imgSrc]);

    const recognizeText = (imgSrc, level) => {

        if (imgSrc) {



            // const canvasCropped = canvasCroppedRef.current;
            // const ctxCropped = canvasCropped.getContext('2d');
            // const sourceX = imageRef.current.width * 0.3;
            // const sourceY = imageRef.current.height * 0.475;
            // const sourceWidth = imageRef.current.width * 0.4;
            // const sourceHeight = imageRef.current.height * 0.15;
            // const destWidth = windWidth;
            // const destHeight = windWidth*0.3;
            // const destX = 0;
            // const destY = 0;
            // ctxCropped.drawImage(canvasRef.current, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
            // ctxCropped.putImageData(preprocessImage(canvasCropped, level),0,0);
            // const dataUrl = canvasCropped.toDataURL("image/jpeg")

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            canvas.height = imageRef.current.height;
            canvas.width = imageRef.current.width;
            ctx.drawImage(imageRef.current, 0, 0);
            // ctx.putImageData(preprocessImage(canvas, level), 0, 0);
            // const dataUrl = canvas.toDataURL("image/jpeg")

            // var imageObj = canvasRef.current;
            const canvasCropped = canvasCroppedRef.current;
            const ctxCropped = canvasCropped.getContext('2d');
            const sourceX = canvas.width * 0.3;
            const sourceY = canvas.height * 0.475;
            const sourceWidth = canvas.width * 0.4;
            const sourceHeight = canvas.height * 0.15;
            const destWidth = windWidth;
            const destHeight = windWidth*0.3;
            const destX = 0;
            const destY = 0;
            ctxCropped.drawImage(canvasRef.current, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
            // ctxCropped.putImageData(preprocessImage(canvasCropped, level),0,0);
            const dataUrl = canvasCropped.toDataURL("image/jpeg")
           const worker = createWorker({
                    logger: m => {
                        console.log(m);
                        setStatus(m.status);
                        setProgress(m.progress);
                    }})

            if (dataUrl) {
                try {
                    (async () => {
                        await worker.load();
                        await worker.loadLanguage('eng');
                        await worker.initialize('eng');
                        console.log(worker);
                        const {data, data: {text, words}} = await worker.recognize(dataUrl);
                        // console.log(data);
                        console.log(words);

                        // const maxConfidence = words.reduce(function(prev, current) {
                        //     return (prev.confidence > current.confidence) ? prev : current
                        // });
                        // console.log(maxConfidence)

                        const filterText = words.filter(word => word.text.includes('No'));
                        console.log(filterText);

                        // Math.max.apply(Math, words.map(function(w) { return w.confidence; }))
                        // words.map(word => )
                        // const {data: {text}} = await worker.recognize(dataUrl);
                        // console.log(text);
                        // setText(maxConfidence.text);

                        await worker.terminate();
                        // checkText(maxConfidence.text);
                        filterText.length>0 && checkText(filterText[0]?.text);
                    })();
                }catch(e){
                    console.log(e)
                };
            }

        }
    }
    const switchCameraFacingMode = (facingMode) =>{
        (facingMode === 'user') ? setCameraFacingMode({ exact: 'environment' }) : setCameraFacingMode('user')
    }

    return(
        <div className={wrapper}>
            <div className={cameraWrapper} onClick={capture}>
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
            {/*<button  onClick={capture}>*/}
            {/*    Capture*/}
            {/*</button>*/}
            <div className={imageWrapper}>
                <img style={{height:'40vh'}} alt="captured" src={imgSrc} ref={imageRef}/>
            </div>
            <h3>version{version}</h3>
            <canvas
                ref={canvasRef}
                className={canvasStyle}
            ></canvas>
            <div className={canvasCroppedWrapper}>
            <canvas
                width={windWidth}
                height={windWidth*0.2}
                ref={canvasCroppedRef}
                // style={cameraStyle}
                className={canvasCroppedStyle}
            ></canvas>

            </div>
            <p>Status: {status}</p>
            <p>Progress: {progress.toFixed(2)*100}%</p>
            <p>{text}</p>
        </div>
    )
}
export default CameraTextRecogniserSmall;