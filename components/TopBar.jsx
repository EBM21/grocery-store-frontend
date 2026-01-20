"use client";
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function TopBar() {
  const [promo, setPromo] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // 1. Fetch Settings
  useEffect(() => {
    fetch("http://localhost:5000/promo")
      .then((res) => res.json())
      .then((data) => setPromo(data))
      .catch((err) => console.error("Promo fetch error", err));
  }, []);

  // 2. Countdown Logic
  useEffect(() => {
    if (!promo || !promo.is_active || !promo.end_time) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(promo.end_time).getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [promo]);

  if (!promo || !promo.is_active) return null;

  return (
    <div style={{ backgroundColor: "#111", color: "white", padding: "10px 20px", textAlign: "center", fontSize: "14px", display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", flexWrap: "wrap" }}>
      <span style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
        <Clock size={16} color="#FFD700" /> {promo.message}
      </span>
      
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <span style={timeBox}>{String(timeLeft.days).padStart(2, '0')}d</span> :
        <span style={timeBox}>{String(timeLeft.hours).padStart(2, '0')}h</span> :
        <span style={timeBox}>{String(timeLeft.minutes).padStart(2, '0')}m</span> :
        <span style={timeBox}>{String(timeLeft.seconds).padStart(2, '0')}s</span>
      </div>
    </div>
  );
}

const timeBox = {
  backgroundColor: "#FFD700",
  color: "#000",
  fontWeight: "bold",
  padding: "2px 6px",
  borderRadius: "4px",
  minWidth: "30px",
  textAlign: "center"
};