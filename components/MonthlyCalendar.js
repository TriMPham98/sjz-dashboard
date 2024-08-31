import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';

export default function MonthlyCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="text-gray-300 hover:text-white">
          &lt; Prev
        </button>
        <h2 className="text-xl font-bold text-gray-100">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button onClick={nextMonth} className="text-gray-300 hover:text-white">
          Next &gt;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weekdays.map(day => (
          <div key={day} className="text-center font-bold text-gray-400">
            {day}
          </div>
        ))}
        {monthDays.map(day => (
          <div
            key={day.toString()}
            className={`
              p-2 text-center
              ${!isSameMonth(day, currentMonth) ? 'text-gray-600' : 'text-gray-300'}
              ${isToday(day) ? 'bg-blue-600 text-white rounded-full' : ''}
            `}
          >
            {format(day, 'd')}
          </div>
        ))}
      </div>
    </div>
  );
}