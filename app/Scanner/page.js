"use client";
import { useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { api } from "@/lib/api";
import { redirect } from "next/dist/server/api-utils";

export default function ScannerPage() {
  const scannerRef = useRef(null);

  const [result, setResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const playSound = (type) => {
    new Audio(`/sounds/${type}.mp3`).play();
  };

  const restartScanner = () => {
    setTimeout(() => {
      setResult(null);
      startScanner();
    }, 3000);
  };

  const startScanner = () => {
    if (scannerRef.current) return;

    setIsScanning(true);

    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 450 },
      false
    );

    scannerRef.current = scanner;

    scanner.render(async (decodedText) => {
      try {
        await scanner.clear();
        scannerRef.current = null;
        setIsScanning(false);

        const res = await api("/tickets/verify", "POST", {
          token: JSON.parse(decodedText).token,
        });

        setResult(res);
        console.log(res.status)

        if (res.status === "VALID") {
          playSound("success");
        } else if (res.status === "ALREADY_USED") {
          playSound("warning");
        } else {
          playSound("error");
        }

        restartScanner();
      } catch (error) {
        playSound("error");

        setResult({
          success: false,
          status: "INVALID",
          message: "Invalid QR Code",
        });

        restartScanner();
      }
    }, () => { });
  };

  return (
    <div className=" w-screen min-h-screen h-fit flex justify-center items-center p-6 overflow-x-hidden">
      <div className="w-[50%] h-[60%] bg-gray-800/40 rounded-lg p-5 overflow-x-hidden">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-xl font-bold">CampFeed Event Ticket Scanner</h1>
          <button onClick={startScanner} className="px-4 py-2 bg-green-600 text-white rounded mt-2">Start Scanner</button>
        </div>

        <div id="reader" className="mt-4 overflow-x-hidden"></div>

        {result && (
          <div className="mt-4 p-4 border">
            <p>{result.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}