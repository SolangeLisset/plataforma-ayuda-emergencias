import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { MessageCircle, Clock, CheckCircle, ChevronRight, Loader } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useConfig } from '../context/ConfigContext';
import ChatModal from '../components/ChatModal';

const Inbox = () => {
    const { config } = useConfig();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNeed, setSelectedNeed] = useState(null);

    const fetchConversations = async () => {
        try {
            const res = await api.get('/messages/user/conversations');
            setConversations(res.data);
        } catch (err) {
            console.error('Error fetching conversations:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations();
        const interval = setInterval(fetchConversations, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    const formatRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInSecs = Math.floor(diffInMs / 1000);
        const diffInMins = Math.floor(diffInSecs / 60);
        const diffInHours = Math.floor(diffInMins / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInSecs < 60) return 'Hace un momento';
        if (diffInMins < 60) return `Hace ${diffInMins} min`;
        if (diffInHours < 24) return `Hace ${diffInHours}h`;
        return `Hace ${diffInDays}d`;
    };

    return (
        <div className="container mx-auto px-4 py-6 max-w-3xl">
            <Helmet>
                <title>Mis Mensajes | {config.general.appName}</title>
            </Helmet>

            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                    <MessageCircle className="text-red-600" size={32} />
                    Mis Mensajes
                </h1>
                <p className="text-gray-500 mt-2">Gestiona tus coordinaciones de ayuda en curso.</p>
            </header>

            {loading && conversations.length === 0 ? (
                <div className="flex justify-center py-20">
                    <Loader className="animate-spin text-red-600" size={32} />
                </div>
            ) : conversations.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-100 shadow-sm">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="text-gray-300" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">No tienes mensajes aún</h3>
                    <p className="text-gray-500 max-w-xs mx-auto mt-2">Participa en una solicitud de ayuda o crea una propia para empezar a coordinar.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {conversations.map((conv) => (
                        <button
                            key={conv.needId}
                            onClick={() => setSelectedNeed({ id: conv.needId, title: conv.needTitle })}
                            className="bg-white border border-gray-100 hover:border-red-200 rounded-2xl p-5 text-left transition-all shadow-sm hover:shadow-md group flex items-start justify-between gap-4"
                        >
                            <div className="flex-grow min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${conv.needType === 'OFFER' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {conv.needType === 'OFFER' ? 'Ofrecimiento' : 'Necesidad'}
                                    </span>
                                    {conv.needStatus === 'FULFILLED' && (
                                        <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider">
                                            <CheckCircle size={10} /> Resuelto
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-base font-bold text-gray-900 truncate group-hover:text-red-600 transition-colors">
                                    {conv.needTitle}
                                </h3>

                                <p className="text-sm text-gray-500 mt-1 line-clamp-1 italic">
                                    {conv.lastMessage
                                        ? `${conv.lastSender || 'Usuario'}: ${conv.lastMessage}`
                                        : 'Sin mensajes todavía...'}
                                </p>

                                <div className="flex items-center gap-2 mt-3 text-[11px] text-gray-400 font-medium">
                                    <Clock size={12} />
                                    {formatRelativeTime(conv.updatedAt)}
                                </div>
                            </div>

                            <div className="flex-shrink-0 self-center">
                                <div className="bg-gray-50 p-2 rounded-full text-gray-300 group-hover:bg-red-50 group-hover:text-red-500 transition-all">
                                    <ChevronRight size={20} />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {selectedNeed && (
                <ChatModal
                    need={selectedNeed}
                    onClose={() => {
                        setSelectedNeed(null);
                        fetchConversations(); // Update previews on close
                    }}
                />
            )}
        </div>
    );
};

export default Inbox;
