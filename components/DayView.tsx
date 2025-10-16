'use client';

import type { Appointment, Doctor, TimeSlot } from '@/types';
import React from 'react';

export function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const start = new Date(appointment.startTime);
  const end = new Date(appointment.endTime);

  const typeColor: Record<string, string> = {
    checkup: 'bg-blue-500 border-blue-600 text-white',
    consultation: 'bg-green-500 border-green-600 text-white',
    'follow-up': 'bg-orange-500 border-orange-600 text-white',
    procedure: 'bg-purple-500 border-purple-600 text-white',
  };

  return (
    <div
      className={`p-2 rounded-md text-xs border shadow-sm ${typeColor[appointment.type] || 'bg-gray-100 border-gray-300'}`}
    >
      <p className="font-semibold">{appointment.patientId}</p>
      <p className="capitalize">{appointment.type.replace('-', ' ')}</p>
      <p className="text-[11px] mt-1">
        {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} —{' '}
        {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  );
}

export function DayView({
  appointments,
  doctor,
  date,
}: {
  appointments: Appointment[];
  doctor: Doctor | undefined;
  date: Date;
}) {
  function generateTimeSlots(): TimeSlot[] {
    const slots: TimeSlot[] = [];
    for (let h = 8; h < 18; h++) {
      for (let m = 0; m < 60; m += 30) {
        const start = new Date(date);
        start.setHours(h, m, 0, 0);
        const end = new Date(start);
        end.setMinutes(end.getMinutes() + 30);
        const label = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        slots.push({ start, end, label });
      }
    }
    return slots;
  }

  function getAppointmentsForSlot(slot: TimeSlot) {
    return appointments.filter((a) => {
      const start = new Date(a.startTime);
      const end = new Date(a.endTime);
      return start < slot.end && end > slot.start;
    });
  }

  const timeSlots = generateTimeSlots();

  return (
    <div className="day-view space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{date.toDateString()}</h3>
        {doctor && <p className="text-sm text-gray-600">Dr. {doctor.name} — {doctor.specialty}</p>}
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {timeSlots.map((slot, i) => (
          <div key={i} className="flex border-b border-gray-100 hover:bg-gray-50 transition">
            <div className="w-24 p-2 text-xs text-gray-500 border-r">{slot.label}</div>
            <div className="flex-1 p-2 flex flex-wrap gap-2">
              {getAppointmentsForSlot(slot).map((a) => (
                <AppointmentCard key={a.id} appointment={a} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
