import { useState } from "react";

export const useEvents = () => {
  const [events, setEvents] = useState([]);

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
