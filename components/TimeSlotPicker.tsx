import React from 'react';
import { TIME_SLOTS } from '../constants';

interface TimeSlotPickerProps {
    label: string;
    value: string;
    onChange: (time: string) => void;
    unavailableSlots: string[];
    error?: string;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ label, value, onChange, unavailableSlots, error }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {TIME_SLOTS.map(slot => {
                const isSelected = value === slot;
                const isUnavailable = unavailableSlots.includes(slot);
                const buttonClass = isSelected ? 'bg-blue-600 text-white' : isUnavailable ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900/50';
                return ( <button key={slot} type="button" onClick={() => !isUnavailable && onChange(slot)} disabled={isUnavailable} className={`p-2 text-sm font-medium rounded-md transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-blue-500 ${buttonClass}`}>{slot}</button>);
            })}
        </div>
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
);

export default TimeSlotPicker;
