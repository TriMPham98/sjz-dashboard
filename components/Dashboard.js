import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

// Sample events - replace with your actual events
const events = [
  {
    start: new Date(),
    end: new Date(moment().add(1, "hours")),
    title: "Practice Session",
  },
  {
    start: new Date(moment().add(2, "days")),
    end: new Date(moment().add(2, "days").add(2, "hours")),
    title: "Band Rehearsal",
  },
];

export default function Dashboard() {
  return (
    <div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-100">
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
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-100">
          Practice Schedule
        </h2>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </div>
    </div>
  );
}
