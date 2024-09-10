import { useState, useEffect } from "react";
import moment from "moment";

export const useEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const allEvents = [];
    const afterschoolDays = [1, 2, 3, 4]; // Monday, Tuesday, Wednesday, Thursday
    const startDate = moment().startOf("week").add(1, "day"); // Start from this week's Monday

    for (let i = 0; i < 40; i++) {
      // Changed from 52 to 40 weeks
      // Create events for the next 40 weeks
      afterschoolDays.forEach((day) => {
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

        allEvents.push({
          id: `afterschool-${start.format("YYYY-MM-DD")}`,
          title: "Afterschool",
          start: start.toDate(),
          end: end.toDate(),
          type: "weekly",
        });
      });

      // Add Lunch events for Tuesdays
      const tuesdayLunchStart = moment(startDate)
        .add(i, "weeks")
        .day(2) // Tuesday
        .set({ hour: 12, minute: 27 });
      const tuesdayLunchEnd = moment(tuesdayLunchStart).set({
        hour: 13,
        minute: 2,
      });

      allEvents.push({
        id: `lunch-tuesday-${tuesdayLunchStart.format("YYYY-MM-DD")}`,
        title: "Lunch",
        start: tuesdayLunchStart.toDate(),
        end: tuesdayLunchEnd.toDate(),
        type: "weekly",
      });

      // Add Lunch events for Thursdays
      const thursdayLunchStart = moment(startDate)
        .add(i, "weeks")
        .day(4) // Thursday
        .set({ hour: 11, minute: 52 });
      const thursdayLunchEnd = moment(thursdayLunchStart).set({
        hour: 12,
        minute: 29,
      });

      allEvents.push({
        id: `lunch-thursday-${thursdayLunchStart.format("YYYY-MM-DD")}`,
        title: "Lunch",
        start: thursdayLunchStart.toDate(),
        end: thursdayLunchEnd.toDate(),
        type: "weekly",
      });
    }

    setEvents(allEvents);
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
