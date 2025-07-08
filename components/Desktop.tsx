import React from 'react';
import Icon from './Icon';
import AppointmentIcon from './icons/AppointmentIcon';
import MonitorIcon from './icons/MonitorIcon';
import TrashIcon from './icons/TrashIcon';

interface DesktopProps {
    onOpenAppointment: () => void;
}

const Desktop: React.FC<DesktopProps> = ({ onOpenAppointment }) => (
    <>
        {/* Background badge, non-interactive */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <div className="text-center transform -rotate-3 opacity-20 dark:opacity-15">
                <div className="relative font-black text-black dark:text-white text-[8rem] sm:text-[10rem] leading-none drop-shadow-lg">
                    <h1 className="tracking-tighter">Verified</h1>
                    {/* The green checkmark overlays the 'V' */}
                    <span className="absolute top-1/2 left-0 -translate-y-1/2 text-green-500" style={{ fontSize: '1.2em' }}>✓</span>
                </div>
                <p className="font-bold text-xl sm:text-2xl tracking-[0.2em] text-black dark:text-white mt-2 drop-shadow-md">
                    DIGITAL SKILLS
                </p>
            </div>
        </div>

        {/* Desktop icons, interactive */}
        <div className="absolute top-0 left-0 p-4 grid grid-cols-1 gap-4">
            <Icon icon={AppointmentIcon} label="Programare Medicală" onClick={onOpenAppointment}/>
            <Icon icon={MonitorIcon} label="Acest PC" onClick={() => alert("Această funcționalitate nu este implementată.")}/>
            <Icon icon={TrashIcon} label="Coș de gunoi" onClick={() => alert("Această funcționalitate nu este implementată.")}/>
        </div>
    </>
);

export default Desktop;