import React from 'react';

interface CountdownTimerProps {
  seconds: number;
}

/**
 * Shows a countdown timer in seconds
 */
const CountdownTimer: React.FC<CountdownTimerProps> = ({ seconds }) => {
  return (
    <div className="text-center">
      <p className="text-gray-600 mb-2">Your next harvest is in</p>
      <p className="text-5xl font-bold text-amber-800">{seconds}s</p>
    </div>
  );
};

export default CountdownTimer;
