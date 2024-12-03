"use client";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import * as tmImage from "@teachablemachine/image";

export default function Home() {
  const randomLetterRef = useRef(null);
  const continueButtonRef = useRef(null);
  const resultRef = useRef(null);
  const webcamContainerRef = useRef(null);
  const labelContainerRef = useRef(null);
  const [classPrediction, setClassPrediction]= useState(null);
  const [isClicked, setIsClicked] = useState(false);
  // let classPrediction;

  let model, webcam, maxPredictions;
  const [count, setCount] = useState(0);
  const [result, setResult] = useState(" ");

  const checkPrediction = () => {
    // classPrediction ve randomLetterRef.current.innerHTML karşılaştırması yapılıyor
    setResult(classPrediction === randomLetterRef.current.innerHTML ? "Doğru" : "Yanlış. Algılanan harf: " + classPrediction);  
    setIsClicked(true);
    if (result === "Doğru") {
      setCount(count++);
    }
  };

  const getRandomLetter = () => {
    const alphabet = "ABCDEFGHIJKLMNOPRSTUVYZ";
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    return alphabet[randomIndex];
  };



  useEffect(() => {
    const URL = "https://teachablemachine.withgoogle.com/models/WHwMp8Ku-/";

    async function init() {
      const modelURL = `${URL}model.json`;
      const metadataURL = `${URL}metadata.json`;

      randomLetterRef.current.innerHTML = getRandomLetter();

      // Modeli yükle
      model = await tmImage.load(modelURL, metadataURL);
      maxPredictions = model.getTotalClasses();

      // Webcam'i başlat
      const flip = true;
      webcam = new tmImage.Webcam(800, 500, flip);
      await webcam.setup();
      await webcam.play();
      setTimeout(() => webcam.pause(), 5000);
      window.requestAnimationFrame(loop);

      // Kamerayı ve etiketleri DOM'a ekle
      webcamContainerRef.current.appendChild(webcam.canvas);
      labelContainerRef.current.innerHTML = "";
      for (let i = 0; i < maxPredictions; i++) {
        const div = document.createElement("div");
        labelContainerRef.current.appendChild(div);
      }

      getContinueButton();
    }

    // const getContinueButton = async () => {
    //   if (webcam) {
    //     console.log("webcam", webcam);
        
    //     await webcam.play();
    //     setTimeout(() => {
    //       webcam.pause();
    //     }, 5000);
    //     randomLetterRef.current.innerHTML = getRandomLetter();
    //   }
    // };

    function getContinueButton() {
      continueButtonRef.current.addEventListener("click", async () => {
        await webcam.play();
        setTimeout(() => {
          webcam.pause();
        }, 5000);
        randomLetterRef.current.innerHTML = getRandomLetter();
        setIsClicked(false);
        setResult(" ");
      });
    }

    async function loop() {
      webcam.update();
      await predict();
      window.requestAnimationFrame(loop);
    }

    async function predict() {
      const prediction = await model.predict(webcam.canvas);
      let max = 0;
      

      for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].probability > prediction[max].probability) {
          max = i;
        }
      }
      // classPrediction = prediction[max].className;
      setClassPrediction(prediction[max].className);
      // labelContainerRef.current.innerHTML = "Algılanan Harf: " + prediction[max].className;

    }

    init();
    return () => {
      if (webcam) {
        webcam.stop(); // Webcam'i durdur.
        webcam = null; // Bellekte temizle.
      }
    };
  }, []);

  return (
    <>
      <Head>
        
        <script
          src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js"
          defer
        ></script>
        <script
          src="https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js"
          defer
        ></script>
      </Head>
      <div className="quiz-page-content">
        <div style={{textAlign:"center"}}>
          <button type="button" className="start-btn">Start</button>
        </div>

        <div className="random-letter-bar">
          <div style={{display:"flex", gap:"10px", alignItems:"center"}}>
            <h2>İstenilen Harf: </h2>
            <div ref={randomLetterRef}></div>
          </div>

          <div id="label-container" ref={labelContainerRef}></div>
          <div>doğru sayısı: {count}</div>
        </div>
        
        <div id="webcam-container" ref={webcamContainerRef} className="webcam-bar"> </div>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          {
            isClicked ?
            <div id="result">Sonuç : {result}</div> 
            :
            <button onClick={checkPrediction} className="check-btn">Kontrol et</button> 

          }
          <button type="button" id="continue-btn" ref={continueButtonRef} className="continue-btn">
            Continue
          </button>
        </div>
      </div>
    </>
  );
}
