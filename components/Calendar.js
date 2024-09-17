import React, { useCallback } from "react";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Views,
} from "react-big-calendar";
import moment from "moment";
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
      backgroundColor: event.color ? `${event.color}80` : "#d4d4d480", // Add 80 for 50% opacity
      color: "#333",
      border: "none",
      fontSize: "0.8em", // Reduce font size to fit more text
      padding: "2px 4px", // Add some padding
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
  .rbc-month-view, .rbc-time-view {
    background-color: #f0f0f0;
  }
  .rbc-off-range-bg {
    background-color: #e8e8e8;
  }
  .rbc-today {
    background-color: #d8d8d8 !important;
  }
  .rbc-event {
    background-color: rgba(200, 200, 200, 0.5);
  }
  .rbc-event.rbc-selected {
    background-color: rgba(184, 184, 184, 0.5);
  }
  .rbc-day-bg + .rbc-day-bg, .rbc-month-row + .rbc-month-row {
    border-color: #ccc;
  }
  .rbc-header, .rbc-time-header-cell {
    color: #333;
  }
  .rbc-header {
    padding: 4px 0 16px;
    background-color: #e0e0e0;
  }
  .rbc-date-cell {
    padding: 4px;
  }
  .rbc-event-content {
    white-space: normal;
    overflow: visible;
    text-overflow: clip;
    font-weight: bold;
  }
`;

export default function Calendar({ events }) {
  const handleOnReady = useCallback((calendarApi) => {
    const now = new Date();
    calendarApi.scrollToTime(now);
  }, []);

  return (
    <>
      <style>{customCSS}</style>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="week"
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        onReady={handleOnReady}
        scrollToTime={new Date()}
        step={30}
        timeslots={1}
        {...calendarStyle}
      />
    </>
  );
}
