import React, { useState, useRef, useEffect } from 'react';
import Section from './Section';

interface Props {
  bars: number[]
  setBars: any
}

const BarChart: React.FC<Props> = ({ bars, setBars }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleBarChange = (index: number, newValue: number) => {
    setBars((prevBars: number[]) => {
      const updatedBars = [...prevBars];
      updatedBars[index] = newValue;
      return updatedBars;
    });
  };

  const handleAddBar = () => {
    if (bars.length < 11) {
      setBars((prevBars: number[]) => [...prevBars, 0]);
    }
  };

  const handleRemoveBar = () => {
    if (bars.length > 1) {
      setBars((prevBars: number[]) => prevBars.slice(0, prevBars.length - 1));
    }
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
    <div className="styles.container flex flex-col h-40 w-80" ref={containerRef}>
      <div className='z-20'>
            <Section 
              headerClassName='text-transparent bg-clip-text bg-gradient-to-r to-red-500 from-blue-500' 
              headerText='~energy curve~' 
              tooltipText='this curve determines the order of the songs in the playlist - use it to control the energy flow of your event. bigger bar = more energy in the songs in that section of the playlist. drag the bars up/down to change their size.'
            />
      </div>
      <div className="-mx-1 flex flex-row">
          <div
            className="w-full mx-1 p-2 bg-black align-bottom"
            style={{ height: 100}}  // maintain the height of the element
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
            style={{ height: 100}}  // maintain the height of the element
          />
      </div>
      <div className="flex flex-row justify-between mt-2">
        <button
          className="btn btn-blue text-emerald-300 w-10 h-10 font-bold text-4xl"
          onClick={handleAddBar}
        >
          +
        </button>
        <button
          className="btn btn-red text-red-400 w-10 h-10 text-4xl font-mono"
          onClick={handleRemoveBar}
        >
          -
        </button>
      </div>

    </div>
  );
};

export default BarChart;