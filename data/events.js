import { useState, useEffect } from "react";
import moment from "moment";

export const useEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const afterschoolEvents = [];
    const daysOfWeek = [1, 2, 3, 4]; // Monday, Tuesday, Wednesday, Thursday
    const startDate = moment().startOf("week").add(1, "day"); // Start from this week's Monday

    for (let i = 0; i < 52; i++) {
      // Create events for the next 52 weeks
      daysOfWeek.forEach((day) => {
        let start, end;

        if (day === 4) {
          // Thursday
          start = moment(startDate)
            .add(i, "weeks")
            .day(day)
            .set({ hour: 13, minute: 55 });
          end = moment(start).set({ hour: 17, minute: 30 });
        } else {
          start = moment(startDate)
            .add(i, "weeks")
            .day(day)
            .set({ hour: 14, minute: 45 });
          end = moment(start).set({ hour: 17, minute: 30 });
        }

        afterschoolEvents.push({
          id: `afterschool-${start.format("YYYY-MM-DD")}`,
          title: "Afterschool",
          start: start.toDate(),
          end: end.toDate(),
          type: "weekly",
        });
      });
    }

    setEvents(afterschoolEvents);
  }, []);

  const addEvent = (newEvent) => {
    const eventWithId = { ...newEvent, id: Date.now() };
    setEvents((prevEvents) => [...prevEvents, eventWithId]);
  };

  const updateEvent = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  const deleteEvent = (eventId) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId)
    );
  };

  const deleteAllEvents = () => {
    setEvents([]);
  };

  return { events, addEvent, updateEvent, deleteEvent, deleteAllEvents };
};
