"use client";

import PWA from "@/components/pwa/PWA";
import Offline from "@/components/offline";
import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  // const ua = navigator.userAgent;

  // const details = parseUserAgent(ua);

  // console.log(details);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {

    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  console.log(isOnline);
  return (
    <main>
      <h1>Home</h1>
      <div>
        <Image src="/next.svg" alt="hello" height={200} width={200} />
      </div>

      <PWA />

      {isOnline ? <p>You are online</p> : <Offline />}
    </main>
  );
}
