'use client';

import { useState } from 'react';
import { DoctorSelector } from './DoctorSelector';
import { DayView } from './DayView';
import { WeekView } from './WeekView';
import { useAppointments } from '@/hooks/useAppointments';
import type { CalendarView } from '@/types';

export function ScheduleView() {
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('day');

  const { appointments, doctor } = useAppointments({
    doctorId: selectedDoctorId,
    date: selectedDate,
    view,
  });

  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay(); // Sunday = 0
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-100 p-6 bg-gradient-to-r from-blue-50 to-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">🩺 Doctor Schedule</h2>
            <p className="text-sm text-gray-600 mt-1">
              {doctor
                ? `Dr. ${doctor.name} — ${doctor.specialty}`
                : 'Select a doctor to view their schedule'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <DoctorSelector
              selectedDoctorId={selectedDoctorId}
              onDoctorChange={setSelectedDoctorId}
            />

            <input
              type="date"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
            />

            <div className="flex gap-2">
              {(['day', 'week'] as CalendarView[]).map((mode) => (
                <button
                  key={mode}
                  className={`px-4 py-2 text-sm rounded-lg transition font-medium ${
                    view === mode
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setView(mode)}
                >
                  {mode === 'day' ? 'Day View' : 'Week View'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="p-6">
        {!selectedDoctorId ? (
          <div className="text-center text-gray-500 py-12">
            Please select a doctor to view the schedule.
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No appointments scheduled for this {view}.
          </div>
        ) : view === 'day' ? (
          <DayView appointments={appointments} doctor={doctor} date={selectedDate} />
        ) : (
          <WeekView
            appointments={appointments}
            doctor={doctor}
            weekStartDate={getWeekStart(selectedDate)}
          />
        )}
      </div>
    </div>
  );
}
