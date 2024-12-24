// app/page.js
"use client";

import { useState } from "react";
import Level from "./home_components/level";
import Time from "./home_components/time";
import Report from "./home_components/report";
import { useRouter } from "next/navigation"; // Next.js の useRouter を使用

export default function Home() {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const router = useRouter(); // ルーターを初期化

  const isFormComplete = selectedLevel && selectedTime;

  const handleStartClick = () => {
    if (isFormComplete) {
      router.push(`/croquis?level=${selectedLevel}&time=${selectedTime}`);
    }
  };

  return (
    <div
      style={{
        display: "flex", // フレックスボックスを使用
        flexDirection: "column", // 縦方向に配置
        justifyContent: "center", // 垂直方向の中央揃え
        alignItems: "center", // 水平方向の中央揃え
        minHeight: "100vh", // 画面全体の高さを確保
        textAlign: "center", // テキストを中央揃え
      }}
    >
      <h1>Welcome to Croquis</h1>
      <p>This is your new home page!</p>

      <Level onLevelSelect={setSelectedLevel} />
      <Time onTimeSelect={setSelectedTime} />

      <button
        onClick={handleStartClick}
        disabled={!isFormComplete}
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          backgroundColor: isFormComplete ? "blue" : "gray",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: isFormComplete ? "pointer" : "not-allowed",
        }}
      >
        Start Croquis !
      </button>

      <Report />
    </div>
  );
}
