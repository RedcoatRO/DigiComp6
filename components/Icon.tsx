import React from 'react';

// Note: The 'icon' prop can now be a Lucide icon or a custom SVG component.
interface IconProps {
    icon: React.ComponentType<{ className?: string, size?: number }>;
    label: string;
    onClick: () => void;
}

const Icon: React.FC<IconProps> = ({ icon: IconComponent, label, onClick }) => (
    <button onDoubleClick={onClick} className="flex flex-col items-center justify-center w-24 h-24 p-2 rounded-md hover:bg-white/20 focus:bg-blue-500/50 focus:outline-none transition-colors group" aria-label={label}>
        <IconComponent className="drop-shadow-lg transition-transform group-hover:scale-110" size={48} />
        <p className="mt-2 text-sm text-white text-center font-medium drop-shadow-md whitespace-nowrap overflow-hidden text-ellipsis w-full">{label}</p>
    </button>
);

export default Icon;