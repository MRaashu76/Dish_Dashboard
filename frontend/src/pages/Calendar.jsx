import { useState, useMemo } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  
  // Store notes keyed by "YYYY-MM-DD"
  const [notes, setNotes] = useLocalStorage("dish_dashboard_calendar_notes", {});

  const { daysInMonth, emptyCellsArray, monthName, year } = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    
    const firstDay = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();

    return {
      daysInMonth: Array.from({ length: days }, (_, i) => i + 1),
      emptyCellsArray: Array.from({ length: firstDay }, (_, i) => i),
      monthName: currentDate.toLocaleString("default", { month: "long" }),
      year: y
    };
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  // Helper to get the key for the currently selected date
  const selectedDateKey = selectedDate 
    ? `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`
    : null;

  const currentNote = selectedDateKey ? notes[selectedDateKey] || "" : "";

  const handleNoteChange = (e) => {
    if (!selectedDateKey) return;
    const val = e.target.value;
    if (val.trim() === "") {
      const newNotes = { ...notes };
      delete newNotes[selectedDateKey];
      setNotes(newNotes);
    } else {
      setNotes({ ...notes, [selectedDateKey]: val });
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto w-full flex flex-col lg:flex-row gap-8">
      {/* Left side: Calendar Grid */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{monthName} {year}</h1>
            <p className="text-gray-500 text-sm mt-1">Select a date to view or plan meals</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrevMonth} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">&lt;</button>
            <button onClick={handleNextMonth} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">&gt;</button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-7 border-b border-gray-100">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {emptyCellsArray.map(i => (
              <div key={`empty-${i}`} className="aspect-square border-r border-b border-gray-50 bg-gray-50/50" />
            ))}
            {daysInMonth.map(day => {
              const isSelected = day === selectedDate;
              const dateKey = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const hasNote = !!notes[dateKey];

              return (
                <div 
                  key={day} 
                  onClick={() => setSelectedDate(day)}
                  className={`aspect-square border-r border-b border-gray-50 p-2 cursor-pointer transition-colors relative flex items-center justify-center
                    ${isSelected ? "bg-brand-50" : "hover:bg-gray-50"}
                  `}
                >
                  <span className={`flex items-center justify-center w-8 h-8 text-sm rounded-full 
                    ${isSelected ? "bg-brand-500 text-white font-bold shadow-sm" : "text-gray-700"}
                  `}>
                    {day}
                  </span>
                  
                  {/* Indicator Dot */}
                  {hasNote && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-500" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right side: Instructions & Notes Panel */}
      <div className="w-full lg:w-80 flex flex-col shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-1 h-full">
          {!selectedDate ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
              <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mb-4 text-brand-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <p className="font-medium text-gray-800 mb-1">How to use the Calendar</p>
              <p className="text-sm">Click on any date in the grid to the left to add a meal plan, event, or reminder.</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {monthName} {selectedDate}, {year}
              </h2>
              <p className="text-sm text-gray-500 mb-6">Plan your meals or add a note for this day.</p>
              
              <label className="block text-sm font-semibold text-gray-700 mb-2">Daily Notes / Meal Plan</label>
              <textarea
                value={currentNote}
                onChange={handleNoteChange}
                placeholder="e.g., Dinner party at 7 PM. Prepare the Truffle Mushroom recipe!"
                className="w-full flex-1 min-h-[200px] p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none transition-shadow"
              />
              {currentNote && (
                <p className="text-xs text-brand-600 mt-3 font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Note automatically saved!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
