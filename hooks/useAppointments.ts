import { useState, useEffect, useCallback } from 'react';
import { Appointment, FormData } from '../types';
import { APPOINTMENTS_STORAGE_KEY } from '../constants';

export const useAppointments = () => {
    const [appointments, setAppointments] = useState<Appointment[]>(() => {
        try {
            const stored = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error("Error reading appointments from localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
        } catch (error)
        {
            console.error("Error saving appointments to localStorage", error);
        }
    }, [appointments]);

    const addAppointment = useCallback((formData: FormData) => {
        if (!formData.appointmentDate || !formData.identityDocument) return;

        const newAppointment: Appointment = {
            id: new Date().toISOString() + Math.random(),
            fullName: formData.fullName,
            cnp: formData.cnp,
            specialization: formData.specialization,
            doctor: formData.doctor,
            appointmentDate: formData.appointmentDate.toISOString(),
            appointmentTime: formData.appointmentTime,
            symptoms: formData.symptoms,
            identityDocumentName: formData.identityDocument.name,
        };
        setAppointments(prev => [...prev, newAppointment]);
    }, []);

    const cancelAppointment = useCallback((id: string) => {
        setAppointments(prev => prev.filter(app => app.id !== id));
    }, []);

    return { appointments, addAppointment, cancelAppointment };
};
