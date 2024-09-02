import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useEvents } from "../data/events";

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const calendarStyle = {
  style: {
    height: 600,
    color: "white",
    backgroundColor: "black",
  },
  dayPropGetter: (date) => ({
    style: {
      backgroundColor: "black",
      color: "white",
      borderColor: "#333",
    },
  }),
  eventPropGetter: (event) => {
    let backgroundColor = "#333";
    switch (event.type) {
      case "weekly":
        backgroundColor = "#4a5568";
        break;
      case "holiday":
        backgroundColor = "#e53e3e";
        break;
      case "hourly":
        backgroundColor = "#38a169";
        break;
    }
    return {
      style: {
        backgroundColor,
        color: "white",
        border: "none",
      },
    };
  },
};

const customCSS = `
  .rbc-calendar {
    background-color: black;
  }
  .rbc-toolbar {
    background-color: #1a202c;
    color: white;
  }
  .rbc-toolbar button {
    color: white;
  }
  .rbc-toolbar button:hover {
    background-color: #2d3748;
  }
  .rbc-toolbar button:active, .rbc-toolbar button.rbc-active {
    background-color: #4a5568;
  }
  .rbc-month-view, .rbc-time-view, .rbc-agenda-view {
    background-color: black;
  }
  .rbc-off-range-bg {
    background-color: #1a202c;
  }
  .rbc-today {
    background-color: #2d3748 !important;
  }
  .rbc-event {
    background-color: #4a5568;
  }
  .rbc-event.rbc-selected {
    background-color: #718096;
  }
  .rbc-day-bg + .rbc-day-bg, .rbc-month-row + .rbc-month-row {
    border-color: #4a5568;
  }
  .rbc-header, .rbc-time-header-cell {
    color: white;
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
          Practice Schedule
        </h2>
        <div className="w-full">
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
        <h2 className="text-2xl font-bold mb-4 text-white">
          Songs We're Learning
        </h2>
        <iframe
          style={{ borderRadius: "12px" }}
          src="https://open.spotify.com/embed/playlist/5I4bxWhUVi9mj1Qpcb6CC5?utm_source=generator&theme=0"
          width="100%"
          height="500"
          frameBorder="0"
          allowFullScreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"></iframe>
      </div>
    </div>
  );
}
