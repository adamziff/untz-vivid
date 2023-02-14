import React, { useState, useRef, useEffect } from 'react';

const BarChart: React.FC = () => {
  const [bars, setBars] = useState<number[]>([10, 20, 30, 40]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleBarChange = (index: number, newValue: number) => {
    setBars(prevBars => {
      const updatedBars = [...prevBars];
      updatedBars[index] = newValue;
      return updatedBars;
    });
  };

  const handleAddBar = () => {
    setBars(prevBars => [...prevBars, 0]);
  };

  const handleRemoveBar = () => {
    setBars(prevBars => prevBars.slice(0, prevBars.length - 1));
  };

  const handleBarMouseDown = (index: number, event: React.MouseEvent) => {
    const initialValue = bars[index];
    const initialY = event.clientY;

    const handleMouseMove = (event: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const newValue = initialValue + event.clientY - initialY < 100 ? initialValue + event.clientY - initialY : 100;
      handleBarChange(index, newValue);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', handleMouseMove);
    });
  };

  const handleTouchStart = (index: number, event: React.TouchEvent) => {
    const initialValue = bars[index];
    const initialY = event.touches[0].clientY;

    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      const container = containerRef.current;
      if (!container) return;

      const newValue = initialValue + event.touches[0].clientY - initialY < 100 ? initialValue + event.touches[0].clientY - initialY : 100;
      handleBarChange(index, newValue);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', () => {
      document.removeEventListener('touchmove', handleTouchMove);
    });
  };

  return (
    <div className="styles.container flex flex-col h-40" ref={containerRef}>
      <h1 className="text-center py-3 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r to-red-500 from-blue-500">
        ~energy curve~
      </h1>
      <div className="-mx-1 flex flex-row">
          <div
            className="w-full mx-1 p-2 bg-black align-bottom"
            style={{ height: 100}}  // subtract the bar height from 100
          />
        {bars.map((bar, index) => (
          <div
            key={index}
            className="w-full mx-1 p-2 bg-gray-300 align-bottom"
            style={{ height: `${bar}px`}}  // subtract the bar height from 100
            onMouseDown={event => handleBarMouseDown(index, event)}
            onTouchStart={event => handleTouchStart(index, event)}
          />
        ))}
        <div
            className="w-full mx-1 p-2 bg-black align-bottom"
            style={{ height: 100}}  // subtract the bar height from 100
          />
      </div>
      <div className="flex flex-row justify-between mt-2">
        <button className="btn btn-blue" onClick={handleAddBar}>
          +
        </button>
        <button className="btn btn-red" onClick={handleRemoveBar}>
          -
        </button>
      </div>
    </div>
  );
};

export default BarChart;