import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import api from '../services/api';

const OfferHelpModal = ({ need, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        type: 'MONEY',
        description: '',
        amount: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await api.post('/donations', {
                ...formData,
                needId: need.id,
                amount: formData.amount ? parseFloat(formData.amount) : null
            });
            setIsSuccess(true);
            // onSuccess call delayed until closing modal
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || 'Error al enviar la oferta de ayuda');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (isSuccess) onSuccess();
        onClose();
    };

    if (isSuccess) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-8 relative text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Gracias por tu ayuda!</h2>
                    <p className="text-gray-600 mb-6">
                        Tu ofrecimiento ha sido registrado. La persona que solicitó ayuda será notificada.
                    </p>
                    <button
                        onClick={handleClose}
                        className="w-full bg-indigo-600 text-white rounded py-2 font-medium hover:bg-indigo-700 transition"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-4">Ofrecer Ayuda</h2>
                <p className="text-gray-600 mb-6">
                    Estás ofreciendo ayuda para: <br />
                    <span className="font-semibold text-gray-800">{need.title}</span>
                </p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Tipo de Ayuda
                        </label>
                        <select
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="MONEY">Dinero / Aporte Económico</option>
                            <option value="GOODS">Bienes / Cosas Materiales</option>
                            <option value="SERVICE">Servicios / Voluntariado</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Descripción
                        </label>
                        <textarea
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                            rows="3"
                            placeholder="Detalla tu ayuda (ej: Puedo donar 10kg de arroz...)"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>

                    {formData.type === 'MONEY' && (
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Monto (CLP)
                            </label>
                            <input
                                type="number"
                                className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="Ej: 10000"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                required
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-medium ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Enviando...' : 'Confirmar Ayuda'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OfferHelpModal;
