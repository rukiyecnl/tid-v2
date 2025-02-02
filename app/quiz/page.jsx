"use client";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import * as tmImage from "@teachablemachine/image";
import Modal from "../components/Modal";
import { log } from "@tensorflow/tfjs";

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
  const [timeCount, setTimeCount] = useState(10);

  const [isOpen, setIsOpen] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const openModal = () => setIsOpen(true);
  const [no, setNo] = useState(1);
  let newNo = 1;

  const closeModal = async () => {
    setIsOpen(false); // Modal'ı kapat
    setIsDisabled(true); // Devam düğmesini devre dışı bırak
    // await webcam.setup();
    // await webcam.play();
    
    setFalseCount(0); // Yanlış sayısını sıfırla
    setTrueCount(0); // Doğru sayısını sıfırla
    setIsClicked(false); // Kontrol butonunu etkinleştir
    randomLetterRef.current.innerHTML = getRandomLetter(); // Yeni harf ata
  };
  
  const [showContent, setShowContent] = useState(false);
  const checkPrediction = () => {
    try {
      setResult(classPrediction === randomLetterRef.current.innerHTML ? (<span style={{color:"green"}}>Doğru</span>) : (<span style={{color:"red"}}>Yanlış</span>) );  
      setIsClicked(true);
      classPrediction === randomLetterRef.current.innerHTML 
        ? setTrueCount((prevTrueCount) => prevTrueCount+1) 
        : setFalseCount((prevFalseCount) => {
          const newFalseCount = prevFalseCount + 1;
          return newFalseCount;
        });;
      if (TrueCount + FalseCount === 9) {
        getQuizResult();
      }
      setIsDisabled(false);
    } catch (error) {
      console.error("Tahmin kontrol hatası: ", error);
    }
  };

  const getQuizResult = () => {
 
      setIsOpen(true);
      setShowContent(true);  
      setNo(1);
      setTimeCount(10);
      setIsStarted(false);
    

  };

  const getRandomLetter = () => {
    const alphabet = "ABCDEFGHIJKLMNOPRSTUVYZ";
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    return alphabet[randomIndex];
  };

    
  useEffect(() => {
    if (!isStarted) return;
  
    const URL = "https://teachablemachine.withgoogle.com/models/WHwMp8Ku-/";
    let timer;
  
    async function init() {
      const modelURL = `${URL}model.json`;
      const metadataURL = `${URL}metadata.json`;

      // randomLetterRef.current.innerHTML = getRandomLetter();

      // Modeli yükle
      model = await tmImage.load(modelURL, metadataURL);
      maxPredictions = model.getTotalClasses();
      // Webcam'i başlat
      const flip = true;
      webcam = new tmImage.Webcam(710, 450, flip);
      console.log(typeof webcam);
      if (isStarted) {
        await webcam.setup();
        await webcam.play();
        window.requestAnimationFrame(loop);
        setTimeout(() => webcam.pause(), 10000);
        webcamContainerRef.current.innerHTML = "";  
        webcamContainerRef.current.appendChild(webcam.canvas);
        labelContainerRef.current.innerHTML = "";
      }
      // await webcam.setup();
      // await webcam.play();
      // setTimeout(() => webcam.pause(), 10000);
      window.requestAnimationFrame(loop);
      // Kamerayı ve etiketleri DOM'a ekle
      // webcamContainerRef.current.innerHTML = "";  
      // webcamContainerRef.current.appendChild(webcam.canvas);
      // labelContainerRef.current.innerHTML = "";
      for (let i = 0; i < maxPredictions; i++) {
        const div = document.createElement("div");
        labelContainerRef.current.appendChild(div);
      }

      getContinueButton();
      // closeModal(webcam);
    }

    function getContinueButton() {
      continueButtonRef.current.addEventListener("click", async () => {
        newNo = newNo + 1;
        setNo(newNo);
        setTimeCount(10);
        await webcam.play();
        setTimeout(() => {
          webcam.pause();
        }, 10000);
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
      if (isStarted) {
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

    }
  
    init();
    return () => {
      try {
        if (isStarted) {
          if (webcam) {
            webcam.stop();
            webcam = null;
          }
        }
      } catch (error) {
        console.error("Webcam durdurma hatası: ", error);
      }
    };
  }, [isOpen == false, isStarted]);
  

  useEffect(() => {
    let timer;
  
    if (isStarted) {
      (async () => {
        try {
          await webcam.play();
          window.requestAnimationFrame(loop);
        } catch (error) {
          console.error("Webcam oynatma hatası: ", error);
        }
      })();
  
      setTimeCount(10);
      timer = setInterval(() => {
        setTimeCount((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      try {
        if (webcam) webcam.pause();
      } catch (error) {
        console.error("Webcam duraklatma hatası: ", error);
      }
    }
  
    return () => {
      try {
        clearInterval(timer);
      } catch (error) {
        console.error("Sayaç sıfırlama hatası: ", error);
      }
    };
  }, [isStarted, no]);
    
    const handleStart = async () => {
      try {
        setIsStarted(true);
        if (randomLetterRef.current) {
          randomLetterRef.current.innerHTML = getRandomLetter();
        }
      } catch (error) {
        console.error("Başlatma hatası: ", error);
      }
    };
    
    // const handleContinue = async () => {
    //   setNo((prevNo) => prevNo + 1); // Soru numarasını artır
    //   setTimeCount(10); // Sayaç sıfırla
    //   await webcam.play(); // Kamerayı yeniden başlat
    //   setTimeout(() => webcam.pause(), 10000); // 10 saniye sonra durdur
    //   randomLetterRef.current.innerHTML = getRandomLetter(); // Yeni harf oluştur
    //   setIsClicked(false);
    //   setResult(" ");
    //   setIsDisabled(true); // Devam butonunu devre dışı bırak
    // };

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
          <button type="button" className="start-btn" onClick={handleStart}>Başla</button>
        </div>

        <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginBlock: "20px", gap: "20px"}}>
          <div style={{display: "flex",gap:"10px", alignItems: "center", backgroundColor: "#9DC5FC" , padding: "10px", borderRadius: "10px", color: "#E5F4FB", border: "2px solid #000"}}>
            <h2 className="requested-letter-bar">İstenilen Harf: </h2>
            <div className="requested-letter" ref={randomLetterRef}></div>

          </div>
        </div>

        <div className="random-letter-bar">


          <div id="label-container" ref={labelContainerRef}></div>
          <div className="true-false-bar">
            <div className="trueBar"><img src="./check2.png" alt="check" /><p>: {TrueCount}</p> </div>
            <div className="timer">
              <h3>{timeCount}</h3>
            </div>
            <div className="falseBar" ref={FalseCountref}><img src="./false2.png" alt="false" /> <p>: {FalseCount}</p></div>

          </div>
        </div>

        <div style={{position:"relative", width:"710px", height:"450px", backgroundColor:"#edf6fa", borderRadius:"10px"}}>
          <div className="letter-no">Harf : {no}</div>
          <div id="webcam-container" ref={webcamContainerRef} className="webcam-bar"> </div>

        </div>
        
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"10px"}}>
          {
            isClicked ?
            <div id="result">Sonuç : {result}</div> 
            :
            <button onClick={checkPrediction} className="check-btn">Kontrol et</button> 

          }
          <div className="predicted-letter">Algılanan harf : {classPrediction}</div>
          <button type="button" id="continue-btn" ref={continueButtonRef} className="continue-btn" disabled={isDisabled} 
                    style={{
                      backgroundColor: isDisabled && "#ccc",
                      color: isDisabled && "#666",
                      cursor: isDisabled ? "not-allowed" : "pointer",
                    }}>
            Devam et
          </button>
        </div>

      </div>

    </>
  );
}
