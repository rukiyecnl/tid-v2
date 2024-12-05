"use client";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import * as tmImage from "@teachablemachine/image";
import Modal from "../components/Modal";

export default function Home() {
  const randomLetterRef = useRef(null);
  const continueButtonRef = useRef(null);
  const resultRef = useRef(null);
  const webcamContainerRef = useRef(null);
  const labelContainerRef = useRef(null);
  const quizPageRef = useRef(null);
  const FalseCountref = useRef(null);
  const closeBtnRef = useRef(null);
  const [classPrediction, setClassPrediction]= useState(null);
  const [isClicked, setIsClicked] = useState(false);
  // let classPrediction;

  let model, webcam, maxPredictions;
  const [TrueCount, setTrueCount] = useState(0);
  const [FalseCount, setFalseCount] = useState(0);
  const [result, setResult] = useState(" ");
  const[isFinished, setIsFinished] = useState(false);
  const [timeCount, setTimeCount] = useState(5);

  const [isOpen, setIsOpen] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const openModal = () => setIsOpen(true);
  const [no, setNo] = useState(1);

  const closeModal = async () => {
    setIsOpen(false); // Modal'ı kapat
    // await webcam.setup();
    // await webcam.play();
    
    setFalseCount(0); // Yanlış sayısını sıfırla
    setTrueCount(0); // Doğru sayısını sıfırla
    setIsClicked(false); // Kontrol butonunu etkinleştir
    randomLetterRef.current.innerHTML = getRandomLetter(); // Yeni harf ata
  };
  
  const [showContent, setShowContent] = useState(false);
  const checkPrediction = () => {
    
    // classPrediction ve randomLetterRef.current.innerHTML karşılaştırması yapılıyor
    setResult(classPrediction === randomLetterRef.current.innerHTML ? (<span style={{color:"green"}}>Doğru</span>) : (<span style={{color:"red"}}>Yanlış</span>) );  
    setIsClicked(true);

    classPrediction === randomLetterRef.current.innerHTML 
      ? setTrueCount((prevTrueCount) => prevTrueCount+1) 
      : setFalseCount((prevFalseCount) => {
        const newFalseCount = prevFalseCount + 1;
        return newFalseCount;
      });;
  
      if(TrueCount + FalseCount === 9){
        getQuizResult();
      }
      setIsDisabled(false);
  };

  const getQuizResult = () => {
 
      setIsOpen(true);
      setShowContent(true);  
      setNo(1);
    

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
        console.log(typeof webcam);
        
        await webcam.setup();
        await webcam.play();
        setTimeout(() => webcam.pause(), 5000);
        window.requestAnimationFrame(loop);
        // Kamerayı ve etiketleri DOM'a ekle
        webcamContainerRef.current.innerHTML = "";  
        webcamContainerRef.current.appendChild(webcam.canvas);
        labelContainerRef.current.innerHTML = "";
        for (let i = 0; i < maxPredictions; i++) {
          const div = document.createElement("div");
          labelContainerRef.current.appendChild(div);
        }
  
        getContinueButton();
        // closeModal(webcam);
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
          setNo((prevNo) => prevNo + 1);
          await webcam.play();
          setTimeout(() => {
            webcam.pause();
          }, 5000);
          randomLetterRef.current.innerHTML = getRandomLetter();
          setIsClicked(false);
          setResult(" ");
          setIsDisabled(true);
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
    }, [isOpen == false]);

    // useEffect(() => {
    //   if (timeCount === 0) {
    //     // Zaman dolunca otomatik olarak devam düğmesine tıklamayı tetikle
    //     setTimeCount(5); // Yeni soru için sayaç sıfırla
    //   }
    
    //   const timer = setInterval(() => {
    //     setTimeCount((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    //   }, 1000);
    
    //   return () => clearInterval(timer); // Temizlik yap
    // }, [timeCount]);
    
  


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

      <div className="quiz-page-content" ref={quizPageRef}>
        {showContent && (
          <div>
            {/* <button onClick={openModal}>Modal Aç</button> */}
            <Modal isOpen={isOpen} onClose={closeModal}>
              <h2>Test Sonucu</h2>
              <p className="true-count">doğru sayınız: {TrueCount}</p>
              <p className="false-count">yanlış sayınız: {FalseCount}</p>
              <button onClick={closeModal} ref={closeBtnRef} className="close-btn">Kapat</button>
            </Modal>
          </div>
        ) 
          
        }
        <div style={{textAlign:"center"}}>
              <button type="button" className="start-btn" onClick={() => setIsStarted(true)}>Start</button>
            </div>

            <div className="random-letter-bar">
              <div style={{display:"flex", gap:"10px", alignItems:"center"}}>
                
                <h2 className="requested-letter-bar">İstenilen Harf: </h2>
                <div className="requested-letter" ref={randomLetterRef}></div>
              </div>

              <div id="label-container" ref={labelContainerRef}></div>
              <div className="true-false-bar">
                <div className="trueBar"><img src="./check.png" alt="check" /><p>: {TrueCount}</p> </div>
                <div className="falseBar" ref={FalseCountref}><img src="./false.png" alt="false" /> <p>: {FalseCount}</p></div>

              </div>
            </div>

            <div style={{position:"relative"}}>
              <div className="letter-no">Harf : {no}</div>
              <div id="webcam-container" ref={webcamContainerRef} className="webcam-bar"> </div>

            </div>
            
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              {
                isClicked ?
                <div id="result">Sonuç : {result}</div> 
                :
                <button onClick={checkPrediction} className="check-btn">Kontrol et</button> 

              }
              <div>Algılanan harf : {classPrediction}</div>
              <button type="button" id="continue-btn" ref={continueButtonRef} className="continue-btn" disabled={isDisabled} 
                        style={{
                          backgroundColor: isDisabled && "#ccc",
                          color: isDisabled && "#666",
                          cursor: isDisabled ? "not-allowed" : "pointer",
                        }}>
                Continue
              </button>
            </div>

      </div>

    </>
  );
}
