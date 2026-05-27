import { useState, useEffect, useCallback } from 'react';
import * as calendarService from '../services/calendarService';

const toDateStr = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export const useCalendar = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    const data = await calendarService.getEvents();
    setEvents(data);
    setLoading(false);
  }, []);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  const goToPrevMonth = () =>
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));

  const goToNextMonth = () =>
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const goToToday = () => {
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(toDateStr(today));
  };

  const addEvent = async (eventData) => {
    const newEvent = await calendarService.addEvent(eventData);
    setEvents((prev) => [...prev, newEvent]);
    return newEvent;
  };

  const deleteEvent = async (id) => {
    await calendarService.deleteEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // Build the 6-row × 7-col grid for the current view month
  const getDaysInMonth = () => {
    const year  = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDayOfWeek  = new Date(year, month, 1).getDay();
    const totalDays       = new Date(year, month + 1, 0).getDate();
    const prevMonthDays   = new Date(year, month, 0).getDate();

    const days = [];

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month - 1, prevMonthDays - i), isCurrentMonth: false });
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }

    return days;
  };

  return {
    viewDate,
    today,
    todayStr: toDateStr(today),
    events,
    selectedDate,
    loading,
    setSelectedDate,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    addEvent,
    deleteEvent,
    getDaysInMonth,
  };
};
