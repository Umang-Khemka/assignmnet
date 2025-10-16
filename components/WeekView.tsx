'use client';

import type { Appointment, Doctor, TimeSlot } from '@/types';
import React, { useState } from 'react';
import { AppointmentCard } from './DayView';

export function WeekView({
  appointments,
  doctor,
  weekStartDate,
}: {
  appointments: Appointment[];
  doctor: Doctor | undefined;
  weekStartDate: Date;
}) {
  const [selectedDay, setSelectedDay] = useState(0);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStartDate);
    d.setDate(d.getDate() + i);
    return d;
  });

  const timeSlots: TimeSlot[] = [];
  for (let h = 8; h < 18; h++) {
    for (let m = 0; m < 60; m += 30) {
      const start = new Date();
      start.setHours(h, m, 0, 0);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + 30);
      const label = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      timeSlots.push({ start, end, label });
    }
  }

  const getAppointmentsForDay = (date: Date) =>
    appointments.filter((a) => {
      const s = new Date(a.startTime);
      return (
        s.getFullYear() === date.getFullYear() &&
        s.getMonth() === date.getMonth() &&
        s.getDate() === date.getDate()
      );
    });

  const getAppointmentsForDayAndSlot = (date: Date, slotStart: Date) => {
    const slotDateTime = new Date(date);
    slotDateTime.setHours(slotStart.getHours(), slotStart.getMinutes(), 0, 0);
    const slotEnd = new Date(slotDateTime.getTime() + 30 * 60 * 1000);

    return getAppointmentsForDay(date).filter((a) => {
      const s = new Date(a.startTime);
      const e = new Date(a.endTime);
      return s < slotEnd && e > slotDateTime;
    });
  };

  return (
    <div className="week-view">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Week View</h3>
        {doctor && <p className="text-sm text-gray-600">Dr. {doctor.name} — {doctor.specialty}</p>}
      </div>

      {/* Mobile Day Selector (visible on mobile only) */}
      <div className="md:hidden mb-4 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {weekDays.map((day, i) => (
            <button
              key={i}
              onClick={() => setSelectedDay(i)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedDay === i
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="font-semibold">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
              <div className="text-xs opacity-90">{day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Single Day View */}
      <div className="md:hidden border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gray-50 p-3 border-b">
          <div className="font-semibold text-gray-900">
            {weekDays[selectedDay].toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <div className="divide-y max-h-[600px] overflow-y-auto">
          {timeSlots.map((slot, i) => {
            const dayAppointments = getAppointmentsForDayAndSlot(weekDays[selectedDay], slot.start);
            return (
              <div key={i} className="flex hover:bg-gray-50 transition">
                <div className="w-20 flex-shrink-0 p-3 text-xs text-gray-500 bg-gray-50">
                  {slot.label}
                </div>
                <div className="flex-1 p-2 min-h-[50px]">
                  {dayAppointments.map((a) => (
                    <AppointmentCard key={a.id} appointment={a} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tablet & Desktop Full Week View */}
      <div className="hidden md:block overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="w-16 lg:w-20 p-2 text-xs bg-gray-50 border-r text-gray-600 sticky left-0 z-10">Time</th>
              {weekDays.map((day, i) => (
                <th key={i} className="p-2 text-xs bg-gray-50 border-l border-gray-200 text-gray-700 min-w-[120px] lg:min-w-[140px]">
                  <div className="font-semibold">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  <div className="text-gray-500">{day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot, i) => (
              <tr key={i} className="border-t hover:bg-gray-50 transition">
                <td className="p-2 text-xs text-gray-500 border-r bg-gray-50 sticky left-0 z-10">{slot.label}</td>
                {weekDays.map((day, j) => (
                  <td key={j} className="p-1 border-l align-top min-h-[50px]">
                    {getAppointmentsForDayAndSlot(day, slot.start).map((a) => (
                      <AppointmentCard key={a.id} appointment={a} />
                    ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {appointments.length === 0 && (
        <div className="mt-4 text-center text-gray-500 text-sm">
          No appointments scheduled for this week
        </div>
      )}
    </div>
  );
}