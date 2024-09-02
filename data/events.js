import { useState, useEffect } from "react";

// Fetch regular events
const fetchEvents = () => {
  return Promise.resolve([
    {
      id: 1,
      title: "Practice Session",
      start: new Date(2024, 8, 1), // September 1, 2024
      end: new Date(2024, 8, 1),
      type: "regular",
    },
    {
      id: 2,
      title: "Band Rehearsal",
      start: new Date(2024, 8, 3), // September 3, 2024
      end: new Date(2024, 8, 3),
      type: "regular",
    },
  ]);
};

// Fetch weekly schedules
const fetchWeeklySchedules = () => {
  return Promise.resolve([
    {
      id: 101,
      title: "Weekly Band Practice",
      daysOfWeek: [1, 3], // Monday and Wednesday
      startTime: "18:00",
      endTime: "20:00",
      type: "weekly",
    },
  ]);
};

// Fetch holidays
const fetchHolidays = () => {
  return Promise.resolve([
    {
      id: 201,
      title: "Labor Day",
      start: new Date(2024, 8, 2), // September 2, 2024
      end: new Date(2024, 8, 2),
      type: "holiday",
    },
  ]);
};

// Fetch hourly schedules
const fetchHourlySchedules = () => {
  return Promise.resolve([
    {
      id: 301,
      title: "Guitar Practice",
      start: new Date(2024, 8, 1, 14, 0), // September 1, 2024, 2:00 PM
      end: new Date(2024, 8, 1, 15, 0), // September 1, 2024, 3:00 PM
      type: "hourly",
    },
  ]);
};

export const useEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    Promise.all([
      fetchEvents(),
      fetchWeeklySchedules(),
      fetchHolidays(),
      fetchHourlySchedules(),
    ]).then(([regularEvents, weeklySchedules, holidays, hourlySchedules]) => {
      // Process weekly schedules to create recurring events
      const recurringEvents = weeklySchedules.flatMap((schedule) => {
        const events = [];
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 3); // Create events for the next 3 months

        for (
          let date = new Date(startDate);
          date <= endDate;
          date.setDate(date.getDate() + 1)
        ) {
          if (schedule.daysOfWeek.includes(date.getDay())) {
            const [startHour, startMinute] = schedule.startTime.split(":");
            const [endHour, endMinute] = schedule.endTime.split(":");
            events.push({
              id: `${schedule.id}-${date.toISOString()}`,
              title: schedule.title,
              start: new Date(date.setHours(startHour, startMinute)),
              end: new Date(date.setHours(endHour, endMinute)),
              type: "weekly",
            });
          }
        }
        return events;
      });

      setEvents([
        ...regularEvents,
        ...recurringEvents,
        ...holidays,
        ...hourlySchedules,
      ]);
    });
  }, []);

  const addEvent = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, { ...newEvent, id: Date.now() }]);
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

  return { events, addEvent, updateEvent, deleteEvent };
};
