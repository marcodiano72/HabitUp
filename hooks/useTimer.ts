// hooks/useTimer.ts
import { useState, useEffect, useRef, useCallback } from 'react';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';

interface UseTimerReturn {
  timeLeft: number;
  status: TimerStatus;
  progress: number; // 0–1
  start: (seconds: number) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  formatTime: (secs: number) => string;
}

export function useTimer(): UseTimerReturn {
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const start = useCallback((seconds: number) => {
    clear();
    setTotalSeconds(seconds);
    setTimeLeft(seconds);
    setStatus('running');
  }, []);

  const pause = useCallback(() => {
    if (status === 'running') {
      clear();
      setStatus('paused');
    }
  }, [status]);

  const resume = useCallback(() => {
    if (status === 'paused') {
      setStatus('running');
    }
  }, [status]);

  const reset = useCallback(() => {
    clear();
    setTimeLeft(0);
    setTotalSeconds(0);
    setStatus('idle');
  }, []);

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clear();
            setStatus('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return clear;
  }, [status]);

  const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progress = totalSeconds > 0 ? (totalSeconds - timeLeft) / totalSeconds : 0;

  return { timeLeft, status, progress, start, pause, resume, reset, formatTime };
}
