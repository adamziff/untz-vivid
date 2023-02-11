import React, { useState, useRef, MouseEventHandler } from 'react';

const BarChart: React.FC = () => {
  const [data, setData] = useState([10, 20, 30, 40]);
  const [draggingIndex, setDraggingIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleBarClick = (index: number) => {
    setDraggingIndex(index);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (draggingIndex === -1) {
      return;
    }
    const { clientX } = event;
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const newValue = Math.round((clientX - containerRect.left) / containerRect.width * 100);
    setData((prevData) => {
      const newData = [...prevData];
      newData[draggingIndex] = newValue;
      return newData;
    });
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (draggingIndex === -1) {
      return;
    }
    const { clientX } = event.touches[0];
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const newValue = Math.round((clientX - containerRect.left) / containerRect.width * 100);
    setData((prevData) => {
      const newData = [...prevData];
      newData[draggingIndex] = newValue;
      return newData;
    });
  };

  const handleMouseUp = () => {
    setDraggingIndex(-1);
  };

  const handleTouchEnd = () => {
    setDraggingIndex(-1);
  };

  const handleAddBar = () => {
    setData([...data, 10]);
  };

  const handleRemoveBar = () => {
    setData((prevData) => prevData.slice(0, prevData.length - 1));
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex justify-between items-center mb-4">
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleAddBar}>
          +
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleRemoveBar}
          disabled={data.length === 1}
        >
          -
        </button>
      </div>
            <div
                ref={containerRef}
                className="w-full h-10 bg-gray-300 relative"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                >
                {data.map((value, index) => (
                <div
                    key={index}
                    className="h-full bg-blue-500"
                    style={{ width: `${value}%` }}
                    onMouseDown={() => handleBarClick(index)}
                    onTouchStart={() => handleBarClick(index)}
                />
                ))}
            </div>
        </div>
      );
    };
    
    export default BarChart;
    