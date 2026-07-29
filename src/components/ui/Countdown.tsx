import React, { useState, useEffect } from 'react';

export const Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('November 25, 2026 09:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = targetDate - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="countdown-box">
      <div className="cd-unit"><div className="cd-number">{timeLeft.days}</div><div className="cd-label">Jours</div></div>
      <div className="cd-unit"><div className="cd-number">{timeLeft.hours}</div><div className="cd-label">Heures</div></div>
      <div className="cd-unit"><div className="cd-number">{timeLeft.minutes}</div><div className="cd-label">Minutes</div></div>
      <div className="cd-unit"><div className="cd-number">{timeLeft.seconds}</div><div className="cd-label">Secondes</div></div>
    </div>
  );
};
