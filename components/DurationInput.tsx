import { useState } from 'react';

interface DurationInputProps {
  onDurationChange: (duration: number) => void;
  initialDuration: number;
}

const DurationInput = ({ onDurationChange, initialDuration }: DurationInputProps) => {
    const [hours, setHours] = useState(Math.floor(initialDuration / 60).toString());
    const [minutes, setMinutes] = useState((initialDuration % 60).toString());

  const handleHoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hoursValue = event.target.value.replace(/\D/g, ''); // allow only digits
    setHours(hoursValue);
    updateDuration(hoursValue, minutes);
  };

  const handleMinutesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const minutesValue = event.target.value.replace(/\D/g, ''); // allow only digits
    setMinutes(minutesValue);
    updateDuration(hours, minutesValue);
  };

  const updateDuration = (hours: string, minutes: string) => {
    const hoursValue = hours === '' ? '0' : hours;
    const minutesValue = minutes === '' ? '0' : minutes;
    const duration = parseInt(hoursValue) * 60 + parseInt(minutesValue);
    onDurationChange(duration);
  };

  return (
    <div className="py-5">
      <label className="text-blue-300 font-bold text-3xl">Duration</label>
      <div className="flex items-center space-x-4">
        <input
          id="hours"
          type="text"
          pattern="[0-9]*"
          maxLength={2}
          className="form-control w-16 p-2 text-white block text-3xl outline-blue-300 bg-gray-700 rounded-lg"
          value={hours}
          onChange={handleHoursChange}
        />
        <span className="text-blue-300 font-bold text-3xl">hrs</span>
        <input
          id="minutes"
          type="text"
          pattern="[0-9]*"
          maxLength={2}
          className="form-control w-16 p-2 text-white block text-3xl outline-blue-300 bg-gray-700 rounded-lg"
          value={minutes}
          onChange={handleMinutesChange}
        />
        <span className="text-blue-300 font-bold text-3xl">mins</span>
      </div>
    </div>
  );
};

export default DurationInput;
