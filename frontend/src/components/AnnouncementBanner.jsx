import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { AlertTriangle, Info, AlertOctagon, X } from 'lucide-react';

const AnnouncementBanner = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [dismissed, setDismissed] = useState([]);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await api.get('/announcements');
                setAnnouncements(res.data);
            } catch (err) {
                console.error('Error fetching announcements:', err);
            }
        };

        fetchAnnouncements();
        const interval = setInterval(fetchAnnouncements, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    const handleDismiss = (id) => {
        setDismissed([...dismissed, id]);
        const dismissedList = JSON.parse(localStorage.getItem('dismissedAnnouncements') || '[]');
        localStorage.setItem('dismissedAnnouncements', JSON.stringify([...dismissedList, id]));
    };

    useEffect(() => {
        const dismissedList = JSON.parse(localStorage.getItem('dismissedAnnouncements') || '[]');
        setDismissed(dismissedList);
    }, []);

    const visibleAnnouncements = announcements.filter(a => !dismissed.includes(a.id));

    if (visibleAnnouncements.length === 0) return null;

    return (
        <div className="space-y-1">
            {visibleAnnouncements.map((ann) => {
                const styles = {
                    CRITICAL: 'bg-red-600 text-white',
                    WARNING: 'bg-amber-500 text-white',
                    INFO: 'bg-blue-600 text-white'
                };

                const icons = {
                    CRITICAL: <AlertOctagon size={20} className="animate-pulse" />,
                    WARNING: <AlertTriangle size={20} />,
                    INFO: <Info size={20} />
                };

                return (
                    <div key={ann.id} className={`${styles[ann.type]} px-4 py-3 flex justify-between items-center shadow-lg relative overflow-hidden`}>
                        {ann.type === 'CRITICAL' && (
                            <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none"></div>
                        )}
                        <div className="flex items-center gap-3 relative z-10">
                            {icons[ann.type]}
                            <div>
                                <strong className="font-black uppercase tracking-wider text-xs block mb-0.5 opacity-90">
                                    {ann.type === 'CRITICAL' ? '⚠️ ALERTA CRÍTICA' : ann.type === 'WARNING' ? 'Aviso Importante' : 'Información'}
                                </strong>
                                <p className="text-sm font-bold leading-tight">{ann.title}: <span className="font-normal opacity-95">{ann.content}</span></p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDismiss(ann.id)}
                            className="bg-black/20 hover:bg-black/40 p-1 rounded-full transition relative z-10"
                        >
                            <X size={18} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default AnnouncementBanner;
