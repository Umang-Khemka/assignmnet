'use client';

import { useState, useEffect, useRef } from 'react';
import type { Doctor } from '@/types';
import { MOCK_DOCTORS } from '@/data/mockData';

interface DoctorSelectorProps {
  selectedDoctorId: string;
  onDoctorChange: (doctorId: string) => void;
}

export function DoctorSelector({
  selectedDoctorId,
  onDoctorChange,
}: DoctorSelectorProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => setDoctors(MOCK_DOCTORS), []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);

  return (
    <div className="relative w-64" ref={dropdownRef}>
      <button
        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm hover:border-blue-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedDoctor
          ? `Dr. ${selectedDoctor.name} — ${selectedDoctor.specialty}`
          : 'Select Doctor...'}
      </button>

      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {doctors.map((doctor) => (
            <button
              key={doctor.id}
              onClick={() => {
                onDoctorChange(doctor.id);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 ${
                doctor.id === selectedDoctorId
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : ''
              }`}
            >
              Dr. {doctor.name} — {doctor.specialty}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
