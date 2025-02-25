import React from "react";
import Calendar from "./Calendar";
import { useEvents } from "../data/events";

export default function Dashboard() {
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-indigo-50 rounded-lg p-6 shadow-sm border border-indigo-100">
          <h3 className="text-lg font-medium text-indigo-800 mb-2">Students</h3>
          <p className="text-3xl font-bold text-indigo-900">24</p>
          <p className="text-sm text-indigo-700 mt-1">+3 since last month</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-6 shadow-sm border border-green-100">
          <h3 className="text-lg font-medium text-green-800 mb-2">Upcoming Events</h3>
          <p className="text-3xl font-bold text-green-900">7</p>
          <p className="text-sm text-green-700 mt-1">Next: Jazz Workshop</p>
        </div>
        
        <div className="bg-amber-50 rounded-lg p-6 shadow-sm border border-amber-100">
          <h3 className="text-lg font-medium text-amber-800 mb-2">Practice Hours</h3>
          <p className="text-3xl font-bold text-amber-900">128</p>
          <p className="text-sm text-amber-700 mt-1">+12% this week</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Program Schedule</h2>
        <Calendar
          events={events}
          addEvent={addEvent}
          updateEvent={updateEvent}
          deleteEvent={deleteEvent}
        />
      </div>
    </div>
  );
}
