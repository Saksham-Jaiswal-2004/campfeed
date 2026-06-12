"use client";
import { useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { api } from "@/lib/api";

export default function ScannerPage() {
  const [result, setResult] = useState(null);

  const startScanner = () => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 450 },
      false
    );

    scanner.render(async (decodedText) => {
      const res = await api("/tickets/verify", "POST", {
        token: JSON.parse(decodedText).token,
      });

      setResult(res);
    });
  };

  return (
    <div className=" w-screen min-h-screen h-fit flex justify-center items-center p-6 overflow-x-hidden">
      <div className="w-[50%] h-[60%] bg-gray-800/40 rounded-lg p-5 overflow-x-hidden">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-xl font-bold">Ticket Scanner</h1>
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