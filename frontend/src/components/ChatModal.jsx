import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Send, X, User as UserIcon, Loader } from 'lucide-react';

const ChatModal = ({ need, onClose }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchMessages = async () => {
        try {
            const res = await api.get(`/messages/need/${need.id}`);
            setMessages(res.data);
        } catch (err) {
            console.error('Error fetching messages:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, [need.id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const res = await api.post('/messages', {
                needId: need.id,
                content: newMessage
            });
            setMessages([...messages, res.data]);
            setNewMessage('');
        } catch (err) {
            console.error('Error sending message:', err);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col h-[600px] overflow-hidden">
                {/* Header */}
                <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-600 p-2 rounded-lg">
                            <UserIcon size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm leading-tight">Chat de Coordinación</h3>
                            <p className="text-[10px] text-gray-400 truncate w-48">Ref: {need.title}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition">
                        <X size={24} />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                    {loading ? (
                        <div className="flex justify-center py-10"><Loader className="animate-spin text-red-600" /></div>
                    ) : messages.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-400 text-sm">No hay mensajes aún.</p>
                            <p className="text-gray-400 text-[10px] px-10">Envía un mensaje para coordinar la entrega o solicitar más detalles.</p>
                        </div>
                    ) : (
                        messages.map((msg, index) => {
                            const isMine = msg.senderId === user?.id;
                            return (
                                <div key={msg.id || index} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm text-sm ${isMine
                                        ? 'bg-red-600 text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                        }`}>
                                        {!isMine && (
                                            <Link
                                                to={`/profile/${msg.senderId}`}
                                                className="font-black text-[9px] uppercase tracking-wider mb-1 text-red-600 block hover:underline"
                                            >
                                                {msg.sender?.name}
                                            </Link>
                                        )}
                                        <p className="leading-relaxed">{msg.content}</p>
                                        <p className={`text-[9px] mt-1 text-right ${isMine ? 'text-white/60' : 'text-gray-400'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                    <input
                        type="text"
                        placeholder="Escribe un mensaje..."
                        className="flex-grow bg-gray-100 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500 transition"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={sending}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="bg-red-600 text-white p-2 rounded-xl hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatModal;
