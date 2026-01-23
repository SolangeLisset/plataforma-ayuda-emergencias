import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Check, Trash2, CheckCircle, AlertCircle, Megaphone, Send, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';

const AdminDashboard = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [needs, setNeeds] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('needs');

    const [newAnnouncement, setNewAnnouncement] = useState({
        title: '',
        content: '',
        type: 'INFO'
    });

    useEffect(() => {
        fetchNeeds();
        fetchAnnouncements();
    }, []);

    const fetchNeeds = async () => {
        try {
            const res = await api.get('/needs');
            setNeeds(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            if (activeTab === 'needs') setLoading(false);
        }
    };

    const fetchAnnouncements = async () => {
        try {
            const res = await api.get('/announcements');
            setAnnouncements(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAnnouncement = async (e) => {
        e.preventDefault();
        try {
            await api.post('/announcements', newAnnouncement);
            showToast('Anuncio publicado con éxito', 'success');
            setNewAnnouncement({ title: '', content: '', type: 'INFO' });
            fetchAnnouncements();
        } catch (err) {
            showToast('Error al publicar anuncio', 'error');
        }
    };

    const handleDeleteAnnouncement = async (id) => {
        if (!window.confirm('¿Eliminar este anuncio?')) return;
        try {
            await api.delete(`/announcements/${id}`);
            showToast('Anuncio eliminado', 'success');
            fetchAnnouncements();
        } catch (err) {
            showToast('Error al eliminar anuncio', 'error');
        }
    };

    const handleVerify = async (id) => {
        if (!window.confirm('¿Confirmar que esta solicitud es real?')) return;
        try {
            await api.put(`/needs/${id}`, { isVerified: true });
            showToast('Solicitud verificada', 'success');
            fetchNeeds();
        } catch (err) {
            showToast('Error al verificar', 'error');
        }
    };

    const fileInputRef = React.useRef(null);
    const [actionNeedId, setActionNeedId] = useState(null);

    const handleFulfill = async (id, file = null) => {
        try {
            const formData = new FormData();
            formData.append('status', 'FULFILLED');

            if (file) {
                const options = {
                    maxSizeMB: 0.2, // 200KB
                    maxWidthOrHeight: 1280,
                    useWebWorker: true
                };
                try {
                    const compressedFile = await imageCompression(file, options);
                    formData.append('evidence', compressedFile);
                } catch (err) {
                    console.error('Compression error:', err);
                    formData.append('evidence', file); // Fallback
                }
            }

            await api.put(`/needs/${id}`, formData);
            showToast('Ayuda marcada como completada', 'success');
            fetchNeeds();
        } catch (err) {
            showToast('Error al actualizar estado', 'error');
            console.error(err);
        }
    };

    const onFulfillClick = (id) => {
        if (window.confirm('¿Deseas completar esta solicitud? \n\nAcepta para completar (te preguntaremos si tienes foto).\nCancela para salir.')) {
            if (window.confirm('¿Tienes una foto de evidencia/entrega? (Opcional)')) {
                setActionNeedId(id);
                fileInputRef.current.click();
            } else {
                handleFulfill(id, null);
            }
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files[0] && actionNeedId) {
            handleFulfill(actionNeedId, e.target.files[0]);
        }
        setActionNeedId(null);
        e.target.value = '';
    };

    const handleDeleteNeed = async (id) => {
        if (!window.confirm('¿Eliminar permanentemente? Esta acción no se puede deshacer.')) return;
        try {
            await api.delete(`/needs/${id}`);
            showToast('Solicitud eliminada', 'success');
            setNeeds(needs.filter(n => n.id !== id));
        } catch (err) {
            showToast('Error al eliminar', 'error');
        }
    };

    if (!user || user.role !== 'ADMIN') {
        return <div className="p-10 text-center text-red-600">Acceso Denegado. Se requieren permisos de Administrador.</div>;
    }

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Panel de Control</h1>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('needs')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'needs' ? 'bg-white shadow-sm text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Gestión de Ayuda
                    </button>
                    <button
                        onClick={() => setActiveTab('announcements')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${activeTab === 'announcements' ? 'bg-white shadow-sm text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Megaphone size={16} /> Anuncios Globales
                    </button>
                </div>
            </header>

            {loading ? <p className="text-center py-10">Cargando...</p> : (
                <div className="space-y-6">
                    {activeTab === 'needs' ? (
                        <>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-100">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Solicitud</th>
                                            <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Estado</th>
                                            <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Ubicación</th>
                                            <th className="px-6 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {needs.map(need => (
                                            <tr key={need.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-bold text-gray-900">{need.title}</div>
                                                    <div className="text-[11px] text-gray-500 uppercase font-black tracking-wider flex items-center gap-1.5 mt-1">
                                                        <span className={need.type === 'OFFER' ? 'text-green-600' : 'text-red-600'}>{need.category}</span>
                                                        <span className="text-gray-300">•</span>
                                                        <span>{need.type === 'OFFER' ? 'Ofrecimiento' : 'Necesidad'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className={`px-2 py-0.5 inline-flex text-[10px] font-black uppercase tracking-wider rounded-full ${need.status === 'FULFILLED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                            {need.status === 'FULFILLED' ? 'Completada' : 'Pendiente'}
                                                        </span>
                                                        {need.isVerified && (
                                                            <span className="px-2 py-0.5 inline-flex text-[10px] font-black uppercase tracking-wider rounded-full bg-blue-100 text-blue-700">
                                                                Verificada
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                                    {need.commune}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3">
                                                    {!need.isVerified && (
                                                        <button onClick={() => handleVerify(need.id)} className="text-blue-500 hover:text-blue-700 transition" title="Verificar"><CheckCircle size={20} /></button>
                                                    )}
                                                    {need.status !== 'FULFILLED' && (
                                                        <button onClick={() => onFulfillClick(need.id)} className="text-green-500 hover:text-green-700 transition" title="Marcar como Completada"><Check size={20} /></button>
                                                    )}
                                                    <button onClick={() => handleDeleteNeed(need.id)} className="text-gray-300 hover:text-red-600 transition" title="Eliminar"><Trash2 size={20} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Create Form */}
                            <div className="md:col-span-1">
                                <form onSubmit={handleCreateAnnouncement} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 sticky top-4">
                                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Megaphone size={20} className="text-red-600" />
                                        Nuevo Anuncio
                                    </h2>
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Tipo de Alerta</label>
                                        <select
                                            className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none font-bold"
                                            value={newAnnouncement.type}
                                            onChange={e => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                                        >
                                            <option value="INFO">Información (Azul)</option>
                                            <option value="WARNING">Advertencia (Amarillo)</option>
                                            <option value="CRITICAL">Urgente / Crítico (Rojo)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Título Corto</label>
                                        <input
                                            type="text"
                                            className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none"
                                            placeholder="Ej: Evacuación Sector Las Lomas"
                                            value={newAnnouncement.title}
                                            onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Mensaje</label>
                                        <textarea
                                            className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none h-24"
                                            placeholder="Detalles sobre el anuncio..."
                                            value={newAnnouncement.content}
                                            onChange={e => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-red-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition"
                                    >
                                        <Send size={18} /> Publicar Ahora
                                    </button>
                                </form>
                            </div>

                            {/* List of active announcements */}
                            <div className="md:col-span-2 space-y-4">
                                <h2 className="text-lg font-bold text-gray-800">Anuncios Activos</h2>
                                {announcements.length === 0 ? (
                                    <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                        <p className="text-gray-400 text-sm">No hay anuncios publicados.</p>
                                    </div>
                                ) : (
                                    announcements.map(ann => (
                                        <div key={ann.id} className={`p-5 rounded-2xl border flex items-start justify-between gap-4 ${ann.type === 'CRITICAL' ? 'bg-red-50 border-red-100' :
                                            ann.type === 'WARNING' ? 'bg-amber-50 border-amber-100' : 'bg-blue-50 border-blue-100'
                                            }`}>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${ann.type === 'CRITICAL' ? 'text-red-700' :
                                                        ann.type === 'WARNING' ? 'text-amber-700' : 'text-blue-700'
                                                        }`}>
                                                        {ann.type}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400">•</span>
                                                    <span className="text-[10px] text-gray-400">{new Date(ann.createdAt).toLocaleString()}</span>
                                                </div>
                                                <h4 className="font-bold text-gray-900">{ann.title}</h4>
                                                <p className="text-sm text-gray-700 mt-1">{ann.content}</p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteAnnouncement(ann.id)}
                                                className="text-gray-400 hover:text-red-600 p-1"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
