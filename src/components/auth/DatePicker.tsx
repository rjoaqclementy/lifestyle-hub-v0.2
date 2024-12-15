import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => value ? new Date(value) : new Date());
  const [view, setView] = useState<'calendar' | 'month' | 'year'>('calendar');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate array of years (100 years back from current year)
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    onChange(newDate.toISOString().split('T')[0]);
    setShowCalendar(false);
  };

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
    setView('calendar');
  };

  const handleYearSelect = (year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setView('month');
  };

  const handleMonthChange = (increment: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  };

  const handleYearChange = (increment: number) => {
    setCurrentDate(new Date(currentDate.getFullYear() + increment, currentDate.getMonth(), 1));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8" />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = value === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
      days.push(
        <motion.button
          key={day}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleDateSelect(day)}
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm
                   transition-colors ${isSelected
                     ? 'bg-[#573cff] text-white'
                     : 'hover:bg-gray-700'
                   }`}
        >
          {day}
        </motion.button>
      );
    }

    return days;
  };

  const renderMonthPicker = () => {
    return (
      <div className="grid grid-cols-3 gap-2">
        {months.map((month, index) => {
          const isSelected = currentDate.getMonth() === index;
          return (
            <motion.button
              key={month}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMonthSelect(index)}
              className={`p-2 rounded-lg text-sm transition-colors ${
                isSelected ? 'bg-[#573cff] text-white' : 'hover:bg-gray-700'
              }`}
            >
              {month.slice(0, 3)}
            </motion.button>
          );
        })}
      </div>
    );
  };

  const renderYearPicker = () => {
    return (
      <div className="h-[280px] overflow-y-auto">
        <div className="grid grid-cols-3 gap-2">
          {years.map((year) => {
            const isSelected = currentDate.getFullYear() === year;
            return (
              <motion.button
                key={year}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleYearSelect(year)}
                className={`p-2 rounded-lg text-sm transition-colors ${
                  isSelected ? 'bg-[#573cff] text-white' : 'hover:bg-gray-700'
                }`}
              >
                {year}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="relative group">
        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#573cff] transition-colors" />
        <input
          type="text"
          value={value ? new Date(value).toLocaleDateString() : ''}
          onClick={() => setShowCalendar(true)}
          readOnly
          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 pl-10
                   focus:outline-none focus:ring-2 focus:ring-[#573cff]/50 focus:border-[#573cff]
                   transition-all duration-200 cursor-pointer group-hover:border-gray-600"
          placeholder="Select your birthday"
        />
        <div className="absolute inset-0 rounded-lg bg-[#573cff]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>

      <AnimatePresence>
        {showCalendar && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 mt-2 p-4 bg-gray-800 rounded-lg shadow-xl border border-gray-700 w-72"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              {view === 'calendar' && (
                <>
                  <button
                    onClick={() => handleMonthChange(-1)}
                    className="p-1 hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setView('month')}
                    className="hover:text-[#573cff] transition-colors"
                  >
                    {months[currentDate.getMonth()]}
                  </button>
                  <button
                    onClick={() => setView('year')}
                    className="hover:text-[#573cff] transition-colors"
                  >
                    {currentDate.getFullYear()}
                  </button>
                  <button
                    onClick={() => handleMonthChange(1)}
                    className="p-1 hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              {view === 'month' && (
                <>
                  <button
                    onClick={() => handleYearChange(-1)}
                    className="p-1 hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setView('year')}
                    className="hover:text-[#573cff] transition-colors"
                  >
                    {currentDate.getFullYear()}
                  </button>
                  <button
                    onClick={() => handleYearChange(1)}
                    className="p-1 hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              {view === 'year' && (
                <span className="font-medium">Select Year</span>
              )}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {view === 'calendar' && (
                  <>
                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                        <div key={day} className="text-xs text-gray-400">{day}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {renderCalendar()}
                    </div>
                  </>
                )}
                {view === 'month' && renderMonthPicker()}
                {view === 'year' && renderYearPicker()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DatePicker;