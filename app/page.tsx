"use client";

import { useState, useEffect } from "react";
import { MOCK_DOCTORS, MOCK_APPOINTMENTS } from "@/data/mockData";
import Link from "next/link";
import type { Doctor, Appointment } from "@/types";

export default function HomePage() {
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const doctor = MOCK_DOCTORS.find((d) => d.id === selectedDoctorId) || null;
    setSelectedDoctor(doctor);

    if (doctor) {
      const filteredAppointments = MOCK_APPOINTMENTS.filter(
        (apt) => apt.doctorId === doctor.id
      );
      setAppointments(filteredAppointments);
    } else {
      setAppointments([]);
    }
  }, [selectedDoctorId]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-blue-50 to-gray-100 py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-3xl w-full bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-10 transition-transform hover:scale-[1.01]">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-blue-800 mb-2 sm:mb-3">
          Hospital Appointment Scheduler
        </h1>
        <p className="text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-8 px-2">
          Select a doctor to view their details and upcoming appointments.
        </p>

        {/* Doctor Dropdown */}
        <div className="mb-6 sm:mb-8">
          <label className="block mb-2 font-semibold text-gray-700 text-sm sm:text-base">
            Choose a Doctor
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-2 text-sm sm:text-base text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
          >
            <option value="">-- Select Doctor --</option>
            {MOCK_DOCTORS.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                Dr. {doctor.name} — {doctor.specialty}
              </option>
            ))}
          </select>
        </div>

        {/* Doctor Info */}
        {selectedDoctor && (
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-blue-50 rounded-xl border border-blue-100">
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-900 mb-1">
              Dr. {selectedDoctor.name}
            </h2>
            <p className="text-sm sm:text-base text-blue-700 capitalize mb-2">
              Specialty: {selectedDoctor.specialty.replace("-", " ")}
            </p>

            {(() => {
              const today = new Date()
                .toLocaleDateString("en-US", { weekday: "long" })
                .toLowerCase() as keyof typeof selectedDoctor.workingHours;
              const hours = selectedDoctor.workingHours?.[today];
              return hours ? (
                <p className="text-xs sm:text-sm text-gray-700">
                  🕒 <span className="font-medium">Working Hours Today:</span>{" "}
                  {hours.start} - {hours.end}
                </p>
              ) : (
                <p className="text-xs sm:text-sm text-gray-600 italic">
                  No working hours set for today.
                </p>
              );
            })()}
          </div>
        )}

        {/* Appointments Preview */}
        {appointments.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
              Upcoming Appointments ({appointments.length})
            </h3>
            <ul className="space-y-2">
              {appointments.map((apt) => (
                <li
                  key={apt.id}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-3 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition gap-2 sm:gap-0"
                >
                  <div className="text-gray-800 text-xs sm:text-sm">
                    <p className="mb-1 sm:mb-0">
                      <span className="font-medium">Patient:</span> {apt.patientId}
                    </p>
                    <p>
                      <span className="font-medium">Type:</span> {apt.type}
                    </p>
                  </div>
                  <div className="text-left sm:text-right text-xs sm:text-sm text-gray-600">
                    {new Date(apt.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(apt.endTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Go to Schedule Button */}
        {selectedDoctor && (
          <Link
            href={`/schedule?doctorId=${selectedDoctor.id}`}
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 sm:py-3 rounded-lg shadow-md transition text-sm sm:text-base"
          >
            Go to Schedule →
          </Link>
        )}
      </div>
    </main>
  );
}