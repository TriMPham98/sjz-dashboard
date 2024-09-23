import React from "react";
import Calendar from "./Calendar";
import { useEvents } from "../data/events";

export default function Dashboard() {
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();

  return (
    <div className="bg-black text-white p-4">
      <div className="mb-8">
        {/* <h2 className="text-2xl font-bold mb-4 text-white">Program Schedule</h2> */}
        <div
          className="w-full"
          style={{
            padding: "16px",
            backgroundColor: "#222",
            borderRadius: "12px",
          }}>
          <Calendar
            events={events}
            addEvent={addEvent}
            updateEvent={updateEvent}
            deleteEvent={deleteEvent}
          />
        </div>
      </div>
      <div className="mt-8"></div>
    </div>
  );
}
