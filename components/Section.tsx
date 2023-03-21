import { useState, useEffect, useRef } from 'react';

interface SectionProps {
  headerText: string;
  tooltipText: string;
  headerClassName?: string;
}

function Section({ headerText, tooltipText, headerClassName }: SectionProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    }

    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [tooltipRef]);

  return (
    <div className="p-2 relative">
      <div className="relative">
        <h2 className={`text-3xl font-bold pt-4 inline-flex ${headerClassName}`}>{headerText}</h2>
        <div className="relative inline-flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 cursor-pointer"
            onClick={() => setShowTooltip(!showTooltip)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
          {showTooltip && (
            <span
              ref={tooltipRef}
              className="w-44 md:w-72 tooltip absolute top-full left-1/2 transform -translate-x-1/2 rounded-lg shadow-lg p-2 text-sm bg-black text-gray-400"
            >
              {tooltipText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Section;
