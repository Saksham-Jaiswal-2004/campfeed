"use client";
import { useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { IoCheckmarkCircle, IoAlertCircle, IoCloseCircle } from "react-icons/io5";

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
      { fps: 10, qrbox: { width: 400, height: 400 } },
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
        console.error("Error: ", error);

        setResult({
          success: false,
          status: "INVALID",
          message: "Invalid QR Code",
        });

        restartScanner();
      }
    }, () => {});
  };

  const getResultConfig = () => {
    if (!result) return null;

    if (result.status === "VALID") {
      return {
        icon: <IoCheckmarkCircle className="text-5xl" />,
        className: "border-emerald-800/50 bg-emerald-950/60 text-emerald-200",
        titleClass: "text-emerald-300",
        label: "Ticket Valid",
      };
    }

    if (result.status === "ALREADY_USED") {
      return {
        icon: <IoAlertCircle className="text-5xl" />,
        className: "border-amber-800/50 bg-amber-950/60 text-amber-200",
        titleClass: "text-amber-300",
        label: "Already Used",
      };
    }

    return {
      icon: <IoCloseCircle className="text-5xl" />,
      className: "border-red-800/50 bg-red-950/60 text-red-200",
      titleClass: "text-red-300",
      label: "Invalid Ticket",
    };
  };

  const resultConfig = getResultConfig();

  return (
    <div className="min-h-screen bg-[#020613] text-white">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 pt-28 sm:px-6 lg:px-8">
        <div className="mb-6 border-b border-gray-800 pb-6">
          <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Verification</p>
          <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Event Ticket Scanner</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
            Scan event ticket QR codes to verify attendance and manage entry at venues.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-gray-800 bg-[#020613] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] sm:p-8">
            <div className="mb-5 border-b border-gray-800 pb-5">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Scanner</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Start scanning tickets</h2>
            </div>

            <div id="reader" className="mx-auto mb-6 rounded-2xl border border-gray-800 bg-[#08122b] overflow-hidden"></div>

            <div className="flex gap-3">
              <button
                onClick={startScanner}
                disabled={isScanning}
                className="flex-1 rounded-xl bg-cyan-500 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isScanning ? "Scanning..." : "Start Scanner"}
              </button>
            </div>
          </section>

          <section className="rounded-3xl border border-gray-800 bg-[#020613] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] sm:p-8">
            <div className="mb-5 border-b border-gray-800 pb-5">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Scan Result</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Verification status</h2>
            </div>

            {result ? (
              <div className={`rounded-2xl border px-6 py-8 text-center ${resultConfig?.className}`}>
                <div className="mb-4 flex justify-center">
                  {resultConfig?.icon}
                </div>
                <h3 className={`mb-2 text-2xl font-semibold ${resultConfig?.titleClass}`}>
                  {resultConfig?.label}
                </h3>
                <p className="text-sm leading-6">
                  {result.message}
                </p>
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center rounded-2xl border border-gray-800 bg-[#08122b]">
                <p className="text-center text-gray-400">
                  Scan a ticket QR code to see verification status here.
                </p>
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-gray-800 bg-[#08122b] p-5">
              <div className="mb-3 flex gap-2">
                <div className="flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500" />
                <span className="text-sm text-gray-300">Valid: Ticket can be used</span>
              </div>
              <div className="mb-3 flex gap-2">
                <div className="flex h-3 w-3 items-center justify-center rounded-full bg-amber-500" />
                <span className="text-sm text-gray-300">Already Used: Ticket has been scanned</span>
              </div>
              <div className="flex gap-2">
                <div className="flex h-3 w-3 items-center justify-center rounded-full bg-red-500" />
                <span className="text-sm text-gray-300">Invalid: Ticket not recognized</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}