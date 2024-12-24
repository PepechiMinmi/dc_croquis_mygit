"use client";
import React, { useState, useRef, useEffect } from "react";

const DrawingApp = () => {
  const [userId, setUserId] = useState(""); // ユーザーID
  const [randomImage, setRandomImage] = useState(null); // ランダム画像
  const [score, setScore] = useState("-");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isGameActive, setIsGameActive] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("1"); // 選択された難易度
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  // 難易度別画像リストの生成
  const difficultyImages = {
    beginner: Array.from({ length: 10 }, (_, i) => `images/beginner/beginner${i + 1}.png`),
    intermediate: Array.from({ length: 10 }, (_, i) => `images/intermediate/intermediate${i + 1}.png`),
    advanced: Array.from({ length: 10 }, (_, i) => `images/advanced/advanced${i + 1}.png`),
  };

  // 選択された難易度に応じて画像を設定
  const loadRandomImage = () => {
    let images = [];
    if (selectedLevel === "1") {
      images = difficultyImages.beginner;
    } else if (selectedLevel === "2") {
      images = difficultyImages.intermediate;
    } else if (selectedLevel === "3") {
      images = difficultyImages.advanced;
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];
    setRandomImage(randomImage);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 600;
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 3;
    contextRef.current = context;
    loadRandomImage(); // 初期画像を読み込み
  }, []);

  useEffect(() => {
    loadRandomImage(); // 難易度が変更されたときに画像を更新
  }, [selectedLevel]);

  // 残り時間を管理
  useEffect(() => {
    let timer;
    if (isGameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsGameActive(false);
      alert("時間切れです！");
    }
    return () => clearInterval(timer);
  }, [isGameActive, timeLeft]);

  // 描画の開始
  const startDrawing = ({ nativeEvent }) => {
    if (!isGameActive) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  // 描画
  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  // 描画の終了
  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  // ゲームの開始
  const startGame = () => {
    if (!userId) {
      alert("ユーザーIDを入力してください！");
      return;
    }
    setIsGameActive(true);
    setTimeLeft(60);
    loadRandomImage(); // 新しいランダム画像を設定
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height); // キャンバスをリセット
  };

  // 類似度を計算
  const calculateSimilarity = (image1, canvas) => {
    const canvas1 = document.createElement("canvas");
    const ctx1 = canvas1.getContext("2d");
    const ctx2 = canvas.getContext("2d");

    canvas1.width = 800;
    canvas1.height = 600;
    ctx1.drawImage(image1, 0, 0, 800, 600);

    const data1 = ctx1.getImageData(0, 0, 800, 600).data;
    const data2 = ctx2.getImageData(0, 0, 800, 600).data;

    let diff = 0;
    for (let i = 0; i < data1.length; i += 4) {
      diff += Math.abs(data1[i] - data2[i]);
      diff += Math.abs(data1[i + 1] - data2[i + 1]);
      diff += Math.abs(data1[i + 2] - data2[i + 2]);
    }

    const maxDiff = 255 * 3 * (data1.length / 4);
    return 1 - diff / maxDiff;
  };

  // 描画結果を提出
  const submitDrawing = () => {
    const canvas = canvasRef.current;
    const randomImgElement = document.getElementById("randomImage");

    const similarity = calculateSimilarity(randomImgElement, canvas);
    const scorePercentage = Math.round(similarity * 100);
    setScore(scorePercentage);

    alert(`類似度スコア: ${scorePercentage}%`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <style jsx>{`
        div {
          display: flex;
          gap: 20px;
          margin: auto;
        }

        main {
          background-color: #f9f9f9;
          flex: 2;
          padding: 10px;
          border: 1px solid #ccc;
          margin-right: auto;
        }

        aside {
          flex: 1;
          padding: 10px;
          border: 1px solid #ccc;
          background-color: #f9f9f9;
          margin-right: auto;
        }

        canvas {
          border: 1px solid black;
        }
      `}</style>
      <div>
        <main>
          <label>
            ユーザーID:
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </label>
          <br />
          <label>
            難易度を選択:
            <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
              <option value="1">初心者</option>
              <option value="2">中級者</option>
              <option value="3">上級者</option>
            </select>
          </label>
          <h3>ランダム画像</h3>
          <img id="randomImage" src={randomImage} alt="ランダム画像" />
        </main>
        <aside>
          <h3>描画キャンバス</h3>
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={finishDrawing}
            onMouseLeave={finishDrawing}
            style={{ width: "800px", height: "600px" }}
          ></canvas>
          <p>類似度スコア: {score}</p>
          <p>残り時間: {timeLeft}秒</p>
          <button onClick={startGame}>ゲームを開始</button>
          <button onClick={submitDrawing} disabled={!isGameActive}>
            提出して類似度を測定
          </button>
        </aside>
      </div>
    </div>
  );
};

export default DrawingApp;
