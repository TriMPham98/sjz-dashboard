import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

// Sample events - replace with your actual events
const events = [
  {
    start: new Date(2024, 8, 1), // September 1, 2024
    end: new Date(2024, 8, 1),
    title: "Practice Session",
  },
  {
    start: new Date(2024, 8, 3), // September 3, 2024
    end: new Date(2024, 8, 3),
    title: "Band Rehearsal",
  },
];

// Custom styling for the calendar
const calendarStyle = {
  style: {
    height: 500,
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
  eventPropGetter: () => ({
    style: {
      backgroundColor: "#333",
      color: "white",
      border: "none",
    },
  }),
};

// Custom CSS to override default styles
const customCSS = `
  .rbc-today {
    background-color: rgba(255, 255, 255, 0.2) !important;
    font-weight: bold;
  }
  .rbc-today .rbc-button-link {
    color: white !important;
  }
  .rbc-off-range-bg {
    background-color: #111 !important;
  }
  .rbc-header {
    background-color: #222;
    border-bottom: 1px solid #333;
  }
  .rbc-btn-group button {
    color: white;
    background-color: #333;
    border-color: #444;
  }
  .rbc-btn-group button:hover {
    background-color: #444;
  }
  .rbc-btn-group button.rbc-active {
    background-color: #555;
  }
  .rbc-month-view, .rbc-time-view, .rbc-agenda-view {
    border: 1px solid #333;
  }
  .rbc-month-row + .rbc-month-row {
    border-top: 1px solid #333;
  }
  .rbc-day-bg + .rbc-day-bg {
    border-left: 1px solid #333;
  }
`;

export default function Dashboard() {
  return (
    <div className="bg-black text-white">
      <style>{customCSS}</style>
      <div className="mt-8"></div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-white">
          Practice Schedule
        </h2>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          {...calendarStyle}
        />
        <div className="mt-8"></div>
        <h2 className="text-2xl font-bold mb-4 text-white">
          Songs We're Learning
        </h2>
        <iframe
          style={{ borderRadius: "12px" }}
          src="https://open.spotify.com/embed/playlist/5I4bxWhUVi9mj1Qpcb6CC5?utm_source=generator&theme=0"
          width="50%"
          height="500"
          frameBorder="0"
          allowFullScreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"></iframe>
      </div>
    </div>
  );
}
