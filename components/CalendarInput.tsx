import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

interface CalendarInputProps {
    value: Date | null;
    onChange: (date: Date | null) => void;
    label: string;
    error?: string;
}

const CalendarInput: React.FC<CalendarInputProps> = ({ value, onChange, label, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDaySelect = (date: Date | undefined) => {
    onChange(date || null);
    setIsOpen(false);
  };

  const borderClass = error ? 'border-red-500' : (value ? 'border-green-500' : 'border-gray-300 dark:border-gray-600');

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <div className="relative">
        <button type="button" onClick={() => setIsOpen(!isOpen)} className={`w-full p-2.5 pr-10 border rounded-md shadow-sm transition-all text-left bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${borderClass}`}>
          {value ? format(value, 'PPP', { locale: ro }) : <span className="text-gray-400 dark:text-gray-500">Selectați data</span>}
        </button>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          {value && !error ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <CalendarIcon className={`h-5 w-5 ${error ? 'text-red-500' : 'text-gray-400'}`} />}
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {isOpen && (
        <div className="absolute z-10 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
          <DayPicker mode="single" selected={value || undefined} onSelect={handleDaySelect} locale={ro} disabled={{ before: new Date() }} initialFocus classNames={{ root: 'p-3', caption: 'flex justify-center py-2 mb-4 relative items-center', caption_label: 'text-sm font-medium text-gray-900 dark:text-gray-100', nav: 'flex items-center', nav_button: 'h-6 w-6 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-full', nav_button_previous: 'absolute left-1', nav_button_next: 'absolute right-1', table: 'w-full border-collapse', head_row: 'flex font-medium text-gray-900 dark:text-gray-100', head_cell: 'w-9 font-normal text-sm', row: 'flex w-full mt-2', cell: 'text-gray-600 dark:text-gray-300 rounded-full h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected])]:bg-gray-100 dark:[&:has([aria-selected])]:bg-gray-700/50 [&:has([aria-selected].day-outside)]:bg-accent/50', day: 'h-9 w-9 p-0 font-normal rounded-full hover:bg-gray-200 dark:hover:bg-gray-700', day_selected: 'bg-blue-600 text-white hover:bg-blue-700', day_today: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100', day_outside: 'text-gray-400 dark:text-gray-500', day_disabled: 'text-gray-400 dark:text-gray-500 opacity-50' }} />
        </div>
      )}
    </div>
  );
};

export default CalendarInput;
