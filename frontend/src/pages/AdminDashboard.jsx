import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Check, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';

const AdminDashboard = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [needs, setNeeds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNeeds();
    }, []);

    const fetchNeeds = async () => {
        setLoading(true);
        try {
            const res = await api.get('/needs');
            setNeeds(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
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

    const handleDelete = async (id) => {
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
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Panel de Administración</h1>

            {loading ? <p>Cargando...</p> : (
                <>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {needs.map(need => (
                                    <tr key={need.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{need.title}</div>
                                            <div className="text-sm text-gray-500 truncate max-w-xs">{need.description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {need.status === 'FULFILLED' ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Completada
                                                </span>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                    Pendiente
                                                </span>
                                            )}
                                            {need.isVerified && (
                                                <div className="mt-1">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        Verificada
                                                    </span>
                                                    {need.verifiedBy && (
                                                        <div className="text-xs text-gray-400 mt-1">
                                                            Por: {need.verifiedBy.substring(0, 8)}...
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {need.category}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {need.commune}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                                            {!need.isVerified && (
                                                <button
                                                    onClick={() => handleVerify(need.id)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="Verificar"
                                                >
                                                    <CheckCircle size={20} />
                                                </button>
                                            )}
                                            {need.status !== 'FULFILLED' && (
                                                <button
                                                    onClick={() => onFulfillClick(need.id)}
                                                    className="text-green-600 hover:text-green-900"
                                                    title="Marcar como Completada"
                                                >
                                                    <Check size={20} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(need.id)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
