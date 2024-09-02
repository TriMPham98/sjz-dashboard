import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useEvents } from "../data/events";

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const calendarStyle = {
  style: {
    height: 800,
    color: "#333",
    backgroundColor: "#f0f0f0",
  },
  dayPropGetter: () => ({
    style: {
      backgroundColor: "#f0f0f0",
      color: "#333",
      borderColor: "#ccc",
    },
  }),
  eventPropGetter: (event) => ({
    style: {
      backgroundColor:
        event.type === "weekly"
          ? "#d4d4d4"
          : event.type === "holiday"
          ? "#e0e0e0"
          : event.type === "hourly"
          ? "#c8c8c8"
          : "#dcdcdc",
      color: "#333",
      border: "none",
    },
  }),
};

const customCSS = `
  .rbc-calendar {
    background-color: #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
  }
  .rbc-toolbar {
    background-color: #e0e0e0;
    color: #333;
  }
  .rbc-toolbar button {
    color: #333;
  }
  .rbc-toolbar button:hover {
    background-color: #d0d0d0;
  }
  .rbc-toolbar button:active, .rbc-toolbar button.rbc-active {
    background-color: #c0c0c0;
  }
  .rbc-month-view, .rbc-time-view, .rbc-agenda-view {
    background-color: #f0f0f0;
  }
  .rbc-off-range-bg {
    background-color: #e8e8e8;
  }
  .rbc-today {
    background-color: #d8d8d8 !important;
  }
  .rbc-event {
    background-color: #c8c8c8;
  }
  .rbc-event.rbc-selected {
    background-color: #b8b8b8;
  }
  .rbc-day-bg + .rbc-day-bg, .rbc-month-row + .rbc-month-row {
    border-color: #ccc;
  }
  .rbc-header, .rbc-time-header-cell {
    color: #333;
  }
  .rbc-header {
    padding: 4px 0;
    background-color: #e0e0e0;
  }
  .rbc-date-cell {
    padding: 4px;
  }
`;

export default function Dashboard() {
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();

  const handleSelectSlot = ({ start, end }) => {
    const title = window.prompt("New Event name");
    if (title) {
      addEvent({ start, end, title, type: "regular" });
    }
  };

  const handleSelectEvent = (event) => {
    const action = window.prompt(
      'Enter "edit" to edit, or "delete" to remove',
      "edit"
    );
    if (action === "edit") {
      const title = window.prompt("Enter new title", event.title);
      if (title) {
        updateEvent({ ...event, title });
      }
    } else if (action === "delete") {
      deleteEvent(event.id);
    }
  };

  return (
    <div className="bg-black text-white p-4">
      <style>{customCSS}</style>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-white">
          Program Schedule
        </h2>
        <div
          className="w-full"
          style={{
            padding: "16px",
            backgroundColor: "#222",
            borderRadius: "12px",
          }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            selectable
            {...calendarStyle}
          />
        </div>
      </div>
      <div className="mt-8">
      </div>
    </div>
  );
}
