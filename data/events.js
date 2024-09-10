import { useState, useEffect } from "react";
import moment from "moment";

export const useEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const allEvents = [];
    const afterschoolDays = [1, 2, 3, 4]; // Monday, Tuesday, Wednesday, Thursday
    const startDate = moment().startOf("week").add(1, "day"); // Start from this week's Monday

    for (let i = 0; i < 40; i++) {
      // Create events for the next 40 weeks
      afterschoolDays.forEach((day) => {
        let start;

        if (day === 4) {
          // Thursday
          start = moment(startDate)
            .add(i, "weeks")
            .day(day)
            .set({ hour: 13, minute: 55 });
        } else {
          start = moment(startDate)
            .add(i, "weeks")
            .day(day)
            .set({ hour: 14, minute: 45 });
        }

        // Set end time to 5:00 PM (17:00) for all afterschool events
        const end = moment(start).set({ hour: 17, minute: 0 });

        allEvents.push({
          id: `afterschool-${start.format("YYYY-MM-DD")}`,
          title: "Afterschool",
          start: start.toDate(),
          end: end.toDate(),
          type: "weekly",
          color: day === 4 ? "#2196F3" : "#4CAF50", // Blue for Thursday, Green for other days
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
        color: "#FFC107", // Amber for Tuesday lunch
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
        color: "#FF9800", // Orange for Thursday lunch
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
