"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Report() {
    const [logs, setLogs] = useState([]); // ログデータを格納
    const [userId, setUserId] = useState(""); // ユーザーIDを格納

    // IndexedDBからログを取得する関数
    const fetchLogs = async () => {
        const dbRequest = indexedDB.open("ProgressDB", 1);

        dbRequest.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction("progress", "readonly");
            const store = transaction.objectStore("progress");

            const getAllRequest = store.getAll();

            getAllRequest.onsuccess = function (event) {
                const data = event.target.result;
                if (userId) {
                    // ユーザーIDでフィルタリング
                    const filteredLogs = data.filter((log) => log.userId === userId);
                    setLogs(filteredLogs);
                } else {
                    setLogs(data); // ログデータを状態に保存
                }
            };

            getAllRequest.onerror = function () {
                console.error("ログデータの取得に失敗しました");
            };
        };

        dbRequest.onerror = function () {
            console.error("IndexedDBへの接続に失敗しました");
        };
    };

    // 初回レンダリング時にログを取得
    useEffect(() => {
        fetchLogs();
    }, [userId]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                textAlign: "center",
                padding: "20px",
                backgroundColor: 'rgb(220,220,220)',
            }}
        >
            <h1>This is Report Hierarchy page</h1>

            <div style={{ marginBottom: "20px" }}>
                <label>
                    ユーザーIDでフィルタ:
                    <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="ユーザーIDを入力"
                        style={{ marginLeft: "10px", padding: "5px" }}
                    />
                </label>
                <button
                    onClick={fetchLogs}
                    style={{
                        padding: "5px 10px",
                        marginLeft: "10px",
                        backgroundColor: "blue",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    フィルタを適用
                </button>
            </div>

            {/* ログデータの表示 */}
            <div style={{ marginTop: "20px", maxWidth: "600px", width: "100%" }}>
                <h2>Logs:</h2>
                {logs.length > 0 ? (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {logs.map((log, index) => (
                            <li
                                key={index}
                                style={{
                                    marginBottom: "10px",
                                    padding: "10px",
                                    backgroundColor: "#ffffff",
                                    borderRadius: "5px",
                                    boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                                }}
                            >
                                <strong>ユーザーID:</strong> {log.userId} <br />
                                <strong>類似度スコア:</strong> {log.similarityScore}% <br />
                                <strong>経験値:</strong> {log.experience} <br />
                                <strong>レベル:</strong> {log.level} <br />
                                <strong>タイマー値:</strong> {log.timeElapsed}秒 <br />
                                <strong>保存時間:</strong> {log.timestamp} <br />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No logs found.</p>
                )}
            </div>

            <Link href="/">
                <button
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "blue",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginTop: "20px",
                    }}
                >
                    Go Back to Home Page
                </button>
            </Link>
        </div>
    );
}
