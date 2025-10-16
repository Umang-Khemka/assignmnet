import { useState, useEffect, useMemo,useCallback } from 'react';
import type { Appointment, Doctor } from '@/types';
import { appointmentService } from '@/services/appointmentService';
import { startOfWeek, endOfWeek } from 'date-fns';

interface UseAppointmentsParams {
  doctorId: string;
  date: Date;
  startDate?: Date;
  endDate?: Date;
  view?: 'day' | 'week';
}

interface UseAppointmentsReturn {
  appointments: Appointment[];
  doctor: Doctor | undefined;
  loading: boolean;
  error: Error | null;
  refresh: () => void;
}

export function useAppointments(params: UseAppointmentsParams): UseAppointmentsReturn {
  const { doctorId, date, startDate, endDate, view = 'day' } = params;
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const doctor = useMemo(() => {
    if (!doctorId) return undefined;
    return appointmentService.getDoctorById(doctorId);
  }, [doctorId]);

  const fetchAppointments = useCallback(() => {
    if (!doctorId || !date) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let result: Appointment[] = [];

      if (view === 'week') {
        const start = startDate ?? startOfWeek(date, { weekStartsOn: 1 });
        const end = endDate ?? endOfWeek(date, { weekStartsOn: 1 });
        result = appointmentService.getAppointmentsByDoctorAndDateRange(doctorId, start, end);
      } else {
        result = appointmentService.getAppointmentsByDoctorAndDate(doctorId, date);
      }

      result = appointmentService.sortAppointmentsByTime(result);
      setAppointments(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error('Failed to fetch appointments'));
    } finally {
      setLoading(false);
    }
  }, [doctorId, date, startDate, endDate, view]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return {
    appointments,
    doctor,
    loading,
    error,
    refresh: fetchAppointments,
  };
}
