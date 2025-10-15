"use client";

import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";

interface CountdownTimerProps {
  targetDate: Date;
  showTimer: boolean;
}

export function CountdownTimer({ targetDate, showTimer }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    if (!showTimer) return;

    const updateCountdown = () => {
      const now = new Date();
      const target = new Date(targetDate);

      const totalSeconds = differenceInSeconds(target, now);

      if (totalSeconds <= 0) {
        setTimeRemaining("Starting now");
        return;
      }

      const days = Math.floor(totalSeconds / (24 * 60 * 60));
      const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;

      // Format time components with leading zeros
      const formatTime = (num: number) => num.toString().padStart(2, "0");

      if (totalSeconds > 24 * 60 * 60) {
        // More than 24 hours: show "X Days HH:MM:SS"
        const dayText = days === 1 ? "Day" : "Days";
        setTimeRemaining(
          `${days} ${dayText} ${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`
        );
      } else {
        // 24 hours or less: show only "HH:MM:SS"
        setTimeRemaining(
          `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`
        );
      }
    };

    // Update immediately
    updateCountdown();

    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate, showTimer]);

  if (!showTimer) return null;

  return <span className="font-mono tabular-nums">{timeRemaining}</span>;
}
