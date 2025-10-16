'use client';

import { useState } from 'react';
import type { CalendarView } from '@/types';
import { ScheduleView } from '@/components/ScheduleView';
import { MOCK_DOCTORS } from '@/data/mockData';

export default function SchedulePage() {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(MOCK_DOCTORS[0].id);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<CalendarView>('day');

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            Appointment Scheduler
          </h1>
          <p className="text-gray-600 text-lg">
            View and manage doctor appointments easily in day or week view.
          </p>
        </header>

        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition hover:shadow-xl">
          <ScheduleView />
        </div>
      </div>
    </main>
  );
}
