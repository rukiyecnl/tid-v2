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
  // let classPrediction;

  let model, webcam, maxPredictions;

  const [result, setResult] = useState("");

  const checkPrediction = () => {
    // classPrediction ve randomLetterRef.current.innerHTML karşılaştırması yapılıyor
    setResult(classPrediction === randomLetterRef.current.innerHTML ? "Correct" : "Incorrect");
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
      webcam = new tmImage.Webcam(200, 200, flip);
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
      labelContainerRef.current.innerHTML = prediction[max].className;

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
      <div>
        <div>Teachable Machine Image Model</div>
        <button type="button">Start</button>

        <div>
          <h2>Rastgele bir harf: </h2>
          <div ref={randomLetterRef}></div>
        </div>
        
        <div id="webcam-container" ref={webcamContainerRef}></div>
        <div id="label-container" ref={labelContainerRef}></div>
        <button onClick={checkPrediction}>Check Prediction</button>
        <div id="result">sonuç : {result}</div>
        <button type="button" id="continue-btn" ref={continueButtonRef}>
          Continue
        </button>
      </div>
    </>
  );
}
